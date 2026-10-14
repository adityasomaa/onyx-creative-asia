import { l, type L } from "@/lib/l10n";
import { PROJECTS, type Project } from "@/lib/data";
import type { SceneId } from "@/components/site/art/scenes";

/**
 * The five disciplines Onyx sells as a digital business development
 * agency. They drive the home hero slider, the Expertise accordion, the
 * contact form's "what are we making" list, and the JSON-LD service
 * catalogue, so the list exists exactly once.
 *
 * Every string carries all four languages beside it (see `L` in i18n).
 */

export type ServiceId = "web-software" | "branding-design" | "ads-management" | "social-media" | "growth-analytics";

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
  },
];

/**
 * Which of the five disciplines each case study used. Derived from each
 * project's documented scope; the case studies themselves are unchanged.
 */
const PROJECT_DISCIPLINES: Record<string, ServiceId[]> = {
  "great-bali-villas": ["web-software", "growth-analytics"],
  "bhagawan-property": ["web-software", "growth-analytics"],
  "tammia-online": ["web-software", "branding-design", "growth-analytics"],
  "astungkare-spa": ["web-software", "social-media", "ads-management", "branding-design", "growth-analytics"],
  "the-hair-extensions-bali": ["branding-design", "web-software", "growth-analytics"],
  radcruiters: ["web-software", "ads-management", "growth-analytics"],
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
