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

  // Contact tab labels + descriptions
  "General Question": { id: "Pertanyaan Umum" },
  "Project Brief": { id: "Brief Proyek" },
  Career: { id: "Karier" },
  Partnership: { id: "Kerja Sama" },
  "Quick question, a hello, or anything that doesn't fit the others.": {
    id: "Pertanyaan singkat, sekadar menyapa, atau apa pun yang tidak masuk kategori lain.",
  },
  "You want us to design, build, or scale something for you.": {
    id: "Anda ingin kami mendesain, membangun, atau men-scale sesuatu untuk Anda.",
  },
  "You want to work with us. We're a small, opinionated team.": {
    id: "Anda ingin bekerja dengan kami. Kami tim kecil dengan pendirian yang jelas.",
  },
  "You run a studio, agency, or platform and you're proposing a collab.": {
    id: "Anda menjalankan studio, agensi, atau platform dan ingin mengusulkan kolaborasi.",
  },

  // ============================================================
  // Service detail prose (English jargon kept in English)
  // ============================================================

  // Web & Software Development
  "Custom websites and web apps built for performance, accessibility, and craft. From marketing sites to headless commerce.":
    {
      id: "Website dan web app custom yang dibangun untuk performance, accessibility, dan craft. Dari marketing site hingga headless commerce.",
    },
  "Sites that load fast, scale cleanly, and don't fall apart in six months.": {
    id: "Situs yang loading cepat, scale dengan rapi, dan tidak berantakan dalam enam bulan.",
  },
  "Most agency websites peak at launch. Ours are built to peak later. Performance budgets, accessibility, and a design system the next engineer can extend, these aren't extras, they're the contract.":
    {
      id: "Kebanyakan website agensi mencapai puncaknya saat launch. Punya kami dibangun untuk memuncak setelahnya. Performance budget, accessibility, dan design system yang bisa dikembangkan engineer berikutnya, ini bukan tambahan, ini bagian dari kesepakatan.",
    },
  "We work in one team. The person designing the hero is the person who knows what the loader does on slow networks. No handoff means tighter craft and weeks shaved off the timeline.":
    {
      id: "Kami bekerja dalam satu tim. Orang yang mendesain hero adalah orang yang paham apa yang dilakukan loader di jaringan lambat. Tanpa handoff, craft jadi lebih rapat dan timeline terpangkas berminggu-minggu.",
    },
  "Best fit for founders launching their flagship, brands migrating off a WordPress that aged into a maintenance tax, or product teams who need a marketing site that doesn't lag behind the product.":
    {
      id: "Paling cocok untuk founder yang meluncurkan produk unggulan, brand yang bermigrasi dari WordPress yang sudah jadi beban pemeliharaan, atau tim produk yang butuh marketing site yang tidak tertinggal dari produknya.",
    },
  "A site that scores 95+ on Lighthouse and stays there": {
    id: "Situs dengan skor 95+ di Lighthouse dan bertahan di sana",
  },
  "A design system the next engineer can extend": {
    id: "Design system yang bisa dikembangkan engineer berikutnya",
  },
  "Editor experience that survives Friday afternoon": {
    id: "Editor experience yang tetap nyaman bahkan Jumat sore",
  },
  "Motion that earns its frame budget": {
    id: "Motion yang sepadan dengan frame budget-nya",
  },
  "Scope + spec sketch": { id: "Scope + sketsa spec" },
  "One week. We map the pages, content sources, and the one motion idea worth investing in.":
    {
      id: "Satu minggu. Kami memetakan halaman, sumber konten, dan satu ide motion yang layak digarap.",
    },
  "Design + content collab": { id: "Kolaborasi desain + konten" },
  "Two to three weeks. Weekly working sessions, no big reveal moments.": {
    id: "Dua sampai tiga minggu. Sesi kerja mingguan, tanpa momen reveal besar.",
  },
  "Build sprint": { id: "Build sprint" },
  "Three to five weeks. Live preview link from week one, weekly demos.": {
    id: "Tiga sampai lima minggu. Link live preview sejak minggu pertama, demo mingguan.",
  },
  "Launch + tune": { id: "Launch + penyetelan" },
  "One week post-launch we monitor and tighten. Then we hand over.": {
    id: "Satu minggu pasca-launch kami pantau dan rapikan. Lalu kami serahkan.",
  },
  "Studios who want craft and ship speed, without choosing between them.": {
    id: "Tim yang ingin craft dan kecepatan rilis sekaligus, tanpa harus memilih salah satu.",
  },

  // Ads Management
  "Performance marketing across the channels that matter. Creative testing, audience architecture, and attribution that survives iOS.":
    {
      id: "Performance marketing di channel yang penting. Creative testing, arsitektur audience, dan attribution yang tetap akurat pasca-iOS.",
    },
  "Performance marketing run like a system, not a monthly creative.": {
    id: "Performance marketing yang dijalankan seperti sistem, bukan sekadar creative bulanan.",
  },
  "We treat paid media as one system with multiple surfaces. Creative variants get tested against each other, not against vibes. Audiences get architected, not just retargeted. Attribution stays sane in the post-iOS world because we build for blended signal from day one.":
    {
      id: "Kami memperlakukan paid media sebagai satu sistem dengan banyak permukaan. Variasi creative diuji satu sama lain, bukan berdasarkan firasat. Audience dirancang, bukan sekadar di-retarget. Attribution tetap waras di dunia pasca-iOS karena kami membangun untuk blended signal sejak hari pertama.",
    },
  "Creative is where most ad accounts quietly leak budget. We produce in-house, iterate weekly, and kill what isn't moving instead of leaving it to drag a quarter.":
    {
      id: "Creative adalah tempat kebanyakan akun iklan diam-diam membocorkan budget. Kami memproduksi in-house, iterasi mingguan, dan menghentikan yang tidak bergerak alih-alih membiarkannya membebani satu kuartal.",
    },
  "Best fit for D2C brands hitting a ceiling on a single channel, SaaS teams growing past their organic plateau, or services with strong LTV who need predictable inbound.":
    {
      id: "Paling cocok untuk brand D2C yang mentok di satu channel, tim SaaS yang tumbuh melewati plateau organik, atau bisnis jasa dengan LTV kuat yang butuh inbound yang terprediksi.",
    },
  "Blended CAC trending the right direction within 30 days": {
    id: "Blended CAC bergerak ke arah yang benar dalam 30 hari",
  },
  "Creative variants that don't read like generic templates": {
    id: "Variasi creative yang tidak terlihat seperti template generik",
  },
  "Weekly tightening loop, not monthly slide decks": {
    id: "Loop penyempurnaan mingguan, bukan slide deck bulanan",
  },
  "Honest reporting, what worked, what didn't, why": {
    id: "Laporan yang jujur, apa yang berhasil, apa yang tidak, dan kenapa",
  },
  "Account + funnel audit": { id: "Audit akun + funnel" },
  "One week. Where the money currently goes, and where it should.": {
    id: "Satu minggu. Ke mana uang mengalir sekarang, dan ke mana seharusnya.",
  },
  "Creative + landing alignment": { id: "Penyelarasan creative + landing" },
  "Two weeks. Variants written and shot, landing pages polished.": {
    id: "Dua minggu. Variasi ditulis dan diproduksi, landing page dirapikan.",
  },
  "Launch + learning sprint": { id: "Launch + sprint pembelajaran" },
  "Two to four weeks. Fast feedback loop, daily check-ins, weekly cuts.": {
    id: "Dua sampai empat minggu. Feedback loop cepat, check-in harian, pemangkasan mingguan.",
  },
  "Steady-state optimisation": { id: "Optimisasi steady-state" },
  "Monthly cadence with the team. Always one new test in flight.": {
    id: "Ritme bulanan bersama tim. Selalu ada satu tes baru yang berjalan.",
  },
  "Brands tired of agency-shaped reports that hide what's actually working.": {
    id: "Brand yang lelah dengan laporan ala agensi yang menyembunyikan apa yang sebenarnya berhasil.",
  },

  // Social Media Management
  "Strategy, content, and community for brands that want to be remembered. We make the feed feel like a place.":
    {
      id: "Strategi, konten, dan komunitas untuk brand yang ingin diingat. Kami membuat feed terasa seperti sebuah tempat.",
    },
  "Strategy, content, and community for brands that want to be remembered.": {
    id: "Strategi, konten, dan komunitas untuk brand yang ingin diingat.",
  },
  "Most brand feeds feel like nobody lives there. Ours feel like a place. Consistent posture, recognisable hand, photography and motion produced in the same room as the strategy, so it actually adds up.":
    {
      id: "Kebanyakan feed brand terasa seperti tak berpenghuni. Punya kami terasa seperti sebuah tempat. Sikap yang konsisten, gaya yang khas, fotografi dan motion diproduksi di ruang yang sama dengan strateginya, sehingga semuanya nyambung.",
    },
  "We don't separate the strategist from the creator. The person planning the month is the person shooting the week. Less drift between intention and what ships.":
    {
      id: "Kami tidak memisahkan strategist dari kreator. Orang yang merencanakan bulan ini adalah orang yang memotret minggu ini. Lebih sedikit jarak antara niat dan hasil yang tayang.",
    },
  "Best fit for lifestyle brands, hospitality, restaurants, and F&B, plus creators ready to build past “we should post more this month.”":
    {
      id: "Paling cocok untuk brand lifestyle, hospitality, restoran, dan F&B, plus kreator yang siap melangkah lebih jauh dari “bulan ini kita harus lebih sering posting.”",
    },
  "Visual system that survives 12 months without looking tired": {
    id: "Sistem visual yang bertahan 12 bulan tanpa terlihat usang",
  },
  "Community that engages, not just followers that count": {
    id: "Komunitas yang berinteraksi, bukan sekadar follower yang dihitung",
  },
  "Production pipeline you can take in-house when ready": {
    id: "Pipeline produksi yang bisa Anda bawa in-house saat siap",
  },
  "Calendar your team can run on Monday morning": {
    id: "Kalender yang bisa dijalankan tim Anda Senin pagi",
  },
  "Brand + feed audit": { id: "Audit brand + feed" },
  "One week. What's working, what's flat, what's worth keeping.": {
    id: "Satu minggu. Apa yang berhasil, apa yang datar, apa yang layak dipertahankan.",
  },
  "Strategy + pillars": { id: "Strategi + pilar" },
  "One week. Three to five content pillars, one core posture.": {
    id: "Satu minggu. Tiga sampai lima pilar konten, satu sikap inti.",
  },
  "Production sprint": { id: "Sprint produksi" },
  "Rolling. Photo, video, and motion shot together in batches.": {
    id: "Berkelanjutan. Foto, video, dan motion diproduksi bersama dalam batch.",
  },
  "Always-on plan + post": { id: "Rencana + posting always-on" },
  "Weekly cadence. Community managed. Analytics tightened monthly.": {
    id: "Ritme mingguan. Komunitas dikelola. Analytics dirapikan bulanan.",
  },
  "Brands that want their feed to feel like a place, not a checklist.": {
    id: "Brand yang ingin feed-nya terasa seperti sebuah tempat, bukan checklist.",
  },

  // AI Automation
  "Custom AI agents and automations connected to your real tools. Built to remove busywork, not replace people.":
    {
      id: "AI agent dan automation custom yang terhubung ke tools Anda yang sebenarnya. Dibangun untuk menghilangkan pekerjaan repetitif, bukan menggantikan orang.",
    },
  "AI that operates inside your workflow, not a chatbot bolted to the homepage.":
    {
      id: "AI yang bekerja di dalam workflow Anda, bukan chatbot yang ditempel di homepage.",
    },
  "Most “AI launches” are a chat widget on a marketing site. We build the other kind: agents that classify inbound, triage leads, draft replies in your voice, route work to the right person, and stay out of the way until they're needed.":
    {
      id: "Kebanyakan “peluncuran AI” hanyalah widget chat di marketing site. Kami membangun yang sebaliknya: agent yang mengklasifikasi pesan masuk, menyaring lead, menyusun balasan dengan gaya bahasa Anda, mengarahkan pekerjaan ke orang yang tepat, dan tidak mengganggu sampai benar-benar dibutuhkan.",
    },
  "Tooling-first means we plug into your real stack, Postgres, webhooks, the CRM you already pay for. No no-code black boxes you can't audit. Operator stays in the loop on anything that ships externally.":
    {
      id: "Tooling-first berarti kami terhubung ke stack Anda yang sebenarnya, Postgres, webhook, CRM yang sudah Anda bayar. Tanpa black box no-code yang tak bisa diaudit. Operator tetap dilibatkan untuk apa pun yang keluar ke pihak eksternal.",
    },
  "Best fit for small teams drowning in repetitive coordination, ops managers tired of being a copy-paste machine, or founders who want one workflow back before they hire for it.":
    {
      id: "Paling cocok untuk tim kecil yang tenggelam dalam koordinasi berulang, ops manager yang lelah menjadi mesin copy-paste, atau founder yang ingin satu workflow kembali sebelum harus merekrut untuk itu.",
    },
  "One workflow that ate your week, now runs in the background": {
    id: "Satu workflow yang dulu menyita seminggu, kini berjalan di latar belakang",
  },
  "Decisions you can audit (priority, classification, routing), not a black box":
    {
      id: "Keputusan yang bisa Anda audit (prioritas, klasifikasi, routing), bukan black box",
    },
  "Kill switches + rate guards baked in for safety": {
    id: "Kill switch + rate guard tertanam demi keamanan",
  },
  "An automation your team owns, not a vendor you rent": {
    id: "Automation yang dimiliki tim Anda, bukan vendor yang Anda sewa",
  },
  "Workflow shadowing": { id: "Workflow shadowing" },
  "One week. Sit with the person doing the work. Find the tax.": {
    id: "Satu minggu. Duduk bersama orang yang mengerjakannya. Temukan bebannya.",
  },
  "Pilot scoping": { id: "Penentuan lingkup pilot" },
  "Three days. Pick the highest-pain workflow with the lowest-stakes failure.": {
    id: "Tiga hari. Pilih workflow yang paling menyakitkan dengan risiko kegagalan paling kecil.",
  },
  "Two weeks. Working version, not a demo. Operator approves every output for the first week.":
    {
      id: "Dua minggu. Versi yang berfungsi, bukan demo. Operator menyetujui setiap output di minggu pertama.",
    },
  "Handover + refine": { id: "Serah terima + penyempurnaan" },
  "We don't disappear. Iterating on real signal beats designing in a vacuum.": {
    id: "Kami tidak menghilang. Beriterasi dari sinyal nyata lebih baik daripada mendesain dalam ruang hampa.",
  },
  "Teams who'd rather amplify their best operator than replace them.": {
    id: "Tim yang lebih memilih memperkuat operator terbaiknya daripada menggantikannya.",
  },

  // --- Home: AboutPreview + Testimonials ---------------------------------
  "More about us": { id: "Selengkapnya tentang kami" },
  "(Testimonials)": { id: "(Testimoni)" },
  "Words from the work.": { id: "Kata dari hasil kerja." },
  "The previous site treated villas like inventory. The new one treats them like a story. Our agents are getting four times the qualified WhatsApp inquiries we used to filter through the contact form.":
    {
      id: "Situs sebelumnya memperlakukan vila seperti stok barang. Yang baru memperlakukannya seperti sebuah cerita. Agen kami kini mendapat empat kali lipat inquiry WhatsApp berkualitas dibanding yang dulu kami saring lewat contact form.",
    },
  "What used to take three Slack pings and a manual Trello card now happens in under a minute. The team is focused on the campaign, not the intake.":
    {
      id: "Yang dulu butuh tiga ping Slack dan kartu Trello manual kini selesai dalam waktu kurang dari semenit. Tim fokus pada campaign, bukan pada intake.",
    },
  "The brand finally matches how the salon actually feels in person. First-time bookings doubled within two months of launch.":
    {
      id: "Brand-nya akhirnya sesuai dengan suasana salon saat dikunjungi langsung. Booking pertama kali berlipat ganda dalam dua bulan setelah launch.",
    },
  "We wanted the website to feel as calm as the treatment itself. Onyx built the site, runs the social feed, and manages the ads, bookings flow straight to WhatsApp and nothing falls through the cracks. The site converts at three times what we projected.":
    {
      id: "Kami ingin website-nya terasa setenang treatment-nya sendiri. Onyx membangun situsnya, menjalankan social feed, dan mengelola iklannya, booking mengalir langsung ke WhatsApp dan tidak ada yang terlewat. Konversi situsnya tiga kali lipat dari yang kami perkirakan.",
    },

  // --- Footer ------------------------------------------------------------
  "(Let's build)": { id: "(Mari membangun)" },
  "Got a brand to": { id: "Punya brand untuk" },
  "build,": { id: "dibangun," },
  "a system to": { id: "sistem untuk" },
  "automate,": { id: "diotomasi," },
  "or growth to": { id: "atau pertumbuhan untuk" },
  "unlock?": { id: "dibuka?" },
  Sitemap: { id: "Peta Situs" },
  Legal: { id: "Legal" },
  "Privacy Policy": { id: "Kebijakan Privasi" },
  "Terms of Use": { id: "Ketentuan Penggunaan" },
  "Onyx Creative Asia, an independent studio in Bali, building brands, performance, and AI systems for ambitious teams.":
    {
      id: "Onyx Creative Asia, studio independen di Bali, yang membangun brand, performance, dan sistem AI untuk tim ambisius.",
    },
  "All rights reserved.": { id: "Hak cipta dilindungi." },
  "Made with intent in Bali": { id: "Dibuat dengan sepenuh hati di Bali" },

  // ============================================================
  // Works case studies (English jargon kept in English)
  // ============================================================
  "Visit site": { id: "Kunjungi situs" },

  // Great Bali Properties
  "Great Bali Properties needed a digital surface that felt like an investment partner, not a broker. The previous site treated villas as inventory. This one positions them as curation. The marketplace lives across English and Bahasa, switches currency on demand, and routes serious buyers straight to the agent on WhatsApp, Bali's actual sales channel, instead of forcing a generic contact form.":
    {
      id: "Great Bali Properties butuh permukaan digital yang terasa seperti mitra investasi, bukan broker. Situs sebelumnya memperlakukan vila sebagai stok barang. Yang ini memposisikannya sebagai kurasi. Marketplace-nya hadir dalam Bahasa Inggris dan Indonesia, mengganti mata uang sesuai permintaan, dan mengarahkan pembeli serius langsung ke agen via WhatsApp, channel penjualan Bali yang sesungguhnya, alih-alih memaksakan contact form generik.",
    },
  "Multilingual storefront (English / Bahasa Indonesia)": {
    id: "Storefront multibahasa (Inggris / Bahasa Indonesia)",
  },
  "Interactive Leaflet map with eight Bali locations": {
    id: "Peta Leaflet interaktif dengan delapan lokasi di Bali",
  },
  "Property filters by location, type, ownership": {
    id: "Filter properti berdasarkan lokasi, tipe, kepemilikan",
  },
  "Currency-aware pricing (IDR / USD)": {
    id: "Harga dua mata uang (IDR / USD)",
  },
  "Direct-agent WhatsApp routing": { id: "Routing WhatsApp langsung ke agen" },
  "Featured carousel + property detail galleries": {
    id: "Carousel unggulan + galeri detail properti",
  },

  // RADcruiters
  "RADcruiters runs Meta-ads recruitment campaigns for staffing agencies, a high-touch service with high-volume intake. The campaign-request form had become the bottleneck: every brief pinged the team in Slack, someone manually parsed the URL, looked up the client, then created the Trello card. We rebuilt the intake as a self-routing pipeline. Submission → seconds → the right person sees the right card with the right context, and the client gets an instant confirmation that says 'we have it.'":
    {
      id: "RADcruiters menjalankan campaign rekrutmen berbasis Meta-ads untuk agensi staffing, layanan high-touch dengan volume intake tinggi. Form permintaan campaign menjadi bottleneck: setiap brief mem-ping tim di Slack, seseorang mem-parsing URL secara manual, mencari kliennya, lalu membuat kartu Trello. Kami membangun ulang intake-nya sebagai pipeline yang mengarahkan dirinya sendiri. Submission → hitungan detik → orang yang tepat melihat kartu yang tepat dengan konteks yang tepat, dan klien mendapat konfirmasi instan yang berkata 'sudah kami terima.'",
    },
  "WordPress intake form for client campaign briefs": {
    id: "Form intake WordPress untuk brief campaign klien",
  },
  "Make.com pipeline (custom webhook → Trello → Airtable → Gmail)": {
    id: "Pipeline Make.com (custom webhook → Trello → Airtable → Gmail)",
  },
  "Domain extraction + client matching from vacancy URL": {
    id: "Ekstraksi domain + pencocokan klien dari URL lowongan",
  },
  "Auto-create Trello task with full brief data": {
    id: "Pembuatan otomatis task Trello dengan data brief lengkap",
  },
  "Team notification + client confirmation email": {
    id: "Notifikasi tim + email konfirmasi klien",
  },
  "Always-on with execution history and error monitoring": {
    id: "Always-on dengan riwayat eksekusi dan monitoring error",
  },

  // The Hair Extensions Bali
  "The studio is in Kerobokan, by appointment. They wanted a digital surface that matched the experience in person, quiet, warm, dressed in dark tones, with the kind of editorial gallery you'd expect in a print magazine, not in the average beauty-salon site. Six service methods, a filterable gallery, a video hero of the actual color wall, and direct-to-WhatsApp booking with IDR pricing visible up front. The wordmark earns the rest of the page: a serif title with a hand-drawn 'Bali,' the kind of small detail that signals the work happens by hand.":
    {
      id: "Studionya di Kerobokan, dengan sistem janji temu. Mereka ingin permukaan digital yang sesuai dengan pengalaman langsung, tenang, hangat, berbalut nuansa gelap, dengan galeri editorial yang biasa Anda temukan di majalah cetak, bukan di situs salon kecantikan biasa. Enam metode layanan, galeri yang bisa difilter, video hero dari color wall aslinya, dan booking langsung ke WhatsApp dengan harga IDR yang terlihat di depan. Wordmark-nya membuat sisa halaman jadi pantas: judul serif dengan 'Bali' tulisan tangan, detail kecil yang menandakan pekerjaannya dikerjakan dengan tangan.",
    },
  "Wordmark: serif 'HAIR EXTENSIONS' + hand-drawn 'Bali'": {
    id: "Wordmark: serif 'HAIR EXTENSIONS' + 'Bali' tulisan tangan",
  },
  "Multi-page site (Home / Products / Tips / Gallery / Book)": {
    id: "Situs multi-halaman (Home / Products / Tips / Gallery / Book)",
  },
  "Video hero showcasing the studio color wall": {
    id: "Video hero menampilkan color wall studio",
  },
  "Gallery with method filters (transformations / products & color / studio)": {
    id: "Galeri dengan filter metode (transformations / products & color / studio)",
  },
  "Six service methods with detail and IDR pricing": {
    id: "Enam metode layanan dengan detail dan harga IDR",
  },
  "Direct-to-WhatsApp booking flow, Bali's appointment language": {
    id: "Alur booking langsung ke WhatsApp, bahasa janji temu khas Bali",
  },

  // Astungkare Spa
  "Bali's spa market is crowded with brick-and-mortar wellness brands competing for the same walk-in foot traffic. Astungkare took the opposite bet: the spa comes to you, 24 hours a day, across the island. The job was to make that promise feel as effortless online as it does in person, a hero that tells you the earliest tonight slot in real time, treatments priced and explained without spa-speak, a cancellation policy you can read before you book, and a single tap to WhatsApp the therapist directly. The brand is dark gold and serif-led, the kind of restraint that lets the service do the talking. Site, social, and paid media all run from the same studio so the voice and the offer stay aligned across every surface.":
    {
      id: "Pasar spa Bali padat dengan brand wellness fisik yang berebut walk-in di lokasi yang sama. Astungkare bertaruh sebaliknya: spa-nya yang datang ke Anda, 24 jam sehari, di seluruh pulau. Tugasnya adalah membuat janji itu terasa semulus online seperti saat langsung, hero yang memberi tahu slot paling awal malam ini secara real-time, treatment yang diberi harga dan dijelaskan tanpa istilah spa yang berbelit, kebijakan pembatalan yang bisa Anda baca sebelum booking, dan satu ketukan untuk WhatsApp langsung ke terapis. Brand-nya dark gold dan serif-led, kerendahan hati yang membiarkan layanannya berbicara. Situs, sosial, dan paid media semuanya dijalankan dari studio yang sama agar suara dan penawaran tetap selaras di setiap permukaan.",
    },
  "Custom website with editorial dark-gold visual system": {
    id: "Website custom dengan sistem visual editorial dark-gold",
  },
  "Live earliest-availability indicator on the hero": {
    id: "Indikator ketersediaan paling awal secara live di hero",
  },
  "WhatsApp-first booking flow (sub-five-minute reply SLA)": {
    id: "Alur booking WhatsApp-first (SLA balasan di bawah lima menit)",
  },
  "Treatment catalog with mobile-spa logistics + cancellation policy": {
    id: "Katalog treatment dengan logistik spa panggilan + kebijakan pembatalan",
  },
  "Service area pages, Canggu, Seminyak, Ubud, and Bali-wide": {
    id: "Halaman area layanan, Canggu, Seminyak, Ubud, dan seluruh Bali",
  },
  "Always-on social feed + Meta + Google ads management": {
    id: "Social feed always-on + pengelolaan iklan Meta + Google",
  },

  // ============================================================
  // Contact forms
  // ============================================================

  // Group labels
  "Hello, my name is": { id: "Halo, nama saya" },
  "You can reach me at": { id: "Saya bisa dihubungi di" },
  "What's on your mind": { id: "Apa yang ada di benak Anda" },
  "I'm interested in": { id: "Saya tertarik pada" },
  "Budget in mind": { id: "Perkiraan budget" },
  "A bit about the project": { id: "Sedikit tentang proyeknya" },
  "I want to join": { id: "Saya ingin bergabung di" },
  "Portfolio / work link": { id: "Link portfolio / karya" },
  "CV / résumé": { id: "CV / résumé" },
  "Cover letter": { id: "Cover letter" },
  "Type of partnership": { id: "Jenis kerja sama" },
  "The proposal": { id: "Proposalnya" },

  // Captions + buttons
  "One send, email lands automatically, WhatsApp opens for the follow-up. Reply within 48h.":
    {
      id: "Sekali kirim, email masuk otomatis, WhatsApp terbuka untuk tindak lanjut. Balasan dalam 48 jam.",
    },
  "One send, email lands automatically, WhatsApp opens for the follow-up. Reply within 7 days.":
    {
      id: "Sekali kirim, email masuk otomatis, WhatsApp terbuka untuk tindak lanjut. Balasan dalam 7 hari.",
    },
  "One send, email lands automatically, WhatsApp opens for the follow-up. Reply within 5 days.":
    {
      id: "Sekali kirim, email masuk otomatis, WhatsApp terbuka untuk tindak lanjut. Balasan dalam 5 hari.",
    },
  "Send question": { id: "Kirim pertanyaan" },
  "Send the brief": { id: "Kirim brief" },
  "Send application": { id: "Kirim lamaran" },
  "Send proposal": { id: "Kirim proposal" },
  Send: { id: "Kirim" },
  "Sending…": { id: "Mengirim…" },
  "← Send another inquiry": { id: "← Kirim pertanyaan lain" },

  // Success kickers
  "(Question received)": { id: "(Pertanyaan diterima)" },
  "(Brief sent, confirmation on its way)": {
    id: "(Brief terkirim, konfirmasi dalam perjalanan)",
  },
  "(Application received)": { id: "(Lamaran diterima)" },
  "(Partnership proposal received)": { id: "(Proposal kerja sama diterima)" },

  // Success headlines + bodies
  "Got it.": { id: "Diterima." },
  "We'll reply within 48 hours.": { id: "Kami balas dalam 48 jam." },
  "We got it. We'll": { id: "Sudah kami terima. Kami akan" },
  "reply within 48 hours.": { id: "balas dalam 48 jam." },
  "Thanks for applying. We'll": { id: "Terima kasih sudah melamar. Kami akan" },
  "read every word.": { id: "membaca setiap katanya." },
  "We'll be in touch within 5 days.": {
    id: "Kami akan menghubungi dalam 5 hari.",
  },
  "A copy of your question is in your inbox now, keep an eye on it (and check spam, just in case). We also opened a WhatsApp tab if you'd rather keep the conversation there.":
    {
      id: "Salinan pertanyaan Anda sudah ada di inbox sekarang, pantau terus (dan cek spam, untuk jaga-jaga). Kami juga membuka tab WhatsApp jika Anda lebih suka melanjutkan obrolan di sana.",
    },
  "A copy of your brief is in your inbox now, keep an eye on it (and check spam, just in case). We also opened a WhatsApp tab if you'd rather keep the conversation there.":
    {
      id: "Salinan brief Anda sudah ada di inbox sekarang, pantau terus (dan cek spam, untuk jaga-jaga). Kami juga membuka tab WhatsApp jika Anda lebih suka melanjutkan obrolan di sana.",
    },
  "We'll get back within 7 days. If we want to move forward we'll send a short async exercise, no panel interviews, no whiteboards. A copy is in your inbox now, and we opened a WhatsApp tab in case you want to nudge us.":
    {
      id: "Kami akan menghubungi Anda dalam 7 hari. Jika ingin melanjutkan, kami kirim latihan async singkat, tanpa wawancara panel, tanpa whiteboard. Salinannya ada di inbox sekarang, dan kami membuka tab WhatsApp jika Anda ingin mengingatkan kami.",
    },
  "Most partnerships start with a short call after the first async exchange. If the fit is clear, we move fast. A copy is in your inbox now, and we opened a WhatsApp tab in case you want to keep the conversation there.":
    {
      id: "Kebanyakan kerja sama dimulai dengan panggilan singkat setelah pertukaran async pertama. Jika cocok, kami bergerak cepat. Salinannya ada di inbox sekarang, dan kami membuka tab WhatsApp jika Anda ingin melanjutkan obrolan di sana.",
    },

  // Placeholders
  "Full name": { id: "Nama lengkap" },
  "Company (optional)": { id: "Perusahaan (opsional)" },
  "Company / studio": { id: "Perusahaan / studio" },
  "Ask us anything, we read everything.": {
    id: "Tanyakan apa saja, kami membaca semuanya.",
  },
  "Goals, timing, anything we should know…": {
    id: "Tujuan, timeline, apa pun yang perlu kami tahu…",
  },
  "https://your-portfolio.com (optional but encouraged)": {
    id: "https://portfolio-anda.com (opsional tapi disarankan)",
  },
  "https://company.com (optional)": {
    id: "https://perusahaan.com (opsional)",
  },
  "Why Onyx? What kind of work do you want to make next? Anything we should look at first?":
    {
      id: "Kenapa Onyx? Karya seperti apa yang ingin Anda buat berikutnya? Ada yang sebaiknya kami lihat lebih dulu?",
    },
  "What are you proposing, what's in it for both sides, and what would the first 30 days look like?":
    {
      id: "Apa yang Anda usulkan, apa manfaatnya untuk kedua pihak, dan seperti apa 30 hari pertamanya?",
    },

  // CV upload
  "Drop CV here or click to choose": {
    id: "Letakkan CV di sini atau klik untuk memilih",
  },
  Replace: { id: "Ganti" },
  "Choose file": { id: "Pilih file" },
  "PDF, DOC, or DOCX. Max 3 MB. Optional, but speeds things up.": {
    id: "PDF, DOC, atau DOCX. Maks 3 MB. Opsional, tapi mempercepat prosesnya.",
  },

  // Validation
  "Please add your name.": { id: "Mohon isi nama Anda." },
  "Please add your email.": { id: "Mohon isi email Anda." },
  "That email doesn't look right.": { id: "Sepertinya email itu tidak valid." },
  "Tell us what's on your mind.": {
    id: "Beri tahu kami apa yang ada di benak Anda.",
  },
  "Please add a short brief.": { id: "Mohon tambahkan brief singkat." },
  "Pick a department (or 'Open application').": {
    id: "Pilih departemen (atau 'Open application').",
  },
  "Portfolio link should start with http(s)://": {
    id: "Link portfolio harus diawali http(s)://",
  },
  "Add a short cover letter.": { id: "Tambahkan cover letter singkat." },
  "CV must be ≤ 3 MB. Drop a slimmer PDF.": {
    id: "CV harus ≤ 3 MB. Gunakan PDF yang lebih ringan.",
  },
  "CV must be PDF, DOC, or DOCX.": { id: "CV harus PDF, DOC, atau DOCX." },
  "Couldn't read that CV file. Try a different file.": {
    id: "Tidak bisa membaca file CV itu. Coba file lain.",
  },
  "Add your company name.": { id: "Tambahkan nama perusahaan Anda." },
  "Website should start with http(s)://": {
    id: "Website harus diawali http(s)://",
  },
  "Pick a partnership type.": { id: "Pilih jenis kerja sama." },
  "Outline the proposal in a few lines.": {
    id: "Uraikan proposalnya dalam beberapa baris.",
  },

  // SuccessFallback (shared)
  "A copy of your message is in your inbox now, keep an eye on it (and check spam, just in case).":
    {
      id: "Salinan pesan Anda sudah ada di inbox sekarang, pantau terus (dan cek spam, untuk jaga-jaga).",
    },
  "Or write us anytime at": { id: "Atau hubungi kami kapan saja di" },
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
