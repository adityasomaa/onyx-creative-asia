import { l, type L } from "@/lib/l10n";

/**
 * Every line of interface and section copy on the marketing site, in all
 * four languages. Headlines that carry highlighted words use `*word*`
 * markers; <Headline> turns each marked run into an accent block.
 *
 * Voice: plain, specific, a little dry. Claims are limited to what the
 * studio can stand behind: real clients, real services, published prices.
 */

/* ───────────────────────── Navigation ───────────────────────── */

export const NAV: { href: string; label: L; meta: L }[] = [
  { href: "/", label: l("Home", "Beranda", "首页", "ホーム"), meta: l("Bali, Indonesia", "Bali, Indonesia", "印尼 · 巴厘岛", "インドネシア・バリ") },
  { href: "/services", label: l("Services", "Layanan", "服务", "サービス"), meta: l("06", "06", "06", "06") },
  { href: "/#process", label: l("Process", "Proses", "流程", "プロセス"), meta: l("2–4 weeks", "2–4 minggu", "2–4 周", "2〜4週間") },
  { href: "/projects", label: l("Projects", "Proyek", "项目", "プロジェクト"), meta: l("12", "12", "12", "12") },
  { href: "/about", label: l("About", "Tentang", "关于", "私たちについて"), meta: l("One team", "Satu tim", "一支团队", "ひとつのチーム") },
  { href: "/notes", label: l("Notes", "Catatan", "笔记", "ノート"), meta: l("03", "03", "03", "03") },
  { href: "/enquire", label: l("Enquire", "Hubungi", "咨询", "お問い合わせ"), meta: l("1 day reply", "Balas 1 hari", "1 天内回复", "1日以内に返信") },
];

export const UI = {
  openMenu: l("Open menu", "Buka menu", "打开菜单", "メニューを開く"),
  closeMenu: l("Close menu", "Tutup menu", "关闭菜单", "メニューを閉じる"),
  home: l("Onyx Creative Asia, home", "Onyx Creative Asia, beranda", "Onyx Creative Asia 首页", "Onyx Creative Asia ホーム"),
  latestProject: l("Latest project", "Proyek terbaru", "最新项目", "最新プロジェクト"),
  ourTime: l("Our time", "Waktu kami", "我们的时间", "現地時間"),
  language: l("Language", "Bahasa", "语言", "言語"),
  search: l("Search", "Cari", "搜索", "検索"),
  noMatch: l("No match", "Tidak ditemukan", "没有匹配项", "該当なし"),
  accentTitle: l("Pick an accent", "Pilih warna aksen", "选一个强调色", "アクセントカラーを選ぶ"),
  accentBody: l(
    "Every accent across the site updates instantly.",
    "Semua aksen di situs langsung ikut berubah.",
    "全站的强调色会立即更新。",
    "サイト全体のアクセントがすぐに切り替わります。",
  ),
  accentCustom: l("Custom colour", "Warna sendiri", "自定义颜色", "カスタムカラー"),
  accentReset: l("Reset to original", "Kembalikan ke awal", "恢复默认", "元に戻す"),
  accentToggle: l("Change accent colour", "Ganti warna aksen", "更改强调色", "アクセントカラーを変更"),
  contactFab: l("Chat with us", "Chat dengan kami", "和我们聊聊", "チャットで相談"),
  contactFabSub: l("WhatsApp · replies in a day", "WhatsApp · dibalas dalam sehari", "WhatsApp · 一天内回复", "WhatsApp · 1日以内に返信"),
  readMore: l("Read more", "Baca selengkapnya", "阅读全文", "続きを読む"),
  projectsCount: l("projects", "proyek", "个项目", "件"),
  projectCount: l("project", "proyek", "个项目", "件"),
  minRead: l("min read", "menit baca", "分钟阅读", "分で読めます"),
  by: l("By", "Oleh", "作者", "執筆"),
  allNotes: l("All notes", "Semua catatan", "全部笔记", "すべてのノート"),
  moreNotes: l("More notes", "Catatan lainnya", "更多笔记", "ほかのノート"),
  moreProjects: l("More projects", "Proyek lainnya", "更多项目", "ほかのプロジェクト"),
  allProjects: l("All projects", "Semua proyek", "全部项目", "すべてのプロジェクト"),
  liveProject: l("Live project", "Lihat situsnya", "查看上线项目", "公開中のサイト"),
  viewProject: l("View project", "Lihat proyek", "查看项目", "プロジェクトを見る"),
  skip: l("Skip to content", "Langsung ke konten", "跳到正文", "本文へスキップ"),
  close: l("Close", "Tutup", "关闭", "閉じる"),
};

/* ───────────────────────── Site assistant ───────────────────────── */

export const CHAT = {
  launcher: l("Ask our AI", "Tanya AI kami", "问问我们的 AI", "AIに聞く"),
  launcherSub: l("Instant answers · 24/7", "Jawaban instan · 24/7", "即时回答 · 全天候", "すぐに回答 · 24時間"),
  title: l("Onyx assistant", "Asisten Onyx", "Onyx 助手", "Onyx アシスタント"),
  status: l("AI · answers in seconds", "AI · menjawab dalam detik", "AI · 几秒内回答", "AI · 数秒で回答"),
  greeting: l(
    "Hi. We're the Onyx assistant, an AI trained on this site. Ask about our services, our work, or how a project starts.",
    "Halo. Kami asisten Onyx, AI yang dilatih dari isi situs ini. Tanyakan soal layanan, karya kami, atau cara memulai proyek.",
    "你好。我们是 Onyx 助手，一个基于本站内容的 AI。可以问我们的服务、作品，或项目如何开始。",
    "こんにちは。Onyx アシスタントです。このサイトの内容で学習した AI です。サービス、実績、プロジェクトの始め方について聞いてください。",
  ),
  suggestions: [
    l("What do you build?", "Apa saja yang kalian kerjakan?", "你们做什么？", "何を作っていますか？"),
    l("Can you build an AI receptionist for us?", "Bisa buatkan AI receptionist untuk bisnis kami?", "能为我们做一个 AI 接待员吗？", "AI 受付を作ってもらえますか？"),
    l("How does a project start?", "Bagaimana proyek dimulai?", "项目怎么开始？", "プロジェクトはどう始まりますか？"),
  ],
  placeholder: l("Type your question…", "Ketik pertanyaan Anda…", "输入你的问题…", "質問を入力…"),
  inputLabel: l("Your message", "Pesan Anda", "你的消息", "メッセージ"),
  send: l("Send", "Kirim", "发送", "送信"),
  open: l("Open the AI assistant", "Buka asisten AI", "打开 AI 助手", "AI アシスタントを開く"),
  typing: l("Typing", "Mengetik", "正在输入", "入力中"),
  disclaimer: l(
    "AI assistant. For scope and quotes, the team replies on WhatsApp.",
    "Asisten AI. Untuk scope dan penawaran, tim membalas lewat WhatsApp.",
    "AI 助手。范围和报价由团队在 WhatsApp 上回复。",
    "AI アシスタントです。範囲と見積もりはチームが WhatsApp で返信します。",
  ),
  tooFast: l(
    "That's a few too many messages at once. Try again in a minute.",
    "Pesannya terlalu cepat. Coba lagi semenit lagi.",
    "消息发得有点快，请一分钟后再试。",
    "メッセージが続きすぎました。1分後にもう一度どうぞ。",
  ),
  failed: l(
    "We can't answer right now. Message the team on WhatsApp instead.",
    "Kami belum bisa menjawab sekarang. Silakan hubungi tim lewat WhatsApp.",
    "现在无法回答，请在 WhatsApp 上联系团队。",
    "今は回答できません。WhatsApp でチームに連絡してください。",
  ),
  limit: l(
    "That's the limit for this chat. The team can pick it up on WhatsApp.",
    "Batas percakapan ini sudah tercapai. Tim bisa lanjutkan lewat WhatsApp.",
    "本次对话已达上限，团队可以在 WhatsApp 上继续。",
    "このチャットの上限です。続きは WhatsApp でチームが対応します。",
  ),
};

/* ───────────────────────── Loader ───────────────────────── */

export const LOADER = {
  tagline: l(
    "Digital business development agency",
    "Agensi pengembangan bisnis digital",
    "数字化业务发展机构",
    "デジタル・ビジネス開発エージェンシー",
  ),
};

/* ───────────────────────── Home: hero ───────────────────────── */

export const HERO = {
  eyebrow: l(
    "Digital business development agency",
    "Agensi pengembangan bisnis digital",
    "数字化业务发展机构",
    "デジタル・ビジネス開発エージェンシー",
  ),
  headline: l(
    "We build what makes *businesses* *grow* online.",
    "Kami membangun yang membuat *bisnis* *tumbuh* di online.",
    "我们打造让*生意*在线上*增长*的一切。",
    "*ビジネス*が*伸びる*しくみを、オンラインで。",
  ),
  subtitle: l(
    "Websites, software, brands and campaigns, made by one team from the first call to launch, and kept running after.",
    "Website, software, brand, dan kampanye, dikerjakan satu tim dari panggilan pertama sampai peluncuran, lalu tetap dijalankan sesudahnya.",
    "网站、软件、品牌和广告，由同一支团队从第一通电话做到上线，上线之后也继续由我们运营。",
    "ウェブサイト、ソフトウェア、ブランド、広告。最初の通話から公開まで一つのチームで手がけ、公開後も運用します。",
  ),
  reminder: l("First step — a 30 min call", "Langkah pertama — call 30 menit", "第一步 —— 30 分钟通话", "最初の一歩 — 30分の通話"),
  cta: l("Start a project", "Mulai proyek", "开始一个项目", "プロジェクトを始める"),
  ctaMeta: l("Reply within a working day", "Dibalas dalam satu hari kerja", "一个工作日内回复", "1営業日以内に返信"),
  hours: l("Studio hours · Bali", "Jam studio · Bali", "工作时间 · 巴厘岛", "スタジオの営業時間・バリ"),
  openNow: l("Open now", "Sedang buka", "正在营业", "営業中"),
  opensAt: l("Closed now", "Sedang tutup", "当前休息", "営業時間外"),
  everyDay: l("Mon–Fri, 08:00–22:00 WITA", "Sen–Jum, 08:00–22:00 WITA", "周一至周五 08:00–22:00（WITA）", "月〜金 08:00〜22:00（WITA）"),
  scroll: l("Scroll", "Gulir", "向下滚动", "スクロール"),
};

/* ───────────────────────── Home: clients ───────────────────────── */

export const CLIENTS_COPY = {
  title: l("Who have we worked with?", "Kami sudah bekerja dengan siapa?", "我们和谁合作过？", "これまでの取引先は？"),
  note: l(
    "Every name here has a case study on this site.",
    "Setiap nama di sini punya studi kasus di situs ini.",
    "这里的每个名字，在本站都有一篇案例。",
    "ここにある名前には、すべてこのサイトに事例があります。",
  ),
};

/* ───────────────────────── Home: showreel ───────────────────────── */

export const SHOWREEL = {
  label: l("Showreel 2025 — 2026", "Showreel 2025 — 2026", "作品集锦 2025 — 2026", "ショーリール 2025 — 2026"),
  question: l(
    "Are we any good? Judge for yourself.",
    "Apa kami bagus? Nilai sendiri.",
    "我们够不够好？你自己判断。",
    "腕前はどうか。ご自身で判断を。",
  ),
  cta: l("View works", "Lihat karya", "查看作品", "作品を見る"),
  ctaMeta: l("Real client work. No stock footage.", "Karya klien sungguhan. Tanpa stok video.", "真实的客户作品，没有素材库画面。", "実際のクライアントワーク。ストック映像なし。"),
};

/* ───────────────────────── Home: expertise ───────────────────────── */

export const EXPERTISE = {
  section: l("Expertise", "Keahlian", "专长", "専門領域"),
  question: l("What do we actually do?", "Sebenarnya apa yang kami kerjakan?", "我们到底做什么？", "実際に何をしているのか？"),
  headline: l(
    "*Websites*, *software*, *brands*, *campaigns*, *AI*. Run as one practice, not six vendors.",
    "*Website*, *software*, *brand*, *kampanye*, *AI*. Dijalankan sebagai satu praktik, bukan enam vendor.",
    "*网站*、*软件*、*品牌*、*广告*、*AI*。作为一个整体来做，而不是六家供应商。",
    "*ウェブ*、*ソフト*、*ブランド*、*広告*、*AI*。六社ではなく、ひとつの実践として。",
  ),
  subtitle: l(
    "A business arrives here with a goal and leaves with the system that meets it, planned, built and run by the same people.",
    "Sebuah bisnis datang ke sini dengan satu tujuan dan pulang membawa sistem untuk mencapainya, direncanakan, dibangun, dan dijalankan oleh orang yang sama.",
    "一家公司带着一个目标来，带着实现目标的整套系统离开，从规划、搭建到运营，都是同一批人。",
    "目標を持って来た会社が、それを達成するしくみを持って帰る。計画も、構築も、運用も同じ人たちで。",
  ),
  metaA: l("Practice", "Praktik", "业务范围", "領域"),
  metaAValue: l("Build, market, measure, automate", "Bangun, pasarkan, ukur, otomasi", "搭建、推广、衡量、自动化", "つくる、届ける、測る、自動化する"),
  metaB: l("Working method", "Cara kerja", "工作方式", "進め方"),
  metaBValue: l("The people who plan it build it", "Yang merencanakan juga yang membangun", "规划的人就是动手的人", "計画した人が、そのまま作る"),
};

/* ───────────────────────── Services (/services, /services/[slug]) ───────────────────────── */

export const SERVICES_PAGE = {
  section: l("Services", "Layanan", "服务", "サービス"),
  question: l("What can we take off your plate?", "Apa yang bisa kami ambil alih?", "我们能帮你接手什么？", "何をお任せいただけますか？"),
  headline: l(
    "*Six* *services*, one team that runs them together.",
    "*Enam* *layanan*, satu tim yang menjalankannya bersama.",
    "*六项服务*，由同一个团队一起来做。",
    "*六つのサービス*を、ひとつのチームでまとめて。",
  ),
  subtitle: l(
    "Pick one, or let them work as a system: the site, the brand, the ads, the content, the numbers and the AI that runs the busywork, planned by the same people.",
    "Pilih satu, atau biarkan semuanya bekerja sebagai satu sistem: situs, brand, iklan, konten, angka, dan AI yang menjalankan pekerjaan rutin, direncanakan oleh orang yang sama.",
    "可以只选一项，也可以让它们作为一个系统一起运转：网站、品牌、广告、内容、数据，以及处理琐事的 AI，由同一批人来规划。",
    "ひとつだけでも、全部をひとつのしくみとしても。サイト、ブランド、広告、コンテンツ、数字、そして雑務を回すAIを、同じ人たちが計画します。",
  ),
  view: l("View service", "Lihat layanan", "查看服务", "サービスを見る"),
  overview: l("Overview", "Ringkasan", "概述", "概要"),
  included: l("What's included", "Yang termasuk", "包含内容", "含まれるもの"),
  howItRuns: l("How it runs", "Cara kerjanya", "怎么推进", "進め方"),
  work: l("Work that used it", "Proyek yang memakainya", "用到它的项目", "このサービスを使った仕事"),
  noWork: l(
    "Case studies for this service are being written up. Ask us for examples on a call.",
    "Studi kasus untuk layanan ini sedang ditulis. Minta contohnya saat call.",
    "这项服务的案例正在整理中，可以在电话里问我们要例子。",
    "このサービスの事例はまとめている最中です。通話で実例をお見せします。",
  ),
  next: l("Next service", "Layanan berikutnya", "下一项服务", "次のサービス"),
  all: l("All services", "Semua layanan", "全部服务", "すべてのサービス"),
  ctaTitle: l(
    "Want this for *your* *business*?",
    "Mau ini untuk *bisnis* *Anda*?",
    "想把它用在*你的生意*上？",
    "*あなたの事業*にも？",
  ),
  ctaBody: l(
    "Tell us what you're trying to fix. A person replies within a working day with a short call and a written scope.",
    "Ceritakan apa yang ingin Anda perbaiki. Orang sungguhan membalas dalam satu hari kerja, dengan call singkat dan cakupan tertulis.",
    "告诉我们你想解决什么。一个工作日内会有真人回复，接着是一通简短的电话和一份书面范围。",
    "解決したいことを教えてください。1営業日以内に人から返信し、短い通話と書面の範囲をお送りします。",
  ),
};

/* ───────────────────────── Home: results ───────────────────────── */

export const RESULTS = {
  section: l("Results", "Hasil", "成果", "実績"),
  question: l("How consistent are we?", "Seberapa konsisten kami?", "我们有多稳定？", "どれだけ安定しているか？"),
  headline: l(
    "*What* *we* *count*, not what we claim.",
    "*Yang* *kami* *hitung*, bukan yang kami klaim.",
    "*我们*统计的，不是我们*宣称*的。",
    "*数えた*ものだけ。*言い張る*ものではなく。",
  ),
  subtitle: l(
    "Numbers only mean something if the next one holds. Bring the project that needs to.",
    "Angka hanya berarti kalau angka berikutnya bertahan. Bawa proyek yang membutuhkannya.",
    "只有下一个数字也站得住，数字才有意义。把需要它的项目带来吧。",
    "数字に意味があるのは、次も同じ結果が出るときだけ。それが必要なプロジェクトをお持ちください。",
  ),
  metaA: l("Counting since", "Dihitung sejak", "统计起始", "集計開始"),
  metaAValue: l("2023", "2023", "2023 年", "2023年"),
  metaB: l("Based in", "Berbasis di", "所在地", "拠点"),
  metaBValue: l("Bali, Indonesia", "Bali, Indonesia", "印尼巴厘岛", "インドネシア・バリ"),
  next: l("Be the next on the list", "Jadilah yang berikutnya", "成为下一个", "次はあなたの番"),
  nextHeadline: l(
    "Every number here started with a call.",
    "Setiap angka di sini dimulai dari satu panggilan.",
    "这里的每一个数字，都是从一通电话开始的。",
    "ここにある数字は、すべて一本の電話から始まりました。",
  ),
  cards: [
    {
      tag: l("Delivery", "Delivery", "交付", "納品"),
      value: 120,
      suffix: "+",
      unit: l("projects", "proyek", "个项目", "件"),
      note: l(
        "Projects delivered for clients across Indonesia and beyond.",
        "Proyek yang diselesaikan untuk klien di Indonesia dan luar negeri.",
        "为印尼及海外客户交付的项目。",
        "インドネシア国内外のクライアントに納めたプロジェクト。",
      ),
      art: "cube" as const,
    },
    {
      tag: l("Range", "Jangkauan", "覆盖面", "幅"),
      value: 20,
      suffix: "+",
      unit: l("industries", "industri", "个行业", "業種"),
      note: l(
        "From villas and spas to freight, recruitment and retail.",
        "Dari vila dan spa sampai logistik, rekrutmen, dan ritel.",
        "从别墅、水疗到货运、招聘和零售。",
        "ヴィラやスパから、物流、採用、小売まで。",
      ),
      art: "rings" as const,
    },
    {
      tag: l("Tooling", "Tooling", "工具", "ツール"),
      value: 50,
      suffix: "+",
      unit: l("platforms", "platform", "个平台", "プラットフォーム"),
      note: l(
        "Platforms we build on, connect to and run campaigns through.",
        "Platform tempat kami membangun, menghubungkan, dan menjalankan kampanye.",
        "我们在上面开发、打通和投放广告的平台。",
        "開発し、連携し、広告を回しているプラットフォーム。",
      ),
      art: "target" as const,
    },
    {
      tag: l("Track record", "Rekam jejak", "履历", "実績年数"),
      value: 3,
      suffix: "+",
      unit: l("years", "tahun", "年", "年"),
      note: l(
        "Years shipping websites, campaigns and systems from Bali.",
        "Tahun merilis website, kampanye, dan sistem dari Bali.",
        "从巴厘岛交付网站、广告和系统的年头。",
        "バリから、サイトやキャンペーンやシステムを届けてきた年数。",
      ),
      art: "box" as const,
    },
  ],
};

/* ───────────────────────── Home: project index ───────────────────────── */

export const INDEX = {
  heading: l("Project index", "Indeks proyek", "项目索引", "プロジェクト一覧"),
  side: l("Selected work", "Karya pilihan", "精选作品", "厳選した仕事"),
  total: l("Case studies published", "Studi kasus dipublikasikan", "篇已发布的案例", "公開中の事例"),
  totalNote: l(
    "Each one names the client and links the live work.",
    "Masing-masing menyebut kliennya dan menautkan karya yang sedang berjalan.",
    "每一篇都写明客户，并附上线上作品链接。",
    "どれもクライアント名を明かし、公開中の成果物にリンクしています。",
  ),
  colYear: l("Year", "Tahun", "年份", "年"),
  colClient: l("Client", "Klien", "客户", "クライアント"),
  colWork: l("Work", "Pekerjaan", "工作内容", "内容"),
  colScope: l("Scope", "Cakupan", "范围", "範囲"),
};

/* ───────────────────────── Home: manifesto ───────────────────────── */

export const MANIFESTO: { kicker: L; text: L }[] = [
  {
    kicker: l("— Here's the thing", "— Begini masalahnya", "—— 事情是这样的", "— つまり"),
    text: l(
      "Attention is *cheap*. Everyone's *renting* the same clicks this week.",
      "Perhatian itu *murah*. Semua orang *menyewa* klik yang sama minggu ini.",
      "注意力很*便宜*。这周大家都在*租*同一批点击。",
      "注目は*安い*。今週はみんな、同じクリックを*借りている*。",
    ),
  },
  {
    kicker: l("— Which means", "— Artinya", "—— 也就是说", "— ということは"),
    text: l(
      "A click can be bought. *A* *business* *that* *grows* *can't.*",
      "Klik bisa dibeli. *Bisnis* *yang* *tumbuh* *tidak.*",
      "点击可以买到。*持续增长的生意*，*买不到。*",
      "クリックは買える。*伸び続ける*ビジネスは、*買えない。*",
    ),
  },
  {
    kicker: l("— And here we go", "— Dan di sinilah kami", "—— 所以我们来了", "— だから私たちは"),
    text: l(
      "We don't build for the click. *We* *build* *what* *keeps* *paying* *back.*",
      "Kami tidak membangun untuk klik. *Kami* *membangun* *yang* *terus* *kembali* *modal.*",
      "我们不为点击而做。*我们做的，是会一直回本的东西。*",
      "クリックのためには作らない。*作るのは、回収し続けるもの。*",
    ),
  },
];

/* ───────────────────────── Home: process ───────────────────────── */

export const PROCESS = {
  section: l("Process", "Proses", "流程", "プロセス"),
  question: l("What happens after we say yes?", "Apa yang terjadi setelah kami bilang ya?", "我们答应之后，会发生什么？", "引き受けたあと、何が起きるか？"),
  headline: l(
    "*The* *idea* *that* *wins* is the one that ships.",
    "*Ide* *yang* *menang* adalah yang dirilis.",
    "*赢的点子*，是真正上线的那一个。",
    "*勝つアイデア*は、世に出たアイデアだ。",
  ),
  subtitle: l(
    "We don't separate the thinking from the making. The same people, from the first call to launch.",
    "Kami tidak memisahkan berpikir dari mengerjakan. Orang yang sama, dari panggilan pertama sampai peluncuran.",
    "我们不把想和做分开。从第一通电话到上线，都是同一批人。",
    "考えることと作ることを分けない。最初の通話から公開まで、同じ人たちで。",
  ),
  metaA: l("Kickoff to launch", "Kickoff sampai rilis", "启动到上线", "キックオフから公開まで"),
  metaAValue: l("2–4 weeks", "2–4 minggu", "2–4 周", "2〜4週間"),
  metaB: l("Check-ins", "Check-in", "同步频率", "定例"),
  metaBValue: l("Weekly", "Mingguan", "每周", "毎週"),
  metaC: l("Revisions", "Revisi", "修改", "修正"),
  metaCValue: l("Until it's right", "Sampai pas", "改到对为止", "納得いくまで"),
  pick: l("Pick a service", "Pilih layanan", "选择服务", "サービスを選ぶ"),
  /**
   * One run per service, in the order of SERVICES. Each step carries its
   * bar as [start, end] fractions of the timeline; `focus` is the step
   * where most of the work happens, drawn in the accent.
   */
  tracks: [
    {
      service: "web-software",
      tab: l("Web & software", "Web & software", "网站与软件", "ウェブ・ソフト"),
      label: l("A five-to-ten-page site, four weeks", "Situs lima sampai sepuluh halaman, empat minggu", "五到十个页面的网站，四周", "5〜10ページのサイト、4週間"),
      note: l("Software is scoped and timed on its own", "Software dihitung cakupan dan waktunya tersendiri", "软件项目单独定范围和工期", "ソフトウェアは別途、範囲と期間を決めます"),
      weeks: 4,
      focus: 3,
      steps: [
        {
          title: l("Listen", "Dengar", "倾听", "聞く"),
          body: l("One call to understand the business. That is the meeting.", "Satu call untuk memahami bisnisnya. Itulah rapatnya.", "一通电话，把生意弄明白。会就开这一次。", "事業を理解するための一本の通話。それが会議のすべて。"),
          mark: l("Kickoff, week 1", "Kickoff, minggu 1", "启动，第 1 周", "キックオフ・1週目"),
          bar: [0, 0.05],
        },
        {
          title: l("Scope", "Rancang", "定范围", "決める"),
          body: l("A written scope and price before anything starts.", "Cakupan dan harga tertulis sebelum apa pun dimulai.", "开工前，先给出书面的范围和报价。", "着手前に、書面で範囲と価格を。"),
          mark: l("Scope, week 1", "Cakupan, minggu 1", "范围确认，第 1 周", "範囲確定・1週目"),
          bar: [0.05, 0.15],
        },
        {
          title: l("Design", "Desain", "设计", "デザイン"),
          body: l("Design in the open, on a live preview link.", "Desain dikerjakan terbuka, lewat link preview langsung.", "公开地设计，随时可看的预览链接。", "公開のプレビューリンクで、見える形でデザイン。"),
          mark: l("Design, weeks 1–2", "Desain, minggu 1–2", "设计，第 1–2 周", "デザイン・1〜2週目"),
          bar: [0.15, 0.5],
        },
        {
          title: l("Build", "Bangun", "开发", "組む"),
          body: l("Built by the same hands that designed it.", "Dibangun oleh tangan yang sama yang mendesainnya.", "由设计它的同一双手来开发。", "デザインした手で、そのまま実装。"),
          mark: l("Build, weeks 2–4", "Bangun, minggu 2–4", "开发，第 2–4 周", "実装・2〜4週目"),
          bar: [0.5, 0.88],
        },
        {
          title: l("Launch", "Rilis", "上线", "公開"),
          body: l("Live, connected and handed over, then we stay on it.", "Tayang, terhubung, diserahkan, lalu kami tetap menjaganya.", "上线、接通、交接，然后继续盯着。", "公開し、つなぎ、引き渡し、その後も見守る。"),
          mark: l("Live, week 4 →", "Tayang, minggu 4 →", "上线，第 4 周 →", "公開・4週目 →"),
          bar: [0.88, 1],
        },
      ],
    },
    {
      service: "branding-design",
      tab: l("Branding", "Branding", "品牌", "ブランディング"),
      label: l("Identity to brand book, three weeks", "Identitas sampai brand book, tiga minggu", "从标识到品牌手册，三周", "アイデンティティからブランドブックまで3週間"),
      note: l("Packaging and print run on top", "Kemasan dan cetak berjalan setelahnya", "包装和印刷另外排期", "パッケージと印刷はその後に"),
      weeks: 3,
      focus: 2,
      steps: [
        {
          title: l("Listen", "Dengar", "倾听", "聞く"),
          body: l("One call about the business, who it serves and who it's up against.", "Satu call tentang bisnisnya, siapa yang dilayani, dan siapa pesaingnya.", "一通电话，聊生意、聊客户、聊对手。", "事業、顧客、競合についての一本の通話。"),
          mark: l("Kickoff, day 1", "Kickoff, hari 1", "启动，第 1 天", "キックオフ・1日目"),
          bar: [0, 0.06],
        },
        {
          title: l("Audit", "Audit", "盘点", "調べる"),
          body: l("The category on one page, so the brand can look like nothing in it.", "Peta kategorinya dalam satu halaman, supaya brand-nya tidak mirip siapa pun di sana.", "把整个品类摊在一页纸上，好让品牌和谁都不像。", "業界を一枚にまとめ、どこにも似ないブランドを目指す。"),
          mark: l("Audit, week 1", "Audit, minggu 1", "盘点，第 1 周", "調査・1週目"),
          bar: [0.06, 0.22],
        },
        {
          title: l("Explore", "Jelajah", "探索", "探る"),
          body: l("Two or three directions, shown on real things: a sign, a post, a box.", "Dua atau tiga arah, ditunjukkan di benda nyata: papan nama, postingan, kemasan.", "两三个方向，放在真实的东西上看：招牌、帖子、包装盒。", "2〜3の方向性を、看板や投稿、箱など実物の上で見せる。"),
          mark: l("Directions, weeks 1–2", "Arah desain, minggu 1–2", "方向提案，第 1–2 周", "方向性・1〜2週目"),
          bar: [0.22, 0.55],
        },
        {
          title: l("Refine", "Matangkan", "打磨", "磨く"),
          body: l("One direction, taken all the way: logo, type, colour and voice.", "Satu arah, dituntaskan: logo, tipografi, warna, dan gaya bahasa.", "选定一个方向做到底：标志、字体、颜色、语气。", "一つの方向を最後まで。ロゴ、書体、色、言葉づかい。"),
          mark: l("Refine, weeks 2–3", "Pematangan, minggu 2–3", "打磨，第 2–3 周", "仕上げ・2〜3週目"),
          bar: [0.55, 0.88],
        },
        {
          title: l("Hand over", "Serahkan", "交付", "渡す"),
          body: l("A brand book and every file, in formats your team can use.", "Brand book dan semua file, dalam format yang bisa dipakai tim Anda.", "一本品牌手册和全部文件，格式都是你的团队用得上的。", "ブランドブックと全ファイルを、チームが使える形式で。"),
          mark: l("Brand book, week 3 →", "Brand book, minggu 3 →", "品牌手册，第 3 周 →", "ブランドブック・3週目 →"),
          bar: [0.88, 1],
        },
      ],
    },
    {
      service: "ads-management",
      tab: l("Ads", "Iklan", "广告", "広告"),
      label: l("Strategy to first flight, two weeks", "Strategi sampai tayang perdana, dua minggu", "从策略到首轮投放，两周", "戦略から初回配信まで2週間"),
      note: l("Then adjusted every week", "Lalu disesuaikan tiap minggu", "之后每周调整", "その後は毎週調整"),
      weeks: 2,
      focus: 2,
      steps: [
        {
          title: l("Audit", "Audit", "盘点", "調べる"),
          body: l("Accounts, pixels and past spend, read before anything changes.", "Akun, pixel, dan belanja iklan sebelumnya, dibaca sebelum ada yang diubah.", "账户、像素和历史花费，动手之前先看清楚。", "アカウント、ピクセル、過去の出稿を、何かを変える前に読む。"),
          mark: l("Audit, day 1", "Audit, hari 1", "盘点，第 1 天", "現状確認・1日目"),
          bar: [0, 0.1],
        },
        {
          title: l("Plan", "Rencana", "规划", "計画"),
          body: l("Audiences, the budget split and the one number we're moving.", "Audiens, pembagian budget, dan satu angka yang ingin kita gerakkan.", "受众、预算分配，以及我们要推动的那一个数字。", "オーディエンス、予算配分、そして動かす一つの数字。"),
          mark: l("Plan, day 3", "Rencana, hari 3", "方案，第 3 天", "計画・3日目"),
          bar: [0.1, 0.25],
        },
        {
          title: l("Creative", "Materi", "素材", "制作"),
          body: l("Ads made for each platform, not one cut resized.", "Iklan dibuat untuk tiap platform, bukan satu versi yang diubah ukurannya.", "每个平台单独做素材，不是一版改尺寸。", "プラットフォームごとに作る。一本をリサイズするのではなく。"),
          mark: l("Creative, week 1", "Materi, minggu 1", "素材，第 1 周", "クリエイティブ・1週目"),
          bar: [0.25, 0.6],
        },
        {
          title: l("Set up", "Setup", "搭建", "設定"),
          body: l("Tracking checked end to end, campaigns built, nothing guessed.", "Tracking dicek dari ujung ke ujung, kampanye dibangun, tanpa tebak-tebakan.", "追踪从头到尾核对一遍，搭好广告系列，不靠猜。", "計測を端から端まで確認し、キャンペーンを組む。推測はしない。"),
          mark: l("Setup, week 2", "Setup, minggu 2", "搭建，第 2 周", "設定・2週目"),
          bar: [0.6, 0.85],
        },
        {
          title: l("Optimise", "Optimasi", "优化", "改善"),
          body: l("First flight, then a weekly read and a weekly change.", "Tayang perdana, lalu dibaca dan disesuaikan tiap minggu.", "首轮投放，之后每周看数据、每周调整。", "初回配信のあとは、毎週読み、毎週変える。"),
          mark: l("First flight →", "Tayang perdana →", "首轮投放 →", "初回配信 →"),
          bar: [0.85, 1],
        },
      ],
    },
    {
      service: "social-media",
      tab: l("Social media", "Media sosial", "社交媒体", "SNS"),
      label: l("The first month, then every month", "Bulan pertama, lalu setiap bulan", "第一个月，之后每月循环", "最初の1か月、その後は毎月"),
      note: l("A monthly cycle from month two", "Siklus bulanan mulai bulan kedua", "从第二个月起按月循环", "2か月目からは月次サイクル"),
      weeks: 4,
      focus: 3,
      steps: [
        {
          title: l("Audit", "Audit", "盘点", "調べる"),
          body: l("What you've posted, what worked, and what the competition posts.", "Apa yang sudah diposting, apa yang berhasil, dan apa yang diposting kompetitor.", "你发过什么、什么有效、对手在发什么。", "これまでの投稿、効いたもの、競合の投稿。"),
          mark: l("Audit, week 1", "Audit, minggu 1", "盘点，第 1 周", "現状確認・1週目"),
          bar: [0, 0.12],
        },
        {
          title: l("Plan", "Rencana", "规划", "計画"),
          body: l("Content pillars, a monthly calendar and a tone everyone signs off.", "Pilar konten, kalender bulanan, dan gaya bahasa yang disetujui semua.", "内容支柱、月度日历，以及大家都认可的语气。", "コンテンツの柱、月間カレンダー、全員が合意したトーン。"),
          mark: l("Calendar, week 1", "Kalender, minggu 1", "内容日历，第 1 周", "カレンダー・1週目"),
          bar: [0.12, 0.25],
        },
        {
          title: l("Shoot", "Produksi", "拍摄", "撮る"),
          body: l("One production day covers a month of photo and video.", "Satu hari produksi untuk foto dan video sebulan.", "一天拍摄，够用一个月的照片和视频。", "1日の撮影で、1か月分の写真と動画を。"),
          mark: l("Shoot day, week 2", "Hari produksi, minggu 2", "拍摄日，第 2 周", "撮影日・2週目"),
          bar: [0.25, 0.45],
        },
        {
          title: l("Publish", "Posting", "发布", "投稿"),
          body: l("Posted on schedule, captions written, comments answered.", "Diposting sesuai jadwal, caption ditulis, komentar dibalas.", "按计划发布，文案写好，评论有人回。", "予定どおりに投稿、キャプションも、コメント返信も。"),
          mark: l("Posting, weeks 2–4", "Posting, minggu 2–4", "发布，第 2–4 周", "投稿・2〜4週目"),
          bar: [0.45, 0.9],
        },
        {
          title: l("Report", "Laporan", "复盘", "報告"),
          body: l("A monthly read: what grew, what didn't, what changes next.", "Laporan bulanan: apa yang tumbuh, apa yang tidak, apa yang diubah berikutnya.", "每月复盘：什么涨了，什么没涨，下个月改什么。", "月次の振り返り。伸びたもの、伸びなかったもの、次に変えること。"),
          mark: l("Report, week 4 →", "Laporan, minggu 4 →", "月报，第 4 周 →", "月次報告・4週目 →"),
          bar: [0.9, 1],
        },
      ],
    },
    {
      service: "growth-analytics",
      tab: l("Growth", "Growth", "增长", "グロース"),
      label: l("Set up in three weeks, then reviewed monthly", "Disiapkan dalam tiga minggu, lalu ditinjau bulanan", "三周搭好，之后每月复盘", "3週間で整え、その後は毎月見直し"),
      note: l("Tests keep running after that", "Pengujian terus berjalan setelahnya", "之后持续测试", "テストはその後も続けます"),
      weeks: 3,
      focus: 3,
      steps: [
        {
          title: l("Audit", "Audit", "盘点", "調べる"),
          body: l("Where visitors come from, and where they drop off.", "Dari mana pengunjung datang, dan di mana mereka berhenti.", "访客从哪里来，又在哪里流失。", "訪問者がどこから来て、どこで離れるか。"),
          mark: l("Audit, week 1", "Audit, minggu 1", "盘点，第 1 周", "現状確認・1週目"),
          bar: [0, 0.15],
        },
        {
          title: l("Track", "Tracking", "埋点", "計測"),
          body: l("Analytics and conversions set up so every number is true.", "Analitik dan konversi dipasang supaya setiap angkanya benar.", "把分析和转化追踪装好，让每个数字都可信。", "分析とコンバージョン計測を整え、すべての数字を正しく。"),
          mark: l("Tracking, week 1", "Tracking, minggu 1", "埋点，第 1 周", "計測・1週目"),
          bar: [0.15, 0.35],
        },
        {
          title: l("Dashboard", "Dashboard", "看板", "ダッシュボード"),
          body: l("One dashboard with the numbers that matter, and nothing else.", "Satu dashboard berisi angka yang penting, tidak lebih.", "一个看板，只放重要的数字。", "大事な数字だけを載せた、一枚のダッシュボード。"),
          mark: l("Dashboard, week 2", "Dashboard, minggu 2", "看板，第 2 周", "ダッシュボード・2週目"),
          bar: [0.35, 0.55],
        },
        {
          title: l("Test", "Uji", "测试", "試す"),
          body: l("Small changes to pages and offers, each one measured.", "Perubahan kecil pada halaman dan penawaran, masing-masing diukur.", "对页面和优惠做小改动，每一处都量化。", "ページやオファーを少しずつ変え、そのたびに測る。"),
          mark: l("First tests, week 3", "Uji pertama, minggu 3", "首轮测试，第 3 周", "初回テスト・3週目"),
          bar: [0.55, 0.9],
        },
        {
          title: l("Review", "Tinjau", "复盘", "振り返る"),
          body: l("A monthly call: what moved, why, and what to try next.", "Call bulanan: apa yang bergerak, kenapa, dan apa yang dicoba berikutnya.", "每月一通电话：什么变了，为什么，下一步试什么。", "月一回の通話。何が動き、なぜか、次に何を試すか。"),
          mark: l("Monthly review →", "Tinjauan bulanan →", "月度复盘 →", "月次レビュー →"),
          bar: [0.9, 1],
        },
      ],
    },
    {
      service: "ai-automation",
      tab: l("AI automation", "Otomasi AI", "AI 自动化", "AI自動化"),
      label: l("A first agent live in three weeks", "Agen pertama aktif dalam tiga minggu", "三周内让第一个智能体上线", "最初のエージェントを3週間で稼働"),
      note: l("Then tuned every week on real conversations", "Lalu disetel tiap minggu dari percakapan nyata", "之后每周根据真实对话调优", "その後は実際の会話をもとに毎週調整"),
      weeks: 3,
      focus: 2,
      steps: [
        {
          title: l("Map", "Petakan", "梳理", "洗い出す"),
          body: l("Where the hours go: the questions, the data entry, the reports.", "Ke mana jam kerja habis: pertanyaan, input data, laporan.", "时间都花在哪：重复的问题、数据录入、报表。", "時間がどこに消えているか。質問、データ入力、レポート。"),
          mark: l("Audit, week 1", "Audit, minggu 1", "梳理，第 1 周", "洗い出し・1週目"),
          bar: [0, 0.15],
        },
        {
          title: l("Design", "Rancang", "设计", "設計"),
          body: l("What the agent may do on its own, and when it hands over to a person.", "Apa yang boleh dikerjakan agen sendiri, dan kapan diserahkan ke manusia.", "智能体能独立做什么，什么时候交给人。", "エージェントが単独でしてよいことと、人に渡すタイミング。"),
          mark: l("Flows, week 1", "Alur, minggu 1", "流程，第 1 周", "フロー・1週目"),
          bar: [0.15, 0.3],
        },
        {
          title: l("Build", "Bangun", "搭建", "構築"),
          body: l("Connected to your WhatsApp, calendar, CRM and data.", "Terhubung ke WhatsApp, kalender, CRM, dan data Anda.", "接入你的 WhatsApp、日历、CRM 和数据。", "WhatsApp、カレンダー、CRM、データにつなぐ。"),
          mark: l("Build, weeks 1–2", "Bangun, minggu 1–2", "搭建，第 1–2 周", "構築・1〜2週目"),
          bar: [0.3, 0.7],
        },
        {
          title: l("Test", "Uji", "测试", "試す"),
          body: l("Run on real conversations, with your team watching.", "Dijalankan di percakapan nyata sambil diawasi tim Anda.", "在真实对话上运行，你的团队在旁边看着。", "チームが見守るなか、実際の会話で動かす。"),
          mark: l("Pilot, week 3", "Uji coba, minggu 3", "试运行，第 3 周", "試験運用・3週目"),
          bar: [0.7, 0.9],
        },
        {
          title: l("Go live", "Aktifkan", "上线", "稼働"),
          body: l("Switched on, measured, and tuned every week.", "Diaktifkan, diukur, dan disetel setiap minggu.", "正式上线，持续衡量，每周调优。", "本稼働させ、測り、毎週調整する。"),
          mark: l("Live, week 3 →", "Aktif, minggu 3 →", "上线，第 3 周 →", "稼働・3週目 →"),
          bar: [0.9, 1],
        },
      ],
    },
  ] as { service: string; tab: L; label: L; note: L; weeks: number; focus: number; steps: { title: L; body: L; mark: L; bar: [number, number] }[] }[],
  week: l("Week", "Minggu", "第", "週"),
  noMeetings: l("No meetings after the first", "Tanpa rapat setelah yang pertama", "第一次之后不再开会", "最初の一回以降、会議なし"),
};

/* ───────────────────────── Home: client words ───────────────────────── */

export const WORDS = {
  says: l("Says who?", "Kata siapa?", "谁说的？", "誰が言った？"),
  title: l("Client words", "Kata klien", "客户怎么说", "クライアントの声"),
  ask: l("Ask the people who run it", "Tanya orang yang menjalankannya", "问问那些在经营的人", "運営している本人に聞いてください"),
  start: l("Get started", "Mulai sekarang", "开始吧", "はじめる"),
};

/* ───────────────────────── Home: FAQ ───────────────────────── */

export const FAQ = {
  section: l("FAQ", "FAQ", "常见问题", "よくある質問"),
  question: l("Anything else?", "Ada lagi?", "还有别的吗？", "ほかには？"),
  headline: l(
    "*Nothing* *here* should surprise you.",
    "*Tidak* *ada* yang mengejutkan di sini.",
    "这里*没有*什么会让你*意外*。",
    "ここに*驚く*ことは*何もない*。",
  ),
  subtitle: l(
    "Cost, timeline, who does the work — these come up in nearly every first call. Read them here first, so the call can start on your project.",
    "Biaya, jadwal, siapa yang mengerjakan — ini muncul di hampir setiap call pertama. Baca di sini dulu, supaya call-nya bisa langsung membahas proyek Anda.",
    "价格、周期、谁来做——几乎每次第一通电话都会问到。先在这里看完，电话就能直接聊你的项目。",
    "費用、期間、誰が作るのか。初回の通話でほぼ必ず出る話です。先にここで読んでおけば、通話はすぐにあなたの案件から始められます。",
  ),
  studio: l("Onyx studio", "Studio Onyx", "Onyx 工作室", "Onyx スタジオ"),
  studioRole: l("Bali, Indonesia", "Bali, Indonesia", "印尼巴厘岛", "インドネシア・バリ"),
  getInTouch: l("Get in touch", "Hubungi kami", "联系我们", "連絡する"),
  items: [
    {
      q: l("What does Onyx Creative Asia do?", "Apa yang dikerjakan Onyx Creative Asia?", "Onyx Creative Asia 是做什么的？", "Onyx Creative Asia は何をしている会社？"),
      a: l(
        "We are a digital business development agency in Bali. We build websites and software, shape the brand around them, and run what grows them: ads, social media, and the analytics that tell you what is working. One team covers all of it.",
        "Kami agensi pengembangan bisnis digital di Bali. Kami membangun website dan software, membentuk brand di sekitarnya, lalu menjalankan yang menumbuhkannya: iklan, media sosial, dan analitik yang menunjukkan apa yang berhasil. Satu tim mengerjakan semuanya.",
        "我们是一家位于巴厘岛的数字化业务发展机构。我们做网站和软件，围绕它们塑造品牌，也负责让它们增长的部分：广告、社交媒体，以及告诉你什么有效的数据分析。一支团队全包。",
        "バリを拠点とするデジタル・ビジネス開発エージェンシーです。ウェブサイトとソフトウェアを作り、その周りのブランドを形にし、伸ばす部分も担います。広告、SNS、そして何が効いているかを示す分析まで。ひとつのチームですべてを。",
      ),
    },
    {
      q: l("How long does it take?", "Berapa lama pengerjaannya?", "需要多长时间？", "どのくらいかかる？"),
      a: l(
        "Most marketing sites ship in two to four weeks once copy and assets exist; a single landing page in one to two. Projects that run late are usually late because the copy was never written, not because the build was slow.",
        "Kebanyakan situs marketing rilis dalam dua sampai empat minggu setelah teks dan asetnya ada; satu landing page dalam satu sampai dua minggu. Proyek yang terlambat biasanya karena teksnya tidak pernah ditulis, bukan karena build-nya lambat.",
        "多数营销网站在文字和素材到位后两到四周上线；单个落地页一到两周。拖期的项目，通常是因为文案一直没写，而不是开发慢。",
        "原稿と素材が揃えば、多くのサイトは2〜4週間、ランディングページなら1〜2週間で公開します。遅れる案件の多くは、開発が遅いのではなく原稿が書かれていないことが原因です。",
      ),
    },
    {
      q: l("Do you work with clients outside Indonesia?", "Apakah kalian bekerja dengan klien di luar Indonesia?", "你们接印尼以外的客户吗？", "インドネシア国外の案件も受けていますか？"),
      a: l(
        "Yes. RADcruiters, a recruitment-marketing agency in the Netherlands, is one of our clients, and we work async across Asia, Australia and Europe time zones, in English or Bahasa Indonesia.",
        "Ya. RADcruiters, agensi recruitment marketing di Belanda, adalah salah satu klien kami, dan kami bekerja async di zona waktu Asia, Australia, dan Eropa, dalam bahasa Inggris atau Indonesia.",
        "接。荷兰的招聘营销机构 RADcruiters 就是我们的客户之一。我们以异步方式跨亚洲、澳洲和欧洲时区工作，可用英语或印尼语沟通。",
        "はい。オランダの採用マーケティング会社 RADcruiters もクライアントの一社です。アジア、オーストラリア、ヨーロッパのタイムゾーンを非同期でまたぎ、英語またはインドネシア語で対応します。",
      ),
    },
    {
      q: l("Who will I actually work with?", "Dengan siapa saya akan bekerja?", "我实际上会和谁合作？", "実際に誰とやり取りするの？"),
      a: l(
        "The people doing the work. The person who scopes your project designs and builds it too, so nothing gets lost in a hand-off between an account manager and a production team.",
        "Orang yang mengerjakannya. Yang merancang cakupan proyek Anda juga yang mendesain dan membangunnya, jadi tidak ada yang hilang di serah-terima antara account manager dan tim produksi.",
        "就是干活的人。给你定范围的人，也是负责设计和开发的人，不会在客户经理和制作团队之间的交接中丢掉什么。",
        "実際に手を動かす人です。範囲を決めた人がそのまま設計・実装まで担うので、営業担当と制作チームの間の引き継ぎで何かが抜け落ちることはありません。",
      ),
    },
    {
      q: l("How do I get a quote?", "Bagaimana cara minta penawaran?", "怎么拿到报价？", "見積もりを依頼するには？"),
      a: l(
        "Send a brief from the contact page, email hello@onyxcreative.asia, or message us on WhatsApp. Replies come within a working day, Monday to Friday, 08:00 to 22:00 WITA. Expect a short call, a written scope and a start date.",
        "Kirim brief dari halaman kontak, email ke hello@onyxcreative.asia, atau chat kami di WhatsApp. Balasan datang dalam satu hari kerja, Senin sampai Jumat, 08:00 sampai 22:00 WITA. Selanjutnya call singkat, cakupan tertulis, dan tanggal mulai.",
        "在联系页提交需求、发邮件到 hello@onyxcreative.asia，或在 WhatsApp 上给我们留言。我们会在一个工作日内回复（周一至周五 08:00–22:00 WITA）。接下来是一通简短的电话、一份书面范围和一个开工日期。",
        "お問い合わせページからブリーフを送るか、hello@onyxcreative.asia へのメール、または WhatsApp でご連絡ください。1営業日以内（月〜金、WITA 08:00〜22:00）に返信します。その後、短い通話、書面の範囲、開始日の順に進みます。",
      ),
    },
  ],
};

/* ───────────────────────── Home: notes teaser ───────────────────────── */

export const NOTES_TEASER = {
  question: l("What are we thinking about?", "Apa yang sedang kami pikirkan?", "我们在想什么？", "いま考えていること"),
  body: l(
    "Process, tools and the industry, written down when it is fresh enough to be useful.",
    "Proses, alat, dan industri, ditulis selagi masih cukup segar untuk berguna.",
    "关于流程、工具和行业的笔记，趁着还新鲜、还有用的时候写下来。",
    "プロセス、道具、業界のこと。役に立つうちに書き留めています。",
  ),
  cta: l("Read all notes", "Baca semua catatan", "阅读全部笔记", "すべてのノートを読む"),
};

/* ───────────────────────── Footer + contact ───────────────────────── */

export const FOOTER = {
  kicker: l("Got a project in mind?", "Punya proyek?", "有项目在想吗？", "ご相談の案件は？"),
  headline: l(
    "You bring the problem. *We* *bring* *the* *plan.*",
    "Anda bawa masalahnya. *Kami* *bawa* *rencananya.*",
    "你带来问题。*我们带来方案。*",
    "課題を持ってきてください。*計画は*私たちが*持っていきます。*",
  ),
  hint: l(
    "A few lines about what you are trying to fix, and a rough budget. The reply comes from a person, within a working day.",
    "Beberapa baris tentang apa yang ingin Anda perbaiki, dan perkiraan budget. Balasannya dari orang sungguhan, dalam satu hari kerja.",
    "用几句话说说你想解决什么，再给个大概预算。回复来自真人，一个工作日内。",
    "解決したいことを数行と、おおよその予算を。返信は人から、1営業日以内に届きます。",
  ),
  name: l("Your name", "Nama Anda", "你的名字", "お名前"),
  email: l("Your email", "Email Anda", "你的邮箱", "メールアドレス"),
  phone: l("WhatsApp (optional)", "WhatsApp (opsional)", "WhatsApp（选填）", "WhatsApp（任意）"),
  message: l("Your message", "Pesan Anda", "你的留言", "メッセージ"),
  submit: l("Submit", "Kirim", "提交", "送信"),
  sending: l("Sending", "Mengirim", "发送中", "送信中"),
  sent: l("Sent. We'll reply within a working day.", "Terkirim. Kami balas dalam satu hari kerja.", "已发送。我们会在一个工作日内回复。", "送信しました。1営業日以内に返信します。"),
  failed: l("That didn't go through. Try again, or use WhatsApp.", "Gagal terkirim. Coba lagi, atau pakai WhatsApp.", "没有发送成功。请重试，或改用 WhatsApp。", "送信できませんでした。もう一度お試しいただくか、WhatsApp をご利用ください。"),
  consent: l("By sending this you accept our", "Dengan mengirim ini Anda menyetujui", "发送即表示你同意我们的", "送信すると、以下に同意したものとみなされます："),
  and: l("and", "dan", "和", "と"),
  terms: l("Terms", "Syarat", "条款", "利用規約"),
  privacy: l("Privacy policy", "Kebijakan privasi", "隐私政策", "プライバシーポリシー"),
  noList: l("Nothing here puts you on a list.", "Tidak ada yang membuat Anda masuk daftar apa pun.", "这里不会把你加进任何名单。", "メーリングリストに登録されることはありません。"),
  index: l("Index", "Indeks", "索引", "目次"),
  studio: l("Studio", "Studio", "工作室", "スタジオ"),
  socials: l("Socials", "Sosial", "社交", "SNS"),
  rightNow: l("Right now", "Saat ini", "此刻", "いま"),
  place: l("Bali, ID", "Bali, ID", "印尼 · 巴厘岛", "バリ・インドネシア"),
  hours: l("Mon–Fri, 08:00–22:00 WITA", "Sen–Jum, 08:00–22:00 WITA", "周一至周五 08:00–22:00（WITA）", "月〜金 08:00〜22:00（WITA）"),
  rights: l("All rights reserved.", "Hak cipta dilindungi.", "保留所有权利。", "All rights reserved."),
  termsFull: l("Terms & conditions", "Syarat & ketentuan", "条款与条件", "利用規約"),
  cookies: l("Cookie settings", "Pengaturan cookie", "Cookie 设置", "Cookie 設定"),
};

/* ───────────────────────── Budget slider ───────────────────────── */

export const BUDGET = {
  unset: l("Drag to set a budget", "Geser untuk mengatur budget", "拖动来设定预算", "ドラッグして予算を設定"),
  more: l("or more", "atau lebih", "或以上", "以上"),
  currency: l("Currency", "Mata uang", "货币", "通貨"),
  note: l(
    "Converted at today's rate, as a guide.",
    "Dikonversi dengan kurs hari ini, sebagai gambaran.",
    "按今日汇率换算，仅供参考。",
    "本日のレートで換算した目安です。",
  ),
};

/* ───────────────────────── Enquire (/enquire) ─────────────────────────
 * One question per screen. The first screen picks the kind of enquiry;
 * the questions after it follow that kind. Option values are submitted
 * in English (they land in the /agents dashboard); labels are localised.
 */

const opt = (value: string, label: L) => ({ value, label });

export const ENQUIRE = {
  close: l("Close", "Tutup", "关闭", "閉じる"),
  back: l("Back", "Kembali", "返回", "戻る"),
  next: l("Next", "Lanjut", "下一步", "次へ"),
  send: l("Send", "Kirim", "发送", "送信"),
  sending: l("Sending", "Mengirim", "发送中", "送信中"),
  enterHint: l("Enter ↵ to continue", "Enter ↵ untuk lanjut", "按 Enter ↵ 继续", "Enter ↵ で次へ"),
  textHint: l("Ctrl + Enter ↵ to continue", "Ctrl + Enter ↵ untuk lanjut", "按 Ctrl + Enter ↵ 继续", "Ctrl + Enter ↵ で次へ"),

  kindQ: l("What brings you here?", "Ada perlu apa?", "想聊点什么？", "どんなご用件ですか？"),
  kindHint: l(
    "Pick one. The questions after it change to fit.",
    "Pilih satu. Pertanyaan berikutnya menyesuaikan.",
    "选一个，后面的问题会随之调整。",
    "ひとつ選んでください。続く質問が合わせて変わります。",
  ),
  kinds: {
    project: {
      label: l("Project", "Proyek", "项目", "プロジェクト"),
      body: l("Build, brand or grow something with us.", "Bangun, branding, atau kembangkan sesuatu bersama kami.", "和我们一起做产品、做品牌、做增长。", "一緒につくる、ブランドを育てる、伸ばす。"),
    },
    partnership: {
      label: l("Partnership", "Kerja sama", "合作", "協業"),
      body: l("A studio, agency or platform with an idea to work together.", "Studio, agensi, atau platform yang punya ide untuk bekerja sama.", "工作室、代理商或平台，有合作的想法。", "スタジオ、代理店、プラットフォームからの協業のご提案。"),
    },
    career: {
      label: l("Career", "Karier", "加入我们", "採用"),
      body: l("You'd like to work at Onyx.", "Anda ingin bekerja di Onyx.", "你想在 Onyx 工作。", "Onyx で働きたい方へ。"),
    },
    general: {
      label: l("General", "Umum", "一般咨询", "一般"),
      body: l("A question, a hello, anything that doesn't fit the others.", "Pertanyaan, sapaan, apa pun yang tidak masuk pilihan lain.", "一个问题、一声问候，或其他任何事。", "質問やご挨拶など、ほかに当てはまらないこと。"),
    },
  },
  orWrite: l("Rather write or chat?", "Lebih suka email atau chat?", "更想发邮件或聊天？", "メールやチャットがよければ"),

  servicesQ: l("What are we making?", "Apa yang kita buat?", "我们要做什么？", "何をつくりますか？"),
  servicesHint: l("Pick all that apply. We'll get specific on the call.", "Pilih semua yang sesuai. Detailnya kita bahas di call.", "可多选，细节电话里再聊。", "当てはまるものをすべて。詳しくは通話で。"),
  budgetQ: l("What's the budget?", "Berapa budget-nya?", "预算多少？", "ご予算は？"),
  budgetHint: l("A rough figure is fine, or skip it. It shapes the plan, not the welcome.", "Kisaran saja cukup, atau lewati. Ini membentuk rencananya, bukan sambutannya.", "给个大概就行，也可以跳过。它影响的是方案，不是态度。", "おおよそで構いません。飛ばしても大丈夫。左右されるのは計画で、対応ではありません。"),
  startQ: l("When should it start?", "Kapan mulainya?", "什么时候开始？", "いつ始めますか？"),
  startHint: l("ASAP means the next open slot.", "Secepatnya berarti slot kosong berikutnya.", "越快越好，指的是下一个空档。", "「できるだけ早く」は次の空き枠のことです。"),
  starts: [
    opt("ASAP", l("ASAP", "Secepatnya", "越快越好", "できるだけ早く")),
    opt("This month", l("This month", "Bulan ini", "这个月", "今月")),
    opt("Next month", l("Next month", "Bulan depan", "下个月", "来月")),
    opt("Just exploring", l("Just exploring", "Baru melihat-lihat", "先了解一下", "情報収集中")),
  ],
  problemQ: l("What's the problem?", "Apa masalahnya?", "要解决什么问题？", "解決したいことは？"),
  problemHint: l("No brief template. Say it like you would on a call.", "Tanpa template brief. Ceritakan seperti di telepon.", "不需要模板，像打电话那样说就好。", "テンプレートは不要。電話で話すように。"),
  problemPh: l("Three sentences is plenty. A link is even better.", "Tiga kalimat sudah cukup. Link malah lebih baik.", "三句话就够了，附个链接更好。", "3文で十分です。リンクがあればなお良し。"),

  ptypeQ: l("What kind of partnership?", "Kerja sama seperti apa?", "什么样的合作？", "どんな協業ですか？"),
  ptypeHint: l("The closest fit is fine.", "Yang paling mendekati saja.", "选最接近的即可。", "近いもので構いません。"),
  ptypes: [
    opt("Co-production", l("Co-production", "Produksi bersama", "联合制作", "共同制作")),
    opt("White-label", l("White-label", "White-label", "白标合作", "ホワイトラベル")),
    opt("Reseller", l("Reseller", "Reseller", "代理销售", "リセラー")),
    opt("Affiliate / referral", l("Affiliate or referral", "Afiliasi atau referral", "联盟或推荐", "アフィリエイト・紹介")),
    opt("Strategic alliance", l("Strategic alliance", "Aliansi strategis", "战略联盟", "戦略的提携")),
    opt("Other", l("Something else", "Lainnya", "其他", "その他")),
  ],
  companyQ: l("Which company?", "Dari perusahaan mana?", "哪家公司？", "どちらの会社ですか？"),
  companyHint: l("And a website, so we can read up before we reply.", "Dan website-nya, supaya kami bisa pelajari dulu sebelum membalas.", "再附上网站，方便我们回复前先了解一下。", "返信前に拝見できるよう、ウェブサイトも。"),
  companyPh: l("Company name", "Nama perusahaan", "公司名称", "会社名"),
  websitePh: l("Website (optional)", "Website (opsional)", "网站（选填）", "ウェブサイト（任意）"),
  proposalQ: l("What's the idea?", "Apa idenya?", "合作的想法是什么？", "どんなアイデアですか？"),
  proposalHint: l("A few lines on what each side brings.", "Beberapa baris tentang apa yang dibawa masing-masing pihak.", "用几句话说说双方各自能带来什么。", "それぞれが何を持ち寄るのか、数行で。"),
  proposalPh: l("Who you are, what you have in mind, why us.", "Siapa Anda, apa yang terpikir, kenapa kami.", "你们是谁，想做什么，为什么找我们。", "どなたか、何をお考えか、なぜ私たちか。"),

  deptQ: l("Which team?", "Tim yang mana?", "哪个团队？", "どのチームですか？"),
  deptHint: l("Where you'd do your best work.", "Tempat Anda bisa bekerja paling baik.", "你最能发挥的地方。", "いちばん力を発揮できるところ。"),
  deptExtra: [
    opt("Operations", l("Operations", "Operasional", "运营", "オペレーション")),
    opt("Open application", l("Open application", "Lamaran terbuka", "开放申请", "オープンポジション")),
  ],
  workQ: l("Show us your work", "Tunjukkan karya Anda", "给我们看看你的作品", "作品を見せてください"),
  workHint: l("A portfolio link, a CV, or both. Both optional. PDF or Word, up to 3 MB.", "Link portofolio, CV, atau keduanya. Keduanya opsional. PDF atau Word, maks. 3 MB.", "作品集链接、简历，或两者都给。均为选填。PDF 或 Word，不超过 3 MB。", "ポートフォリオのリンク、履歴書、またはその両方。どちらも任意。PDF か Word、3 MB まで。"),
  portfolioPh: l("Portfolio link (optional)", "Link portofolio (opsional)", "作品集链接（选填）", "ポートフォリオのリンク（任意）"),
  cvPick: l("Attach a CV", "Lampirkan CV", "附上简历", "履歴書を添付"),
  cvRemove: l("Remove", "Hapus", "移除", "削除"),
  letterQ: l("Why Onyx?", "Kenapa Onyx?", "为什么是 Onyx？", "なぜ Onyx ですか？"),
  letterHint: l("A short note. What you've made, and what you want to make next.", "Catatan singkat. Apa yang sudah Anda buat, dan apa yang ingin Anda buat berikutnya.", "简短几句：你做过什么，接下来想做什么。", "短いメモで。これまでつくったもの、次につくりたいもの。"),
  letterPh: l("A few lines is enough.", "Beberapa baris sudah cukup.", "几句话就够了。", "数行で十分です。"),

  noteQ: l("What's on your mind?", "Ada yang ingin disampaikan?", "想说点什么？", "どんなことでしょう？"),
  noteHint: l("Ask anything. A person reads it.", "Tanya apa saja. Yang membaca orang sungguhan.", "什么都可以问，读它的是真人。", "なんでもどうぞ。読むのは人です。"),
  notePh: l("Your message", "Pesan Anda", "你的留言", "メッセージ"),

  contactQ: l("Who should we reply to?", "Kami balas ke siapa?", "我们该回复谁？", "どなたに返信しますか？"),
  contactHint: l("Your name and email. WhatsApp too, if you'd rather chat.", "Nama dan email Anda. WhatsApp juga, kalau lebih suka chat.", "你的名字和邮箱。想聊天的话，也可以留 WhatsApp。", "お名前とメール。チャットがよければ WhatsApp も。"),
  projectCompanyPh: l("Company (optional)", "Perusahaan (opsional)", "公司（选填）", "会社名（任意）"),

  errPick: l("Pick one to continue.", "Pilih satu untuk lanjut.", "选一个再继续。", "ひとつ選んでください。"),
  errPickAny: l("Pick at least one.", "Pilih minimal satu.", "至少选一个。", "ひとつ以上選んでください。"),
  errRequired: l("This one's needed.", "Yang ini wajib diisi.", "这一项必填。", "こちらは必須です。"),
  errEmail: l("That email doesn't look right.", "Email itu sepertinya keliru.", "这个邮箱看起来不对。", "メールアドレスが正しくないようです。"),
  errUrl: l("That link doesn't look right.", "Link itu sepertinya keliru.", "这个链接看起来不对。", "リンクが正しくないようです。"),
  errCvSize: l("The CV is over 3 MB.", "CV lebih dari 3 MB.", "简历超过 3 MB。", "履歴書が 3 MB を超えています。"),
  errCvType: l("PDF, DOC or DOCX only.", "Hanya PDF, DOC, atau DOCX.", "仅限 PDF、DOC 或 DOCX。", "PDF、DOC、DOCX のみです。"),

  sentTitle: l("Sent. *Thank* *you.*", "Terkirim. *Terima* *kasih.*", "已发送。*谢谢。*", "送信しました。*ありがとう*ございます。"),
  sentBody: l(
    "A person reads it today and replies within a working day, Monday to Friday, 08:00–22:00 WITA.",
    "Orang sungguhan membacanya hari ini dan membalas dalam satu hari kerja, Senin–Jumat, 08:00–22:00 WITA.",
    "今天就会有人看，一个工作日内回复，周一至周五 08:00–22:00（WITA）。",
    "本日中に人が読み、1営業日以内に返信します。月〜金 08:00〜22:00（WITA）。",
  ),
  sentWa: l("Also message us on WhatsApp", "Kabari juga lewat WhatsApp", "也在 WhatsApp 上说一声", "WhatsApp でも連絡する"),
  sentHome: l("Back to the site", "Kembali ke situs", "返回网站", "サイトに戻る"),
  sentAgain: l("Send another", "Kirim lagi", "再发一条", "もう一件送る"),
};

/* ───────────────────────── Cookies ───────────────────────── */

export const COOKIES = {
  tag: l("Cookies", "Cookie", "Cookie", "Cookie"),
  body: l(
    "We use a few cookies to make the site work, and, if you allow it, analytics to see which pages help. No advertising cookies, no selling data.",
    "Kami memakai beberapa cookie agar situs berjalan, dan, kalau Anda izinkan, analitik untuk melihat halaman mana yang membantu. Tanpa cookie iklan, tanpa menjual data.",
    "我们用少量 Cookie 让网站正常运行；在你允许的情况下，也用分析工具看看哪些页面有用。不用广告 Cookie，不出售数据。",
    "サイトを動かすための最小限の Cookie と、許可いただいた場合のみ、どのページが役立っているかを見る分析を使います。広告用 Cookie もデータの販売もありません。",
  ),
  accept: l("Accept all", "Terima semua", "全部接受", "すべて許可"),
  decline: l("Essential only", "Hanya yang penting", "仅必要", "必須のみ"),
  settings: l("Settings", "Pengaturan", "设置", "設定"),
  save: l("Save choices", "Simpan pilihan", "保存选择", "選択を保存"),
  essential: l("Essential", "Wajib", "必要", "必須"),
  essentialBody: l(
    "Language, accent colour and this choice. Always on.",
    "Bahasa, warna aksen, dan pilihan ini. Selalu aktif.",
    "语言、强调色以及这个选择本身。始终开启。",
    "言語、アクセントカラー、この選択。常にオン。",
  ),
  analytics: l("Analytics", "Analitik", "分析", "分析"),
  analyticsBody: l(
    "Google Analytics, to count visits and see which pages help. Off until you allow it.",
    "Google Analytics, untuk menghitung kunjungan dan melihat halaman mana yang membantu. Mati sampai Anda izinkan.",
    "Google Analytics，用来统计访问量、看哪些页面有用。你同意之前不会开启。",
    "訪問数を数え、役立つページを知るための Google Analytics。許可されるまでオフです。",
  ),
  read: l("Read the privacy policy", "Baca kebijakan privasi", "阅读隐私政策", "プライバシーポリシーを読む"),
};

/* ───────────────────────── About page ───────────────────────── */

export const ABOUT = {
  headline: l(
    "We're the *Onyx* *Creative* team.",
    "Kami tim *Onyx* *Creative*.",
    "我们是 *Onyx* *Creative* 团队。",
    "私たちが *Onyx* *Creative* です。",
  ),
  lede: l(
    "An independent studio in Bali that treats a business's growth as one problem. We build the website, the software and the marketing that drives people to it, for owners who would rather have one team accountable than five vendors pointing at each other.",
    "Studio independen di Bali yang memperlakukan pertumbuhan bisnis sebagai satu masalah. Kami membangun website, software, dan marketing yang mendatangkan orang ke sana, untuk pemilik bisnis yang lebih memilih satu tim yang bertanggung jawab daripada lima vendor yang saling tunjuk.",
    "一家位于巴厘岛的独立工作室，把一家公司的增长当作同一个问题来解决。我们做网站、做软件，也做把人带过来的营销，服务那些宁愿让一支团队负责到底、也不想看五家供应商互相推诿的老板。",
    "企業の成長をひとつの課題として扱う、バリの独立系スタジオです。ウェブサイト、ソフトウェア、そこへ人を呼ぶマーケティングを手がけます。互いに責任を押しつけ合う五社より、責任を持つ一つのチームを選びたい経営者のために。",
  ),
  note: l(
    "Every project starts the same way: work out what has to be true for it to work, then remove everything that isn't load-bearing. That discipline shows up in how we scope, how we design, and how we hand over a site the client can actually run.",
    "Setiap proyek dimulai dengan cara yang sama: cari tahu apa yang harus benar agar berhasil, lalu buang semua yang tidak menopang. Disiplin itu terlihat dari cara kami menentukan cakupan, mendesain, dan menyerahkan situs yang benar-benar bisa dijalankan kliennya.",
    "每个项目都从同一件事开始：想清楚要让它成立，什么必须为真，然后把一切不承重的东西拿掉。这种自律体现在我们怎么定范围、怎么设计，以及怎么交付一个客户真的能自己运营的网站。",
    "どのプロジェクトも同じ始め方をします。成立させるために何が真でなければならないかを見極め、支えになっていないものをすべて取り除く。その規律は、範囲の決め方、デザインの仕方、そしてクライアントが自分で運用できるサイトの引き渡し方に表れます。",
  ),
  oneTeam: l(
    "*One* *team*, start to finish.",
    "*Satu* *tim*, dari awal sampai akhir.",
    "*一支团队*，从头到尾。",
    "*ひとつのチーム*で、最初から最後まで。",
  ),
  oneTeamBody: l(
    "Onyx works out of Bali — not a network, not a holding company, not a roster of subcontractors. When you talk to us, you are talking to the people doing the work.",
    "Onyx bekerja dari Bali — bukan jaringan, bukan holding, bukan daftar subkontraktor. Saat Anda bicara dengan kami, Anda bicara dengan orang yang mengerjakannya.",
    "Onyx 在巴厘岛工作——不是网络，不是控股公司，也不是一串分包商。你跟我们说话，就是在跟干活的人说话。",
    "Onyx はバリで働いています。ネットワークでも持株会社でも、下請けの名簿でもありません。私たちと話すことは、実際に作る人と話すことです。",
  ),
  oneTeamNote: l(
    "Every project keeps the same team from kickoff to launch, on purpose. Fewer hand-offs, less lost in translation, and nobody learning your business for the first time halfway through.",
    "Setiap proyek memakai tim yang sama dari kickoff sampai rilis, dengan sengaja. Lebih sedikit serah-terima, lebih sedikit yang hilang di tengah jalan, dan tidak ada yang baru mengenal bisnis Anda di tengah proyek.",
    "每个项目从启动到上线都是同一支团队，这是刻意的。交接更少，传话中丢的更少，也不会有人在项目做到一半才第一次了解你的生意。",
    "どの案件も、キックオフから公開まで同じチームが担当します。意図的に。引き継ぎが減り、伝言で失われるものが減り、途中で初めてあなたの事業を知る人もいません。",
  ),
  where: l("Where this is going", "Ke mana arahnya", "我们要去哪里", "目指すところ"),
  ambitious: l(
    "*Ambitious.* Not loud about it.",
    "*Ambisius.* Tidak berisik soal itu.",
    "*有野心*，但不张扬。",
    "*野心的。*でも声高ではなく。",
  ),
  ambitiousBody: l(
    "We are not trying to be the biggest studio in the room. We are trying to be the one you call back — for how we think, what we ship, and how we show it.",
    "Kami tidak berusaha jadi studio terbesar. Kami berusaha jadi yang Anda hubungi lagi — karena cara kami berpikir, apa yang kami rilis, dan cara kami menunjukkannya.",
    "我们不想做全场最大的工作室，我们想做你会再打电话来的那一家——因为我们怎么想、做出了什么、又怎么拿出来。",
    "いちばん大きなスタジオになろうとはしていません。また連絡したくなるスタジオでありたい。考え方、届けるもの、その見せ方によって。",
  ),
  crewTag: l("Who's behind it?", "Siapa di baliknya?", "背后是谁？", "誰がやっているのか？"),
  crewHeadline: l(
    "*Six* *disciplines*, one table.",
    "*Enam* *disiplin*, satu meja.",
    "*六个专业*，一张桌子。",
    "*六つの専門*、ひとつのテーブル。",
  ),
  crewBody: l(
    "Strategy, engineering, marketing and craft sit together, so the plan and the work never drift apart.",
    "Strategi, engineering, marketing, dan craft duduk bersama, jadi rencana dan pekerjaannya tidak pernah berjauhan.",
    "策略、工程、营销和手艺坐在一起，方案和成品就不会走散。",
    "戦略、エンジニアリング、マーケティング、クラフトが同じ席に。だから計画と仕事がずれません。",
  ),
  noticed: l(
    "The work is *live*. *Go* *and* *look*.",
    "Karyanya *tayang*. *Silakan* *lihat*.",
    "作品都在*线上*。*自己去看*。",
    "仕事は*公開中*。*見に行って*ください。",
  ),
  noticedBody: l(
    "The short version of what we can stand behind.",
    "Versi singkat dari apa yang bisa kami pertanggungjawabkan.",
    "我们敢担保的东西，简短版。",
    "胸を張れるものの、短いまとめ。",
  ),
};

/* ───────────────────────── Projects + notes pages ───────────────────────── */

export const PROJECTS_PAGE = {
  intro: l(
    "Websites, software, campaigns and content for businesses across Indonesia and Europe. Every one names the client.",
    "Website, software, kampanye, dan konten untuk bisnis di Indonesia dan Eropa. Semuanya menyebut kliennya.",
    "为印尼和欧洲的企业做的网站、软件、广告和内容。每一个都写明了客户。",
    "インドネシアとヨーロッパの企業のためのウェブ、ソフトウェア、キャンペーン、コンテンツ。どれもクライアント名を明かしています。",
  ),
  data: l("Project data", "Data proyek", "项目信息", "プロジェクト情報"),
  title: l("Title", "Judul", "名称", "タイトル"),
  client: l("Client", "Klien", "客户", "クライアント"),
  year: l("Released", "Rilis", "上线时间", "公開"),
  location: l("Location", "Lokasi", "地点", "場所"),
  type: l("Project type", "Jenis proyek", "项目类型", "種別"),
  scope: l("Scope", "Cakupan", "范围", "範囲"),
  overview: l("Overview", "Ringkasan", "概述", "概要"),
  challenge: l("The challenge", "Tantangannya", "挑战", "課題"),
  challengeHead: l("What wasn't working", "Yang tidak berjalan", "哪里不对", "うまくいっていなかったこと"),
  solution: l("The solution", "Solusinya", "解决方案", "解決策"),
  solutionHead: l("What we built", "Yang kami bangun", "我们做了什么", "私たちが作ったもの"),
  result: l("The result", "Hasilnya", "结果", "結果"),
  resultHead: l("What's different now", "Yang berbeda sekarang", "现在有什么不同", "いま変わったこと"),
  words: l("In their words", "Kata mereka", "他们怎么说", "クライアントの言葉"),
};

export const NOTES_PAGE = {
  log: l("The studio log", "Catatan studio", "工作室日志", "スタジオの記録"),
  intro: l(
    "Working notes from the studio, not a content calendar. Process, tools and the occasional disagreement, written down when it is fresh enough to be useful.",
    "Catatan kerja dari studio, bukan kalender konten. Proses, alat, dan sesekali ketidaksetujuan, ditulis selagi cukup segar untuk berguna.",
    "来自工作室的工作笔记，不是内容日历。关于流程、工具，偶尔也有些不同意见，趁着还新鲜、还有用的时候写下来。",
    "コンテンツカレンダーではなく、スタジオの作業メモ。プロセス、道具、ときどき異論。役に立つうちに書き留めています。",
  ),
  newest: l("Newest first", "Terbaru dulu", "最新优先", "新しい順"),
  published: l("Published", "Terbit", "发布于", "公開日"),
  reading: l("Reading time", "Waktu baca", "阅读时间", "読了時間"),
};

/* ───────────────────────── Legal ───────────────────────── */

export const LEGAL = {
  onThisPage: l("On this page", "Di halaman ini", "本页内容", "このページの内容"),
  updated: l("Last updated", "Terakhir diperbarui", "最后更新", "最終更新"),
  human: l("Need a human?", "Perlu bicara dengan orang?", "需要找个真人？", "人と話したい？"),
  humanBody: l(
    "Write to us and a person answers within a day.",
    "Tulis ke kami dan seseorang menjawab dalam sehari.",
    "写信给我们，一天之内会有真人回复。",
    "ご連絡いただければ、1日以内に人が返信します。",
  ),
  englishOnly: l(
    "This document is written in English, which is the version that applies.",
    "Dokumen ini ditulis dalam bahasa Inggris, dan versi itulah yang berlaku.",
    "本文件以英文撰写，以英文版本为准。",
    "本書は英語で作成されており、英語版が適用されます。",
  ),
};
