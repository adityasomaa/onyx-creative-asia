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
  { href: "/#process", label: l("Process", "Proses", "流程", "プロセス"), meta: l("2–4 weeks", "2–4 minggu", "2–4 周", "2〜4週間") },
  { href: "/projects", label: l("Projects", "Proyek", "项目", "プロジェクト"), meta: l("08", "08", "08", "08") },
  { href: "/#pricing", label: l("Pricing", "Harga", "价格", "料金"), meta: l("From IDR 8M", "Mulai Rp 8 jt", "800 万印尼盾起", "800万ルピアから") },
  { href: "/about", label: l("About", "Tentang", "关于", "私たちについて"), meta: l("One team", "Satu tim", "一支团队", "ひとつのチーム") },
  { href: "/notes", label: l("Notes", "Catatan", "笔记", "ノート"), meta: l("03", "03", "03", "03") },
  { href: "/contact", label: l("Contact", "Kontak", "联系", "お問い合わせ"), meta: l("1 day reply", "Balas 1 hari", "1 天内回复", "1日以内に返信") },
];

export const UI = {
  openMenu: l("Open menu", "Buka menu", "打开菜单", "メニューを開く"),
  closeMenu: l("Close menu", "Tutup menu", "关闭菜单", "メニューを閉じる"),
  home: l("Onyx Creative Asia, home", "Onyx Creative Asia, beranda", "Onyx Creative Asia 首页", "Onyx Creative Asia ホーム"),
  latestProject: l("Latest project", "Proyek terbaru", "最新项目", "最新プロジェクト"),
  ourTime: l("Our time", "Waktu kami", "我们的时间", "現地時間"),
  language: l("Language", "Bahasa", "语言", "言語"),
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
    "Websites, software, marketing and content, made by one team from the first call to launch, and kept running after.",
    "Website, software, marketing, dan konten, dikerjakan satu tim dari panggilan pertama sampai peluncuran, lalu tetap dijalankan sesudahnya.",
    "网站、软件、营销和内容，由同一支团队从第一通电话做到上线，上线之后也继续由我们运营。",
    "ウェブサイト、ソフトウェア、マーケティング、コンテンツ。最初の通話から公開まで一つのチームで手がけ、公開後も運用します。",
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
  cta: l("Watch reel", "Tonton reel", "观看集锦", "リールを見る"),
  ctaMeta: l("Real client work. No stock footage.", "Karya klien sungguhan. Tanpa stok video.", "真实的客户作品，没有素材库画面。", "実際のクライアントワーク。ストック映像なし。"),
  close: l("Close showreel", "Tutup showreel", "关闭集锦", "ショーリールを閉じる"),
};

/* ───────────────────────── Home: expertise ───────────────────────── */

export const EXPERTISE = {
  section: l("Expertise", "Keahlian", "专长", "専門領域"),
  question: l("What do we actually do?", "Sebenarnya apa yang kami kerjakan?", "我们到底做什么？", "実際に何をしているのか？"),
  headline: l(
    "*Websites*, *software*, *marketing*, *content*. Run as one practice, not ten vendors.",
    "*Website*, *software*, *marketing*, *konten*. Dijalankan sebagai satu praktik, bukan sepuluh vendor.",
    "*网站*、*软件*、*营销*、*内容*。作为一个整体来做，而不是十家供应商。",
    "*ウェブ*、*ソフト*、*マーケ*、*コンテンツ*。十社ではなく、ひとつの実践として。",
  ),
  subtitle: l(
    "A business arrives here with a goal and leaves with the system that meets it, planned, built and run by the same people.",
    "Sebuah bisnis datang ke sini dengan satu tujuan dan pulang membawa sistem untuk mencapainya, direncanakan, dibangun, dan dijalankan oleh orang yang sama.",
    "一家公司带着一个目标来，带着实现目标的整套系统离开，从规划、搭建到运营，都是同一批人。",
    "目標を持って来た会社が、それを達成するしくみを持って帰る。計画も、構築も、運用も同じ人たちで。",
  ),
  metaA: l("Practice", "Praktik", "业务范围", "領域"),
  metaAValue: l("Build, market, measure", "Bangun, pasarkan, ukur", "搭建、推广、衡量", "つくる、届ける、測る"),
  metaB: l("Working method", "Cara kerja", "工作方式", "進め方"),
  metaBValue: l("The people who plan it build it", "Yang merencanakan juga yang membangun", "规划的人就是动手的人", "計画した人が、そのまま作る"),
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
  metaAValue: l("1–4 weeks", "1–4 minggu", "1–4 周", "1〜4週間"),
  metaB: l("Check-ins", "Check-in", "同步频率", "定例"),
  metaBValue: l("Weekly", "Mingguan", "每周", "毎週"),
  metaC: l("Revisions", "Revisi", "修改", "修正"),
  metaCValue: l("Until it's right", "Sampai pas", "改到对为止", "納得いくまで"),
  steps: [
    { title: l("Listen", "Dengar", "倾听", "聞く"), body: l("One call to understand the business. That is the meeting.", "Satu call untuk memahami bisnisnya. Itulah rapatnya.", "一通电话，把生意弄明白。会就开这一次。", "事業を理解するための一本の通話。それが会議のすべて。") },
    { title: l("Scope", "Rancang", "定范围", "決める"), body: l("A written scope and price before anything starts.", "Cakupan dan harga tertulis sebelum apa pun dimulai.", "开工前，先给出书面的范围和报价。", "着手前に、書面で範囲と価格を。") },
    { title: l("Make", "Buat", "制作", "作る"), body: l("Design in the open, on a live preview link.", "Desain dikerjakan terbuka, lewat link preview langsung.", "公开地设计，随时可看的预览链接。", "公開のプレビューリンクで、見える形でデザイン。") },
    { title: l("Build", "Bangun", "开发", "組む"), body: l("Built by the same hands that designed it.", "Dibangun oleh tangan yang sama yang mendesainnya.", "由设计它的同一双手来开发。", "デザインした手で、そのまま実装。") },
    { title: l("Launch", "Rilis", "上线", "公開"), body: l("Live, connected and handed over, then we stay on it.", "Tayang, terhubung, diserahkan, lalu kami tetap menjaganya.", "上线、接通、交接，然后继续盯着。", "公開し、つなぎ、引き渡し、その後も見守る。") },
  ],
  tracks: [
    {
      tab: l("Landing page", "Landing page", "落地页", "ランディングページ"),
      label: l("One page, one to two weeks", "Satu halaman, satu sampai dua minggu", "一个页面，一到两周", "1ページ、1〜2週間"),
      note: l("Typical run, ten working days", "Rata-rata, sepuluh hari kerja", "通常十个工作日", "標準で10営業日"),
      // [start, end] as fractions of the timeline, one per step
      bars: [[0, 0.08], [0.08, 0.16], [0.16, 0.55], [0.55, 0.85], [0.85, 1]] as [number, number][],
      marks: [
        l("Kickoff, day 1", "Kickoff, hari 1", "启动，第 1 天", "キックオフ・1日目"),
        l("Scope, day 2", "Cakupan, hari 2", "范围确认，第 2 天", "範囲確定・2日目"),
        l("First look, day 3", "Tampilan pertama, hari 3", "初稿，第 3 天", "初稿・3日目"),
        l("Staging, day 7", "Staging, hari 7", "预发布，第 7 天", "ステージング・7日目"),
        l("Live, day 10 →", "Tayang, hari 10 →", "上线，第 10 天 →", "公開・10日目 →"),
      ],
      weeks: 2,
    },
    {
      tab: l("Full site", "Situs lengkap", "完整网站", "フルサイト"),
      label: l("Five to ten pages, two to four weeks", "Lima sampai sepuluh halaman, dua sampai empat minggu", "五到十个页面，两到四周", "5〜10ページ、2〜4週間"),
      note: l("Typical run, four weeks", "Rata-rata, empat minggu", "通常四周", "標準で4週間"),
      bars: [[0, 0.05], [0.05, 0.15], [0.15, 0.5], [0.5, 0.88], [0.88, 1]] as [number, number][],
      marks: [
        l("Kickoff, week 1", "Kickoff, minggu 1", "启动，第 1 周", "キックオフ・1週目"),
        l("Scope, week 1", "Cakupan, minggu 1", "范围确认，第 1 周", "範囲確定・1週目"),
        l("Design, weeks 1–2", "Desain, minggu 1–2", "设计，第 1–2 周", "デザイン・1〜2週目"),
        l("Build, weeks 2–4", "Bangun, minggu 2–4", "开发，第 2–4 周", "実装・2〜4週目"),
        l("Live, week 4 →", "Tayang, minggu 4 →", "上线，第 4 周 →", "公開・4週目 →"),
      ],
      weeks: 4,
    },
    {
      tab: l("Campaign", "Kampanye", "广告活动", "キャンペーン"),
      label: l("Strategy to first flight, two weeks", "Strategi sampai tayang perdana, dua minggu", "从策略到首轮投放，两周", "戦略から初回配信まで2週間"),
      note: l("Then adjusted every week", "Lalu disesuaikan tiap minggu", "之后每周调整", "その後は毎週調整"),
      bars: [[0, 0.1], [0.1, 0.25], [0.25, 0.6], [0.6, 0.85], [0.85, 1]] as [number, number][],
      marks: [
        l("Audit, day 1", "Audit, hari 1", "盘点，第 1 天", "現状確認・1日目"),
        l("Plan, day 3", "Rencana, hari 3", "方案，第 3 天", "計画・3日目"),
        l("Creative, week 1", "Materi, minggu 1", "素材，第 1 周", "クリエイティブ・1週目"),
        l("Setup, week 2", "Setup, minggu 2", "搭建，第 2 周", "設定・2週目"),
        l("First flight →", "Tayang perdana →", "首轮投放 →", "初回配信 →"),
      ],
      weeks: 2,
    },
  ],
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

/* ───────────────────────── Home: pricing ───────────────────────── */

export const PRICING = {
  section: l("Pricing", "Harga", "价格", "料金"),
  question: l("What does it cost?", "Berapa biayanya?", "要花多少钱？", "いくらかかるのか？"),
  headline: l(
    "*One* *scope*. *One* *price*. No surprise invoices.",
    "*Satu* *cakupan*. *Satu* *harga*. Tanpa tagihan kejutan.",
    "*一个范围*，*一个价格*。没有意外账单。",
    "*ひとつの範囲*、*ひとつの価格*。予想外の請求なし。",
  ),
  subtitle: l(
    "You get a written scope and a fixed price before we start. Ongoing work is billed monthly and can be paused.",
    "Anda mendapat cakupan tertulis dan harga tetap sebelum kami mulai. Pekerjaan berjalan ditagih bulanan dan bisa dijeda.",
    "开工前，你会拿到书面范围和固定价格。持续性的工作按月计费，可以暂停。",
    "着手前に書面の範囲と固定価格をお渡しします。継続業務は月額で、一時停止も可能です。",
  ),
  metaA: l("Billing", "Penagihan", "计费", "請求"),
  metaAValue: l("Per project, or monthly", "Per proyek, atau bulanan", "按项目，或按月", "プロジェクト単位、または月額"),
  metaB: l("Commitment", "Komitmen", "合约", "契約"),
  metaBValue: l("None. Pause anytime", "Tidak ada. Jeda kapan saja", "无，可随时暂停", "なし。いつでも停止可"),
  plans: [
    {
      name: l("Build", "Build", "搭建", "ビルド"),
      price: l("IDR 8M", "Rp 8 jt", "800 万印尼盾", "800万ルピア"),
      prefix: l("From", "Mulai", "起价", "から"),
      per: l("/ project", "/ proyek", "/ 项目", "/ 件"),
      blurb: l(
        "A website or app built once, handed over, and yours to keep.",
        "Website atau aplikasi yang dibangun sekali, diserahkan, dan jadi milik Anda.",
        "一次做好的网站或应用，交到你手上，归你所有。",
        "一度作って引き渡し、そのままあなたのものになるサイトやアプリ。",
      ),
      cta: l("Start a build", "Mulai build", "开始搭建", "ビルドを始める"),
      dark: false,
    },
    {
      name: l("Grow", "Grow", "增长", "グロース"),
      price: l("Custom", "Custom", "按需报价", "個別見積"),
      prefix: l("", "", "", ""),
      per: l("/ month", "/ bulan", "/ 月", "/ 月"),
      blurb: l(
        "The site plus the marketing, content and reporting that grow it, every month.",
        "Situsnya plus marketing, konten, dan laporan yang menumbuhkannya, setiap bulan.",
        "网站，加上每个月推动它增长的营销、内容和报告。",
        "サイトに加えて、それを毎月伸ばすマーケティング、コンテンツ、レポート。",
      ),
      cta: l("Start growing", "Mulai tumbuh", "开始增长", "グロースを始める"),
      dark: true,
    },
  ],
  rows: [
    { label: l("Strategy and scope", "Strategi dan cakupan", "策略与范围", "戦略と範囲"), a: l("Included", "Termasuk", "包含", "含む"), b: l("Included", "Termasuk", "包含", "含む") },
    { label: l("Design and build", "Desain dan pengembangan", "设计与开发", "デザインと実装"), a: l("Included", "Termasuk", "包含", "含む"), b: l("Included", "Termasuk", "包含", "含む") },
    { label: l("SEO, AEO and GEO setup", "Setup SEO, AEO, dan GEO", "SEO、AEO、GEO 基础设置", "SEO・AEO・GEO の初期設定"), a: l("Included", "Termasuk", "包含", "含む"), b: l("Ongoing", "Berkelanjutan", "持续优化", "継続"), aOk: true, bOk: true },
    { label: l("Social media", "Media sosial", "社交媒体", "SNS"), a: l("—", "—", "—", "—"), b: l("Included", "Termasuk", "包含", "含む"), aOk: false, bOk: true },
    { label: l("Ads management", "Manajemen iklan", "广告投放", "広告運用"), a: l("—", "—", "—", "—"), b: l("Included", "Termasuk", "包含", "含む"), aOk: false, bOk: true },
    { label: l("Content and shoots", "Konten dan pemotretan", "内容与拍摄", "コンテンツと撮影"), a: l("On request", "Sesuai permintaan", "按需", "ご要望に応じて"), b: l("Included", "Termasuk", "包含", "含む"), aOk: true, bOk: true },
    { label: l("Monthly report", "Laporan bulanan", "月度报告", "月次レポート"), a: l("—", "—", "—", "—"), b: l("Included", "Termasuk", "包含", "含む"), aOk: false, bOk: true },
    { label: l("Maintenance", "Pemeliharaan", "维护", "保守"), a: l("First month", "Bulan pertama", "首月", "初月"), b: l("Included", "Termasuk", "包含", "含む"), aOk: true, bOk: true },
  ],
  footnote: l(
    "Prices in IDR, excluding tax. Software and apps are quoted after a brief.",
    "Harga dalam Rupiah, belum termasuk pajak. Software dan aplikasi dihitung setelah brief.",
    "价格以印尼盾计，不含税。软件和应用需看过需求后报价。",
    "価格はルピア建て・税別。ソフトウェアとアプリはご相談後にお見積もりします。",
  ),
  question2: l("Have a question?", "Ada pertanyaan?", "有问题吗？", "ご質問は？"),
  howTitle: l("How it works", "Cara kerjanya", "怎么运作", "進め方"),
  howSub: l("Four steps. Nothing to sign until the scope is right.", "Empat langkah. Tidak ada yang ditandatangani sampai cakupannya pas.", "四步。范围对了才需要签字。", "4つのステップ。範囲が固まるまで、署名は不要です。"),
  how: [
    { title: l("Brief", "Brief", "需求", "ブリーフ"), body: l("Tell us the goal in a few lines, or on a call.", "Ceritakan tujuannya dalam beberapa baris, atau lewat call.", "用几句话、或一通电话告诉我们目标。", "目標を数行で、または通話で。") },
    { title: l("Scope", "Cakupan", "范围", "範囲"), body: l("A written scope and a fixed price, within days.", "Cakupan tertulis dan harga tetap, dalam hitungan hari.", "几天内给出书面范围和固定价格。", "数日以内に、書面の範囲と固定価格を。") },
    { title: l("Build", "Bangun", "开发", "制作"), body: l("Weekly check-ins on a live preview link.", "Check-in mingguan lewat link preview langsung.", "每周同步，随时看预览链接。", "公開プレビューで毎週の確認。") },
    { title: l("Grow", "Tumbuh", "增长", "成長"), body: l("Launch, then keep improving what moves the numbers.", "Rilis, lalu terus perbaiki yang menggerakkan angka.", "上线，然后持续改进能推动数字的部分。", "公開し、数字を動かす部分を磨き続ける。") },
  ],
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
        "We are a digital business development agency in Bali. We build websites, software and mobile apps, and run the marketing that grows them: social media, SEO, AEO and GEO, ads, content, photo and video, design and branding, and the analytics that tell you what is working. One team covers all of it.",
        "Kami agensi pengembangan bisnis digital di Bali. Kami membangun website, software, dan aplikasi mobile, lalu menjalankan marketing yang menumbuhkannya: media sosial, SEO, AEO dan GEO, iklan, konten, foto dan video, desain dan branding, serta analitik yang menunjukkan apa yang berhasil. Satu tim mengerjakan semuanya.",
        "我们是一家位于巴厘岛的数字化业务发展机构。我们做网站、软件和移动应用，也负责让它们增长的营销：社交媒体、SEO、AEO 与 GEO、广告、内容、摄影摄像、设计与品牌，以及告诉你什么有效的数据分析。一支团队全包。",
        "バリを拠点とするデジタル・ビジネス開発エージェンシーです。ウェブサイト、ソフトウェア、モバイルアプリを作り、それを伸ばすマーケティングも担います。SNS、SEO・AEO・GEO、広告、コンテンツ、写真・映像、デザイン・ブランディング、そして何が効いているかを示す分析まで。ひとつのチームですべてを。",
      ),
    },
    {
      q: l("How much does a website cost?", "Berapa biaya sebuah website?", "做一个网站要多少钱？", "ウェブサイトの費用は？"),
      a: l(
        "As a guide: a template build with copy and photos supplied runs roughly IDR 8 to 20 million, a custom marketing site of five to ten pages roughly IDR 25 to 70 million, and anything with software behind it, such as a booking flow, starts around IDR 60 million. You get a fixed price in writing before we start.",
        "Sebagai gambaran: build dari template dengan teks dan foto dari Anda sekitar Rp 8 sampai 20 juta, situs marketing custom lima sampai sepuluh halaman sekitar Rp 25 sampai 70 juta, dan yang ada software di baliknya, misalnya alur booking, mulai sekitar Rp 60 juta. Anda mendapat harga tetap tertulis sebelum kami mulai.",
        "大致参考：用模板搭建、文字和照片由你提供，约 800 万到 2000 万印尼盾；五到十页的定制营销网站约 2500 万到 7000 万；背后带软件的，比如预订流程，约 6000 万起。开工前你会拿到书面的固定价格。",
        "目安として、原稿と写真をご用意いただくテンプレート制作でおよそ800万〜2,000万ルピア、5〜10ページのカスタムサイトでおよそ2,500万〜7,000万ルピア、予約フローのようなソフトウェアを伴うものは6,000万ルピア前後からです。着手前に書面で固定価格をお出しします。",
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
      q: l("Is there an option for smaller budgets?", "Ada pilihan untuk budget lebih kecil?", "预算比较少有选择吗？", "予算が少ない場合の選択肢は？"),
      a: l(
        "Yes, through Sigap, our sub-brand for Indonesian small businesses, with fixed packages from IDR 500,000 covering a logo, a single-page website and a basic social setup.",
        "Ada, lewat Sigap, sub-brand kami untuk UMKM Indonesia, dengan paket tetap mulai Rp 500.000 yang mencakup logo, website satu halaman, dan setup media sosial dasar.",
        "有，通过我们面向印尼小微企业的子品牌 Sigap，固定套餐 50 万印尼盾起，包含标志、单页网站和基础社交媒体设置。",
        "あります。インドネシアの中小事業者向けサブブランド Sigap で、ロゴ、1ページのサイト、基本的な SNS 設定を含む50万ルピアからの定額パッケージをご用意しています。",
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
  budget: l("Your budget", "Budget Anda", "你的预算", "ご予算"),
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
  budgets: [
    l("Under IDR 10M", "Di bawah Rp 10 jt", "1000 万印尼盾以下", "1,000万ルピア未満"),
    l("IDR 10–25M", "Rp 10–25 jt", "1000–2500 万印尼盾", "1,000万〜2,500万ルピア"),
    l("IDR 25–70M", "Rp 25–70 jt", "2500–7000 万印尼盾", "2,500万〜7,000万ルピア"),
    l("IDR 70M+", "Di atas Rp 70 jt", "7000 万印尼盾以上", "7,000万ルピア以上"),
    l("Monthly retainer", "Retainer bulanan", "按月合作", "月額契約"),
    l("Not sure yet", "Belum tahu", "还不确定", "まだ未定"),
  ],
};

/* ───────────────────────── Contact page ───────────────────────── */

export const CONTACT = {
  question: l("What happens after I hit send?", "Apa yang terjadi setelah saya kirim?", "我点了发送之后会怎样？", "送信したあと、どうなる？"),
  place: l("Bali, ID — WITA, UTC+8", "Bali, ID — WITA, UTC+8", "巴厘岛 —— WITA，UTC+8", "バリ — WITA（UTC+8）"),
  headline: l(
    "You get *a* *person*, not a ticket number.",
    "Anda dapat *orang* *sungguhan*, bukan nomor tiket.",
    "你会得到*一个真人*，而不是一个工单号。",
    "届くのは*人*からの返事。チケット番号ではなく。",
  ),
  lede: l(
    "One of us reads it the day it arrives. If it is a fit, you get a thirty-minute call. If it is not, you get a straight answer and, where we can, the name of someone who might be.",
    "Salah satu dari kami membacanya di hari yang sama. Kalau cocok, Anda dapat call tiga puluh menit. Kalau tidak, Anda dapat jawaban jujur dan, kalau bisa, nama orang yang mungkin cocok.",
    "邮件到的当天就会有人看。合适的话，你会得到一通三十分钟的电话；不合适，你会得到一个直接的答复，能推荐的话，也会告诉你谁可能更合适。",
    "届いたその日に、私たちの誰かが読みます。合いそうなら30分の通話を。合わなければ率直にお伝えし、可能なら合いそうな人を紹介します。",
  ),
  replyTime: l("Reply time", "Waktu balas", "回复时间", "返信までの時間"),
  replyTimeValue: l("Within a working day", "Dalam satu hari kerja", "一个工作日内", "1営業日以内"),
  hours: l("Studio hours", "Jam studio", "工作时间", "営業時間"),
  hoursValue: l("Mon–Fri, 08:00–22:00 WITA", "Sen–Jum, 08:00–22:00 WITA", "周一至周五 08:00–22:00（WITA）", "月〜金 08:00〜22:00（WITA）"),
  readBy: l("Read by", "Dibaca oleh", "由谁阅读", "読むのは"),
  readByValue: l("The people who do the work", "Orang yang mengerjakannya", "真正干活的人", "実際に作る人"),
  formTag: l("Six questions, about two minutes", "Enam pertanyaan, sekitar dua menit", "六个问题，大约两分钟", "6つの質問、約2分"),
  q1: l("What are we making?", "Apa yang kita buat?", "我们要做什么？", "何を作りますか？"),
  q1Hint: l("Pick the closest. We'll get specific on the call.", "Pilih yang paling dekat. Detailnya kita bahas di call.", "选最接近的那个，细节电话里聊。", "いちばん近いものを。詳しくは通話で。"),
  q2: l("What's the budget?", "Berapa budget-nya?", "预算多少？", "ご予算は？"),
  q2Hint: l("A range is fine. It shapes the plan, not the welcome.", "Kisaran saja cukup. Ini membentuk rencananya, bukan sambutannya.", "给个范围就行，它影响的是方案，不是态度。", "幅で構いません。左右されるのは計画で、対応ではありません。"),
  q3: l("When should it start?", "Kapan mulainya?", "什么时候开始？", "いつ始めますか？"),
  q3Hint: l("ASAP means the next open slot.", "Secepatnya berarti slot kosong berikutnya.", "越快越好，指的是下一个空档。", "「できるだけ早く」は次の空き枠のことです。"),
  q4: l("Your name", "Nama Anda", "你的名字", "お名前"),
  q4Hint: l("The way you'd like to be addressed.", "Bagaimana Anda ingin dipanggil.", "你希望我们怎么称呼你。", "呼ばれたいお名前で。"),
  q5: l("Your email", "Email Anda", "你的邮箱", "メールアドレス"),
  q5Hint: l("The only field we can't do without.", "Satu-satunya kolom yang wajib.", "唯一必填的一项。", "これだけは必須です。"),
  q6: l("What's the problem?", "Apa masalahnya?", "要解决什么问题？", "解決したいことは？"),
  q6Hint: l("No brief template. Say it like you would on a call.", "Tanpa template brief. Ceritakan seperti di telepon.", "没有模板，像打电话那样说就好。", "テンプレートは不要。電話で話すように。"),
  q6Placeholder: l("Three sentences is plenty. A link is even better.", "Tiga kalimat sudah cukup. Link malah lebih baik.", "三句话就够了，附个链接更好。", "3文で十分です。リンクがあればなお良し。"),
  starts: [
    l("ASAP", "Secepatnya", "越快越好", "できるだけ早く"),
    l("This month", "Bulan ini", "这个月", "今月"),
    l("Next month", "Bulan depan", "下个月", "来月"),
    l("Just exploring", "Baru melihat-lihat", "先了解一下", "情報収集中"),
  ],
  submitNote: l("It goes to a person, who replies within a working day.", "Pesan ini sampai ke orang, yang membalas dalam satu hari kerja.", "它会送到一个真人那里，一个工作日内回复。", "人に届き、1営業日以内に返信が来ます。"),
  byEmail: l("If you'd rather write", "Kalau lebih suka menulis", "如果你更想写邮件", "メールがよければ"),
  emailNote: l("Same inbox, same people.", "Inbox yang sama, orang yang sama.", "同一个邮箱，同一批人。", "同じ受信箱、同じ人たち。"),
  byVisit: l("If you'd rather visit", "Kalau lebih suka datang", "如果你想当面聊", "訪問がよければ"),
  visitValue: l("Bali, Indonesia", "Bali, Indonesia", "印尼巴厘岛", "インドネシア・バリ"),
  visitNote: l("By appointment. Ask on WhatsApp.", "Dengan janji. Tanya lewat WhatsApp.", "需预约，请在 WhatsApp 上问。", "要予約。WhatsApp でお尋ねください。"),
  byChat: l("If you'd rather chat", "Kalau lebih suka chat", "如果你更想聊天", "チャットがよければ"),
  chatNote: l("WhatsApp, Mon–Fri, 08:00–22:00 WITA.", "WhatsApp, Sen–Jum, 08:00–22:00 WITA.", "WhatsApp，周一至周五 08:00–22:00（WITA）。", "WhatsApp、月〜金 08:00〜22:00（WITA）。"),
  byWatch: l("If you'd rather watch", "Kalau lebih suka melihat", "如果你想先看看", "まずは見てみたいなら"),
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
    "*Ten* *disciplines*, one table.",
    "*Sepuluh* *disiplin*, satu meja.",
    "*十个专业*，一张桌子。",
    "*十の専門*、ひとつのテーブル。",
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
    "Websites, software, campaigns and content for businesses across Indonesia and Europe. Every one is live, and every one names the client.",
    "Website, software, kampanye, dan konten untuk bisnis di Indonesia dan Eropa. Semuanya tayang, dan semuanya menyebut kliennya.",
    "为印尼和欧洲的企业做的网站、软件、广告和内容。每一个都已上线，每一个都写明了客户。",
    "インドネシアとヨーロッパの企業のためのウェブ、ソフトウェア、キャンペーン、コンテンツ。どれも公開中で、どれもクライアント名を明かしています。",
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
