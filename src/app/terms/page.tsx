import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing the use of the Onyx Creative Asia website at onyxcreative.asia.",
};

const UPDATED = "5 May 2026";

export default function TermsPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Terms of Use — last updated {UPDATED})
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          Terms <span className="font-light italic">of use.</span>
        </h1>
        <p className="mt-14 md:mt-10 max-w-2xl text-lg text-ink/70 leading-relaxed">
          By using{" "}
          <Link href="/" className="border-b border-ink/40 hover:border-ink">
            onyxcreative.asia
          </Link>
          , you agree to the terms below. They cover what you can do here, what
          we can't promise, and how we handle the work shown.
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 sticky top-28">
              (Contents)
            </p>
          </div>

          <article className="md:col-span-8 md:col-start-5 space-y-12">
            <Section title="Acceptance">
              <p>
                Visiting or using this site means you accept these terms. If you
                don't, please don't use the site.
              </p>
            </Section>

            <Section title="What this site is">
              <p>
                Onyx Creative Asia (&quot;Onyx&quot;) operates this site to
                showcase our studio's work, services, and contact paths. The site
                isn't a contract — engagements are governed by separate signed
                agreements.
              </p>
            </Section>

            <Section title="Intellectual property">
              <p>
                The site's design, copy, photography, motion, and code are our
                work or licensed to us. Don't copy, redistribute, or reverse-engineer
                any of it without written permission.
              </p>
              <p>
                Logos, brand marks, and case-study images of clients shown on
                this site belong to their respective owners. They appear here with
                permission for portfolio purposes.
              </p>
            </Section>

            <Section title="Content accuracy">
              <p>
                We try to keep the site accurate, but we don't guarantee that
                every figure, claim, or piece of copy is current at all times.
                Case-study metrics reflect the period of work; performance after
                handover is not warrantied.
              </p>
            </Section>

            <Section title="Inquiries you send">
              <p>
                When you submit the contact form, you confirm the information is
                yours to share and accurate to the best of your knowledge. We
                handle that data per our{" "}
                <Link
                  href="/privacy"
                  className="border-b border-ink/40 hover:border-ink"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </Section>

            <Section title="Acceptable use">
              <p>You agree not to:</p>
              <ul className="space-y-2 pl-5 list-disc marker:text-ink/40">
                <li>Probe, scan, or test the security of the site or its infrastructure.</li>
                <li>Attempt to gain unauthorised access to any part of the site or its data.</li>
                <li>Submit automated form fills, malicious code, or spam.</li>
                <li>Use the site or its content to misrepresent who you are or what you sell.</li>
              </ul>
            </Section>

            <Section title="Third-party links">
              <p>
                Outbound links (e.g. to client sites, social platforms) lead to
                resources we don't control. We're not responsible for their
                content or practices.
              </p>
            </Section>

            <Section title="Disclaimer of warranties">
              <p>
                The site is provided &quot;as is&quot; without warranties of any
                kind, express or implied, including merchantability, fitness for a
                particular purpose, and non-infringement.
              </p>
            </Section>

            <Section title="Limitation of liability">
              <p>
                To the extent permitted by law, Onyx is not liable for any
                indirect, incidental, special, consequential, or punitive damages
                arising from your use of the site. Our total liability for any
                claim arising from the site is limited to the amount you've paid
                us for site access — which, since the site is free to use, is zero.
              </p>
            </Section>

            <Section title="Changes">
              <p>
                We may update these terms when our practices change. The
                &quot;last updated&quot; date reflects the most recent revision.
                Continued use after changes constitutes acceptance.
              </p>
            </Section>

            <Section title="Governing law">
              <p>
                These terms are governed by the laws of the Republic of Indonesia.
                Disputes that can't be resolved by good-faith conversation will be
                handled by the competent courts in Bali, Indonesia.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions:{" "}
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
      <div className="space-y-4 text-base md:text-lg leading-relaxed text-ink/85">
        {children}
      </div>
    </div>
  );
}
