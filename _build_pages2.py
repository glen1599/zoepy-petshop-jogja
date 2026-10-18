"""Bangun lima halaman yang isinya masih Lorem Ipsum.

Chrome bersama (head, nav, footer, script) diimpor dari _build_pages.py supaya
hanya badan halaman yang ditulis di sini.

    python3 _build_pages2.py
"""

from __future__ import annotations

from _build_pages import CHROME_TAIL, FOOTER, head, nav, page_header
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def page(slug: str, title: str, description: str, eyebrow: str, h1: str, lede: str, body: str) -> str:
    return (
        head(title, description)
        + nav(slug)
        + "\n<main>\n"
        + page_header(eyebrow, h1, lede)
        + body
        + "</main>\n"
        + FOOTER
        + CHROME_TAIL
    )


CTA = """
  <section class="section">
    <div class="shell">
      <div class="cta rise">
        <h2 class="display h-xl">{title}</h2>
        <p>{text}</p>
        <a class="btn btn--ink" href="contact.html" data-magnetic>
          <span>{cta}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>
  </section>
"""

# --- about ------------------------------------------------------------------

ABOUT = """
  <section class="section" style="padding-top:0">
    <div class="shell">
      <div class="split">
        <figure class="split__media">
          <img src="img/about.jpg" alt="Pekerja Zoepy Petshop merawat hewan peliharaan" width="900" height="1125">
        </figure>
        <div class="split__body">
          <h2 class="display h-lg">Berawal dari satu rak pakan</h2>
          <p class="page-lede" style="margin-top:1.25rem">
            Zoepy mulai sebagai rak kecil berisi tiga jenis pakan di rumah, sekitar 2019.
            Yang datang awalnya tetangga sendiri — lalu merekalah yang menitipkan temannya,
            dan seterusnya sampai hari ini.
          </p>
          <p class="page-lede">
            Kami tidak pernah membuka cabang, karena hal yang paling sering dipuji pelanggan
            justru hal yang paling sulit diduplikasi: orang yang sama, yang sudah tahu anabulmu
            yang mana. Menambah cabang berarti mengganti itu dengan prosedur.
          </p>
          <p class="page-lede">
            Yang kami jual bukan yang paling banyak diskonnya, tapi yang kami pakai sendiri ke
            hewan kami. Kalau sebuah produk tidak kami percayai, ia tidak masuk rak.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--obsidian-2">
    <div class="shell">
      <div class="head">
        <div class="head__title">
          <p class="eyebrow rise">Yang kami pegang</p>
          <h2 class="display h-xl rise" style="margin-top:1.25rem">Empat hal yang tidak kami ubah</h2>
        </div>
        <p class="head__note rise">Bukan nilai yang ditempel di dinding — ini yang menentukan keputusan harian kami.</p>
      </div>
      <ol class="steps">
        <li class="step rise">
          <span class="step__num display">01</span>
          <h3>Jujur sebelum bayar</h3>
          <p>Kalau kami menemukan jamur, kutu atau masalah kulit, kami bilang di awal beserta biayanya. Bukan setelah semuanya selesai.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">02</span>
          <h3>Tidak memaksa hewan</h3>
          <p>Anabul yang ketakutan kami tenangkan dulu. Kalau hari itu tidak memungkinkan, kami sarankan kembali lain waktu.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">03</span>
          <h3>Catat, jangan hafal</h3>
          <p>Setiap anabul punya catatan perawatan. Jadi staf mana pun yang bertugas tahu riwayatnya.</p>
        </li>
        <li class="step rise">
          <span class="step__num display">04</span>
          <h3>Menerima kritik</h3>
          <p>Kalau hasilnya kurang memuaskan, bilang langsung. Kami ulang — tanpa ditanya dua kali.</p>
        </li>
      </ol>
    </div>
  </section>
""" + CTA.format(
    title="Mampir dulu, kenalan",
    text="Tidak perlu booking untuk sekadar melihat tempatnya atau bertanya soal anabulmu.",
    cta="Lokasi & kontak",
)

# --- product ----------------------------------------------------------------

PRODUCT = """
  <section class="section" style="padding-top:0">
    <div class="shell">
      <p class="head__note" style="margin-bottom:2rem">
        Harga dapat berubah — konfirmasi lewat WhatsApp sebelum datang. Yang tidak ada di rak,
        biasanya bisa kami carikan.
      </p>
      <div class="product-grid" data-hydrate="product-grid">
        <!-- Cadangan kalau JavaScript mati. -->
        <article class="product">
          <div class="product__media"><img src="img/product-1.png" alt="Pakan kucing premium" width="400" height="400"></div>
          <div class="product__body"><h3>Pakan Kucing Premium</h3><p>Protein tinggi untuk kucing dewasa aktif.</p><div class="product__price">Rp 185.000</div></div>
        </article>
        <article class="product">
          <div class="product__media"><img src="img/product-2.png" alt="Pakan anjing dewasa" width="400" height="400"></div>
          <div class="product__body"><h3>Pakan Anjing Dewasa</h3><p>Formula seimbang menjaga berat badan.</p><div class="product__price">Rp 240.000</div></div>
        </article>
      </div>
    </div>
  </section>
""" + CTA.format(
    title="Ragu pilih yang mana?",
    text="Sebutkan umur, ras dan kondisi anabulmu — kami sarankan yang cocok, bukan yang paling mahal.",
    cta="Tanya lewat kontak",
)

# --- detail -----------------------------------------------------------------

DETAIL = """
  <section class="section" style="padding-top:0">
    <div class="shell" data-hydrate="product-detail">
      <p class="info__note">
        Halaman ini membaca <code>?id=</code> dari daftar produk.
        <a href="product.html">Lihat semua produk →</a>
      </p>
    </div>
  </section>
"""

# --- price ------------------------------------------------------------------

PRICE = """
  <section class="section" style="padding-top:0">
    <div class="shell">
      <div class="plans" data-hydrate="plans">
        <!-- Cadangan kalau JavaScript mati. -->
        <article class="plan"><span class="plan__name">Basic</span><div class="plan__price">Rp 75<small> rb / kunjungan</small></div><ul><li>Mandi &amp; blow dry</li><li>Potong kuku</li></ul></article>
        <article class="plan plan--featured"><span class="plan__name">Standard</span><div class="plan__price">Rp 120<small> rb / kunjungan</small></div><ul><li>Semua di Basic</li><li>Perawatan kutu &amp; jamur</li></ul></article>
        <article class="plan"><span class="plan__name">Extended</span><div class="plan__price">Rp 180<small> rb / kunjungan</small></div><ul><li>Semua di Standard</li><li>Medicated bath</li></ul></article>
      </div>
    </div>
  </section>

  <section class="section section--obsidian-2">
    <div class="shell">
      <div class="head">
        <div class="head__title">
          <p class="eyebrow rise">Soal biaya</p>
          <h2 class="display h-xl rise" style="margin-top:1.25rem">Yang sering bikin bingung</h2>
        </div>
      </div>
      <div class="faq">
        <details class="faq__item rise">
          <summary>Kenapa harga bisa berbeda dari daftar ini?</summary>
          <p>Tarif di atas berlaku untuk anabul berukuran sedang dengan bulu tidak kusut. Yang besar, bulunya sangat kusut, atau butuh penanganan kulit khusus akan kami sebutkan biayanya sebelum mulai — tidak pernah setelah selesai.</p>
        </details>
        <details class="faq__item rise">
          <summary>Apakah konsultasi kesehatan sudah termasuk?</summary>
          <p>Pemeriksaan kulit ringan sudah termasuk di paket Standard dan Extended. Vaksinasi dan tindakan medis ditagih terpisah sesuai tindakan dan harga obatnya.</p>
        </details>
        <details class="faq__item rise">
          <summary>Ada paket langganan?</summary>
          <p>Belum kami jadikan paket resmi, tapi pelanggan yang datang rutin biasanya kami beri harga khusus saat perpanjangan. Tanyakan langsung saat datang.</p>
        </details>
        <details class="faq__item rise">
          <summary>Metode pembayaran apa saja?</summary>
          <p>Tunai, transfer bank, dan QRIS. Untuk penitipan lebih dari tiga hari, kami minta uang muka setengah.</p>
        </details>
      </div>
    </div>
  </section>
""" + CTA.format(
    title="Pesan jadwal",
    text="Sebutkan layanan yang kamu mau, kami konfirmasi harga finalnya saat itu juga.",
    cta="Booking sekarang",
)

# --- blog -------------------------------------------------------------------

BLOG = """
  <section class="section" style="padding-top:0">
    <div class="shell">
      <div class="posts" data-hydrate="posts-page">
        <!-- Cadangan kalau JavaScript mati. -->
        <article class="post">
          <img src="img/blog-1.jpg" alt="" width="800" height="500">
          <div class="post__body">
            <span class="post__date">Perawatan</span>
            <h3>Seberapa sering anabul perlu dimandikan?</h3>
            <p>Jawabannya tergantung jenis bulu dan aktivitas.</p>
          </div>
        </article>
      </div>
      <p class="info__note" style="margin-top:2rem">
        Kami menulis pelan-pelan — biasanya saat ada pertanyaan yang berulang datang dari pelanggan.
      </p>
    </div>
  </section>
""" + CTA.format(
    title="Ada pertanyaan yang belum terjawab?",
    text="Kirim lewat WhatsApp. Kalau pertanyaannya sering muncul, biasanya jadi tulisan berikutnya.",
    cta="Hubungi kami",
)

PAGES = {
    "about.html": (
        "Profil Toko",
        "Cerita, nilai dan cara kerja Zoepy Petshop Jogja.",
        "Profil",
        "Toko kecil dengan aturan yang jelas",
        "Kami tidak pernah membuka cabang, karena hal yang paling sering dipuji pelanggan "
        "justru hal yang paling sulit diduplikasi.",
        ABOUT,
    ),
    "product.html": (
        "Produk",
        "Pakan, vitamin, pasir dan perlengkapan hewan yang tersedia di Zoepy Petshop Jogja.",
        "Produk",
        "Semua yang kami pakai sendiri",
        "Kalau sebuah produk tidak kami percayai untuk hewan kami, ia tidak masuk rak.",
        PRODUCT,
    ),
    "detail.html": (
        "Detail Produk",
        "Detail salah satu produk Zoepy Petshop Jogja.",
        "Detail produk",
        "Lihat satu produk",
        "Buka halaman ini dari daftar produk untuk melihat detail lengkapnya.",
        DETAIL,
    ),
    "price.html": (
        "Harga",
        "Paket grooming dan perawatan Zoepy Petshop Jogja dengan harga yang jelas.",
        "Harga",
        "Harga jelas, tanpa kejutan",
        "Biaya disebut di awal. Tidak ada tambahan yang muncul setelah semuanya selesai.",
        PRICE,
    ),
    "blog.html": (
        "Blog",
        "Catatan perawatan, nutrisi dan kehidupan sehari-hari di Zoepy Petshop Jogja.",
        "Catatan",
        "Dari meja belakang toko",
        "Bukan artikel SEO. Ini hal-hal yang kami pelajari sambil mengerjakan, ditulis saat "
        "pertanyaannya sudah muncul berkali-kali.",
        BLOG,
    ),
}


def main() -> int:
    for filename, (title, description, eyebrow, h1, lede, body) in PAGES.items():
        html = page(filename, title, description, eyebrow, h1, lede, body)
        (ROOT / filename).write_text(html, encoding="utf-8")
        print(f"  {filename:16} {len(html.splitlines()):>4} baris  hook={html.count('data-hydrate')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
