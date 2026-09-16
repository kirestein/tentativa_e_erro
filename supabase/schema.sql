-- Execute este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Supabase Dashboard > SQL Editor > New query > colar tudo > Run).

-- 1. Tabela de administradores -------------------------------------------------
-- Qualquer email cadastrado aqui pode fazer login em /admin e gerenciar o conteúdo.
create table if not exists public.admin_users (
  email text primary key
);

-- Troque pelo seu email do Google antes de rodar (ou rode depois via SQL Editor):
-- insert into public.admin_users (email) values ('seu-email@gmail.com');

-- 2. Atividades -----------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  theme text not null,
  description text,
  pdf_path text not null,
  lesson_plan_path text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Caso a tabela já exista de uma instalação anterior, adiciona a coluna nova:
alter table public.activities add column if not exists lesson_plan_path text;

-- 3. Jogos ------------------------------------------------------------------------
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  theme text,
  description text,
  storage_prefix text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Trigger para manter updated_at em dia ---------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.activities;
create trigger set_updated_at before update on public.activities
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.games;
create trigger set_updated_at before update on public.games
  for each row execute function public.set_updated_at();

-- 5. Row Level Security -----------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.activities enable row level security;
alter table public.games enable row level security;

-- admin_users: cada usuário logado só pode ler a própria linha (usado pelo middleware
-- para confirmar se quem logou é administrador).
drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read" on public.admin_users
  for select using (auth.jwt() ->> 'email' = email);

-- activities: público vê apenas publicadas; administradores veem e editam tudo.
drop policy if exists "activities_public_read" on public.activities;
create policy "activities_public_read" on public.activities
  for select using (
    published = true
    or exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  );

drop policy if exists "activities_admin_write" on public.activities;
create policy "activities_admin_write" on public.activities
  for all using (
    exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  ) with check (
    exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  );

-- games: mesma lógica.
drop policy if exists "games_public_read" on public.games;
create policy "games_public_read" on public.games
  for select using (
    published = true
    or exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  );

drop policy if exists "games_admin_write" on public.games;
create policy "games_admin_write" on public.games
  for all using (
    exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  ) with check (
    exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  );

-- 6. Storage buckets ----------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('pdfs', 'pdfs', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('games', 'games', true)
  on conflict (id) do nothing;

-- Leitura pública dos arquivos (PDFs e builds dos jogos).
drop policy if exists "public_read_pdfs" on storage.objects;
create policy "public_read_pdfs" on storage.objects
  for select using (bucket_id = 'pdfs');

drop policy if exists "public_read_games" on storage.objects;
create policy "public_read_games" on storage.objects
  for select using (bucket_id = 'games');

-- Upload/edição/remoção apenas para administradores.
drop policy if exists "admin_write_pdfs" on storage.objects;
create policy "admin_write_pdfs" on storage.objects
  for all using (
    bucket_id = 'pdfs'
    and exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  ) with check (
    bucket_id = 'pdfs'
    and exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  );

drop policy if exists "admin_write_games" on storage.objects;
create policy "admin_write_games" on storage.objects
  for all using (
    bucket_id = 'games'
    and exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  ) with check (
    bucket_id = 'games'
    and exists (select 1 from public.admin_users a where a.email = auth.jwt() ->> 'email')
  );
