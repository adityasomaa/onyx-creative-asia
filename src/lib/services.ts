import { l, type L } from "@/lib/l10n";
import { PROJECTS, type Project } from "@/lib/data";
import type { SceneId } from "@/components/site/art/scenes";

/**
 * The six disciplines Onyx sells as a digital business development
 * agency. They drive the home hero slider, the Expertise stack, the
 * /services pages, the enquiry form's "what are we making" list, and the
 * JSON-LD service catalogue, so the list exists exactly once.
 *
 * Every string carries all four languages beside it (see `L` in i18n).
 */

export type ServiceId = "web-software" | "branding-design" | "ads-management" | "social-media" | "growth-analytics" | "ai-automation";

export type Service = {
  id: ServiceId;
  number: string;
  /** The motion graphic that illustrates it (components/site/art). */
  art: SceneId;
  title: L;
  /** One line, shown on the closed accordion row and the hero card. */
  short: L;
  /** Display headline when the row is open. */
  headline: L;
  body: L;
  /** What the service covers, as a short list (the detail page). */
  included: L[];
};

export const SERVICES: Service[] = [
  {
    id: "web-software",
    number: "01",
    art: "website-development",
    title: l("Web & Software Development", "Pengembangan Web & Software", "网站与软件开发", "ウェブ・ソフトウェア開発"),
    short: l(
      "Websites that turn visits into enquiries, and the software behind them.",
      "Website yang mengubah kunjungan jadi pertanyaan, beserta software di baliknya.",
      "把访问变成咨询的网站，以及背后的软件。",
      "訪問を問い合わせに変えるサイトと、それを支えるソフトウェア。",
    ),
    headline: l(
      "Designed and built by the same hands.",
      "Dirancang dan dibangun oleh tangan yang sama.",
      "设计和开发，出自同一双手。",
      "設計も実装も、同じ手で。",
    ),
    body: l(
      "Your website is where most people meet the business, and they decide fast. We design and build it ourselves, so what you approved is exactly what goes live. When a template stops fitting, we build the tool itself: booking engines, client portals, internal dashboards and the integrations between the systems you already pay for.",
      "Website adalah tempat kebanyakan orang pertama kali bertemu bisnis Anda, dan mereka memutuskan dengan cepat. Kami merancang dan membangunnya sendiri, jadi yang Anda setujui itulah yang tayang. Saat template sudah tidak muat, kami membangun alatnya sendiri: mesin booking, portal klien, dashboard internal, dan integrasi antar sistem yang sudah Anda bayar.",
      "大多数人第一次认识你的生意是在网站上，而且他们做决定很快。我们自己设计、自己开发，你确认过的样子就是上线的样子。当模板不再合身，我们就直接把工具做出来：预订引擎、客户门户、内部面板，以及你已经在付费使用的各个系统之间的打通。",
      "多くの人が最初に出会うのはウェブサイトで、判断は一瞬です。設計も実装も私たちが行うので、承認したものがそのまま公開されます。テンプレートが合わなくなったら、道具そのものを作ります。予約エンジン、顧客ポータル、社内ダッシュボード、そしてすでに使っているシステム同士の連携。",
    ),
    included: [
      l("Website design and build, every page responsive", "Desain dan pembuatan website, semua halaman responsif", "网站设计与开发，每个页面都适配手机", "ウェブサイトの設計と構築、全ページレスポンシブ対応"),
      l("Booking, payments and forms connected to your tools", "Booking, pembayaran, dan formulir yang terhubung ke alat Anda", "预订、支付和表单，接入你现有的工具", "予約、決済、フォームを既存のツールと連携"),
      l("Custom software: portals, dashboards, internal tools", "Software khusus: portal, dashboard, alat internal", "定制软件：门户、看板、内部工具", "独自ソフトウェア：ポータル、ダッシュボード、社内ツール"),
      l("SEO, speed and schema set up from day one", "SEO, kecepatan, dan schema disiapkan sejak hari pertama", "从第一天起就做好 SEO、速度和结构化数据", "SEO、表示速度、構造化データを初日から"),
      l("A CMS your team can edit without us", "CMS yang bisa diedit tim Anda tanpa kami", "你的团队不靠我们也能编辑的后台", "私たちがいなくても編集できる CMS"),
      l("Hosting, monitoring and fixes after launch", "Hosting, pemantauan, dan perbaikan setelah rilis", "上线后的托管、监控和修复", "公開後のホスティング、監視、修正"),
    ],
  },
  {
    id: "branding-design",
    number: "02",
    art: "design-branding",
    title: l("Branding & Design", "Branding & Desain", "品牌与设计", "ブランディング・デザイン"),
    short: l(
      "Identity, packaging and the rules that keep it consistent.",
      "Identitas, kemasan, dan aturan yang menjaganya tetap konsisten.",
      "品牌识别、包装，以及让它始终一致的规则。",
      "アイデンティティ、パッケージ、そして一貫性を保つためのルール。",
    ),
    headline: l(
      "A look people remember after one glance.",
      "Tampilan yang diingat orang setelah sekali lihat.",
      "看一眼就能记住的样子。",
      "一度見たら覚えている見た目。",
    ),
    body: l(
      "Logo, type, colour and the system that holds them together, carried into everything you print, post and publish, with templates your team can use without us.",
      "Logo, huruf, warna, dan sistem yang menyatukannya, dibawa ke semua yang Anda cetak, posting, dan terbitkan, lengkap dengan template yang bisa dipakai tim Anda tanpa kami.",
      "标志、字体、颜色，以及把它们串在一起的那套系统，延伸到你印的、发的、出版的每一样东西上，再附上你的团队不用找我们也能用的模板。",
      "ロゴ、書体、色、それらをまとめるシステム。印刷物にも投稿にも出版物にも行き渡らせ、私たちがいなくてもチームが使えるテンプレートまで用意します。",
    ),
    included: [
      l("Positioning and naming, written down before anything is drawn", "Positioning dan penamaan, ditulis sebelum apa pun digambar", "先把定位和命名写清楚，再开始画", "描く前に、ポジショニングとネーミングを言葉に"),
      l("Logo, type, colour and a system that holds together", "Logo, tipografi, warna, dan sistem yang konsisten", "标志、字体、颜色，以及一套撑得住的系统", "ロゴ、書体、色、そして崩れないシステム"),
      l("Packaging, signage and print, ready for production", "Kemasan, papan nama, dan cetakan, siap produksi", "包装、招牌和印刷品，可直接投产", "パッケージ、サイン、印刷物を入稿できる状態で"),
      l("Social templates and a photo direction", "Template media sosial dan arahan foto", "社交媒体模板与摄影风格指引", "SNS テンプレートと写真のディレクション"),
      l("Tone of voice: how the brand writes and speaks", "Gaya bahasa: bagaimana brand menulis dan berbicara", "品牌语气：品牌怎么写、怎么说", "トーン・オブ・ボイス：ブランドの書き方と話し方"),
      l("A brand book and every source file", "Brand book dan semua file sumber", "品牌手册和全部源文件", "ブランドブックとすべての元データ"),
    ],
  },
  {
    id: "ads-management",
    number: "03",
    art: "ads-management",
    title: l("Ads Management", "Manajemen Iklan", "广告投放管理", "広告運用"),
    short: l(
      "Google, Meta and TikTok campaigns run against real numbers.",
      "Kampanye Google, Meta, dan TikTok yang dijalankan berdasarkan angka nyata.",
      "以真实数据为准来跑的 Google、Meta 和 TikTok 广告。",
      "実際の数字を基準に回す Google・Meta・TikTok のキャンペーン。",
    ),
    headline: l(
      "Every rupiah accounted for.",
      "Setiap rupiah ada pertanggungjawabannya.",
      "每一分钱都有交代。",
      "1ルピアまで、説明できる運用を。",
    ),
    body: l(
      "Campaigns built around what a customer is actually worth to you, launched, adjusted every week and reported in plain language, across Google, Meta and TikTok.",
      "Kampanye yang dibangun dari berapa sebenarnya nilai seorang pelanggan bagi Anda, diluncurkan, disesuaikan tiap minggu, dan dilaporkan dengan bahasa yang jelas, di Google, Meta, dan TikTok.",
      "围绕一个客户对你到底值多少来搭建广告，上线、每周调整，并用说人话的方式汇报，覆盖 Google、Meta 和 TikTok。",
      "一人のお客様が実際にいくらの価値を持つかを起点に組み立て、配信し、毎週調整し、わかる言葉で報告します。Google・Meta・TikTok で。",
    ),
    included: [
      l("Meta, Google and TikTok campaigns, run from one plan", "Kampanye Meta, Google, dan TikTok, dijalankan dari satu rencana", "Meta、Google 和 TikTok 广告，用同一套计划来跑", "Meta、Google、TikTok の広告を、ひとつの計画で運用"),
      l("Tracking and conversions checked end to end", "Tracking dan konversi dicek dari ujung ke ujung", "追踪和转化设置，从头到尾核对", "計測とコンバージョンを端から端まで確認"),
      l("Ad creative made for each platform", "Materi iklan yang dibuat untuk tiap platform", "为每个平台单独制作的广告素材", "プラットフォームごとに作る広告クリエイティブ"),
      l("Landing pages built to match the ads", "Landing page yang dibuat selaras dengan iklannya", "与广告相匹配的落地页", "広告に合わせて作るランディングページ"),
      l("Weekly optimisation, with budget moved to what works", "Optimasi mingguan, budget dipindah ke yang berhasil", "每周优化，预算向有效的地方倾斜", "毎週の改善、成果の出ているところへ予算を移す"),
      l("A monthly report in plain language", "Laporan bulanan dengan bahasa yang mudah", "用大白话写的月度报告", "わかりやすい言葉の月次レポート"),
    ],
  },
  {
    id: "social-media",
    number: "04",
    art: "social-media",
    title: l("Social Media Management", "Manajemen Media Sosial", "社交媒体运营", "SNS運用"),
    short: l(
      "Planning, posting and replying on a schedule that holds.",
      "Merencanakan, memposting, dan membalas dengan jadwal yang konsisten.",
      "按一个能坚持下去的节奏来策划、发布和回复。",
      "続けられるペースで、企画し、投稿し、返信する。",
    ),
    headline: l(
      "A feed that looks like one company.",
      "Feed yang terlihat seperti satu perusahaan.",
      "一个看起来像出自同一家公司的账号。",
      "ひとつの会社に見えるフィード。",
    ),
    body: l(
      "We plan the calendar, make the posts and answer the comments, so the grid reads as one brand and the account keeps moving while you are busy running the business.",
      "Kami menyusun kalender, membuat postingan, dan membalas komentar, supaya grid terbaca sebagai satu brand dan akun tetap bergerak saat Anda sibuk menjalankan bisnis.",
      "我们排内容日历、做帖子、回评论，让整个主页读起来像一个品牌，也让账号在你忙着做生意的时候照样在动。",
      "カレンダーを組み、投稿を作り、コメントに返信します。グリッドはひとつのブランドとして読め、あなたが本業で忙しい間もアカウントは動き続けます。",
    ),
    included: [
      l("Content pillars and a monthly calendar", "Pilar konten dan kalender bulanan", "内容支柱与月度日历", "コンテンツの柱と月間カレンダー"),
      l("Photo and video, shot on monthly production days", "Foto dan video, dibuat di hari produksi bulanan", "照片和视频，在每月的拍摄日集中制作", "毎月の撮影日でまとめて撮る写真と動画"),
      l("Captions written in your brand's voice", "Caption yang ditulis dengan gaya bahasa brand Anda", "用品牌语气写的文案", "ブランドの口調で書くキャプション"),
      l("Posting on schedule across Instagram, TikTok and LinkedIn", "Posting terjadwal di Instagram, TikTok, dan LinkedIn", "在 Instagram、TikTok 和 LinkedIn 上按计划发布", "Instagram、TikTok、LinkedIn への予定どおりの投稿"),
      l("Comments and messages answered", "Komentar dan pesan dibalas", "评论和私信有人回复", "コメントとメッセージへの返信"),
      l("A monthly read of what grew and what changes next", "Tinjauan bulanan: apa yang tumbuh dan apa yang diubah berikutnya", "每月复盘：什么增长了，下一步改什么", "伸びたものと次に変えることの月次振り返り"),
    ],
  },
  {
    id: "growth-analytics",
    number: "05",
    art: "growth-analytics",
    title: l("Growth & Analytics", "Growth & Analitik", "增长与数据分析", "グロース・アナリティクス"),
    short: l(
      "Tracking, dashboards and reports that mean something.",
      "Tracking, dashboard, dan laporan yang benar-benar berarti.",
      "真正有意义的追踪、面板和报告。",
      "意味のある計測、ダッシュボード、レポート。",
    ),
    headline: l(
      "Know what is working. Fix what isn't.",
      "Tahu apa yang berhasil. Perbaiki yang belum.",
      "知道什么有效，修好什么无效。",
      "効いているものを知り、効いていないものを直す。",
    ),
    body: l(
      "We set the tracking up properly, put the numbers in one dashboard and write a monthly read in plain language, then change the pages and campaigns that move them.",
      "Kami memasang tracking dengan benar, menaruh angkanya di satu dashboard, dan menulis catatan bulanan dengan bahasa yang jelas, lalu mengubah halaman dan kampanye yang menggerakkannya.",
      "我们先把追踪装对，把数字放进一个面板，每月写一份说人话的解读，然后去改那些能推动数字的页面和广告。",
      "計測を正しく設定し、数字をひとつのダッシュボードにまとめ、月に一度わかる言葉で読み解きます。そのうえで、数字を動かすページとキャンペーンを変えていきます。",
    ),
    included: [
      l("Analytics and conversion tracking you can trust", "Analitik dan tracking konversi yang bisa dipercaya", "可信的分析和转化追踪", "信頼できる分析とコンバージョン計測"),
      l("One dashboard with the numbers that matter", "Satu dashboard berisi angka yang penting", "一个只放关键数字的看板", "大事な数字だけのダッシュボード"),
      l("Funnel audits: where people drop off, and why", "Audit funnel: di mana orang berhenti, dan kenapa", "漏斗诊断：人在哪里流失，为什么", "ファネル分析：どこで、なぜ離脱するのか"),
      l("A/B tests on pages, offers and forms", "Uji A/B pada halaman, penawaran, dan formulir", "对页面、优惠和表单做 A/B 测试", "ページ、オファー、フォームの A/B テスト"),
      l("Search, SEO and AI-answer visibility", "Visibilitas di pencarian, SEO, dan jawaban AI", "搜索、SEO 与 AI 答案中的可见度", "検索、SEO、AI の回答での見え方"),
      l("A monthly call with what to try next", "Call bulanan dengan langkah yang dicoba berikutnya", "每月一通电话，定下一步试什么", "次に試すことを決める月一回の通話"),
    ],
  },
  {
    id: "ai-automation",
    number: "06",
    art: "ai-automation",
    title: l("AI Automation", "Otomasi AI", "AI 自动化", "AI オートメーション"),
    short: l(
      "AI receptionists, custom agents and dashboards that fill themselves in.",
      "Resepsionis AI, agen khusus, dan dashboard yang terisi sendiri.",
      "AI 前台、定制智能体，以及自动填好的数据看板。",
      "AI受付、専用エージェント、自動で埋まるダッシュボード。",
    ),
    headline: l(
      "The busywork, handled before you see it.",
      "Pekerjaan rutin, beres sebelum Anda melihatnya.",
      "那些琐碎的活，在你看到之前就办好了。",
      "細かな作業は、目にする前に片づいている。",
    ),
    body: l(
      "Most businesses lose hours to the same questions, the same data entry and the same weekly report. We build AI that takes that work off your team: a receptionist that answers WhatsApp, web chat and calls around the clock and books straight into your calendar; custom agents that qualify leads, chase follow-ups and move data between the tools you already use; and dashboards that fill themselves in. Every system is built on your own data and processes, with a person in the loop where it matters.",
      "Kebanyakan bisnis kehilangan berjam-jam untuk pertanyaan yang sama, input data yang sama, dan laporan mingguan yang sama. Kami membangun AI yang mengambil alih pekerjaan itu dari tim Anda: resepsionis yang menjawab WhatsApp, web chat, dan telepon sepanjang waktu lalu langsung mencatat booking ke kalender Anda; agen khusus yang menyaring prospek, mengejar tindak lanjut, dan memindahkan data antar alat yang sudah Anda pakai; serta dashboard yang terisi sendiri. Setiap sistem dibangun di atas data dan proses Anda sendiri, dengan manusia tetap terlibat di bagian yang penting.",
      "大多数企业把大量时间耗在同样的问题、同样的数据录入和同样的周报上。我们打造 AI，把这些工作从你的团队手里接过来：全天候回复 WhatsApp、网页聊天和电话，并把预约直接写进日历的 AI 前台；筛选潜在客户、追踪跟进、在你现有工具之间搬运数据的定制智能体；以及自己填满数据的看板。每套系统都基于你自己的数据和流程搭建，关键环节仍有人把关。",
      "多くの会社が、同じ質問、同じデータ入力、同じ週次レポートに何時間も費やしています。私たちはその仕事をチームから引き受けるAIをつくります。WhatsApp、ウェブチャット、電話に24時間応答し、予約をそのままカレンダーに入れる受付。見込み客を選別し、フォローアップを追い、すでに使っているツール間でデータを動かす専用エージェント。そして自分で埋まっていくダッシュボード。どのシステムも自社のデータと業務の流れの上に組み、大事なところには人が入ります。",
    ),
    included: [
      l("An AI receptionist for WhatsApp, web chat and phone, around the clock", "Resepsionis AI untuk WhatsApp, web chat, dan telepon, 24 jam", "覆盖 WhatsApp、网页聊天和电话的 AI 前台，全天候在线", "WhatsApp・ウェブチャット・電話に24時間対応するAI受付"),
      l("Bookings and enquiries written straight into your calendar and CRM", "Booking dan pertanyaan langsung masuk ke kalender dan CRM Anda", "预约和咨询直接写进你的日历和 CRM", "予約と問い合わせをカレンダーとCRMへ直接登録"),
      l("Custom agents that qualify leads and chase follow-ups", "Agen khusus yang menyaring prospek dan mengejar tindak lanjut", "筛选潜在客户、追踪跟进的定制智能体", "見込み客を選別し、フォローアップを追う専用エージェント"),
      l("Dashboards and reports that build themselves, no spreadsheets to fill", "Dashboard dan laporan yang tersusun sendiri, tanpa spreadsheet yang harus diisi", "自动生成的看板和报告，不用再填表格", "自動で組み上がるダッシュボードとレポート、表の手入力は不要"),
      l("Integrations between the tools you already pay for", "Integrasi antar alat yang sudah Anda bayar", "打通你已经在付费使用的各种工具", "すでに使っているツール同士の連携"),
      l("Built on your own data, with a person in the loop where it matters", "Dibangun di atas data Anda sendiri, dengan manusia tetap terlibat di bagian yang penting", "基于你自己的数据搭建，关键环节有人把关", "自社データの上に構築し、要所には人が入る"),
    ],
  },
];

/**
 * Which of the six disciplines each case study used. Derived from each
 * project's documented scope; the case studies themselves are unchanged.
 */
const PROJECT_DISCIPLINES: Record<string, ServiceId[]> = {
  "swarma-villas": ["web-software"],
  "kaatrity-dental-care": ["ai-automation"],
  "sunhwa-beauty-app": ["web-software"],
  glovia: ["branding-design", "social-media"],
  "great-bali-villas": ["web-software", "growth-analytics"],
  "bhagawan-property": ["web-software", "growth-analytics"],
  "tammia-online": ["web-software", "branding-design", "growth-analytics"],
  "astungkare-spa": ["web-software", "social-media", "ads-management", "branding-design", "growth-analytics"],
  "the-hair-extensions-bali": ["branding-design", "web-software", "growth-analytics"],
  radcruiters: ["web-software", "ai-automation", "ads-management", "growth-analytics"],
  "jalak-cargo-logistics": ["social-media", "web-software", "growth-analytics"],
  "my-day-gili": ["web-software", "growth-analytics"],
};

export function disciplinesFor(p: Project): Service[] {
  const ids = PROJECT_DISCIPLINES[p.slug] ?? [];
  return SERVICES.filter((s) => ids.includes(s.id));
}

export function projectsFor(id: ServiceId): Project[] {
  return PROJECTS.filter((p) => (PROJECT_DISCIPLINES[p.slug] ?? []).includes(id));
}

export function serviceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
