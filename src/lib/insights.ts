/**
 * Studio insights, long-form essays on the work. Voice: editorial,
 * restrained, opinionated. Real specifics over hype. No hand-waving.
 *
 * Each article is a list of sections, and every section carries a short
 * heading plus its paragraphs. The reader page renders them directly, no
 * markdown parser, no runtime weight.
 */

export type InsightSection = {
  /** Two to five words, plain language. */
  heading: string;
  paragraphs: string[];
};

/**
 * The four buckets every article belongs to. Closed on purpose: a
 * free-text tag drifted into one-off labels, which made the filter row
 * grow a new pill per article and gave crawlers nothing stable to index.
 *
 * Market     — how the market moves: demand, pricing, positioning.
 * Tech       — the stack and the craft: AI, performance, build decisions.
 * Happening  — dated news: platform changes, launches, what shifted.
 * Guide      — practical how-to a reader can act on.
 */
export const INSIGHT_CATEGORIES = ["Market", "Tech", "Happening", "Guide"] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export type Insight = {
  slug: string;
  title: string;
  category: InsightCategory;
  /** Free-text subjects, used for keywords and Article `about`, not for filtering. */
  topics: string[];
  excerpt: string;
  /** ISO date string (YYYY-MM-DD). */
  publishedAt: string;
  readingTimeMin: number;
  /** Cover image, shown on the card and at the top of the article. */
  cover: string;
  sections: InsightSection[];
};

const UNSPLASH = (id: string) =>
  // Width matters now that Next is not resizing these: 1200 covers the
  // widest slot (the article hero) without shipping 2000px to a card.
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const INSIGHTS: Insight[] = [
  {
    slug: "designing-for-the-spotlight-not-the-brochure",
    title: "Why your homepage should say one thing, not ten",
    category: "Guide",
    topics: ["Web Design", "Conversion", "Motion"],
    excerpt:
      "Most business sites put every service on the front page, and none of them earn the click. A homepage has about four seconds to hold someone, so it needs one clear promise and one obvious next step.",
    publishedAt: "2026-05-08",
    readingTimeMin: 4,
    cover: UNSPLASH("photo-1497215728101-856f4ea42174"),
    sections: [
      {
        heading: "Every site looks the same",
        paragraphs: [
          "Open ten agency homepages and you will see the same architecture. A hero, a list of services, a grid of clients, a row of awards, a mission statement, a contact form. The information is all there, but the page does not read like a stage. It reads like a brochure someone pinned to a wall.",
        ],
      },
      {
        heading: "A website has to earn attention",
        paragraphs: [
          "Brochures do not have to earn attention. The reader is already holding the paper. Websites do. A visitor arrives with a half formed question and leaves the moment the page stops answering it.",
          "Treating the homepage like a brochure, with every service, every capability and every accolade laid out flat, almost guarantees that the first scroll is also the last one. A brochure proves you exist. A homepage has to prove you are worth the scroll.",
        ],
      },
      {
        heading: "One promise, one direction",
        paragraphs: [
          "We design the opposite way. The homepage is not a brochure, it is the spotlight. Hold it for four seconds with one declaration, one piece of motion that earns the pause, and one direction the visitor can move next.",
          "Everything else sits downstream. Service pages, case studies and contact all still exist, and they get read precisely because the homepage opened the door.",
        ],
      },
      {
        heading: "Motion is the multiplier",
        paragraphs: [
          "A still hero tells a visitor that you are here. A looping hero, three seconds of texture, of work in progress, of light moving across a frame, tells them what it feels like to work with you. That is the difference between proving you exist and proving you are worth a second look.",
        ],
      },
      {
        heading: "How we built our own",
        paragraphs: [
          "On onyxcreative.asia the hero is a six second loop rather than a static photo. The page makes a single promise, an independent studio with four disciplines serving ambitious teams, and then lets the visitor breathe. Anything more on the first screen would have killed it.",
        ],
      },
    ],
  },
  {
    slug: "when-ai-agents-earn-their-seat-at-the-table",
    title: "Useful AI removes work. It doesn't add a chatbot.",
    category: "Tech",
    topics: ["AI Automation", "Operations"],
    excerpt:
      "Most AI sold to businesses is a chat widget bolted onto a contact form. The version worth paying for runs in the background, takes the admin off your team's plate, and never asks to be noticed.",
    publishedAt: "2026-05-08",
    readingTimeMin: 5,
    cover: UNSPLASH("photo-1552664730-d307ca884978"),
    sections: [
      {
        heading: "The loud kind",
        paragraphs: [
          "There is a version of AI that is loud. A widget in the corner of the page, a bouncing avatar, a friendly greeting nobody asked for. This kind of AI announces itself. It wants to be used. It rarely is.",
        ],
      },
      {
        heading: "The quiet kind",
        paragraphs: [
          "The other version is quiet. A pipeline takes a form submission, looks up the client, creates the right card in the right tool, and fires the right notification, all in seconds, all without anyone noticing it ran.",
          "This kind of AI earns its place by removing busywork. Nobody talks about it, because being talked about was never the point. The best system is the one your customer never notices, their problem just got solved.",
        ],
      },
      {
        heading: "What RADcruiters actually needed",
        paragraphs: [
          "When we built the campaign request automation for RADcruiters, the brief looked simple. Replace one form. The reality was that this one form had quietly become the bottleneck for a recruitment marketing agency.",
          "Every brief pinged the team in Slack. Someone hand parsed the URL, looked up the client in Airtable, made a Trello card, then drafted a confirmation email. The form was not broken. The handoffs were.",
        ],
      },
      {
        heading: "What we built instead",
        paragraphs: [
          "We rebuilt the intake as a pipeline. A WordPress submission triggers a webhook. The webhook extracts the vacancy URL, matches the client in Airtable, queues a Trello task with the full brief, then fires a team alert and a client confirmation. End to end in seconds.",
          "The form looks identical from the outside. The work behind it disappeared.",
        ],
      },
      {
        heading: "A simple test",
        paragraphs: [
          "That is the test worth applying to anything sold to you as AI. If the visible surface looks the same and the work goes faster, the system did its job. If the visible surface gains a bouncing avatar and the work goes at exactly the same speed, you bought a chatbot.",
        ],
      },
    ],
  },
  {
    slug: "performance-creative-isnt-a-different-language",
    title: "Your ads and your brand should come from the same team",
    category: "Market",
    topics: ["Paid Media", "Brand", "Agency Model"],
    excerpt:
      "Plenty of studios treat paid creative as a separate craft with lower standards. It isn't. The people who build your brand should run your ads, working faster and measured differently.",
    publishedAt: "2026-05-08",
    readingTimeMin: 4,
    cover: UNSPLASH("photo-1521737711867-e3b97375f902"),
    sections: [
      {
        heading: "The two room problem",
        paragraphs: [
          "Most studios split brand and performance into two rooms. Brand designers make the slow, considered work. Performance designers make the fast, disposable work. Over time the two teams end up using different tools, different references and, quietly, different standards.",
        ],
      },
      {
        heading: "The audience cannot tell",
        paragraphs: [
          "It is a false split. The audience has no idea which room a piece came from. They scroll. The ad either earns the next two seconds or it does not. Which team made it is irrelevant to everyone except the org chart.",
        ],
      },
      {
        heading: "What actually changes",
        paragraphs: [
          "The real difference between brand work and performance work is cadence. A brand campaign launches once a quarter. A paid campaign launches forty variants in a week, so the craft has to compress.",
          "Compressing is not the same as compromising. The designer who can hold a brand line for a year can hold it across forty ad variants, as long as the system supports them.",
        ],
      },
      {
        heading: "The system does the work",
        paragraphs: [
          "That system is what makes good performance creative possible. A consistent type lockup, a tested headline pattern, a small library of moving elements that recombine.",
          "Without it, every new ad is a fresh start and the team burns out by week three. With it, ad number forty carries the same brand integrity as the original print piece, and it probably converts better too.",
        ],
      },
      {
        heading: "How we run paid",
        paragraphs: [
          "When we run paid for clients, the creative system is part of the engagement rather than something bought separately. The ad team and the brand team are the same team. What changes is the measure of success, ROAS instead of awareness, while the craft stays identical. Spend that compounds is not only a budget tactic, it is a creative one.",
        ],
      },
    ],
  },
  {
    slug: "why-we-shipped-a-hero-video-instead-of-a-hero-image",
    title: "Why our homepage opens with a short video, not a photo",
    category: "Tech",
    topics: ["Web Performance", "Video", "Brand"],
    excerpt:
      "A photo tells a visitor the page loaded. A few seconds of movement gives them a reason to stay. Here is what a hero loop costs in load time, and how we keep the page fast anyway.",
    publishedAt: "2026-05-08",
    readingTimeMin: 4,
    cover: UNSPLASH("photo-1519823551278-64ac92734fb1"),
    sections: [
      {
        heading: "Why images are the default",
        paragraphs: [
          "Hero images are the safe choice. They load fast, they are easy to art direct, and you can swap them per campaign without rebuilding anything.",
          "They also do a poor job of communicating atmosphere. A photograph holds attention for about as long as the eye takes to register it. Then the scroll continues.",
        ],
      },
      {
        heading: "What a loop does differently",
        paragraphs: [
          "A loop behaves differently. Six seconds of texture, light moving across a wall, type assembling itself, a hand mid gesture, gives a visitor something to settle into. The page becomes a place rather than a flyer. Most readers never work out why they paused. They just paused.",
        ],
      },
      {
        heading: "Keeping the page fast",
        paragraphs: [
          "There is a real cost to this. Video is heavier than an image, and lazy hosting will drag down Core Web Vitals if you are careless.",
          "We handle it the obvious way. A poster image loads first and decodes inline, the video starts as soon as it has buffered, and a webm fallback covers browsers that cannot handle the encode size. The visitor sees a still hero in about 200 ms and a moving one half a second later.",
        ],
      },
      {
        heading: "What goes in the loop",
        paragraphs: [
          "What you put in the loop matters far more than the fact that it loops at all. Stock cinematography reads as exactly that, and it undoes the effect instantly.",
          "The clip on onyxcreative.asia is a six second still life of work in progress: textures, type and the studio's own workspace. It is a self portrait, running at one frame per second of attention.",
        ],
      },
      {
        heading: "Setting the temperature",
        paragraphs: [
          "By the time the loop ends, the reader has already decided whether to keep scrolling. If the hero did its job, the rest of the homepage does not have to convince anyone of anything. It only has to deliver on the temperature the first screen set.",
        ],
      },
    ],
  },
  {
    slug: "answer-engines-changed-how-businesses-get-found",
    title:
      "Search now answers the question itself. Your site has to be what it quotes.",
    category: "Happening",
    topics: ["AEO", "SEO", "AI Search"],
    excerpt:
      "Google, ChatGPT, and Perplexity increasingly answer a query outright instead of handing over ten blue links. That does not remove the need for a website. It changes what the website has to contain.",
    publishedAt: "2026-07-14",
    readingTimeMin: 5,
    cover: UNSPLASH("photo-1451187580459-43490279c0fa"),
    sections: [
      {
        heading: "The click is no longer the default",
        paragraphs: [
          "For twenty years the job of a page was to win a click. Rank in the top few results, write a title someone wants to open, and the visit follows. That mechanic still works, but it is no longer the only one, and for a growing share of questions it is not the first one.",
          "Someone asking what a villa website costs in Bali, or whether they need freehold or leasehold, now often gets a written answer before any link. That answer is assembled from pages the engine trusts. If your page is not one of them, you are not in the conversation, whatever your ranking says.",
        ],
      },
      {
        heading: "Answer engines quote, they do not browse",
        paragraphs: [
          "An answer engine is not reading your homepage the way a visitor does. It is looking for a claim it can lift, attribute, and defend. Marketing language gives it nothing to lift. A specific, checkable statement does.",
          "“We deliver world class digital solutions” cannot be quoted. “A five page marketing site in Bali runs 25 to 70 million rupiah, and copy is the biggest variable” can be. One is a posture. The other is an answer.",
        ],
      },
      {
        heading: "What we changed on our own site",
        paragraphs: [
          "We wrote the questions out as headings and answered them directly underneath, in the words a client would use rather than the words an agency would. We put ranges in public. We marked up services, location, and reviews as structured data so nothing has to be inferred from layout.",
          "We also keep an llms.txt at the root: a plain text summary of who we are, what we do, and where the canonical answers live. It costs nothing and removes the guesswork for any crawler that respects it.",
        ],
      },
      {
        heading: "This is not separate from SEO",
        paragraphs: [
          "None of it trades against ranking. Clear headings, real specifics, fast pages, and correct structured data are the same things that have always helped in classic search. Answer engines only raised the penalty for vagueness.",
          "The practical test is short. Take the five questions a client asks before they hire you. If the answer is not written down somewhere on your site in plain language, then there is nothing for anything to quote.",
        ],
      },
    ],
  },
  {
    slug: "instagram-grid-went-portrait-and-most-feeds-broke",
    title:
      "Instagram's grid went portrait. Most brand feeds are still cropped wrong.",
    category: "Happening",
    topics: ["Instagram", "Social Media", "Content"],
    excerpt:
      "The profile grid stopped being square. Feeds built on square art now sit inside a taller frame, with headlines clipped and logos drifting out of view. It is a short fix per template, and almost nobody has made it.",
    publishedAt: "2026-06-23",
    readingTimeMin: 4,
    cover: UNSPLASH("photo-1611162617213-7d7a39e9b1d7"),
    sections: [
      {
        heading: "A square habit in a portrait grid",
        paragraphs: [
          "Brand feeds were built square because the grid was square. Templates put the headline near the top edge, the logo near the bottom, and trusted that both would survive the crop.",
          "The grid is taller now. A square post placed inside a portrait cell is either padded or scaled, and the safe zones drawn against the old crop no longer match what a visitor actually sees on the profile.",
        ],
      },
      {
        heading: "What actually gets lost",
        paragraphs: [
          "The damage is not dramatic, which is exactly why it goes unnoticed. A headline loses its first line. A logo sits half out of frame. A call to action lands below the visible part of the cell.",
          "Nothing looks broken enough to report. But the grid stops reading as one system, and the grid is the only view most people ever see before deciding whether to follow.",
        ],
      },
      {
        heading: "The fix is a template change, not a reshoot",
        paragraphs: [
          "Design the post at the taller ratio and keep everything that has to survive inside a centre-safe band. Decorative elements can live outside it. The full post still shows in the feed; the grid crop just stops eating the message.",
          "Old posts do not need deleting. Recrop the ones that still carry weight, leave the rest, and let the new template take the feed forward from here.",
        ],
      },
      {
        heading: "Why we file this under news",
        paragraphs: [
          "Platform geometry changes are quiet and they are frequent. Nobody sends a memo. A feed simply looks slightly worse one week and stays that way for a year.",
          "Someone has to be watching for it. That is a large part of what running a feed actually means, and it is invisible when it is done and obvious when it is not.",
        ],
      },
    ],
  },
  {
    slug: "what-a-website-actually-costs-in-bali",
    title:
      "What a website actually costs in Bali, and why the quotes vary so much",
    category: "Market",
    topics: ["Pricing", "Web Development", "Bali"],
    excerpt:
      "The same brief comes back at 8 million rupiah from one shop and 90 million from another. The gap is not margin. It is scope nobody wrote down, so here is what is actually inside the number.",
    publishedAt: "2026-07-02",
    readingTimeMin: 6,
    cover: UNSPLASH("photo-1454165804606-c3d57bc86b40"),
    sections: [
      {
        heading: "The number nobody publishes",
        paragraphs: [
          "Ask five studios in Bali what a website costs and you will get five invitations to a discovery call. Some of the reluctance is fair, because the work genuinely varies. The effect, though, is that a business owner cannot set a budget without booking four meetings first.",
          "So here is our version of the answer with the ranges written down. Rupiah, mid 2026, for work delivered by a team rather than one freelancer.",
        ],
      },
      {
        heading: "Where the ranges actually sit",
        paragraphs: [
          "A template build on WordPress or a site builder, with your copy and photos already in hand, runs roughly 8 to 20 million. It is the right call when you need to exist online this month and the site is a business card.",
          "A custom marketing site, five to ten pages, designed and built rather than assembled, runs roughly 25 to 70 million. Most established businesses land in this band.",
          "Anything with software behind it, a booking flow, a filtered catalogue, a client portal, starts around 60 million and climbs with the logic rather than the page count.",
        ],
      },
      {
        heading: "What actually moves the number",
        paragraphs: [
          "Copy is the biggest variable and the one most quotes stay silent about. If the words do not exist yet, somebody has to write them, and that is a real line item rather than a rounding error.",
          "Photography is second. A site designed around imagery you do not have will either be delayed or filled with stock, and both cost more than shooting it properly once.",
          "Third is integration. Connecting a site to the tools a business already runs, a CRM, an inventory system, a WhatsApp flow, is where a two week build turns into a six week one.",
        ],
      },
      {
        heading: "Cheap is not the same as wasteful",
        paragraphs: [
          "A template build is a sound decision for a business that needs presence and does not yet know what converts. Spending 70 million to find that out is the mistake. Spending 12 is not.",
          "The waste we see most often sits in the middle: a custom price paid for a site that was, in the end, assembled from a template anyway. Ask what is being designed and what is being configured. That question separates the two bands cleanly.",
        ],
      },
      {
        heading: "Three questions to ask before you sign",
        paragraphs: [
          "Ask who writes the copy. Ask who owns the hosting and the domain after launch. Ask what happens when you want a new section in six months, and whether that is included or quoted again.",
          "The answers to those three explain most of the spread between any two quotes you are currently holding.",
        ],
      },
    ],
  },
  {
    slug: "how-to-brief-a-website-so-it-ships",
    title:
      "How to brief a website so it actually ships",
    category: "Guide",
    topics: ["Process", "Web Development", "Briefing"],
    excerpt:
      "Most late projects were not badly built. They were badly briefed, and the delay surfaced in week five as a question that should have been settled in week one. Six things to decide before anyone opens a design tool.",
    publishedAt: "2026-06-11",
    readingTimeMin: 5,
    cover: UNSPLASH("photo-1522542550221-31fd19575a2d"),
    sections: [
      {
        heading: "Delays are almost always upstream",
        paragraphs: [
          "When a build runs late, the visible cause is usually a revision round or a missing asset. The real cause is older: a decision nobody made at the start, which stayed invisible until the work reached the point where it could no longer be dodged.",
          "A brief is not paperwork. It is the list of decisions you are choosing to make now instead of in week five.",
        ],
      },
      {
        heading: "Name the one thing the site has to do",
        paragraphs: [
          "Not three things. One. Book a treatment, request a quote, apply for a role, buy a product. Everything else is allowed to exist, but the primary action is what the layout gets arranged around.",
          "If the honest answer is more than one, the site has more than one audience. That is a structural fact worth knowing before the first page is drawn, not after.",
        ],
      },
      {
        heading: "Settle the copy question first",
        paragraphs: [
          "Decide who writes the words and when they are due. This is the single most common reason a project sits at ninety percent finished for a month.",
          "Design against real copy wherever you can. A layout tested on placeholder text will break the first time a real headline runs three lines instead of one.",
        ],
      },
      {
        heading: "Bring the assets, or budget for them",
        paragraphs: [
          "Logo files in vector, photography at full resolution, whatever brand rules already exist. If something is missing that is fine, but it needs a line in the budget and a date, not an assumption that it will turn up.",
        ],
      },
      {
        heading: "Write down what you are not doing",
        paragraphs: [
          "A short list of what is explicitly out of scope prevents most of the awkward conversations later. Multi-language, e-commerce, a blog, a client login. Naming them as out is not a refusal, it is a phase two.",
        ],
      },
      {
        heading: "Agree how feedback arrives",
        paragraphs: [
          "One person consolidates comments, in one place, by an agreed day. Feedback arriving from four people across three channels over two weeks is not four times the input, it is four times the calendar.",
          "That single line in a brief tends to save more time than every other line combined.",
        ],
      },
    ],
  },
];

/**
 * Lookup helper used by the article reader page.
 */
export function findInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

/** URL segment for a category, e.g. "Happening" -> "happening". */
export function categorySlug(category: InsightCategory): string {
  return category.toLowerCase();
}

/** Resolve a URL segment back to its category, or undefined if unknown. */
export function categoryFromSlug(slug: string): InsightCategory | undefined {
  return INSIGHT_CATEGORIES.find((c) => categorySlug(c) === slug.toLowerCase());
}

/** Articles in a category, newest first. */
export function insightsByCategory(category: InsightCategory): Insight[] {
  return INSIGHTS.filter((i) => i.category === category).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

/** One-line description per category, used on the category pages and in meta. */
export const CATEGORY_BLURB: Record<InsightCategory, string> = {
  Market: "How the market moves: what clients are buying, what it costs, and where the demand is going.",
  Tech: "The stack and the craft: AI systems, performance, and the build decisions behind the work.",
  Happening: "Dated news: platform changes, launches, and the shifts worth reacting to.",
  Guide: "Practical how-to you can act on this week, written from work we have actually shipped.",
};
