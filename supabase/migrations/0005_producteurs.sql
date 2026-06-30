-- Couche 4 : fiches producteurs et lien avec les cocktails qui utilisent leurs produits

create type public.type_producteur as enum (
  'distillerie', 'brasserie', 'vigneron', 'liquoriste', 'artisan', 'autre'
);

create table public.producteurs (
  id uuid primary key default gen_random_uuid(),
  createur_id uuid not null references public.profiles(id) on delete cascade,
  nom text not null,
  description text,
  type public.type_producteur not null default 'autre',
  region text,           -- ex: "Bretagne", "Bordeaux", "Savoie"
  pays text default 'France',
  site_web text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Lien many-to-many : un cocktail peut utiliser plusieurs producteurs,
-- un producteur peut apparaître dans plusieurs cocktails
create table public.cocktail_producteurs (
  cocktail_id uuid not null references public.cocktails(id) on delete cascade,
  producteur_id uuid not null references public.producteurs(id) on delete cascade,
  primary key (cocktail_id, producteur_id)
);

alter table public.producteurs enable row level security;
alter table public.cocktail_producteurs enable row level security;

create policy "Producteurs visibles par tous"
  on public.producteurs for select using (true);

create policy "Les barmans créent des fiches producteurs"
  on public.producteurs for insert
  with check (
    auth.uid() = createur_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'barman'
    )
  );

create policy "Le créateur modifie sa fiche producteur"
  on public.producteurs for update
  using (auth.uid() = createur_id);

create policy "Liens cocktail-producteur visibles par tous"
  on public.cocktail_producteurs for select using (true);

create policy "Le créateur du cocktail gère ses liens producteurs"
  on public.cocktail_producteurs for insert
  with check (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );

create policy "Le créateur du cocktail supprime ses liens producteurs"
  on public.cocktail_producteurs for delete
  using (
    exists (
      select 1 from public.cocktails
      where id = cocktail_id and createur_id = auth.uid()
    )
  );
