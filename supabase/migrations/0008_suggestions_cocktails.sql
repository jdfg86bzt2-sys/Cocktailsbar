CREATE TABLE suggestions_cocktails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id uuid REFERENCES auth.users NOT NULL,
  nom text NOT NULL,
  description text,
  categorie_alcool text,
  technique text,
  type_verre text,
  tags_gout text[] DEFAULT '{}',
  demande_signature boolean DEFAULT false,
  photo_url text,
  ingredients jsonb DEFAULT '[]',
  etapes jsonb DEFAULT '[]',
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'accepte', 'refuse')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suggestions_cocktails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can insert cocktail suggestions" ON suggestions_cocktails
  FOR INSERT TO authenticated WITH CHECK (utilisateur_id = auth.uid());

CREATE POLICY "users can see own cocktail suggestions" ON suggestions_cocktails
  FOR SELECT TO authenticated USING (utilisateur_id = auth.uid());

CREATE POLICY "admins can see all cocktail suggestions" ON suggestions_cocktails
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "admins can update cocktail suggestions" ON suggestions_cocktails
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
