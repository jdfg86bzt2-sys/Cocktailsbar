-- Couche 3 : certification créateur et réputation
-- IMPORTANT : ce système certifie l'ATTRIBUTION et la RÉPUTATION
-- (qui a publié en premier, qui est crédité). Pas une propriété légale.

-- Un barman peut marquer un de ses cocktails comme "création signature"
alter table public.cocktails
  add column if not exists est_signature boolean not null default false;

-- Table des recréations : un utilisateur connecté déclare avoir recréé un cocktail
-- C'est un simple bouton "J'ai recréé ce cocktail", une seule fois par cocktail par user
create table public.recreations (
  id uuid primary key default gen_random_uuid(),
  cocktail_id uuid not null references public.cocktails(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  -- Un utilisateur ne peut recréer qu'une fois le même cocktail
  unique (cocktail_id, user_id)
);

alter table public.recreations enable row level security;

create policy "Recréations visibles par tous"
  on public.recreations for select using (true);

create policy "Tout utilisateur connecté peut déclarer une recréation"
  on public.recreations for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur supprime sa propre recréation"
  on public.recreations for delete
  using (auth.uid() = user_id);

-- Vue utilitaire : cocktails signatures avec leur score de réputation
-- (nb de recréations = réputation du créateur sur ce cocktail)
create or replace view public.cocktails_signatures as
  select
    c.id,
    c.nom,
    c.categorie_alcool,
    c.technique,
    c.tags_gout,
    c.photo_url,
    c.created_at,
    c.createur_id,
    p.pseudo as createur_pseudo,
    count(r.id)::int as nb_recreations
  from public.cocktails c
  join public.profiles p on p.id = c.createur_id
  left join public.recreations r on r.cocktail_id = c.id
  where c.est_signature = true
  group by c.id, p.pseudo;
