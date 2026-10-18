/* ==========================================================================
   Zoepy Petshop Jogja — konfigurasi
   SATU-SATUNYA tempat menaruh kredensial Supabase.

   Cara mengaktifkan mode Supabase:
     1. Supabase → Project Settings → API
     2. Salin "Project URL" dan kunci "anon public" ke bawah ini
     3. Muat ulang halaman admin

   Kalau dua nilai ini dibiarkan kosong, situs dan admin otomatis berjalan
   dalam MODE DEMO (data disimpan di localStorage browser) sehingga semuanya
   tetap bisa dicoba tanpa backend.

   CATATAN KEAMANAN
   Kunci `anon` memang dirancang publik dan aman ada di sisi klien — yang
   melindungi data adalah Row Level Security di database (lihat
   supabase/schema.sql). JANGAN PERNAH menaruh `service_role` key di file ini:
   kunci itu melewati seluruh RLS dan akan membuka semua data.
   ========================================================================== */

window.ZOEPY_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
};
