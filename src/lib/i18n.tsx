"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Minimal in-house i18n for Onyx Creative Asia.
 *
 * The public site is canonically English. This provider layers a
 * Bahasa Indonesia overlay on top of the high-visibility strings, so an
 * Indonesian visitor can switch the site to ID without us needing a full
 * content-translation pipeline.
 *
 * Strings not in the dictionary fall back to their key (which is the
 * English source), so the toggle never breaks the page. It just changes
 * the parts we've translated.
 *
 * Persistence: the chosen language is stored in localStorage AND the
 * <html lang> attribute is updated so the browser knows what it's
 * rendering.
 */

export type Lang = "en" | "id";

const DEFAULT_LANG: Lang = "en";
const STORAGE_KEY = "onyx_lang";

// Dictionary. KEY is the English source string. ID value is the
// translation. Tone: natural, formal Indonesian (uses "Anda", avoids
// stiff/literal constructions).
//
// To translate a new string: add `t("Source string")` in the component
// (or wrap it in <T>...</T> in a server component), then add an entry
// here. No entry = English passthrough.
const DICT: Record<string, { id: string }> = {
  // --- Nav ---------------------------------------------------------------
  Home: { id: "Beranda" },
  About: { id: "Tentang" },
  Services: { id: "Layanan" },
  Works: { id: "Karya" },
  Pricing: { id: "Harga" },
  Insights: { id: "Wawasan" },
  Contact: { id: "Kontak" },
  "Start a project": { id: "Mulai proyek" },

  // --- Pricing chrome ----------------------------------------------------
  Monthly: { id: "Bulanan" },
  Yearly: { id: "Tahunan" },
  Startup: { id: "Startup" },
  Growth: { id: "Growth" },
  Enterprise: { id: "Enterprise" },
  "save 30 to 46%": { id: "hemat 30 sampai 46%" },
  "/mo": { id: "/bln" },
  "/yr": { id: "/thn" },
  "(Billing cadence)": { id: "(Siklus penagihan)" },
  "(Bundle savings)": { id: "(Hemat paket lengkap)" },
  "(The fine print)": { id: "(Ketentuan)" },
  "(Pricing)": { id: "(Harga)" },
  "(Capabilities)": { id: "(Kapabilitas)" },
  "(Next step)": { id: "(Langkah berikutnya)" },
  "(Get in touch)": { id: "(Hubungi kami)" },
  "off vs à la carte": { id: "lebih hemat vs satuan" },
  "Pick monthly for flexibility, or yearly to save 30 to 46% with an upfront commitment.":
    {
      id: "Pilih bulanan untuk fleksibilitas, atau tahunan untuk hemat 30 sampai 46% dengan komitmen di muka.",
    },

  // Pricing fine-print rows
  Commitment: { id: "Komitmen" },
  Onboarding: { id: "Onboarding" },
  Tax: { id: "Pajak" },
  Payment: { id: "Pembayaran" },
  Currency: { id: "Mata uang" },
  "Monthly is 1 month, no lock-in. Yearly is paid upfront, with a pro-rata refund if cancelled mid-term.":
    {
      id: "Bulanan berlaku 1 bulan, tanpa ikatan. Tahunan dibayar di muka, dengan pengembalian pro-rata jika dibatalkan di tengah jalan.",
    },
  "Startup tier is free. Growth Rp 1M. Enterprise Rp 3M. One-time, covers brand/asset audit and system setup.":
    {
      id: "Tier Startup gratis. Growth Rp 1jt. Enterprise Rp 3jt. Sekali bayar, mencakup audit brand/aset dan penyiapan sistem.",
    },
  "Indonesian VAT (PPN 11%) is not included in any of the prices above.": {
    id: "PPN 11% belum termasuk dalam seluruh harga di atas.",
  },
  "Monthly upfront via bank transfer. NET 7 invoice.": {
    id: "Dibayar di muka tiap bulan via transfer bank. Invoice NET 7.",
  },
  "Prices switch to USD in English and IDR in Indonesian, at roughly Rp 16,000 to the dollar.":
    {
      id: "Harga tampil dalam USD di Bahasa Inggris dan IDR di Bahasa Indonesia, dengan kurs sekitar Rp 16.000 per dolar.",
    },

  // Pricing service blurbs + footnotes
  "Monthly retainer covers maintenance, content updates, security patches, and progressive iteration on the live site. New website builds are quoted separately as a one-time fee.":
    {
      id: "Retainer bulanan mencakup pemeliharaan, pembaruan konten, patch keamanan, dan iterasi berkelanjutan pada situs yang sudah live. Pembuatan situs baru dihitung terpisah sebagai biaya sekali bayar.",
    },
  "New website build is a separate one-time fee (Rp 3jt to 25jt scoped).": {
    id: "Pembuatan situs baru adalah biaya sekali bayar terpisah (Rp 3jt sampai 25jt sesuai lingkup).",
  },
  "End-to-end content production, scheduling, and community management. We don't post for the sake of posting. Every piece serves a thesis.":
    {
      id: "Produksi konten, penjadwalan, dan pengelolaan komunitas dari hulu ke hilir. Kami tidak memposting sekadar memposting. Setiap konten punya tujuan.",
    },
  "Build AI workflows that handle the repeatable work so your team can focus on the unrepeatable. WhatsApp chatbots, lead scoring, content drafting, internal Q&A bots, custom agents.":
    {
      id: "Bangun alur kerja AI yang menangani pekerjaan berulang agar tim Anda bisa fokus pada hal yang tak tergantikan. Chatbot WhatsApp, penilaian lead, penyusunan konten, bot tanya-jawab internal, agen kustom.",
    },
  "Strategy, creative, and management for paid media across Meta, Google, TikTok, and LinkedIn. Management fee is separate from ad spend. You pay platforms directly.":
    {
      id: "Strategi, kreatif, dan pengelolaan iklan berbayar di Meta, Google, TikTok, dan LinkedIn. Biaya pengelolaan terpisah dari budget iklan. Budget iklan dibayar langsung ke platform.",
    },
  "Ad spend is billed by the platform directly. Mgmt fee separate.": {
    id: "Budget iklan ditagih langsung oleh platform. Biaya pengelolaan terpisah.",
  },
  "The bundle. Web + Social + AI + Ads under one roof, with one strategy, one PM, and one invoice. Up to ~29% off versus buying services individually.":
    {
      id: "Paket lengkap. Web + Sosial + AI + Iklan dalam satu atap, dengan satu strategi, satu PM, dan satu invoice. Hemat hingga ~29% dibanding membeli layanan satuan.",
    },

  // Service-detail Pricing widget
  "Three tiers.": { id: "Tiga tier." },
  "Pick yours.": { id: "Pilih milik Anda." },
  "Transparent monthly retainer. Switch to yearly upfront to save 30 to 46%. No lock-in on monthly, refund pro-rata on yearly.":
    {
      id: "Retainer bulanan yang transparan. Beralih ke tahunan di muka untuk hemat 30 sampai 46%. Tanpa ikatan di bulanan, pengembalian pro-rata di tahunan.",
    },
  "See all pricing": { id: "Lihat semua harga" },

  // Pricing page hero + closing CTA
  "Every retainer is published. Pick the tier, pick the cadence, sign, start. No tier-pricing email tag, no “contact us for a quote” on the small ones.":
    {
      id: "Semua harga retainer kami terbuka. Pilih tier, pilih siklus, teken, mulai. Tidak ada tarik-ulur harga lewat email, tidak ada “hubungi kami untuk penawaran” untuk paket kecil.",
    },
  "Ready to": { id: "Siap" },
  "build together?": { id: "membangun bersama?" },
  "Brief us in 30 minutes, we'll send back a scoped tier recommendation within 24 hours. No commitment to start.":
    {
      id: "Beri kami brief 30 menit, kami kirim balik rekomendasi tier sesuai lingkup dalam 24 jam. Tanpa komitmen untuk memulai.",
    },
  "Start a brief": { id: "Mulai brief" },

  // --- Home --------------------------------------------------------------
  "(Independent studio, Asia)": { id: "(Studio independen, Asia)" },
  "Scroll to explore": { id: "Gulir untuk menjelajah" },
  "Onyx Creative Asia builds the digital surface, the growth engine, and the automation layer, under one roof, with one team that actually ships.":
    {
      id: "Onyx Creative Asia membangun permukaan digital, mesin pertumbuhan, dan lapisan otomasi, dalam satu atap, dengan satu tim yang benar-benar merilis.",
    },
  "(What we do)": { id: "(Yang kami kerjakan)" },
  "Four disciplines, working as one.": {
    id: "Empat disiplin, bekerja sebagai satu.",
  },
  "(Selected works)": { id: "(Karya pilihan)" },
  "A small group of brave brands.": {
    id: "Sekelompok kecil brand yang berani.",
  },

  // Service names (nav mega, services rail, pricing)
  "Web & Software Development": { id: "Pengembangan Web & Software" },
  "Ads Management": { id: "Pengelolaan Iklan" },
  "Social Media Management": { id: "Pengelolaan Media Sosial" },
  "AI Automation": { id: "Otomasi AI" },
  "Full Digital Marketing": { id: "Digital Marketing Lengkap" },

  // Service short taglines
  "Sites and software that move with intent.": {
    id: "Situs dan software yang bergerak dengan tujuan.",
  },
  "Google, Meta, and TikTok, run like a system.": {
    id: "Google, Meta, dan TikTok, dijalankan seperti satu sistem.",
  },
  "Brands that show up and stick.": {
    id: "Brand yang tampil dan melekat.",
  },
  "AI that does the work, without the noise.": {
    id: "AI yang mengerjakan tugas, tanpa keriuhan.",
  },

  // --- About -------------------------------------------------------------
  "(About, the studio)": { id: "(Tentang studio)" },
  "A small studio.": { id: "Studio kecil." },
  "Built to ship.": { id: "Dibangun untuk merilis." },
  "(Story)": { id: "(Cerita)" },
  "(How we work)": { id: "(Cara kami bekerja)" },
  "(Our position)": { id: "(Posisi kami)" },
  "Onyx Creative Asia is an independent studio working at the intersection of brand, performance, and emerging technology. We build the digital surface, the growth engine, and the automation layer, for teams that want one partner instead of five.":
    {
      id: "Onyx Creative Asia adalah studio independen yang bekerja di persimpangan brand, performa, dan teknologi baru. Kami membangun permukaan digital, mesin pertumbuhan, dan lapisan otomasi, untuk tim yang menginginkan satu partner alih-alih lima.",
    },
  "We're small on purpose. The team you meet is the team you work with. There is no account layer between strategy and the people writing the code or running the ads.":
    {
      id: "Kami memang sengaja kecil. Tim yang Anda temui adalah tim yang akan bekerja bersama Anda. Tidak ada lapisan account di antara strategi dan orang-orang yang menulis kode atau menjalankan iklan.",
    },
  "Based in Bali, working with founders across Indonesia, Southeast Asia, and Europe, in hospitality, commerce, real estate, and software.":
    {
      id: "Berbasis di Bali, bekerja dengan para founder di Indonesia, Asia Tenggara, dan Eropa, di bidang hospitality, ritel, properti, dan software.",
    },
  "Make, don't decorate": { id: "Buat, bukan hias" },
  "Every output earns its place. If a section doesn't move someone closer to a decision, it doesn't ship.":
    {
      id: "Setiap output harus pantas ada. Jika sebuah bagian tidak mendekatkan orang ke keputusan, ia tidak kami rilis.",
    },
  "One team, no hand-offs": { id: "Satu tim, tanpa operan" },
  "Brand, build, and growth in the same room. Less coordination tax, faster ship cycles, sharper outcomes.":
    {
      id: "Brand, pembangunan, dan pertumbuhan dalam satu ruangan. Lebih sedikit beban koordinasi, siklus rilis lebih cepat, hasil lebih tajam.",
    },
  "Systems over deliverables": { id: "Sistem, bukan sekadar deliverable" },
  "We don't sell hours. We hand back operating systems, sites, funnels, and agents that keep working.":
    {
      id: "Kami tidak menjual jam kerja. Kami menyerahkan sistem operasi, situs, funnel, dan agen yang terus bekerja.",
    },
  "Quiet confidence": { id: "Percaya diri yang tenang" },
  "No jargon, no hype. The work speaks. We work best with founders and teams who think the same way.":
    {
      id: "Tanpa jargon, tanpa hype. Karyanya yang berbicara. Kami paling cocok dengan para founder dan tim yang berpikir serupa.",
    },

  // --- Services overview -------------------------------------------------
  "Four disciplines.": { id: "Empat disiplin." },
  "One studio.": { id: "Satu studio." },
  "We don't hand work between five vendors. The team that builds your site is the same team running your ads and shipping the AI agent. Less hand-off, sharper execution.":
    {
      id: "Kami tidak mengoper pekerjaan ke lima vendor berbeda. Tim yang membangun situs Anda adalah tim yang sama yang menjalankan iklan dan merilis agen AI Anda. Lebih sedikit operan, eksekusi lebih tajam.",
    },
  "Read the full discipline": { id: "Baca disiplin selengkapnya" },

  // --- Services detail ---------------------------------------------------
  Capability: { id: "Kapabilitas" },
  "What we do": { id: "Yang kami kerjakan" },
  Outcomes: { id: "Hasil" },
  "What you walk": { id: "Yang Anda" },
  "away with.": { id: "bawa pulang." },
  "Inside the scope": { id: "Dalam lingkup" },
  "Capabilities.": { id: "Kapabilitas." },
  "Mix and match. Most engagements pull from three or four; a few pull all of them.":
    {
      id: "Bebas dipadukan. Kebanyakan kerja sama mengambil tiga atau empat; beberapa mengambil semuanya.",
    },
  "How it goes": { id: "Bagaimana prosesnya" },
  "The shape of an": { id: "Bentuk sebuah" },
  "engagement.": { id: "kerja sama." },
  "Who this is for": { id: "Untuk siapa ini" },
  "See related work": { id: "Lihat karya terkait" },
  "Other capabilities": { id: "Kapabilitas lain" },
  "Read more": { id: "Baca selengkapnya" },
  Read: { id: "Baca" },

  // --- Works -------------------------------------------------------------
  "Brands we've helped": { id: "Brand yang kami bantu" },
  "show up & scale up.": { id: "tampil & berkembang." },
  "All works": { id: "Semua karya" },
  "Selected works": { id: "Karya pilihan" },
  "New work shipping soon. In the meantime,": {
    id: "Karya baru segera hadir. Sementara itu,",
  },
  "start a project": { id: "mulai proyek" },
  Year: { id: "Tahun" },
  Location: { id: "Lokasi" },
  Discipline: { id: "Disiplin" },
  "(The work)": { id: "(Pekerjaannya)" },
  "(Scope)": { id: "(Lingkup)" },
  "(Client words)": { id: "(Kata klien)" },

  // Project category labels
  "Web Development": { id: "Pengembangan Web" },
  "AI Systems": { id: "Sistem AI" },

  // --- Pricing page hero headline (via RevealText auto-translate) --------
  "Transparent.": { id: "Transparan." },
  "No back-channel.": { id: "Tanpa jalur belakang." },

  // --- Contact -----------------------------------------------------------
  "Let's start": { id: "Mari mulai" },
  "a conversation.": { id: "sebuah percakapan." },
  "Project brief, quick question, job application, or partnership proposal, pick the path below and we'll tailor the form. We read every message and reply within 48 hours.":
    {
      id: "Brief proyek, pertanyaan singkat, lamaran kerja, atau usulan kerja sama, pilih jalur di bawah dan kami sesuaikan formulirnya. Kami membaca setiap pesan dan membalas dalam 48 jam.",
    },
};

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (s: string) => string;
}>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (s) => s,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Hydrate from localStorage on first client mount. Doing this in an
  // effect (rather than initializing useState from localStorage) keeps
  // the server-rendered HTML matching the client-rendered first paint,
  // avoiding the hydration-mismatch warning.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "id") {
        setLangState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      /* localStorage might be unavailable (private mode etc.), ignore */
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (src: string) => {
      if (lang === "en") return src;
      return DICT[src]?.id ?? src;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Convenience hook for just the translator function. */
export function useT() {
  return useContext(LangContext).t;
}

/**
 * Inline translator component for use inside SERVER components.
 *
 * Server components can't call useT() (it's a hook), but they CAN render
 * a client component as a child. <T> wraps a single English source
 * string and renders its translation:
 *
 *   <T>About the studio</T>
 *
 * Falls back to the source string when no ID entry exists, so wrapping a
 * string in <T> is always safe even before it's added to the dictionary.
 */
export function T({ children }: { children: string }) {
  const t = useT();
  return <>{t(children)}</>;
}
