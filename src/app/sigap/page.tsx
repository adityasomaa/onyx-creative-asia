import Link from "next/link";

/**
 * Sigap landing page. Single page, no nav (just the logo word + a CTA),
 * no Framer/Lenis/Cursor — every byte costs on a UMKM owner's mobile
 * connection. Total JS payload target: <50kb. Total page weight <100kb.
 *
 * Funnel order is deliberate:
 *   1. Hero — value prop + price anchor + immediate WA CTA above fold
 *   2. Pain points — three UMKM-specific frustrations
 *   3. Packages — three productized tiers with fixed scope
 *   4. Proses — three-step "chat → bayar → terima"
 *   5. Testimoni — placeholder until real ones land
 *   6. FAQ — five questions that handle the most common objections
 *   7. Final CTA + footer
 * Plus a floating WA button always pinned bottom-right.
 */

const WA_NUMBER =
  process.env.NEXT_PUBLIC_SIGAP_WA_NUMBER ??
  process.env.NEXT_PUBLIC_WA_NUMBER ??
  "62895413372822";
const WA_DISPLAY =
  process.env.NEXT_PUBLIC_SIGAP_WA_DISPLAY ??
  process.env.NEXT_PUBLIC_WA_DISPLAY ??
  "+62 895-4133-72822";
const EARLYBIRD_LEFT = Number(
  process.env.NEXT_PUBLIC_SIGAP_EARLYBIRD_LEFT ?? "10"
);

function waLink(prefill: string): string {
  const encoded = encodeURIComponent(prefill);
  return `https://wa.me/${WA_NUMBER}?text=${encoded}`;
}

type Package = {
  id: string;
  name: string;
  price: number;
  earlyBirdPrice: number | null;
  delivery: string;
  tagline: string;
  includes: string[];
  featured?: boolean;
};

const PACKAGES: Package[] = [
  {
    id: "mulai",
    name: "Mulai",
    price: 500_000,
    earlyBirdPrice: 350_000,
    delivery: "3 hari",
    tagline: "Buat usaha yang baru mulai cari identitas.",
    includes: [
      "1 logo + 3 file format (PNG, JPG, PDF)",
      "Pilihan warna & font brand",
      "Mini brand guide 1 halaman",
      "1 kali revisi",
    ],
  },
  {
    id: "tumbuh",
    name: "Tumbuh",
    price: 1_000_000,
    earlyBirdPrice: null,
    delivery: "5 hari",
    tagline: "Paling banyak dipilih. Untuk yang serius bangun IG.",
    includes: [
      "Semua isi paket Mulai",
      "9 template IG feed (editable di Canva)",
      "Bio IG + highlight cover set",
      "Caption pattern untuk 4 minggu",
      "1 kali revisi per item",
    ],
    featured: true,
  },
  {
    id: "lengkap",
    name: "Lengkap",
    price: 1_800_000,
    earlyBirdPrice: null,
    delivery: "7 hari",
    tagline: "Sekali jadi: brand, sosmed, web.",
    includes: [
      "Semua isi paket Tumbuh",
      "Landing page 1 halaman (Hostinger setup)",
      "1 video Reels intro (15 detik)",
      "Domain & hosting setup dibantu",
      "1 kali revisi per item",
    ],
  },
];

const PAIN_POINTS = [
  {
    title: "Logo masih bikin sendiri di Canva.",
    body: "Tampilan jadi mirip ratusan toko lain. Calon pembeli nggak inget kamu.",
  },
  {
    title: "IG kosong, malu di-share ke calon klien.",
    body: "Mau posting tapi nggak tau mulai dari mana. Tiap kali buka Canva, deadline geser lagi.",
  },
  {
    title: "Pengen punya web tapi takut mahal.",
    body: "Quote dari agensi mulai 5 juta. Padahal cuma butuh halaman tunggal buat brosur online.",
  },
];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Chat di WhatsApp",
    body: "Cerita usaha kamu, pilih paket. Konsultasi nggak dipungut biaya.",
  },
  {
    n: "02",
    title: "Transfer & isi brief",
    body: "Transfer manual via BCA/Mandiri. Isi brief singkat (5 menit), kita mulai kerja.",
  },
  {
    n: "03",
    title: "Terima hasil 3–7 hari",
    body: "Semua file dikirim via WhatsApp. Revisi gampang, cukup chat balik.",
  },
];

const FAQ = [
  {
    q: "Kenapa harganya jauh lebih murah dari agensi lain?",
    a: "Karena scope-nya kita tetapkan dari awal — paket fixed, nggak ada negosiasi tambahan di tengah jalan. Kita pakai AI tools untuk mempercepat proses produksi, tapi setiap output tetap di-review tangan manusia (Onyx Creative Asia). Yang kita potong itu waktu, bukan kualitas.",
  },
  {
    q: "Termasuk apa aja yang aku dapet?",
    a: "Semua file final (logo, template, web) jadi milik kamu sepenuhnya. Source file editable di Canva untuk paket Tumbuh ke atas. Untuk landing page, kita kasih kamu akses Hostinger jadi kamu bisa edit sendiri ke depannya.",
  },
  {
    q: "Kalo hasilnya nggak cocok gimana?",
    a: "Setiap paket sudah include 1 kali revisi per item. Kalo masih kurang sreg, kita refund 50% dan hentikan proyek. Kita lebih baik kehilangan setengah revenue daripada kamu pakai logo yang kamu sendiri ragu.",
  },
  {
    q: "Bisa pakai bahasa daerah / bahasa asing?",
    a: "Bisa. Copy yang kita siapkan default Bahasa Indonesia, tapi kalo kamu punya tagline atau caption dalam bahasa lain (Bali, Sunda, Inggris), kirim aja saat brief.",
  },
  {
    q: "Setelah selesai, bisa nambah lagi nanti?",
    a: "Bisa. Banyak klien mulai dari paket Mulai, terus naik ke Tumbuh setelah 2-3 bulan pas IG-nya udah jalan. Kita kasih harga upgrade yang fair (selisih paket, bukan harga full).",
  },
];

export default function SigapLanding() {
  return (
    <>
      {/* ─────────────────── TOP BAR ─────────────────── */}
      <header className="border-b border-sigap-line">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 h-14 flex items-center justify-between">
          <span className="font-semibold tracking-tight text-lg">
            Sigap<span className="text-sigap-rust">.</span>
          </span>
          <Link
            href={waLink("Halo Sigap, saya mau tanya soal paket.")}
            className="text-xs sm:text-sm rounded-full bg-sigap-ink text-sigap-cream px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Chat di WA
          </Link>
        </div>
      </header>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24">
        {EARLYBIRD_LEFT > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full border border-sigap-rust/30 bg-sigap-rust/10 px-3 py-1 text-xs text-sigap-rust mb-6">
            <span className="block h-1.5 w-1.5 rounded-full bg-sigap-rust animate-pulse" />
            <span className="font-medium">
              {EARLYBIRD_LEFT} slot tersisa
            </span>
            <span className="opacity-80">— harga early-bird Rp 350rb</span>
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl">
          Branding & web buat UMKM,{" "}
          <span className="text-sigap-rust">mulai dari Rp 500rb.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-sigap-muted leading-relaxed max-w-2xl">
          Logo, IG, sampai landing page — paket jadi, harga jujur, selesai
          dalam 3 sampai 7 hari. Semua dikerjakan via WhatsApp, nggak ribet.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
          <Link
            href={waLink(
              "Halo Sigap, saya tertarik. Boleh konsultasi dulu soal paket yang cocok?"
            )}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sigap-rust text-sigap-cream px-6 py-3.5 text-base font-medium hover:opacity-90 transition-opacity"
          >
            Konsultasi gratis di WA
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#paket"
            className="inline-flex items-center justify-center gap-2 text-base text-sigap-ink/80 hover:text-sigap-ink underline underline-offset-4 decoration-sigap-line hover:decoration-sigap-ink transition-colors px-4 py-2"
          >
            Lihat paket
          </Link>
        </div>
        <p className="mt-5 text-xs text-sigap-muted">
          {WA_DISPLAY} · Senin–Sabtu 8–22 WITA · Konsultasi awal gratis
        </p>
      </section>

      {/* ─────────────────── PAIN POINTS ─────────────────── */}
      <section className="border-t border-sigap-line bg-sigap-cream-deep/50">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-sigap-rust mb-3">
            Masalah yang kamu mungkin alami
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight max-w-2xl">
            Kalau salah satu dari ini kerasa familiar,
            <br className="hidden sm:block" />
            <span className="text-sigap-rust">kita bisa bantu.</span>
          </h2>
          <ul className="mt-10 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            {PAIN_POINTS.map((p, i) => (
              <li
                key={i}
                className="border border-sigap-line bg-sigap-cream p-5 sm:p-6 rounded-lg"
              >
                <p className="text-xs font-mono text-sigap-rust mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-semibold text-lg leading-snug mb-2">
                  {p.title}
                </p>
                <p className="text-sm text-sigap-muted leading-relaxed">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────── PAKET ─────────────────── */}
      <section id="paket" className="border-t border-sigap-line">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-sigap-rust mb-3">
            Pilih paket
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight max-w-2xl">
            Tiga paket, harga jelas,
            <br className="hidden sm:block" />{" "}
            <span className="text-sigap-rust">tanpa biaya tersembunyi.</span>
          </h2>
          <p className="mt-4 text-sigap-muted max-w-xl">
            Scope udah ditentukan dari awal. Nggak ada kejutan di tengah,
            nggak ada tambah-tambah biaya. Kalau butuh lebih, tinggal pindah
            paket.
          </p>

          <div className="mt-10 grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`relative flex flex-col rounded-xl border p-6 sm:p-7 ${
                  pkg.featured
                    ? "border-sigap-rust bg-sigap-cream-deep/40 sm:scale-[1.02] shadow-sm"
                    : "border-sigap-line bg-sigap-cream"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-6 inline-block rounded-full bg-sigap-rust text-sigap-cream text-[10px] uppercase tracking-[0.18em] px-3 py-1 font-medium">
                    Paling dipilih
                  </span>
                )}
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {pkg.name}
                  </h3>
                  <span className="text-xs text-sigap-muted">
                    {pkg.delivery}
                  </span>
                </div>
                <p className="text-sm text-sigap-muted italic mb-5">
                  {pkg.tagline}
                </p>
                <div className="mb-6">
                  {pkg.earlyBirdPrice && EARLYBIRD_LEFT > 0 ? (
                    <>
                      <p className="text-sm line-through text-sigap-muted/70">
                        Rp {pkg.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-3xl font-bold text-sigap-rust tracking-tight">
                        Rp {pkg.earlyBirdPrice.toLocaleString("id-ID")}
                      </p>
                      <p className="text-[11px] text-sigap-rust mt-1">
                        Early-bird, {EARLYBIRD_LEFT} slot tersisa
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold tracking-tight">
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
                <ul className="space-y-2.5 text-sm mb-7 flex-1">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden
                        className="text-sigap-rust text-xs mt-1 shrink-0"
                      >
                        ✓
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={waLink(
                    `Halo Sigap, saya tertarik paket ${pkg.name} (Rp ${(pkg.earlyBirdPrice && EARLYBIRD_LEFT > 0 ? pkg.earlyBirdPrice : pkg.price).toLocaleString("id-ID")}). Bisa konsultasi dulu?`
                  )}
                  className={`block text-center rounded-full px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 ${
                    pkg.featured
                      ? "bg-sigap-rust text-sigap-cream"
                      : "bg-sigap-ink text-sigap-cream"
                  }`}
                >
                  Pilih paket {pkg.name}
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-8 text-xs text-sigap-muted text-center">
            Pembayaran transfer manual (BCA / Mandiri / BRI). DP 50% atau
            lunas di muka — pilih yang nyaman.
          </p>
        </div>
      </section>

      {/* ─────────────────── PROSES ─────────────────── */}
      <section className="border-t border-sigap-line bg-sigap-cream-deep/50">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-sigap-rust mb-3">
            Prosesnya
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight max-w-2xl">
            Tiga langkah, semuanya{" "}
            <span className="text-sigap-rust">via WhatsApp.</span>
          </h2>

          <ol className="mt-10 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step.n}
                className="bg-sigap-cream border border-sigap-line p-6 rounded-lg"
              >
                <p className="text-3xl font-bold text-sigap-rust mb-3 tabular-nums">
                  {step.n}
                </p>
                <p className="font-semibold text-lg mb-2">{step.title}</p>
                <p className="text-sm text-sigap-muted leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────────────── TESTIMONI (placeholder) ─────────────────── */}
      <section className="border-t border-sigap-line">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-sigap-rust mb-3">
            Cerita klien
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight max-w-2xl">
            Testimoni klien pertama bakal{" "}
            <span className="text-sigap-rust">tampil di sini.</span>
          </h2>
          <p className="mt-5 text-sigap-muted max-w-xl text-sm leading-relaxed">
            Kita baru aja launching, jadi belum ada testimoni public. Mau
            jadi salah satu klien pertama? Chat WA dan dapet harga
            early-bird (selama slot masih ada).
          </p>
          <Link
            href={waLink(
              "Halo Sigap, saya mau jadi salah satu klien pertama. Boleh tanya-tanya?"
            )}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sigap-rust hover:opacity-80"
          >
            Jadi klien pertama →
          </Link>
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="border-t border-sigap-line bg-sigap-cream-deep/50">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-sigap-rust mb-3">
            Sering ditanya
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-10">
            Pertanyaan{" "}
            <span className="text-sigap-rust">yang sering masuk.</span>
          </h2>
          <ul className="space-y-3">
            {FAQ.map((item, i) => (
              <li
                key={i}
                className="bg-sigap-cream border border-sigap-line rounded-lg"
              >
                <details className="group">
                  <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-start justify-between gap-4">
                    <span className="font-semibold leading-snug">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="text-sigap-rust text-xl leading-none mt-0.5 transition-transform duration-300 group-open:rotate-45 shrink-0"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-sigap-muted leading-relaxed">
                    {item.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA ─────────────────── */}
      <section className="border-t border-sigap-line bg-sigap-ink text-sigap-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20 sm:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Siap mulai?
            <br />
            <span className="text-sigap-rust-soft italic font-light">
              Chat dulu, gratis.
            </span>
          </h2>
          <p className="mt-6 text-sigap-cream/75 max-w-xl mx-auto leading-relaxed">
            Cerita aja dulu usaha kamu lewat WA. Kita kasih saran paket yang
            paling cocok — kalau ternyata kamu nggak butuh apa-apa, kita
            bilang juga.
          </p>
          <Link
            href={waLink(
              "Halo Sigap, saya mau konsultasi soal usaha saya."
            )}
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-sigap-rust text-sigap-cream px-7 py-4 text-base font-medium hover:opacity-90 transition-opacity"
          >
            Konsultasi di WhatsApp
            <span aria-hidden>→</span>
          </Link>
          <p className="mt-5 text-xs text-sigap-cream/55">{WA_DISPLAY}</p>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="border-t border-sigap-line">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-sigap-muted">
          <p>
            <span className="font-semibold text-sigap-ink">
              Sigap<span className="text-sigap-rust">.</span>
            </span>{" "}
            — paket digital untuk UMKM
          </p>
          <p className="text-xs">
            Powered by{" "}
            <a
              href="https://onyxcreative.asia"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sigap-ink transition-colors"
            >
              Onyx Creative Asia
            </a>{" "}
            · Bali, ID
          </p>
        </div>
      </footer>

      {/* ─────────────────── FLOATING WA BUTTON ─────────────────── */}
      <Link
        href={waLink("Halo Sigap, saya mau tanya soal paket.")}
        aria-label="Chat via WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3.5 shadow-lg shadow-black/15 hover:scale-105 transition-transform active:scale-100"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path d="M17.6 6.32A8 8 0 0 0 4 12.05a8 8 0 0 0 1.15 4.07L4 21l5.05-1.13A8 8 0 0 0 12 20.1a8 8 0 0 0 5.6-13.78ZM12 18.6a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.99.67.67-2.91-.16-.25a6.6 6.6 0 1 1 12.27-3.4A6.6 6.6 0 0 1 12 18.6Zm3.62-4.95c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.11-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.11.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.09-.62-1.5-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.69 0 1 .72 1.96.82 2.1.1.13 1.42 2.17 3.44 3.04.48.21.86.33 1.15.43.48.15.92.13 1.26.08.38-.06 1.18-.48 1.35-.95.17-.46.17-.86.12-.95-.05-.09-.18-.14-.38-.24Z" />
        </svg>
        <span className="text-sm font-medium">WA</span>
      </Link>
    </>
  );
}
