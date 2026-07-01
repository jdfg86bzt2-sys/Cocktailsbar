CREATE TABLE suggestions_producteurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id uuid REFERENCES auth.users NOT NULL,
  nom text NOT NULL,
  site_web text,
  message text,
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'accepte', 'refuse')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suggestions_producteurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can insert suggestions" ON suggestions_producteurs
  FOR INSERT TO authenticated WITH CHECK (utilisateur_id = auth.uid());

CREATE POLICY "users can see own suggestions" ON suggestions_producteurs
  FOR SELECT TO authenticated USING (utilisateur_id = auth.uid());

CREATE POLICY "barmans can see all suggestions" ON suggestions_producteurs
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'barman')
  );

CREATE POLICY "barmans can update suggestions" ON suggestions_producteurs
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'barman')
  );
