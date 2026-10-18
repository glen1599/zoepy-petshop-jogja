# Setup Supabase — Zoepy Petshop Jogja

Panel admin dan situs berjalan dalam **dua mode**. Yang aktif ditentukan oleh
apakah `js/config.js` berisi kredensial.

| Mode | Kapan aktif | Data disimpan di |
| --- | --- | --- |
| **demo** | `js/config.js` kosong | `localStorage` browser |
| **supabase** | URL + anon key terisi | PostgreSQL Supabase |

Mode demo tidak butuh apa pun — buka `admin.html`, masuk dengan email dan kata
sandi apa pun. Cocok untuk mencoba dan menilai tampilan.

---

## Mengaktifkan Supabase (sekali, ±10 menit)

### 1. Buat project

Buka [supabase.com](https://supabase.com) → **New project**. Catat kata sandi
database-nya, lalu tunggu sampai project selesai disiapkan.

### 2. Buat tabel

Supabase → **SQL Editor** → **New query** → tempel seluruh isi
[`schema.sql`](schema.sql) → **Run**.

Lalu buat query baru lagi, tempel isi [`seed.sql`](seed.sql) → **Run**.
Ini mengisi layanan, produk, testimoni, tim dan artikel dengan konten yang
sudah ada di web.

### 3. Buat akun admin

Supabase → **Authentication** → **Users** → **Add user** → isi email dan kata
sandi, centang *Auto Confirm User*.

Lalu kembali ke **SQL Editor** dan jalankan (ganti emailnya):

```sql
update public.profiles
   set is_admin = true
 where email = 'email-admin-kamu@contoh.com';
```

> Tanpa langkah ini kamu bisa login, tetapi Row Level Security akan menolak
> setiap tulis — memang begitu seharusnya.

### 4. Salin kredensial

Supabase → **Project Settings** → **API**. Salin dua nilai ini ke
`js/config.js`:

```js
window.ZOEPY_CONFIG = {
  supabaseUrl: "https://xxxxxxxx.supabase.co",
  supabaseAnonKey: "eyJhbGciOi...",
};
```

Buka ulang `admin.html`. Badge di kiri bawah akan berubah dari
**mode demo** menjadi **supabase**.

---

## Yang tidak boleh dilakukan

**Jangan pernah menaruh `service_role` key di `js/config.js`.** Kunci itu
melewati seluruh Row Level Security. Kalau ada di file yang dikirim ke browser,
siapa pun bisa membaca, mengubah, dan menghapus seluruh database-mu.

Kunci `anon` aman dipublikasikan — yang melindungi data adalah policy di
`schema.sql`.

## Cek cepat apakah RLS benar

Setelah login sebagai admin, coba buka di tab Incognito:

```
https://<project>.supabase.co/rest/v1/bookings?select=*
```

dengan header `apikey: <anon key>`. Yang benar: hasilnya `[]`. Kalau malah
menampilkan daftar booking, policy-nya belum terpasang — ulangi langkah 2.

## Menambah tabel baru

1. Tambahkan `create table` + `enable row level security` + policy di
   `schema.sql`, lalu jalankan ulang (file ini idempotent).
2. Tambahkan satu entri di objek `RESOURCES` pada `js/admin.js`.

Tidak perlu menulis kode CRUD baru — tabel, form, dan validasinya dibangkitkan
dari skema itu.
