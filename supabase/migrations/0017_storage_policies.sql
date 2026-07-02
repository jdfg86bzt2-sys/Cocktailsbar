-- Politique : tout le monde peut lire les images publiques
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-images', 'public-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Permettre aux utilisateurs authentifiés d'uploader leurs recréations
CREATE POLICY IF NOT EXISTS "Authenticated users can upload recreations"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'public-images' AND name LIKE 'recreations/%');

-- Permettre aux utilisateurs de remplacer leurs propres recréations
CREATE POLICY IF NOT EXISTS "Authenticated users can update recreations"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'public-images' AND name LIKE 'recreations/%');

-- Permettre à tout le monde de lire les images
CREATE POLICY IF NOT EXISTS "Public images are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'public-images');
