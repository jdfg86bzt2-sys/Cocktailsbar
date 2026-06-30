-- Couche 2b : enrichissement des fiches cocktails
-- Ajout du type de verre, profil de goût (tags) et étapes de préparation numérotées

-- Colonnes supplémentaires sur la table cocktails existante
alter table public.cocktails
  add column if not exists type_verre text,
  add column if not exists tags_gout text[] not null default '{}';

-- Étapes de préparation d'un cocktail (ex: "1. Remplir de glace", "2. Verser le gin")
create table public.cocktail_etapes (
  id uuid primary key default gen_random_uuid(),
  cocktail_id uuid not null references public.cocktails(id) on delete cascade,
  texte text not null,
  ordre int not null default 0
);

-- Étapes d'un twist
create table public.twist_etapes (
  id uuid primary key default gen_random_uuid(),
  twist_id uuid not null references public.twists(id) on delete cascade,
  texte text not null,
  ordre int not null default 0
);

alter table public.cocktail_etapes enable row level security;
alter table public.twist_etapes enable row level security;

create policy "Étapes cocktails visibles par tous"
  on public.cocktail_etapes for select using (true);

create policy "Le créateur gère les étapes de son cocktail"
  on public.cocktail_etapes for insert
  with check (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur modifie les étapes de son cocktail"
  on public.cocktail_etapes for update
  using (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur supprime les étapes de son cocktail"
  on public.cocktail_etapes for delete
  using (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );

create policy "Étapes twists visibles par tous"
  on public.twist_etapes for select using (true);

create policy "Le créateur gère les étapes de son twist"
  on public.twist_etapes for insert
  with check (
    exists (
      select 1 from public.twists
      where id = twist_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur modifie les étapes de son twist"
  on public.twist_etapes for update
  using (
    exists (
      select 1 from public.twists
      where id = twist_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur supprime les étapes de son twist"
  on public.twist_etapes for delete
  using (
    exists (
      select 1 from public.twists
      where id = twist_id and createur_id = auth.uid()
    )
  );
