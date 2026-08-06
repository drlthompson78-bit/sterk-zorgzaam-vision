import { supabase as client } from "@/integrations/supabase/client";

/*
 * Verbinding met de Lovable Cloud backend (accounts + bestandsopslag van het
 * documentenportaal). De client zelf wordt gegenereerd in
 * src/integrations/supabase/client.ts — hier staat alleen wat de app extra nodig heeft.
 */

export const supabase = client;
export const supabaseGekoppeld = true;

export const BUCKET = "documenten";

/** Nederlandse tekst bij de foutmeldingen die de backend teruggeeft. */
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
  if (/invalid totp|invalid code|challenge/i.test(bericht)) {
    return "Die verificatiecode klopt niet of is verlopen.";
  }
  return "Inloggen lukte niet. Probeer het opnieuw of neem contact op.";
}
