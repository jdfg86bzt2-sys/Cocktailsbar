-- Empêche les doublons de noms (insensible à la casse)
CREATE UNIQUE INDEX IF NOT EXISTS producteurs_nom_unique ON producteurs (lower(nom));
CREATE UNIQUE INDEX IF NOT EXISTS cocktails_nom_unique ON cocktails (lower(nom));
