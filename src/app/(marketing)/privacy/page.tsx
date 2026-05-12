import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Onyx Creative Asia handles personal information collected through this website.",
};

const UPDATED = "5 May 2026";

export default function PrivacyPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Privacy Policy — last updated {UPDATED})
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          Privacy <span className="font-light italic">policy.</span>
        </h1>
        <p className="mt-14 md:mt-10 max-w-2xl text-lg text-ink/70 leading-relaxed">
          This page explains what information we collect when you use{" "}
          <Link href="/" className="border-b border-ink/40 hover:border-ink">
            onyxcreative.asia
          </Link>
          , what we do with it, and the choices you have. We try to keep this
          plain. If anything's unclear, email{" "}
          <a
            href="mailto:hello@onyxcreative.asia"
            className="border-b border-ink/40 hover:border-ink"
          >
            hello@onyxcreative.asia
          </a>
          .
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 sticky top-28">
              (Contents)
            </p>
          </div>

          <article className="md:col-span-8 md:col-start-5 prose-ink space-y-12">
            <Section title="Who we are">
              <p>
                Onyx Creative Asia (&quot;Onyx,&quot; &quot;we,&quot; &quot;us&quot;)
                is an independent studio operating from Bali, Indonesia. We build
                websites, run paid media, produce social content, and develop AI
                systems for clients across Asia and beyond.
              </p>
            </Section>

            <Section title="Information we collect">
              <p>We only collect personal information you give us, directly or via the form below. Specifically:</p>
              <ul>
                <li>
                  <strong>Contact form submissions</strong> — name, email, optional
                  company name, optional budget, services of interest, and the
                  message you write.
                </li>
                <li>
                  <strong>Cookies</strong> — small text files stored in your
                  browser. We use only what's needed to make the site work and to
                  understand how it's used in aggregate. You can control these via
                  the cookie banner that appears on your first visit.
                </li>
                <li>
                  <strong>Server logs</strong> — our hosting provider (Vercel) keeps
                  standard request logs (IP address, user-agent, timestamps). These
                  are not joined with form submissions or used for marketing.
                </li>
              </ul>
              <p>We don't collect special-category data, financial data, or anything sensitive on this site.</p>
            </Section>

            <Section title="How we use it">
              <ul>
                <li>To reply to project inquiries you send through the contact form.</li>
                <li>To maintain and secure the site (hosting, error monitoring, basic analytics).</li>
                <li>To improve the site over time — but only on aggregated, anonymous patterns.</li>
              </ul>
              <p>We don't sell your data. We don't share it with advertisers. We don't add you to a marketing list unless you explicitly opt in.</p>
            </Section>

            <Section title="Where it lives">
              <p>
                Form submissions are stored in our database (Supabase, hosted in
                Singapore). Server logs sit with Vercel. We pick vendors with
                reputable security postures and review them periodically.
              </p>
            </Section>

            <Section title="How long we keep it">
              <p>
                Inquiry data: kept for as long as the conversation is active, plus
                up to 24 months for follow-up purposes. After that, we delete or
                anonymise it. Server logs: typically 30 days.
              </p>
            </Section>

            <Section title="Your rights">
              <p>You have the right to:</p>
              <ul>
                <li>Ask what we hold about you.</li>
                <li>Ask us to correct or delete it.</li>
                <li>Withdraw consent at any time.</li>
                <li>Object to processing, or ask for a portable copy.</li>
              </ul>
              <p>
                Email{" "}
                <a
                  href="mailto:hello@onyxcreative.asia"
                  className="border-b border-ink/40 hover:border-ink"
                >
                  hello@onyxcreative.asia
                </a>{" "}
                and we'll handle it within a reasonable time.
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                We use a small set of cookies to make the site function and to
                understand basic usage. None are used for cross-site tracking or
                advertising. The cookie banner on your first visit lets you accept
                them. You can clear them any time via your browser's privacy
                settings.
              </p>
            </Section>

            <Section title="Children">
              <p>
                The site isn't directed at people under 16. We don't knowingly
                collect data from children. If you believe we have, contact us and
                we'll delete it.
              </p>
            </Section>

            <Section title="Changes to this policy">
              <p>
                We update this page when our practices change. The &quot;last
                updated&quot; date at the top reflects the most recent revision.
                Material changes will be flagged on the site.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions or requests:{" "}
                <a
                  href="mailto:hello@onyxcreative.asia"
                  className="border-b border-ink/40 hover:border-ink"
                >
                  hello@onyxcreative.asia
                </a>
                .
              </p>
            </Section>
          </article>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-5 leading-tight">
        {title}
      </h2>
      <div className="space-y-4 text-base md:text-lg leading-relaxed text-ink/85 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:marker:text-ink/40">
        {children}
      </div>
    </div>
  );
}
