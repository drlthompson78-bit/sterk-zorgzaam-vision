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

        return new Response(null, { status: 302, headers: { Location: data.signedUrl } });
      },
    },
  },
});
