CREATE TABLE public.deellinks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  pad text NOT NULL,
  aangemaakt_door uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users (id) ON DELETE CASCADE,
  vervalt timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.deellinks TO authenticated;
GRANT ALL ON public.deellinks TO service_role;

ALTER TABLE public.deellinks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eigen deellink aanmaken" ON public.deellinks
  FOR INSERT TO authenticated
  WITH CHECK (aangemaakt_door = auth.uid());

CREATE POLICY "eigen deellinks lezen" ON public.deellinks
  FOR SELECT TO authenticated
  USING (aangemaakt_door = auth.uid() OR prive.is_beheerder());

CREATE POLICY "eigen deellinks verwijderen" ON public.deellinks
  FOR DELETE TO authenticated
  USING (aangemaakt_door = auth.uid() OR prive.is_beheerder());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_deellinks_updated_at
  BEFORE UPDATE ON public.deellinks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();