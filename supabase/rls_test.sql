-- ============================================================================
--  Uji keamanan RLS — dijalankan sebagai `anon` dan `authenticated`, bukan
--  sebagai superuser. Setiap kebocoran akan menggagalkan skrip ini.
--
--  Pemakaian:  psql -d zoepy -f supabase/rls_test.sql
-- ============================================================================

\set ON_ERROR_STOP on

-- --- bersihkan sisa jalan sebelumnya, agar skrip bisa diulang ------------
delete from public.bookings where name in ('Tamu Anonim', 'Tamu Nakal');
delete from public.services where slug in ('rahasia-internal', 'uji-admin', 'ancaman', 'staf');

-- --- siapkan dua pengguna: satu admin, satu staf biasa --------------------
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'admin@zoepy.test'),
  ('22222222-2222-2222-2222-222222222222', 'staff@zoepy.test')
on conflict (email) do nothing;

-- Trigger handle_new_user sudah membuat barisnya; naikkan satu jadi admin.
update public.profiles set is_admin = true where email = 'admin@zoepy.test';
update public.profiles set is_admin = false where email = 'staff@zoepy.test';

-- Satu layanan tersembunyi, dibuat sebagai pemilik tabel (melewati RLS).
insert into public.services (slug, title, published, sort_order)
values ('rahasia-internal', 'Layanan Belum Tayang', false, 99)
on conflict (slug) do nothing;

\echo ''
\echo '=== 1. ANON (pengunjung biasa) ==='
set role anon;
set request.jwt.claim.sub = '';

do $$
begin
  perform public.test_assert(
    (select count(*) from public.services where published = true) = 4,
    'anon melihat 4 layanan yang tayang');

  perform public.test_assert(
    (select count(*) from public.services) = 4,
    'anon TIDAK melihat layanan yang belum tayang');

  perform public.test_assert(
    (select count(*) from public.products) = 6,
    'anon melihat 6 produk');

  perform public.test_assert(
    (select count(*) from public.testimonials) = 2,
    'anon melihat 2 testimoni');

  perform public.test_assert(
    (select count(*) from public.team_members) = 4,
    'anon melihat 4 anggota tim');

  perform public.test_assert(
    (select count(*) from public.site_settings) >= 4,
    'anon bisa membaca pengaturan situs');

  perform public.test_assert(
    (select count(*) from public.bookings) = 0,
    'anon TIDAK bisa membaca booking siapa pun');

  perform public.test_assert(
    (select count(*) from public.profiles) = 0,
    'anon TIDAK bisa membaca daftar profil');
end $$;

-- booking tanpa login: harus boleh, status dipaksa 'new'
do $$
begin
  insert into public.bookings (name, phone, pet_name, status)
  values ('Tamu Anonim', '08120000001', 'Mochi', 'new');
  perform public.test_assert(true, 'anon boleh mengirim booking (status new)');
end $$;

-- booking dengan status palsu: harus ditolak
do $$
begin
  begin
    insert into public.bookings (name, phone, status)
    values ('Tamu Nakal', '08120000002', 'confirmed');
    perform public.test_assert(false, 'anon TIDAK boleh memalsukan status booking');
  exception
    when insufficient_privilege then
      perform public.test_assert(true, 'anon TIDAK boleh memalsukan status booking');
  end;
end $$;

-- anon tidak boleh menulis konten
do $$
begin
  begin
    insert into public.services (slug, title) values ('ancaman', 'Dari anon');
    perform public.test_assert(false, 'anon TIDAK boleh menambah layanan');
  exception
    when insufficient_privilege then
      perform public.test_assert(true, 'anon TIDAK boleh menambah layanan');
  end;
end $$;

-- RLS tidak melempar error pada UPDATE/DELETE yang tidak punya policy; ia
-- hanya mencocokkan 0 baris. Jadi yang diuji adalah HASILNYA, lalu diperiksa
-- sebagai pemilik tabel.
delete from public.services where slug = 'grooming-spa';
update public.services set title = 'Dibajak' where slug = 'grooming-spa';

reset role;
do $$
begin
  perform public.test_assert(
    (select count(*) from public.services where slug = 'grooming-spa') = 1,
    'anon TIDAK boleh menghapus layanan (baris masih ada)');

  perform public.test_assert(
    (select title from public.services where slug = 'grooming-spa') = 'Grooming & Spa',
    'anon TIDAK boleh mengubah layanan (judul tidak berubah)');
end $$;
set role anon;

\echo ''
\echo '=== 2. AUTHENTICATED, TAPI BUKAN ADMIN ==='
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

do $$
begin
  perform public.test_assert(
    (select is_admin from public.profiles
      where id = '22222222-2222-2222-2222-222222222222') = false,
    'staf biasa memang bukan admin');

  begin
    insert into public.services (slug, title) values ('staf', 'Dari staf');
    perform public.test_assert(false, 'staf biasa TIDAK boleh menambah layanan');
  exception
    when insufficient_privilege then
      perform public.test_assert(true, 'staf biasa TIDAK boleh menambah layanan');
  end;

  perform public.test_assert(
    (select count(*) from public.bookings) = 0,
    'staf biasa TIDAK boleh membaca booking');
end $$;

-- UPDATE pada baris yang tidak terlihat = 0 baris terpengaruh, bukan error.
update public.products set price_idr = 1 where id = 1;
reset role;
do $$
begin
  perform public.test_assert(
    (select price_idr from public.products where id = 1) = 185000,
    'staf biasa TIDAK boleh mengubah produk (harga tidak berubah)');
end $$;
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

\echo ''
\echo '=== 3. ADMIN ==='
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

do $$
begin
  perform public.test_assert(public.is_admin(), 'admin dikenali sebagai admin');

  perform public.test_assert(
    (select count(*) from public.services) = 5,
    'admin melihat layanan yang belum tayang juga');

  perform public.test_assert(
    (select count(*) from public.bookings) = 1,
    'admin melihat booking dari tamu anonim');
end $$;

do $$
declare
  new_id bigint;
begin
  insert into public.services (slug, title, summary) values ('uji-admin', 'Layanan Uji', 'Dibuat admin')
  returning id into new_id;
  perform public.test_assert(new_id is not null, 'admin boleh menambah layanan');

  update public.services set title = 'Layanan Uji Diubah' where id = new_id;
  perform public.test_assert(
    (select title from public.services where id = new_id) = 'Layanan Uji Diubah',
    'admin boleh mengubah layanan');

  update public.bookings set status = 'confirmed' where name = 'Tamu Anonim';
  perform public.test_assert(
    (select status from public.bookings where name = 'Tamu Anonim') = 'confirmed',
    'admin boleh mengubah status booking');

  delete from public.services where id = new_id;
  perform public.test_assert(
    (select count(*) from public.services where id = new_id) = 0,
    'admin boleh menghapus layanan');
end $$;

reset role;
reset request.jwt.claim.sub;

\echo ''
\echo '========================================================'
\echo ' SEMUA UJI RLS LULUS — tidak ada kebocoran yang terdeteksi'
\echo '========================================================'
