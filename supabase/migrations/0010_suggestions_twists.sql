CREATE TABLE suggestions_twists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id uuid REFERENCES auth.users NOT NULL,
  cocktail_origine_id uuid REFERENCES cocktails NOT NULL,
  nom text NOT NULL,
  description text,
  technique text,
  photo_url text,
  ingredients jsonb DEFAULT '[]',
  etapes jsonb DEFAULT '[]',
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'accepte', 'refuse')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suggestions_twists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can insert twist suggestions" ON suggestions_twists
  FOR INSERT TO authenticated WITH CHECK (utilisateur_id = auth.uid());

CREATE POLICY "users can see own twist suggestions" ON suggestions_twists
  FOR SELECT TO authenticated USING (utilisateur_id = auth.uid());

CREATE POLICY "admins can see all twist suggestions" ON suggestions_twists
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "admins can update twist suggestions" ON suggestions_twists
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
