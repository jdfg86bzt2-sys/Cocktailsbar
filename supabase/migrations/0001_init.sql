-- Couche 1 : table des profils utilisateurs
-- Chaque utilisateur Supabase Auth a un profil associé avec son rôle (barman ou amateur)

create type public.user_role as enum ('barman', 'amateur');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text not null unique,
  role public.user_role not null default 'amateur',
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Active la sécurité au niveau des lignes (RLS) : par défaut, personne n'a accès
alter table public.profiles enable row level security;

-- Tout le monde (même non connecté) peut lire les profils publics
create policy "Les profils sont visibles par tous"
  on public.profiles for select
  using (true);

-- Un utilisateur ne peut modifier que son propre profil
create policy "Un utilisateur modifie uniquement son profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Un utilisateur ne peut créer que son propre profil
create policy "Un utilisateur crée uniquement son profil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Fonction déclenchée à chaque inscription : crée automatiquement le profil
-- à partir des métadonnées passées lors du signUp (pseudo, role)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, pseudo, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'pseudo', 'utilisateur_' || substr(new.id::text, 1, 8)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'amateur')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Bucket de stockage pour les avatars et futures photos de cocktails
insert into storage.buckets (id, name, public)
values ('public-images', 'public-images', true)
on conflict (id) do nothing;

create policy "Images publiques visibles par tous"
  on storage.objects for select
  using (bucket_id = 'public-images');

create policy "Les utilisateurs connectés peuvent uploader des images"
  on storage.objects for insert
  with check (bucket_id = 'public-images' and auth.role() = 'authenticated');
