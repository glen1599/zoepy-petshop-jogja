"""Bangun team.html dan testimonial.html dari satu template bersama.

Chrome (head, nav, footer, daftar script) ditulis sekali di sini, jadi hanya
isi badan halaman yang berbeda per halaman. Menjalankan ulang skrip ini
meregenerasi kedua file.

    python3 _build_pages.py
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent

FAVICON = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    "%3Crect width='32' height='32' rx='7' fill='%230d0e0e'/%3E"
    "%3Cpath d='M16 25c-5 0-8-3.4-8-8 0-5.2 4-9.6 8-12 4 2.4 8 6.8 8 12 0 4.6-3 8-8 8z' fill='%23d2ff00'/%3E%3C/svg%3E"
)

NAV_ITEMS = [
    ("index.html#tentang", "Tentang"),
    ("service.html", "Layanan"),
    ("index.html#produk", "Produk"),
    ("index.html#harga", "Harga"),
    ("team.html", "Tim"),
    ("blog.html", "Blog"),
]

CHROME_TAIL = """<div class="cursor" id="cursor" aria-hidden="true"><i></i><span></span></div>

<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js" defer></script>
<script src="js/config.js" defer></script>
<script src="js/data.js" defer></script>
<script src="js/hydrate.js" defer></script>
<script src="js/zoepy.js" defer></script>
</body>
</html>
"""


def head(title: str, description: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="id" class="no-js">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Zoepy Petshop Jogja</title>
<meta name="description" content="{description}">
<meta name="theme-color" content="#0d0e0e">
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<link href="lib/flaticon/font/flaticon.css" rel="stylesheet">
<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/style.css" rel="stylesheet">
<link href="css/zoepy.css" rel="stylesheet">
</head>
<body class="page">
"""


def nav(current: str) -> str:
    def item(href: str, label: str) -> str:
        current_attr = ' aria-current="page"' if href == current else ""
        return f'      <a href="{href}"{current_attr}>{label}</a>'

    links = "\n".join(item(href, label) for href, label in NAV_ITEMS)
    drawer = "\n".join(f'    <a href="{href}">{label}</a>' for href, label in NAV_ITEMS)
    return f"""
<header class="nav" id="nav">
  <div class="shell nav__inner">
    <a class="wordmark" href="index.html">Zoepy<b>.</b><small>Petshop&nbsp;Jogja</small></a>
    <nav class="nav__links" aria-label="Navigasi utama">
{links}
    </nav>
    <a class="nav__cta" href="contact.html">
      Booking Sekarang
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
    </a>
    <button class="nav__burger" id="burger" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
  </div>
  <div class="nav__drawer" id="drawer">
{drawer}
    <a href="contact.html">Booking Sekarang</a>
  </div>
</header>
"""


FOOTER = """
<footer class="footer">
  <div class="shell">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="wordmark" href="index.html">Zoepy<b>.</b><small>Petshop&nbsp;Jogja</small></a>
        <p>Grooming, pet hotel, klinik dan perlengkapan hewan. Your pet's ultimate pitstop di Yogyakarta.</p>
        <div class="footer__social">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
          <a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a11 11 0 0 1-4.7-3.6c-.7-1-1-1.8-1-2.4 0-.6.3-1.1.6-1.4.2-.2.4-.3.6-.3h.5c.2 0 .3 0 .5.4l.7 1.6c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.3 0 .5.4.7 1.6 2 2.8 2.5.2.1.4.1.5 0l.6-.7c.1-.2.3-.2.5-.1l1.5.8c.2.1.3.2.3.4 0 .1 0 .2-.1.3z"/></svg></a>
          <a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 3h-2.8v11.6a2.6 2.6 0 1 1-2.1-2.5V9.3a5.4 5.4 0 1 0 4.9 5.4V8.4A5.6 5.6 0 0 0 19.6 10V7.2A3.6 3.6 0 0 1 16 3z"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Kontak</h4>
        <ul class="footer__contact" data-hydrate="contact">
          <li>Alamat — Yogyakarta <span style="opacity:.6">(lengkapi nama jalan)</span></li>
          <li>Telepon — <span style="opacity:.6">(nomor WhatsApp)</span></li>
          <li>Email — <span style="opacity:.6">(email resmi)</span></li>
          <li>Buka — 08.00 – 21.00 WIB</li>
        </ul>
      </div>
      <div>
        <h4>Navigasi</h4>
        <ul class="footer__links">
          <li><a href="index.html#tentang">Tentang</a></li>
          <li><a href="service.html">Layanan</a></li>
          <li><a href="index.html#produk">Produk</a></li>
          <li><a href="index.html#harga">Harga</a></li>
          <li><a href="team.html">Tim</a></li>
        </ul>
      </div>
      <div>
        <h4>Halaman</h4>
        <ul class="footer__links">
          <li><a href="about.html">Profil Toko</a></li>
          <li><a href="product.html">Produk</a></li>
          <li><a href="price.html">Harga</a></li>
          <li><a href="testimonial.html">Cerita Pelanggan</a></li>
          <li><a href="contact.html">Kontak &amp; Lokasi</a></li>
        </ul>
      </div>
    </div>
    <p class="footer__wordmark" aria-hidden="true">Zoepy Jogja</p>
    <div class="footer__base">
      <span>© <span id="year">2026</span> Zoepy Petshop Jogja. Semua hak dilindungi.</span>
      <span>Dibuat di Yogyakarta.</span>
    </div>
  </div>
</footer>
"""


def page_header(eyebrow: str, title: str, lede: str) -> str:
    return f"""  <section class="section section--tight">
    <div class="shell">
      <p class="eyebrow rise">{eyebrow}</p>
      <h1 class="display h-xl rise" style="margin-top:1.25rem;max-width:22ch">{title}</h1>
      <p class="page-lede rise">{lede}</p>
    </div>
  </section>
"""


TEAM_BODY = page_header(
    "Tim",
    "Orang yang kamu temui tiap datang",
    "Staf tetap, bukan tenaga lepas harian. Kalau anabulmu mudah panik, biasanya mereka "
    "sudah hafal siapa yang paling cocok menanganinya.",
) + """
  <section class="section" style="padding-top:0">
    <div class="shell">
      <div class="crew" data-hydrate="team">
        <!-- Cadangan kalau JavaScript mati. -->
        <figure class="crew__card"><figcaption><b>Groomer Senior</b><span>Grooming</span></figcaption></figure>
        <figure class="crew__card"><figcaption><b>Groomer</b><span>Grooming</span></figcaption></figure>
        <figure class="crew__card"><figcaption><b>Pet Hotel Lead</b><span>Boarding</span></figcaption></figure>
        <figure class="crew__card"><figcaption><b>Store Lead</b><span>Produk</span></figcaption></figure>
      </div>
    </div>
  </section>

  <section class="section section--obsidian-2">
    <div class="shell">
      <div class="head">
        <div class="head__title">
          <p class="eyebrow rise">Cara kami bekerja</p>
          <h2 class="display h-xl rise" style="margin-top:1.25rem">Tiga aturan yang tidak kami tawar</h2>
        </div>
        <p class="head__note rise">Bukan slogan — ini yang membuat orang datang lagi.</p>
      </div>

      <ol class="steps steps--three">
        <li class="step rise">
          <span class="step__num display">01</span>
          <h3>Satu anabul, satu orang</h3>
          <p>Tidak ada pengerjaan borongan. Yang memulai dari awal sampai selesai orang yang sama, jadi tidak ada yang perlu diulang penjelasannya.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">02</span>
          <h3>Alat bersih setiap sesi</h3>
          <p>Gunting, sisir dan meja disterilkan antar sesi. Ini bagian tidak kelihatan yang paling sering diabaikan tempat lain.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">03</span>
          <h3>Kami bilang apa adanya</h3>
          <p>Kalau kondisi kulit atau bulunya perlu penanganan khusus, kami bilang sebelum mulai dan sebutkan biayanya.</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      <div class="cta rise">
        <h2 class="display h-xl">Kenalan dulu dengan tim kami</h2>
        <p>Datang saja kapan pun antara 08.00 – 21.00 WIB, tidak perlu booking untuk ngobrol.</p>
        <a class="btn btn--ink" href="contact.html" data-magnetic>
          <span>Lihat lokasi &amp; kontak</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>
  </section>
"""

QUOTE_STAR = (
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
    '<path d="m12 2 3 6.6 7 .8-5.2 4.8L18.3 21 12 17.6 5.7 21l1.5-6.8L2 9.4l7-.8z"/></svg>'
) * 5

TESTIMONIAL_BODY = page_header(
    "Cerita pelanggan",
    "Yang bilang bukan kami sendiri",
    "Kami tidak membeli ulasan. Ini yang pelanggan kirim sendiri lewat WhatsApp atau tulis "
    "di Google Maps setelah mereka pulang membawa anabulnya.",
) + f"""
  <section class="section" style="padding-top:0">
    <div class="shell">
      <div class="quotes" data-hydrate="testimonials">
        <!-- Cadangan kalau JavaScript mati. -->
        <figure class="quote">
          <div class="quote__stars" aria-label="5 dari 5">{QUOTE_STAR}</div>
          <blockquote>Kucingku paling anti dimandikan, tapi di Zoepy bisa duduk tenang.</blockquote>
          <footer><div><b>Pelanggan Grooming</b><span>Yogyakarta</span></div></footer>
        </figure>
        <figure class="quote">
          <div class="quote__stars" aria-label="5 dari 5">{QUOTE_STAR}</div>
          <blockquote>Titip anabul lima hari waktu mudik. Dikirimi foto tiap hari.</blockquote>
          <footer><div><b>Pelanggan Pet Hotel</b><span>Yogyakarta</span></div></footer>
        </figure>
      </div>
    </div>
  </section>

  <section class="section section--obsidian-2">
    <div class="shell">
      <div class="head">
        <div class="head__title">
          <p class="eyebrow rise">Yang paling sering dipuji</p>
          <h2 class="display h-xl rise" style="margin-top:1.25rem">Empat hal yang berulang</h2>
        </div>
        <p class="head__note rise">Pola ini muncul terus di review, jadi kami tulis di sini.</p>
      </div>

      <ol class="steps">
        <li class="step rise">
          <span class="step__num display">01</span>
          <h3>Anabul tenang</h3>
          <p>Yang biasanya gelisah jadi bisa diam. Kami tidak memaksa hewan yang takut.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">02</span>
          <h3>Kabar saat dititipkan</h3>
          <p>Laporan foto rutin membuat pemilik tenang waktu jauh dari rumah.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">03</span>
          <h3>Jujur soal kondisi</h3>
          <p>Kalau ada jamur atau kutu, kami sampaikan di depan, bukan setelah bayar.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">04</span>
          <h3>Harga tidak berubah</h3>
          <p>Biaya disebut di awal. Tidak ada tambahan yang muncul di akhir.</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      <div class="cta rise">
        <h2 class="display h-xl">Giliran anabulmu</h2>
        <p>Kalau cerita di atas terdengar seperti yang kamu cari, mampir atau pesan jadwal dulu.</p>
        <a class="btn btn--ink" href="contact.html" data-magnetic>
          <span>Pesan jadwal</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>
  </section>
"""

PAGES = {
    "team.html": (
        "Tim",
        "Staf tetap Zoepy Petshop Jogja yang menangani grooming, pet hotel dan toko.",
        TEAM_BODY,
    ),
    "testimonial.html": (
        "Cerita Pelanggan",
        "Apa kata pelanggan Zoepy Petshop Jogja setelah membawa anabulnya pulang.",
        TESTIMONIAL_BODY,
    ),
}


def main() -> int:
    for filename, (title, description, body) in PAGES.items():
        html = (
            head(title, description)
            + nav(filename)
            + "\n<main>\n"
            + body
            + "</main>\n"
            + FOOTER
            + CHROME_TAIL
        )
        (ROOT / filename).write_text(html, encoding="utf-8")
        print(f"  {filename:20} {len(html.splitlines()):>4} baris  hydrate={html.count('data-hydrate')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
