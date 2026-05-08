/**
 * Studio insights — long-form essays on the work. Voice: editorial,
 * restrained, opinionated. Real specifics over hype. No hand-waving.
 *
 * Body is an ordered list of blocks. Each block is either a paragraph
 * (string) or a pull-quote (object). The reader page renders them
 * directly — no markdown parser, no runtime weight.
 */

export type InsightBlock =
  | string
  | { type: "quote"; text: string; attribution?: string };

export type Insight = {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  /** ISO date string (YYYY-MM-DD). */
  publishedAt: string;
  readingTimeMin: number;
  body: InsightBlock[];
};

export const INSIGHTS: Insight[] = [
  {
    slug: "designing-for-the-spotlight-not-the-brochure",
    title: "Designing for the spotlight, not the brochure",
    tag: "Web · Motion",
    excerpt:
      "Most marketing sites are built like brochures — every service spread on the front page, none of them earning the click. The job of a homepage isn't to list everything. It's to hold attention for the next four seconds.",
    publishedAt: "2026-05-08",
    readingTimeMin: 4,
    body: [
      "Open ten agency homepages and you'll see the same architecture. A hero, a list of services, a grid of clients, a row of awards, a mission statement, a contact form. The information is there, but the site doesn't read like a stage. It reads like a brochure that someone pinned to a wall.",
      "Brochures don't have to earn attention. The reader is already holding the paper. Websites do. The visitor arrives with a half-formed question and leaves the moment the page stops answering it. Treating the homepage like a brochure — every service, every capability, every accolade laid out flat — guarantees that the first scroll is the last one.",
      "We design the opposite way. The homepage isn't a brochure. It's the spotlight. Hold it for four seconds: one declaration, one piece of motion that earns the pause, one direction the visitor can move next. Everything else is downstream — services pages, case studies, contact — and they exist because the homepage opened the door.",
      {
        type: "quote",
        text: "A brochure proves you exist. A homepage proves you're worth the scroll.",
      },
      "Motion is the multiplier. A still hero says \"here we are.\" A looping hero — three seconds of texture, of work-in-progress, of light moving across a frame — says \"here is what it feels like to work with us.\" The difference between the two is the difference between proving you exist and proving you're worth the scroll.",
      "When we built onyxcreative.asia, the hero is a six-second loop, not a static photo. The page makes one promise — independent studio, four disciplines, ambitious teams — and lets the visitor breathe. Anything more on slide one would have killed it.",
    ],
  },
  {
    slug: "when-ai-agents-earn-their-seat-at-the-table",
    title: "When AI agents earn their seat at the table",
    tag: "AI Systems",
    excerpt:
      "Most \"AI\" sold to brands is a chatbot bolted onto a contact form. Real AI earns its seat by removing the work nobody wanted to do — quietly, in the background, without asking for credit.",
    publishedAt: "2026-05-08",
    readingTimeMin: 5,
    body: [
      "There's a version of AI that's loud. A widget in the corner of the page, a bouncing avatar, a friendly greeting that no one asked for. This kind of AI announces itself. It wants to be used. It rarely is.",
      "The other version is quiet. A pipeline that takes a form submission, looks up the client, creates the right card in the right tool, fires the right notification — all in seconds, all without a person noticing it ran. This kind of AI earns its seat at the table by removing busywork. Nobody talks about it because it's not the point.",
      "When we built RADcruiters' campaign-request automation, the brief looked simple. Replace one form. The reality was that one form had quietly become the bottleneck for a recruitment-marketing agency. Every brief pinged the team in Slack. Someone hand-parsed the URL, looked up the client in Airtable, made a Trello card, drafted a confirmation email. The form wasn't broken. The handoffs were.",
      {
        type: "quote",
        text: "The best AI system is the one your customer never notices — their problem just got solved.",
      },
      "We rebuilt the intake as a pipeline. WordPress submission triggers a webhook. The webhook extracts the vacancy URL, matches the client in Airtable, queues a Trello task with the full brief, fires a team alert and a client confirmation. End-to-end in seconds. The form looks identical. The work behind it disappeared.",
      "That's the test. If the visible surface looks the same and the work goes faster, the AI did its job. If the visible surface gets a new bouncing avatar and the work goes the same speed, you bought a chatbot.",
    ],
  },
  {
    slug: "performance-creative-isnt-a-different-language",
    title: "Performance creative isn't a different language. It's the same one, faster.",
    tag: "Paid Media",
    excerpt:
      "There's a myth that paid creative is its own discipline. It isn't. The team that ships brand should ship paid — same craft, same voice, just a tighter loop and a different success metric.",
    publishedAt: "2026-05-08",
    readingTimeMin: 4,
    body: [
      "Most studios split brand and performance into two rooms. Brand designers make the slow, considered work. Performance designers make the fast, disposable work. The two teams use different tools, different references, and — somewhere along the way — different aesthetic standards.",
      "It's a false split. The audience doesn't know which room a piece came from. They scroll. The ad either earns the next two seconds or it doesn't. Whether it was made by the brand team or the performance team is irrelevant.",
      "What does change between brand work and performance work is cadence. A brand campaign ships once a quarter. A paid campaign ships forty variants in a week. The craft has to compress. But compress isn't the same as compromise. The same designer who can hold a brand line for a year can hold it across forty ad variants — if the system supports them.",
      {
        type: "quote",
        text: "Spend that compounds isn't a budget tactic. It's a creative one.",
      },
      "The system is what makes performance creative possible. A consistent type lockup, a tested headline pattern, a small library of moving elements that can recombine. Without it, every new ad is a fresh start, and the creative team burns out by week three. With it, ad number forty has the same brand integrity as the original print piece — and probably converts better.",
      "When we run paid for clients, the creative system is part of the engagement, not separate from it. The ad team and the brand team are the same team. The metric for success is what changes — ROAS instead of awareness — but the craft is identical. Spend that compounds isn't only a budget tactic. It's a creative one.",
    ],
  },
  {
    slug: "why-we-shipped-a-hero-video-instead-of-a-hero-image",
    title: "Why we shipped a hero video instead of a hero image",
    tag: "Web · Brand",
    excerpt:
      "A hero image is a postcard. A hero video is a moment. The first viewport on a homepage isn't the place to be efficient — it's the place to set the temperature for the rest of the visit.",
    publishedAt: "2026-05-08",
    readingTimeMin: 4,
    body: [
      "Hero images are the default. They load fast, they're easy to art-direct, and you can swap them per campaign without rebuilding anything. They also do a terrible job of communicating atmosphere. A photograph holds the reader's attention for as long as their eye takes to register it. Then the scroll continues.",
      "A loop is different. Six seconds of texture — light moving across a wall, type assembling itself, a hand mid-gesture — gives the visitor something to settle into. The page becomes a place instead of a flyer. The reader doesn't even notice why they paused; they just paused.",
      "There's a real cost. The video is heavier than the image, and lazy hosting will tank Core Web Vitals if you're not careful. We mitigate the obvious way: a poster image loads first (fast, decoded inline), the video starts playing as soon as it's buffered, and a webm fallback hits browsers that can't handle the encode size. The visitor sees a still hero in 200 ms and a moving one a half-second later.",
      {
        type: "quote",
        text: "A hero image proves the page loaded. A hero loop proves the page is worth a second look.",
      },
      "What you put in the loop matters more than the fact that it loops. Stock cinematography reads as exactly that. The clip on onyxcreative.asia is a six-second still life of work-in-progress: textures, type, the studio's own workspace. It's a self-portrait at one frame per second of attention.",
      "When the loop ends, the reader has already decided whether to keep scrolling. If we did the work right, the rest of the homepage doesn't have to convince anyone of anything — it just has to deliver on the temperature the hero set.",
    ],
  },
];

/**
 * Lookup helper used by the article reader page.
 */
export function findInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}
