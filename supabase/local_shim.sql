-- ============================================================================
--  Shim `auth` — meniru bagian Supabase yang dibutuhkan schema.sql, supaya
--  skema bisa dijalankan dan diuji di PostgreSQL biasa (tanpa Docker).
--
--  Ini HANYA untuk pengujian lokal. Di Supabase asli, schema auth, tabel
--  auth.users, fungsi auth.uid() dan role anon/authenticated sudah ada.
--
--  Jalankan SEBELUM schema.sql.
-- ============================================================================

create schema if not exists auth;

-- Peran yang disediakan Supabase. HARUS dibuat sebelum GRANT apa pun.
-- `service_role` sengaja tidak dibuat: kita justru ingin membuktikan RLS
-- bekerja untuk anon dan authenticated.
do $do$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
end
$do$;

create table if not exists auth.users (
  id                 uuid primary key default gen_random_uuid(),
  email              text unique,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now()
);

-- Supabase mengisi klaim JWT per request. Secara lokal kita pakai GUC sesi:
--   set request.jwt.claim.sub = '<uuid>';
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

grant usage on schema auth to anon, authenticated;
grant select on auth.users to anon, authenticated;

-- Supabase memberi `anon` hak tabel lalu membiarkan RLS yang membatasi.
-- Kita tiru persis pola itu, jadi pengujiannya bermakna.
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- Pembantu pengujian: gagal keras saat asersi tidak terpenuhi.
create or replace function public.test_assert(ok boolean, label text)
returns void
language plpgsql
as $$
begin
  if ok then
    raise notice 'PASS  %', label;
  else
    raise exception 'FAIL  %', label;
  end if;
end
$$;

grant execute on function public.test_assert(boolean, text) to anon, authenticated;
