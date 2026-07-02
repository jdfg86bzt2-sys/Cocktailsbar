-- Supprimer la policy SELECT trop large (inutile sur un bucket public)
DROP POLICY IF EXISTS "Public images are publicly accessible" ON storage.objects;
