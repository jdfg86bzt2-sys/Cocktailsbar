-- Couche 2 : fiches cocktails, leurs ingrédients, et les twists (variantes créditées)

create type public.technique_preparation as enum (
  'shake', 'stir', 'build', 'muddle', 'blend', 'autre'
);

-- Fiche cocktail "de base" : seuls les barmans peuvent en publier (vérifié en RLS)
create table public.cocktails (
  id uuid primary key default gen_random_uuid(),
  createur_id uuid not null references public.profiles(id) on delete cascade,
  nom text not null,
  description text,
  categorie_alcool text not null, -- ex: gin, rhum, whisky, vodka, sans alcool
  technique public.technique_preparation not null default 'autre',
  photo_url text,
  est_classique boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ingrédients d'un cocktail, saisis en champs structurés (quantité + unité + nom)
create table public.cocktail_ingredients (
  id uuid primary key default gen_random_uuid(),
  cocktail_id uuid not null references public.cocktails(id) on delete cascade,
  ingredient_nom text not null,
  quantite numeric,
  unite text, -- ex: cl, ml, trait, pièce
  ordre int not null default 0
);

-- Twist : variante d'un cocktail existant, rattachée à l'original, créditée à son auteur.
-- Ouvert à tous les utilisateurs connectés (barman ou amateur).
create table public.twists (
  id uuid primary key default gen_random_uuid(),
  cocktail_origine_id uuid not null references public.cocktails(id) on delete cascade,
  createur_id uuid not null references public.profiles(id) on delete cascade,
  nom text not null,
  description text,
  technique public.technique_preparation not null default 'autre',
  photo_url text,
  created_at timestamptz not null default now()
);

create table public.twist_ingredients (
  id uuid primary key default gen_random_uuid(),
  twist_id uuid not null references public.twists(id) on delete cascade,
  ingredient_nom text not null,
  quantite numeric,
  unite text,
  ordre int not null default 0
);

-- Index utilisés par la recherche/filtre (ingrédient, alcool, technique)
create index cocktails_categorie_alcool_idx on public.cocktails (categorie_alcool);
create index cocktails_technique_idx on public.cocktails (technique);
create index cocktail_ingredients_nom_idx on public.cocktail_ingredients using gin (to_tsvector('french', ingredient_nom));
create index twists_cocktail_origine_idx on public.twists (cocktail_origine_id);

alter table public.cocktails enable row level security;
alter table public.cocktail_ingredients enable row level security;
alter table public.twists enable row level security;
alter table public.twist_ingredients enable row level security;

-- Lecture publique pour tout le monde
create policy "Cocktails visibles par tous"
  on public.cocktails for select using (true);
create policy "Ingrédients cocktails visibles par tous"
  on public.cocktail_ingredients for select using (true);
create policy "Twists visibles par tous"
  on public.twists for select using (true);
create policy "Ingrédients twists visibles par tous"
  on public.twist_ingredients for select using (true);

-- Seuls les barmans connectés peuvent créer une fiche cocktail, et seulement en leur nom
create policy "Seuls les barmans publient des cocktails"
  on public.cocktails for insert
  with check (
    auth.uid() = createur_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'barman'
    )
  );

create policy "Le créateur modifie son cocktail"
  on public.cocktails for update
  using (auth.uid() = createur_id);

create policy "Le créateur supprime son cocktail"
  on public.cocktails for delete
  using (auth.uid() = createur_id);

-- Les ingrédients suivent les droits du cocktail parent (le créateur du cocktail les gère)
create policy "Le créateur gère les ingrédients de son cocktail"
  on public.cocktail_ingredients for insert
  with check (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur modifie les ingrédients de son cocktail"
  on public.cocktail_ingredients for update
  using (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur supprime les ingrédients de son cocktail"
  on public.cocktail_ingredients for delete
  using (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );

-- Tout utilisateur connecté peut publier un twist, en son nom
create policy "Tout utilisateur connecté publie un twist"
  on public.twists for insert
  with check (auth.uid() = createur_id);

create policy "Le créateur modifie son twist"
  on public.twists for update
  using (auth.uid() = createur_id);

create policy "Le créateur supprime son twist"
  on public.twists for delete
  using (auth.uid() = createur_id);

create policy "Le créateur gère les ingrédients de son twist"
  on public.twist_ingredients for insert
  with check (
    exists (
      select 1 from public.twists
      where id = twist_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur modifie les ingrédients de son twist"
  on public.twist_ingredients for update
  using (
    exists (
      select 1 from public.twists
      where id = twist_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur supprime les ingrédients de son twist"
  on public.twist_ingredients for delete
  using (
    exists (
      select 1 from public.twists
      where id = twist_id and createur_id = auth.uid()
    )
  );
