/* ==========================================================================
   Zoepy Petshop Jogja — data layer
   Satu API untuk dua backend:
     • Supabase  — saat js/config.js berisi URL + anon key
     • Demo      — localStorage, supaya admin bisa dicoba tanpa backend
   Pemakainya (admin.js, halaman publik) tidak perlu tahu yang mana aktif.
   ========================================================================== */

(() => {
  "use strict";

  const cfg = window.ZOEPY_CONFIG || {};
  const canReachSupabase = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const STORE_KEY = "zoepy_demo_v1";

  /* ----------------------------------------------------------- demo data */

  const DEMO = {
    services: [
      { id: 1, slug: "grooming-spa", title: "Grooming & Spa", summary: "Mandi, potong kuku, cukur rapi, sampai perawatan kutu dan jamur.", tags: ["Mandi & Blow Dry", "Potong Kuku", "Anti Kutu"], image_url: "img/hero.jpg", sort_order: 1, published: true },
      { id: 2, slug: "pet-hotel", title: "Pet Hotel", summary: "Kandang terpisah per hewan, piket harian, kabar foto rutin.", tags: ["Kandang Terpisah", "Laporan Foto"], image_url: "img/blog-1.jpg", sort_order: 2, published: true },
      { id: 3, slug: "klinik-konsultasi", title: "Klinik & Konsultasi", summary: "Pengecekan dasar, vaksinasi, dan konsultasi gizi.", tags: ["Vaksinasi", "Konsultasi Gizi"], image_url: "img/blog-2.jpg", sort_order: 3, published: true },
      { id: 4, slug: "pakan-perlengkapan", title: "Pakan & Perlengkapan", summary: "Lebih dari 180 varian pakan, pasir, vitamin, sampai mainan.", tags: ["Pakan", "Vitamin", "Kandang"], image_url: "img/offer.jpg", sort_order: 4, published: true },
    ],
    products: [
      { id: 1, name: "Pakan Kucing Premium", description: "Protein tinggi, cocok untuk kucing dewasa aktif.", category: "Pakan", price_idr: 185000, compare_idr: 220000, image_url: "img/product-1.png", badge: "Best Seller", in_stock: true, sort_order: 1, published: true },
      { id: 2, name: "Pakan Anjing Dewasa", description: "Formula seimbang untuk menjaga berat badan ideal.", category: "Pakan", price_idr: 240000, compare_idr: null, image_url: "img/product-2.png", badge: null, in_stock: true, sort_order: 2, published: true },
      { id: 3, name: "Shampoo & Perawatan Bulu", description: "Formula lembut untuk kulit sensitif.", category: "Perawatan", price_idr: 68000, compare_idr: null, image_url: "img/product-3.png", badge: "Baru", in_stock: true, sort_order: 3, published: true },
      { id: 4, name: "Vitamin & Suplemen", description: "Penambah nafsu makan dan penjaga daya tahan tubuh.", category: "Kesehatan", price_idr: 95000, compare_idr: null, image_url: "img/product-4.png", badge: null, in_stock: true, sort_order: 4, published: true },
      { id: 5, name: "Pasir Kucing Gumpal", description: "Daya serap tinggi, minim debu.", category: "Pasir", price_idr: 52000, compare_idr: null, image_url: "img/product-1.png", badge: null, in_stock: true, sort_order: 5, published: true },
      { id: 6, name: "Mainan & Aksesori", description: "Kalung, tali, dan mainan agar anabul tidak bosan.", category: "Aksesori", price_idr: 35000, compare_idr: null, image_url: "img/product-2.png", badge: null, in_stock: true, sort_order: 6, published: true },
    ],
    testimonials: [
      { id: 1, author: "Pelanggan Grooming", location: "Yogyakarta", quote: "Kucingku paling anti dimandikan, tapi di Zoepy bisa duduk tenang.", rating: 5, avatar_url: "img/testimonial-1.jpg", sort_order: 1, published: true },
      { id: 2, author: "Pelanggan Pet Hotel", location: "Yogyakarta", quote: "Titip anabul lima hari waktu mudik. Dikirimi foto tiap hari.", rating: 5, avatar_url: "img/testimonial-2.jpg", sort_order: 2, published: true },
    ],
    team_members: [
      { id: 1, name: "Groomer Senior", role: "Grooming", photo_url: "img/team-1.jpg", sort_order: 1, published: true },
      { id: 2, name: "Groomer", role: "Grooming", photo_url: "img/team-2.jpg", sort_order: 2, published: true },
      { id: 3, name: "Pet Hotel Lead", role: "Boarding", photo_url: "img/team-3.jpg", sort_order: 3, published: true },
      { id: 4, name: "Store Lead", role: "Produk", photo_url: "img/team-4.jpg", sort_order: 4, published: true },
    ],
    posts: [
      { id: 1, slug: "seberapa-sering-anabul-perlu-dimandikan", title: "Seberapa sering anabul perlu dimandikan?", excerpt: "Tergantung jenis bulu dan aktivitas, bukan jadwal seragam tiap minggu.", category: "Perawatan", cover_url: "img/blog-1.jpg", published_at: "2026-09-12T00:00:00Z", published: true },
      { id: 2, slug: "membaca-label-pakan", title: "Membaca label pakan tanpa tertipu kemasan", excerpt: "Tiga baris pertama di komposisi menentukan hampir segalanya.", category: "Nutrisi", cover_url: "img/blog-2.jpg", published_at: "2026-09-28T00:00:00Z", published: true },
      { id: 3, slug: "checklist-sebelum-boarding", title: "Checklist sebelum menitipkan anabul", excerpt: "Bawa apa saja, dan apa yang sebaiknya tidak dibawa.", category: "Toko", cover_url: "img/offer.jpg", published_at: "2026-10-05T00:00:00Z", published: true },
    ],
    bookings: [
      { id: 1, name: "Contoh Pelanggan", phone: "08120000000", pet_name: "Milo", pet_type: "Kucing", service_slug: "grooming-spa", preferred_at: "2026-10-20T09:00:00Z", notes: "Bulu agak kusut.", status: "new", created_at: "2026-10-17T02:10:00Z" },
      { id: 2, name: "Contoh Kedua", phone: "08130000000", pet_name: "Bruno", pet_type: "Anjing", service_slug: "pet-hotel", preferred_at: "2026-10-25T08:00:00Z", notes: "Titip 3 hari.", status: "confirmed", created_at: "2026-10-16T06:40:00Z" },
    ],
    site_settings: [
      { key: "address", value: "Yogyakarta (lengkapi nama jalan)" },
      { key: "phone", value: "(nomor WhatsApp)" },
      { key: "email", value: "(email resmi)" },
      { key: "hours", value: "08.00 – 21.00 WIB" },
      { key: "whatsapp", value: "" },
      {
        key: "plans",
        value: [
          { name: "Basic", price: "Rp 75", unit: "rb / kunjungan", features: ["Mandi & blow dry", "Potong kuku", "Bersih telinga", "Parfum finishing"] },
          { name: "Standard", price: "Rp 120", unit: "rb / kunjungan", featured: true, flag: "Paling dipilih", features: ["Semua di paket Basic", "Cukur rapi sesuai permintaan", "Perawatan kutu & jamur", "Pemeriksaan kulit ringan", "Diskon 10% produk rak"] },
          { name: "Extended", price: "Rp 180", unit: "rb / kunjungan", features: ["Semua di paket Standard", "Medicated bath", "Suplemen vitamin", "Konsultasi gizi singkat"] },
        ],
      },
    ],
  };

  function readDemo() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* corrupt or blocked storage: fall through to a fresh seed */
    }
    const fresh = JSON.parse(JSON.stringify(DEMO));
    writeDemo(fresh);
    return fresh;
  }

  function writeDemo(db) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(db));
    } catch {
      /* private mode: the panel still works for the session */
    }
  }

  function nextId(rows) {
    return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
  }

  /* ------------------------------------------------------- supabase client */

  const client = canReachSupabase
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
    : null;

  const ORDER = {
    services: { column: "sort_order", ascending: true },
    products: { column: "sort_order", ascending: true },
    testimonials: { column: "sort_order", ascending: true },
    team_members: { column: "sort_order", ascending: true },
    posts: { column: "published_at", ascending: false },
    bookings: { column: "created_at", ascending: false },
  };

  function fail(error, context) {
    const message = error?.message || String(error);
    throw new Error(`${context}: ${message}`);
  }

  /* --------------------------------------------------------------- public */

  const api = {
    mode: client ? "supabase" : "demo",
    isRemote: Boolean(client),

    /** Daftar baris satu tabel, terurut sesuai konvensi tiap tabel. */
    async list(table, { onlyPublished = false } = {}) {
      if (!client) {
        const rows = readDemo()[table] || [];
        return onlyPublished ? rows.filter((row) => row.published !== false) : rows;
      }
      let query = client.from(table).select("*");
      if (onlyPublished) query = query.eq("published", true);
      const order = ORDER[table];
      if (order) query = query.order(order.column, { ascending: order.ascending });
      const { data, error } = await query;
      if (error) fail(error, `Gagal membaca ${table}`);
      return data ?? [];
    },

    /** Ambil satu baris berdasarkan id. */
    async get(table, id) {
      if (!client) {
        return (readDemo()[table] || []).find((row) => String(row.id) === String(id)) || null;
      }
      const { data, error } = await client.from(table).select("*").eq("id", id).maybeSingle();
      if (error) fail(error, `Gagal membaca ${table}#${id}`);
      return data;
    },

    async insert(table, row) {
      if (!client) {
        const db = readDemo();
        db[table] = db[table] || [];
        const created = { ...row, id: nextId(db[table]) };
        db[table].push(created);
        writeDemo(db);
        return created;
      }
      const { data, error } = await client.from(table).insert(row).select().single();
      if (error) fail(error, `Gagal menyimpan ke ${table}`);
      return data;
    },

    async update(table, id, patch) {
      if (!client) {
        const db = readDemo();
        db[table] = (db[table] || []).map((row) =>
          String(row.id) === String(id) ? { ...row, ...patch } : row
        );
        writeDemo(db);
        return db[table].find((row) => String(row.id) === String(id));
      }
      const { data, error } = await client.from(table).update(patch).eq("id", id).select().single();
      if (error) fail(error, `Gagal memperbarui ${table}#${id}`);
      return data;
    },

    async remove(table, id) {
      if (!client) {
        const db = readDemo();
        db[table] = (db[table] || []).filter((row) => String(row.id) !== String(id));
        writeDemo(db);
        return true;
      }
      const { error } = await client.from(table).delete().eq("id", id);
      if (error) fail(error, `Gagal menghapus ${table}#${id}`);
      return true;
    },

    /** Pengaturan situs sebagai objek { key: value }. */
    async settings() {
      const rows = await this.list("site_settings");
      return Object.fromEntries(rows.map((row) => [row.key, row.value]));
    },

    async saveSetting(key, value) {
      if (!client) {
        const db = readDemo();
        const rows = db.site_settings || [];
        const found = rows.find((row) => row.key === key);
        if (found) found.value = value;
        else rows.push({ key, value });
        db.site_settings = rows;
        writeDemo(db);
        return true;
      }
      const { error } = await client.from("site_settings").upsert({ key, value }, { onConflict: "key" });
      if (error) fail(error, `Gagal menyimpan pengaturan ${key}`);
      return true;
    },

    /** Kosongkan mode demo dan kembalikan data contoh. */
    resetDemo() {
      if (client) return false;
      try {
        localStorage.removeItem(STORE_KEY);
      } catch {
        /* ignore */
      }
      readDemo();
      return true;
    },

    /* ------------------------------------------------------------- auth */

    async signIn(email, password) {
      if (!client) {
        // Demo: apa pun yang tidak kosong diterima, sesi hidup di memori.
        if (!email || !password) throw new Error("Email dan kata sandi wajib diisi.");
        sessionStorage.setItem("zoepy_demo_session", email);
        return { email, demo: true };
      }
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) fail(error, "Login gagal");
      return data.user;
    },

    async signOut() {
      if (!client) {
        sessionStorage.removeItem("zoepy_demo_session");
        return true;
      }
      const { error } = await client.auth.signOut();
      if (error) fail(error, "Logout gagal");
      return true;
    },

    async session() {
      if (!client) {
        const email = sessionStorage.getItem("zoepy_demo_session");
        return email ? { email, demo: true } : null;
      }
      const { data, error } = await client.auth.getSession();
      if (error) fail(error, "Gagal membaca sesi");
      return data.session?.user ?? null;
    },
  };

  window.ZoepyDB = api;
})();
