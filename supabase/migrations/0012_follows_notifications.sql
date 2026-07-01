-- Système de suivi
CREATE TABLE follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users NOT NULL,
  following_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own follows" ON follows
  FOR ALL TO authenticated USING (follower_id = auth.uid()) WITH CHECK (follower_id = auth.uid());

CREATE POLICY "follows are visible to all" ON follows
  FOR SELECT TO authenticated USING (true);

-- Notifications in-app
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destinataire_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  message text NOT NULL,
  lien text,
  lu boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own notifications" ON notifications
  FOR SELECT TO authenticated USING (destinataire_id = auth.uid());

CREATE POLICY "users update own notifications" ON notifications
  FOR UPDATE TO authenticated USING (destinataire_id = auth.uid());

CREATE POLICY "admins can insert notifications" ON notifications
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
