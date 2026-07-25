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
  capabilities: Tri[];
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
};

type InsightTx = {
  title?: Tri;
  tag?: Tri;
  excerpt?: Tri;
  /** One entry per body block, in order. For a quote block, translates
   *  the quote text. */
  body?: Tri[];
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
      { id: "Desain dan pembuatan website", zh: "网站设计与搭建", ja: "ウェブサイトの設計・構築" },
      { id: "Software custom dan aplikasi web", zh: "定制软件与 Web 应用", ja: "カスタムソフトウェアと Web アプリ" },
      { id: "Hosting dan domain", zh: "托管与域名", ja: "ホスティングとドメイン" },
      { id: "Pemeliharaan berkelanjutan", zh: "持续维护", ja: "継続的なメンテナンス" },
      { id: "Penyiapan dan optimasi SEO", zh: "SEO 设置与优化", ja: "SEO の設定と最適化" },
      { id: "Manajemen konten", zh: "内容管理", ja: "コンテンツ管理" }
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
      { id: "SEO", zh: "SEO", ja: "SEO" },
      { id: "Pengelolaan media sosial", zh: "社交媒体管理", ja: "ソーシャルメディア運用" },
      { id: "Pemasaran konten", zh: "内容营销", ja: "コンテンツマーケティング" },
      { id: "Pemasaran email", zh: "邮件营销", ja: "メールマーケティング" },
      { id: "Iklan berbayar (Google, Meta, TikTok)", zh: "付费广告（Google、Meta、TikTok）", ja: "有料広告（Google、Meta、TikTok）" },
      { id: "Laporan bulanan", zh: "月度报告", ja: "月次レポート" }
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
      { id: "Branding dan identitas", zh: "品牌塑造与识别", ja: "ブランディングとアイデンティティ" },
      { id: "Desain grafis", zh: "平面设计", ja: "グラフィックデザイン" },
      { id: "Fotografi", zh: "摄影", ja: "写真撮影" },
      { id: "Videografi", zh: "视频摄制", ja: "映像撮影" },
      { id: "Motion graphics", zh: "动态图形", ja: "モーショングラフィックス" },
      { id: "Aset kreatif", zh: "创意素材", ja: "クリエイティブアセット" }
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
      { id: "Otomatisasi alur kerja", zh: "工作流自动化", ja: "ワークフローの自動化" },
      { id: "Chatbot", zh: "聊天机器人", ja: "チャットボット" },
      { id: "Otomatisasi CRM", zh: "CRM 自动化", ja: "CRM 自動化" },
      { id: "AI agent", zh: "AI 智能体", ja: "AI エージェント" },
      { id: "Integrasi sistem", zh: "系统集成", ja: "システム連携" },
      { id: "AI untuk operasional bisnis", zh: "面向业务运营的 AI", ja: "業務運用のための AI" }
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
      { id: "Penyiapan tracking", zh: "追踪配置", ja: "トラッキングの設定" },
      { id: "Dashboard", zh: "数据看板", ja: "ダッシュボード" },
      { id: "Pelaporan", zh: "报告", ja: "レポーティング" },
      { id: "Optimasi konversi", zh: "转化优化", ja: "コンバージョン最適化" },
      { id: "Tinjauan performa", zh: "绩效评估", ja: "パフォーマンスレビュー" }
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
      { id: "Pemeliharaan web", zh: "网站维护", ja: "Web の保守" },
      { id: "Pengelolaan server", zh: "服务器管理", ja: "サーバー管理" },
      { id: "Keamanan", zh: "安全防护", ja: "セキュリティ" },
      { id: "Pembaruan", zh: "更新", ja: "アップデート" },
      { id: "Pemantauan", zh: "监控", ja: "モニタリング" },
      { id: "Backup", zh: "备份", ja: "バックアップ" },
      { id: "Dukungan teknis", zh: "技术支持", ja: "テクニカルサポート" }
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

const PROJECT_TX: Array<ProjectTx | undefined> = [
  {
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
  {
    title: { id: "Brand & Situs Grup Perhotelan", zh: "酒店集团品牌与网站", ja: "ホスピタリティグループのブランドとサイト" },
    blurb: { id: "Grup perhotelan di Bali", zh: "位于 Bali 的酒店集团", ja: "Bali のホスピタリティグループ" },
    category: { id: "Kehadiran Digital", zh: "数字形象", ja: "デジタルプレゼンス" },
    description: {
      id: "Brand dan kehadiran digital untuk sebuah grup perhotelan, mencakup identitas grup, halaman properti, dan alur pertanyaan yang mengarahkan tamu maupun pemilik ke tim yang tepat.",
      zh: "为一家酒店集团打造品牌与数字形象，涵盖集团识别、各物业页面，以及将住客和业主分流至对应团队的咨询流程。",
      ja: "あるホスピタリティグループのためのブランドとデジタルプレゼンス。グループのアイデンティティ、各施設のページ、そしてゲストとオーナーを適切なチームへ振り分ける問い合わせフローまでをカバーします。"
    },
    longDescription: {
      id: "Sebuah grup perhotelan mengelola lebih dari satu audiens sekaligus: tamu yang mencari tempat menginap, dan pemilik yang mencari seseorang untuk menjalankan propertinya. Situs ini harus berbicara kepada keduanya tanpa membuat salah satunya terasa dinomorduakan. Kami membangun identitas grup lebih dulu, lalu halaman properti yang berada di bawahnya, dan memisahkan alur pertanyaan sehingga setiap audiens sampai ke kotak masuk yang tepat lengkap dengan konteksnya.",
      zh: "一家酒店集团要同时面对不止一类受众：寻找住处的住客，以及希望有人代为经营物业的业主。网站必须同时打动两者，不能让任何一方显得被敷衍。我们先确立集团识别，再搭建其下的各物业页面，并将咨询流程分流，让每一类受众都能连同背景信息一起抵达正确的收件箱。",
      ja: "ホスピタリティグループは、一度に複数のオーディエンスを相手にします。滞在先を探すゲストと、物件の運営を任せたいオーナーです。サイトはその両方に語りかけ、どちらも後回しに感じさせてはなりません。私たちはまずグループのアイデンティティを作り、その下に連なる施設ページを構築。そして問い合わせフローを分け、それぞれのオーディエンスが文脈を添えたまま適切な受信箱に届くようにしました。"
    },
    scope: [
      { id: "Identitas grup dan sistem visual", zh: "集团识别与视觉系统", ja: "グループのアイデンティティとビジュアルシステム" },
      { id: "Halaman properti dan venue dengan tata letak yang mengutamakan foto", zh: "以图片为主的物业与场地页面", ja: "写真主体のレイアウトによる施設・会場ページ" },
      { id: "Pengarahan pertanyaan yang dipisah antara tamu dan pemilik", zh: "针对住客与业主分开处理的咨询分流", ja: "ゲストとオーナーで分けた問い合わせの振り分け" },
      { id: "Manajemen konten untuk tarif dan ketersediaan", zh: "房价与空房情况的内容管理", ja: "料金と空室状況のコンテンツ管理" },
      { id: "Penyiapan SEO di seluruh halaman properti", zh: "覆盖各物业页面的 SEO 设置", ja: "各施設ページにわたる SEO の設定" }
    ],
    location: { id: "Bali, Indonesia", zh: "Bali, Indonesia", ja: "Bali, Indonesia" },
    tags: [
      { id: "Web", zh: "网页", ja: "ウェブ" },
      { id: "Merek", zh: "品牌", ja: "ブランド" },
      { id: "Perhotelan", zh: "酒店服务", ja: "ホスピタリティ" }
    ]
  },
  {
    title: { id: "Situs Logistik & Alur Penawaran Harga", zh: "物流网站与报价流程", ja: "物流サイトと見積もりフロー" },
    blurb: { id: "Kargo dan pengiriman barang di seluruh Indonesia", zh: "覆盖 Indonesia 全境的货运与运输", ja: "Indonesia 全域の貨物・輸送" },
    category: { id: "Kehadiran Digital", zh: "数字形象", ja: "デジタルプレゼンス" },
    description: {
      id: "Kehadiran digital untuk operator kargo dan pengiriman barang, lengkap dengan halaman layanan dan rute, permintaan penawaran yang terstruktur, serta informasi pelacakan yang ditempatkan di tempat yang benar-benar dicari pelanggan.",
      zh: "为一家货运与物流运营商打造数字形象，包含服务与线路页面、结构化的报价申请，以及放在客户真正会查看之处的货物追踪信息。",
      ja: "貨物・輸送事業者のためのデジタルプレゼンス。サービスとルートのページ、項目立てされた見積もり依頼、そして顧客が実際に探す場所に置いた追跡情報を備えています。"
    },
    longDescription: {
      id: "Pelanggan pengiriman datang dengan satu pertanyaan spesifik: bisakah Anda memindahkan ini, dari sini ke sana, kapan, dan berapa biayanya. Tampilan lama membuat mereka harus menggali sendiri jawabannya. Kami membangun ulang seputar pertanyaan itu, halaman layanan dan rute yang menjawabnya langsung, permintaan penawaran yang menangkap detail kargo sejak awal sehingga tim operasional bisa membalas dengan angka yang nyata, dan informasi pelacakan yang ditempatkan di tempat yang sudah dicari pelanggan, bukan terkubur satu tingkat di bawah.",
      zh: "货运客户带着一个明确的问题而来：这批货，从这里到那里，什么时候能到，要花多少钱，你们能运吗。旧版页面却要他们自己去翻找答案。我们围绕这个问题重建：服务与线路页面直接给出回答，报价申请一开始就收集货物明细，好让运营团队回复实实在在的数字，而追踪信息也放在客户本来就会看的位置，而不是埋在下一层。",
      ja: "貨物の顧客は、はっきりした問いを抱えてやって来ます。これを、ここからそこまで、いつまでに、いくらで運べるか。以前のサイトでは、その答えを自分で掘り出さなければなりませんでした。私たちはその問いを軸に作り直しました。直接答えるサービス・ルートページ、最初から貨物の詳細を取り込み、オペレーションが実際の金額で返せる見積もり依頼、そして一段下に埋もれさせず、顧客がすでに見ている場所に置いた追跡情報です。"
    },
    scope: [
      { id: "Halaman layanan dan rute untuk pengiriman udara, laut, dan darat", zh: "涵盖空运、海运与陆运的服务与线路页面", ja: "航空・海上・陸上輸送に対応したサービス・ルートページ" },
      { id: "Permintaan penawaran terstruktur dengan detail kargo", zh: "包含货物明细的结构化报价申请", ja: "貨物の詳細を含む項目立てされた見積もり依頼" },
      { id: "Informasi pelacakan dan pengiriman yang ditampilkan di depan", zh: "在显眼位置呈现的追踪与运单信息", ja: "追跡・配送情報を前面に表示" },
      { id: "Pengarahan pertanyaan lewat WhatsApp ke tim operasional", zh: "将 WhatsApp 咨询分流至运营团队", ja: "WhatsApp の問い合わせをオペレーションチームへ振り分け" },
      { id: "Penyiapan SEO untuk pencarian rute dan layanan", zh: "针对线路与服务搜索的 SEO 设置", ja: "ルート・サービス検索向けの SEO 設定" }
    ],
    location: { id: "Indonesia", zh: "Indonesia", ja: "Indonesia" },
    tags: [
      { id: "Web", zh: "网页", ja: "ウェブ" },
      { id: "Logistik", zh: "物流", ja: "物流" },
      { id: "Operasional", zh: "运营", ja: "オペレーション" }
    ]
  },
  {
    title: { id: "Otomasi Permintaan Kampanye", zh: "活动申请自动化", ja: "キャンペーン申請の自動化" },
    blurb: { id: "Agensi pemasaran rekrutmen di EU", zh: "位于 EU 的招聘营销代理机构", ja: "EU の採用マーケティングエージェンシー" },
    category: { id: "Otomasi AI", zh: "AI 自动化", ja: "AI 自動化" },
    description: {
      id: "Intake yang mengarahkan dirinya sendiri untuk brief kampanye baru. Formulir WordPress menuju pipeline Make.com yang mengekstrak domain, mencocokkan klien di Airtable, mengantrekan tugas Trello, lalu mengirim email ke tim dan klien, semuanya tuntas dalam hitungan detik.",
      zh: "新活动简报的自动分流受理。WordPress 表单接入 Make.com 流程，自动提取域名、在 Airtable 中匹配客户、在 Trello 中排入任务，并向团队和客户发送邮件，整个过程在几秒内完成。",
      ja: "新しいキャンペーンブリーフを自動で振り分けて受け付けます。WordPress のフォームから Make.com のパイプラインへ渡し、ドメインを抽出し、Airtable でクライアントを照合し、Trello にタスクを積み、チームとクライアントへメールを送信。すべてが数秒で完結します。"
    },
    longDescription: {
      id: "RADcruiters menjalankan kampanye rekrutmen berbasis Meta-ads untuk agensi penyedia tenaga kerja, sebuah layanan yang sangat personal dengan volume intake yang tinggi. Formulir permintaan kampanye telah menjadi penghambat: setiap brief memberi notifikasi ke tim di Slack, seseorang mengurai URL secara manual, mencari kliennya, lalu membuat kartu Trello. Kami membangun ulang proses intake sebagai pipeline yang mengarahkan dirinya sendiri. Dari pengiriman, dalam hitungan detik, ke orang yang tepat yang melihat kartu yang tepat dengan konteks yang tepat, dan klien langsung mendapat konfirmasi yang berbunyi 'kami sudah menerimanya.'",
      zh: "RADcruiters 为人力中介机构运营基于 Meta 广告的招聘活动，这是一项高频受理、需要大量人工跟进的服务。活动申请表单一度成了瓶颈：每份简报都会在 Slack 里通知团队，得有人手动解析 URL、查找客户，再创建 Trello 卡片。我们把整个受理流程重建为自动分流的管线。从提交到正确的人看到带有正确背景信息的正确卡片，只需几秒，客户也会立刻收到一条确认——「我们已经收到了」。",
      ja: "RADcruiters は人材紹介会社向けに Meta 広告の採用キャンペーンを運用しており、手厚い対応と大量の受付を伴うサービスです。キャンペーン申請フォームはボトルネックになっていました。ブリーフが届くたびに Slack でチームに通知が飛び、誰かが手作業で URL を解析し、クライアントを調べ、Trello カードを作成する。私たちはこの受付を、自動で振り分けるパイプラインとして作り直しました。送信から数秒で、適切な担当者が適切な文脈のついた適切なカードを目にし、クライアントには「受け取りました」という確認が即座に届きます。"
    },
    scope: [
      { id: "Formulir intake WordPress untuk brief kampanye klien", zh: "用于接收客户活动简报的 WordPress 表单", ja: "クライアントのキャンペーンブリーフを受け付ける WordPress フォーム" },
      { id: "Pipeline Make.com (webhook khusus → Trello → Airtable → Gmail)", zh: "Make.com 流程（自定义 webhook → Trello → Airtable → Gmail）", ja: "Make.com のパイプライン（カスタム webhook → Trello → Airtable → Gmail）" },
      { id: "Ekstraksi domain + pencocokan klien dari URL lowongan", zh: "从职位空缺 URL 中提取域名并匹配客户", ja: "求人 URL からのドメイン抽出とクライアント照合" },
      { id: "Pembuatan otomatis tugas Trello lengkap dengan data brief", zh: "自动创建包含完整简报数据的 Trello 任务", ja: "ブリーフの全データを含む Trello タスクを自動作成" },
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
  {
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
  {
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
  }
];

const INSIGHT_TX: Array<InsightTx | undefined> = [
  {
    title: {
      id: "Mendesain untuk sorotan panggung, bukan brosur",
      zh: "为聚光灯而设计，而非为宣传册",
      ja: "パンフレットではなく、スポットライトのためにデザインする"
    },
    tag: {
      id: "Web · Motion",
      zh: "网页 · 动效",
      ja: "Web · モーション"
    },
    excerpt: {
      id: "Kebanyakan situs marketing dibangun seperti brosur, setiap layanan digelar di halaman depan, tanpa satu pun yang benar-benar mengundang klik. Tugas sebuah homepage bukanlah mencantumkan segalanya. Tugasnya adalah menahan perhatian selama empat detik berikutnya.",
      zh: "大多数营销网站都做得像宣传册，每一项服务都摊在首页上，却没有一项能真正赢得点击。首页的任务不是把一切都罗列出来，而是在接下来的四秒里留住注意力。",
      ja: "多くのマーケティングサイトはパンフレットのように作られている。あらゆるサービスがトップページに並べられ、そのどれもがクリックを勝ち取れていない。ホームページの仕事は、すべてを並べ立てることではない。次の四秒間、注意を引きとめることだ。"
    },
    body: [
      {
        id: "Buka sepuluh homepage agensi dan Anda akan melihat arsitektur yang sama. Sebuah hero, daftar layanan, grid klien, deretan penghargaan, pernyataan misi, formulir kontak. Informasinya ada, tetapi situsnya tidak terbaca seperti sebuah panggung. Ia terbaca seperti brosur yang ditempel seseorang di dinding.",
        zh: "随便打开十家代理商的首页，你会看到相同的结构。一个 hero、一列服务、一格格客户 logo、一排奖项、一段使命宣言、一个联系表单。信息都在，但整个网站读起来不像一座舞台，而像有人钉在墙上的一张宣传册。",
        ja: "エージェンシーのホームページを十個開いてみれば、同じ構造が見えてくる。hero があり、サービスの一覧、クライアントのグリッド、受賞歴の列、ミッションステートメント、問い合わせフォーム。情報はそろっている。だがそのサイトはステージのようには読めない。誰かが壁にピン留めしたパンフレットのように読める。"
      },
      {
        id: "Brosur tidak perlu merebut perhatian. Pembacanya sudah memegang kertas itu. Situs web berbeda. Pengunjung datang dengan pertanyaan yang belum utuh dan pergi begitu halaman berhenti menjawabnya. Memperlakukan homepage seperti brosur, setiap layanan, setiap kapabilitas, setiap penghargaan digelar rata, menjamin bahwa scroll pertama adalah yang terakhir.",
        zh: "宣传册不必去争取注意力，读者本来就已经把纸拿在手里。网站不一样。访客带着一个还没成形的问题到来，一旦页面不再回答它，他们就离开。把首页当成宣传册来做，把每一项服务、每一种能力、每一个荣誉都平铺开来，几乎注定了第一次滚动就是最后一次。",
        ja: "パンフレットは注意を勝ち取る必要がない。読者はすでに紙を手にしている。ウェブサイトは違う。訪問者は半ば形になりかけた問いを抱えてやって来て、ページがそれに答えるのをやめた瞬間に去っていく。ホームページをパンフレットのように扱い、あらゆるサービス、あらゆる能力、あらゆる栄誉を平らに並べてしまえば、最初のスクロールが最後のスクロールになることは約束されたようなものだ。"
      },
      {
        id: "Kami mendesain dengan cara sebaliknya. Homepage bukanlah brosur. Ia adalah sorotan panggung. Tahan selama empat detik: satu pernyataan, satu gerak yang membuat orang berhenti sejenak, satu arah yang bisa dituju pengunjung berikutnya. Selebihnya berada di hilir, halaman layanan, studi kasus, kontak, dan semua itu ada karena homepage-lah yang membuka pintunya.",
        zh: "我们的做法恰恰相反。首页不是宣传册，而是聚光灯。把它撑住四秒：一句宣言，一段值得让人停下来的动效，一个访客接下来可以前往的方向。其余的一切都在下游，服务页、案例研究、联系方式，它们之所以存在，是因为首页先替它们打开了门。",
        ja: "私たちは逆のやり方でデザインする。ホームページはパンフレットではない。スポットライトだ。それを四秒間、保ちきる。ひとつの宣言、立ち止まる価値のあるひとつのモーション、訪問者が次に進める一つの方向。それ以外はすべて下流にある。サービスページ、ケーススタディ、問い合わせ。それらが存在できるのは、ホームページが先に扉を開いたからだ。"
      },
      {
        id: "Brosur membuktikan Anda ada. Homepage membuktikan Anda layak untuk di-scroll.",
        zh: "宣传册证明你存在，首页证明你值得被继续往下滚。",
        ja: "パンフレットはあなたが存在することを証明する。ホームページはあなたがスクロールする価値があることを証明する。"
      },
      {
        id: "Motion adalah pengalinya. Hero yang diam berkata \"inilah kami.\" Hero yang berulang, tiga detik tekstur, proses yang sedang berjalan, cahaya yang bergerak melintasi bingkai, berkata \"beginilah rasanya bekerja dengan kami.\" Perbedaan antara keduanya adalah perbedaan antara membuktikan Anda ada dan membuktikan Anda layak untuk di-scroll.",
        zh: "动效是那个放大器。静止的 hero 说的是「我们在这儿」。而循环播放的 hero，三秒的质感、进行中的工作、光在画面里移动，说的是「和我们合作是什么感觉」。两者之间的差别，正是证明你存在与证明你值得被往下滚之间的差别。",
        ja: "モーションは倍率を生む。静止した hero は「ここに私たちがいます」と言う。ループする hero は、三秒間のテクスチャ、進行中の仕事、フレームを横切って動く光をもって、「私たちと働くとはこういう感覚です」と言う。両者の違いは、あなたが存在することを証明するのと、スクロールする価値があることを証明するのとの違いだ。"
      },
      {
        id: "Ketika kami membangun onyxcreative.asia, heronya adalah loop enam detik, bukan foto statis. Halaman itu membuat satu janji, studio independen, empat disiplin, tim yang ambisius, dan membiarkan pengunjung bernapas. Apa pun tambahan di slide pertama akan mematikannya.",
        zh: "我们在做 onyxcreative.asia 时，hero 是一段六秒的循环，而不是一张静态照片。这个页面只许下一个承诺，独立工作室、四门专业、志向远大的团队，然后让访客有空间喘口气。第一屏上再多加任何东西，都会把它毁掉。",
        ja: "onyxcreative.asia を作ったとき、hero は静止画ではなく六秒のループにした。ページはひとつの約束だけを掲げる。独立系スタジオ、四つの専門領域、野心的なチーム。そして訪問者に息をつく余白を与える。最初のスライドにそれ以上を載せていたら、すべてを台無しにしていただろう。"
      }
    ]
  },
  {
    title: {
      id: "Ketika agen AI benar-benar layak duduk di meja",
      zh: "当 AI 代理真正赢得一席之地",
      ja: "AI エージェントが会議の席を勝ち取るとき"
    },
    tag: {
      id: "Sistem AI",
      zh: "AI 系统",
      ja: "AI システム"
    },
    excerpt: {
      id: "Sebagian besar \"AI\" yang dijual ke brand hanyalah chatbot yang ditempelkan pada formulir kontak. AI yang sesungguhnya merebut tempatnya dengan menghapus pekerjaan yang tak seorang pun mau lakukan, diam-diam, di latar belakang, tanpa meminta pujian.",
      zh: "卖给品牌的大多数所谓「AI」，不过是拴在联系表单上的一个聊天机器人。真正的 AI 靠的是替人清除那些没人愿意做的工作来赢得自己的位置，安静地、在后台、不求任何功劳。",
      ja: "ブランドに売り込まれる「AI」の多くは、問い合わせフォームに取り付けられたチャットボットにすぎない。本物の AI は、誰もやりたがらなかった仕事を取り除くことでその席を勝ち取る。静かに、裏側で、手柄を求めることもなく。"
    },
    body: [
      {
        id: "Ada versi AI yang berisik. Sebuah widget di sudut halaman, avatar yang memantul-mantul, sapaan ramah yang tak diminta siapa pun. AI jenis ini mengumumkan dirinya sendiri. Ia ingin digunakan. Nyatanya jarang.",
        zh: "有一种 AI 是喧闹的。页面角落里的一个小挂件、一个蹦跳的头像、一句没人要求过的友好问候。这类 AI 大声宣告自己的存在，它渴望被使用，却极少真的被用到。",
        ja: "騒がしいタイプの AI がある。ページの隅のウィジェット、跳ねまわるアバター、誰も頼んでいない親しげな挨拶。この種の AI は自分の存在を大々的に告げる。使われたがっている。だが、めったに使われない。"
      },
      {
        id: "Versi yang lain bersifat senyap. Sebuah pipeline yang menerima kiriman formulir, mencari data klien, membuat kartu yang tepat di tool yang tepat, memicu notifikasi yang tepat, semuanya dalam hitungan detik, semuanya tanpa ada orang yang menyadari ia berjalan. AI jenis ini layak duduk di meja karena menyingkirkan pekerjaan repetitif. Tak ada yang membicarakannya, karena memang bukan itu intinya.",
        zh: "另一种 AI 是安静的。一条流水线接收一次表单提交，查出对应的客户，在正确的工具里创建正确的卡片，触发正确的通知，一切都在几秒内完成，全程没有人察觉它运行过。这类 AI 靠清除琐碎杂务赢得桌上的一席之地。没人谈论它，因为它本就不是重点。",
        ja: "もう一つのタイプは静かだ。フォームの送信を受け取り、クライアントを照合し、適切なツールに適切なカードを作り、適切な通知を送る。すべて数秒のうちに、誰にも動いたと気づかれることなく。この種の AI は、雑務を取り除くことで会議の席を勝ち取る。誰もそれを話題にしないのは、それが主役ではないからだ。"
      },
      {
        id: "Ketika kami membangun otomasi permintaan kampanye untuk RADcruiters, briefnya tampak sederhana. Ganti satu formulir. Kenyataannya, satu formulir itu diam-diam telah menjadi penyumbat bagi sebuah agensi recruitment-marketing. Setiap brief mengirim notifikasi ke tim di Slack. Seseorang mengurai URL secara manual, mencari klien di Airtable, membuat kartu Trello, menyusun draf email konfirmasi. Formulirnya tidak rusak. Serah-terimanya yang bermasalah.",
        zh: "我们为 RADcruiters 搭建活动申请自动化时，需求看起来很简单，替换掉一个表单。而现实是，这一个表单已经悄然成为这家招聘营销代理商的瓶颈。每一份需求都会在 Slack 里提醒团队。有人手动解析 URL，在 Airtable 里查客户，做一张 Trello 卡片，起草一封确认邮件。表单本身没坏，坏在中间的交接环节。",
        ja: "RADcruiters のキャンペーン申請の自動化を作ったとき、要件は単純に見えた。フォームをひとつ置き換えるだけ。だが実際には、そのひとつのフォームが、ある採用マーケティング代理店にとって静かにボトルネックになっていた。要件が届くたびに Slack でチームに通知が飛ぶ。誰かが手作業で URL を読み解き、Airtable でクライアントを調べ、Trello のカードを作り、確認メールの下書きを書く。壊れていたのはフォームではない。受け渡しの部分だった。"
      },
      {
        id: "Sistem AI terbaik adalah yang tak pernah disadari pelanggan Anda, masalah mereka begitu saja terselesaikan.",
        zh: "最好的 AI 系统，是那种你的客户根本察觉不到的系统，他们的问题就那么被解决了。",
        ja: "最良の AI システムとは、顧客がまったく気づかないもの。彼らの問題は、いつのまにか解決されている。"
      },
      {
        id: "Kami membangun ulang proses intake sebagai sebuah pipeline. Kiriman WordPress memicu webhook. Webhook mengekstrak URL lowongan, mencocokkan klien di Airtable, mengantrikan tugas Trello lengkap dengan briefnya, memicu peringatan untuk tim dan konfirmasi untuk klien. Dari ujung ke ujung dalam hitungan detik. Formulirnya tampak sama persis. Pekerjaan di baliknya lenyap.",
        zh: "我们把这套接收流程重建成了一条流水线。WordPress 的提交触发一个 webhook。webhook 提取职位 URL，在 Airtable 里匹配客户，把带有完整需求的 Trello 任务排入队列，触发一条团队提醒和一条客户确认。端到端，几秒之内完成。表单看上去一模一样，它背后的工作却消失了。",
        ja: "私たちは受付の流れをパイプラインとして作り直した。WordPress の送信が webhook を発火させる。webhook は求人の URL を抽出し、Airtable でクライアントを照合し、完全な要件を添えた Trello のタスクをキューに入れ、チームへのアラートとクライアントへの確認を送る。端から端まで数秒で。フォームの見た目はまったく同じ。その裏側の作業は消えた。"
      },
      {
        id: "Itulah ujiannya. Jika permukaan yang terlihat tetap sama dan pekerjaannya menjadi lebih cepat, AI itu telah menjalankan tugasnya. Jika permukaan yang terlihat justru mendapat avatar memantul yang baru dan pekerjaannya berjalan sama lambatnya, berarti Anda membeli sebuah chatbot.",
        zh: "这就是检验标准。如果可见的表层看起来没变，而工作变快了，那 AI 就尽到了本分。如果可见的表层多了一个蹦跳的新头像，而工作速度还是老样子，那你买到的只是一个聊天机器人。",
        ja: "それが試金石だ。表に見える部分は変わらないのに仕事が速くなったなら、AI は役割を果たした。表に見える部分に跳ねるアバターが新しく増えただけで、仕事の速さが変わらないなら、あなたが買ったのはチャットボットだ。"
      }
    ]
  },
  {
    title: {
      id: "Kreatif performance bukanlah bahasa yang berbeda. Ini bahasa yang sama, hanya lebih cepat.",
      zh: "效果广告创意并不是另一种语言，它是同一种语言，只是更快。",
      ja: "パフォーマンス向けのクリエイティブは、別の言語ではない。同じ言語を、より速く話すだけだ。"
    },
    tag: {
      id: "Media Berbayar",
      zh: "付费媒体",
      ja: "有料メディア"
    },
    excerpt: {
      id: "Ada mitos bahwa kreatif berbayar adalah disiplin tersendiri. Bukan. Tim yang membangun brand seharusnya juga yang menjalankan iklan berbayar, keahlian yang sama, suara yang sama, hanya dengan siklus yang lebih rapat dan metrik keberhasilan yang berbeda.",
      zh: "有一种迷思，认为付费广告创意是一门自成一体的专业。并非如此。打造品牌的那支团队，就应该来做付费投放，同样的手艺，同样的语气，只是循环更紧凑、衡量成败的指标不同而已。",
      ja: "有料広告のクリエイティブは独立した専門分野だ、という思い込みがある。そうではない。ブランドを築くチームこそが有料広告も回すべきだ。同じ技巧、同じ声、ただループがより短く、成功を測る指標が違うだけだ。"
    },
    body: [
      {
        id: "Sebagian besar studio memisahkan brand dan performance ke dalam dua ruangan. Desainer brand mengerjakan karya yang lambat dan penuh pertimbangan. Desainer performance mengerjakan karya yang cepat dan sekali pakai. Kedua tim memakai tool yang berbeda, referensi yang berbeda, dan, di suatu titik, standar estetika yang berbeda pula.",
        zh: "大多数工作室把品牌和效果分进两个房间。品牌设计师做的是慢工出细活、深思熟虑的作品，效果设计师做的是快速、用完即弃的作品。两个团队用着不同的工具、不同的参考，而且不知不觉间，还有了不同的审美标准。",
        ja: "多くのスタジオは、ブランドとパフォーマンスを二つの部屋に分けてしまう。ブランドのデザイナーは、じっくり時間をかけた作品を作る。パフォーマンスのデザイナーは、速くて使い捨ての作品を作る。二つのチームは違うツール、違うリファレンスを使い、そしていつのまにか、違う美的基準まで持つようになる。"
      },
      {
        id: "Itu pemisahan yang keliru. Audiens tidak tahu dari ruangan mana sebuah karya berasal. Mereka scroll. Iklan itu entah berhasil merebut dua detik berikutnya atau tidak. Apakah ia dibuat oleh tim brand atau tim performance sama sekali tidak relevan.",
        zh: "这是一种虚假的划分。观众并不知道一件作品出自哪个房间。他们只是往下滑。那条广告要么赢得接下来的两秒，要么赢不到。它是品牌团队做的还是效果团队做的，无关紧要。",
        ja: "それは誤った線引きだ。観客は、その一枚がどの部屋から来たのかを知らない。ただスクロールするだけだ。広告は次の二秒を勝ち取るか、勝ち取れないかのどちらかでしかない。それをブランドチームが作ったのか、パフォーマンスチームが作ったのかは、どうでもいい。"
      },
      {
        id: "Yang memang berubah antara karya brand dan karya performance adalah kadensinya. Kampanye brand diluncurkan sekali dalam satu kuartal. Kampanye berbayar meluncurkan empat puluh varian dalam seminggu. Keahliannya harus dipadatkan. Tetapi memadatkan tidak sama dengan berkompromi. Desainer yang sama, yang mampu menjaga garis brand selama setahun, mampu menjaganya di empat puluh varian iklan, asalkan sistemnya mendukung mereka.",
        zh: "在品牌工作和效果工作之间，真正改变的是节奏。品牌活动每个季度上一次，付费活动一周就要上四十个版本。手艺必须被压缩。但压缩不等于将就。那个能把品牌调性守住一整年的设计师，同样能把它守在四十个广告版本里，只要有系统在背后支撑他们。",
        ja: "ブランドの仕事とパフォーマンスの仕事のあいだで実際に変わるのは、リズムだ。ブランドキャンペーンは四半期に一度立ち上がる。有料キャンペーンは一週間で四十のバリエーションを出す。技巧は圧縮しなければならない。だが、圧縮することは妥協することと同じではない。一年間ブランドの筋を通せるデザイナーは、四十の広告バリエーションにわたってもそれを通せる。システムが支えてくれさえすれば。"
      },
      {
        id: "Belanja yang terus berbunga bukan taktik anggaran. Itu taktik kreatif.",
        zh: "会复利增长的投放，靠的不是预算策略，而是创意策略。",
        ja: "複利で効いてくる出稿は、予算の戦術ではない。クリエイティブの戦術だ。"
      },
      {
        id: "Sistemlah yang membuat kreatif performance menjadi mungkin. Kombinasi tipografi yang konsisten, pola headline yang telah teruji, sebuah pustaka kecil berisi elemen bergerak yang bisa dirangkai ulang. Tanpa itu, setiap iklan baru adalah mulai dari nol, dan tim kreatif kehabisan tenaga di minggu ketiga. Dengan itu, iklan nomor empat puluh punya integritas brand yang sama dengan materi cetak aslinya, dan kemungkinan besar berkonversi lebih baik.",
        zh: "让效果创意成为可能的，正是那套系统。一个稳定统一的字体组合、一套经过验证的标题模式、一个由可重新组合的动态元素构成的小素材库。没有它，每一条新广告都是从零开始，创意团队撑到第三周就会燃尽。有了它，第四十条广告与最初那件印刷作品拥有同样的品牌完整度，而且转化率大概还更高。",
        ja: "パフォーマンスのクリエイティブを可能にするのは、システムだ。一貫した書体の組み合わせ、検証済みの見出しのパターン、組み替えられる動く要素の小さなライブラリ。それがなければ、新しい広告は毎回ゼロからのスタートになり、クリエイティブチームは三週目で燃え尽きる。それがあれば、四十本目の広告も最初の印刷物と同じブランドの一貫性を保ち、しかもおそらくコンバージョンはより高い。"
      },
      {
        id: "Ketika kami menjalankan iklan berbayar untuk klien, sistem kreatif adalah bagian dari kerja sama itu, bukan sesuatu yang terpisah. Tim iklan dan tim brand adalah tim yang sama. Yang berubah hanyalah metrik keberhasilannya, ROAS alih-alih awareness, tetapi keahliannya identik. Belanja yang terus berbunga bukan sekadar taktik anggaran. Itu taktik kreatif.",
        zh: "当我们为客户做付费投放时，创意系统是这份合作的一部分，而不是与之分开的东西。广告团队和品牌团队是同一支团队。改变的只是衡量成败的指标，用 ROAS 取代认知度，但手艺是一模一样的。会复利增长的投放，不只是一种预算策略，更是一种创意策略。",
        ja: "クライアントの有料広告を回すとき、クリエイティブのシステムはその契約の一部であって、切り離されたものではない。広告チームとブランドチームは同じチームだ。変わるのは成功の指標だけ、認知度ではなく ROAS、だが技巧はまったく同じだ。複利で効いてくる出稿は、単なる予算の戦術ではない。クリエイティブの戦術でもある。"
      }
    ]
  },
  {
    title: {
      id: "Mengapa kami memberikan hero video, bukan hero image",
      zh: "为什么我们交付的是 hero 视频，而不是 hero 图片",
      ja: "なぜ私たちは hero 画像ではなく hero 動画を届けたのか"
    },
    tag: {
      id: "Web · Merek",
      zh: "网页 · 品牌",
      ja: "Web · ブランド"
    },
    excerpt: {
      id: "Hero image adalah sebuah kartu pos. Hero video adalah sebuah momen. Viewport pertama pada sebuah homepage bukanlah tempat untuk berhemat, melainkan tempat untuk menetapkan suhu bagi seluruh sisa kunjungan.",
      zh: "hero 图片是一张明信片，hero 视频是一个瞬间。首页的第一屏不是讲求效率的地方，而是为接下来整段访问定下温度的地方。",
      ja: "hero 画像は絵はがきだ。hero 動画は一つの瞬間だ。ホームページの最初のビューポートは、効率を求める場所ではない。訪問の残り全体の温度を決める場所だ。"
    },
    body: [
      {
        id: "Hero image adalah pilihan default. Ia memuat dengan cepat, mudah diarahkan secara artistik, dan bisa ditukar per kampanye tanpa perlu membangun ulang apa pun. Ia juga sangat buruk dalam menyampaikan atmosfer. Sebuah foto menahan perhatian pembaca hanya selama mata mereka mencatatnya. Setelah itu, scroll pun berlanjut.",
        zh: "hero 图片是默认选项。它加载快、易于做艺术指导，还能按不同活动随时替换，而不用重建任何东西。可它在传达氛围这件事上做得很糟。一张照片留住读者注意力的时间，只够眼睛把它认出来那么久，然后滚动就继续了。",
        ja: "hero 画像はデフォルトの選択肢だ。読み込みが速く、アートディレクションもしやすく、何も作り直さずにキャンペーンごとに差し替えられる。だが、雰囲気を伝えるという点では、ひどく不出来だ。写真が読者の注意を引きとめられるのは、目がそれを認識するのにかかるあいだだけ。そして、スクロールは続いていく。"
      },
      {
        id: "Sebuah loop berbeda. Enam detik tekstur, cahaya yang bergerak di dinding, tipografi yang menyusun dirinya sendiri, sebuah tangan di tengah gerakan, memberi pengunjung sesuatu untuk didiami. Halaman itu menjadi sebuah tempat, bukan selebaran. Pembaca bahkan tidak menyadari mengapa mereka berhenti sejenak; mereka hanya berhenti.",
        zh: "循环则不同。六秒的质感，光在墙上移动，字体自行拼合，一只手停在动作中途，给了访客一个可以安顿下来的地方。页面于是成了一处场所，而不是一张传单。读者甚至没意识到自己为何停了下来，他们就是停下了。",
        ja: "ループは違う。六秒間のテクスチャ、壁を移ろう光、文字がひとりでに組み上がっていく様子、動作の途中で止まった手。それらは訪問者に、腰を落ち着ける何かを与える。ページはチラシではなく、一つの場所になる。読者は、自分がなぜ立ち止まったのかにさえ気づかない。ただ立ち止まっているのだ。"
      },
      {
        id: "Ada harga yang nyata untuk itu. Video lebih berat daripada gambar, dan hosting yang malas akan menjatuhkan Core Web Vitals kalau Anda tidak berhati-hati. Kami menyiasatinya dengan cara yang jelas: sebuah poster image dimuat lebih dulu (cepat, di-decode inline), video mulai diputar begitu selesai di-buffer, dan sebuah fallback webm menyasar browser yang tidak sanggup menangani ukuran encode-nya. Pengunjung melihat hero yang diam dalam 200 ms dan hero yang bergerak setengah detik kemudian.",
        zh: "这是有实实在在代价的。视频比图片重，如果托管做得草率，一不小心就会把 Core Web Vitals 拖垮。我们用最直接的方式来缓解：先加载一张 poster 图片（快，内联解码），视频一缓冲好就开始播放，再用一个 webm 备选去应对那些扛不住编码体积的浏览器。访客在 200 ms 内看到静止的 hero，半秒后再看到会动的那个。",
        ja: "そこには実際のコストがある。動画は画像より重く、ホスティングがずさんだと、油断すれば Core Web Vitals を台無しにしかねない。私たちは当たり前のやり方でそれを和らげる。まず poster 画像を読み込み（速く、インラインでデコードされる）、バッファが済み次第、動画の再生を始め、エンコードのサイズを扱えないブラウザには webm のフォールバックを当てる。訪問者は 200 ミリ秒で静止した hero を目にし、その半秒後に動く hero を目にする。"
      },
      {
        id: "Hero image membuktikan halaman telah dimuat. Hero loop membuktikan halaman itu layak dilirik untuk kedua kalinya.",
        zh: "hero 图片证明页面加载好了，hero 循环证明这个页面值得再看一眼。",
        ja: "hero 画像はページが読み込まれたことを証明する。hero ループはページがもう一度見る価値があることを証明する。"
      },
      {
        id: "Apa yang Anda masukkan ke dalam loop lebih penting daripada fakta bahwa ia berulang. Sinematografi stok akan terbaca persis seperti itu. Klip di onyxcreative.asia adalah still life enam detik tentang proses yang sedang berjalan: tekstur, tipografi, ruang kerja studio itu sendiri. Ia adalah potret diri pada kecepatan satu frame per detik perhatian.",
        zh: "你往循环里放什么，比它会循环这件事本身更重要。素材库里的影像看上去就是素材库的样子。onyxcreative.asia 上的那段片子，是一幅六秒的进行中静物：质感、字体、工作室自己的工作空间。它是一幅以每秒一帧的注意力拍成的自画像。",
        ja: "ループに何を入れるかは、それがループするという事実よりも重要だ。ストックの映像は、まさにストックそのものとして読まれてしまう。onyxcreative.asia のクリップは、進行中の仕事を六秒間で切り取った静物画だ。テクスチャ、文字、スタジオ自身の作業場。それは、一秒あたり一フレームの注意で撮られた自画像だ。"
      },
      {
        id: "Ketika loop itu berakhir, pembaca sudah memutuskan apakah akan terus scroll atau tidak. Jika kami mengerjakannya dengan benar, sisa homepage tidak perlu meyakinkan siapa pun akan apa pun, ia hanya perlu menepati suhu yang telah ditetapkan oleh hero.",
        zh: "当循环结束时，读者其实早已决定要不要继续往下滚。如果我们把活儿干对了，首页余下的部分就不必再去说服谁相信什么，它只需兑现 hero 定下的那个温度。",
        ja: "ループが終わるころには、読者はスクロールを続けるかどうかをすでに決めている。私たちが仕事を正しくやれていれば、ホームページの残りの部分は、誰かに何かを納得させる必要などない。ただ hero が定めた温度に応えればいい。"
      }
    ]
  }
];

/** Aligned to TESTIMONIALS: quote + role (author + client names untranslated). */
const TESTIMONIAL_TX: Array<{ quote?: Tri; role?: Tri } | undefined> = [
  {
    quote: {
      id: "Yang dulu butuh tiga kali ping di Slack dan satu kartu Trello manual, sekarang selesai dalam waktu kurang dari semenit. Tim bisa fokus ke kampanyenya, bukan ke proses masuknya.",
      zh: "过去要在 Slack 里催三次、再手动建一张 Trello 卡片的事，现在不到一分钟就完成了。团队可以专注在活动本身，而不是接收流程上。",
      ja: "以前は Slack で三回声をかけ、Trello のカードを手作業で作っていた作業が、今では一分もかかりません。チームは受付ではなく、キャンペーンそのものに集中できています。",
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" },
  },
  {
    quote: {
      id: "Brand-nya akhirnya sesuai dengan bagaimana salon ini terasa saat dikunjungi langsung. Pemesanan dari pelanggan baru naik dua kali lipat dalam dua bulan setelah peluncuran.",
      zh: "品牌终于和这家沙龙在现场给人的感觉一致了。上线后两个月内，首次到店的预约量翻了一倍。",
      ja: "ブランドが、実際にサロンを訪れたときの感覚とようやく一致しました。公開から二か月で、初めてのお客様の予約が二倍になりました。",
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" },
  },
  {
    quote: {
      id: "Kami ingin websitenya terasa setenang perawatannya sendiri. Onyx membangun situsnya, menjalankan feed media sosialnya, dan mengelola iklannya, pemesanan langsung mengalir ke WhatsApp dan tidak ada yang terlewat. Situsnya berkonversi tiga kali lipat dari perkiraan kami.",
      zh: "我们希望网站给人的感觉，能像护理本身一样从容。Onyx 搭建了网站、运营着社媒内容、也管理着广告投放，预约直接流向 WhatsApp，没有任何遗漏。网站的转化率是我们预期的三倍。",
      ja: "サイトにも、トリートメントそのものと同じ静けさを求めていました。Onyx がサイトを構築し、ソーシャルの発信を回し、広告も運用してくれています。予約はそのまま WhatsApp に流れ、取りこぼしがありません。サイトのコンバージョンは見込みの三倍です。",
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" },
  },
  {
    quote: {
      id: "Dulu tamu harus menyusun gambaran vila kami dari tiga situs berbeda. Sekarang semuanya ada di satu tampilan yang tenang, saring berdasarkan area dan tanggal, lihat vilanya dengan jelas, lalu hubungi kami dalam satu ketukan. Pertanyaan yang masuk terasa jauh lebih serius.",
      zh: "以前住客得从三个不同的网站上，才能拼凑出我们别墅的样子。现在只需一个从容的页面，按区域和日期筛选，把别墅看清楚，一键就能联系我们。收到的咨询明显更精准了。",
      ja: "以前は、ゲストが三つの別々のサイトから私たちのヴィラ像をつなぎ合わせていました。今は落ち着いた一つの画面で、エリアと日程で絞り込み、ヴィラをきちんと見て、ワンタップで連絡できます。問い合わせの質が目に見えて上がりました。",
    },
    role: { id: "Founder", zh: "创始人", ja: "創業者" },
  },
  {
    quote: {
      id: "Situsnya akhirnya berbicara kepada tamu dan pemilik tanpa membuat salah satunya terasa dinomorduakan. Tim membangun brand-nya, halaman propertinya, dan pengarahan pertanyaannya sehingga setiap pesan sampai ke orang yang tepat.",
      zh: "网站终于能同时对住客和业主说话，而不让任何一方显得被敷衍。团队搭建了品牌、物业页面以及咨询分流，让每一条消息都能送到对的人手里。",
      ja: "サイトがようやく、ゲストにもオーナーにも、どちらも後回しにせず語りかけられるようになりました。チームがブランド、施設ページ、そして問い合わせの振り分けまで作ってくれたので、どのメッセージも適切な担当者に届きます。",
    },
    role: { id: "Direktur", zh: "总监", ja: "ディレクター" },
  },
  {
    quote: {
      id: "Pelanggan datang dengan satu pertanyaan: bisa tidak mengirim ini, dan berapa biayanya. Alur penawaran yang baru menangkap detail kargonya sejak awal, jadi tim kami bisa membalas dengan angka yang nyata, bukan tanya-jawab bolak-balik.",
      zh: "客户来的时候只有一个问题：这批货你们能运吗，多少钱。新的报价流程一开始就收集了货物明细，我们团队可以直接回复一个实实在在的数字，不用再来回追问。",
      ja: "お客様は一つの問いを持って来ます。これを運べるか、いくらか。新しい見積もりフローは最初に貨物の詳細を押さえるので、うちのチームは何度もやり取りせず、実際の金額で返せます。",
    },
    role: { id: "Kepala Operasional", zh: "运营负责人", ja: "オペレーション責任者" },
  },
];

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
    s.capabilities.forEach((c, j) => put(m, c, t.capabilities?.[j]));
    s.process.forEach((pr, j) => {
      put(m, pr.title, t.process?.[j]?.title);
      put(m, pr.detail, t.process?.[j]?.detail);
    });
    put(m, s.fitFor, t.fitFor);
    put(m, s.cta.problem, t.cta?.problem);
    put(m, s.cta.solution, t.cta?.solution);
  });

  PROJECTS.forEach((p, i) => {
    const t = PROJECT_TX[i];
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
  });

  INSIGHTS.forEach((ins, i) => {
    const t = INSIGHT_TX[i];
    if (!t) return;
    put(m, ins.title, t.title);
    put(m, ins.tag, t.tag);
    put(m, ins.excerpt, t.excerpt);
    ins.body.forEach((block, j) => {
      const en = typeof block === "string" ? block : block.text;
      put(m, en, t.body?.[j]);
    });
  });

  TESTIMONIALS.forEach((tm, i) => {
    const t = TESTIMONIAL_TX[i];
    if (!t) return;
    put(m, tm.quote, t.quote);
    put(m, tm.role, t.role);
  });

  STATS.forEach((st, i) => put(m, st.label, STAT_TX[i]));

  return m;
}

export const DICT: Maps = build();
