/* ==========================================================================
   Zoepy Petshop Jogja — panel admin
   Satu renderer untuk semua tabel. Menambah kolom cukup dengan mengubah
   objek RESOURCES di bawah; tidak ada kode CRUD yang diulang per tabel.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
    );

  const rupiah = (n) =>
    n === null || n === undefined || n === "" ? "—" : "Rp " + Number(n).toLocaleString("id-ID");

  const when = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  /* --------------------------------------------------------------- schema */

  const STATUS_OPTIONS = ["new", "confirmed", "done", "cancelled"];

  const RESOURCES = {
    bookings: {
      label: "Booking",
      table: "bookings",
      title: "Booking masuk",
      sub: "Permintaan dari formulir publik.",
      canCreate: false,
      searchKeys: ["name", "phone", "pet_name", "service_slug"],
      columns: [
        { key: "created_at", label: "Masuk", render: when },
        { key: "name", label: "Nama" },
        { key: "phone", label: "Telepon" },
        { key: "pet_name", label: "Anabul" },
        { key: "service_slug", label: "Layanan" },
        { key: "status", label: "Status", render: (v) => `<span class="pill pill--${esc(v)}">${esc(v)}</span>` },
      ],
      fields: [
        { key: "name", label: "Nama", type: "text", required: true },
        { key: "phone", label: "Telepon", type: "text", required: true },
        { key: "pet_name", label: "Nama anabul", type: "text" },
        { key: "pet_type", label: "Jenis", type: "text" },
        { key: "service_slug", label: "Layanan", type: "text" },
        { key: "preferred_at", label: "Waktu diinginkan", type: "datetime" },
        { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
        { key: "notes", label: "Catatan", type: "textarea" },
      ],
    },

    services: {
      label: "Layanan",
      table: "services",
      title: "Layanan",
      sub: "Empat kartu di halaman utama.",
      searchKeys: ["title", "slug"],
      columns: [
        { key: "sort_order", label: "#" },
        { key: "title", label: "Nama" },
        { key: "summary", label: "Ringkasan", render: (v) => `<span class="truncate">${esc(v)}</span>` },
        { key: "published", label: "Tampil", render: (v) => `<span class="pill pill--${v ? "yes" : "no"}">${v ? "ya" : "tidak"}</span>` },
      ],
      fields: [
        { key: "title", label: "Nama", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "summary", label: "Ringkasan", type: "textarea" },
        { key: "tags", label: "Tag (pisahkan dengan koma)", type: "tags" },
        { key: "image_url", label: "Gambar", type: "text" },
        { key: "sort_order", label: "Urutan", type: "number" },
        { key: "published", label: "Tampilkan", type: "checkbox" },
      ],
    },

    products: {
      label: "Produk",
      table: "products",
      title: "Produk",
      sub: "Rak produk di halaman utama.",
      searchKeys: ["name", "category"],
      columns: [
        { key: "image_url", label: "", render: (v) => (v ? `<img class="cell-img" src="${esc(v)}" alt="">` : "") },
        { key: "name", label: "Nama" },
        { key: "category", label: "Kategori" },
        { key: "price_idr", label: "Harga", render: rupiah },
        { key: "compare_idr", label: "Harga coret", render: rupiah },
        { key: "in_stock", label: "Stok", render: (v) => `<span class="pill pill--${v ? "yes" : "no"}">${v ? "ada" : "kosong"}</span>` },
      ],
      fields: [
        { key: "name", label: "Nama", type: "text", required: true },
        { key: "description", label: "Deskripsi", type: "textarea" },
        { key: "category", label: "Kategori", type: "text" },
        { key: "price_idr", label: "Harga (Rp)", type: "number" },
        { key: "compare_idr", label: "Harga coret (Rp)", type: "number" },
        { key: "image_url", label: "Gambar", type: "text" },
        { key: "badge", label: "Label", type: "text" },
        { key: "in_stock", label: "Tersedia", type: "checkbox" },
        { key: "sort_order", label: "Urutan", type: "number" },
        { key: "published", label: "Tampilkan", type: "checkbox" },
      ],
    },

    testimonials: {
      label: "Testimoni",
      table: "testimonials",
      title: "Testimoni",
      sub: "Kata pelanggan.",
      searchKeys: ["author", "quote"],
      columns: [
        { key: "author", label: "Nama" },
        { key: "quote", label: "Kutipan", render: (v) => `<span class="truncate">${esc(v)}</span>` },
        { key: "rating", label: "Bintang" },
        { key: "published", label: "Tampil", render: (v) => `<span class="pill pill--${v ? "yes" : "no"}">${v ? "ya" : "tidak"}</span>` },
      ],
      fields: [
        { key: "author", label: "Nama", type: "text", required: true },
        { key: "location", label: "Lokasi", type: "text" },
        { key: "quote", label: "Kutipan", type: "textarea", required: true },
        { key: "rating", label: "Bintang (1–5)", type: "number" },
        { key: "avatar_url", label: "Foto", type: "text" },
        { key: "sort_order", label: "Urutan", type: "number" },
        { key: "published", label: "Tampilkan", type: "checkbox" },
      ],
    },

    team_members: {
      label: "Tim",
      table: "team_members",
      title: "Tim",
      sub: "Staf yang tampil di halaman utama.",
      searchKeys: ["name", "role"],
      columns: [
        { key: "photo_url", label: "", render: (v) => (v ? `<img class="cell-img" src="${esc(v)}" alt="">` : "") },
        { key: "name", label: "Nama" },
        { key: "role", label: "Peran" },
        { key: "published", label: "Tampil", render: (v) => `<span class="pill pill--${v ? "yes" : "no"}">${v ? "ya" : "tidak"}</span>` },
      ],
      fields: [
        { key: "name", label: "Nama", type: "text", required: true },
        { key: "role", label: "Peran", type: "text" },
        { key: "photo_url", label: "Foto", type: "text" },
        { key: "sort_order", label: "Urutan", type: "number" },
        { key: "published", label: "Tampilkan", type: "checkbox" },
      ],
    },

    posts: {
      label: "Artikel",
      table: "posts",
      title: "Artikel blog",
      sub: "Tulisan di halaman blog.",
      searchKeys: ["title", "slug", "category"],
      columns: [
        { key: "published_at", label: "Tanggal", render: when },
        { key: "title", label: "Judul" },
        { key: "category", label: "Kategori" },
        { key: "published", label: "Tampil", render: (v) => `<span class="pill pill--${v ? "yes" : "no"}">${v ? "ya" : "tidak"}</span>` },
      ],
      fields: [
        { key: "title", label: "Judul", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "excerpt", label: "Ringkasan", type: "textarea" },
        { key: "body", label: "Isi", type: "textarea" },
        { key: "category", label: "Kategori", type: "text" },
        { key: "cover_url", label: "Gambar", type: "text" },
        { key: "published_at", label: "Tanggal terbit", type: "datetime" },
        { key: "published", label: "Tampilkan", type: "checkbox" },
      ],
    },

    settings: {
      label: "Pengaturan",
      table: "site_settings",
      title: "Pengaturan situs",
      sub: "Kontak dan jam buka. Ganti nilai placeholder dengan data asli Zoepy.",
      special: "settings",
    },
  };

  const ORDER = ["bookings", "services", "products", "testimonials", "team_members", "posts", "settings"];

  /* ---------------------------------------------------------------- state */

  const state = { view: "bookings", rows: [], query: "", editing: null };

  /* ---------------------------------------------------------------- utils */

  function toast(message, kind = "ok") {
    const host = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.dataset.kind = kind;
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  function setModeBadge() {
    const demo = window.ZoepyDB.mode === "demo";
    ["mode-badge", "mode-badge-login"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.dataset.mode = window.ZoepyDB.mode;
      el.textContent = demo ? "mode demo" : "supabase";
      el.title = demo
        ? "Data disimpan di localStorage browser. Isi js/config.js untuk memakai Supabase."
        : "Terhubung ke Supabase.";
    });
    $("#btn-reset").hidden = !demo;
  }

  /* ----------------------------------------------------------------- auth */

  async function boot() {
    setModeBadge();
    const session = await window.ZoepyDB.session();
    if (session) showPanel(session);
    else showGate();
  }

  function showGate() {
    $("#gate").hidden = false;
    $("#panel").hidden = true;
  }

  function showPanel(session) {
    $("#gate").hidden = true;
    $("#panel").hidden = false;
    $("#who").textContent = session?.email ?? "";
    buildNav();
    navigate("bookings");
  }

  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    const error = $("#login-error");
    error.hidden = true;
    button.disabled = true;
    try {
      const user = await window.ZoepyDB.signIn(form.email.value.trim(), form.password.value);
      form.reset();
      showPanel(user);
      toast("Berhasil masuk.");
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    } finally {
      button.disabled = false;
    }
  });

  $("#btn-logout").addEventListener("click", async () => {
    await window.ZoepyDB.signOut();
    showGate();
  });

  $("#btn-reset")?.addEventListener("click", async () => {
    if (!confirm("Kembalikan data demo ke contoh awal? Perubahanmu akan hilang.")) return;
    window.ZoepyDB.resetDemo();
    await navigate(state.view);
    toast("Data demo direset.");
  });

  /* ------------------------------------------------------------------ nav */

  function buildNav() {
    const nav = $("#side-nav");
    nav.innerHTML = "";
    ORDER.forEach((key) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.view = key;
      button.innerHTML = `<span>${esc(RESOURCES[key].label)}</span>`;
      if (key === "bookings") button.innerHTML += `<i id="nav-new"></i>`;
      button.addEventListener("click", () => navigate(key));
      nav.appendChild(button);
    });
  }

  function markNav() {
    document.querySelectorAll("#side-nav button").forEach((button) => {
      button.setAttribute("aria-current", String(button.dataset.view === state.view));
    });
  }

  async function refreshBadge() {
    const badge = document.getElementById("nav-new");
    if (!badge) return;
    try {
      const rows = await window.ZoepyDB.list("bookings");
      const fresh = rows.filter((row) => row.status === "new").length;
      badge.textContent = fresh ? String(fresh) : "";
    } catch {
      badge.textContent = "";
    }
  }

  /* --------------------------------------------------------------- render */

  async function navigate(view) {
    state.view = view;
    state.query = "";
    $("#search").value = "";
    markNav();

    const resource = RESOURCES[view];
    $("#view-title").textContent = resource.title;
    $("#view-sub").textContent = resource.sub;

    if (resource.special === "settings") {
      $("#btn-new").hidden = true;
      await renderSettings();
      await refreshBadge();
      return;
    }

    $("#btn-new").hidden = resource.canCreate === false;
    await renderTable();
    await renderStats();
    await refreshBadge();
  }

  async function renderStats() {
    const host = $("#stats");
    host.innerHTML = "";
    try {
      const [bookings, products] = await Promise.all([
        window.ZoepyDB.list("bookings"),
        window.ZoepyDB.list("products"),
      ]);
      const stats = [
        { label: "Booking baru", value: bookings.filter((b) => b.status === "new").length, alert: true },
        { label: "Total booking", value: bookings.length },
        { label: "Produk", value: products.length },
        { label: "Stok kosong", value: products.filter((p) => p.in_stock === false).length },
      ];
      host.innerHTML = stats
        .map(
          (s) =>
            `<div class="stat${s.alert && s.value ? " stat--alert" : ""}"><b>${s.value}</b><span>${esc(s.label)}</span></div>`
        )
        .join("");
    } catch (error) {
      host.innerHTML = `<div class="stat"><b>!</b><span>${esc(error.message)}</span></div>`;
    }
  }

  async function renderTable() {
    const resource = RESOURCES[state.view];
    const head = $("#table-head");
    const body = $("#table-body");
    const empty = $("#empty");

    head.innerHTML =
      "<tr>" +
      resource.columns.map((c) => `<th scope="col">${esc(c.label)}</th>`).join("") +
      '<th scope="col" style="text-align:right">Aksi</th></tr>';

    let rows;
    try {
      rows = await window.ZoepyDB.list(resource.table);
    } catch (error) {
      body.innerHTML = `<tr><td colspan="${resource.columns.length + 1}">${esc(error.message)}</td></tr>`;
      empty.hidden = true;
      return;
    }

    state.rows = rows;
    const needle = state.query.trim().toLowerCase();
    if (needle && resource.searchKeys) {
      rows = rows.filter((row) =>
        resource.searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(needle))
      );
    }

    empty.hidden = rows.length > 0;
    body.innerHTML = rows
      .map((row) => {
        const cells = resource.columns
          .map((c) => {
            const raw = row[c.key];
            const html = c.render ? c.render(raw, row) : esc(raw);
            return `<td>${html}</td>`;
          })
          .join("");
        return `<tr>${cells}<td><div class="row-actions">
          <button class="icon-btn" data-edit="${row.id}" title="Ubah" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
          </button>
          <button class="icon-btn icon-btn--danger" data-del="${row.id}" title="Hapus" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
          </button>
        </div></td></tr>`;
      })
      .join("");

    body.querySelectorAll("[data-edit]").forEach((button) =>
      button.addEventListener("click", () => openEditor(button.dataset.edit))
    );
    body.querySelectorAll("[data-del]").forEach((button) =>
      button.addEventListener("click", () => removeRow(button.dataset.del))
    );
  }

  /* -------------------------------------------------------------- settings */

  async function renderSettings() {
    const host = $("#table-body");
    $("#table-head").innerHTML = "";
    $("#empty").hidden = true;
    $("#stats").innerHTML = "";

    let settings;
    try {
      settings = await window.ZoepyDB.settings();
    } catch (error) {
      host.innerHTML = `<tr><td>${esc(error.message)}</td></tr>`;
      return;
    }

    const labels = {
      address: "Alamat",
      phone: "Telepon / WhatsApp",
      email: "Email",
      hours: "Jam buka",
      whatsapp: "Nomor WhatsApp (format internasional)",
    };

    host.innerHTML = `<tr><td style="padding:1.5rem">
      <form id="settings-form" style="display:grid;gap:1rem;max-width:32rem">
        ${Object.keys(labels)
          .map(
            (key) => `<label><span>${esc(labels[key])}</span>
              <input name="${key}" value="${esc(settings[key] ?? "")}">
            </label>`
          )
          .join("")}
        <button class="btn" type="submit" style="justify-self:start"><span>Simpan pengaturan</span></button>
      </form>
    </td></tr>`;

    $("#settings-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      try {
        await Promise.all(
          Object.keys(labels).map((key) => window.ZoepyDB.saveSetting(key, form[key].value.trim()))
        );
        toast("Pengaturan tersimpan.");
      } catch (error) {
        toast(error.message, "error");
      }
    });
  }

  /* ---------------------------------------------------------------- editor */

  function openEditor(id) {
    const resource = RESOURCES[state.view];
    const row = id ? state.rows.find((r) => String(r.id) === String(id)) : {};
    state.editing = id || null;

    $("#modal-title").textContent = id ? `Ubah ${resource.label.toLowerCase()}` : `Tambah ${resource.label.toLowerCase()}`;
    const form = $("#modal-form");
    form.innerHTML = "";

    resource.fields.forEach((field) => {
      const value = row?.[field.key];
      const label = document.createElement("label");
      let control = "";

      if (field.type === "textarea") {
        control = `<textarea name="${field.key}">${esc(value ?? "")}</textarea>`;
      } else if (field.type === "select") {
        control = `<select name="${field.key}">${field.options
          .map((o) => `<option value="${esc(o)}"${o === value ? " selected" : ""}>${esc(o)}</option>`)
          .join("")}</select>`;
      } else if (field.type === "checkbox") {
        label.className = "check";
        control = `<input type="checkbox" name="${field.key}"${value ? " checked" : ""}><span>${esc(field.label)}</span>`;
        label.innerHTML = control;
        form.appendChild(label);
        return;
      } else if (field.type === "datetime") {
        const local = value ? new Date(value).toISOString().slice(0, 16) : "";
        control = `<input type="datetime-local" name="${field.key}" value="${esc(local)}">`;
      } else if (field.type === "number") {
        control = `<input type="number" name="${field.key}" value="${value ?? ""}">`;
      } else if (field.type === "tags") {
        const joined = Array.isArray(value) ? value.join(", ") : value ?? "";
        control = `<input type="text" name="${field.key}" value="${esc(joined)}">`;
      } else {
        control = `<input type="text" name="${field.key}" value="${esc(value ?? "")}"${field.required ? " required" : ""}>`;
      }

      label.innerHTML = `<span>${esc(field.label)}</span>${control}`;
      form.appendChild(label);
    });

    $("#modal").hidden = false;
    form.querySelector("input, textarea, select")?.focus();
  }

  function closeEditor() {
    $("#modal").hidden = true;
    state.editing = null;
  }

  $("#modal-close").addEventListener("click", closeEditor);
  $("#modal-cancel").addEventListener("click", closeEditor);
  $("#modal").addEventListener("click", (event) => {
    if (event.target === $("#modal")) closeEditor();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#modal").hidden) closeEditor();
  });

  $("#modal-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const resource = RESOURCES[state.view];
    const form = event.currentTarget;
    const data = {};

    resource.fields.forEach((field) => {
      const input = form.elements[field.key];
      if (!input) return;
      if (field.type === "checkbox") data[field.key] = input.checked;
      else if (field.type === "number") data[field.key] = input.value === "" ? null : Number(input.value);
      else if (field.type === "tags")
        data[field.key] = input.value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      else if (field.type === "datetime")
        data[field.key] = input.value ? new Date(input.value).toISOString() : null;
      else data[field.key] = input.value.trim() || null;
    });

    try {
      if (state.editing) {
        await window.ZoepyDB.update(resource.table, state.editing, data);
        toast("Perubahan disimpan.");
      } else {
        await window.ZoepyDB.insert(resource.table, data);
        toast("Data ditambahkan.");
      }
      closeEditor();
      await navigate(state.view);
    } catch (error) {
      toast(error.message, "error");
    }
  });

  async function removeRow(id) {
    const resource = RESOURCES[state.view];
    if (!confirm("Hapus data ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      await window.ZoepyDB.remove(resource.table, id);
      toast("Data dihapus.");
      await navigate(state.view);
    } catch (error) {
      toast(error.message, "error");
    }
  }

  /* -------------------------------------------------------------- controls */

  $("#btn-new").addEventListener("click", () => openEditor(null));

  let searchTimer;
  $("#search").addEventListener("input", (event) => {
    state.query = event.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (RESOURCES[state.view].special) return;
      renderTable();
    }, 160);
  });

  /* ------------------------------------------------------------------ boot */

  boot().catch((error) => {
    const note = $("#gate-note");
    if (note) note.textContent = `Gagal memuat: ${error.message}`;
  });
})();
