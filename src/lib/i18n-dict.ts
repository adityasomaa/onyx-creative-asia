/**
 * Translation dictionary for the portfolio: `DICT[locale][englishSource]`.
 *
 * Case-study copy lives in `data.ts` as English and is rendered through
 * <T>, so its translations stay keyed by that English here. The keys are
 * never retyped: they are read from PROJECTS / TESTIMONIALS and paired
 * with the translation records below, so a key always matches its entry.
 *
 * Everything else on the marketing site (services, section copy, notes)
 * carries its four languages inline instead, see `l10n.ts`.
 */

import { PROJECTS, TESTIMONIALS } from "./data";
import type { Locale } from "./l10n";

type Tri = { id: string; zh: string; ja: string };

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

const PROJECT_TX: Record<string, ProjectTx> = {
  "my-day-gili": {
    title: { id: "Tempat Booking Fast Boat", zh: "快船预订入口", ja: "ファストボート予約サーフェス" },
    blurb: { id: "Tiket fast boat dan day trip dari Bali", zh: "从巴厘岛出发的快船船票与一日游", ja: "バリ発のファストボートのチケットと日帰りツアー" },
    description: { id: "Satu tempat untuk booking penyeberangan ke Gili dan Lombok. Empat operator, jadwal dan tarif aslinya, dengan tiap pertanyaan mendarat di WhatsApp sudah membawa trip asalnya.", zh: "一个入口，搞定去 Gili 和龙目岛的所有船票。四家船公司、真实的班次和票价，而且每一条咨询进到 WhatsApp 时，都已经带着它来自哪一趟。", ja: "ギリ諸島とロンボクへの渡航を予約する、一つの窓口。四つの運航会社の実際の時刻と運賃を並べ、問い合わせはどの便から来たかを持ったまま WhatsApp に届きます。" },
    longDescription: { id: "My Day Gili sudah mengantar traveler dari Bali ke Gili dan Lombok sejak 2017. Bagian sulitnya tidak pernah kapalnya, melainkan bahwa traveler yang membandingkan empat operator harus membuka empat tab, tidak ada satu pun yang sepakat soal harga, lalu mengirim pesan yang datang tanpa konteks sama sekali. Situsnya menaruh keempat penyeberangan berdampingan lengkap dengan jam dan tarif aslinya, menambahkan day trip dan tur yang juga dijalankan timnya, lalu mengarahkan tiap pertanyaan ke WhatsApp sambil membawa referensi apa pun yang sedang dilihat travelernya.", zh: "My Day Gili 从 2017 年起就在把旅客从巴厘岛送往 Gili 和龙目岛。难的从来不是船，而是：一个想比较四家船公司的旅客得开四个标签页，四个页面对价格的说法还不一致，然后发出一条完全没有上下文的消息。这个网站把四条航线并排放好，附上真实的班次和票价，再加上团队同时在做的一日游和包车，并让每一条咨询在进入 WhatsApp 时，都带着旅客当时正在看的那一项。", ja: "My Day Gili は 2017 年から、バリからギリ諸島とロンボクへ旅行者を送り出してきました。難しかったのは船ではありません。四つの運航会社を比べたい旅行者は四つのタブを開くはめになり、そのどれも価格が食い違い、結局まったく文脈のないメッセージを送ることになる。このサイトは四つの航路を実際の時刻と運賃つきで横並びにし、チームが手がける日帰りツアーやチャーターも加えたうえで、旅行者が見ていたものへの参照を持たせたまま問い合わせを WhatsApp へ届けます。" },
    location: { id: "Padang Bai · Bali · Indonesia", zh: "帕当拜 · 巴厘岛 · 印尼", ja: "パダンバイ · バリ · インドネシア" },
    scope: [
      { id: "Situs multi-halaman: penyeberangan, day trip, tur Bali, blog, kontak", zh: "多页面网站：航线、一日游、巴厘岛行程、博客、联系", ja: "複数ページのサイト。航路、日帰りツアー、バリのツアー、ブログ、問い合わせ" },
      { id: "Perbandingan operator lengkap dengan jam keberangkatan dan tarifnya", zh: "船公司对比，附上发船时间与票价", ja: "運航会社の比較。出発時刻と運賃つき" },
      { id: "Halaman day trip Gili dan Nusa Penida beserta apa saja yang termasuk", zh: "Gili 与 Nusa Penida 一日游页面，写清都包含什么", ja: "ギリとヌサペニダの日帰りページ。含まれるものを明記" },
      { id: "Booking lewat WhatsApp, tiap pertanyaan ditandai referensinya sendiri", zh: "通过 WhatsApp 预订，每条咨询都带自己的编号", ja: "WhatsApp での予約。問い合わせごとに固有の参照を付与" },
      { id: "FAQ yang menjawab pertanyaan pelabuhan, biaya, dan bayi yang selalu ditanyakan", zh: "常见问题，回答港口、附加费和婴儿这些一定会被问到的事", ja: "港・追加費用・乳幼児など、必ず訊かれることに答える FAQ" },
      { id: "Structured data Product, LocalBusiness, dan FAQ untuk pencarian travel", zh: "Product、LocalBusiness 和 FAQ 结构化数据，面向旅游搜索", ja: "旅行検索に向けた Product・LocalBusiness・FAQ の構造化データ" },
    ],
    tags: [
      { id: "Travel", zh: "旅游", ja: "トラベル" },
      { id: "Booking", zh: "预订", ja: "予約" },
      { id: "SEO", zh: "SEO", ja: "SEO" },
    ],
    study: {
      overview: { id: "My Day Gili menjual tiket fast boat dari Padang Bai ke Gili Trawangan, Gili Air, Gili Meno, dan Lombok, plus day trip Gili dan Nusa Penida serta tur Bali dengan transfer privat. Mereka memakai fast ferry sungguhan, bukan speedboat kecil, bekerja dengan empat operator, dan sudah dinilai di TripAdvisor sejak 2017. Booking-nya lewat WhatsApp, karena begitulah penyeberangan antar pulau benar-benar dipesan.", zh: "My Day Gili 卖的是从帕当拜出发去 Gili Trawangan、Gili Air、Gili Meno 和龙目岛的快船票，另外还有 Gili 与 Nusa Penida 一日游，以及带私人接送的巴厘岛行程。他们用的是真正的大型快船，不是小快艇，合作四家船公司，从 2017 年起就在 TripAdvisor 上有评分。预订走 WhatsApp，因为跨岛的船票本来就是这么订的。", ja: "My Day Gili は、パダンバイからギリ・トラワンガン、ギリ・アイル、ギリ・メノ、ロンボクへのファストボートのチケットを販売し、ギリとヌサペニダの日帰りツアー、プライベート送迎付きのバリツアーも扱います。小型のスピードボートではなく本物のファストフェリーを使い、四つの運航会社と組み、2017 年から TripAdvisor で評価されてきました。予約は WhatsApp。島の渡航は、実際そうやって決まるからです。" },
      needed: [
        { id: "Empat operator, empat set jam dan tarif, dan tidak ada satu tempat pun yang membandingkannya.", zh: "四家船公司、四套时间和价格，却没有一个地方能把它们放在一起比。", ja: "四つの運航会社、四通りの時刻と運賃。それを一か所で比べられる場所がありませんでした。" },
        { id: "Beda antara fast ferry besar dan speedboat kecil adalah seluruh nilai jualnya, dan itu tidak ada di halamannya.", zh: "大型快船和小快艇的区别，本来就是他们最核心的卖点，可页面上一个字都没提。", ja: "大型ファストフェリーと小型スピードボートの違いこそが売りの核心なのに、それがページのどこにも書かれていませんでした。" },
        { id: "Biaya pelabuhan, aturan bayi, dan harus muncul di dermaga mana, ditanyakan berulang-ulang di chat.", zh: "码头费、婴儿规定、到底该去哪个港口，这些在聊天里被一遍遍地问。", ja: "港の費用、乳幼児の扱い、どの港に行けばいいのか。同じ質問がチャットで何度も繰り返されていました。" },
        { id: "Pertanyaan datang sebagai pesan kosong, jadi tim harus menebak dulu trip mana yang dimaksud sebelum menjawab.", zh: "咨询进来只是一条光秃秃的消息，团队得先猜出对方指的是哪一趟，才能回答。", ja: "問い合わせは中身のないメッセージとして届くので、チームはまずどの便のことか割り出してから答える必要がありました。" },
      ],
      did: [
        { id: "Membangun situs multi-halamannya: penyeberangan, day trip, tur Bali, blog, dan kontak.", zh: "搭建了多页面网站：航线、一日游、巴厘岛行程、博客和联系页。", ja: "複数ページのサイトを構築。航路、日帰りツアー、バリのツアー、ブログ、問い合わせ。" },
        { id: "Menaruh keempat operator berdampingan lengkap dengan jam keberangkatan dan tarif mulainya.", zh: "把四家船公司并排摆好，附上发船时间和起步价。", ja: "四つの運航会社を横並びにし、出発時刻と最低運賃を添えました。" },
        { id: "Menulis halaman day trip dan tur dengan apa yang benar-benar termasuk, penjemputan dan alat snorkeling di antaranya.", zh: "写清一日游和行程页里到底包含什么，接送和浮潜装备也在内。", ja: "日帰りツアーとツアーのページに、送迎やシュノーケル用具を含め、実際に何が付くのかを書きました。" },
        { id: "Menjawab pertanyaan berulangnya di FAQ publik, bukan di chat satu per satu.", zh: "把反复被问的问题放进公开的 FAQ 里回答，而不是在聊天里一条条答。", ja: "繰り返される質問を、チャットで一件ずつではなく公開の FAQ で答えるようにしました。" },
        { id: "Menandai tiap pertanyaan WhatsApp dengan referensi supaya ia datang membawa trip-nya.", zh: "给每条 WhatsApp 咨询打上编号，让它带着自己的行程一起过来。", ja: "WhatsApp の問い合わせごとに参照を付け、どの便から来たかを持って届くようにしました。" },
        { id: "Menandai data Product, LocalBusiness, dan FAQ supaya pencarian travel bisa membaca tarifnya.", zh: "标好 Product、LocalBusiness 和 FAQ 数据，让旅游搜索能读到票价。", ja: "Product・LocalBusiness・FAQ のデータを記述し、旅行検索が運賃を読めるようにしました。" },
      ],
      changed: [
        { id: "Traveler membandingkan empat penyeberangan di satu halaman, bukan di empat tab.", zh: "旅客在一个页面上就能比较四条航线，不用开四个标签页。", ja: "旅行者は四つのタブではなく、一つのページで四つの航路を比べられます。" },
        { id: "Tarifnya kelihatan sebelum ada yang perlu menanyakannya.", zh: "票价在有人开口问之前就已经看得到了。", ja: "運賃は、誰かが尋ねる前から見えています。" },
        { id: "Pertanyaan yang dulu membuka tiap chat sekarang sudah terjawab sebelum chat-nya dimulai.", zh: "以前每次聊天开头都要问的那些问题，现在在聊天开始之前就答完了。", ja: "以前はどのチャットも最初に出ていた質問が、チャットが始まる前に答え終わっています。" },
        { id: "Pertanyaan sampai ke WhatsApp sudah membawa trip asalnya.", zh: "咨询到 WhatsApp 时，已经带着它来自哪一趟。", ja: "問い合わせは、どの便から来たかを持ったまま WhatsApp に届きます。" },
      ],
    },
  },
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
      overview: { id: "Tammia Online adalah retailer beauty tools premium di Indonesia, menjual brush dan tools yang asli, bukan tiruan yang mirip. Storefront-nya memuat katalog produk lengkap dengan new arrivals mingguan, rating dan harga rupiah di tiap item, cart dan wishlist drawer yang muncul dari samping, plus beauty advisor lewat WhatsApp untuk pembeli yang belum yakin butuh apa.", zh: "Tammia Online 是印尼一家高端美妆工具零售商，卖的是正品刷具和工具，不是做得很像的仿品。店面涵盖完整的商品类目，每周上新，每件商品都有评分和印尼盾定价，购物车和心愿单以侧边抽屉呈现，还有 WhatsApp 上的美妆顾问，给还没想好要买什么的人。", ja: "Tammia Online はインドネシアのプレミアム美容ツール専門店です。よく似た模倣品ではなく、本物のブラシとツールを扱います。ストアは全カテゴリーで構成され、毎週新商品が入り、すべての商品に評価とルピア表示の価格が付きます。カートとウィッシュリストはスライドインのドロワーで、何が必要か迷う人のために WhatsApp のビューティーアドバイザーも用意しています。" },
      needed: [
        { id: "Pembeli tidak bisa membedakan brush asli dari tiruan yang meyakinkan.", zh: "买家分不出正品刷具和做得很像的仿品。", ja: "買い手には、本物のブラシと精巧な模倣品の区別がつきませんでした。" },
        { id: "Pertanyaan yang sama datang di tiap order: ini asli atau bukan?", zh: "每一单都会冒出同一个问题：这个是正品吗？", ja: "注文のたびに同じ質問が来ていました。これは本物ですか、と。" },
        { id: "Ketentuan pengiriman, retur, dan pembayaran tidak tertulis di tempat yang jelas.", zh: "配送、退换和付款的条款，没写在任何显眼的地方。", ja: "配送・返品・支払いの条件が、目につく場所に書かれていませんでした。" },
        { id: "Tidak ada cara cepat untuk bertanya soal produk sebelum memutuskan beli.", zh: "在决定下单之前，没有一条能快速问清产品的路。", ja: "購入を決める前に、商品について手早く尋ねる手段がありませんでした。" },
      ],
      did: [
        { id: "Membangun storefront dengan katalog produk lengkap dan new arrivals mingguan.", zh: "搭建了涵盖完整类目、每周上新的店面。", ja: "全商品カテゴリーと毎週の新着を備えたストアを構築。" },
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
      id: "Etalase e-commerce untuk retailer beauty tools premium. Katalog produk lengkap, koleksi baru tiap minggu, drawer keranjang dan wishlist, serta beauty advisor lewat WhatsApp untuk pembeli yang masih bingung memilih brush.",
      zh: "为高端美妆工具零售商打造的电商门店。完整的商品分类、每周上新、购物车与心愿单抽屉，还有 WhatsApp 美妆顾问，帮那些拿不准该选哪支刷子的顾客。",
      ja: "プレミアムなビューティーツール専門店のための EC ストアフロント。全商品カテゴリー、毎週の新着、カートとウィッシュリストのドロワー、そしてどのブラシを選ぶか迷う人のための WhatsApp ビューティーアドバイザーを備えています。"
    },
    longDescription: {
      id: "Beauty tools adalah pembelian yang bertumpu pada kepercayaan: pembeli mencari brush Real Techniques yang asli, bukan tiruan yang meyakinkan. Etalase ini membuka dengan hal itu, jaminan keaslian dan syarat gratis ongkir berada di atas lipatan, dan setiap produk menampilkan rating serta harga dalam rupiah. Di bawahnya, katalog disusun sesuai cara orang benar-benar berbelanja, berdasarkan kebutuhan alih-alih merek, dengan drawer keranjang dan wishlist yang tidak pernah membawa Anda keluar dari halaman. Bagi yang masih ragu, beauty advisor lewat WhatsApp hanya satu ketukan jauhnya, dan begitulah kebanyakan orang Indonesia memilih untuk bertanya.",
      zh: "美妆工具是一桩靠信任成交的买卖：顾客要的是真正的 Real Techniques 刷子，而不是一支足以乱真的仿品。这家门店开门见山，正品保证与包邮门槛就放在首屏，每件商品都标着评分和以印尼盾计的价格。往下，商品目录是按人们真正的购物方式来组织的，按需求而非按品牌，购物车与心愿单抽屉滑出即用，绝不会把你带离当前页面。要是还拿不准，WhatsApp 上的美妆顾问只有一键之遥，而这正是大多数 Indonesia 人习惯发问的方式。",
      ja: "ビューティーツールは信頼で決まる買い物です。顧客が欲しいのは本物の Real Techniques のブラシであって、よくできた模造品ではありません。このストアはそこから始まります。正規品保証と送料無料の条件をファーストビューに置き、すべての商品に評価とルピア建ての価格を添える。その下では、カタログをブランド別ではなく「何が必要か」で並べ、カートとウィッシュリストのドロワーはページから離れることなく開きます。それでも迷う人には、WhatsApp のビューティーアドバイザーがワンタップ。Indonesia の多くの人が質問する、いつものやり方です。"
    },
    scope: [
      { id: "Etalase dengan katalog produk lengkap", zh: "涵盖完整商品分类的门店", ja: "全商品カテゴリーを備えたストアフロント" },
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
const TESTIMONIAL_TX: Record<string, { quote?: Tri; role?: Tri }> = {
  "my-day-gili": {
    quote: {
      id: "Dulu traveler membuka obrolan dengan kapal yang mana, jam berapa, dan berapa harganya, dan kami menjawab empat hal yang sama tiap hari. Sekarang pesannya datang sudah menyebut penyeberangan yang mereka pilih.",
      zh: "以前旅客一上来就问哪条船、几点、多少钱，我们每天都在回答同样的四件事。现在消息进来时，已经写明了他们选好的那一趟。",
      ja: "以前は旅行者がどの船か、何時か、いくらかと切り出し、私たちは毎日同じ四つのことに答えていました。いまは、すでに選んだ便を名指ししたメッセージが届きます。",
    },
    role: { id: "Tim Reservasi", zh: "预订团队", ja: "予約チーム" },
  },
  "jalak-cargo-logistics": {
    quote: {
      id: "Dulu pelanggan selalu bertanya apa itu CBM sebelum tiap penawaran. Sekarang feed-nya biasanya sudah menjawab itu sebelum mereka menghubungi kami, jadi obrolannya mulai dari kirimannya, bukan dari istilahnya.",
      zh: "以前每次报价前，客户都要先问一句 CBM 是什么。现在他们来找我们之前，动态基本已经把这个答完了，所以对话直接从这批货开始，而不是从名词开始。",
      ja: "以前は見積もりのたびに、CBM とは何かと尋ねられていました。いまは連絡が来る前にフィードがそれに答えているので、会話は用語ではなく貨物そのものから始まります。",
    },
    role: { id: "Divisi Ekspor", zh: "出口部", ja: "輸出部門" },
  },
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

  TESTIMONIALS.forEach((tm) => {
    const t = tm.projectSlug ? TESTIMONIAL_TX[tm.projectSlug] : undefined;
    if (!t) return;
    put(m, tm.quote, t.quote);
    put(m, tm.role, t.role);
  });

  return m;
}

export const DICT: Maps = build();
