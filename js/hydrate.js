/* ==========================================================================
   Zoepy Petshop Jogja — penghubung halaman publik ke data layer
   Markup statis di index.html tetap jadi default (bagus untuk SEO dan kalau
   JS mati). Skrip ini HANYA menggantinya ketika data berhasil dibaca.
   ========================================================================== */

(() => {
  "use strict";

  const db = window.ZoepyDB;
  if (!db) return;

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
    );

  const rupiah = (n) => (n === null || n === undefined ? "" : "Rp " + Number(n).toLocaleString("id-ID"));

  const target = (name) => document.querySelector(`[data-hydrate="${name}"]`);

  /* ------------------------------------------------------------ renderers */

  const render = {
    services(rows) {
      const host = target("services");
      if (!host || !rows.length) return;
      host.innerHTML = rows
        .map((s, i) => {
          const shape =
            i === 0 ? "tile--wide tile--tall tile--acid" : i < 3 ? "tile--half tile--tall" : "tile--wide";
          const media =
            i > 0 && s.image_url
              ? `<div class="tile__media"><img src="${esc(s.image_url)}" alt="" loading="lazy"></div>`
              : "";
          const tags = (s.tags || []).map((t) => `<span>${esc(t)}</span>`).join("");
          return `<article class="tile ${shape}" data-tilt>
            ${media}
            <span class="tile__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
            <div class="tile__head"><span class="tile__num display">${String(i + 1).padStart(2, "0")}</span></div>
            <div class="tile__body">
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.summary)}</p>
              ${tags ? `<div class="tile__tags">${tags}</div>` : ""}
            </div>
          </article>`;
        })
        .join("");
    },

    products(rows) {
      const host = target("products");
      if (!host || !rows.length) return;
      host.innerHTML = rows
        .map(
          (p) => `<article class="product">
            ${p.badge ? `<span class="product__tag">${esc(p.badge)}</span>` : ""}
            <div class="product__media">
              <span class="product__mask" aria-hidden="true"></span>
              ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" width="400" height="400">` : ""}
            </div>
            <div class="product__body">
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.description)}</p>
              <div class="product__price">${rupiah(p.price_idr)}${p.compare_idr ? ` <s>${rupiah(p.compare_idr)}</s>` : ""}</div>
            </div>
          </article>`
        )
        .join("");
    },

    testimonials(rows) {
      const host = target("testimonials");
      if (!host || !rows.length) return;
      const star =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.6 7 .8-5.2 4.8L18.3 21 12 17.6 5.7 21l1.5-6.8L2 9.4l7-.8z"/></svg>';
      host.innerHTML = rows
        .map(
          (t) => `<figure class="quote" data-tilt>
            <div class="quote__stars" aria-label="${esc(t.rating)} dari 5">${star.repeat(Math.max(1, Math.min(5, t.rating || 5)))}</div>
            <blockquote>${esc(t.quote)}</blockquote>
            <footer>
              ${t.avatar_url ? `<img src="${esc(t.avatar_url)}" alt="" width="96" height="96" loading="lazy">` : ""}
              <div><b>${esc(t.author)}</b><span>${esc(t.location)}</span></div>
            </footer>
          </figure>`
        )
        .join("");
    },

    team(rows) {
      const host = target("team");
      if (!host || !rows.length) return;
      host.innerHTML = rows
        .map(
          (m) => `<figure class="crew__card">
            ${m.photo_url ? `<img src="${esc(m.photo_url)}" alt="${esc(m.name)}" loading="lazy" width="600" height="800">` : ""}
            <figcaption><b>${esc(m.name)}</b><span>${esc(m.role)}</span></figcaption>
          </figure>`
        )
        .join("");
    },

    posts(rows) {
      const host = target("posts");
      if (!host || !rows.length) return;
      const arrow =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
      host.innerHTML = rows
        .slice(0, 3)
        .map((p) => {
          const date = p.published_at
            ? new Date(p.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
            : "";
          return `<article class="post">
            ${p.cover_url ? `<img src="${esc(p.cover_url)}" alt="" loading="lazy" width="800" height="500">` : ""}
            <div class="post__body">
              <span class="post__date">${esc(p.category || date)}</span>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.excerpt)}</p>
              <span class="post__more">Baca ${arrow}</span>
            </div>
          </article>`;
        })
        .join("");
    },

    contact(settings) {
      const host = target("contact");
      const rows = [
        ["Alamat", settings.address],
        ["Telepon", settings.phone],
        ["Email", settings.email],
        ["Buka", settings.hours],
      ].filter(([, value]) => value);
      if (!host || !rows.length) return;
      host.innerHTML = rows
        .map(([label, value]) => `<li>${esc(label)} — ${esc(value)}</li>`)
        .join("");

      // a WhatsApp number, when set, becomes a real deep link
      if (settings.whatsapp) {
        const digits = String(settings.whatsapp).replace(/\D/g, "");
        if (digits) {
          const cta = document.querySelector(".nav__cta");
          if (cta) {
            cta.href = `https://wa.me/${digits}`;
            cta.target = "_blank";
            cta.rel = "noopener";
          }
        }
      }
    },

    productGrid(rows) {
      const host = target("product-grid");
      if (!host || !rows.length) return;
      host.innerHTML = rows
        .map(
          (p) => `<article class="product">
            ${p.badge ? `<span class="product__tag">${esc(p.badge)}</span>` : ""}
            <div class="product__media">
              <span class="product__mask" aria-hidden="true"></span>
              ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" width="400" height="400">` : ""}
            </div>
            <div class="product__body">
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.description)}</p>
              <div class="product__price">${rupiah(p.price_idr)}${p.compare_idr ? ` <s>${rupiah(p.compare_idr)}</s>` : ""}</div>
            </div>
          </article>`
        )
        .join("");
    },

    productDetail(rows) {
      const host = target("product-detail");
      if (!host || !rows.length) return;
      const params = new URLSearchParams(window.location.search);
      const wanted = params.get("id") || params.get("slug");
      const found = rows.find(
        (r) => String(r.id) === String(wanted) || String(r.slug ?? "") === String(wanted)
      );

      if (!found) {
        host.innerHTML = `<p class="info__note">Produk tidak ditemukan. <a href="product.html">Lihat semua produk →</a></p>`;
        return;
      }

      const others = rows.filter((r) => r.id !== found.id).slice(0, 3);
      host.innerHTML = `
        <div class="detail">
          <div class="detail__media">
            ${found.image_url ? `<img src="${esc(found.image_url)}" alt="${esc(found.name)}" width="700" height="700">` : ""}
          </div>
          <div class="detail__body">
            ${found.badge ? `<span class="product__tag" style="position:static;display:inline-block">${esc(found.badge)}</span>` : ""}
            <h1 class="display h-lg" style="margin-top:.75rem">${esc(found.name)}</h1>
            <p class="page-lede">${esc(found.description)}</p>
            <p class="detail__price">
              ${rupiah(found.price_idr)} ${found.compare_idr ? `<s>${rupiah(found.compare_idr)}</s>` : ""}
            </p>
            <p class="info__note">Kategori: ${esc(found.category || "—")} · ${found.in_stock === false ? "Stok kosong" : "Tersedia"}</p>
            <a class="btn" href="contact.html" data-magnetic style="margin-top:1.25rem"><span>Tanya / pesan</span></a>
          </div>
        </div>
        ${others.length ? `<h2 class="display h-lg" style="margin-top:4rem">Produk lain</h2>
          <div class="product-grid">${others
            .map(
              (p) => `<article class="product"><div class="product__media">${
                p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" width="400" height="400">` : ""
              }</div><div class="product__body"><h3>${esc(p.name)}</h3><p>${
                rupiah(p.price_idr)
              }</p><a class="post__more" href="detail.html?id=${esc(p.id)}">Lihat detail →</a></div></article>`
            )
            .join("")}</div>` : ""}`;
    },

    postsPage(rows) {
      const host = target("posts-page");
      if (!host || !rows.length) return;
      const arrow =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
      host.innerHTML = rows
        .map((p) => {
          const date = p.published_at
            ? new Date(p.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
            : "";
          return `<article class="post">
            ${p.cover_url ? `<img src="${esc(p.cover_url)}" alt="" loading="lazy" width="800" height="500">` : ""}
            <div class="post__body">
              <span class="post__date">${esc(p.category || date)}</span>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.excerpt)}</p>
              <span class="post__more">Baca ${arrow}</span>
            </div>
          </article>`;
        })
        .join("");
    },

    plans(settings) {
      const host = target("plans");
      const list = settings.plans;
      if (!host || !Array.isArray(list) || !list.length) return;
      host.innerHTML = list
        .map(
          (plan) => `<article class="plan${plan.featured ? " plan--featured" : ""}" data-tilt>
            ${plan.flag ? `<span class="plan__flag">${esc(plan.flag)}</span>` : ""}
            <span class="plan__name">${esc(plan.name)}</span>
            <div class="plan__price">${esc(plan.price)}<small> ${esc(plan.unit || "")}</small></div>
            <ul>${(plan.features || []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
            <a class="btn ${plan.featured ? "btn--ink" : "btn--outline"}" href="contact.html" data-magnetic>
              <span>Pilih ${esc(plan.name)}</span>
            </a>
          </article>`
        )
        .join("");
    },

    contactCards(settings) {
      const host = target("contact-cards");
      if (!host) return;

      const waDigits = String(settings.whatsapp || "").replace(/\D/g, "");
      const inisial = String(settings.phone || "");
      const cards = [
        { label: "Alamat", value: settings.address, icon: "pin", href: `https://maps.google.com/?q=${encodeURIComponent("Zoepy Petshop Jogja")}` },
        { label: "Telepon / WhatsApp", value: inisial, icon: "phone", href: waDigits ? `https://wa.me/${waDigits}` : null },
        { label: "Email", value: settings.email, icon: "mail", href: settings.email && settings.email.includes("@") ? `mailto:${settings.email}` : null },
        { label: "Jam buka", value: settings.hours, icon: "clock", href: null },
      ].filter((card) => card.value && !String(card.value).startsWith("("));

      const paths = {
        pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
        phone: '<path d="M4 5c0-1 1-2 2-2h2l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v2c0 1-1 2-2 2A16 16 0 0 1 4 5z"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
      };

      host.innerHTML = cards
        .map((card) => {
          const body = `<span class="info__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[card.icon]}</svg></span>
            <span class="info__text"><small>${esc(card.label)}</small><b>${esc(card.value)}</b></span>`;
          return card.href
            ? `<a class="info" href="${esc(card.href)}" target="_blank" rel="noopener">${body}</a>`
            : `<div class="info">${body}</div>`;
        })
        .join("");

      // sembunyikan kartu placeholder sebelum data asli diisi
      host.dataset.ready = cards.length ? "1" : "";
    },

    meta(settings) {
      const host = target("meta");
      if (!host || !settings.hours) return;
      const spans = host.querySelectorAll("span");
      if (spans.length >= 3) spans[2].textContent = `Buka ${settings.hours}`;
    },

    serviceOptions(rows) {
      const select = document.querySelector('[data-hydrate="service-options"]');
      if (!select || !rows.length) return;
      select.innerHTML =
        '<option value="">— pilih —</option>' +
        rows.map((s) => `<option value="${esc(s.slug)}">${esc(s.title)}</option>`).join("");
    },
  };

  /* --------------------------------------------------------------- load */

  async function hydrate() {
    const [services, products, testimonials, team, posts, settings] = await Promise.all([
      db.list("services", { onlyPublished: true }),
      db.list("products", { onlyPublished: true }),
      db.list("testimonials", { onlyPublished: true }),
      db.list("team_members", { onlyPublished: true }),
      db.list("posts", { onlyPublished: true }),
      db.settings(),
    ]);

    render.services(services);
    render.serviceOptions(services);
    render.products(products);
    render.testimonials(testimonials);
    render.team(team);
    render.posts(posts);
    render.contact(settings);
    render.contactCards(settings);
    render.plans(settings);
    render.meta(settings);
    render.productGrid(products);
    render.productDetail(products);
    render.postsPage(posts);

    // Anything rendered after the motion layer initialised needs the same
    // entrance treatment, or it would sit invisible.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = ".product, .quote, .crew__card, .post, .tile";
    if (window.gsap && !reduce && document.querySelector(targets)) {
      const { gsap } = window;
      gsap.from(targets, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.04,
        clearProps: "transform,opacity",
        overwrite: "auto",
      });
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }
  }

  /* ------------------------------------------------------- booking form */

  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const note = document.getElementById("booking-note");
      const button = document.getElementById("booking-submit");
      const label = document.getElementById("booking-label");

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();

      const complain = (message) => {
        note.textContent = message;
        note.hidden = false;
        note.dataset.kind = "error";
      };

      if (name.length < 2) return complain("Nama minimal 2 karakter.");
      if (phone.replace(/\D/g, "").length < 7) return complain("Nomor WhatsApp belum valid.");

      button.disabled = true;
      button.classList.add("is-busy");
      label.textContent = "Mengirim…";
      note.hidden = true;

      try {
        await db.insert("bookings", {
          name,
          phone,
          pet_name: form.pet_name.value.trim() || null,
          pet_type: form.pet_type.value || null,
          service_slug: form.service_slug.value || null,
          preferred_at: form.preferred_at.value ? new Date(form.preferred_at.value).toISOString() : null,
          notes: form.notes.value.trim() || null,
          status: "new",
        });
        form.reset();
        note.textContent = "Permintaan terkirim. Kami hubungi lewat WhatsApp untuk konfirmasi.";
        note.dataset.kind = "ok";
        note.hidden = false;
      } catch (error) {
        complain(`Gagal mengirim: ${error.message}`);
      } finally {
        button.disabled = false;
        button.classList.remove("is-busy");
        label.textContent = "Kirim permintaan";
      }
    });
  }

  hydrate().catch((error) => {
    // Static markup stays on screen; only log for the developer.
    console.warn("Hydration dilewati:", error.message);
  });
})();
