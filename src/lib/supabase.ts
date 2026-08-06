import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
 * Verbinding met Supabase (accounts + bestandsopslag van het documentenportaal).
 *
 * De sleutels komen uit omgevingsvariabelen die Lovable zet bij het koppelen
 * van Supabase. De namen verschillen per Lovable-versie, dus we accepteren de
 * gangbare varianten. Dit is de publieke sleutel — die hoort in de frontend en
 * geeft op zichzelf geen toegang: alle rechten liggen bij de regels op de
 * database (zie supabase/setup.sql).
 */

const env = import.meta.env as Record<string, string | undefined>;

const url = env.VITE_SUPABASE_URL;
const sleutel =
  env.VITE_SUPABASE_ANON_KEY ??
  env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/** Null zolang Supabase nog niet gekoppeld is; het portaal toont dan uitleg. */
export const supabase: SupabaseClient | null =
  url && sleutel
    ? createClient(url, sleutel, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;

export const supabaseGekoppeld = supabase !== null;

export const BUCKET = "documenten";

/** Nederlandse tekst bij de foutmeldingen die Supabase teruggeeft. */
export function inlogFout(bericht: string) {
  if (/invalid login credentials/i.test(bericht)) {
    return "E-mailadres of wachtwoord klopt niet.";
  }
  if (/email not confirmed/i.test(bericht)) {
    return "Dit account is nog niet bevestigd. Kijk in je mailbox.";
  }
  if (/too many requests|rate limit/i.test(bericht)) {
    return "Te veel pogingen. Probeer het over een paar minuten opnieuw.";
  }
  return "Inloggen lukte niet. Probeer het opnieuw of neem contact op.";
}
