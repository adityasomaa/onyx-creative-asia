/**
 * Manual translation dictionary for the Onyx Creative Asia marketing site.
 *
 * How it works
 * ------------
 * `DICT[locale][englishSource] => translatedString`.
 *
 * The English keys are NEVER retyped by hand for data-driven content:
 * they are read straight from the imported source arrays (`SERVICES`,
 * `PROJECTS`, `INSIGHTS`, ...) and paired by index with the translation
 * arrays below. That guarantees the runtime `<T>` key always matches its
 * dictionary entry exactly. Only short standalone UI strings (nav,
 * buttons, headings) are written as explicit [english, {id,zh,ja}] pairs.
 *
 * Voice: casual-but-formal, general — the same register across ID / CN /
 * JP. Anything without an entry falls back to its English source.
 */

import { SERVICES, PROJECTS, TESTIMONIALS, STATS } from "./data";
import { INSIGHTS } from "./insights";
import type { Locale } from "./i18n";

type Tri = { id: string; zh: string; ja: string };

type ServiceTx = {
  title: Tri;
  short: Tri;
  description: Tri;
  intro: Tri;
  narrative: Tri[];
  capabilities: { title: Tri; detail?: Tri }[];
  process: { title: Tri; detail: Tri }[];
  fitFor: Tri;
  cta: { problem: Tri; solution: Tri };
};

type ProjectTx = {
  title?: Tri;
  blurb?: Tri;
  category?: Tri;
  description?: Tri;
  longDescription?: Tri;
  scope?: Tri[];
  location?: Tri;
  tags?: Tri[];
  urlLabel?: Tri;
  /** The case-study body, which is what /works/[slug] actually renders. */
  study?: {
    overview: Tri;
    needed: Tri[];
    did: Tri[];
    changed: Tri[];
  };
};

type InsightTx = {
  title?: Tri;
  tag?: Tri;
  excerpt?: Tri;
  /** Index-aligned to the article's `sections`. */
  sections?: { heading?: Tri; paragraphs?: Tri[] }[];
};

/* ============================================================
 * UI strings — nav, buttons, section labels, headings, hero, footer,
 * contact form copy. Written as explicit [english, {id,zh,ja}] pairs.
 * Populated by the translation pass; empty entries fall back to English.
 * ============================================================ */
const UI: Array<[string, Tri]> = [
  // ── Nav / buttons / short labels ──
  ["Home", { id: "Beranda", zh: "首页", ja: "ホーム" }],
  ["About", { id: "Tentang", zh: "关于我们", ja: "私たちについて" }],
  ["Services", { id: "Layanan", zh: "服务", ja: "サービス" }],
  ["Works", { id: "Karya", zh: "作品", ja: "実績" }],
  ["Insights", { id: "Wawasan", zh: "洞察", ja: "インサイト" }],
  ["Contact", { id: "Kontak", zh: "联系我们", ja: "お問い合わせ" }],
  ["Start a project", { id: "Mulai proyek", zh: "启动项目", ja: "プロジェクトを始める" }],
  ["See all", { id: "Lihat semua", zh: "查看全部", ja: "すべて見る" }],
  ["Discover", { id: "Jelajahi", zh: "探索", ja: "見てみる" }],
  ["More about us", { id: "Lebih lanjut tentang kami", zh: "了解更多", ja: "もっと知る" }],
  ["Book a free consultation", { id: "Jadwalkan konsultasi gratis", zh: "预约免费咨询", ja: "無料相談を予約する" }],
  ["See related work", { id: "Lihat karya terkait", zh: "查看相关作品", ja: "関連する実績を見る" }],
  ["See our work", { id: "Lihat karya kami", zh: "查看我们的作品", ja: "私たちの実績を見る" }],
  ["Explore", { id: "Jelajahi", zh: "了解详情", ja: "詳しく見る" }],
  ["Send", { id: "Kirim", zh: "发送", ja: "送信" }],
  ["Visit site", { id: "Kunjungi situs", zh: "访问网站", ja: "サイトを見る" }],
  ["Get in touch", { id: "Hubungi kami", zh: "联系我们", ja: "お問い合わせ" }],
  ["All works", { id: "Semua karya", zh: "全部作品", ja: "すべての実績" }],
  ["All work", { id: "Semua karya", zh: "全部作品", ja: "すべての実績" }],
  ["All", { id: "Semua", zh: "全部", ja: "すべて" }],
  ["Read more", { id: "Selengkapnya", zh: "阅读更多", ja: "続きを読む" }],
  ["Read", { id: "Baca", zh: "阅读", ja: "読む" }],
  ["Back", { id: "Kembali", zh: "返回", ja: "戻る" }],
  ["Next", { id: "Lanjut", zh: "下一步", ja: "次へ" }],
  ["min read", { id: "menit baca", zh: "分钟阅读", ja: "分で読めます" }],

  // ── Home hero ──
  ["Onyx Creative Asia", { id: "Onyx Creative Asia", zh: "Onyx Creative Asia", ja: "Onyx Creative Asia" }],
  [
    "Your One Stop Business Development Digital Solution",
    {
      id: "Solusi Digital Satu Pintu untuk Mengembangkan Bisnis Anda",
      zh: "助您拓展业务的一站式数字解决方案",
      ja: "ビジネスの成長を支える、ワンストップのデジタルソリューション",
    },
  ],
  [
    "We help your business grow digitally, the correct way. Everything you need, everything you will ever look for to grow digitally, we have it all.",
    {
      id: "Kami membantu bisnis Anda tumbuh secara digital, dengan cara yang benar. Semua yang Anda butuhkan, semua yang akan Anda cari untuk tumbuh secara digital, ada di sini.",
      zh: "我们用正确的方式帮助您的企业实现数字化增长。您所需要的一切，以及您为数字化增长会寻找的一切，这里都有。",
      ja: "私たちは、正しいやり方でビジネスのデジタルな成長を支えます。必要なもの、これから探すことになるものまで、すべてここに揃っています。",
    },
  ],
  [
    "One team for everything your business needs online.",
    {
      id: "Satu tim untuk semua kebutuhan online bisnis Anda.",
      zh: "一个团队，满足您业务在线上的所有需求。",
      ja: "ビジネスのオンラインに必要なすべてを、一つのチームで。",
    },
  ],
  [
    "An independent studio in Bali running every digital service your business needs, from one team, under one roof.",
    {
      id: "Studio independen di Bali yang menjalankan setiap layanan digital yang bisnis Anda butuhkan, dari satu tim, di bawah satu atap.",
      zh: "一家位于 Bali 的独立工作室，由一个团队在同一屋檐下，提供您业务所需的每一项数字服务。",
      ja: "Bali の独立系スタジオが、ビジネスに必要なあらゆるデジタルサービスを、一つのチーム、一つの場所で提供します。",
    },
  ],

  // ── Home sections ──
  ["What we do", { id: "Apa yang kami kerjakan", zh: "我们做什么", ja: "私たちができること" }],
  [
    "Six services that cover everything your business needs to grow online, run by one team so nothing falls between the gaps.",
    {
      id: "Enam layanan yang mencakup semua kebutuhan bisnis Anda untuk tumbuh online, dijalankan satu tim sehingga tidak ada yang terlewat.",
      zh: "六项服务，覆盖您的企业在线上成长所需的一切，由一个团队负责，不让任何环节掉队。",
      ja: "オンラインでの成長に必要なすべてを網羅する6つのサービス。一つのチームが担うので、抜け落ちるものはありません。",
    },
  ],
  ["Brands we've grown", { id: "Brand yang kami kembangkan", zh: "我们助力成长的品牌", ja: "私たちが育ててきたブランド" }],
  [
    "A look at recent projects across websites, marketing, brand, and automation.",
    {
      id: "Sekilas proyek terbaru di bidang website, pemasaran, brand, dan otomatisasi.",
      zh: "近期项目一览，涵盖网站、营销、品牌与自动化。",
      ja: "ウェブサイト、マーケティング、ブランド、自動化にわたる最近のプロジェクトをご紹介します。",
    },
  ],
  ["Testimonials", { id: "Testimoni", zh: "客户评价", ja: "お客様の声" }],
  ["What they say about us", { id: "Apa kata mereka tentang kami", zh: "他们这样评价我们", ja: "私たちへの評価" }],
  [
    "The people we build for, in their own words. Real teams, real projects.",
    {
      id: "Orang-orang yang kami bantu, dalam kata-kata mereka sendiri. Tim nyata, proyek nyata.",
      zh: "我们服务的人，用他们自己的话来说。真实的团队，真实的项目。",
      ja: "私たちが手がけた相手の、そのままの言葉。実在のチーム、実在のプロジェクト。",
    },
  ],

  // ── Footer ──
  ["#1 Digital Marketing in Asia", { id: "#1 Digital Marketing di Asia", zh: "Asia 领先的数字营销团队", ja: "Asia でトップクラスのデジタルマーケティング" }],
  [
    "Your one stop business development digital solution",
    {
      id: "Solusi digital satu pintu untuk mengembangkan bisnis Anda",
      zh: "助您拓展业务的一站式数字解决方案",
      ja: "ビジネスの成長を支える、ワンストップのデジタルソリューション",
    },
  ],
  ["Sitemap", { id: "Peta situs", zh: "网站地图", ja: "サイトマップ" }],
  ["Legal", { id: "Legal", zh: "法律条款", ja: "法的事項" }],
  ["Privacy Policy", { id: "Kebijakan Privasi", zh: "隐私政策", ja: "プライバシーポリシー" }],
  ["Terms of Use", { id: "Syarat Penggunaan", zh: "使用条款", ja: "利用規約" }],
  ["All rights reserved.", { id: "Seluruh hak cipta dilindungi.", zh: "保留所有权利。", ja: "無断複写・転載を禁じます。" }],
  [
    "Made with intent in Bali, Indonesia",
    { id: "Dibuat dengan sepenuh hati di Bali, Indonesia", zh: "用心制作于 Bali, Indonesia", ja: "Bali, Indonesia にて、心を込めて" },
  ],
  ["Ready to grow your business", { id: "Siap mengembangkan bisnis Anda", zh: "准备好让您的业务成长了吗", ja: "ビジネスを成長させる準備はできていますか" }],
  ["the correct way?", { id: "dengan cara yang benar?", zh: "并且用正确的方式？", ja: "しかも、正しいやり方で。" }],
  [
    "Tell us a little about your business and what you need. We'll take it from there.",
    {
      id: "Ceritakan sedikit tentang bisnis Anda dan apa yang Anda butuhkan. Selanjutnya biar kami yang urus.",
      zh: "简单说说您的业务和需求，剩下的交给我们。",
      ja: "あなたのビジネスと必要なことを少しお聞かせください。あとは私たちが引き受けます。",
    },
  ],

  // ── About page ──
  [
    "An independent studio in Bali running every digital service your business needs to grow, from your website to your marketing to your automations, under one roof.",
    {
      id: "Studio independen di Bali yang menjalankan setiap layanan digital yang bisnis Anda butuhkan untuk tumbuh, dari website, pemasaran, hingga otomatisasi, di bawah satu atap.",
      zh: "一家位于 Bali 的独立工作室，在同一屋檐下提供您业务成长所需的每一项数字服务，从网站到营销再到自动化。",
      ja: "Bali の独立系スタジオが、ウェブサイトからマーケティング、自動化まで、ビジネスの成長に必要なあらゆるデジタルサービスを一つの場所で提供します。",
    },
  ],
  ["Experience", { id: "Pengalaman", zh: "经验积累", ja: "これまでの実績" }],
  ["Our number records", { id: "Catatan angka kami", zh: "我们的数字记录", ja: "数字で見る私たち" }],
  ["Motto", { id: "Moto", zh: "我们的信条", ja: "モットー" }],
  [
    "Speed and care shouldn't trade off",
    { id: "Kecepatan dan ketelitian tidak harus dikorbankan", zh: "速度与用心，不必二选一", ja: "スピードと丁寧さは、両立できる" },
  ],
  [
    "Most studios make you pick one. We built Onyx so you never have to.",
    {
      id: "Kebanyakan studio memaksa Anda memilih salah satu. Kami membangun Onyx agar Anda tidak perlu memilih.",
      zh: "大多数工作室让你只能二选一。我们创立 Onyx，就是为了让你不必如此。",
      ja: "多くのスタジオは、どちらかを選ばせます。私たちは、その必要がないように Onyx を作りました。",
    },
  ],
  [
    "Onyx Creative Asia is an independent studio working at the intersection of brand, performance, and emerging technology. We build the digital surface, the growth engine, and the automation layer, for teams that want one partner instead of five.",
    {
      id: "Onyx Creative Asia adalah studio independen yang bekerja di persimpangan brand, performance, dan teknologi baru. Kami membangun tampilan digital, mesin pertumbuhan, dan lapisan otomatisasi, untuk tim yang menginginkan satu partner alih-alih lima.",
      zh: "Onyx Creative Asia 是一家独立工作室，工作在品牌、效果与新兴技术的交汇处。我们打造数字界面、增长引擎与自动化层，服务于那些只想要一个合作伙伴、而非五个的团队。",
      ja: "Onyx Creative Asia は、ブランド、パフォーマンス、そして新しいテクノロジーが交わる場所で活動する独立系スタジオです。デジタルの表層、成長のエンジン、自動化のレイヤーを構築します。5社ではなく1社のパートナーを求めるチームのために。",
    },
  ],
  [
    "The team you meet is the team you work with. There is no account layer between strategy and the people writing the code or running the ads.",
    {
      id: "Tim yang Anda temui adalah tim yang bekerja dengan Anda. Tidak ada lapisan account di antara strategi dan orang-orang yang menulis kode atau menjalankan iklan.",
      zh: "你见到的团队，就是与你共事的团队。在策略与写代码、投广告的人之间，没有客户经理这一层。",
      ja: "最初に会うチームが、そのまま一緒に働くチームです。戦略と、コードを書く人・広告を回す人とのあいだに、営業窓口の層はありません。",
    },
  ],
  [
    "Based in Bali, working with founders across Indonesia, Southeast Asia, and Europe, in hospitality, commerce, real estate, and software.",
    {
      id: "Berbasis di Bali, bekerja bersama para founder di Indonesia, Asia Tenggara, dan Eropa, di bidang perhotelan, perdagangan, properti, dan software.",
      zh: "总部位于 Bali，与 Indonesia、东南亚及欧洲的创始人合作，涉及酒店、商贸、房地产与软件行业。",
      ja: "Bali を拠点に、Indonesia、東南アジア、ヨーロッパの創業者とともに、ホスピタリティ、コマース、不動産、ソフトウェアの領域で仕事をしています。",
    },
  ],

  // ── Process flow ──
  ["Process", { id: "Proses", zh: "流程", ja: "プロセス" }],
  ["How we deliver your project", { id: "Bagaimana kami mengerjakan proyek Anda", zh: "我们如何交付您的项目", ja: "プロジェクトの進め方" }],
  ["Inquiry", { id: "Permintaan", zh: "初次咨询", ja: "お問い合わせ" }],
  ["Discovery", { id: "Penggalian", zh: "需求梳理", ja: "ディスカバリー" }],
  ["Development", { id: "Pengembangan", zh: "开发制作", ja: "開発" }],
  ["Delivery", { id: "Penyerahan", zh: "交付上线", ja: "納品" }],
  ["Maintenance", { id: "Pemeliharaan", zh: "持续维护", ja: "メンテナンス" }],
  [
    "You reach out and tell us what you need.",
    { id: "Anda menghubungi kami dan menyampaikan apa yang dibutuhkan.", zh: "您联系我们，说明您的需求。", ja: "ご連絡いただき、必要なことをお聞かせください。" },
  ],
  [
    "We dig into your goals, audience, and scope.",
    { id: "Kami menggali tujuan, audiens, dan ruang lingkup Anda.", zh: "我们深入了解您的目标、受众与项目范围。", ja: "目標、対象、そして範囲を丁寧に掘り下げます。" },
  ],
  [
    "We design and build, with you in the loop.",
    { id: "Kami mendesain dan membangun, dengan Anda tetap dilibatkan.", zh: "我们进行设计与开发，全程与您保持同步。", ja: "設計と構築を進めます。その間もずっと共有しながら。" },
  ],
  [
    "We launch and hand it over, ready to run.",
    { id: "Kami meluncurkan dan menyerahkannya, siap dijalankan.", zh: "我们负责上线并交接，交付即可运行。", ja: "公開してお引き渡しします。すぐに動かせる状態で。" },
  ],
  [
    "We keep it healthy, updated, and improving.",
    { id: "Kami menjaganya tetap sehat, terbarui, dan terus membaik.", zh: "我们让它保持健康、持续更新、不断改进。", ja: "健全な状態を保ち、更新し、改善を続けます。" },
  ],

  // ── Services / works / insights pages ──
  ["Everything we do", { id: "Semua yang kami kerjakan", zh: "我们所做的一切", ja: "私たちが手がけるすべて" }],
  ["Service", { id: "Layanan", zh: "服务", ja: "サービス" }],
  ["What is included", { id: "Apa saja yang termasuk", zh: "服务内容", ja: "含まれるもの" }],
  ["What we cover.", { id: "Apa yang kami tangani.", zh: "我们覆盖的范围。", ja: "私たちがカバーする範囲。" }],
  [
    "Mix and match. Most engagements pull from three or four; a few pull all of them.",
    {
      id: "Bisa dikombinasikan. Sebagian besar kerja sama mengambil tiga atau empat; beberapa mengambil semuanya.",
      zh: "可自由组合。多数合作会用到其中三四项，也有少数会全部用上。",
      ja: "自由に組み合わせられます。多くの場合は3つか4つ、まれにすべてを使います。",
    },
  ],
  ["Our process", { id: "Proses kami", zh: "我们的流程", ja: "私たちのプロセス" }],
  ["How we deliver this work", { id: "Bagaimana kami mengerjakannya", zh: "我们如何完成这项工作", ja: "この仕事の進め方" }],
  ["Who this is for", { id: "Untuk siapa layanan ini", zh: "适合谁", ja: "こんな方に" }],
  ["Sounds like you?", { id: "Terdengar seperti Anda?", zh: "说的是您吗？", ja: "心当たりはありますか？" }],
  ["Other services", { id: "Layanan lainnya", zh: "其他服务", ja: "その他のサービス" }],
  ["Selected works", { id: "Karya pilihan", zh: "精选作品", ja: "選りすぐりの実績" }],
  [
    "A selection of recent projects across websites, marketing, brand, and automation. Filter by the service behind each one.",
    {
      id: "Kumpulan proyek terbaru di bidang website, pemasaran, brand, dan otomatisasi. Saring berdasarkan layanan di baliknya.",
      zh: "近期项目精选，涵盖网站、营销、品牌与自动化。可按背后的服务类型筛选。",
      ja: "ウェブサイト、マーケティング、ブランド、自動化にわたる最近のプロジェクト。それぞれの背後にあるサービスで絞り込めます。",
    },
  ],
  ["Year", { id: "Tahun", zh: "年份", ja: "年" }],
  ["Location", { id: "Lokasi", zh: "地点", ja: "所在地" }],
  ["Discipline", { id: "Disiplin", zh: "服务领域", ja: "領域" }],
  ["(The work)", { id: "(Pekerjaannya)", zh: "（项目内容）", ja: "（この仕事について）" }],
  ["(Scope)", { id: "(Ruang lingkup)", zh: "（工作范围）", ja: "（対応範囲）" }],
  ["(Client words)", { id: "(Kata klien)", zh: "（客户的话）", ja: "（クライアントの声）" }],
  ["No work under this filter yet.", { id: "Belum ada karya pada filter ini.", zh: "该筛选条件下暂时还没有作品。", ja: "この絞り込みに該当する実績はまだありません。" }],
  ["See all work", { id: "Lihat semua karya", zh: "查看全部作品", ja: "すべての実績を見る" }],
  ["Useful articles", { id: "Artikel bermanfaat", zh: "值得一读的文章", ja: "役に立つ記事" }],
  [
    "Everything interesting you should know in the Digital Marketing world.",
    {
      id: "Semua hal menarik yang perlu Anda tahu di dunia Digital Marketing.",
      zh: "数字营销世界里，那些值得你知道的有趣内容。",
      ja: "デジタルマーケティングの世界で、知っておきたい興味深いことを。",
    },
  ],
  ["(Keep reading)", { id: "(Lanjut membaca)", zh: "（继续阅读）", ja: "（続けて読む）" }],
  [
    "Like the way we think? Tell us what you're trying to build.",
    {
      id: "Suka dengan cara kami berpikir? Ceritakan apa yang ingin Anda bangun.",
      zh: "认同我们的思路？告诉我们你想打造什么。",
      ja: "私たちの考え方に共感いただけたら、これから作りたいものを聞かせてください。",
    },
  ],

  // ── Contact / forms ──
  ["Choose file", { id: "Pilih file", zh: "选择文件", ja: "ファイルを選ぶ" }],
  ["Company (optional)", { id: "Perusahaan (opsional)", zh: "公司（选填）", ja: "会社名（任意）" }],
  ["Company / studio", { id: "Perusahaan / studio", zh: "公司 / 工作室", ja: "会社 / スタジオ" }],
  [
    "Drop CV here or click to choose",
    { id: "Letakkan CV di sini atau klik untuk memilih", zh: "把简历拖到这里，或点击选择", ja: "履歴書をここにドロップ、またはクリックして選択" },
  ],
  ["Full name", { id: "Nama lengkap", zh: "姓名", ja: "お名前" }],
  [
    "Goals, timing, anything we should know…",
    { id: "Tujuan, waktu, atau hal lain yang perlu kami tahu…", zh: "目标、时间安排，或任何我们该知道的事…", ja: "目標や時期など、伝えておきたいことを…" },
  ],
  [
    "PDF, DOC, or DOCX. Max 3 MB. Optional, but speeds things up.",
    { id: "PDF, DOC, atau DOCX. Maks 3 MB. Opsional, tapi mempercepat proses.", zh: "PDF、DOC 或 DOCX，最大 3 MB。选填，但能加快流程。", ja: "PDF、DOC、DOCX（最大 3 MB）。任意ですが、あるとスムーズです。" },
  ],
  ["Replace", { id: "Ganti", zh: "重新选择", ja: "差し替える" }],
  ["Sending…", { id: "Mengirim…", zh: "发送中…", ja: "送信中…" }],
  [
    "Ask us anything, we read everything.",
    { id: "Tanyakan apa saja, kami membaca semuanya.", zh: "有什么尽管问，我们每一条都会看。", ja: "何でもお尋ねください。すべて目を通します。" },
  ],
  ["Or write us anytime at", { id: "Atau tulis ke kami kapan saja di", zh: "也可以随时写信给我们：", ja: "いつでもこちらへご連絡ください：" }],
  ["Got it,", { id: "Diterima,", zh: "已收到，", ja: "承りました、" }],
  ["We got it,", { id: "Sudah kami terima,", zh: "我们已收到，", ja: "受け取りました、" }],
  ["Thanks for applying. We'll", { id: "Terima kasih sudah melamar. Kami akan", zh: "感谢您的申请。我们会", ja: "ご応募ありがとうございます。私たちは" }],
  ["read every word.", { id: "membaca setiap katanya.", zh: "认真读完每一个字。", ja: "一言一句、しっかり読みます。" }],
  ["thanks.", { id: "terima kasih.", zh: "谢谢。", ja: "ありがとうございます。" }],

  /* Contact forms, works case studies, and the sitemap page. */
  [
    "Loading",
    { id: "Memuat", zh: "加载中", ja: "読み込み中" },
  ],
  [
    "Change language",
    { id: "Ganti bahasa", zh: "切换语言", ja: "言語を切り替える" },
  ],
  [
    "Cookie preferences",
    { id: "Preferensi cookie", zh: "Cookie 偏好设置", ja: "Cookie の設定" },
  ],
  [
    "Everything, in one place",
    { id: "Semuanya, dalam satu tempat", zh: "全部内容，都在这里", ja: "すべてを、ひとつの場所に" },
  ],
  [
    "Inquiry type",
    { id: "Jenis pertanyaan", zh: "咨询类型", ja: "お問い合わせの種類" },
  ],
  [
    "(Question received)",
    { id: "(Pertanyaan diterima)", zh: "（问题已收到）", ja: "（ご質問を受け付けました）" },
  ],
  [
    "(Application received)",
    { id: "(Lamaran diterima)", zh: "（申请已收到）", ja: "（ご応募を受け付けました）" },
  ],
  [
    "(Partnership proposal received)",
    { id: "(Proposal partnership diterima)", zh: "（合作提案已收到）", ja: "（パートナーシップのご提案を受け付けました）" },
  ],
  [
    "(Brief sent, confirmation on its way)",
    { id: "(Brief terkirim, konfirmasi sedang menuju ke Anda)", zh: "（简报已发送，确认信正在路上）", ja: "（ブリーフを送信しました。確認をお送りします）" },
  ],
  [
    "Send question",
    { id: "Kirim pertanyaan", zh: "发送问题", ja: "質問を送る" },
  ],
  [
    "Send application",
    { id: "Kirim lamaran", zh: "提交申请", ja: "応募する" },
  ],
  [
    "Send proposal",
    { id: "Kirim proposal", zh: "发送提案", ja: "提案を送る" },
  ],
  [
    "Send the brief",
    { id: "Kirim brief-nya", zh: "发送简报", ja: "ブリーフを送る" },
  ],
  [
    "What's your name?",
    { id: "Nama Anda siapa?", zh: "怎么称呼您？", ja: "お名前は？" },
  ],
  [
    "Where can we reach you?",
    { id: "Kami bisa menghubungi Anda di mana?", zh: "我们可以怎么联系您？", ja: "ご連絡先を教えてください" },
  ],
  [
    "Which team do you want to join?",
    { id: "Anda ingin gabung ke tim mana?", zh: "您想加入哪个团队？", ja: "どのチームに参加したいですか？" },
  ],
  [
    "Portfolio and CV",
    { id: "Portfolio dan CV", zh: "作品集与简历", ja: "ポートフォリオと履歴書" },
  ],
  [
    "Why Onyx?",
    { id: "Kenapa Onyx?", zh: "为什么选择 Onyx？", ja: "なぜ Onyx なのか" },
  ],
  [
    "What's on your mind?",
    { id: "Apa yang ingin Anda sampaikan?", zh: "您想聊点什么？", ja: "どんなご用件でしょうか" },
  ],
  [
    "Who's reaching out?",
    { id: "Siapa yang menghubungi kami?", zh: "是谁在联系我们？", ja: "どなたからのご連絡ですか？" },
  ],
  [
    "How do we reach you?",
    { id: "Bagaimana kami menghubungi Anda?", zh: "我们该怎么找到您？", ja: "ご連絡はどちらへ？" },
  ],
  [
    "What kind of partnership?",
    { id: "Partnership seperti apa?", zh: "想谈哪一类合作？", ja: "どんなパートナーシップですか？" },
  ],
  [
    "Outline the proposal.",
    { id: "Jelaskan garis besar proposalnya.", zh: "说说提案的大致内容。", ja: "提案の概要を教えてください。" },
  ],
  [
    "Who are we talking to?",
    { id: "Kami sedang bicara dengan siapa?", zh: "请问怎么称呼您？", ja: "どなたとお話ししていますか？" },
  ],
  [
    "What do you need?",
    { id: "Apa yang Anda butuhkan?", zh: "您需要什么？", ja: "何が必要ですか？" },
  ],
  [
    "Budget in mind?",
    { id: "Ada budget di kepala?", zh: "心里有预算范围吗？", ja: "ご予算の目安は？" },
  ],
  [
    "Tell us about the project.",
    { id: "Ceritakan tentang project-nya.", zh: "跟我们说说这个项目。", ja: "プロジェクトについて教えてください。" },
  ],
  [
    "What are you proposing, what's in it for both sides, and what would the first 30 days look like?",
    { id: "Apa yang Anda tawarkan, apa untungnya untuk kedua pihak, dan 30 hari pertamanya seperti apa?", zh: "您想提议什么？双方各能得到什么？头 30 天会是什么样？", ja: "どんなご提案で、双方にどんな利点があり、最初の30日はどう進みますか？" },
  ],
  [
    "What kind of work do you want to make next? Anything we should look at first?",
    { id: "Karya seperti apa yang ingin Anda buat berikutnya? Ada yang sebaiknya kami lihat duluan?", zh: "接下来您想做什么样的作品？有什么是我们该先看的？", ja: "次はどんな仕事をつくりたいですか？先に見ておくべきものはありますか？" },
  ],
  [
    "https://your-portfolio.com (optional)",
    { id: "https://portfolio-anda.com (opsional)", zh: "https://your-portfolio.com（选填）", ja: "https://your-portfolio.com（任意）" },
  ],
  [
    "https://company.com (optional)",
    { id: "https://perusahaan-anda.com (opsional)", zh: "https://company.com（选填）", ja: "https://company.com（任意）" },
  ],
  [
    "A copy of your message is in your inbox now, keep an eye on it (and check spam, just in case).",
    { id: "Salinan pesan Anda sudah masuk ke inbox, coba dicek (lihat folder spam juga, untuk berjaga-jaga).", zh: "留言副本已经发到您的邮箱了，记得留意一下（顺便也看看垃圾邮件）。", ja: "メッセージの控えを受信トレイにお送りしました。ご確認ください（念のため迷惑メールフォルダも）。" },
  ],
  [
    "Your application is with us. If we want to move forward, we'll send a short async exercise, no panel interviews, no whiteboards.",
    { id: "Lamaran Anda sudah di tangan kami. Kalau kami ingin lanjut, kami kirim satu exercise singkat yang bisa dikerjakan kapan saja, tanpa interview panel, tanpa whiteboard.", zh: "我们已收到您的申请。如果想继续推进，我们会发一份简短的异步小练习，没有面试小组，也不用上白板。", ja: "ご応募をお預かりしました。次に進む場合は、短い非同期の課題をお送りします。パネル面接もホワイトボードもありません。" },
  ],
  [
    "Your brief is on its way to us, we opened a WhatsApp chat so you can keep it going there too.",
    { id: "Brief Anda sedang menuju ke kami, dan kami sudah membuka chat WhatsApp supaya obrolannya bisa lanjut di sana juga.", zh: "您的项目简报正在送到我们这边，我们也开了一个 WhatsApp 对话，方便您在那边继续聊。", ja: "ブリーフはこちらに向かっています。WhatsApp のチャットも開いたので、そちらでも続けられます。" },
  ],
  [
    "Your question is on its way to us, we opened a WhatsApp chat so you can keep it going there too.",
    { id: "Pertanyaan Anda sedang menuju ke kami, dan kami sudah membuka chat WhatsApp supaya obrolannya bisa lanjut di sana juga.", zh: "您的问题正在送到我们这边，我们也开了一个 WhatsApp 对话，方便您在那边继续聊。", ja: "ご質問はこちらに向かっています。WhatsApp のチャットも開いたので、そちらでも続けられます。" },
  ],
  [
    "Your proposal is with us. If the fit is clear, we move fast.",
    { id: "Proposal Anda sudah di tangan kami. Kalau cocoknya jelas, kami bergerak cepat.", zh: "您的提案已经在我们这里。如果契合度足够清楚，我们会推进得很快。", ja: "ご提案をお預かりしました。相性がはっきりしていれば、私たちは速く動きます。" },
  ],
  [
    "General Question",
    { id: "Pertanyaan Umum", zh: "一般咨询", ja: "一般のお問い合わせ" },
  ],
  [
    "Project Brief",
    { id: "Brief Project", zh: "项目简报", ja: "プロジェクトのご相談" },
  ],
  [
    "Career",
    { id: "Karier", zh: "加入我们", ja: "採用" },
  ],
  [
    "Partnership",
    { id: "Partnership", zh: "合作", ja: "パートナーシップ" },
  ],
  [
    "Quick question, a hello, or anything that doesn't fit the others.",
    { id: "Pertanyaan singkat, sekadar menyapa, atau apa pun yang tidak masuk kategori lain.", zh: "一个小问题、打声招呼，或者任何不属于其他类别的事。", ja: "ちょっとした質問、ごあいさつ、他に当てはまらないこと何でも。" },
  ],
  [
    "You want us to design, build, or scale something for you.",
    { id: "Anda ingin kami mendesain, membangun, atau mengembangkan sesuatu untuk Anda.", zh: "您希望我们为您设计、搭建，或者把某件事做得更大。", ja: "設計・構築・スケールを私たちに任せたい方へ。" },
  ],
  [
    "You want to work with us. We're a senior, opinionated team.",
    { id: "Anda ingin bekerja bersama kami. Tim kami senior dan punya pendirian.", zh: "您想加入我们。我们是一支资深、有主见的团队。", ja: "私たちと一緒に働きたい方へ。シニアで、意見のあるチームです。" },
  ],
  [
    "You run a studio, agency, or platform and you're proposing a collab.",
    { id: "Anda menjalankan studio, agency, atau platform dan ingin mengajak kolaborasi.", zh: "您经营着工作室、代理商或平台，想提议一次合作。", ja: "スタジオ・エージェンシー・プラットフォームを運営していて、協業をご提案いただける方へ。" },
  ],
  [
    "Web Development",
    { id: "Web Development", zh: "网站开发", ja: "ウェブ開発" },
  ],
  [
    "Paid Media",
    { id: "Paid Media", zh: "付费媒体", ja: "ペイドメディア" },
  ],
  [
    "Social Media",
    { id: "Social Media", zh: "社交媒体", ja: "ソーシャルメディア" },
  ],
  [
    "AI Systems",
    { id: "AI Systems", zh: "AI 系统", ja: "AI システム" },
  ],
  [
    "Brand & Design",
    { id: "Brand & Design", zh: "品牌与设计", ja: "ブランド＆デザイン" },
  ],
  [
    "Operations",
    { id: "Operations", zh: "运营", ja: "オペレーション" },
  ],
  [
    "Open application",
    { id: "Lamaran terbuka", zh: "自由申请", ja: "自由応募" },
  ],
  [
    "Co-production",
    { id: "Co-production", zh: "联合制作", ja: "共同制作" },
  ],
  [
    "White-label",
    { id: "White-label", zh: "白标合作", ja: "ホワイトレーベル" },
  ],
  [
    "Reseller",
    { id: "Reseller", zh: "分销合作", ja: "リセラー" },
  ],
  [
    "Affiliate / referral",
    { id: "Affiliate / referral", zh: "联盟 / 推荐", ja: "アフィリエイト / 紹介" },
  ],
  [
    "Strategic alliance",
    { id: "Aliansi strategis", zh: "战略联盟", ja: "戦略的提携" },
  ],
  [
    "Other",
    { id: "Lainnya", zh: "其他", ja: "その他" },
  ],
  [
    "Not sure yet",
    { id: "Belum tahu", zh: "还不确定", ja: "まだ未定" },
  ],
  [
    "Overview",
    { id: "Gambaran umum", zh: "概览", ja: "概要" },
  ],
  [
    "What needed to change",
    { id: "Apa yang perlu berubah", zh: "需要改变的地方", ja: "変えるべきだったこと" },
  ],
  [
    "What we did",
    { id: "Apa yang kami kerjakan", zh: "我们做了什么", ja: "私たちがやったこと" },
  ],
  [
    "What changed",
    { id: "Apa yang berubah", zh: "改变了什么", ja: "変わったこと" },
  ],
  [
    "Extra",
    { id: "Lainnya", zh: "其他", ja: "その他" },
  ],
  [
    "Every page on this site, grouped so you can find what you came for.",
    { id: "Semua halaman di situs ini, dikelompokkan supaya Anda cepat menemukan yang dicari.", zh: "本站的所有页面都归好类了，方便您找到想找的东西。", ja: "このサイトの全ページを、目的のものが見つけやすいようにまとめました。" },
  ],
];

/* ============================================================
 * Data-aligned translations. Each array is index-matched to its source
 * array in data.ts / insights.ts. A missing element (or missing field)
 * simply falls back to English.
 * ============================================================ */
const SERVICE_TX: Array<ServiceTx | undefined> = [
  {
    title: { id: "Kehadiran Digital", zh: "数字形象", ja: "デジタルプレゼンス" },
    short: { id: "Semua yang bisnis Anda butuhkan untuk hadir secara online.", zh: "让您的企业在线立足所需的一切。", ja: "ビジネスをオンラインで確立するために必要なすべてを。" },
    description: { id: "Kami membangun website yang mengubah pengunjung menjadi pertanyaan, lalu menghosting, merawat, dan menjaganya tetap ditemukan di Google, semuanya dalam satu paket.", zh: "我们为您的企业打造一个能将访客转化为咨询的网站，随后负责托管、维护，并让它持续被 Google 收录，全部包含在一个方案里。", ja: "訪問者を問い合わせに変えるウェブサイトを制作し、そのホスティングと保守を行い、Google で見つけられる状態を保つ——すべてを一つのパッケージで。" },
    intro: { id: "Website Anda, software di baliknya, dan semua yang diperlukan agar tetap online, ditangani oleh satu tim.", zh: "您的网站、支撑它的软件，以及让它保持在线所需的一切，全部由一个团队负责。", ja: "あなたのウェブサイト、その背後にあるソフトウェア、そしてオンラインを保つために必要なすべてを、一つのチームが担います。" },
    narrative: [
      { id: "Ini mencakup pembuatan menyeluruh: desain, frontend, backend, dan integrasi yang menghubungkan situs Anda dengan alat yang sudah Anda pakai. Tim yang sama yang merancang dan mendesain pekerjaan ini juga yang membangunnya, jadi tidak ada yang hilang saat serah terima.", zh: "这涵盖了完整的搭建：设计、前端、后端，以及将您的网站与现有工具连接起来的集成。负责规划和设计的团队同时也负责开发，因此不会有任何环节在交接中遗失。", ja: "これには構築のすべてが含まれます——デザイン、フロントエンド、バックエンド、そしてサイトと既存のツールをつなぐ連携です。仕事の範囲を定めて設計するチームがそのまま構築も担うため、引き継ぎで抜け落ちるものはありません。" },
      { id: "Hosting, domain, dan penyiapan SEO menjadi bagian dari paket, bukan item terpisah. Setelah situs aktif, kami terus memperbaruinya, menjaga kontennya tetap segar, dan menambahkan bagian baru seiring perubahan bisnis Anda.", zh: "托管、域名和 SEO 设置都包含在方案之内，而非另行计费的项目。网站上线后，我们会持续更新、保持内容常新，并随着业务的变化增添新的板块。", ja: "ホスティング、ドメイン、SEO の設定は別料金の項目ではなく、パッケージの一部です。サイトが公開された後も、私たちは更新を続け、コンテンツを最新に保ち、ビジネスの変化に合わせて新しいセクションを追加します。" }
    ],
    capabilities: [
      {
        title: { id: "Desain dan pembuatan website", zh: "网站设计与搭建", ja: "ウェブサイトの設計・構築" },
        detail: { id: "Layout, halaman, dan front end-nya, didesain dan dibangun oleh tim yang sama.", zh: "版面、页面和前端，全部由同一个团队设计并开发。", ja: "レイアウトもページもフロントエンドも、同じチームが設計して作ります。" },
      },
      {
        title: { id: "Software custom dan aplikasi web", zh: "定制软件与 Web 应用", ja: "カスタムソフトウェアと Web アプリ" },
        detail: { id: "Alur booking, portal, dashboard, apa pun yang tidak bisa dilakukan tool siap pakai.", zh: "预订流程、客户门户、数据看板，现成工具做不到的都能做。", ja: "予約フロー、ポータル、ダッシュボードなど、既製ツールでは無理なものを。" },
      },
      {
        title: { id: "Hosting dan domain", zh: "托管与域名", ja: "ホスティングとドメイン" },
        detail: { id: "Tempat website-nya tinggal dan alamat yang dipakai, dua-duanya kami urus.", zh: "网站放在哪里、用什么网址访问，两件事我们都管。", ja: "サイトを置く場所も、アクセスする住所も、まとめてこちらで。" },
      },
      {
        title: { id: "Pemeliharaan berkelanjutan", zh: "持续维护", ja: "継続的なメンテナンス" },
        detail: { id: "Update, perbaikan, dan perubahan kecil, dikerjakan begitu muncul.", zh: "更新、修复和小改动，出现了就直接处理。", ja: "アップデートも修正も細かな変更も、出てきたそのつど対応します。" },
      },
      {
        title: { id: "Penyiapan dan optimasi SEO", zh: "SEO 设置与优化", ja: "SEO の設定と最適化" },
        detail: { id: "Struktur, metadata, dan kecepatan, supaya mesin pencari bisa membaca website Anda.", zh: "结构、元数据和速度都调好，让搜索引擎读得懂这个网站。", ja: "構造、メタデータ、表示速度を整えて、検索エンジンが読める状態に。" },
      },
      {
        title: { id: "Manajemen konten", zh: "内容管理", ja: "コンテンツ管理" },
        detail: { id: "Anda ganti sendiri teks dan gambarnya, tanpa harus menunggu kami.", zh: "文字和图片您自己就能改，不用等我们。", ja: "テキストも画像もご自身で編集でき、こちらの手を待つ必要はありません。" },
      }
    ],
    process: [
      { title: { id: "Ruang lingkup dan struktur", zh: "梳理范围与结构", ja: "範囲と構成の整理" }, detail: { id: "Kami memetakan halaman, konten yang sudah Anda miliki, dan apa yang masih perlu ditulis atau difoto.", zh: "我们梳理出各个页面、您现有的内容，以及仍需撰写或拍摄的部分。", ja: "ページ構成、すでにお持ちのコンテンツ、そして今後執筆や撮影が必要な部分を洗い出します。" } },
      { title: { id: "Desain", zh: "设计", ja: "デザイン" }, detail: { id: "Tata letak dan sistem visual, ditinjau bersama dalam sesi kerja alih-alih satu peluncuran besar.", zh: "版面布局与视觉系统，在共同参与的工作会中一起评审，而非最后一次性揭晓。", ja: "レイアウトとビジュアルシステムを、一度きりの大発表ではなく、作業セッションの中で一緒に確認していきます。" } },
      { title: { id: "Pembangunan", zh: "开发", ja: "構築" }, detail: { id: "Pengembangan lewat tautan pratinjau langsung, dengan check-in rutin agar Anda bisa menyaksikannya terbentuk.", zh: "在实时预览链接上进行开发，并定期沟通进度，让您亲眼看着它逐步成形。", ja: "ライブプレビューのリンク上で開発を進め、定期的に状況を共有するので、形になっていく様子をご覧いただけます。" } },
      { title: { id: "Peluncuran dan serah terima", zh: "上线与交接", ja: "公開と引き渡し" }, detail: { id: "Kami menayangkannya, menghubungkan domain dan hosting, lalu memandu Anda mengelolanya.", zh: "我们让网站上线，接入域名与托管，并带您了解如何进行管理。", ja: "サイトを公開し、ドメインとホスティングを接続したうえで、運用方法をご案内します。" } }
    ],
    fitFor: { id: "Bisnis yang membutuhkan website yang layak untuk pertama kalinya, atau yang sudah melampaui template dan perlu dibangun ulang serta dirawat.", zh: "适合首次需要一个像样网站的企业，或是已不再满足于模板、需要重建并持续维护的企业。", ja: "初めて本格的なウェブサイトを必要とするビジネス、あるいはテンプレートでは手狭になり、作り直しと継続的な管理が必要なビジネスに。" },
    cta: {
      problem: { id: "Apakah bisnis Anda masih belum memiliki website yang mewakilinya dengan baik?", zh: "您的企业至今仍没有一个能恰当展现自己的网站吗？", ja: "あなたのビジネスには、それをきちんと表現するウェブサイトがまだありませんか？" },
      solution: { id: "Kami mendesain, membangun, menghosting, dan menjaganya tetap berjalan. Hubungi kami untuk konsultasi gratis.", zh: "我们负责设计、搭建、托管并保持它稳定运行。欢迎联系我们，获取免费咨询。", ja: "私たちが設計し、構築し、ホスティングし、稼働を保ちます。無料相談はお気軽にお問い合わせください。" }
    }
  },
  {
    title: { id: "Pemasaran Digital", zh: "数字营销", ja: "デジタルマーケティング" },
    short: { id: "Menempatkan bisnis Anda di depan orang yang tepat.", zh: "让您的企业出现在对的人面前。", ja: "あなたのビジネスを、届けるべき相手の目の前へ。" },
    description: { id: "Kami menempatkan bisnis Anda di depan orang yang tepat dan membawa mereka kembali, lewat search, social, konten, email, dan iklan berbayar, dijalankan sebagai satu rencana.", zh: "我们让您的企业出现在对的人面前，并把他们带回来——覆盖搜索、社媒、内容、邮件和付费广告，作为一个整体方案来运作。", ja: "検索、ソーシャル、コンテンツ、メール、有料広告にまたがって、あなたのビジネスを届けるべき相手の前に置き、再び呼び戻します——それらを一つの計画として運用します。" },
    intro: { id: "Kanal-kanal yang membawa orang ke bisnis Anda, direncanakan, diproduksi, dan dikelola di satu tempat.", zh: "为您的企业带来客流的各个渠道，在一个地方完成规划、制作与管理。", ja: "人々をあなたのビジネスへ導くチャネルを、一つの場所で計画し、制作し、運用します。" },
    narrative: [
      { id: "Kami menangani semua kanal secara terpadu, bukan sendiri-sendiri: search, social, konten, email, dan iklan berbayar berjalan dari rencana yang sama, sehingga pesannya tetap konsisten di mana pun orang menemukan Anda.", zh: "我们把各个渠道统一打理，而非各自为政：搜索、社媒、内容、邮件和付费广告都出自同一套方案，因此无论客户在哪里发现您，信息都保持一致。", ja: "私たちは各チャネルをばらばらにではなく、まとめて扱います——検索、ソーシャル、コンテンツ、メール、有料広告はすべて同じ計画から動くため、どこであなたを見つけても、メッセージは一貫しています。" },
      { id: "Pekerjaannya mencakup produksi, bukan sekadar strategi. Kami menulis copy, membuat konten, menyiapkan kampanye, memublikasikan sesuai jadwal, dan melaporkan apa yang terjadi setiap bulan.", zh: "这项工作不只是策略，还包括实际制作。我们撰写文案、制作内容、搭建广告活动、按计划发布，并每月汇报进展。", ja: "この仕事には戦略だけでなく制作も含まれます。私たちはコピーを書き、コンテンツを制作し、キャンペーンを設定し、スケジュール通りに公開し、毎月その成果を報告します。" }
    ],
    capabilities: [
      {
        title: { id: "SEO", zh: "SEO", ja: "SEO" },
        detail: { id: "Muncul di pencarian yang benar-benar diketik calon pembeli Anda.", zh: "让您出现在买家真正会搜的那些词上。", ja: "お客さまが実際に打ち込む検索ワードで、ちゃんと出てくるように。" },
      },
      {
        title: { id: "Pengelolaan media sosial", zh: "社交媒体管理", ja: "ソーシャルメディア運用" },
        detail: { id: "Merencanakan, posting, dan membalas, dengan jadwal yang benar-benar jalan.", zh: "规划、发布、回复留言，按一个真能坚持下去的节奏来。", ja: "企画して、投稿して、返信する。無理なく続く運用ペースで。" },
      },
      {
        title: { id: "Pemasaran konten", zh: "内容营销", ja: "コンテンツマーケティング" },
        detail: { id: "Artikel dan konten yang menjawab pertanyaan yang muncul sebelum orang membeli.", zh: "用文章和素材，回答客户下单之前一定会问的问题。", ja: "購入前に必ず出てくる疑問に答える記事やコンテンツを。" },
      },
      {
        title: { id: "Pemasaran email", zh: "邮件营销", ja: "メールマーケティング" },
        detail: { id: "Newsletter dan rangkaian email yang menjaga Anda tetap ada di inbox mereka.", zh: "定期邮件和自动化邮件序列，让您一直待在客户的收件箱里。", ja: "ニュースレターや自動配信で、受信箱の中に居続けます。" },
      },
      {
        title: { id: "Iklan berbayar (Google, Meta, TikTok)", zh: "付费广告（Google、Meta、TikTok）", ja: "有料広告（Google、Meta、TikTok）" },
        detail: { id: "Kampanye dibuat, dijalankan, lalu disesuaikan berdasarkan angka yang nyata.", zh: "广告投放从搭建、上线到调整，全部照着真实数据走。", ja: "キャンペーンを組んで走らせ、実際の数字を見ながら調整します。" },
      },
      {
        title: { id: "Laporan bulanan", zh: "月度报告", ja: "月次レポート" },
        detail: { id: "Apa yang terjadi, berapa biayanya, dan apa yang kami ubah berikutnya.", zh: "发生了什么、花了多少钱、下一步我们要改什么。", ja: "何が起きて、いくらかかって、次に何を変えるのか。" },
      }
    ],
    process: [
      { title: { id: "Audit", zh: "审查", ja: "監査" }, detail: { id: "Kami meninjau apa yang sedang Anda jalankan, apa yang sudah disiapkan dengan benar, dan di mana celahnya.", zh: "我们审视您当前正在运作的内容、哪些设置得当，以及缺口在哪里。", ja: "現在運用しているもの、正しく設定されている部分、そして不足している箇所を確認します。" } },
      { title: { id: "Rencana", zh: "规划", ja: "計画" }, detail: { id: "Kanal, pesan, dan kalender konten untuk bulan-bulan ke depan, disepakati sebelum apa pun ditayangkan.", zh: "渠道、信息传达，以及未来数月的内容日历，都会在任何内容发布之前达成一致。", ja: "チャネル、メッセージ、そして今後数か月分のコンテンツカレンダーを、何かを公開する前に合意します。" } },
      { title: { id: "Produksi dan publikasi", zh: "制作与发布", ja: "制作と公開" }, detail: { id: "Kami membuat konten, menyusun kampanye, dan menjaga semuanya berjalan sesuai jadwal.", zh: "我们制作内容、搭建广告活动，并让一切按计划持续运转。", ja: "コンテンツを制作し、キャンペーンを組み立て、すべてをスケジュール通りに動かし続けます。" } },
      { title: { id: "Laporkan dan sesuaikan", zh: "报告与调整", ja: "報告と調整" }, detail: { id: "Rangkuman bulanan tentang apa yang terjadi, dan apa yang kami ubah untuk bulan berikutnya.", zh: "每月一份关于进展的解读，以及我们下个月将做出的调整。", ja: "その月に何が起きたか、そして翌月に何を変えるかを、月次でお伝えします。" } }
    ],
    fitFor: { id: "Bisnis yang ingin pemasarannya ditangani secara menyeluruh, bukan memberi brief ke freelancer berbeda untuk setiap kanal.", zh: "适合希望营销工作从头到尾统一交办的企业，而不必为每个渠道分别对接不同的自由职业者。", ja: "チャネルごとに別々のフリーランサーへ依頼するのではなく、マーケティングを一貫して任せたいビジネスに。" },
    cta: {
      problem: { id: "Sudah lelah mengurus pemasaran Anda sendiri?", zh: "厌倦了自己打理营销吗？", ja: "自分でマーケティングを回すことに疲れていませんか？" },
      solution: { id: "Kami merencanakan, memproduksi, dan menjalankannya untuk Anda di setiap kanal. Hubungi kami untuk konsultasi gratis.", zh: "我们为您在每个渠道上规划、制作并运营。欢迎联系我们，获取免费咨询。", ja: "私たちがあらゆるチャネルで、計画し、制作し、運用まで代行します。無料相談はお気軽にお問い合わせください。" }
    }
  },
  {
    title: { id: "Studio Kreatif", zh: "创意工作室", ja: "クリエイティブスタジオ" },
    short: { id: "Tampilan, nuansa, dan aset yang menjadi fondasi brand Anda.", zh: "支撑您品牌运转的视觉、感受与素材。", ja: "ブランドを動かす、見た目・雰囲気・アセット。" },
    description: { id: "Kami memberi bisnis Anda tampilan yang diingat orang, mulai dari identitas brand hingga foto, video, dan aset yang Anda gunakan setiap hari.", zh: "我们为您的企业塑造令人过目不忘的形象，从品牌识别到您日常使用的照片、视频和素材。", ja: "ブランドアイデンティティから、日々使う写真・動画・アセットまで、人々の記憶に残る見た目をあなたのビジネスに与えます。" },
    intro: { id: "Sisi visual dari bisnis: bagaimana tampilannya, bagaimana nuansanya, dan aset yang Anda pakai sehari-hari.", zh: "企业的视觉层面：它看起来如何、传达出怎样的调性，以及您每天使用的素材。", ja: "ビジネスのビジュアル面——どう見えるか、どんな印象を与えるか、そして日々使うアセット。" },
    narrative: [
      { id: "Ini dimulai dari identitas, logo, tipografi, warna, dan aturan penggunaannya, lalu meluas ke segala hal yang dibuat dengannya: template sosial, deck, kemasan, signage, dan materi kampanye.", zh: "这一切从品牌识别开始——标志、字体、色彩，以及它们的使用规范——随后延伸到用它制作的一切：社媒模板、演示文稿、包装、标识牌和活动视觉。", ja: "これはアイデンティティ——ロゴ、書体、色、そしてそれらの使用ルール——から始まり、それを使って作られるすべてへと広がります：ソーシャル用テンプレート、資料、パッケージ、サイン、キャンペーンのアートワーク。" },
      { id: "Fotografi, video, dan motion diproduksi secara in-house sebagai bagian dari sistem yang sama, sehingga apa yang Anda rekam selaras dengan apa yang kami desain, dan Anda berakhir dengan pustaka aset yang benar-benar Anda miliki.", zh: "摄影、视频和动态影像都作为同一套体系的一部分在内部完成，因此您拍摄的内容与我们设计的风格保持一致，最终您将拥有一整套真正属于自己的素材库。", ja: "写真、動画、モーションは同じシステムの一部として社内で制作されるため、撮影したものが私たちのデザインと調和し、最終的に本当にあなたのものと言えるアセットのライブラリが手に入ります。" }
    ],
    capabilities: [
      {
        title: { id: "Branding dan identitas", zh: "品牌塑造与识别", ja: "ブランディングとアイデンティティ" },
        detail: { id: "Logo, tipografi, warna, dan aturan yang menjaga semuanya tetap konsisten.", zh: "标志、字体、色彩，以及让它们保持一致的一套规则。", ja: "ロゴ、書体、色、そしてそれを一貫させるためのルール。" },
      },
      {
        title: { id: "Desain grafis", zh: "平面设计", ja: "グラフィックデザイン" },
        detail: { id: "Deck, kemasan, signage, dan semua yang dicetak atau diposting.", zh: "提案文件、包装、招牌，以及所有要印出来或发出去的东西。", ja: "資料、パッケージ、サイン計画、印刷物から投稿物まで一通り。" },
      },
      {
        title: { id: "Fotografi", zh: "摄影", ja: "写真撮影" },
        detail: { id: "Foto produk, tempat, dan tim, diarahkan dan diambil sendiri oleh tim kami.", zh: "产品、空间、团队的照片，从导演到拍摄都由我们自己来。", ja: "商品、空間、チームの撮影を、ディレクションから撮影まで自社で。" },
      },
      {
        title: { id: "Videografi", zh: "视频摄制", ja: "映像撮影" },
        detail: { id: "Video pendek dan cut untuk social, dari brief sampai grading akhir.", zh: "短片和社交平台剪辑版，从需求沟通一直做到最终调色。", ja: "短編映像もソーシャル用の尺も、ブリーフから最終グレーディングまで。" },
      },
      {
        title: { id: "Motion graphics", zh: "动态图形", ja: "モーショングラフィックス" },
        detail: { id: "Animasi logo, title, dan aset bergerak untuk semua kanal.", zh: "标志动画、字幕条，以及各个渠道都能用的动态素材。", ja: "ロゴアニメーション、タイトル、各チャネル向けの動くアセット。" },
      },
      {
        title: { id: "Aset kreatif", zh: "创意素材", ja: "クリエイティブアセット" },
        detail: { id: "Template dan file mentah yang jadi milik Anda dan bisa dipakai lagi tanpa kami.", zh: "模板和源文件都归您，以后不用找我们也能接着用。", ja: "テンプレートもソースファイルもお渡しするので、こちら抜きでも使い回せます。" },
      }
    ],
    process: [
      { title: { id: "Penggalian", zh: "探索", ja: "ディスカバリー" }, detail: { id: "Kami menentukan apa yang perlu dikomunikasikan brand, dan kepada siapa, sebelum menggambar apa pun.", zh: "在动笔之前，我们先厘清品牌需要传达什么、传达给谁。", ja: "何かを描き始める前に、ブランドが何を、誰に伝えるべきかを明らかにします。" } },
      { title: { id: "Arahan", zh: "方向", ja: "方向性" }, detail: { id: "Dua atau tiga arah visual, ditinjau bersama, sampai satu jelas paling tepat.", zh: "两三个视觉方向，一起评审，直到明确选出最合适的一个。", ja: "二、三通りのビジュアルの方向性を一緒に検討し、明らかに正解と言える一つに絞り込みます。" } },
      { title: { id: "Produksi", zh: "制作", ja: "制作" }, detail: { id: "Identitas, pemotretan, dan aset, dikerjakan hingga tuntas dan siap pakai.", zh: "品牌识别、拍摄和各类素材，全部制作到成品、可直接使用的状态。", ja: "アイデンティティ、撮影、アセットを、完成して使える状態まで仕上げます。" } },
      { title: { id: "Panduan dan serah terima", zh: "规范与交接", ja: "ガイドラインと引き渡し" }, detail: { id: "Anda mendapatkan file, template, dan panduan singkat cara menggunakannya secara konsisten.", zh: "您将获得源文件、模板，以及一份如何保持一致使用的简明指南。", ja: "ファイル、テンプレート、そしてそれらを一貫して使うための簡潔なガイドをお渡しします。" } }
    ],
    fitFor: { id: "Bisnis yang memulai dari nol, melakukan rebranding, atau memiliki kumpulan aset yang tak lagi terlihat menyatu.", zh: "适合从零起步、正在重塑品牌，或手握一堆看起来彼此不再协调的素材的企业。", ja: "ゼロから始めるビジネス、リブランディング中のビジネス、あるいはもはや統一感のないアセットを抱えたビジネスに。" },
    cta: {
      problem: { id: "Apakah brand Anda tampil berbeda-beda di setiap tempat?", zh: "您的品牌在每个出现的地方看起来都不一样吗？", ja: "あなたのブランドは、現れる場所ごとに見た目がばらばらになっていませんか？" },
      solution: { id: "Kami membangun identitasnya dan memproduksi aset yang selaras. Hubungi kami untuk konsultasi gratis.", zh: "我们打造品牌识别，并制作与之匹配的素材。欢迎联系我们，获取免费咨询。", ja: "私たちがアイデンティティを構築し、それに合ったアセットを制作します。無料相談はお気軽にお問い合わせください。" }
    }
  },
  {
    title: { id: "Otomatisasi AI", zh: "AI 自动化", ja: "AI 自動化" },
    short: { id: "Biarkan software menangani pekerjaan yang berulang.", zh: "让软件来处理重复性的工作。", ja: "繰り返しの作業は、ソフトウェアに任せる。" },
    description: { id: "Kami mengambil pekerjaan manual yang berulang dari tim Anda dan menyerahkannya ke software yang menjalankannya diam-diam di latar belakang.", zh: "我们把重复、手动的工作从您的团队手中接过来，交给能在后台悄然运行的软件。", ja: "繰り返しの手作業をチームから引き取り、バックグラウンドで静かに処理するソフトウェアに委ねます。" },
    intro: { id: "Bagian-bagian manual dan berulang dalam menjalankan bisnis, diserahkan ke software yang mengerjakannya diam-diam di latar belakang.", zh: "经营业务中那些重复、手动的环节，都交给在后台默默运行的软件来完成。", ja: "ビジネス運営における繰り返しの手作業を、バックグラウンドで静かにこなすソフトウェアに委ねます。" },
    narrative: [
      { id: "Kami mulai dari tugas yang diulang tim Anda setiap hari: menyalin data antar alat, mengejar update, menjawab pertanyaan yang sama, memindahkan lead dari satu sistem ke sistem berikutnya. Semua itu menjadi alur kerja otomatis yang berjalan berdasarkan pemicu atau jadwal.", zh: "我们从您团队每天重复的任务入手：在不同工具间复制数据、追问进度、回答相同的问题、把一条线索从一个系统转移到下一个。这些都会变成由触发条件或计划时间驱动的自动化工作流。", ja: "まず、チームが毎日繰り返している作業から始めます——ツール間でのデータのコピー、進捗の催促、同じ質問への回答、リードをあるシステムから次のシステムへ移す作業です。それらは、トリガーやスケジュールで動く自動化ワークフローになります。" },
      { id: "Dari sana, cakupannya meluas ke chatbot yang menjawab pelanggan, otomatisasi CRM yang menjaga data tetap mutakhir, dan AI agent yang menyusun draf, mengklasifikasikan, atau meringkas. Semuanya terhubung ke alat yang sudah Anda gunakan, bukan menggantikannya.", zh: "在此基础上，还会延伸到回复客户的聊天机器人、让记录保持最新的 CRM 自动化，以及负责起草、分类或摘要的 AI 智能体。所有这些都与您现有的工具相连，而非取而代之。", ja: "そこから、顧客に応対するチャットボット、記録を最新に保つ CRM 自動化、下書き・分類・要約を行う AI エージェントへと広がります。すべては既存のツールを置き換えるのではなく、それらと連携します。" }
    ],
    capabilities: [
      {
        title: { id: "Otomatisasi alur kerja", zh: "工作流自动化", ja: "ワークフローの自動化" },
        detail: { id: "Langkah-langkah berulang di antara tool Anda, jalan otomatis lewat trigger.", zh: "工具与工具之间那些重复动作，交给触发器自动跑。", ja: "ツールとツールの間で繰り返している作業を、トリガーで自動的に。" },
      },
      {
        title: { id: "Chatbot", zh: "聊天机器人", ja: "チャットボット" },
        detail: { id: "Jawaban untuk pertanyaan yang itu-itu saja, yang tiap hari diketik ulang tim Anda.", zh: "那些团队每天手动重复回答的问题，交给它来答。", ja: "チームが毎日手で打ち直している質問に、代わりに答えます。" },
      },
      {
        title: { id: "Otomatisasi CRM", zh: "CRM 自动化", ja: "CRM 自動化" },
        detail: { id: "Data yang memperbarui dirinya sendiri saat deal benar-benar bergerak.", zh: "商机往前推进时，记录自己就更新好了。", ja: "商談が動けば、記録のほうが勝手に更新されます。" },
      },
      {
        title: { id: "AI agent", zh: "AI 智能体", ja: "AI エージェント" },
        detail: { id: "Menyusun draf, mengelompokkan, dan meringkas, diam-diam di belakang layar.", zh: "起草、分类、总结，都在后台悄悄完成。", ja: "下書き、仕分け、要約を、裏側で静かに片づけます。" },
      },
      {
        title: { id: "Integrasi sistem", zh: "系统集成", ja: "システム連携" },
        detail: { id: "Tool yang sudah Anda pakai dihubungkan, supaya data berhenti diketik ulang.", zh: "把您现有的工具连起来，数据不用再来回手动录入。", ja: "今お使いのツールをつなげて、同じデータの打ち直しをなくします。" },
      },
      {
        title: { id: "AI untuk operasional bisnis", zh: "面向业务运营的 AI", ja: "業務運用のための AI" },
        detail: { id: "Cara pikir yang sama, diterapkan ke apa pun yang bikin bisnis Anda melambat.", zh: "同样的思路，用在任何拖慢业务的环节上。", ja: "同じ考え方を、ビジネスの足を引っぱっている部分にそのまま。" },
      }
    ],
    process: [
      { title: { id: "Amati alur kerja", zh: "跟踪观察流程", ja: "業務の流れを観察する" }, detail: { id: "Kami mengamati bagaimana pekerjaan dilakukan sekarang, langkah demi langkah, sebelum memutuskan apa yang akan diotomatiskan.", zh: "在决定要自动化什么之前，我们先一步步观察当前的工作是如何完成的。", ja: "何を自動化するかを決める前に、今どのように作業が行われているかを一つひとつ観察します。" } },
      { title: { id: "Pilih alur kerja pertama", zh: "选定第一个流程", ja: "最初のワークフローを選ぶ" }, detail: { id: "Kami mulai dari satu proses yang berulang dan jelas, bukan semuanya sekaligus.", zh: "我们从一个重复且定义清晰的流程开始，而非一次性铺开所有事情。", ja: "すべてを一度にではなく、繰り返しが多く定義の明確な一つのプロセスから始めます。" } },
      { title: { id: "Bangun dan hubungkan", zh: "搭建与连接", ja: "構築して連携する" }, detail: { id: "Kami membangun otomatisasinya dan menyambungkannya ke alat yang sudah ada, lengkap dengan peringatan error.", zh: "我们搭建自动化流程，并将其接入您现有的工具，同时配置好错误告警。", ja: "自動化を構築し、既存のツールに接続したうえで、エラー通知も設定します。" } },
      { title: { id: "Serah terima dan perluas", zh: "交接与拓展", ja: "引き渡しと拡張" }, detail: { id: "Anda mendapatkan dokumentasi dan pemantauan, lalu kami menambahkan alur kerja berikutnya setelah yang pertama stabil.", zh: "您将获得文档和监控，待第一个流程稳定运行后，我们再添加下一个。", ja: "ドキュメントとモニタリングをお渡しし、最初のワークフローが安定したら、次のものを追加します。" } }
    ],
    fitFor: { id: "Tim yang melakukan langkah manual yang sama setiap hari, atau pemilik bisnis yang ingin sebuah proses ditangani sebelum merekrut orang untuk mengerjakannya.", zh: "适合每天重复相同手动步骤的团队，或是希望在招人处理某项流程之前先将其自动化的企业主。", ja: "毎日同じ手作業を繰り返しているチーム、あるいは人を雇う前にそのプロセスを片付けておきたい経営者に。" },
    cta: {
      problem: { id: "Terkubur dalam pekerjaan manual yang berulang?", zh: "被重复、手动的工作压得喘不过气？", ja: "繰り返しの手作業に埋もれていませんか？" },
      solution: { id: "Kami membangun otomatisasi yang menanganinya diam-diam di latar belakang. Hubungi kami untuk konsultasi gratis.", zh: "我们打造在后台默默处理这一切的自动化流程。欢迎联系我们，获取免费咨询。", ja: "私たちが、それをバックグラウンドで静かに処理する自動化を構築します。無料相談はお気軽にお問い合わせください。" }
    }
  },
  {
    title: { id: "Pertumbuhan & Analitik", zh: "增长与分析", ja: "グロース＆アナリティクス" },
    short: { id: "Mengetahui apa yang berhasil, dan apa yang tidak.", zh: "弄清什么在起作用，什么没有。", ja: "何が効いていて、何が効いていないのかを知る。" },
    description: { id: "Kami membuat angka Anda masuk akal, melacak apa yang benar-benar terjadi, melaporkannya dengan bahasa sederhana, dan memperbaiki hal yang penting.", zh: "我们让您的数据变得有意义——追踪真实发生的情况，用通俗的语言汇报，并改善真正重要的环节。", ja: "数字に意味を持たせます——実際に何が起きているかを計測し、分かりやすい言葉で報告し、重要なところを改善します。" },
    intro: { id: "Lapisan pengukuran: apa yang harus dilacak, di mana ia muncul, dan apa artinya untuk keputusan berikutnya.", zh: "衡量的那一层：追踪什么、在哪里呈现，以及它对下一个决策意味着什么。", ja: "計測のレイヤー——何を追い、それがどこに表れ、次の意思決定にとって何を意味するのか。" },
    narrative: [
      { id: "Kebanyakan bisnis sudah mengumpulkan data tetapi tidak membacanya. Kami menyiapkan tracking dengan benar terlebih dahulu, analitik, event, dan goal, agar angkanya mencerminkan apa yang benar-benar terjadi di situs dan kampanye Anda.", zh: "大多数企业其实已经在收集数据，却没有去解读。我们先把追踪设置妥当——分析、事件和目标——让数字如实反映您网站和广告活动中真正发生的情况。", ja: "多くのビジネスはすでにデータを集めていながら、それを読み解いていません。私たちはまずトラッキングを正しく設定し——アナリティクス、イベント、ゴール——数字がサイトやキャンペーンで実際に起きていることを反映するようにします。" },
      { id: "Itu menyuplai dashboard yang bisa Anda buka kapan saja, laporan bulanan yang ditulis dengan bahasa sederhana, dan daftar berjalan berisi hal-hal yang layak diuji atau diubah pada halaman yang paling penting.", zh: "这些数据会汇入一个您随时可以打开的看板、一份用通俗语言撰写的月度报告，以及一份不断更新的清单，列出最重要的页面上值得测试或调整的地方。", ja: "それが、いつでも開けるダッシュボード、分かりやすい言葉で書かれた月次レポート、そして最も重要なページで試したり変えたりする価値のある項目の随時更新リストに反映されます。" }
    ],
    capabilities: [
      {
        title: { id: "Penyiapan tracking", zh: "追踪配置", ja: "トラッキングの設定" },
        detail: { id: "Analytics, event, dan goal disetel supaya angkanya benar-benar berarti.", zh: "配置好分析工具、事件和目标，让数字真的有意义。", ja: "アナリティクス、イベント、ゴールを設定して、数字に意味を持たせます。" },
      },
      {
        title: { id: "Dashboard", zh: "数据看板", ja: "ダッシュボード" },
        detail: { id: "Satu tempat yang tinggal dibuka kalau Anda ingin tahu situasinya.", zh: "想知道现在情况如何，打开这一个地方就够了。", ja: "今どうなっているか知りたいとき、開く場所はここ一つ。" },
      },
      {
        title: { id: "Pelaporan", zh: "报告", ja: "レポーティング" },
        detail: { id: "Ulasan tertulis tiap bulan dengan bahasa yang jelas, bukan tumpukan data.", zh: "每月一份用大白话写的解读，而不是一堆数据。", ja: "毎月、わかる言葉で書いた読み解きを。数字の羅列ではなく。" },
      },
      {
        title: { id: "Optimasi konversi", zh: "转化优化", ja: "コンバージョン最適化" },
        detail: { id: "Perubahan di halaman-halaman yang menentukan orang jadi bertindak atau tidak.", zh: "在那些决定客户会不会行动的页面上做改动。", ja: "行動するかどうかを左右するページに、手を入れていきます。" },
      },
      {
        title: { id: "Tinjauan performa", zh: "绩效评估", ja: "パフォーマンスレビュー" },
        detail: { id: "Duduk bareng melihat angkanya, lalu menyepakati langkah berikutnya.", zh: "坐下来一起看数字，把下一步定下来。", ja: "数字を前に一緒に座って、次の一手を決めます。" },
      }
    ],
    process: [
      { title: { id: "Audit tracking", zh: "追踪审查", ja: "トラッキング監査" }, detail: { id: "Kami memeriksa apa yang sedang diukur saat ini, dan apa yang tercatat secara keliru.", zh: "我们检查当前正在衡量哪些指标，以及哪些数据记录有误。", ja: "現在何が計測されているか、そして何が誤って記録されているかを確認します。" } },
      { title: { id: "Siapkan pengukuran", zh: "搭建衡量体系", ja: "計測を設定する" }, detail: { id: "Analitik, event, dan goal dikonfigurasi agar setiap angka mengacu pada sesuatu yang nyata.", zh: "配置好分析、事件与目标，让每一个数字都对应真实发生的事情。", ja: "アナリティクス、イベント、ゴールを設定し、各数字が現実の何かと対応するようにします。" } },
      { title: { id: "Dashboard dan pelaporan", zh: "看板与报告", ja: "ダッシュボードとレポート" }, detail: { id: "Satu tempat untuk melihat performa, plus laporan tertulis bulanan tentang maknanya.", zh: "一个集中查看绩效的地方，外加一份每月撰写的解读报告。", ja: "パフォーマンスを一か所で見られる場所と、その内容を毎月書き起こした解説。" } },
      { title: { id: "Tinjau dan optimalkan", zh: "评估与优化", ja: "レビューと最適化" }, detail: { id: "Kami menyepakati apa yang akan diubah atau diuji berikutnya, lalu mengukur apakah itu membawa perbedaan.", zh: "我们共同确定接下来要改动或测试什么，然后衡量它是否带来了变化。", ja: "次に何を変えるか、あるいは試すかを合意し、それが効果をもたらしたかどうかを計測します。" } }
    ],
    fitFor: { id: "Bisnis yang sudah mengeluarkan biaya untuk pemasaran atau website dan ingin tahu apa hasil sebenarnya.", zh: "适合已经在营销或网站上投入、想知道这些投入究竟带来什么成效的企业。", ja: "すでにマーケティングやウェブサイトに費用をかけていて、それが実際に何をもたらしているかを知りたいビジネスに。" },
    cta: {
      problem: { id: "Tidak yakin bagian mana dari pemasaran Anda yang benar-benar berhasil?", zh: "不确定您营销中的哪一部分真正在起作用？", ja: "マーケティングのどの部分が実際に効いているのか、はっきりしませんか？" },
      solution: { id: "Kami menyiapkan tracking-nya dan melaporkannya dengan bahasa sederhana. Hubungi kami untuk konsultasi gratis.", zh: "我们搭建追踪体系，并用通俗的语言进行汇报。欢迎联系我们，获取免费咨询。", ja: "私たちがトラッキングを設定し、分かりやすい言葉で報告します。無料相談はお気軽にお問い合わせください。" }
    }
  },
  {
    title: { id: "Layanan Terkelola", zh: "托管服务", ja: "マネージドサービス" },
    short: { id: "Menjaga semuanya tetap berjalan setelah peluncuran.", zh: "在上线之后，让一切持续稳定运行。", ja: "公開後も、すべてを動かし続ける。" },
    description: { id: "Kami menjaga semua yang sudah Anda bangun tetap berjalan, terbarui, aman, dan terpantau, sehingga tidak pernah rusak diam-diam.", zh: "我们让您已经搭建好的一切持续运行、保持更新、安全无虞并受到监控，绝不让它悄然出故障。", ja: "すでに構築したすべてを、稼働・更新・安全・監視の状態に保ち、いつの間にか壊れてしまうことを防ぎます。" },
    intro: { id: "Perawatan berkelanjutan untuk semua yang sudah tayang: situs, server, dan sistem di baliknya.", zh: "为所有已上线的部分提供持续的照护：网站、服务器，以及它们背后的系统。", ja: "すでに稼働しているすべて——サイト、サーバー、その背後のシステム——への継続的なケア。" },
    narrative: [
      { id: "Peluncuran bukanlah akhir dari pekerjaan. Software perlu diperbarui, server perlu dipantau, sertifikat kedaluwarsa, dan segala sesuatu bisa rusak di waktu yang tidak tepat. Ini menangani semuanya secara berkelanjutan.", zh: "上线并不是工作的终点。软件需要更新、服务器需要看护、证书会过期，而故障总在最不凑巧的时候发生。这项服务会长期打理好这一切。", ja: "公開は仕事の終わりではありません。ソフトウェアは更新が必要で、サーバーは見守りが必要で、証明書は期限切れになり、物事は都合の悪いときに壊れます。これらすべてを継続的にカバーします。" },
      { id: "Itu berarti pembaruan dan backup terjadwal, pemantauan uptime dan keamanan dengan peringatan, serta seseorang untuk dihubungi saat ada masalah, bukan mencari bantuan dari awal setiap kali.", zh: "这意味着定期的更新与备份、带告警的正常运行时间及安全监控，以及出现问题时有专人可以联系，而不必每次都从头去找人帮忙。", ja: "つまり、定期的な更新とバックアップ、通知付きの稼働状況・セキュリティ監視、そして問題が起きたときに毎回助けを探し始めるのではなく、連絡できる担当者がいるということです。" }
    ],
    capabilities: [
      {
        title: { id: "Pemeliharaan web", zh: "网站维护", ja: "Web の保守" },
        detail: { id: "Update dan perbaikan berjalan sesuai jadwal, bukan pas sudah panik.", zh: "更新和修复按计划来，而不是等出事了才手忙脚乱。", ja: "アップデートも修正も、慌ててではなく決まった周期で。" },
      },
      {
        title: { id: "Pengelolaan server", zh: "服务器管理", ja: "サーバー管理" },
        detail: { id: "Server tempat website Anda jalan, dijaga tetap update dan sehat.", zh: "支撑网站运行的那台服务器，保持更新、保持健康。", ja: "サイトが動いているサーバーを、最新で健全な状態に保ちます。" },
      },
      {
        title: { id: "Keamanan", zh: "安全防护", ja: "セキュリティ" },
        detail: { id: "Sertifikat, patch, dan pengamanan, dipantau terus-menerus.", zh: "证书、补丁和安全加固，持续盯着。", ja: "証明書、パッチ、堅牢化まで、ずっと見張っています。" },
      },
      {
        title: { id: "Pembaruan", zh: "更新", ja: "アップデート" },
        detail: { id: "Software selalu dijaga di versi terbaru, biar tidak diam-diam jadi rusak.", zh: "软件始终保持最新，免得哪天悄无声息地坏掉。", ja: "ソフトウェアを常に最新に保ち、気づかないうちに壊れるのを防ぎます。" },
      },
      {
        title: { id: "Pemantauan", zh: "监控", ja: "モニタリング" },
        detail: { id: "Uptime dan performa dicek 24 jam, alert-nya masuk ke kami.", zh: "全天候检查可用性和性能，告警直接发到我们这边。", ja: "稼働状況とパフォーマンスを24時間チェックし、アラートは私たちへ。" },
      },
      {
        title: { id: "Backup", zh: "备份", ja: "バックアップ" },
        detail: { id: "Backup rutin yang benar-benar diuji, supaya hari buruk tetap jadi masalah kecil.", zh: "定期备份并实测能恢复，让倒霉的一天只是小事一桩。", ja: "定期的なバックアップを、復元テストまで。最悪の日も小事で済みます。" },
      },
      {
        title: { id: "Dukungan teknis", zh: "技术支持", ja: "テクニカルサポート" },
        detail: { id: "Jalur langsung kalau ada yang rusak atau Anda butuh perubahan.", zh: "出问题或者要改东西，有一条直接找到人的通道。", ja: "何か壊れたときも、変更が必要なときも、直接つながる窓口を。" },
      }
    ],
    process: [
      { title: { id: "Ambil alih", zh: "接手", ja: "引き継ぎ" }, detail: { id: "Kami mengaudit apa yang ada, memperoleh akses yang tepat, dan mendokumentasikan bagaimana semuanya disiapkan saat ini.", zh: "我们审查现有内容，取得适当的访问权限，并记录当前的配置情况。", ja: "既存のものを監査し、適切なアクセス権を得て、現在の設定内容を文書化します。" } },
      { title: { id: "Stabilkan", zh: "稳固", ja: "安定化" }, detail: { id: "Pembaruan, backup, dan keamanan dibawa ke kondisi terkini sebelum hal lain dijadwalkan.", zh: "在安排其他事项之前，先把更新、备份和安全都更新到最新状态。", ja: "他の予定を組む前に、更新・バックアップ・セキュリティを最新の状態にします。" } },
      { title: { id: "Pantau", zh: "监控", ja: "監視" }, detail: { id: "Uptime, performa, dan keamanan dipantau terus-menerus, dengan peringatan diarahkan ke kami.", zh: "持续监控正常运行时间、性能与安全，并将告警发送给我们。", ja: "稼働状況、パフォーマンス、セキュリティを継続的に監視し、アラートは私たちに届くようにします。" } },
      { title: { id: "Dukungan", zh: "支持", ja: "サポート" }, detail: { id: "Jalur langsung untuk masalah dan permintaan, disertai catatan rutin tentang apa yang telah dikerjakan.", zh: "一条直接沟通问题与需求的通道，并定期附上已完成事项的说明。", ja: "問題やご要望のための直接の窓口と、実施した内容についての定期的な報告。" } }
    ],
    fitFor: { id: "Bisnis yang sudah memiliki situs atau sistem yang berjalan namun tidak ada yang bertanggung jawab menjaganya tetap sehat.", zh: "适合已有网站或系统在运行、却没有人负责维护其健康状态的企业。", ja: "すでにサイトやシステムが稼働しているのに、その健全さを保つ担当者がいないビジネスに。" },
    cta: {
      problem: { id: "Apakah benar-benar ada yang mengurus website Anda?", zh: "真的有人在照看您的网站吗？", ja: "あなたのウェブサイトを、実際に誰かが見守っていますか？" },
      solution: { id: "Kami memelihara, memantau, mengamankan, dan mendukungnya. Hubungi kami untuk konsultasi gratis.", zh: "我们负责维护、监控、保障安全并提供支持。欢迎联系我们，获取免费咨询。", ja: "私たちが保守・監視・セキュリティ確保・サポートを行います。無料相談はお気軽にお問い合わせください。" }
    }
  }
];

/**
 * Keyed by project slug rather than array index: the works list gets
 * reordered and pruned regularly, and index alignment silently attaches a
 * translation to the wrong project when that happens.
 */
const PROJECT_TX: Record<string, ProjectTx> = {
  "jalak-cargo-logistics": {
    title: { id: "Program Sosial & Konten", zh: "社交与内容运营", ja: "ソーシャル＆コンテンツ運用" },
    blurb: { id: "Freight forwarder di Bali dan Jakarta", zh: "巴厘岛与雅加达的货运代理", ja: "バリとジャカルタのフレイトフォワーダー" },
    description: { id: "Program sosial always-on untuk sebuah freight forwarder Indonesia. Tiap posting menjawab satu pertanyaan pengiriman yang nyata, dalam satu sistem visual, terbit sesuai jadwal, sementara situsnya dijaga tetap terkini di sampingnya.", zh: "为一家印尼货运代理做的持续社交运营。每一条内容回答一个真实的物流问题，统一在一套视觉体系里，按计划发布，同时把网站一起维护到最新。", ja: "インドネシアのフレイトフォワーダーのための、常時稼働のソーシャル運用です。すべての投稿が実際の輸送の疑問に一つ答え、一つのビジュアルシステムのなかで、決まった間隔で公開されます。そのかたわらでサイトも最新に保ちます。" },
    longDescription: { id: "Jalak Kargo Logistik mengangkut kargo lewat laut, udara, dan darat dari Bali, Jakarta, Semarang, dan Yogyakarta. Berdiri sejak 2019, mereka menjual sebelas layanan ke dua audiens yang sangat berbeda: eksportir yang tahu persis apa itu LCL consolidation, dan pengirim pertama kali yang belum tahu. Onyx menjalankan sisi sosialnya: feed di mana tiap posting mengambil satu pertanyaan yang benar-benar ditanyakan pelanggan, menjawabnya dengan lugas, dan terlihat berasal dari perusahaan yang sama dengan posting sebelumnya.", zh: "Jalak Kargo Logistik 从巴厘岛、雅加达、三宝垄和日惹发出，经海、空、陆运送货物。公司成立于 2019 年，把十一项服务卖给两类完全不同的人：清楚知道什么叫拼箱拼柜的出口商，和第一次发货、什么都还不懂的人。Onyx 负责其中的社交这一块：一条内容拿起一个客户真的会问的问题，直白地答完，并且看上去和上一条出自同一家公司。", ja: "Jalak Kargo Logistik は、バリ、ジャカルタ、スマラン、ジョグジャカルタから海・空・陸で貨物を運びます。2019 年の創業以来、十一のサービスをまったく異なる二つの層に提供してきました。LCL コンソリデーションが何かを正確に知っている輸出業者と、そうでない初めての荷主です。Onyx はそのソーシャル側を担っています。一つの投稿が、顧客が実際に尋ねる問いを一つ取り上げ、率直に答え、前の投稿と同じ会社から来たものに見える。そういうフィードです。" },
    location: { id: "Bali · Jakarta · Indonesia", zh: "巴厘岛 · 雅加达 · 印尼", ja: "バリ · ジャカルタ · インドネシア" },
    scope: [
      { id: "Program Instagram always-on di @jalakkargo", zh: "在 @jalakkargo 上的持续 Instagram 运营", ja: "@jalakkargo での常時稼働の Instagram 運用" },
      { id: "Sistem desain posting untuk seluruh rangkaian layanan", zh: "覆盖全部服务的贴文设计体系", ja: "全サービスをカバーする投稿デザインシステム" },
      { id: "Produksi konten foto dan video di gudang dan pelabuhan", zh: "在仓库和港口拍摄图片与视频内容", ja: "倉庫と港での写真・動画コンテンツ制作" },
      { id: "Kalender editorial dan jadwal penerbitan", zh: "内容日历与发布排期", ja: "編集カレンダーと公開スケジュール" },
      { id: "Pemeliharaan website, pembaruan, dan perawatan konten", zh: "网站维护、更新与内容保养", ja: "サイトの保守・更新・コンテンツの手入れ" },
      { id: "Pelaporan performa untuk jangkauan dan pertanyaan masuk", zh: "触达与咨询量的效果报告", ja: "リーチと問い合わせのパフォーマンスレポート" },
    ],
    tags: [
      { id: "Instagram", zh: "Instagram", ja: "Instagram" },
      { id: "Konten", zh: "内容", ja: "コンテンツ" },
      { id: "Pemeliharaan", zh: "维护", ja: "メンテナンス" },
    ],
    study: {
      overview: { id: "Jalak Cargo Logistics adalah freight forwarder yang berkantor pusat di Bali dengan cabang di Jakarta, Semarang, dan Yogyakarta, mengangkut kargo lewat laut, udara, dan darat sejak 2019. Onyx menjalankan Instagram mereka, memproduksi konten foto dan video di baliknya, dan menjaga websitenya tetap terkini. Feed-nya jadi pintu depan: sebelas layanan dijelaskan satu pertanyaan per posting, terjadwal, dalam satu sistem visual.", zh: "Jalak Cargo Logistics 是一家总部在巴厘岛的货运代理公司，在雅加达、三宝垄和日惹设有分部，自 2019 年起经营海运、空运和陆运。Onyx 负责运营他们的 Instagram、拍摄背后的图片与视频内容，并让网站保持更新。这个动态就是他们的正门：十一项服务，一条内容回答一个问题，按计划发布，统一在一套视觉体系里。", ja: "Jalak Cargo Logistics はバリに本社を置くフレイトフォワーダーで、ジャカルタ、スマラン、ジョグジャカルタに支店を持ち、2019 年から海・空・陸の輸送を手がけています。Onyx は同社の Instagram を運用し、その背後にある写真と動画を制作し、ウェブサイトを最新に保っています。フィードは正面玄関です。十一のサービスを、一投稿につき一つの問いで、決まった間隔で、一つのビジュアルシステムのなかで説明していきます。" },
      needed: [
        { id: "Sebelas layanan, dan tidak ada penjelasan berbahasa sederhana untuk satu pun, di mana pun yang bisa diakses publik.", zh: "十一项服务，却没有一项在公开的地方有一句人话解释。", ja: "十一のサービスがあるのに、そのどれについても平易な説明が公開された場所にありませんでした。" },
        { id: "Pengirim pertama kali menanyakan hal yang sama sebelum tiap penawaran: FCL atau LCL, laut atau udara, CBM itu apa.", zh: "第一次发货的人，每次报价前都问同样的问题：整柜还是拼箱、走海运还是空运、CBM 到底是什么。", ja: "初めて発送する人は見積もりのたびに同じことを尋ねました。FCL か LCL か、海か空か、CBM とは何か。" },
        { id: "Posting keluar saat ada yang sempat, jadi feed-nya tidak punya ritme dan tampilannya tidak konsisten.", zh: "谁有空谁就发，所以动态既没有节奏，看起来也不统一。", ja: "誰かの手が空いたときに投稿していたので、フィードにリズムがなく、見た目も揃っていませんでした。" },
        { id: "Gudang, pelabuhan, dan pengerjaan crating tidak pernah difoto, jadi tidak ada yang menunjukkan bagaimana kargo benar-benar ditangani.", zh: "仓库、港口和打木箱的过程从没被拍下来，所以没有任何东西能说明货究竟是怎么被处理的。", ja: "倉庫も港も木枠づくりの作業も撮影されておらず、貨物が実際どう扱われているかを示すものがありませんでした。" },
      ],
      did: [
        { id: "Membangun sistem posting yang membawa brand-nya ke tiap layanan, jadi grid-nya terbaca sebagai satu perusahaan.", zh: "做了一套贴文体系，把品牌带进每一项服务，让整个九宫格看起来是同一家公司。", ja: "すべてのサービスにブランドを行き渡らせる投稿システムを構築し、グリッドが一つの会社として読めるように。" },
        { id: "Menulis feed-nya berdasarkan pertanyaan yang benar-benar ditanyakan pelanggan, satu per posting.", zh: "按客户真正会问的问题来写内容，一条一个问题。", ja: "顧客が実際に尋ねる問いを軸にフィードを設計。一投稿につき一つ。" },
        { id: "Memproduksi konten foto dan video di lokasi: gudang, crating, forklift, pelabuhan.", zh: "在现场拍摄图片和视频：仓库、打包、叉车、码头。", ja: "現場で写真と動画を制作。倉庫、木枠づくり、フォークリフト、港。" },
        { id: "Menaruh seluruh rangkaian layanan di kalender editorial dan menerbitkannya sesuai jadwal.", zh: "把全部服务排进内容日历，按计划发布。", ja: "サービス全体を編集カレンダーに載せ、スケジュール通りに公開。" },
        { id: "Mengambil alih pemeliharaan website dan pembaruan kontennya supaya situs dan feed-nya tetap sejalan.", zh: "接手网站维护和内容更新，让网站和动态保持同步。", ja: "サイト保守とコンテンツ更新を引き受け、サイトとフィードの歩調を揃えました。" },
      ],
      changed: [
        { id: "Feed-nya menjawab pertanyaan sebelum penawaran, bahkan sebelum ada yang perlu bertanya.", zh: "在报价之前会被问到的问题，动态已经先答完了，不用谁开口。", ja: "見積もり前に出る疑問に、誰かが尋ねる前からフィードが答えています。" },
        { id: "Tiap layanan sekarang punya penjelasan publik dalam bahasa yang sederhana.", zh: "现在每一项服务都有一段公开的、说人话的解释。", ja: "いまはどのサービスにも、平易な言葉の公開された説明があります。" },
        { id: "Grid-nya terlihat seperti satu perusahaan, bukan folder berisi unggahan yang tak berhubungan.", zh: "九宫格看起来像同一家公司，而不是一堆互不相关的上传。", ja: "グリッドは、脈絡のないアップロードの寄せ集めではなく、一つの会社に見えます。" },
        { id: "Situs dan sosialnya membawa penawaran yang sama, karena studio yang menjalankannya sama.", zh: "网站和社交传达的是同一套东西，因为跑它们的是同一家工作室。", ja: "サイトとソーシャルが同じ提供内容を伝えます。運用しているスタジオが同じだからです。" },
      ],
    },
  },
  "radcruiters": {
    study: {
      overview: { id: "RADcruiters adalah agensi recruitment marketing di Belanda yang menjalankan kampanye Meta ads untuk agensi staffing. Klien mengirim brief kampanye baru lewat form WordPress. Di balik form itu ada pipeline Make.com yang membaca brief-nya, mengenali kliennya, membuat item kerjanya, menyusun kampanyenya, lalu melaporkan balik lewat dashboard yang memang dipakai para recruiter.", zh: "RADcruiters 是荷兰一家招聘营销代理商，为人力公司投放 Meta 广告。客户通过一个 WordPress 表单提交新的活动简报。表单背后是一条 Make.com 流水线：读简报、认出客户、建好工单、搭起活动，再通过招聘顾问真正会用的看板反馈回来。", ja: "RADcruiters は、人材紹介会社向けに Meta 広告キャンペーンを運用するオランダの採用マーケティングエージェンシーです。クライアントは WordPress のフォームから新しいキャンペーンのブリーフを送ります。そのフォームの裏には Make.com のパイプラインがあり、ブリーフを読み、クライアントを特定し、作業項目を作り、キャンペーンを組み立て、リクルーターが実際に使うダッシュボードへ結果を返します。" },
      needed: [
        { id: "Tiap brief kampanye datang sebagai ping di Slack yang harus ada orang tangkap.", zh: "每一份活动简报都是 Slack 上的一声提醒，得有人接住。", ja: "キャンペーンのブリーフは毎回 Slack の通知として届き、誰かが拾う必要がありました。" },
        { id: "URL lowongannya diurai manual untuk mencari tahu domainnya.", zh: "职位链接要靠人手拆开，才能看出是哪个域名。", ja: "求人 URL は手作業で解析し、ドメインを割り出していました。" },
        { id: "Kliennya harus dicari manual sebelum pekerjaan bisa dimulai.", zh: "开工之前，还得先手动查出是哪个客户。", ja: "作業を始める前に、クライアントを手で調べる必要がありました。" },
        { id: "Kartu Trello dibuat manual, jadi brief menunggu sampai ada orang yang senggang.", zh: "Trello 卡片是手动建的，所以简报只能等到有人腾出手。", ja: "Trello のカードは手作業で作られ、ブリーフは誰かの手が空くのを待っていました。" },
      ],
      did: [
        { id: "Membangun form intake WordPress untuk brief kampanye dari klien.", zh: "搭建了 WordPress 上的活动简报接收表单。", ja: "クライアントのキャンペーンブリーフを受け付ける WordPress フォームを構築。" },
        { id: "Membangun pipeline Make.com: custom webhook ke Trello ke Airtable ke Gmail.", zh: "搭好 Make.com 流水线：自定义 webhook 到 Trello 到 Airtable 再到 Gmail。", ja: "Make.com のパイプラインを構築。カスタム Webhook から Trello、Airtable、Gmail へ。" },
        { id: "Menambahkan ekstraksi domain dan pencocokan klien dari URL lowongan yang dikirim.", zh: "加上了从提交的职位链接里提取域名并匹配客户的步骤。", ja: "送信された求人 URL からドメインを抽出し、クライアントを照合する処理を追加。" },
        { id: "Mengotomatiskan pembuatan kampanye Meta langsung dari brief yang masuk.", zh: "把 Meta 活动的创建直接自动接到提交进来的简报上。", ja: "届いたブリーフからそのまま Meta キャンペーンを自動生成。" },
        { id: "Membangun dashboard recruiter untuk pelacakan kandidat dan pelaporan, lengkap dengan riwayat eksekusi dan pemantauan error.", zh: "做了招聘顾问用的看板，跟踪候选人、出报表，还带执行记录和错误监控。", ja: "候補者の追跡とレポーティングのためのリクルーター向けダッシュボードを、実行履歴とエラー監視つきで構築。" },
      ],
      changed: [
        { id: "Dari submit sampai kartu yang tepat di depan orang yang tepat, hitungan detik.", zh: "从提交到正确的卡片摆在正确的人面前，只要几秒。", ja: "送信から、適切なカードが適切な人の前に出るまで、数秒です。" },
        { id: "Tidak ada lagi yang mengurai URL atau mencari klien secara manual.", zh: "再也没有人需要手动拆链接或者查客户。", ja: "URL を解析したりクライアントを調べたりする手作業は、もうありません。" },
        { id: "Kampanye tersusun dari brief-nya tanpa perlu langkah setup terpisah.", zh: "活动直接从简报里搭起来，不用再单独走一遍设置。", ja: "キャンペーンはブリーフからそのまま組み上がり、別途セットアップの手順は要りません。" },
        { id: "Recruiter melihat kandidat dan laporannya di satu dashboard, bukan mengejar update.", zh: "招聘顾问在一个看板里就能看到候选人和报表，不用再追着要进度。", ja: "リクルーターは候補者もレポートも一つのダッシュボードで見られ、進捗を追いかける必要がなくなりました。" },
      ],
    },
    title: { id: "Otomasi Permintaan Kampanye", zh: "活动申请自动化", ja: "キャンペーン申請の自動化" },
    blurb: { id: "Agensi pemasaran rekrutmen di EU", zh: "位于 EU 的招聘营销代理机构", ja: "EU の採用マーケティングエージェンシー" },
    category: { id: "Otomatisasi AI", zh: "AI 自动化", ja: "AI 自動化" },
    description: {
      id: "Intake yang mengarahkan dirinya sendiri untuk brief kampanye baru. Sebuah form WordPress memicu pipeline Make.com yang mengekstrak domain, mencocokkan klien di Airtable, mengantrekan task Trello, lalu mengirim email ke tim dan klien, tuntas dalam hitungan detik.",
      zh: "新活动简报的自动分流受理。WordPress 表单接入 Make.com 流程，自动提取域名、在 Airtable 中匹配客户、在 Trello 中排入任务，并向团队和客户发送邮件，整个过程几秒内完成。",
      ja: "新しいキャンペーンブリーフを自動で振り分けて受け付けます。WordPress のフォームが Make.com のパイプラインを起動し、ドメインを抽出し、Airtable でクライアントを照合し、Trello にタスクを積み、チームとクライアントへメールを送信。すべてが数秒で完結します。"
    },
    longDescription: {
      id: "RADcruiters menjalankan kampanye rekrutmen berbasis Meta-ads untuk agensi penyedia tenaga kerja, layanan yang sangat personal dengan volume intake tinggi. Form permintaan kampanye sudah jadi penghambat: setiap brief memberi notifikasi ke tim di Slack, seseorang mengurai URL secara manual, mencari kliennya, lalu membuat kartu Trello. Kami membangun ulang intake-nya sebagai pipeline yang mengarahkan dirinya sendiri. Dari kiriman, dalam hitungan detik, ke orang yang tepat yang melihat kartu yang tepat dengan konteks yang tepat, dan klien langsung mendapat konfirmasi yang berbunyi 'kami sudah menerimanya.'",
      zh: "RADcruiters 为人力中介机构运营基于 Meta 广告的招聘活动，这是一项高频受理、需要大量人工跟进的服务。活动申请表单一度成了瓶颈：每份简报都会在 Slack 里通知团队，得有人手动解析 URL、查找客户，再创建 Trello 卡片。我们把整个受理流程重建为自动分流的管线。从提交到正确的人看到带有正确背景信息的正确卡片，只需几秒，客户也会立刻收到一条确认——「我们已经收到了」。",
      ja: "RADcruiters は人材紹介会社向けに Meta 広告の採用キャンペーンを運用しており、手厚い対応と大量の受付を伴うサービスです。キャンペーン申請フォームはボトルネックになっていました。ブリーフが届くたびに Slack でチームに通知が飛び、誰かが手作業で URL を解析し、クライアントを調べ、Trello カードを作成する。私たちはこの受付を、自動で振り分けるパイプラインとして作り直しました。送信から数秒で、適切な担当者が適切な文脈のついた適切なカードを目にし、クライアントには「受け取りました」という確認が即座に届きます。"
    },
    scope: [
      { id: "Form intake WordPress untuk brief kampanye klien", zh: "用于接收客户活动简报的 WordPress 表单", ja: "クライアントのキャンペーンブリーフを受け付ける WordPress フォーム" },
      { id: "Pipeline Make.com (webhook khusus → Trello → Airtable → Gmail)", zh: "Make.com 流程（自定义 webhook → Trello → Airtable → Gmail）", ja: "Make.com のパイプライン（カスタム webhook → Trello → Airtable → Gmail）" },
      { id: "Ekstraksi domain + pencocokan klien dari URL lowongan", zh: "从职位空缺 URL 中提取域名并匹配客户", ja: "求人 URL からのドメイン抽出とクライアント照合" },
      { id: "Pembuatan otomatis task Trello lengkap dengan data brief", zh: "自动创建包含完整简报数据的 Trello 任务", ja: "ブリーフの全データを含む Trello タスクを自動作成" },
      { id: "Notifikasi tim + email konfirmasi klien", zh: "团队通知 + 客户确认邮件", ja: "チームへの通知 + クライアントへの確認メール" },
      { id: "Selalu aktif dengan riwayat eksekusi dan pemantauan error", zh: "全天候运行，附带执行历史与错误监控", ja: "実行履歴とエラー監視を備えた常時稼働" }
    ],
    location: { id: "Netherlands · EU", zh: "Netherlands · EU", ja: "Netherlands · EU" },
    tags: [
      { id: "Alur Kerja", zh: "工作流", ja: "ワークフロー" },
      { id: "Make.com", zh: "Make.com", ja: "Make.com" },
      { id: "WordPress", zh: "WordPress", ja: "WordPress" }
    ],
    urlLabel: { id: "Kunjungi situs", zh: "访问网站", ja: "サイトを見る" }
  },
  "great-bali-villas": {
    study: {
      overview: { id: "Great Bali Villas menyewakan villa premium di seluruh Bali. Situsnya jadi satu tempat untuk booking: tamu menyaring katalog berdasarkan area, ukuran, dan tanggal, melihat galeri full-bleed dan rincian fasilitas tiap villa, lalu menanyakan ketersediaan. Pertanyaannya langsung masuk ke tim lewat WhatsApp, karena begitulah booking villa di Bali benar-benar terjadi.", zh: "Great Bali Villas 在全巴厘岛出租高端别墅。这个网站就是一个完整的预订入口：客人按区域、面积和日期筛选房源，浏览满版图集和每栋别墅的设施明细，然后询问档期。咨询直接进到团队的 WhatsApp，因为巴厘岛的别墅预订本来就是这么谈成的。", ja: "Great Bali Villas はバリ島全域でプレミアムヴィラを貸し出しています。サイトは予約のための一つの入口です。エリア・広さ・日程でカタログを絞り込み、フルブリードのギャラリーとヴィラごとの設備一覧を見て、空き状況を尋ねる。問い合わせは WhatsApp でチームに直接届きます。バリのヴィラ予約は、実際そうやって決まるからです。" },
      needed: [
        { id: "Tamu harus menyusun sendiri gambaran villa dari situs listing, screenshot, dan DM yang dijawab setengah-setengah.", zh: "客人只能自己从各种房源网站、截图和回了一半的私信里拼出别墅的样子。", ja: "ゲストは掲載サイトとスクリーンショット、半分しか返ってこない DM から、自分でヴィラ像を組み立てるしかありませんでした。" },
        { id: "Tidak ada cara menyaring hal-hal yang menentukan pilihan menginap: area, ukuran, tanggal.", zh: "没有办法按真正决定一次入住的条件筛选：区域、面积、日期。", ja: "滞在を決める条件——エリア、広さ、日程——で絞り込む手段がありませんでした。" },
        { id: "Villa tidak pernah ditampilkan utuh, jadi galeri dan fasilitasnya tercecer di mana-mana.", zh: "别墅从来没有被完整呈现过，图集和设施信息散落在各处。", ja: "ヴィラが丸ごと見せられることはなく、ギャラリーも設備情報もばらばらに散っていました。" },
        { id: "Minat dari calon tamu tidak punya jalur langsung ke orang sungguhan di tim.", zh: "有意向的客人，没有一条能直接找到团队里真人的路。", ja: "興味を持った人が、チームの実在する誰かに直接たどり着く道がありませんでした。" },
      ],
      did: [
        { id: "Membangun katalog villa dengan filter area, ukuran, dan tanggal.", zh: "搭建了带区域、面积和日期筛选的别墅目录。", ja: "エリア・広さ・日程で絞り込めるヴィラカタログを構築。" },
        { id: "Membuat galeri full-bleed dan rincian fasilitas untuk tiap villa.", zh: "制作了满版图集和每栋别墅的设施明细。", ja: "フルブリードのギャラリーと、ヴィラごとの設備一覧を制作。" },
        { id: "Mengarahkan pertanyaan ketersediaan langsung ke WhatsApp, bukan ke contact form.", zh: "把档期咨询直接接到 WhatsApp，而不是丢进联系表单。", ja: "空き状況の問い合わせを、フォームではなく WhatsApp へ直接つなぐ設計に。" },
        { id: "Menyusun situs editorial yang responsif, lengkap dengan konteks peta untuk tiap area.", zh: "做成一个响应式的编辑型网站，每个区域都配上地图上下文。", ja: "各エリアに地図のコンテクストを添えた、レスポンシブなエディトリアルサイトを設計。" },
        { id: "Menyiapkan SEO untuk pencarian villa dengan intensi tinggi.", zh: "针对高意向的别墅搜索做了 SEO 设置。", ja: "成約に近い検索意図に向けた SEO を設定。" },
      ],
      changed: [
        { id: "Satu tempat yang tenang, menggantikan tiga situs listing dan satu thread DM.", zh: "一个清爽的入口，取代了三个房源网站和一串私信。", ja: "掲載サイト三つと DM のやり取りが、落ち着いた一つの入口に変わりました。" },
        { id: "Tamu sudah menyaring area, ukuran, dan tanggal bahkan sebelum bertanya.", zh: "客人在开口询问之前，就已经按区域、面积和日期筛好了。", ja: "ゲストは問い合わせる前に、エリア・広さ・日程で絞り込めるようになりました。" },
        { id: "Pertanyaan masuk ke WhatsApp dengan villa-nya sudah jelas sejak awal.", zh: "咨询进到 WhatsApp 时，已经带着具体是哪栋别墅。", ja: "問い合わせは、どのヴィラの話かが分かった状態で WhatsApp に届きます。" },
        { id: "Tiap villa sudah dilihat dengan benar sebelum obrolan dimulai, jadi pertanyaan yang masuk lebih matang.", zh: "在对话开始之前，每栋别墅都已经被好好看过一遍，所以进来的咨询更成熟。", ja: "会話が始まる前に、どのヴィラもきちんと見られている。だから届く問い合わせの質が上がりました。" },
      ],
    },
    title: { id: "Antarmuka Sewa Vila", zh: "别墅租赁页面", ja: "ヴィラレンタルのサイト" },
    blurb: { id: "Menginap di vila premium di Bali", zh: "Bali 的高端别墅住宿", ja: "Bali のプレミアムなヴィラステイ" },
    category: { id: "Kehadiran Digital", zh: "数字形象", ja: "デジタルプレゼンス" },
    description: {
      id: "Antarmuka pemesanan yang tenang untuk menginap di vila premium di Bali. Telusuri berdasarkan area, ukuran, dan tanggal, jelajahi galeri full-bleed dan rincian fasilitas, lalu ajukan pertanyaan langsung ke tim lewat WhatsApp.",
      zh: "为 Bali 高端别墅住宿打造的从容预订页面。按区域、大小和日期浏览，穿行于满幅图库与设施明细之间，并直接通过 WhatsApp 向团队咨询。",
      ja: "Bali のプレミアムなヴィラステイのための、落ち着いた予約サイト。エリア・広さ・日程で探し、全画面のギャラリーと設備の内訳を見ながら、WhatsApp でチームに直接問い合わせできます。"
    },
    longDescription: {
      id: "Memesan vila di Bali biasanya berarti berpindah-pindah antara situs listing, tangkapan layar, dan DM yang dibalas setengah-setengah. Great Bali Villas menginginkan yang sebaliknya: satu antarmuka yang tenang, tempat tamu bisa memfilter berdasarkan hal-hal yang benar-benar penting, area, ukuran, dan tanggal, melihat tiap vila dengan jelas, dan menghubungi orang sungguhan dalam satu ketukan. Kami membangun katalog, galeri, dan alur pertanyaan agar langsung mengalir ke WhatsApp, kanal pemesanan yang sebenarnya di Bali, sehingga minat berubah menjadi percakapan tanpa formulir yang menghalangi.",
      zh: "在 Bali 订别墅，通常意味着在各个房源网站、截图和回复了一半的私信之间来回奔波。Great Bali Villas 想要的恰恰相反：一个从容的页面，住客可以按真正重要的条件筛选——区域、大小和日期，把每套别墅看清楚，并一键联系到真人。我们搭建的目录、图库和咨询流程都直通 WhatsApp，也就是 Bali 真正的预订渠道，让兴趣顺势变成对话，中间不再横着一张表单。",
      ja: "Bali でヴィラを予約するというのは、たいてい掲載サイトとスクリーンショット、途中までしか返ってこない DM のあいだを行き来することを意味します。Great Bali Villas が求めたのは、その逆でした。本当に大切な条件——エリア・広さ・日程で絞り込め、各ヴィラをきちんと見られ、ワンタップで生身の人に連絡できる、落ち着いた一つのサイトです。私たちはカタログ、ギャラリー、そして問い合わせフローを、Bali の実際の予約チャネルである WhatsApp へ直接つながるように構築しました。こうして関心は、フォームに阻まれることなく会話へと変わります。"
    },
    scope: [
      { id: "Katalog vila dengan filter area, ukuran, dan tanggal", zh: "带区域、大小与日期筛选的别墅目录", ja: "エリア・広さ・日程で絞り込めるヴィラカタログ" },
      { id: "Galeri full-bleed dan rincian fasilitas untuk tiap vila", zh: "满幅图库与每套别墅的设施明细", ja: "全画面ギャラリーと、ヴィラごとの設備内訳" },
      { id: "Pertanyaan ketersediaan yang diarahkan langsung ke WhatsApp", zh: "空房咨询直接转至 WhatsApp", ja: "空室の問い合わせを WhatsApp へ直接ルーティング" },
      { id: "Tata letak editorial yang responsif dengan konteks peta", zh: "带地图信息的响应式编辑风格布局", ja: "地図情報を添えたレスポンシブなエディトリアルレイアウト" },
      { id: "Penyiapan SEO untuk pencarian vila dengan niat tinggi", zh: "针对高购买意向别墅搜索的 SEO 设置", ja: "購入意欲の高いヴィラ検索向けの SEO 設定" }
    ],
    location: { id: "Bali, Indonesia", zh: "Bali, Indonesia", ja: "Bali, Indonesia" },
    tags: [
      { id: "Web", zh: "网页", ja: "ウェブ" },
      { id: "Vila", zh: "别墅", ja: "ヴィラ" },
      { id: "Pemesanan", zh: "预订", ja: "予約" }
    ],
    urlLabel: { id: "Kunjungi situs", zh: "访问网站", ja: "サイトを見る" }
  },

  "bhagawan-property": {
    study: {
      overview: { id: "Bhagawan Property adalah property advisory di Bali yang berpihak pada pembeli. Listing-nya lebih sedikit tapi sudah diinspeksi, bukan semua yang ada di pasar. Mereka menerbitkan panduan editorial untuk enam kawasan dan menjalankan knowledge base untuk orang yang sedang mencoba memahami cara membeli properti di sini. Pertanyaan masuk ke tim advisory lengkap dengan propertinya.", zh: "Bhagawan Property 是巴厘岛一家站在买方一侧的房产顾问公司。他们只放实地看过的房源，而不是市面上的全部。他们为六个片区写了长文指南，还建了一个知识库，给那些正想弄明白在这里怎么买房的人看。咨询会连同具体房源一起进到顾问团队。", ja: "Bhagawan Property は、買い手側に立つバリの不動産アドバイザリーです。市場の全物件ではなく、実際に確認した少数の物件だけを扱います。六つのエリアについてエディトリアルなガイドを公開し、ここでの購入の仕組みを理解しようとする人のためのナレッジベースも運営しています。問い合わせは物件情報とともにアドバイザリーチームへ届きます。" },
      needed: [
        { id: "Status kepemilikan dan harga jarang disebut di awal, di mana pun di pasar ini.", zh: "在这个市场里，产权状态和价格几乎没人愿意一开始就讲清楚。", ja: "権利形態と価格を最初に明示することは、この市場ではほとんどありませんでした。" },
        { id: "Pembeli dibiarkan sendiri memahami beda freehold dan leasehold.", zh: "买家只能自己去搞懂永久产权和租赁产权的区别。", ja: "フリーホールドとリースホールドの違いは、買い手が自力で理解するしかありませんでした。" },
        { id: "Pengetahuan soal kawasan ada di kepala agen, bukan di tempat yang bisa dibaca pembeli.", zh: "片区知识都装在中介脑子里，不在买家能读到的地方。", ja: "エリアの知識はエージェントの頭の中にあり、買い手が読める場所にはありませんでした。" },
        { id: "Posisi sebagai advisory sulit dibedakan dari agensi listing yang mengejar volume.", zh: "顾问式的定位，很难和追求成交量的挂牌中介区分开。", ja: "アドバイザリーとしての立ち位置が、数を追う仲介業者と見分けがつきにくい状態でした。" },
      ],
      did: [
        { id: "Membangun katalog listing yang menampilkan status freehold dan leasehold secara terbuka.", zh: "搭建了一个把永久产权与租赁产权状态公开写明的房源目录。", ja: "フリーホールドとリースホールドの権利形態をはっきり示す物件カタログを構築。" },
        { id: "Menaruh spesifikasi, harga, dan status badge di tiap properti.", zh: "在每套房源上都标出规格、价格和状态标签。", ja: "すべての物件に仕様・価格・ステータスバッジを表示。" },
        { id: "Menulis panduan kawasan untuk Uluwatu, Canggu, Sanur, Seminyak, Ubud, dan Pererenan.", zh: "为 Uluwatu、Canggu、Sanur、Seminyak、Ubud 和 Pererenan 撰写了片区指南。", ja: "ウルワツ、チャングー、サヌール、スミニャック、ウブド、プレレナンのエリアガイドを執筆。" },
        { id: "Membangun knowledge base untuk artikel edukasi pembeli, termasuk soal status kepemilikan.", zh: "建了一个知识库，放买家教育类文章，也包括产权这类问题。", ja: "権利形態の話も含む、買い手向け解説記事のためのナレッジベースを構築。" },
        { id: "Menyiapkan alur enquiry dan WhatsApp ke advisor, plus SEO untuk pencarian status kepemilikan dan kawasan.", zh: "把咨询和 WhatsApp 都接到顾问那里，并针对产权和片区的搜索做了 SEO。", ja: "問い合わせと WhatsApp をアドバイザーへつなぎ、権利形態とエリアの検索に向けた SEO も設定。" },
      ],
      changed: [
        { id: "Status kepemilikan dan harga terbaca di scroll pertama, bukan setelah diminta.", zh: "产权和价格在第一屏就看得到，不用开口要。", ja: "権利形態と価格は、頼まなくても最初のスクロールで読み取れます。" },
        { id: "Pembeli datang sudah paham beda freehold dan leasehold.", zh: "买家来的时候，已经明白永久产权和租赁产权的差别。", ja: "買い手は、フリーホールドとリースホールドの違いを理解した状態で来ます。" },
        { id: "Obrolan mulai dari titik yang lebih jauh, karena situsnya sudah menjelaskan duluan.", zh: "对话从更靠后的地方开始，因为网站已经先把话讲明白了。", ja: "サイトが先に説明を済ませているので、会話はより先の地点から始まります。" },
        { id: "Pertanyaan sampai ke tim advisory lengkap dengan konteks propertinya.", zh: "咨询到顾问团队手里时，已经带着房源的完整背景。", ja: "問い合わせは物件のコンテクスト付きでアドバイザリーチームに届きます。" },
      ],
    },
    title: { id: "Platform Konsultasi Properti", zh: "房产顾问平台", ja: "不動産アドバイザリー・プラットフォーム" },
    blurb: { id: "Konsultan properti di Bali yang berpihak pada pembeli", zh: "Bali 以买家为先的房产顾问", ja: "買い手本位の Bali 不動産アドバイザリー" },
    category: { id: "Kehadiran Digital", zh: "数字形象", ja: "デジタルプレゼンス" },
    description: {
      id: "Situs konsultasi properti yang dibangun di atas kepercayaan, bukan volume. Listing freehold dan leasehold dengan spesifikasi dan harga yang apa adanya, panduan editorial untuk enam kawasan di Bali, serta knowledge base yang menjawab pertanyaan pembeli bahkan sebelum mereka menghubungi.",
      zh: "一个建立在信任而非数量之上的房产顾问网站。永久产权与租赁产权房源均附真实规格与价格，六个 Bali 区域的编辑式指南，以及一个在买家开口询问之前就已解答疑问的知识库。",
      ja: "物量ではなく信頼を軸に作られた不動産アドバイザリーのサイト。フリーホールドとリースホールドの物件を実際のスペックと価格とともに掲載し、Bali の6つのエリアをエディトリアルに案内。さらに、買い手が問い合わせる前に疑問へ答えるナレッジベースを備えています。"
    },
    longDescription: {
      id: "Pasar properti Bali penuh dengan agensi yang mendaftarkan apa saja tanpa benar-benar bertanggung jawab atas apa pun. Bhagawan memilih posisi sebaliknya: lebih sedikit properti, masing-masing sudah diperiksa langsung, dan nasihat yang tetap berpihak pada pembeli sekalipun itu membatalkan penjualan. Situsnya harus membuat sikap itu terbaca sejak scroll pertama, jadi listing menampilkan status kepemilikan dan harga secara jujur di depan, panduan kawasan terbaca seperti tulisan editorial alih-alih umpan pencarian, dan knowledge base menjawab pertanyaan freehold versus leasehold yang biasanya harus dipecahkan sendiri oleh pembeli. Pertanyaan yang masuk langsung diarahkan ke tim penasihat lengkap dengan konteks propertinya.",
      zh: "Bali 的房产市场充斥着什么都挂、却什么都不负责的中介。Bhagawan 选择了相反的立场：房源更少，每一处都亲自看过，而且即便会谈崩一单生意，建议也始终站在买家这边。网站必须让这种立场在第一屏就被读懂，所以房源把产权状态与价格坦率地放在前面，区域指南写得像编辑文章而非搜索诱饵，知识库则回答那些通常要买家自己摸索的永久产权与租赁产权之别。咨询会连同房源背景一起，直接转给顾问团队。",
      ja: "Bali の不動産市場は、何でも掲載する一方で何にも責任を持たない仲介であふれています。Bhagawan が選んだのは逆の立場でした。物件数は絞り、そのすべてを自ら見て回り、たとえ商談を失うことになっても買い手の側に立ち続ける助言をする。サイトはその姿勢を最初のスクロールで伝えなければなりません。だから物件は権利形態と価格を正直に前面に出し、エリアガイドは検索目当てではなく読み物として書かれ、ナレッジベースは買い手が自力で調べるほかなかったフリーホールドとリースホールドの違いに答えます。問い合わせは物件の文脈を添えたまま、アドバイザーへ直接届きます。"
    },
    scope: [
      { id: "Katalog listing dengan status freehold dan leasehold", zh: "含永久产权与租赁产权状态的房源目录", ja: "フリーホールドとリースホールドの権利状態を示す物件カタログ" },
      { id: "Spesifikasi, harga, dan label status untuk tiap properti", zh: "每处房源的规格、价格与状态标签", ja: "物件ごとのスペック・価格・ステータス表示" },
      { id: "Panduan editorial kawasan Uluwatu, Canggu, Sanur, Seminyak, Ubud, Pererenan", zh: "Uluwatu、Canggu、Sanur、Seminyak、Ubud、Pererenan 的编辑式区域指南", ja: "Uluwatu、Canggu、Sanur、Seminyak、Ubud、Pererenan のエディトリアルなエリアガイド" },
      { id: "Knowledge base untuk artikel edukasi pembeli", zh: "面向买家教育的知识库文章", ja: "買い手向け解説記事のナレッジベース" },
      { id: "Pengarahan pertanyaan dan WhatsApp ke tim penasihat", zh: "咨询与 WhatsApp 分流至顾问团队", ja: "問い合わせと WhatsApp をアドバイザーチームへ振り分け" },
      { id: "Penyiapan SEO untuk pencarian status kepemilikan dan kawasan", zh: "针对产权类型与区域搜索的 SEO 设置", ja: "権利形態・エリア検索向けの SEO 設定" }
    ],
    location: { id: "Bali, Indonesia", zh: "Bali, Indonesia", ja: "Bali, Indonesia" },
    tags: [
      { id: "Web", zh: "网页", ja: "ウェブ" },
      { id: "Properti", zh: "房产", ja: "不動産" },
      { id: "Konsultasi", zh: "顾问", ja: "アドバイザリー" }
    ],
    urlLabel: { id: "Kunjungi situs", zh: "访问网站", ja: "サイトを見る" }
  },

  "tammia-online": {
    study: {
      overview: { id: "Tammia Online adalah retailer beauty tools premium di Indonesia, menjual brush dan tools yang asli, bukan tiruan yang mirip. Storefront-nya punya delapan kategori produk dengan new arrivals mingguan, rating dan harga rupiah di tiap item, cart dan wishlist drawer yang muncul dari samping, plus beauty advisor lewat WhatsApp untuk pembeli yang belum yakin butuh apa.", zh: "Tammia Online 是印尼一家高端美妆工具零售商，卖的是正品刷具和工具，不是做得很像的仿品。店面分八个产品类目，每周上新，每件商品都有评分和印尼盾定价，购物车和心愿单以侧边抽屉呈现，还有 WhatsApp 上的美妆顾问，给还没想好要买什么的人。", ja: "Tammia Online はインドネシアのプレミアム美容ツール専門店です。よく似た模倣品ではなく、本物のブラシとツールを扱います。ストアは八つのカテゴリーで構成され、毎週新商品が入り、すべての商品に評価とルピア表示の価格が付きます。カートとウィッシュリストはスライドインのドロワーで、何が必要か迷う人のために WhatsApp のビューティーアドバイザーも用意しています。" },
      needed: [
        { id: "Pembeli tidak bisa membedakan brush asli dari tiruan yang meyakinkan.", zh: "买家分不出正品刷具和做得很像的仿品。", ja: "買い手には、本物のブラシと精巧な模倣品の区別がつきませんでした。" },
        { id: "Pertanyaan yang sama datang di tiap order: ini asli atau bukan?", zh: "每一单都会冒出同一个问题：这个是正品吗？", ja: "注文のたびに同じ質問が来ていました。これは本物ですか、と。" },
        { id: "Ketentuan pengiriman, retur, dan pembayaran tidak tertulis di tempat yang jelas.", zh: "配送、退换和付款的条款，没写在任何显眼的地方。", ja: "配送・返品・支払いの条件が、目につく場所に書かれていませんでした。" },
        { id: "Tidak ada cara cepat untuk bertanya soal produk sebelum memutuskan beli.", zh: "在决定下单之前，没有一条能快速问清产品的路。", ja: "購入を決める前に、商品について手早く尋ねる手段がありませんでした。" },
      ],
      did: [
        { id: "Membangun storefront dengan delapan kategori produk dan new arrivals mingguan.", zh: "搭建了分八个类目、每周上新的店面。", ja: "八つの商品カテゴリーと毎週の新着を備えたストアを構築。" },
        { id: "Menaruh garansi keaslian, rating, dan batas gratis ongkir di atas lipatan.", zh: "把正品保证、评分和包邮门槛都放到首屏。", ja: "正規品保証・評価・送料無料のしきい値をファーストビューに配置。" },
        { id: "Menambahkan cart dan wishlist drawer supaya pembeli tetap di halaman yang sama.", zh: "加了购物车和心愿单侧边抽屉，让买家不用离开当前页面。", ja: "同じページに留まれるよう、カートとウィッシュリストのドロワーを追加。" },
        { id: "Menulis FAQ yang mencakup pengiriman, retur, dan pembayaran.", zh: "写了覆盖配送、退换和付款的常见问题。", ja: "配送・返品・支払いをカバーする FAQ を執筆。" },
        { id: "Menghubungkan beauty advisor lewat WhatsApp untuk pertanyaan produk, di layout yang mobile-first.", zh: "在移动优先的版面里，把 WhatsApp 美妆顾问接进来回答产品问题。", ja: "モバイルファーストのレイアウトで、商品の質問に答える WhatsApp のビューティーアドバイザーを接続。" },
      ],
      changed: [
        { id: "Garansi keaslian jadi hal pertama yang dilihat pembeli.", zh: "正品保证成了买家看到的第一件事。", ja: "正規品保証が、買い手が最初に目にするものになりました。" },
        { id: "Tiap produk punya rating dan harga dalam rupiah.", zh: "每件商品都有评分，也都标了印尼盾价格。", ja: "すべての商品に評価と、ルピア表示の価格が付いています。" },
        { id: "Katalognya disusun berdasarkan kebutuhan orang, bukan berdasarkan brand.", zh: "目录按人的需求来组织，而不是按品牌。", ja: "カタログはブランド別ではなく、人が必要とするもの別に整理されています。" },
        { id: "Pembeli yang ragu bisa sampai ke advisor lewat WhatsApp dalam satu ketukan.", zh: "还在犹豫的买家，一下就能点到 WhatsApp 上的顾问。", ja: "迷っている買い手は、ワンタップで WhatsApp のアドバイザーにつながります。" },
      ],
    },
    title: { id: "Etalase Beauty Tools", zh: "美妆工具商店", ja: "ビューティーツールのストアフロント" },
    blurb: { id: "Retailer beauty tools premium di Indonesia", zh: "Indonesia 的高端美妆工具零售商", ja: "Indonesia のプレミアム・ビューティーツール専門店" },
    category: { id: "Kehadiran Digital", zh: "数字形象", ja: "デジタルプレゼンス" },
    description: {
      id: "Etalase e-commerce untuk retailer beauty tools premium. Delapan kategori produk, koleksi baru tiap minggu, drawer keranjang dan wishlist, serta beauty advisor lewat WhatsApp untuk pembeli yang masih bingung memilih brush.",
      zh: "为高端美妆工具零售商打造的电商门店。八个产品分类、每周上新、购物车与心愿单抽屉，还有 WhatsApp 美妆顾问，帮那些拿不准该选哪支刷子的顾客。",
      ja: "プレミアムなビューティーツール専門店のための EC ストアフロント。8つの商品カテゴリー、毎週の新着、カートとウィッシュリストのドロワー、そしてどのブラシを選ぶか迷う人のための WhatsApp ビューティーアドバイザーを備えています。"
    },
    longDescription: {
      id: "Beauty tools adalah pembelian yang bertumpu pada kepercayaan: pembeli mencari brush Real Techniques yang asli, bukan tiruan yang meyakinkan. Etalase ini membuka dengan hal itu, jaminan keaslian dan syarat gratis ongkir berada di atas lipatan, dan setiap produk menampilkan rating serta harga dalam rupiah. Di bawahnya, katalog disusun sesuai cara orang benar-benar berbelanja, berdasarkan kebutuhan alih-alih merek, dengan drawer keranjang dan wishlist yang tidak pernah membawa Anda keluar dari halaman. Bagi yang masih ragu, beauty advisor lewat WhatsApp hanya satu ketukan jauhnya, dan begitulah kebanyakan orang Indonesia memilih untuk bertanya.",
      zh: "美妆工具是一桩靠信任成交的买卖：顾客要的是真正的 Real Techniques 刷子，而不是一支足以乱真的仿品。这家门店开门见山，正品保证与包邮门槛就放在首屏，每件商品都标着评分和以印尼盾计的价格。往下，商品目录是按人们真正的购物方式来组织的，按需求而非按品牌，购物车与心愿单抽屉滑出即用，绝不会把你带离当前页面。要是还拿不准，WhatsApp 上的美妆顾问只有一键之遥，而这正是大多数 Indonesia 人习惯发问的方式。",
      ja: "ビューティーツールは信頼で決まる買い物です。顧客が欲しいのは本物の Real Techniques のブラシであって、よくできた模造品ではありません。このストアはそこから始まります。正規品保証と送料無料の条件をファーストビューに置き、すべての商品に評価とルピア建ての価格を添える。その下では、カタログをブランド別ではなく「何が必要か」で並べ、カートとウィッシュリストのドロワーはページから離れることなく開きます。それでも迷う人には、WhatsApp のビューティーアドバイザーがワンタップ。Indonesia の多くの人が質問する、いつものやり方です。"
    },
    scope: [
      { id: "Etalase dengan delapan kategori produk", zh: "含八个产品分类的门店", ja: "8つの商品カテゴリーを備えたストアフロント" },
      { id: "Koleksi baru, rating, dan pesan jaminan keaslian", zh: "新品上架、评分与正品保证信息", ja: "新着、評価、正規品保証のメッセージ" },
      { id: "Drawer keranjang dan wishlist yang bisa digeser", zh: "可滑出的购物车与心愿单抽屉", ja: "スライド式のカートとウィッシュリストのドロワー" },
      { id: "FAQ seputar pengiriman, retur, dan pembayaran", zh: "涵盖配送、退换与支付的常见问答", ja: "配送・返品・支払いに関する FAQ" },
      { id: "Beauty advisor WhatsApp untuk pertanyaan produk", zh: "解答产品疑问的 WhatsApp 美妆顾问", ja: "商品の質問に答える WhatsApp ビューティーアドバイザー" },
      { id: "Tata letak responsif untuk pembeli yang mengutamakan mobile", zh: "面向移动优先购物者的响应式布局", ja: "モバイル中心の買い物客に向けたレスポンシブレイアウト" }
    ],
    location: { id: "Indonesia", zh: "Indonesia", ja: "Indonesia" },
    tags: [
      { id: "Web", zh: "网页", ja: "ウェブ" },
      { id: "E-commerce", zh: "电商", ja: "EC" },
      { id: "Kecantikan", zh: "美妆", ja: "ビューティー" }
    ],
    urlLabel: { id: "Kunjungi situs", zh: "访问网站", ja: "サイトを見る" }
  },

  "astungkare-spa": {
    study: {
      overview: { id: "Astungkare Spa adalah mobile spa 24 jam yang melayani seluruh Bali. Terapis terlatih datang ke villa tamu membawa oil dan linen, dipesan lewat WhatsApp, dengan area layanan mencakup Canggu, Seminyak, Ubud, dan sisa pulau. Onyx menangani brand, situs, feed sosialnya, sekaligus paid media-nya.", zh: "Astungkare Spa 是一家 24 小时上门的移动 spa，服务范围覆盖整个巴厘岛。受过训练的理疗师带着精油和布巾到客人的别墅，通过 WhatsApp 预约，服务区域包含 Canggu、Seminyak、Ubud 以及岛上其他地方。Onyx 负责品牌、网站、社交内容，以及付费投放。", ja: "Astungkare Spa はバリ全域に出張する 24 時間対応のモバイルスパです。訓練を受けたセラピストがオイルとリネンを持ってゲストのヴィラを訪ね、予約は WhatsApp で受け付けます。対応エリアはチャングー、スミニャック、ウブド、そして島の他の地域まで。Onyx はブランド、サイト、ソーシャルの運用、そしてペイドメディアまでを担当しています。" },
      needed: [
        { id: "Janji layanan mobile spa lebih sulit dijelaskan online daripada saat bertemu langsung.", zh: "上门 spa 这件事，在线上比当面更难讲清楚。", ja: "出張スパという提供のかたちは、対面よりもオンラインで説明するほうが難しいものでした。" },
        { id: "Tidak ada cara menunjukkan ke tamu slot paling awal yang tersedia malam ini.", zh: "没有办法告诉客人今晚最早还有哪个时段。", ja: "今夜いちばん早く空いている枠を、ゲストに示す方法がありませんでした。" },
        { id: "Daftar treatment dan kebijakan pembatalan tidak tertulis di mana pun yang bisa dibaca.", zh: "疗程内容和取消政策，没有写在任何能读到的地方。", ja: "トリートメントの一覧もキャンセル規定も、読める場所に書かれていませんでした。" },
        { id: "Tidak ada yang menyatukan brand, feed sosial, dan iklannya dalam satu suara.", zh: "品牌、社交内容和广告，没有任何东西把它们统一到同一个口吻上。", ja: "ブランドとソーシャルと広告を一つの声にまとめるものが、何もありませんでした。" },
      ],
      did: [
        { id: "Membangun situs custom di atas sistem editorial serif dengan nuansa dark gold.", zh: "在深金色调、以衬线字体为主的编辑型系统上，搭建了一个定制网站。", ja: "ダークゴールドでセリフ主体のエディトリアルシステムの上に、カスタムサイトを構築。" },
        { id: "Menaruh indikator ketersediaan paling awal secara live di hero.", zh: "把最早可预约时段做成实时指示器，放在首屏。", ja: "最短の空き状況をリアルタイムで示すインジケーターをヒーローに配置。" },
        { id: "Menyiapkan booking yang mengutamakan WhatsApp, dengan komitmen balas di bawah lima menit.", zh: "把预约做成 WhatsApp 优先，并承诺五分钟内回复。", ja: "WhatsApp を起点にした予約導線を用意し、五分以内の返信を約束。" },
        { id: "Menulis katalog treatment lengkap dengan logistik mobile spa, kebijakan pembatalan, dan halaman area layanan.", zh: "写了完整的疗程目录，涵盖上门流程、取消政策，以及服务区域页面。", ja: "出張の段取り、キャンセル規定、対応エリアのページまで含めたトリートメントカタログを執筆。" },
        { id: "Menjalankan feed sosial always-on bersama pengelolaan iklan Meta dan Google.", zh: "持续运营社交内容，同时管理 Meta 和 Google 的广告投放。", ja: "常時稼働のソーシャル運用を、Meta と Google の広告運用と並走で実施。" },
      ],
      changed: [
        { id: "Tamu bisa melihat slot paling awal malam ini sebelum menghubungi siapa pun.", zh: "客人在联系任何人之前，就能看到今晚最早的时段。", ja: "ゲストは誰かに連絡する前に、今夜いちばん早い枠を確認できます。" },
        { id: "Booking cukup satu ketukan ke WhatsApp, bukan isi form lalu menunggu.", zh: "预约只要点一下 WhatsApp，不用填完表单再等。", ja: "予約はフォームを埋めて待つのではなく、WhatsApp へのワンタップになりました。" },
        { id: "Harga, logistik, dan ketentuan pembatalan bisa dibaca sebelum siapa pun berkomitmen.", zh: "价格、上门流程和取消条款，在任何人做决定之前就能读到。", ja: "価格も段取りもキャンセル条件も、誰かが決める前に読めます。" },
        { id: "Situs, sosial, dan iklan dijalankan satu studio, jadi penawarannya tetap sejalan.", zh: "网站、社交和广告都由同一家工作室在跑，所以对外的说法始终一致。", ja: "サイトもソーシャルも広告も一つのスタジオが運用するので、提供内容がぶれません。" },
      ],
    },
    title: { id: "Antarmuka Pemesanan Spa Keliling", zh: "上门 SPA 预约页面", ja: "出張スパ予約サイト" },
    blurb: { id: "Spa keliling 24 jam di seluruh Bali", zh: "遍布 Bali 的 24 小时上门 SPA", ja: "Bali 全域で対応する24時間出張スパ" },
    category: { id: "Kehadiran Digital", zh: "数字形象", ja: "デジタルプレゼンス" },
    description: {
      id: "Brand, situs, media sosial, dan iklan berbayar untuk spa keliling 24 jam yang melayani Canggu, Seminyak, dan Ubud. Terapis terlatih lengkap dengan minyak dan linen datang ke vila Anda, dipesan dalam waktu kurang dari lima menit lewat WhatsApp, dengan indikator ketersediaan tercepat secara real-time di bagian hero.",
      zh: "为服务 Canggu、Seminyak 和 Ubud 的 24 小时上门 SPA 打造品牌、网站、社媒与付费广告。训练有素的理疗师带上精油和布巾上门到您的别墅，通过 WhatsApp 五分钟内即可完成预约，首屏还提供实时最早可约时段提示。",
      ja: "Canggu、Seminyak、Ubud に対応する24時間出張スパのためのブランド、サイト、ソーシャル、有料広告。オイルとリネンを携えた熟練セラピストがあなたのヴィラへ訪問し、WhatsApp から5分以内で予約可能。ヒーロー部分には最短の空き状況をリアルタイムで表示します。"
    },
    longDescription: {
      id: "Pasar spa di Bali penuh sesak dengan brand wellness konvensional yang berebut pengunjung yang sama. Astungkare mengambil taruhan sebaliknya: spa-lah yang datang kepada Anda, 24 jam sehari, ke seluruh penjuru pulau. Tugas kami adalah membuat janji itu terasa semudah online seperti halnya langsung, sebuah hero yang menunjukkan slot paling awal malam ini secara real-time, perawatan dengan harga dan penjelasan tanpa istilah spa yang berbelit, kebijakan pembatalan yang bisa Anda baca sebelum memesan, dan satu ketukan untuk menghubungi terapis langsung lewat WhatsApp. Brand-nya dark gold dan berbasis serif, sebuah kesederhanaan yang membiarkan layanannya berbicara sendiri. Situs, media sosial, dan iklan berbayar semuanya dijalankan dari studio yang sama sehingga nada dan penawaran tetap selaras di setiap kanal.",
      zh: "Bali 的 SPA 市场早已被众多实体养生品牌挤满，大家都在争夺同样的到店客流。Astungkare 反其道而行：让 SPA 上门找你，全天 24 小时，遍及全岛。我们的任务，是让这个承诺在线上和现场一样毫不费力，首屏实时显示今晚最早的可约时段，护理项目明码标价、讲解不带晦涩的行业术语，取消政策在预约前就能看清，一键即可通过 WhatsApp 直接联系理疗师。品牌采用深金色搭配衬线字体，正是这种克制让服务本身说话。网站、社媒与付费广告都由同一家工作室操刀，让品牌声音与服务主张在每个触点上保持一致。",
      ja: "Bali のスパ市場は、同じ来店客を奪い合う実店舗型のウェルネスブランドであふれています。Astungkare はその逆を選びました。スパのほうが、24時間、島じゅうどこへでもあなたのもとへ来るのです。私たちの仕事は、その約束を対面と同じくらいオンラインでも軽やかに感じさせること。今夜いちばん早い枠をリアルタイムで示すヒーロー、専門用語に頼らず価格と内容を説明したトリートメント、予約前に読めるキャンセルポリシー、そしてワンタップでセラピストに直接 WhatsApp できる導線です。ブランドはダークゴールドとセリフ体を基調とし、その抑制がサービスそのものに語らせます。サイト、ソーシャル、有料広告はすべて同じスタジオから動かし、トーンとオファーがどの接点でも揃うようにしています。"
    },
    scope: [
      { id: "Situs khusus dengan sistem visual dark-gold bergaya editorial", zh: "采用编辑风格深金色视觉系统的定制网站", ja: "エディトリアルなダークゴールドのビジュアルシステムを用いたカスタムサイト" },
      { id: "Indikator ketersediaan tercepat secara langsung di bagian hero", zh: "首屏上的实时最早可约时段提示", ja: "ヒーロー部分に最短の空き状況をリアルタイム表示" },
      { id: "Alur pemesanan mengutamakan WhatsApp (SLA balasan di bawah lima menit)", zh: "以 WhatsApp 为先的预约流程（五分钟内回复的 SLA）", ja: "WhatsApp を軸にした予約フロー（5分以内の返信 SLA）" },
      { id: "Katalog perawatan dengan logistik spa keliling + kebijakan pembatalan", zh: "含上门 SPA 服务安排及取消政策的护理项目目录", ja: "出張スパの手配とキャンセルポリシーを含むトリートメントカタログ" },
      { id: "Halaman area layanan, Canggu, Seminyak, Ubud, dan seluruh Bali", zh: "服务区域页面：Canggu、Seminyak、Ubud 以及 Bali 全岛", ja: "サービスエリアページ（Canggu、Seminyak、Ubud、そして Bali 全域）" },
      { id: "Feed media sosial yang selalu aktif + pengelolaan iklan Meta + Google", zh: "持续运营的社媒内容 + Meta 与 Google 广告投放管理", ja: "常時稼働のソーシャルフィード + Meta・Google 広告運用" }
    ],
    location: { id: "Bali, Indonesia", zh: "Bali, Indonesia", ja: "Bali, Indonesia" },
    tags: [
      { id: "Web", zh: "网页", ja: "ウェブ" },
      { id: "Spa", zh: "水疗", ja: "スパ" },
      { id: "Perhotelan", zh: "酒店服务", ja: "ホスピタリティ" }
    ],
    urlLabel: { id: "Kunjungi situs", zh: "访问网站", ja: "サイトを見る" }
  },

  "the-hair-extensions-bali": {
    study: {
      overview: { id: "The Hair Extensions Bali adalah studio hair extensions by-appointment di Kerobokan. Mereka menawarkan enam metode pemasangan, masing-masing dengan penjelasan dan harga IDR sendiri, dan bekerja dari color wall di studio yang dipilih klien langsung di tempat. Situsnya membawa brand-nya, galeri pekerjaan sebelumnya, dan jalur booking-nya.", zh: "The Hair Extensions Bali 是 Kerobokan 一家需要预约的接发工作室。他们提供六种接发方式，每一种都有各自的说明和印尼盾定价，客人到店后从工作室的色板墙上挑颜色。网站承载了品牌、过往作品图集，以及预约入口。", ja: "The Hair Extensions Bali は、クロボカンにある予約制のヘアエクステンション専門スタジオです。六つの装着方法があり、それぞれに説明と IDR 表示の価格が付きます。カラーはスタジオのカラーウォールから、来店時に選んでもらいます。サイトはブランド、これまでの施術ギャラリー、そして予約導線を担っています。" },
      needed: [
        { id: "Studio ini belum punya wajah digital yang terasa sama dengan aslinya.", zh: "这家工作室在线上，还没有一张能对得上它现场感觉的脸。", ja: "実際に足を運んだときの感じに見合う、デジタル上の顔がありませんでした。" },
        { id: "Enam metode pemasangan sulit dibedakan tanpa ada stylist yang menjelaskan.", zh: "六种接发方式，没有发型师在旁边讲，根本分不清。", ja: "六つの装着方法は、スタイリストの説明なしでは違いが分かりませんでした。" },
        { id: "Hasil pekerjaan sebelumnya cuma ada di feed, bukan di galeri yang bisa disaring klien.", zh: "过往作品只散在动态里，没有一个客人能筛选的图集。", ja: "これまでの施術はフィードにあるだけで、絞り込めるギャラリーにはなっていませんでした。" },
        { id: "Harga baru kelihatan setelah ada yang menanyakannya.", zh: "价格要等到有人开口问，才会露面。", ja: "価格は、誰かが尋ねて初めて見えるものでした。" },
      ],
      did: [
        { id: "Menggambar wordmark-nya: HAIR EXTENSIONS berserif dengan Bali tulisan tangan.", zh: "画了字标：衬线体的 HAIR EXTENSIONS，配上手写的 Bali。", ja: "ワードマークを作図。セリフ体の HAIR EXTENSIONS に、手描きの Bali を添えて。" },
        { id: "Membangun situs multi-halaman: Home, Products, Tips, Gallery, dan Book.", zh: "搭建了多页面网站：首页、产品、技巧、图集、预约。", ja: "Home、Products、Tips、Gallery、Book の複数ページサイトを構築。" },
        { id: "Menyunting video hero yang menampilkan color wall studio yang sebenarnya.", zh: "剪了一支首屏视频，拍的是工作室真实的色板墙。", ja: "実際のスタジオのカラーウォールを映したヒーロー映像を編集。" },
        { id: "Membangun galeri yang bisa disaring: transformasi, produk dan warna, serta studio.", zh: "做了可筛选的图集：改造前后、产品与颜色、工作室。", ja: "変化、商品とカラー、スタジオで絞り込めるギャラリーを構築。" },
        { id: "Menulis enam metode layanan lengkap dengan penjelasan dan harga IDR, booking langsung ke WhatsApp.", zh: "写了六种服务方式的完整说明和印尼盾定价，预约直接进 WhatsApp。", ja: "六つの施術方法を説明と IDR 価格つきで執筆し、予約は WhatsApp へ直結。" },
      ],
      changed: [
        { id: "Brand-nya sekarang terasa sama dengan suasana salonnya saat didatangi.", zh: "品牌现在的感觉，和走进这家店时是一致的。", ja: "ブランドの印象が、店に入ったときの感覚と揃いました。" },
        { id: "Klien bisa membandingkan enam metode dan melihat harga IDR sebelum booking.", zh: "客人能在预约前比较六种方式，也能看到印尼盾价格。", ja: "予約の前に六つの方法を比べ、IDR の価格まで確認できます。" },
        { id: "Galerinya bisa disaring sampai ke pekerjaan yang memang ingin dilihat.", zh: "图集可以一路筛到客人真正想看的那种作品。", ja: "ギャラリーは、その人が見に来た施術まで絞り込めます。" },
        { id: "Booking berjalan langsung lewat WhatsApp, bahasa janji temu di Bali.", zh: "预约直接走 WhatsApp，那是巴厘岛约时间的通用语言。", ja: "予約は WhatsApp へ直接。バリでの約束は、その言葉で交わされます。" },
      ],
    },
    title: { id: "Brand & Situs Salon", zh: "沙龙品牌与网站", ja: "サロンのブランドとサイト" },
    blurb: { id: "Studio hair extensions di Kerobokan", zh: "位于 Kerobokan 的接发工作室", ja: "Kerobokan のヘアエクステンションスタジオ" },
    category: { id: "Studio Kreatif", zh: "创意工作室", ja: "クリエイティブスタジオ" },
    description: {
      id: "Brand dan situs untuk studio hair extensions premium di Kerobokan, enam metode pemasangan, galeri bergaya editorial dengan filter metode, dan video hero dari color wall yang sesungguhnya.",
      zh: "为 Kerobokan 一家高端接发工作室打造品牌与网站，六种接发方法、带方法筛选的编辑风格图库，以及真实发色墙的视频首屏。",
      ja: "Kerobokan のプレミアムなヘアエクステンションスタジオのためのブランドとサイト。6つの装着方法、方法で絞り込めるエディトリアルなギャラリー、そして実際のカラーウォールを映したビデオヒーローを備えています。"
    },
    longDescription: {
      id: "Studio ini berada di Kerobokan, dengan sistem janji temu. Mereka menginginkan tampilan digital yang selaras dengan pengalaman langsung, tenang, hangat, berbalut nuansa gelap, dengan galeri bergaya editorial seperti yang Anda harapkan di majalah cetak. Enam metode layanan, galeri yang bisa difilter, video hero dari color wall yang sesungguhnya, dan pemesanan langsung ke WhatsApp dengan harga IDR yang terlihat sejak awal. Wordmark-nya membuktikan diri di sisa halaman: judul serif dengan 'Bali' tulisan tangan, detail kecil yang menandakan bahwa pekerjaannya dikerjakan dengan tangan.",
      zh: "工作室位于 Kerobokan，采用预约制。他们想要一个与到店体验相称的数字页面，安静、温暖、以深色调呈现，配上那种你会在纸质杂志里见到的编辑风格图库。六种服务方法、可筛选的图库、真实发色墙的视频首屏，以及直通 WhatsApp、开头就标明 IDR 价格的预约方式。文字标识撑起了整个页面：衬线体标题搭配手写的 'Bali'，正是这种小细节，暗示着一切都出自手工。",
      ja: "スタジオは Kerobokan にあり、予約制です。彼らが求めたのは、対面での体験に見合うデジタルの佇まいでした。静かで、温かく、ダークトーンをまとい、紙の雑誌で目にするようなエディトリアルなギャラリーを備えたもの。6つのサービス方法、絞り込めるギャラリー、実際のカラーウォールを映したビデオヒーロー、そして最初から IDR 価格が見える WhatsApp 直結の予約です。ワードマークがページの残りを支えます。手描きの 'Bali' を添えたセリフ体のタイトル——その仕事が手作業で行われていることを物語る、小さなディテールです。"
    },
    scope: [
      { id: "Wordmark: serif 'HAIR EXTENSIONS' + 'Bali' tulisan tangan", zh: "文字标识：衬线体 'HAIR EXTENSIONS' + 手写体 'Bali'", ja: "ワードマーク：セリフ体の 'HAIR EXTENSIONS' + 手描きの 'Bali'" },
      { id: "Situs multi-halaman (Beranda / Produk / Tips / Galeri / Pesan)", zh: "多页面网站（首页 / 产品 / 贴士 / 图库 / 预约）", ja: "複数ページのサイト（ホーム / 製品 / ヒント / ギャラリー / 予約）" },
      { id: "Video hero yang menampilkan color wall studio", zh: "展示工作室发色墙的视频首屏", ja: "スタジオのカラーウォールを見せるビデオヒーロー" },
      { id: "Galeri dengan filter metode (transformasi / produk & warna / studio)", zh: "带方法筛选的图库（蜕变效果 / 产品与颜色 / 工作室）", ja: "方法で絞り込めるギャラリー（ビフォーアフター / 製品とカラー / スタジオ）" },
      { id: "Enam metode layanan dengan detail dan harga dalam IDR", zh: "六种服务方法，附详情与 IDR 定价", ja: "6つのサービス方法、詳細と IDR 価格つき" },
      { id: "Alur pemesanan langsung ke WhatsApp, cara orang Bali membuat janji temu", zh: "直通 WhatsApp 的预约流程，也就是 Bali 人约时间的通用方式", ja: "WhatsApp へ直接つながる予約フロー。Bali で予約を取るときの共通言語です" }
    ],
    location: { id: "Kerobokan, Bali", zh: "Kerobokan, Bali", ja: "Kerobokan, Bali" },
    tags: [
      { id: "Web", zh: "网页", ja: "ウェブ" },
      { id: "Merek", zh: "品牌", ja: "ブランド" },
      { id: "Kecantikan", zh: "美容", ja: "ビューティー" }
    ],
    urlLabel: { id: "Kunjungi situs", zh: "访问网站", ja: "サイトを見る" }
  },
};

/** Keyed by insight slug, for the same reason as PROJECT_TX. */
const INSIGHT_TX: Record<string, InsightTx> = {
  "designing-for-the-spotlight-not-the-brochure": {
    title: { id: "Kenapa homepage kamu sebaiknya bilang satu hal, bukan sepuluh", zh: "首页只说一件事，而不是十件事", ja: "homepage で伝えるのは、10個ではなく1つでいい" },
    tag: { id: "Web · Motion", zh: "Web · Motion", ja: "Web · Motion" },
    excerpt: { id: "Kebanyakan website bisnis menaruh semua layanan di halaman depan, dan tidak ada satu pun yang bikin orang klik. Homepage cuma punya sekitar empat detik untuk menahan orang, jadi butuh satu janji yang jelas dan satu langkah berikutnya yang gampang ditebak.", zh: "大多数企业网站把所有服务都堆在首页，结果没有一项能换来点击。homepage 大概只有四秒钟留住一个人，所以它需要一个清楚的承诺，和一个显而易见的下一步。", ja: "多くの企業サイトは全サービスをトップに並べるが、どれもクリックにつながらない。homepage が人をつなぎ止められるのは4秒ほど。だから必要なのは、はっきりした約束ひとつと、迷わない次の一歩ひとつだけだ。" },
    sections: [
      {
        heading: { id: "Semua website kelihatan mirip", zh: "所有网站长得都差不多", ja: "どのサイトも同じに見える" },
        paragraphs: [
          { id: "Buka sepuluh homepage agency, strukturnya akan sama persis. Hero, daftar layanan, grid klien, deretan penghargaan, mission statement, contact form. Informasinya lengkap, tapi halamannya tidak terbaca seperti panggung. Terbacanya seperti brosur yang ditempel di dinding.", zh: "随便打开十个 agency 的 homepage，结构都是一样的。一个 hero、一串服务、一格客户 logo、一排奖项、一段愿景、一个 contact form。信息都在，但整个页面读起来不像一个舞台，更像钉在墙上的一张宣传单。", ja: "エージェンシーの homepage を10個開いてみると、構造はどれも同じだ。hero、サービス一覧、クライアントのグリッド、受賞歴の列、ミッションステートメント、問い合わせフォーム。情報は揃っている。ただ、そのページは舞台には見えない。壁に貼られたパンフレットに見える。" },
        ],
      },
      {
        heading: { id: "Website harus merebut perhatian", zh: "网站得自己挣来注意力", ja: "サイトは注目を勝ち取るしかない" },
        paragraphs: [
          { id: "Brosur tidak perlu merebut perhatian. Orangnya sudah memegang kertasnya. Website beda. Pengunjung datang dengan pertanyaan yang belum utuh, dan langsung pergi begitu halamannya berhenti menjawab.", zh: "宣传单不需要挣注意力，读的人已经把它拿在手上了。网站不一样。访客带着一个还没成形的问题进来，页面一旦不再回答它，人就走了。", ja: "パンフレットは注目を勝ち取る必要がない。読み手はもう紙を手にしているからだ。サイトは違う。訪問者は半分だけ形になった疑問を抱えてやってきて、ページがそれに答えなくなった瞬間に去る。" },
          { id: "Kalau homepage diperlakukan seperti brosur, semua layanan, semua kemampuan, semua penghargaan dijejer rata, hampir pasti scroll pertama juga jadi scroll terakhir. Brosur membuktikan kamu ada. Homepage harus membuktikan kamu layak di-scroll.", zh: "把 homepage 当宣传单来做，把每项服务、每种能力、每个奖项平铺出来，基本上就保证了第一次 scroll 也是最后一次。宣传单只证明你存在，homepage 得证明你值得往下看。", ja: "homepage をパンフレットのように扱い、全サービス、全機能、全実績を平らに並べれば、最初の scroll が最後の scroll になるのはほぼ確実だ。パンフレットは存在を証明する。homepage は scroll する価値があることを証明しないといけない。" },
        ],
      },
      {
        heading: { id: "Satu janji, satu arah", zh: "一个承诺，一个方向", ja: "約束はひとつ、進む先もひとつ" },
        paragraphs: [
          { id: "Kami mendesain dengan cara sebaliknya. Homepage bukan brosur, tapi sorotan lampu. Tahan orang selama empat detik dengan satu pernyataan, satu gerakan yang pantas bikin berhenti, dan satu arah yang bisa diambil pengunjung berikutnya.", zh: "我们的做法正好相反。homepage 不是宣传单，是聚光灯。用一句宣言、一段值得停顿的动效、一个明确的下一步，把人留住四秒。", ja: "私たちは逆から設計する。homepage はパンフレットではなくスポットライトだ。ひとつの宣言、立ち止まる価値のあるモーション、そして次に進める方向をひとつ。それで4秒つかむ。" },
          { id: "Sisanya ditaruh di bawah. Halaman layanan, case study, dan kontak tetap ada, dan justru dibaca karena homepage sudah membuka pintunya.", zh: "其他内容都放在后面。服务页、案例、联系方式都还在，而且正因为 homepage 先把门打开了，它们才真的会被人读。", ja: "残りはすべてその下に置く。サービスページも事例も問い合わせも消えたりしない。むしろ homepage が扉を開けたからこそ読まれる。" },
        ],
      },
      {
        heading: { id: "Motion itu pengali", zh: "动效是放大器", ja: "モーションが効きを何倍にもする" },
        paragraphs: [
          { id: "Hero diam cuma bilang ke pengunjung bahwa kamu ada. Hero yang loop, tiga detik tekstur, proses kerja, cahaya yang bergerak di dalam frame, bilang ke mereka rasanya seperti apa kerja bareng kamu. Itu bedanya antara membuktikan kamu ada dan membuktikan kamu layak dilihat dua kali.", zh: "静止的 hero 只是告诉访客：你在这儿。而一段 loop 的 hero，三秒的质感、进行中的工作、光在画面里移动，告诉他们跟你合作是什么感觉。这就是「证明你存在」和「证明你值得再看一眼」的差别。", ja: "静止した hero が伝えるのは「ここにいます」だけだ。loop する hero、3秒の質感、進行中の仕事、フレームを横切る光は、一緒に働くとどんな感じかを伝える。存在の証明と、もう一度見る価値の証明の差はそこにある。" },
        ],
      },
      {
        heading: { id: "Bagaimana kami bikin punya sendiri", zh: "我们自己是怎么做的", ja: "自分たちの場合はこうした" },
        paragraphs: [
          { id: "Di onyxcreative.asia, hero-nya loop enam detik, bukan foto diam. Halamannya cuma bikin satu janji, studio independen dengan empat disiplin untuk tim yang ambisius, lalu memberi pengunjung ruang untuk bernapas. Tambah apa pun lagi di layar pertama pasti bikin efeknya mati.", zh: "在 onyxcreative.asia 上，hero 是一段六秒的 loop，而不是一张静态照片。整页只给一个承诺：一家四个专业方向、服务有野心团队的独立工作室，然后就让访客喘口气。第一屏再多放任何东西，这个效果就没了。", ja: "onyxcreative.asia の hero は静止写真ではなく6秒の loop だ。ページが掲げる約束はひとつ、4つの専門領域を持つ独立系スタジオが、野心のあるチームと組む。それだけ言ったら、あとは訪問者に呼吸させる。ファーストビューにこれ以上足したら台無しだった。" },
        ],
      },
    ],
  },
  "when-ai-agents-earn-their-seat-at-the-table": {
    title: { id: "AI yang berguna itu menghapus kerjaan, bukan menambah chatbot", zh: "有用的 AI 是减掉工作，不是加个 chatbot", ja: "役に立つ AI は仕事を減らす。chatbot を足すことではない" },
    tag: { id: "AI Systems", zh: "AI Systems", ja: "AI Systems" },
    excerpt: { id: "Kebanyakan AI yang dijual ke bisnis cuma chat widget yang ditempel di contact form. Versi yang layak dibayar justru jalan di belakang layar, mengangkat kerjaan admin dari tim kamu, dan tidak pernah minta diperhatikan.", zh: "卖给企业的 AI，大多只是贴在 contact form 上的一个聊天 widget。真正值得花钱的那种跑在后台，把行政杂活从团队手里拿走，而且从不要求被看见。", ja: "企業に売られている AI の多くは、contact form に貼り付けた chat widget にすぎない。お金を払う価値があるのは裏側で動き、チームから事務作業を取り上げ、存在を主張しないほうだ。" },
    sections: [
      {
        heading: { id: "Yang berisik", zh: "吵闹的那种", ja: "うるさいほう" },
        paragraphs: [
          { id: "Ada versi AI yang berisik. Widget di pojok halaman, avatar yang memantul, sapaan ramah yang tidak diminta siapa pun. AI jenis ini mengumumkan dirinya. Dia ingin dipakai. Jarang banget kejadian.", zh: "有一种 AI 很吵。页面角落的 widget、蹦跳的头像、没人要求过的热情问候。这种 AI 忙着宣告自己的存在，它想被用，而它很少被用。", ja: "うるさいタイプの AI がある。画面の隅の widget、跳ねるアバター、誰も頼んでいない親しげな挨拶。この手の AI は自分の存在を宣言する。使われたがっている。そしてたいてい使われない。" },
        ],
      },
      {
        heading: { id: "Yang diam-diam", zh: "安静的那种", ja: "静かなほう" },
        paragraphs: [
          { id: "Versi satunya diam. Sebuah pipeline mengambil kiriman form, mencari datanya klien, membuat kartu yang tepat di tool yang tepat, lalu menembakkan notifikasi yang tepat, semuanya dalam hitungan detik, tanpa ada yang sadar dia jalan.", zh: "另一种很安静。一条 pipeline 接住表单提交，查出对应客户，在对的工具里建对的卡片，再发出对的通知，几秒之内全部完成，没人察觉它跑过。", ja: "もうひとつは静かだ。pipeline がフォーム送信を受け取り、クライアントを照合し、正しいツールに正しいカードを作り、正しい通知を飛ばす。数秒で終わり、動いたことに誰も気づかない。" },
          { id: "AI jenis ini pantas ada karena dia menghapus kerjaan remeh. Tidak ada yang membicarakannya, karena dibicarakan memang bukan tujuannya. Sistem terbaik adalah yang tidak pernah disadari pelanggan kamu, masalah mereka tahu-tahu sudah selesai.", zh: "这种 AI 靠消灭杂活挣到自己的位置。没人谈论它，因为被谈论本来就不是目的。最好的系统是客户从来没注意到的那种，他们的问题就是解决了。", ja: "こちらの AI は雑務を消すことで居場所を得る。話題にならないのは、話題になることが目的ではないからだ。最良のシステムは顧客が気づかないもので、問題だけが片づいている。" },
        ],
      },
      {
        heading: { id: "Yang sebenarnya dibutuhkan RADcruiters", zh: "RADcruiters 真正需要的是什么", ja: "RADcruiters が本当に必要としていたもの" },
        paragraphs: [
          { id: "Waktu kami bikin otomasi campaign request untuk RADcruiters, brief-nya kelihatan sederhana. Ganti satu form. Kenyataannya, satu form ini diam-diam sudah jadi bottleneck buat agensi recruitment marketing.", zh: "我们给 RADcruiters 做 campaign 需求自动化时，brief 看起来很简单：换掉一个表单。实际情况是，这一个表单早就悄悄变成了这家招聘营销 agency 的瓶颈。", ja: "RADcruiters の campaign リクエスト自動化を作ったとき、brief は単純に見えた。フォームをひとつ置き換えるだけ。実際には、そのフォームが採用マーケティング会社のボトルネックになっていた。" },
          { id: "Tiap brief masuk nge-ping tim di Slack. Ada yang mesti baca URL-nya manual, cari kliennya di Airtable, bikin kartu Trello, lalu menulis email konfirmasi. Form-nya sendiri tidak rusak. Yang rusak itu operan antar orangnya.", zh: "每份 brief 都会在 Slack 上 ping 团队。有人手动解析 URL，在 Airtable 里找客户，建一张 Trello 卡片，再写一封确认 email。表单本身没坏，坏的是中间这些交接。", ja: "brief が届くたびに Slack でチームに通知が飛ぶ。誰かが URL を手作業で読み取り、Airtable でクライアントを探し、Trello のカードを作り、確認メールを書く。フォームが壊れていたわけではない。壊れていたのは受け渡しのほうだ。" },
        ],
      },
      {
        heading: { id: "Yang kami bangun sebagai gantinya", zh: "我们改成做了什么", ja: "代わりに作ったもの" },
        paragraphs: [
          { id: "Kami bangun ulang intake-nya jadi pipeline. Submission dari WordPress memicu webhook. Webhook-nya menarik URL lowongan, mencocokkan klien di Airtable, mengantre task Trello lengkap dengan brief-nya, lalu menembakkan alert ke tim dan konfirmasi ke klien. Ujung ke ujung dalam hitungan detik.", zh: "我们把接单流程重做成一条 pipeline。WordPress 的提交触发一个 webhook，webhook 提取职位 URL、在 Airtable 里匹配客户、把带完整 brief 的任务排进 Trello，然后发出团队提醒和客户确认。全程几秒钟。", ja: "受付をまるごと pipeline に作り直した。WordPress の送信が webhook を起動し、webhook が求人 URL を抜き出し、Airtable でクライアントを照合し、brief 付きの Trello タスクを積み、チームへのアラートとクライアントへの確認を飛ばす。端から端まで数秒だ。" },
          { id: "Dari luar, form-nya kelihatan sama persis. Kerjaan di belakangnya yang hilang.", zh: "从外面看，表单一模一样。消失的是它背后的那些活。", ja: "外から見えるフォームは以前と同じ。消えたのはその裏の作業だ。" },
        ],
      },
      {
        heading: { id: "Tes sederhana", zh: "一个简单的判断", ja: "簡単なテスト" },
        paragraphs: [
          { id: "Itu tes yang layak dipakai buat apa pun yang dijual ke kamu dengan label AI. Kalau tampilannya tetap sama dan kerjaannya jadi lebih cepat, sistemnya bekerja. Kalau tampilannya nambah avatar memantul dan kecepatan kerjanya sama persis, kamu baru saja beli chatbot.", zh: "任何打着 AI 名义卖给你的东西，都可以用这个判断。如果表面没变而事情跑得更快，这套系统就做到了它该做的。如果表面多了个蹦跳的头像而速度分毫未变，你买的是一个 chatbot。", ja: "AI という名前で売られてくるものには、この物差しを当てればいい。見た目が変わらず仕事が速くなったなら、そのシステムは役目を果たしている。見た目に跳ねるアバターが増えて速度が変わらないなら、買ったのは chatbot だ。" },
        ],
      },
    ],
  },
  "performance-creative-isnt-a-different-language": {
    title: { id: "Iklan dan brand kamu sebaiknya datang dari tim yang sama", zh: "你的广告和你的 brand，应该出自同一个团队", ja: "広告と brand は、同じチームから出したほうがいい" },
    tag: { id: "Paid Media", zh: "Paid Media", ja: "Paid Media" },
    excerpt: { id: "Banyak studio memperlakukan paid creative sebagai keahlian terpisah dengan standar yang lebih rendah. Padahal tidak. Orang yang membangun brand kamu seharusnya yang menjalankan iklannya, dengan tempo lebih cepat dan ukuran keberhasilan yang berbeda.", zh: "不少工作室把 paid creative 当成另一门手艺，还配上更低的标准。其实不是。建你 brand 的那批人，就该来跑你的广告，只是节奏更快、衡量方式不同。", ja: "paid creative を別の職能として、しかも低い基準で扱うスタジオは多い。そんなことはない。brand を作る人がそのまま広告を回すべきで、変わるのは速度と評価軸だけだ。" },
    sections: [
      {
        heading: { id: "Masalah dua ruangan", zh: "两个房间的问题", ja: "部屋がふたつある問題" },
        paragraphs: [
          { id: "Kebanyakan studio memisahkan brand dan performance ke dua ruangan. Desainer brand mengerjakan yang lambat dan penuh pertimbangan. Desainer performance mengerjakan yang cepat dan sekali pakai. Lama-lama dua tim ini pakai tool berbeda, referensi berbeda, dan diam-diam, standar yang berbeda juga.", zh: "多数工作室把 brand 和 performance 分进两个房间。brand 设计师做慢工细活，performance 设计师做快节奏的一次性素材。时间久了，两个团队用的工具不同、参考不同，还悄悄地，标准也不同了。", ja: "多くのスタジオは brand と performance を別々の部屋に分ける。brand のデザイナーはじっくり練る仕事を、performance のデザイナーは速くて使い捨ての仕事をする。やがて両者は違うツール、違うリファレンス、そして気づかないうちに違う基準を使うようになる。" },
        ],
      },
      {
        heading: { id: "Penonton tidak bisa membedakan", zh: "观众根本分不出来", ja: "見る側には区別がつかない" },
        paragraphs: [
          { id: "Pemisahan itu palsu. Penonton sama sekali tidak tahu satu materi datang dari ruangan yang mana. Mereka scroll. Iklannya entah berhasil merebut dua detik berikutnya, atau tidak. Siapa yang bikin cuma penting buat bagan organisasi.", zh: "这个划分是假的。观众根本不知道一条素材出自哪个房间。他们只是 scroll，广告要么换来接下来那两秒，要么换不来。谁做的，只有组织架构图在乎。", ja: "この線引きは実体がない。見る側はその素材がどちらの部屋から出たかなど知らない。ただ scroll する。広告は次の2秒を勝ち取るか、取れないかのどちらかだ。誰が作ったかを気にするのは組織図だけだ。" },
        ],
      },
      {
        heading: { id: "Yang benar-benar berubah", zh: "真正变的是什么", ja: "実際に変わるところ" },
        paragraphs: [
          { id: "Beda nyata antara kerjaan brand dan kerjaan performance itu ritmenya. Campaign brand jalan sekali per kuartal. Campaign paid melempar empat puluh varian dalam seminggu, jadi craft-nya harus dipadatkan.", zh: "brand 工作和 performance 工作真正的差别是节奏。一个 brand campaign 一个季度上一次；一个 paid campaign 一周就要上四十个版本，所以手艺必须被压缩。", ja: "brand の仕事と performance の仕事の本当の違いは頻度だ。brand campaign は四半期に一度立ち上がる。paid campaign は一週間で40パターン出す。だから作り込みを圧縮するしかない。" },
          { id: "Dipadatkan bukan berarti dikompromikan. Desainer yang bisa menjaga garis brand selama setahun juga bisa menjaganya di empat puluh varian iklan, asal sistemnya mendukung.", zh: "压缩不等于妥协。能把 brand 调性守一年的设计师，一样能在四十个广告版本里守住，前提是系统撑得住他们。", ja: "圧縮は妥協とは違う。1年間 brand の線を守れるデザイナーは、40本の広告でも守れる。支える仕組みさえあればの話だ。" },
        ],
      },
      {
        heading: { id: "Sistemnya yang bekerja", zh: "干活的是系统", ja: "仕事をするのは仕組みのほう" },
        paragraphs: [
          { id: "Sistem itulah yang bikin performance creative bagus jadi mungkin. Lockup tipografi yang konsisten, pola headline yang sudah teruji, dan pustaka kecil elemen bergerak yang bisa dikombinasikan ulang.", zh: "正是这套系统，让好的 performance creative 成为可能。一套稳定的字体锁版、一个被验证过的标题结构、一小组可以重新组合的动态元素。", ja: "良い performance creative を可能にするのはその仕組みだ。一貫したタイポのロックアップ、検証済みの見出しパターン、組み替えられる動きの素材を少しだけ揃えておく。" },
          { id: "Tanpa itu, tiap iklan baru selalu mulai dari nol dan timnya habis di minggu ketiga. Dengan itu, iklan keempat puluh punya integritas brand yang sama dengan materi cetak pertamanya, dan kemungkinan besar konversinya malah lebih bagus.", zh: "没有它，每条新广告都是从头开始，团队撑到第三周就烧干了。有了它，第四十条广告和最初那件印刷品一样守得住 brand，而且转化多半还更好。", ja: "これがないと、新しい広告はいつも白紙からで、チームは3週目で燃え尽きる。あれば、40本目の広告も最初の印刷物と同じ brand の芯を保てるし、たぶんコンバージョンも上になる。" },
        ],
      },
      {
        heading: { id: "Cara kami menjalankan paid", zh: "我们是怎么跑 paid 的", ja: "私たちの paid の回し方" },
        paragraphs: [
          { id: "Waktu kami menjalankan paid untuk klien, sistem kreatifnya sudah termasuk dalam kerja samanya, bukan sesuatu yang dibeli terpisah. Tim iklan dan tim brand adalah tim yang sama. Yang berubah cuma ukuran suksesnya, ROAS bukan awareness, sementara craft-nya identik. Belanja iklan yang berbunga bukan cuma taktik budget, itu juga soal kreatif.", zh: "我们给客户跑 paid 时，创意系统本来就包含在合作里，不是另外买的东西。广告团队和 brand 团队是同一批人。变的只有成功的衡量方式：ROAS 而不是 awareness，手艺完全一样。会滚雪球的投放不只是预算策略，也是创意策略。", ja: "クライアントの paid を回すとき、クリエイティブの仕組みは契約の一部で、別売りではない。広告チームと brand チームは同じチームだ。変わるのは成功の測り方だけで、awareness ではなく ROAS になる。作り込みは変わらない。積み上がる出稿は予算の話であると同時に、クリエイティブの話でもある。" },
        ],
      },
    ],
  },
  "why-we-shipped-a-hero-video-instead-of-a-hero-image": {
    title: { id: "Kenapa homepage kami dibuka dengan video pendek, bukan foto", zh: "为什么我们的 homepage 开场是一小段视频，不是照片", ja: "homepage の冒頭を写真ではなく短い動画にした理由" },
    tag: { id: "Web · Brand", zh: "Web · Brand", ja: "Web · Brand" },
    excerpt: { id: "Foto cuma memberi tahu pengunjung bahwa halamannya sudah termuat. Beberapa detik gerakan memberi mereka alasan untuk bertahan. Ini biaya sebuah hero loop dalam waktu muat, dan cara kami menjaga halamannya tetap cepat.", zh: "一张照片只告诉访客页面加载好了，几秒钟的动态才给他们留下来的理由。这里说说一个 hero loop 在加载时间上的代价，以及我们怎么让页面照样快。", ja: "写真が伝えるのは「ページが読み込まれた」ことだけ。数秒の動きは、留まる理由になる。hero の loop が読み込み時間にどれだけのコストを払わせるか、それでもページを速く保つ方法を書いておく。" },
    sections: [
      {
        heading: { id: "Kenapa gambar jadi pilihan default", zh: "为什么图片是默认选择", ja: "画像がデフォルトになる理由" },
        paragraphs: [
          { id: "Hero berupa gambar itu pilihan aman. Loading-nya cepat, gampang diarahkan secara visual, dan bisa diganti per campaign tanpa bongkar apa pun.", zh: "hero 用图片是稳妥选择。加载快、好做视觉把控，而且可以按 campaign 随时替换，不用重做任何东西。", ja: "hero を画像にするのは安全な選択だ。読み込みが速く、アートディレクションもしやすく、campaign ごとに差し替えても何も作り直さなくていい。" },
          { id: "Tapi gambar payah dalam menyampaikan atmosfer. Sebuah foto menahan perhatian kira-kira selama mata butuh untuk mengenalinya. Setelah itu scroll jalan lagi.", zh: "但图片很不擅长传递氛围。一张照片留住注意力的时间，差不多就是眼睛认出它所需要的时间。然后 scroll 就继续了。", ja: "一方で、画像は空気を伝えるのが下手だ。写真が注意を保つのは、目がそれを認識するのにかかる時間くらい。そのあと scroll は再開する。" },
        ],
      },
      {
        heading: { id: "Apa yang beda dari sebuah loop", zh: "loop 不一样在哪", ja: "loop だと何が違うのか" },
        paragraphs: [
          { id: "Loop bekerja dengan cara lain. Enam detik tekstur, cahaya bergerak di dinding, huruf yang menyusun dirinya sendiri, tangan di tengah gerakan, memberi pengunjung sesuatu untuk ditinggali sebentar. Halamannya jadi tempat, bukan selebaran. Kebanyakan pembaca tidak pernah tahu kenapa mereka berhenti. Mereka cuma berhenti.", zh: "loop 的工作方式不一样。六秒的质感、光在墙上移动、字自己拼起来、一只手停在动作中间，给了访客一个可以待一会儿的地方。页面变成了一个空间，而不是一张传单。大多数人从来没弄明白自己为什么停下，他们就是停下了。", ja: "loop の効き方は違う。6秒の質感、壁を流れる光、組み上がっていく文字、動作の途中の手。訪問者はそこに少し腰を落ち着けられる。ページはチラシではなく場所になる。多くの読者はなぜ止まったのか分からないままだ。ただ止まる。" },
        ],
      },
      {
        heading: { id: "Menjaga halaman tetap cepat", zh: "让页面保持快", ja: "ページを速いままにする" },
        paragraphs: [
          { id: "Ada harga nyata yang mesti dibayar. Video lebih berat dari gambar, dan hosting yang malas akan menyeret Core Web Vitals kalau kamu ceroboh.", zh: "这是有实际代价的。视频比图片重，托管不用心的话，一不小心就会把 Core Web Vitals 拖下去。", ja: "これには実際のコストがある。動画は画像より重いし、ホスティングが雑なら不用意に Core Web Vitals を落とす。" },
          { id: "Kami menanganinya dengan cara yang jelas. Poster image dimuat lebih dulu dan di-decode inline, videonya mulai begitu buffer-nya cukup, dan fallback webm menutup browser yang tidak sanggup dengan ukuran encode-nya. Pengunjung melihat hero diam sekitar 200 ms, dan versi bergeraknya setengah detik kemudian.", zh: "我们的处理方式很直白。poster 图先加载并 inline 解码，视频缓冲够了就开始播，再用一个 webm fallback 覆盖吃不下这个编码体积的浏览器。访客大约 200 毫秒看到静止 hero，半秒之后看到动起来的那版。", ja: "対処は素直だ。まず poster 画像を読み込んでインラインでデコードし、バッファが溜まり次第 video を再生する。エンコードサイズを扱えないブラウザは webm の fallback で拾う。訪問者は約200msで静止した hero を見て、その半秒後に動く hero を見る。" },
        ],
      },
      {
        heading: { id: "Isi loop-nya apa", zh: "loop 里放什么", ja: "loop に何を入れるか" },
        paragraphs: [
          { id: "Apa yang kamu taruh di dalam loop jauh lebih penting daripada fakta bahwa dia nge-loop. Sinematografi stok akan terbaca persis sebagai stok, dan efeknya langsung hilang.", zh: "放什么进 loop，远比「它在循环」这件事重要。素材库的镜头一眼就能被认出来，效果瞬间就没了。", ja: "loop に何を入れるかは、loop していること自体よりずっと重要だ。ストック映像はストック映像として一発で見抜かれ、効果はその場で消える。" },
          { id: "Klip di onyxcreative.asia adalah still life enam detik tentang pekerjaan yang sedang berjalan: tekstur, huruf, dan ruang kerja studio kami sendiri. Itu potret diri, yang jalan satu frame per detik perhatian.", zh: "onyxcreative.asia 上那段素材，是一支六秒的「进行中的工作」静物：质感、字体，还有我们自己的工作台。那是一张自画像，以每秒一帧的注意力播放。", ja: "onyxcreative.asia のクリップは、進行中の仕事を撮った6秒の静物だ。質感、文字、そしてスタジオ自身の作業机。要するに自画像で、注目1秒あたり1フレームで流れている。" },
        ],
      },
      {
        heading: { id: "Menetapkan suhunya", zh: "定下温度", ja: "温度を決める" },
        paragraphs: [
          { id: "Begitu loop-nya selesai, pembaca sudah memutuskan mau lanjut scroll atau tidak. Kalau hero-nya sudah bekerja, sisa homepage tidak perlu meyakinkan siapa pun soal apa pun. Dia cuma perlu menepati suhu yang sudah ditetapkan layar pertama.", zh: "loop 播完的时候，读者其实已经决定要不要继续往下 scroll 了。如果 hero 做到了它该做的，homepage 剩下的部分就不必再说服谁。它只要兑现第一屏定下的那个温度就行。", ja: "loop が終わる頃には、読者はもう scroll を続けるかどうか決めている。hero が仕事をしていれば、homepage の残りは誰かを説得する必要はない。ファーストビューが決めた温度に応えるだけでいい。" },
        ],
      },
    ],
  },
};

/** Keyed by the testimonial's projectSlug, for the same reason as PROJECT_TX. */
const TESTIMONIAL_TX: Record<string, { quote?: Tri; role?: Tri }> = {
  "radcruiters": {
    quote: {
      id: "Yang dulu butuh tiga kali ping di Slack dan satu kartu Trello manual, sekarang selesai dalam waktu kurang dari semenit. Tim bisa fokus ke kampanyenya, bukan ke proses masuknya.",
      zh: "过去要在 Slack 里催三次、再手动建一张 Trello 卡片的事，现在不到一分钟就完成了。团队可以专注在活动本身，而不是接收流程上。",
      ja: "以前は Slack で三回声をかけ、Trello のカードを手作業で作っていた作業が、今では一分もかかりません。チームは受付ではなく、キャンペーンそのものに集中できています。"
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" }
  },
  "bhagawan-property": {
    quote: {
      id: "Pembeli datang sudah paham bedanya freehold dan leasehold, karena situsnya menjelaskan itu bahkan sebelum kami bicara. Percakapannya kini dimulai dua langkah lebih maju dari sebelumnya.",
      zh: "买家上门时已经清楚永久产权和租赁产权的区别，因为在我们开口之前，网站就把这件事讲明白了。现在的洽谈，起点比过去往前挪了两步。",
      ja: "買い手は、フリーホールドとリースホールドの違いをすでに理解した状態でやって来ます。私たちが話す前に、サイトが説明してくれているからです。商談は以前より二歩先から始まるようになりました。"
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" }
  },
  "tammia-online": {
    quote: {
      id: "Dulu pelanggan bertanya 'ini original nggak?' di hampir setiap pesanan. Sekarang jaminannya jadi hal pertama yang mereka lihat, dan pertanyaan itu sebagian besar berhenti. Proses checkout terasa jauh lebih lancar.",
      zh: "以前几乎每一单，顾客都会问一句「这是正品吗」。现在正品保证是他们看到的第一件事，这个问题基本上就没再出现了，结账流程也顺畅了不少。",
      ja: "以前はほぼ毎回、注文のたびに「これは本物ですか」と聞かれていました。今は保証が最初に目に入るので、その質問はほとんど来なくなりました。決済までの流れも目に見えてスムーズです。"
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" }
  },
  "the-hair-extensions-bali": {
    quote: {
      id: "Brand-nya akhirnya sesuai dengan bagaimana salon ini terasa saat dikunjungi langsung. Pemesanan dari pelanggan baru naik dua kali lipat dalam dua bulan setelah peluncuran.",
      zh: "品牌终于和这家沙龙在现场给人的感觉一致了。上线后两个月内，首次到店的预约量翻了一倍。",
      ja: "ブランドが、実際にサロンを訪れたときの感覚とようやく一致しました。公開から二か月で、初めてのお客様の予約が二倍になりました。"
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" }
  },
  "astungkare-spa": {
    quote: {
      id: "Kami ingin websitenya terasa setenang perawatannya sendiri. Onyx membangun situsnya, menjalankan feed media sosialnya, dan mengelola iklannya, pemesanan langsung mengalir ke WhatsApp dan tidak ada yang terlewat. Situsnya berkonversi tiga kali lipat dari perkiraan kami.",
      zh: "我们希望网站给人的感觉，能像护理本身一样从容。Onyx 搭建了网站、运营着社媒内容、也管理着广告投放，预约直接流向 WhatsApp，没有任何遗漏。网站的转化率是我们预期的三倍。",
      ja: "サイトにも、トリートメントそのものと同じ静けさを求めていました。Onyx がサイトを構築し、ソーシャルの発信を回し、広告も運用してくれています。予約はそのまま WhatsApp に流れ、取りこぼしがありません。サイトのコンバージョンは見込みの三倍です。"
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" }
  },
  "great-bali-villas": {
    quote: {
      id: "Dulu tamu harus menyusun gambaran vila kami dari tiga situs berbeda. Sekarang semuanya ada di satu tampilan yang tenang, saring berdasarkan area dan tanggal, lihat vilanya dengan jelas, lalu hubungi kami dalam satu ketukan. Pertanyaan yang masuk terasa jauh lebih serius.",
      zh: "以前住客得从三个不同的网站上，才能拼凑出我们别墅的样子。现在只需一个从容的页面，按区域和日期筛选，把别墅看清楚，一键就能联系我们。收到的咨询明显更精准了。",
      ja: "以前は、ゲストが三つの別々のサイトから私たちのヴィラ像をつなぎ合わせていました。今は落ち着いた一つの画面で、エリアと日程で絞り込み、ヴィラをきちんと見て、ワンタップで連絡できます。問い合わせの質が目に見えて上がりました。"
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" }
  },
};

/** Aligned to STATS: label only. */
const STAT_TX: Array<Tri | undefined> = [
  { id: "Proyek diselesaikan", zh: "已交付项目", ja: "納品したプロジェクト" },
  { id: "Industri dilayani", zh: "服务过的行业", ja: "手がけた業種" },
  { id: "Platform dikuasai", zh: "掌握的平台", ja: "使いこなすプラットフォーム" },
  { id: "Tahun pengalaman", zh: "年经验", ja: "年の経験" },
];

/* ============================================================
 * Assembly — build DICT by reading English keys from the source arrays.
 * ============================================================ */

type Table = Record<string, string>;
type Maps = Record<Locale, Table>;

function put(m: Maps, en: string | undefined, tri: Tri | undefined) {
  if (!en || !tri) return;
  if (tri.id) m.id[en] = tri.id;
  if (tri.zh) m.zh[en] = tri.zh;
  if (tri.ja) m.ja[en] = tri.ja;
}

function build(): Maps {
  const m: Maps = { en: {}, id: {}, zh: {}, ja: {} };

  for (const [en, tri] of UI) put(m, en, tri);

  SERVICES.forEach((s, i) => {
    const t = SERVICE_TX[i];
    if (!t) return;
    put(m, s.title, t.title);
    put(m, s.short, t.short);
    put(m, s.description, t.description);
    put(m, s.intro, t.intro);
    s.narrative.forEach((p, j) => put(m, p, t.narrative?.[j]));
    s.capabilities.forEach((c, j) => {
      put(m, c.title, t.capabilities?.[j]?.title);
      put(m, c.detail, t.capabilities?.[j]?.detail);
    });
    s.process.forEach((pr, j) => {
      put(m, pr.title, t.process?.[j]?.title);
      put(m, pr.detail, t.process?.[j]?.detail);
    });
    put(m, s.fitFor, t.fitFor);
    put(m, s.cta.problem, t.cta?.problem);
    put(m, s.cta.solution, t.cta?.solution);
  });

  PROJECTS.forEach((p) => {
    const t = PROJECT_TX[p.slug];
    if (!t) return;
    put(m, p.title, t.title);
    put(m, p.blurb, t.blurb);
    put(m, p.category, t.category);
    put(m, p.description, t.description);
    put(m, p.longDescription, t.longDescription);
    put(m, p.location, t.location);
    put(m, p.urlLabel, t.urlLabel);
    (p.scope ?? []).forEach((sc, j) => put(m, sc, t.scope?.[j]));
    (p.tags ?? []).forEach((tg, j) => put(m, tg, t.tags?.[j]));
    if (p.study && t.study) {
      put(m, p.study.overview, t.study.overview);
      p.study.needed.forEach((x, j) => put(m, x, t.study?.needed?.[j]));
      p.study.did.forEach((x, j) => put(m, x, t.study?.did?.[j]));
      p.study.changed.forEach((x, j) => put(m, x, t.study?.changed?.[j]));
    }
  });

  INSIGHTS.forEach((ins) => {
    const t = INSIGHT_TX[ins.slug];
    if (!t) return;
    put(m, ins.title, t.title);
    put(m, ins.tag, t.tag);
    put(m, ins.excerpt, t.excerpt);
    ins.sections.forEach((sec, j) => {
      put(m, sec.heading, t.sections?.[j]?.heading);
      sec.paragraphs.forEach((para, k) =>
        put(m, para, t.sections?.[j]?.paragraphs?.[k]),
      );
    });
  });

  TESTIMONIALS.forEach((tm) => {
    const t = tm.projectSlug ? TESTIMONIAL_TX[tm.projectSlug] : undefined;
    if (!t) return;
    put(m, tm.quote, t.quote);
    put(m, tm.role, t.role);
  });

  STATS.forEach((st, i) => put(m, st.label, STAT_TX[i]));

  return m;
}

export const DICT: Maps = build();
