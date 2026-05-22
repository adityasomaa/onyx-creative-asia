import Link from "next/link";
import Reveal, { RevealText } from "@/components/Reveal";
import Marquee from "@/components/Marquee";

/**
 * Sigap landing — Onyx editorial monochrome treatment on a sub-brand
 * for UMKM. Single page, WA-first funnel (links go to wa.me, but the
 * copy doesn't keep announcing "everything via WhatsApp" — operator
 * preference). Animations driven by Reveal + RevealText (Framer Motion),
 * smooth scroll via Lenis (mounted in the layout).
 *
 * Italic + display sizes: every italic line that lives inside a tight
 * leading wrapper uses a `pb-[0.18em]` cushion so the descenders (g, p,
 * y, j, italic R / Q) don't get clipped by line-height math. This is
 * the same fix the main site uses for .reveal-mask — repeated inline
 * because we sometimes use plain italic spans, not RevealText.
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
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(prefill)}`;
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
      "Pilihan warna dan font brand",
      "Mini brand guide 1 halaman",
      "1 kali revisi",
    ],
  },
  {
    id: "tumbuh",
    name: "Tumbuh",
    price: 750_000,
    earlyBirdPrice: null,
    delivery: "5 hari",
    tagline: "Paling banyak dipilih. Untuk yang serius bangun IG.",
    includes: [
      "Semua isi paket Mulai",
      "9 template IG feed (editable di Canva)",
      "Bio IG dan highlight cover set",
      "Caption pattern untuk 4 minggu",
      "1 kali revisi per item",
    ],
    featured: true,
  },
  {
    id: "lengkap",
    name: "Lengkap",
    price: 1_000_000,
    earlyBirdPrice: null,
    delivery: "7 hari",
    tagline: "Sekali jadi: brand, sosmed, web.",
    includes: [
      "Semua isi paket Tumbuh",
      "Landing page 1 halaman (Hostinger setup)",
      "1 video Reels intro (15 detik)",
      "Domain dan hosting setup dibantu",
      "1 kali revisi per item",
    ],
  },
];

const PAIN_POINTS = [
  {
    n: "01",
    title: "Logo masih bikin sendiri di Canva.",
    body: "Tampilan jadi mirip ratusan toko lain. Calon pembeli nggak inget kamu.",
  },
  {
    n: "02",
    title: "IG kosong, malu di-share ke calon klien.",
    body: "Mau posting tapi nggak tau mulai dari mana. Tiap kali buka Canva, deadline geser lagi.",
  },
  {
    n: "03",
    title: "Pengen punya web tapi takut mahal.",
    body: "Quote dari agensi mulai 5 juta. Padahal cuma butuh halaman tunggal buat brosur online.",
  },
];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Chat dan konsultasi",
    body: "Cerita usaha kamu, pilih paket. Konsultasi awal nggak dipungut biaya.",
  },
  {
    n: "02",
    title: "Transfer dan isi brief",
    body: "Transfer manual ke BCA, Mandiri, atau BRI. Isi brief singkat 5 menit, kita mulai kerja.",
  },
  {
    n: "03",
    title: "Terima hasil 3 sampai 7 hari",
    body: "Semua file dikirim langsung. Revisi gampang, cukup balas chat.",
  },
];

const FAQ = [
  {
    q: "Kenapa harganya jauh lebih murah dari agensi lain?",
    a: "Karena scope-nya kita tetapkan dari awal. Paket fixed, nggak ada negosiasi tambahan di tengah jalan. Kita pakai AI tools untuk mempercepat proses produksi, tapi setiap output tetap di-review tangan manusia (Onyx Creative Asia). Yang kita potong itu waktu, bukan kualitas.",
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
    q: "Bisa pakai bahasa daerah atau bahasa asing?",
    a: "Bisa. Copy yang kita siapkan default Bahasa Indonesia, tapi kalo kamu punya tagline atau caption dalam bahasa lain (Bali, Sunda, Inggris), kirim aja saat brief.",
  },
  {
    q: "Setelah selesai, bisa nambah lagi nanti?",
    a: "Bisa. Banyak klien mulai dari paket Mulai, terus naik ke Tumbuh setelah 2 sampai 3 bulan pas IG-nya udah jalan. Kita kasih harga upgrade yang fair (selisih paket, bukan harga full).",
  },
];

// Placeholder trust signals for the marquee strip. Swap with real
// client names or counts as they accumulate.
const TRUST_SIGNALS = [
  "Powered by Onyx Creative Asia",
  "Berbasis di Bali, melayani seluruh Indonesia",
  "Logo, IG, dan web dalam satu paket",
  "Mulai Rp 500rb · selesai 3 sampai 7 hari",
  "Refund 50% kalau hasilnya nggak cocok",
];

// Dummy testimonials. First entry paraphrases the actual Onyx case
// study for The Hair Extensions Bali (a premium-tier client, used here
// as a placeholder until Sigap-tier testimonials land). The other two
// are plausible UMKM-shaped voices, also placeholders. Replace each
// time real signed-off feedback comes in.
const TESTIMONIALS = [
  {
    quote:
      "Web kita selesai dalam waktu cepat, langsung jalan booking via WhatsApp. Pricing IDR transparan di tiap method, dan klien yang biasanya cuma DM IG sekarang langsung pesan lewat web. Editorial gallery-nya pas sama kelas studio kita.",
    author: "The Hair Extensions Bali",
    role: "Premium salon by appointment",
    location: "Kerobokan, Bali",
    link: "https://thehairextensionsbali.com",
  },
  {
    quote:
      "Logo selesai 3 hari, langsung bisa dipake buat brosur sama IG. Chat-nya santai, nggak ribet meeting. Harga jujur dari awal, sesuai paket, nggak ada biaya tambahan.",
    author: "Sari Wulandari",
    role: "Owner, Kopi Bumi",
    location: "Denpasar",
  },
  {
    quote:
      "Awalnya ragu karena harganya jauh lebih murah dari quote yang lain. Tapi pas terima file, kualitasnya niat. Template IG-nya editable di Canva jadi gampang dipake terus.",
    author: "Adit Pradana",
    role: "Founder, Rumah Bumbu",
    location: "Yogyakarta",
  },
];

export default function SigapLanding() {
  return (
    <>
      {/* ─────────────────── TOP BAR ─────────────────── */}
      <header className="border-b border-hairline">
        <div className="container-x flex h-14 md:h-16 items-center justify-between">
          <span className="text-sm md:text-base font-medium tracking-tight">
            Sigap<span className="font-light italic">.</span>
          </span>
          <Link
            href={waLink("Halo Sigap, saya mau tanya soal paket.")}
            className="inline-flex items-center gap-2 rounded-full bg-ink text-bone px-4 py-2 text-xs sm:text-sm transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
          >
            Konsultasi
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="container-x pt-20 sm:pt-28 md:pt-32 pb-20 md:pb-28">
        {EARLYBIRD_LEFT > 0 && (
          <Reveal>
            <p className="inline-flex items-center gap-2.5 text-[10px] sm:text-xs uppercase tracking-[0.22em] opacity-70 mb-8 border-b border-hairline pb-3">
              <span className="block h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
              {EARLYBIRD_LEFT} slot tersisa · harga early-bird Rp 350rb
            </p>
          </Reveal>
        )}
        <h1 className="text-display-md font-medium leading-[1.0] tracking-tight max-w-4xl text-balance">
          <RevealText text="Branding dan web buat UMKM," />
          <br />
          <span className="block font-light italic leading-[1.1] pb-[0.12em]">
            <RevealText text="mulai dari Rp 500rb." delay={0.15} />
          </span>
        </h1>
        <Reveal delay={0.35}>
          <p className="mt-12 max-w-xl text-lg md:text-xl text-ink/70 leading-relaxed">
            Logo, IG, sampai landing page. Paket jadi, harga jujur, selesai
            dalam 3 sampai 7 hari. Nggak ribet.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <Link
              href={waLink(
                "Halo Sigap, saya tertarik. Boleh konsultasi dulu soal paket yang cocok?"
              )}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-bone px-6 py-3.5 text-base transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
            >
              Konsultasi gratis
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="#paket"
              className="inline-flex items-center justify-center gap-2 text-base text-ink/70 hover:text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink transition-colors px-4 py-2"
            >
              Lihat paket
            </Link>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] opacity-55">
            {WA_DISPLAY} · Senin sampai Sabtu, 8 sampai 22 WITA
          </p>
        </Reveal>
      </section>

      {/* ─────────────────── MARQUEE TRUST STRIP ─────────────────── */}
      <section className="border-y border-hairline py-5 opacity-65">
        <Marquee items={TRUST_SIGNALS} className="text-xs" />
      </section>

      {/* ─────────────────── PAIN POINTS ─────────────────── */}
      <section className="container-x py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-14 md:mb-20">
          <Reveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
              (Yang sering dialami)
            </p>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-6" delay={0.1}>
            <h2 className="text-display-sm font-medium leading-[1.0] tracking-tight max-w-3xl text-balance">
              Kalau salah satu ini kerasa familiar,{" "}
              <span className="font-light italic leading-[1.1]">
                kita bisa bantu.
              </span>
            </h2>
          </Reveal>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border-y border-hairline">
          {PAIN_POINTS.map((p, i) => (
            <li key={p.n} className="bg-bone p-8 md:p-10">
              <Reveal delay={i * 0.1}>
                <p className="text-xs uppercase tracking-[0.22em] opacity-55 tabular-nums mb-5">
                  {p.n} / 03
                </p>
                <p className="text-xl md:text-2xl font-medium leading-tight tracking-tight mb-4">
                  {p.title}
                </p>
                <p className="text-sm md:text-base text-ink/65 leading-relaxed">
                  {p.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ─────────────────── PAKET ─────────────────── */}
      <section
        id="paket"
        className="border-t border-hairline bg-ink text-bone"
      >
        <div className="container-x py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-14 md:mb-20">
            <Reveal className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
                (Pilih paket)
              </p>
            </Reveal>
            <Reveal className="md:col-span-8 md:col-start-6" delay={0.1}>
              <h2 className="text-display-sm font-medium leading-[1.0] tracking-tight max-w-3xl text-balance">
                Tiga paket, harga jelas,{" "}
                <span className="font-light italic leading-[1.1]">
                  tanpa biaya tersembunyi.
                </span>
              </h2>
              <p className="mt-6 text-base md:text-lg text-bone/70 leading-relaxed max-w-xl">
                Scope udah ditentukan dari awal. Nggak ada kejutan di
                tengah, nggak ada tambah-tambah biaya. Kalau butuh lebih,
                tinggal pindah paket.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/15 border-y border-bone/15">
            {PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.id} className="bg-ink" delay={i * 0.1}>
                <article
                  className={`relative flex flex-col h-full p-8 md:p-10 ${
                    pkg.featured ? "bg-bone/[0.04]" : ""
                  }`}
                >
                  {pkg.featured && (
                    <span className="absolute top-6 right-6 inline-block text-[10px] uppercase tracking-[0.22em] opacity-70 italic">
                      Paling dipilih
                    </span>
                  )}
                  <p className="text-xs uppercase tracking-[0.22em] opacity-55 tabular-nums mb-5">
                    {String(i + 1).padStart(2, "0")} / 03
                  </p>
                  <h3 className="text-3xl font-medium tracking-tight leading-tight mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-sm font-light italic text-bone/65 mb-8 leading-snug pb-[0.1em]">
                    {pkg.tagline}
                  </p>
                  <div className="mb-8 pb-8 border-b border-bone/15">
                    {pkg.earlyBirdPrice && EARLYBIRD_LEFT > 0 ? (
                      <>
                        <p className="text-sm line-through text-bone/40">
                          Rp {pkg.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-4xl font-medium tracking-tight tabular-nums mt-1 leading-tight pb-[0.05em]">
                          Rp {pkg.earlyBirdPrice.toLocaleString("id-ID")}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.22em] opacity-70 mt-2">
                          Early-bird · {EARLYBIRD_LEFT} slot tersisa
                        </p>
                      </>
                    ) : (
                      <p className="text-4xl font-medium tracking-tight tabular-nums leading-tight pb-[0.05em]">
                        Rp {pkg.price.toLocaleString("id-ID")}
                      </p>
                    )}
                    <p className="text-xs uppercase tracking-[0.22em] opacity-55 mt-3">
                      Selesai {pkg.delivery}
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm flex-1 mb-8">
                    {pkg.includes.map((item, j) => (
                      <li key={j} className="flex items-baseline gap-3">
                        <span className="text-xs opacity-50 tabular-nums shrink-0 mt-0.5">
                          →
                        </span>
                        <span className="leading-snug text-bone/85">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={waLink(
                      `Halo Sigap, saya tertarik paket ${pkg.name} (Rp ${(pkg.earlyBirdPrice && EARLYBIRD_LEFT > 0
                        ? pkg.earlyBirdPrice
                        : pkg.price
                      ).toLocaleString("id-ID")}). Bisa konsultasi dulu?`
                    )}
                    className="block text-center rounded-full bg-bone text-ink px-5 py-3 text-sm transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
                  >
                    Pilih paket {pkg.name}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-10 text-xs uppercase tracking-[0.22em] opacity-55 text-center">
              Pembayaran transfer manual · BCA, Mandiri, atau BRI · DP 50%
              atau lunas di muka
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── PROSES ─────────────────── */}
      <section className="container-x py-24 md:py-32 border-t border-hairline">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-14 md:mb-20">
          <Reveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
              (Prosesnya)
            </p>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-6" delay={0.1}>
            <h2 className="text-display-sm font-medium leading-[1.0] tracking-tight max-w-3xl text-balance">
              Tiga langkah,{" "}
              <span className="font-light italic leading-[1.1]">
                tanpa drama.
              </span>
            </h2>
          </Reveal>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <li className="border-t border-ink pt-6">
                <p className="text-5xl md:text-6xl font-light tracking-tight tabular-nums mb-6 leading-none pb-[0.05em]">
                  {step.n}
                </p>
                <p className="text-lg md:text-xl font-medium tracking-tight leading-tight mb-3">
                  {step.title}
                </p>
                <p className="text-sm md:text-base text-ink/65 leading-relaxed max-w-xs">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ─────────────────── TESTIMONI ─────────────────── */}
      <section className="border-t border-hairline bg-bone">
        <div className="container-x py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-14 md:mb-20">
            <Reveal className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
                (Cerita klien)
              </p>
            </Reveal>
            <Reveal className="md:col-span-8 md:col-start-6" delay={0.1}>
              <h2 className="text-display-sm font-medium leading-[1.0] tracking-tight max-w-3xl text-balance">
                Suara dari{" "}
                <span className="font-light italic leading-[1.1]">
                  yang udah pernah kerja sama kita.
                </span>
              </h2>
            </Reveal>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border-y border-hairline">
            {TESTIMONIALS.map((t, i) => (
              <li key={i} className="bg-bone p-8 md:p-10 flex flex-col">
                <Reveal delay={i * 0.1} className="flex-1">
                  <p className="text-base md:text-lg leading-relaxed text-ink/85 mb-8">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </Reveal>
                <Reveal delay={i * 0.1 + 0.05}>
                  <div className="border-t border-hairline pt-5">
                    <p className="text-sm font-medium tracking-tight">
                      {t.author}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-55 mt-1">
                      {t.role} · {t.location}
                    </p>
                    {t.link && (
                      <Link
                        href={t.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] opacity-70 hover:opacity-100 group"
                      >
                        Lihat hasilnya
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                        >
                          ↗
                        </span>
                      </Link>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal>
            <p className="mt-10 text-xs uppercase tracking-[0.22em] opacity-50 text-center italic">
              Testimoni klien Sigap akan menggantikan placeholder ini saat
              tersedia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="container-x py-24 md:py-32 border-t border-hairline">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <Reveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
              (Sering ditanya)
            </p>
            <h2 className="text-display-sm font-medium leading-[1.0] tracking-tight">
              Pertanyaan
              <br />
              <span className="block font-light italic leading-[1.1] pb-[0.1em]">
                yang sering masuk.
              </span>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-6" delay={0.1}>
            <ul className="border-t border-hairline">
              {FAQ.map((item, i) => (
                <li key={i} className="border-b border-hairline">
                  <details className="group">
                    <summary className="cursor-pointer list-none py-5 md:py-6 flex items-start justify-between gap-6">
                      <span className="text-base md:text-lg font-medium leading-snug tracking-tight">
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className="text-xl leading-none mt-0.5 transition-transform duration-500 ease-out-expo group-open:rotate-45 shrink-0 opacity-70"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-6 md:pb-7 pr-10 text-sm md:text-base text-ink/70 leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA ─────────────────── */}
      <section className="border-t border-hairline bg-ink text-bone">
        <div className="container-x py-24 md:py-36 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
              (Yuk mulai)
            </p>
            <h2 className="text-display-md font-medium leading-[1.0] tracking-tight max-w-3xl mx-auto text-balance">
              Siap mulai?
              <br />
              <span className="block font-light italic leading-[1.12] opacity-90 pb-[0.12em]">
                Konsultasi dulu, gratis.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-xl mx-auto text-base md:text-lg text-bone/70 leading-relaxed">
              Cerita aja dulu soal usaha kamu. Kita kasih saran paket yang
              paling cocok, atau bilang terus terang kalau ternyata kamu
              belum butuh apa-apa.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                href={waLink(
                  "Halo Sigap, saya mau konsultasi soal usaha saya."
                )}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-bone text-ink px-7 py-4 text-base transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
              >
                Konsultasi gratis
                <span aria-hidden>→</span>
              </Link>
              <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                {WA_DISPLAY}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="border-t border-hairline">
        <div className="container-x py-10 md:py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm">
            <span className="font-medium">
              Sigap<span className="font-light italic">.</span>
            </span>{" "}
            <span className="opacity-60">paket digital untuk UMKM</span>
          </p>
          <p className="text-xs uppercase tracking-[0.2em] opacity-55">
            Powered by{" "}
            <a
              href="https://onyxcreative.asia"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-hairline hover:border-ink transition-colors"
            >
              Onyx Creative Asia
            </a>
            {" · Bali, ID"}
          </p>
        </div>
      </footer>

      {/* ─────────────────── FLOATING WA BUTTON ─────────────────── */}
      <Link
        href={waLink("Halo Sigap, saya mau tanya soal paket.")}
        aria-label="Chat via WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 rounded-full bg-ink text-bone px-5 py-3.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform active:scale-100"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="currentColor"
        >
          <path d="M17.6 6.32A8 8 0 0 0 4 12.05a8 8 0 0 0 1.15 4.07L4 21l5.05-1.13A8 8 0 0 0 12 20.1a8 8 0 0 0 5.6-13.78ZM12 18.6a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.99.67.67-2.91-.16-.25a6.6 6.6 0 1 1 12.27-3.4A6.6 6.6 0 0 1 12 18.6Zm3.62-4.95c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.11-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.11.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.09-.62-1.5-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.69 0 1 .72 1.96.82 2.1.1.13 1.42 2.17 3.44 3.04.48.21.86.33 1.15.43.48.15.92.13 1.26.08.38-.06 1.18-.48 1.35-.95.17-.46.17-.86.12-.95-.05-.09-.18-.14-.38-.24Z" />
        </svg>
        <span className="text-sm">Chat</span>
      </Link>
    </>
  );
}
