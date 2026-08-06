import { createFileRoute } from "@tanstack/react-router";

/*
 * Korte deel-link: /api/public/d/<code> zoekt het bestand op en stuurt de
 * bezoeker door naar een tijdelijke downloadlink van de opslag.
 */

export const Route = createFileRoute("/api/public/d/$code")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: link } = await supabaseAdmin
          .from("deellinks")
          .select("pad, vervalt")
          .eq("code", params.code)
          .maybeSingle();

        if (!link) {
          return new Response("Deze koppeling bestaat niet.", { status: 404 });
        }
        if (new Date(link.vervalt).getTime() < Date.now()) {
          return new Response("Deze koppeling is verlopen.", { status: 410 });
        }

        const bestandsnaam = link.pad.split("/").pop() ?? "bestand";
        const { data, error } = await supabaseAdmin.storage
          .from("documenten")
          .createSignedUrl(link.pad, 60, { download: bestandsnaam });

        if (error || !data) {
          return new Response("Het bestand kon niet worden opgehaald.", { status: 500 });
        }

        /* Vastleggen dát de koppeling gebruikt is. Zonder inloggen weten we
           niet wie het ophaalde, maar wél welk document wanneer — dat is wat
           een auditor moet kunnen zien. Mislukt het logboek, dan mag de
           download daar niet op stuklopen. */
        try {
          /* De typedefinities worden opnieuw gegenereerd zodra de migratie is
             uitgevoerd; tot die tijd kent dit bestand de tabel nog niet. */
          const logboek = supabaseAdmin as unknown as {
            from: (tabel: string) => { insert: (waarde: unknown) => Promise<unknown> };
          };
          await logboek.from("deellink_gebruik").insert({ code: params.code, pad: link.pad });
        } catch {
          /* logboek nog niet aangemaakt: geen reden om de download te blokkeren */
        }

        return new Response(null, { status: 302, headers: { Location: data.signedUrl } });
      },
    },
  },
});
