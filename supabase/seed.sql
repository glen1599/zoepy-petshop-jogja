-- ============================================================================
--  Zoepy Petshop Jogja — data awal
--  Jalankan SETELAH schema.sql. Aman dijalankan berulang (idempotent).
-- ============================================================================

-- --- Layanan ---------------------------------------------------------------
insert into public.services (slug, title, summary, tags, image_url, sort_order) values
  ('grooming-spa', 'Grooming & Spa',
   'Mandi, potong kuku, cukur rapi, sampai perawatan kutu dan jamur. Dikerjakan satu per satu, bukan borongan.',
   array['Mandi & Blow Dry', 'Potong Kuku', 'Anti Kutu', 'Medicated Bath'],
   'img/hero.jpg', 1),
  ('pet-hotel', 'Pet Hotel',
   'Kandang terpisah per hewan, piket harian, dan kabar foto rutin ke WhatsApp supaya kamu tenang saat pergi.',
   array['Kandang Terpisah', 'Piket Harian', 'Laporan Foto'],
   'img/blog-1.jpg', 2),
  ('klinik-konsultasi', 'Klinik & Konsultasi',
   'Pengecekan dasar, vaksinasi, dan konsultasi gizi bersama dokter hewan rekanan kami.',
   array['Pengecekan Dasar', 'Vaksinasi', 'Konsultasi Gizi'],
   'img/blog-2.jpg', 3),
  ('pakan-perlengkapan', 'Pakan & Perlengkapan',
   'Lebih dari 180 varian pakan, pasir, vitamin, sampai mainan dan kandang.',
   array['Pakan', 'Vitamin', 'Mainan', 'Kandang'],
   'img/offer.jpg', 4)
on conflict (slug) do nothing;

-- --- Produk ----------------------------------------------------------------
-- Produk tidak punya kolom unik, jadi penjagaannya lewat "insert hanya kalau
-- tabelnya masih kosong" — supaya seed aman dijalankan berulang.
insert into public.products (name, description, category, price_idr, compare_idr, image_url, badge, sort_order)
select * from (values
  ('Pakan Kucing Premium',      'Protein tinggi, cocok untuk kucing dewasa aktif.',       'Pakan',     185000, 220000::int, 'img/product-1.png', 'Best Seller', 1),
  ('Pakan Anjing Dewasa',       'Formula seimbang untuk menjaga berat badan ideal.',      'Pakan',     240000, null::int,   'img/product-2.png', null,          2),
  ('Shampoo & Perawatan Bulu',  'Formula lembut untuk kulit sensitif, wangi tahan lama.', 'Perawatan',  68000, null::int,   'img/product-3.png', 'Baru',        3),
  ('Vitamin & Suplemen',        'Penambah nafsu makan dan penjaga daya tahan tubuh.',     'Kesehatan',  95000, null::int,   'img/product-4.png', null,          4),
  ('Pasir Kucing Gumpal',       'Daya serap tinggi, minim debu, mudah dibersihkan.',      'Pasir',      52000, null::int,   'img/product-1.png', null,          5),
  ('Mainan & Aksesori',         'Kalung, tali, dan mainan agar anabul tidak bosan.',      'Aksesori',   35000, null::int,   'img/product-2.png', null,          6)
) as v(name, description, category, price_idr, compare_idr, image_url, badge, sort_order)
where not exists (select 1 from public.products);

-- --- Testimoni -------------------------------------------------------------
insert into public.testimonials (author, location, quote, rating, avatar_url, sort_order)
select * from (values
  ('Pelanggan Grooming',  'Yogyakarta', 'Kucingku paling anti dimandikan, tapi di Zoepy bisa duduk tenang. Sekarang jadi rutin tiap bulan.', 5, 'img/testimonial-1.jpg', 1),
  ('Pelanggan Pet Hotel', 'Yogyakarta', 'Titip anabul lima hari waktu mudik. Dikirimi foto tiap hari, pulang-pulang malah lebih gemuk.',    5, 'img/testimonial-2.jpg', 2)
) as v(author, location, quote, rating, avatar_url, sort_order)
where not exists (select 1 from public.testimonials);

-- --- Tim -------------------------------------------------------------------
insert into public.team_members (name, role, photo_url, sort_order)
select * from (values
  ('Groomer Senior',    'Grooming',  'img/team-1.jpg', 1),
  ('Groomer',           'Grooming',  'img/team-2.jpg', 2),
  ('Pet Hotel Lead',    'Boarding',  'img/team-3.jpg', 3),
  ('Store Lead',        'Produk',    'img/team-4.jpg', 4)
) as v(name, role, photo_url, sort_order)
where not exists (select 1 from public.team_members);

-- --- Artikel ---------------------------------------------------------------
insert into public.posts (slug, title, excerpt, category, cover_url) values
  ('seberapa-sering-anabul-perlu-dimandikan',
   'Seberapa sering anabul perlu dimandikan?',
   'Jawabannya tergantung jenis bulu dan aktivitas, bukan jadwal seragam tiap minggu.',
   'Perawatan', 'img/blog-1.jpg'),
  ('membaca-label-pakan',
   'Membaca label pakan tanpa tertipu kemasan',
   'Tiga baris pertama di komposisi menentukan hampir segalanya. Begini cara membacanya.',
   'Nutrisi', 'img/blog-2.jpg'),
  ('checklist-sebelum-boarding',
   'Checklist sebelum menitipkan anabul',
   'Bawa apa saja, dan apa yang sebaiknya tidak dibawa, saat mau boarding pertama kali.',
   'Toko', 'img/offer.jpg')
on conflict (slug) do nothing;

-- --- Pengaturan situs ------------------------------------------------------
-- PENTING: ganti nilai PLACEHOLDER di bawah dengan data asli Zoepy.
insert into public.site_settings (key, value) values
  ('address',  '"Yogyakarta (lengkapi nama jalan)"'::jsonb),
  ('phone',    '"(nomor WhatsApp)"'::jsonb),
  ('email',    '"(email resmi)"'::jsonb),
  ('hours',    '"08.00 – 21.00 WIB"'::jsonb),
  ('whatsapp', '""'::jsonb)
on conflict (key) do nothing;

-- --- Paket harga -----------------------------------------------------------
-- Disimpan sebagai JSONB di site_settings supaya menambah paket tidak perlu
-- mengubah skema. Panel admin menyuntingnya lewat halaman Pengaturan.
insert into public.site_settings (key, value) values
  ('plans', '[
    {"name":"Basic","price":"Rp 75","unit":"rb / kunjungan",
     "features":["Mandi & blow dry","Potong kuku","Bersih telinga","Parfum finishing"]},
    {"name":"Standard","price":"Rp 120","unit":"rb / kunjungan","featured":true,"flag":"Paling dipilih",
     "features":["Semua di paket Basic","Cukur rapi sesuai permintaan","Perawatan kutu & jamur","Pemeriksaan kulit ringan","Diskon 10% produk rak"]},
    {"name":"Extended","price":"Rp 180","unit":"rb / kunjungan",
     "features":["Semua di paket Standard","Medicated bath","Suplemen vitamin","Konsultasi gizi singkat"]}
  ]'::jsonb)
on conflict (key) do nothing;
