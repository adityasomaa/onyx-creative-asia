import { l, type L } from "@/lib/l10n";
import { PROJECTS, type Project } from "@/lib/data";

/**
 * The ten disciplines Onyx sells as a digital business development
 * agency. They drive the home hero slider, the Expertise accordion, the
 * contact form's "what are we making" list, and the JSON-LD service
 * catalogue, so the list exists exactly once.
 *
 * Every string carries all four languages beside it (see `L` in i18n).
 */

export type ServiceId =
  | "website-development"
  | "software-development"
  | "mobile-apps"
  | "social-media"
  | "seo-aeo-geo"
  | "ads-management"
  | "content-creation"
  | "photo-video"
  | "design-branding"
  | "growth-analytics";

export type Service = {
  id: ServiceId;
  number: string;
  title: L;
  /** One line, shown on the closed accordion row and the hero card. */
  short: L;
  /** Display headline when the row is open. */
  headline: L;
  body: L;
  image: string;
};

export const SERVICES: Service[] = [
  {
    id: "website-development",
    number: "01",
    title: l("Website Development", "Pengembangan Website", "网站开发", "ウェブサイト開発"),
    short: l(
      "Sites that load fast, read clearly and turn visits into enquiries.",
      "Situs yang cepat, jelas dibaca, dan mengubah kunjungan jadi pertanyaan.",
      "加载快、读得懂、能把访问变成咨询的网站。",
      "速く開き、すっと読めて、訪問を問い合わせに変えるサイト。",
    ),
    headline: l(
      "Designed and built by the same hands.",
      "Dirancang dan dibangun oleh tangan yang sama.",
      "设计和开发，出自同一双手。",
      "設計も実装も、同じ手で。",
    ),
    body: l(
      "Your website is where most people meet the business, and they decide fast. We design it and build it ourselves, so what you approved is exactly what goes live, then we keep it fast and current.",
      "Website adalah tempat kebanyakan orang pertama kali bertemu bisnis Anda, dan mereka memutuskan dengan cepat. Kami merancang dan membangunnya sendiri, jadi yang Anda setujui itulah yang tayang, lalu kami menjaganya tetap cepat dan terbaru.",
      "大多数人第一次认识你的生意是在网站上，而且他们做决定很快。我们自己设计、自己开发，你确认过的样子就是上线的样子，之后也由我们让它保持快速、保持更新。",
      "多くの人が最初に出会うのはウェブサイトで、判断は一瞬です。設計も実装も私たちが行うので、承認したものがそのまま公開され、公開後も速く新しい状態を保ちます。",
    ),
    image: "/images/svc-website.jpg",
  },
  {
    id: "software-development",
    number: "02",
    title: l("Software Development", "Pengembangan Software", "软件开发", "ソフトウェア開発"),
    short: l(
      "Booking flows, portals and dashboards that off-the-shelf can't do.",
      "Alur booking, portal, dan dashboard yang tidak bisa dikerjakan software jadi.",
      "现成软件做不到的预订流程、门户和数据面板。",
      "既製品ではできない予約フロー、ポータル、ダッシュボード。",
    ),
    headline: l(
      "Software shaped around how you work.",
      "Software yang dibentuk mengikuti cara Anda bekerja.",
      "按你的工作方式来打造的软件。",
      "あなたの仕事の流れに合わせたソフトウェア。",
    ),
    body: l(
      "When a template stops fitting, we build the tool itself: booking engines, client portals, internal dashboards, and the integrations between the systems you already pay for.",
      "Saat template sudah tidak muat, kami membangun alatnya sendiri: mesin booking, portal klien, dashboard internal, dan integrasi antar sistem yang sudah Anda bayar.",
      "当模板不再合身，我们就直接把工具做出来：预订引擎、客户门户、内部面板，以及你已经在付费使用的各个系统之间的打通。",
      "テンプレートが合わなくなったら、道具そのものを作ります。予約エンジン、顧客ポータル、社内ダッシュボード、そしてすでに使っているシステム同士の連携。",
    ),
    image: "/images/svc-software.jpg",
  },
  {
    id: "mobile-apps",
    number: "03",
    title: l("Mobile Apps Development", "Pengembangan Aplikasi Mobile", "移动应用开发", "モバイルアプリ開発"),
    short: l(
      "iOS and Android apps for your customers and for your own team.",
      "Aplikasi iOS dan Android untuk pelanggan maupun tim Anda sendiri.",
      "为你的客户、也为你自己的团队打造的 iOS 和 Android 应用。",
      "お客様にも、自社のチームにも使える iOS・Android アプリ。",
    ),
    headline: l(
      "In their pocket, not in a browser tab.",
      "Di saku mereka, bukan di tab browser.",
      "在他们的口袋里，而不是浏览器的某个标签页里。",
      "ブラウザのタブではなく、ポケットの中に。",
    ),
    body: l(
      "Apps for the customers who come back every week and for the teams who work away from a desk, designed, built and shipped to both stores.",
      "Aplikasi untuk pelanggan yang kembali tiap minggu dan untuk tim yang bekerja jauh dari meja, dirancang, dibangun, dan dirilis ke kedua store.",
      "为每周都会回来的客户、也为不坐在办公桌前的团队做应用，从设计、开发到上架两大应用商店。",
      "毎週戻ってくるお客様のために、デスクを離れて働くチームのために。設計し、開発し、両方のストアに公開します。",
    ),
    image: "/images/svc-mobile.jpg",
  },
  {
    id: "social-media",
    number: "04",
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
    image: "/images/svc-social.jpg",
  },
  {
    id: "seo-aeo-geo",
    number: "05",
    title: l("SEO, AEO & GEO", "SEO, AEO & GEO", "SEO、AEO 与 GEO", "SEO・AEO・GEO"),
    short: l(
      "Found on Google, and named when people ask an AI.",
      "Ditemukan di Google, dan disebut saat orang bertanya ke AI.",
      "在 Google 上被找到，在别人问 AI 时被点名。",
      "Google で見つかり、AI に尋ねられたときに名前が挙がる。",
    ),
    headline: l(
      "Found when they search. Named when they ask.",
      "Ditemukan saat mereka mencari. Disebut saat mereka bertanya.",
      "他们搜索时被找到，他们提问时被点名。",
      "検索すれば見つかり、尋ねれば名前が挙がる。",
    ),
    body: l(
      "Search engines still send buyers, and answer engines now decide which business gets recommended. We structure the site, the content and the data so both can read you, and quote you.",
      "Mesin pencari masih mengirim pembeli, dan mesin jawaban sekarang menentukan bisnis mana yang direkomendasikan. Kami menata situs, konten, dan datanya supaya keduanya bisa membaca Anda, dan mengutip Anda.",
      "搜索引擎依然在带来买家，而答案引擎如今决定了哪家公司会被推荐。我们把网站、内容和数据都整理好，让两者都能读懂你，也愿意引用你。",
      "検索エンジンは今も買い手を連れてきて、回答エンジンはどの会社を勧めるかを決めるようになりました。サイト、コンテンツ、データを整え、どちらにも読まれ、引用されるようにします。",
    ),
    image: "/images/svc-seo.jpg",
  },
  {
    id: "ads-management",
    number: "06",
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
    image: "/images/svc-ads.jpg",
  },
  {
    id: "content-creation",
    number: "07",
    title: l("Content Creation", "Pembuatan Konten", "内容创作", "コンテンツ制作"),
    short: l(
      "Articles, captions and campaigns that answer real questions.",
      "Artikel, caption, dan kampanye yang menjawab pertanyaan sungguhan.",
      "回答真实问题的文章、文案和活动。",
      "本当の質問に答える記事、キャプション、キャンペーン。",
    ),
    headline: l(
      "Content that answers before they ask.",
      "Konten yang menjawab sebelum mereka bertanya.",
      "在他们开口之前，就已经给出答案的内容。",
      "尋ねられる前に、答えているコンテンツ。",
    ),
    body: l(
      "We write the pieces that do the selling quietly: the guide a buyer reads before calling, the caption that explains the service, the campaign that gives people a reason to look twice.",
      "Kami menulis konten yang menjual dengan tenang: panduan yang dibaca pembeli sebelum menelepon, caption yang menjelaskan layanannya, kampanye yang membuat orang menoleh dua kali.",
      "我们写那些安静地替你成交的内容：买家打电话前会读的指南，把服务讲清楚的文案，让人愿意多看一眼的活动。",
      "静かに売ってくれるものを書きます。電話の前に買い手が読むガイド、サービスを説明するキャプション、もう一度見たくなるキャンペーン。",
    ),
    image: "/images/svc-content.jpg",
  },
  {
    id: "photo-video",
    number: "08",
    title: l("Photography & Videography", "Fotografi & Videografi", "摄影与摄像", "写真・映像制作"),
    short: l(
      "Product, space and team, shot and edited in-house.",
      "Produk, ruang, dan tim, difoto dan diedit sendiri oleh tim kami.",
      "产品、空间和团队，全部由我们自己拍、自己剪。",
      "商品、空間、チームを、社内で撮影・編集。",
    ),
    headline: l(
      "Shot on location, cut for every screen.",
      "Diambil di lokasi, dipotong untuk setiap layar.",
      "实地拍摄，为每一块屏幕剪辑。",
      "現場で撮り、あらゆる画面に合わせて編集する。",
    ),
    body: l(
      "Photo and video produced by the same team that designs the brand, so what we shoot matches what we build, and you finish with a library you own.",
      "Foto dan video diproduksi oleh tim yang sama yang merancang brand-nya, jadi yang kami ambil cocok dengan yang kami bangun, dan Anda berakhir dengan perpustakaan aset milik Anda sendiri.",
      "照片和视频由设计品牌的同一支团队来拍，拍出来的和做出来的是一套东西，最后留给你一整套属于你自己的素材库。",
      "ブランドを設計したチームが写真と映像も制作するので、撮るものと作るものが揃い、最後には自分のものになる素材ライブラリが残ります。",
    ),
    image: "/images/svc-photo.jpg",
  },
  {
    id: "design-branding",
    number: "09",
    title: l("Design & Branding", "Desain & Branding", "设计与品牌", "デザイン・ブランディング"),
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
    image: "/images/svc-design.jpg",
  },
  {
    id: "growth-analytics",
    number: "10",
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
    image: "/images/svc-growth.jpg",
  },
];

/**
 * Which of the ten disciplines each case study used. Derived from each
 * project's documented scope; the case studies themselves are unchanged.
 */
const PROJECT_DISCIPLINES: Record<string, ServiceId[]> = {
  "great-bali-villas": ["website-development", "seo-aeo-geo", "growth-analytics"],
  "bhagawan-property": ["website-development", "seo-aeo-geo", "content-creation", "growth-analytics"],
  "tammia-online": ["website-development", "design-branding", "growth-analytics"],
  "astungkare-spa": ["website-development", "social-media", "ads-management", "design-branding", "growth-analytics"],
  "the-hair-extensions-bali": ["design-branding", "website-development", "photo-video", "growth-analytics"],
  radcruiters: ["software-development", "ads-management", "growth-analytics"],
  "jalak-cargo-logistics": ["social-media", "content-creation", "photo-video", "website-development", "growth-analytics"],
  "my-day-gili": ["website-development", "seo-aeo-geo", "growth-analytics"],
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
