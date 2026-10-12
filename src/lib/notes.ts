import { l, type L } from "@/lib/l10n";

/**
 * Notes — the studio blog, rebuilt from scratch. Three pieces, each
 * carrying all four languages beside the English. Bodies are a flat list
 * of blocks so the article renderer stays a single map.
 */

export type NoteBlock =
  | { kind: "p"; text: L }
  | { kind: "h"; text: L }
  | { kind: "quote"; text: L }
  | { kind: "list"; items: L[] };

export type Note = {
  slug: string;
  /** ISO date. */
  date: string;
  minutes: number;
  cover: string;
  title: L;
  dek: L;
  blocks: NoteBlock[];
};

const STUDIO = l("Onyx studio", "Studio Onyx", "Onyx 工作室", "Onyx スタジオ");
export const NOTE_AUTHOR = STUDIO;

export const NOTES: Note[] = [
  {
    slug: "the-hand-off-is-where-the-budget-leaks",
    date: "2026-10-08",
    minutes: 4,
    cover: "/images/note-one-team.jpg",
    title: l(
      "The hand-off is where the budget leaks",
      "Serah-terima adalah tempat anggaran bocor",
      "预算，是在交接里漏掉的",
      "予算は、引き継ぎで漏れていく",
    ),
    dek: l(
      "Five good vendors can still add up to one bad result. The cost hides in the gaps between them.",
      "Lima vendor yang bagus tetap bisa menghasilkan satu hasil yang buruk. Biayanya bersembunyi di celah di antara mereka.",
      "五家不错的供应商，加起来也可能是一个糟糕的结果。成本就藏在它们之间的缝隙里。",
      "優秀な五社が集まっても、結果がひどいことはある。コストはその隙間に隠れている。",
    ),
    blocks: [
      {
        kind: "p",
        text: l(
          "A typical small business that wants to grow online ends up hiring a web developer, a social media freelancer, someone for ads, a photographer, and eventually a consultant to explain why none of it is working. Each one does their part. Each one is, on their own terms, good at it.",
          "Bisnis kecil yang ingin tumbuh di online biasanya akhirnya menyewa web developer, freelancer media sosial, seseorang untuk iklan, fotografer, lalu akhirnya konsultan untuk menjelaskan kenapa semuanya tidak berjalan. Masing-masing mengerjakan bagiannya. Masing-masing, menurut ukurannya sendiri, bagus.",
          "一家想在网上做大的小企业，通常会先后请来网站开发、社媒自由职业者、投广告的人、摄影师，最后再请一位顾问来解释为什么这些都没起作用。每个人都做好了自己那一块，按他们自己的标准，也都做得不错。",
          "オンラインで伸びたい小さな会社は、たいていウェブ制作者、SNS のフリーランス、広告担当、カメラマンを雇い、最後にはなぜどれも効かないのかを説明するコンサルタントまで雇うことになります。それぞれが自分の役目を果たし、それぞれの基準では優秀です。",
        ),
      },
      {
        kind: "p",
        text: l(
          "The problem is that nobody owns the result. The ads send people to a page the developer built for a different purpose. The photos are shot for a feed, not for the product pages. The analytics, if anyone set them up, measure clicks while the owner cares about bookings.",
          "Masalahnya, tidak ada yang memegang hasilnya. Iklan mengirim orang ke halaman yang dibuat developer untuk tujuan lain. Fotonya diambil untuk feed, bukan untuk halaman produk. Analitiknya, kalau ada yang memasang, mengukur klik sementara pemiliknya peduli pada booking.",
          "问题在于，没有人对结果负责。广告把人带到一个开发者原本为别的目的做的页面；照片是为社媒拍的，不是为产品页拍的；数据分析就算有人装了，量的也是点击，而老板在乎的是预订。",
          "問題は、誰も結果を持っていないことです。広告は、開発者が別の目的で作ったページに人を送る。写真はフィード用に撮られ、商品ページ用ではない。分析は、誰かが設定していたとしても、オーナーが気にしている予約ではなくクリックを測っている。",
        ),
      },
      { kind: "h", text: l("Where the money actually goes", "Ke mana uangnya benar-benar pergi", "钱到底花在了哪里", "お金は実際どこへ行くのか") },
      {
        kind: "p",
        text: l(
          "Every hand-off costs something. Someone has to brief the next person, and the brief is always thinner than what the first person knew. Decisions get made twice, or not at all, because each vendor waits for another to move. The owner ends up as the project manager of a project they hired people to run.",
          "Setiap serah-terima ada biayanya. Seseorang harus memberi brief ke orang berikutnya, dan brief itu selalu lebih tipis dari yang diketahui orang pertama. Keputusan diambil dua kali, atau tidak sama sekali, karena tiap vendor menunggu yang lain bergerak. Pemiliknya akhirnya jadi manajer proyek dari proyek yang justru ia sewa orang untuk menjalankannya.",
          "每一次交接都有成本。总得有人给下一个人写需求，而写下来的永远比第一个人知道的少。决定要么被做两次，要么一次都没做，因为每家供应商都在等别人先动。老板最后成了项目经理，管的正是他花钱请人来做的那个项目。",
          "引き継ぎには、必ずコストがかかります。誰かが次の人に説明しなければならず、その説明はいつも最初の人が知っていたことより薄い。各社が他社の動きを待つので、判断は二度されるか、一度もされない。結局オーナーが、人に任せるために雇ったはずのプロジェクトのマネージャーになってしまう。",
        ),
      },
      {
        kind: "list",
        items: [
          l("Briefs re-written for every new vendor.", "Brief yang ditulis ulang untuk setiap vendor baru.", "每来一家新供应商，需求就重写一遍。", "新しい外注先ごとに書き直されるブリーフ。"),
          l("Assets made twice because the first set did not fit.", "Aset dibuat dua kali karena yang pertama tidak cocok.", "因为第一批不合用，素材做了两遍。", "最初のものが合わず、二度作られる素材。"),
          l("Campaigns paused while two teams argue about a page.", "Kampanye dijeda sementara dua tim berdebat soal satu halaman.", "两个团队为一个页面争执时，广告只能停着。", "二つのチームが一枚のページで揉めている間、止まるキャンペーン。"),
          l("Reports that measure each vendor's part, never the whole.", "Laporan yang mengukur bagian tiap vendor, tidak pernah keseluruhannya.", "报告只量各家的那一块，从来不量整体。", "各社の担当分だけを測り、全体を測らないレポート。"),
        ],
      },
      { kind: "h", text: l("One team is not about convenience", "Satu tim bukan soal kenyamanan", "一支团队，不是为了省事", "ひとつのチームは、楽をするためではない") },
      {
        kind: "p",
        text: l(
          "Putting the work under one team is usually sold as convenience: one invoice, one contact. The real benefit is that someone is accountable for the number the owner cares about. When the same people build the site, run the ads and read the analytics, a weak result has nowhere to hide, and nobody can point at someone else.",
          "Menaruh pekerjaan di bawah satu tim biasanya dijual sebagai kenyamanan: satu tagihan, satu kontak. Manfaat sebenarnya adalah ada orang yang bertanggung jawab atas angka yang dipedulikan pemiliknya. Saat orang yang sama membangun situs, menjalankan iklan, dan membaca analitiknya, hasil yang lemah tidak punya tempat bersembunyi, dan tidak ada yang bisa menunjuk orang lain.",
          "把活交给一支团队，通常被当作“省事”来卖：一张发票，一个联系人。真正的好处是：有人要对老板在乎的那个数字负责。当做网站、投广告、看数据的是同一批人，差的结果就没地方藏，也没人能指着别人。",
          "仕事を一つのチームにまとめることは、たいてい「楽さ」として売られます。請求書が一枚、窓口が一つ。本当の利点は、オーナーが気にしている数字に責任を持つ人がいることです。サイトを作る人、広告を回す人、分析を読む人が同じなら、弱い結果に隠れる場所はなく、誰も他人を指させません。",
        ),
      },
      {
        kind: "quote",
        text: l(
          "Hire for the result, not the deliverable. A deliverable can be finished while the business stands still.",
          "Rekrut untuk hasilnya, bukan untuk deliverable-nya. Deliverable bisa selesai sementara bisnisnya diam di tempat.",
          "为结果付钱，而不是为交付物。交付物可以做完，生意却原地不动。",
          "成果物ではなく、結果のために雇う。成果物は、事業が止まったままでも完成してしまう。",
        ),
      },
      {
        kind: "p",
        text: l(
          "That is the case for a digital business development agency, and it is also the test for one. Ask any candidate, including us, which number they will be judged on, and who in their team owns it. If the answer is a list of deliverables, keep looking.",
          "Itulah alasan memilih agensi pengembangan bisnis digital, dan sekaligus cara mengujinya. Tanya kandidat mana pun, termasuk kami, angka apa yang akan dipakai untuk menilai mereka, dan siapa di tim mereka yang memegangnya. Kalau jawabannya daftar deliverable, cari lagi.",
          "这就是选择数字化业务发展机构的理由，也是检验它的方法。问问任何一家候选者，包括我们：他们会用哪个数字来被评价，团队里又是谁对它负责。如果回答是一串交付物清单，那就继续找。",
          "それがデジタル・ビジネス開発エージェンシーを選ぶ理由であり、見極める方法でもあります。私たちを含め、どの候補にも聞いてください。どの数字で評価されるのか、チームの誰がそれを持っているのか。答えが成果物のリストなら、探し続けてください。",
        ),
      },
    ],
  },
  {
    slug: "ranking-is-not-the-same-as-being-recommended",
    date: "2026-09-24",
    minutes: 5,
    cover: "/images/note-search.jpg",
    title: l(
      "Ranking is not the same as being recommended",
      "Peringkat tidak sama dengan direkomendasikan",
      "排名靠前，不等于被推荐",
      "上位表示と、推薦されることは違う",
    ),
    dek: l(
      "SEO, AEO and GEO, in plain terms: what changed when people started asking a machine instead of scanning ten blue links.",
      "SEO, AEO, dan GEO dengan bahasa sederhana: apa yang berubah saat orang mulai bertanya ke mesin, bukan memindai sepuluh link biru.",
      "用大白话讲 SEO、AEO 和 GEO：当人们开始问机器、而不是扫一遍十个蓝色链接时，什么变了。",
      "SEO・AEO・GEO をかみ砕いて。人が十本の青いリンクを眺める代わりに、機械に尋ねるようになって何が変わったのか。",
    ),
    blocks: [
      {
        kind: "p",
        text: l(
          "For twenty years, getting found online meant one thing: rank on the first page of Google. People typed a few words, scanned ten links, and clicked. The job was to be one of those ten, near the top.",
          "Selama dua puluh tahun, ditemukan di online berarti satu hal: berada di halaman pertama Google. Orang mengetik beberapa kata, memindai sepuluh link, lalu mengklik. Tugasnya adalah jadi salah satu dari sepuluh itu, di dekat atas.",
          "二十年来，在网上被找到只意味着一件事：排进 Google 第一页。人们输入几个词，扫一眼十个链接，然后点开。任务就是成为那十个之一，而且尽量靠前。",
          "二十年間、オンラインで見つかるとは、Google の1ページ目に載ることでした。数語を打ち込み、十本のリンクを眺め、クリックする。その十本の一つになり、なるべく上にいることが仕事でした。",
        ),
      },
      {
        kind: "p",
        text: l(
          "That still happens, and it still matters. But a growing share of questions now get answered before anyone clicks: in Google's AI overviews, in ChatGPT, in Perplexity, in the assistant on a phone. Those answers often name one or two businesses. Being one of them is a different job from ranking.",
          "Itu masih terjadi, dan masih penting. Tapi semakin banyak pertanyaan sekarang terjawab sebelum ada yang mengklik: di AI overview Google, di ChatGPT, di Perplexity, di asisten ponsel. Jawaban itu sering menyebut satu atau dua bisnis. Menjadi salah satunya adalah pekerjaan yang berbeda dari meraih peringkat.",
          "这种情况仍然存在，也依然重要。但越来越多的问题，在有人点击之前就已经被回答了：在 Google 的 AI 概览里，在 ChatGPT 里，在 Perplexity 里，在手机上的助手里。这些回答往往只点名一两家公司。成为其中之一，和冲排名是两回事。",
          "それは今もあり、今も重要です。ただ、クリックされる前に答えが出る質問が増えています。Google の AI による概要、ChatGPT、Perplexity、スマートフォンのアシスタント。その答えは一社か二社の名前を挙げることが多い。その一社になることは、上位表示とは別の仕事です。",
        ),
      },
      { kind: "h", text: l("Three jobs with three names", "Tiga pekerjaan dengan tiga nama", "三件事，三个名字", "三つの仕事、三つの名前") },
      {
        kind: "list",
        items: [
          l(
            "SEO — search engine optimisation. Making the site readable and trustworthy enough to rank for the searches buyers type.",
            "SEO — search engine optimisation. Membuat situs cukup terbaca dan tepercaya untuk masuk peringkat pada pencarian yang diketik pembeli.",
            "SEO —— 搜索引擎优化。让网站足够好读、足够可信，在买家输入的搜索里排得上。",
            "SEO（検索エンジン最適化）— 買い手が打ち込む検索で上位に入れるほど、読みやすく信頼できるサイトにすること。",
          ),
          l(
            "AEO — answer engine optimisation. Writing so a direct question gets a direct, quotable answer from your page.",
            "AEO — answer engine optimisation. Menulis supaya pertanyaan langsung mendapat jawaban langsung yang bisa dikutip dari halaman Anda.",
            "AEO —— 答案引擎优化。把内容写成：一个直接的问题，能从你的页面得到一个可以直接引用的答案。",
            "AEO（回答エンジン最適化）— 率直な質問に、あなたのページから率直で引用しやすい答えが返るように書くこと。",
          ),
          l(
            "GEO — generative engine optimisation. Making sure AI models have enough clear, consistent facts about you to recommend you at all.",
            "GEO — generative engine optimisation. Memastikan model AI punya cukup fakta yang jelas dan konsisten tentang Anda untuk bisa merekomendasikan Anda.",
            "GEO —— 生成式引擎优化。确保 AI 模型掌握足够清楚、前后一致的关于你的事实，才有可能推荐你。",
            "GEO（生成エンジン最適化）— AI モデルがあなたを推薦できるだけの、明確で一貫した事実を持っている状態にすること。",
          ),
        ],
      },
      { kind: "h", text: l("What answer engines actually reward", "Apa yang benar-benar dihargai mesin jawaban", "答案引擎真正奖励什么", "回答エンジンが実際に評価するもの") },
      {
        kind: "p",
        text: l(
          "Answer engines quote passages, not pages. They favour a clear claim near the top, specific facts they can check, and the same facts repeated consistently across your site, your profiles and the places that mention you. A page that argues it is the best gives them nothing to quote. A page that explains how to choose, and shows where you stand, gets cited as the source.",
          "Mesin jawaban mengutip paragraf, bukan halaman. Mereka menyukai klaim yang jelas di bagian atas, fakta spesifik yang bisa diperiksa, dan fakta yang sama diulang secara konsisten di situs Anda, profil Anda, dan tempat-tempat yang menyebut Anda. Halaman yang berdebat bahwa dirinya terbaik tidak memberi apa pun untuk dikutip. Halaman yang menjelaskan cara memilih, dan menunjukkan posisi Anda, dikutip sebagai sumbernya.",
          "答案引擎引用的是段落，不是整个页面。它们偏爱靠前位置的清楚论断、可以核实的具体事实，以及在你的网站、你的各种资料页和提到你的地方都保持一致的同一套事实。一个声称自己最好的页面，给不了它们任何可引用的东西；一个讲清楚怎么选、并说明你处在什么位置的页面，才会被当作来源引用。",
          "回答エンジンが引用するのはページではなく段落です。冒頭の明確な主張、確認できる具体的な事実、そしてサイト、各種プロフィール、言及されている場所で一貫して繰り返される同じ事実を好みます。自分が一番だと主張するページには引用するものがない。選び方を説明し、自社の立ち位置を示すページが、出典として引用されます。",
        ),
      },
      {
        kind: "p",
        text: l(
          "The basics overlap with good SEO: a fast site, clean structure, structured data, honest content. The difference is emphasis. SEO asks whether a page deserves a position. AEO and GEO ask whether a sentence on it deserves to be repeated.",
          "Dasarnya tumpang tindih dengan SEO yang baik: situs yang cepat, struktur yang rapi, structured data, konten yang jujur. Bedanya ada di penekanan. SEO bertanya apakah sebuah halaman layak mendapat posisi. AEO dan GEO bertanya apakah satu kalimat di dalamnya layak diulang.",
          "基本功和好的 SEO 是重叠的：快速的网站、清楚的结构、结构化数据、诚实的内容。区别在于侧重点。SEO 问的是一个页面配不配得到一个位置；AEO 和 GEO 问的是页面上的一句话配不配被转述。",
          "基本は良い SEO と重なります。速いサイト、整理された構造、構造化データ、誠実な内容。違うのは重心です。SEO はページが順位に値するかを問い、AEO と GEO はその中の一文が繰り返されるに値するかを問います。",
        ),
      },
      {
        kind: "quote",
        text: l(
          "Write the sentence you would want an assistant to say about you. Then make it true, and put it where it can be found.",
          "Tulis kalimat yang Anda ingin diucapkan asisten tentang Anda. Lalu buat itu benar, dan taruh di tempat yang bisa ditemukan.",
          "写下你希望助手替你说的那句话。然后让它成真，再把它放在找得到的地方。",
          "アシスタントに言ってほしい一文を書く。それを本当にし、見つかる場所に置く。",
        ),
      },
      {
        kind: "p",
        text: l(
          "None of this replaces a business worth recommending. It makes sure that when someone asks, the machine has enough to go on.",
          "Semua ini tidak menggantikan bisnis yang memang layak direkomendasikan. Ini memastikan bahwa saat ada yang bertanya, mesinnya punya cukup bahan.",
          "这一切都替代不了一家真正值得推荐的公司。它只是确保，当有人发问时，机器手里有足够的东西可说。",
          "どれも、推薦に値する事業の代わりにはなりません。誰かが尋ねたとき、機械に十分な材料があるようにするだけです。",
        ),
      },
    ],
  },
  {
    slug: "a-website-is-a-sales-channel-not-a-brochure",
    date: "2026-09-10",
    minutes: 4,
    cover: "/images/note-website.jpg",
    title: l(
      "A website is a sales channel, not a brochure",
      "Website adalah saluran penjualan, bukan brosur",
      "网站是销售渠道，不是宣传册",
      "ウェブサイトは販売チャネルであって、パンフレットではない",
    ),
    dek: l(
      "Most small-business sites describe the business. The ones that grow it answer the buyer's next question.",
      "Kebanyakan situs bisnis kecil menjelaskan bisnisnya. Yang menumbuhkannya menjawab pertanyaan pembeli berikutnya.",
      "多数小企业网站都在介绍自己；能带来增长的网站，回答的是买家的下一个问题。",
      "小さな会社のサイトの多くは事業を説明している。事業を伸ばすサイトは、買い手の次の質問に答えている。",
    ),
    blocks: [
      {
        kind: "p",
        text: l(
          "Look at most small-business websites and you will find the same layout: a big photo, a welcome line, an about section, a list of services, a contact form at the bottom. It describes the business accurately. It rarely sells anything.",
          "Lihat kebanyakan website bisnis kecil dan Anda akan menemukan susunan yang sama: foto besar, kalimat sambutan, bagian tentang kami, daftar layanan, formulir kontak di bawah. Ia menjelaskan bisnisnya dengan akurat. Ia jarang menjual apa pun.",
          "看看大多数小企业网站，你会发现同一种布局：一张大图、一句欢迎语、一个关于我们、一串服务列表，最下面一个联系表单。它准确地介绍了这家公司，却很少卖出什么。",
          "小さな会社のサイトの多くは同じ構成です。大きな写真、歓迎の一文、会社概要、サービス一覧、最後に問い合わせフォーム。事業を正確に説明してはいる。けれど、何かを売ることはめったにない。",
        ),
      },
      {
        kind: "p",
        text: l(
          "A brochure is written from the business outward: here is who we are. A sales channel is written from the buyer inward: here is what you are trying to decide, and here is what you need to decide it. The second version is harder to write, and it is the one that turns visitors into enquiries.",
          "Brosur ditulis dari sudut pandang bisnis keluar: inilah kami. Saluran penjualan ditulis dari sudut pandang pembeli ke dalam: inilah yang sedang Anda putuskan, dan inilah yang Anda perlukan untuk memutuskannya. Versi kedua lebih sulit ditulis, dan versi itulah yang mengubah pengunjung jadi pertanyaan.",
          "宣传册是从公司往外写的：这就是我们。销售渠道是从买家往里写的：这是你正在纠结的决定，这是你做决定需要的东西。后一种更难写，也正是它能把访客变成咨询。",
          "パンフレットは会社から外へ向けて書かれます。「私たちはこういう者です」。販売チャネルは買い手から内へ向けて書かれます。「あなたが決めようとしていることと、決めるのに必要なもの」。後者は書くのが難しく、訪問者を問い合わせに変えるのはこちらです。",
        ),
      },
      { kind: "h", text: l("Answer the questions before the call", "Jawab pertanyaannya sebelum telepon", "在电话之前把问题回答掉", "電話の前に、質問に答えておく") },
      {
        kind: "p",
        text: l(
          "Every business has a handful of questions it answers on every call: how much, how long, what is included, what happens next. Put those answers on the site, in plain language, with real numbers where you can. The buyers who were never a fit leave early. The ones who stay arrive further along.",
          "Setiap bisnis punya beberapa pertanyaan yang dijawab di setiap telepon: berapa, berapa lama, apa saja yang termasuk, apa langkah berikutnya. Taruh jawabannya di situs, dengan bahasa yang jelas, dengan angka sungguhan kalau bisa. Pembeli yang memang tidak cocok pergi lebih awal. Yang bertahan datang sudah lebih jauh.",
          "每家公司都有几个每次通话都要回答的问题：多少钱、要多久、包含什么、接下来怎么走。把这些答案用大白话、尽量带上真实数字，放到网站上。本来就不合适的买家会早早离开，留下来的，进来时已经走得更远。",
          "どの会社にも、毎回の電話で答えている質問がいくつかあります。いくらか、どのくらいかかるか、何が含まれるか、次に何が起きるか。その答えを、わかる言葉で、できれば実際の数字とともにサイトに載せる。そもそも合わない買い手は早めに離れ、残った人はより進んだ状態でやって来ます。",
        ),
      },
      {
        kind: "list",
        items: [
          l("Show a starting price, even a range.", "Tampilkan harga awal, walaupun hanya kisaran.", "给出起步价，哪怕只是个范围。", "目安の価格を出す。幅でもいい。"),
          l("Say who it is for, and who it is not for.", "Sebutkan untuk siapa, dan bukan untuk siapa.", "说清楚适合谁，也说清楚不适合谁。", "誰のためのものか、誰向けではないかを書く。"),
          l("Make the next step one tap, on the channel people already use.", "Jadikan langkah berikutnya satu ketukan, di kanal yang sudah dipakai orang.", "让下一步只需点一下，用人们本来就在用的渠道。", "次の一歩を、人がすでに使っている手段で、ワンタップに。"),
          l("Measure enquiries, not page views.", "Ukur pertanyaan yang masuk, bukan jumlah tayangan halaman.", "衡量咨询量，而不是页面浏览量。", "測るのはページビューではなく、問い合わせ。"),
        ],
      },
      { kind: "h", text: l("The channel is part of the product", "Kanalnya adalah bagian dari produk", "渠道本身就是产品的一部分", "チャネルは商品の一部") },
      {
        kind: "p",
        text: l(
          "In Indonesia most buying conversations happen on WhatsApp. A site that forces a contact form, then a reply by email, adds two steps the buyer never asked for. The sites we build route enquiries to the channel the business actually answers, with the context attached, so the conversation starts at the product instead of at hello.",
          "Di Indonesia, kebanyakan percakapan pembelian terjadi di WhatsApp. Situs yang memaksa formulir kontak lalu balasan lewat email menambah dua langkah yang tidak pernah diminta pembeli. Situs yang kami bangun mengarahkan pertanyaan ke kanal yang benar-benar dijawab bisnisnya, lengkap dengan konteksnya, jadi percakapan dimulai dari produk, bukan dari salam.",
          "在印尼，大多数购买对话发生在 WhatsApp 上。一个非要你填联系表单、再用邮件回复的网站，给买家加了两个他从没要求过的步骤。我们做的网站，会把咨询直接送到公司真正在回复的渠道，并附上上下文，让对话从产品开始，而不是从“你好”开始。",
          "インドネシアでは、購入に関する会話のほとんどが WhatsApp で行われます。問い合わせフォームを強制し、メールで返信するサイトは、買い手が求めていない手順を二つ増やします。私たちが作るサイトは、事業者が実際に返信しているチャネルへ、文脈を添えて問い合わせを届けます。会話は「こんにちは」ではなく、商品から始まります。",
        ),
      },
      {
        kind: "quote",
        text: l(
          "If your website disappeared tomorrow, would sales drop? If not, it is a brochure.",
          "Kalau website Anda hilang besok, apakah penjualan turun? Kalau tidak, itu brosur.",
          "如果你的网站明天消失，销量会掉吗？不会的话，它就是一本宣传册。",
          "明日サイトが消えたら、売上は落ちるだろうか。落ちないなら、それはパンフレットだ。",
        ),
      },
    ],
  },
];

export function noteBySlug(slug: string) {
  return NOTES.find((n) => n.slug === slug);
}

export function formatDate(iso: string, locale: string) {
  const tag = locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : locale === "id" ? "id-ID" : "en-GB";
  return new Date(iso + "T00:00:00Z").toLocaleDateString(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
