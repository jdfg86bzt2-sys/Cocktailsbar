CREATE TABLE IF NOT EXISTS public.favoris (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cocktail_id uuid NOT NULL REFERENCES public.cocktails(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, cocktail_id)
);

ALTER TABLE public.favoris ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favoris" ON public.favoris
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Favoris are publicly readable" ON public.favoris
  FOR SELECT TO public
  USING (true);
