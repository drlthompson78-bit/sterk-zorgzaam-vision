import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/*
 * Beheer van portaalaccounts. Alleen een beheerder mag deze functies gebruiken:
 * de rol wordt server-side gecontroleerd via de sessie van de aanroeper, pas
 * daarna wordt de admin-client geladen.
 */

async function vereisBeheerder(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profielen")
    .select("rol")
    .eq("id", userId)
    .maybeSingle();
  if (error || data?.rol !== "beheerder") {
    throw new Error("Geen beheerdersrechten.");
  }
}

export type PortaalGebruiker = {
  id: string;
  email: string;
  naam: string;
  rol: string;
  laatsteAanmelding: string | null;
  bevestigd: boolean;
};

export const gebruikersLijst = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortaalGebruiker[]> => {
    await vereisBeheerder(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: auth, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    const { data: profielen } = await supabaseAdmin.from("profielen").select("id, naam, rol");
    const perId = new Map((profielen ?? []).map((p) => [p.id, p]));

    return auth.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      naam: perId.get(u.id)?.naam || ((u.user_metadata?.["naam"] as string) ?? ""),
      rol: perId.get(u.id)?.rol ?? "auditor",
      laatsteAanmelding: u.last_sign_in_at ?? null,
      bevestigd: Boolean(u.email_confirmed_at ?? u.confirmed_at),
    }));
  });

export const gebruikerUitnodigen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        email: z.string().email(),
        naam: z.string().max(120).optional(),
        rol: z.enum(["auditor", "beheerder"]).default("auditor"),
        wachtwoord: z.string().min(8).max(72).optional(),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    await vereisBeheerder(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const nieuw = data.wachtwoord
      ? await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.wachtwoord,
          email_confirm: true,
          user_metadata: { naam: data.naam ?? "" },
        })
      : await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
          data: { naam: data.naam ?? "" },
        });

    if (nieuw.error) throw new Error(nieuw.error.message);
    const id = nieuw.data.user?.id;
    if (id) {
      await supabaseAdmin
        .from("profielen")
        .upsert({ id, naam: data.naam ?? "", rol: data.rol }, { onConflict: "id" });
    }
    return { ok: true, uitgenodigd: !data.wachtwoord };
  });

export const rolWijzigen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid(), rol: z.enum(["auditor", "beheerder"]) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    await vereisBeheerder(context.supabase, context.userId);
    if (data.id === context.userId && data.rol !== "beheerder") {
      throw new Error("Je kunt je eigen beheerdersrol niet intrekken.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profielen")
      .upsert({ id: data.id, rol: data.rol }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const gebruikerVerwijderen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    await vereisBeheerder(context.supabase, context.userId);
    if (data.id === context.userId) throw new Error("Je kunt je eigen account niet verwijderen.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
