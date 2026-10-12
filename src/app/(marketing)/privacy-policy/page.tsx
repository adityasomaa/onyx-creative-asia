import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { FOOTER } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Onyx Creative Asia handles personal information collected through onyxcreative.asia, including cookies and analytics.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "October 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "important-information",
    title: "Important information",
    body: (
      <>
        <p>
          This policy explains what information Onyx Creative Asia (&quot;Onyx&quot;, &quot;we&quot;, &quot;us&quot;) collects when you use
          onyxcreative.asia, how we use it, and the choices you have. Onyx is an independent digital business development agency operating from Bali,
          Indonesia.
        </p>
        <p>By using this site you agree to the practices described here. If anything is unclear, email us.</p>
      </>
    ),
  },
  {
    id: "how-we-use-your-data",
    title: "How we use your personal data",
    body: (
      <>
        <p>We use the information you give us to:</p>
        <ul>
          <li>Reply to project enquiries and arrange calls</li>
          <li>Prepare a scope and a quote you asked for</li>
          <li>Understand, in aggregate, how the site is used, if you allow analytics</li>
          <li>Keep the site and our systems secure</li>
        </ul>
        <p>We do not sell your data, and we do not use it for anything beyond what is listed here.</p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data security",
    body: (
      <p>
        Form submissions are stored in our database (Supabase, hosted in Singapore) and the site is served by Vercel. We choose vendors with reputable
        security practices and review them periodically. No method of transmission over the internet is completely secure, but we treat this seriously.
      </p>
    ),
  },
  {
    id: "data-we-collect",
    title: "The data we collect about you",
    body: (
      <ul>
        <li>Enquiry data — your name, email, an optional WhatsApp number, budget range, timing, the service you are interested in, and your message</li>
        <li>Technical data — standard server request logs (IP address, user agent, timestamps), not joined with form submissions</li>
        <li>Usage data — pages viewed and general region, through Google Analytics, only if you allow analytics cookies</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>We use two kinds of cookies and browser storage. You choose on your first visit and can change it any time from &quot;Cookie settings&quot; in the footer.</p>
        <ul>
          <li>
            Essential (always on): your language (onyx_locale), your accent colour (onyx_accent), your cookie choice (onyx_consent_v1), and two small flags
            so the intro and the colour hint only play once (onyx_intro_seen, onyx_palette_hint). None of these identify you.
          </li>
          <li>
            Analytics (off until you allow it): Google Analytics sets _ga cookies to count visits and see which pages help. If you decline, the analytics
            script is never loaded.
          </li>
        </ul>
        <p>We do not use advertising or cross-site tracking cookies.</p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-party services",
    body: (
      <p>
        We rely on a few providers to run the site and reply to you: Vercel (hosting), Supabase (database), Resend (email), Google Analytics (only with
        your consent) and WhatsApp (if you contact us there). They process data only as needed to provide their service and are bound by their own
        privacy commitments.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your legal rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul>
          <li>Show you what information we hold about you</li>
          <li>Correct anything that is inaccurate</li>
          <li>Delete your information</li>
          <li>Withdraw consent for analytics at any time</li>
        </ul>
        <p>Email us and we will handle it within a reasonable time.</p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data retention",
    body: (
      <p>
        Enquiry data is kept while the conversation is active and for up to 24 months afterwards for follow-up, then deleted or anonymised. Server logs are
        typically kept for 30 days.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>The site is not directed at people under 16 and we do not knowingly collect their data. If you believe we have, contact us and we will delete it.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We update this page when our practices change. The date at the top shows the latest revision, and material changes will be flagged on the site.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions or requests: <a href="mailto:hello@onyxcreative.asia">hello@onyxcreative.asia</a>. Onyx Creative Asia, Bali, Indonesia.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated={UPDATED}
      other={{ href: "/terms-and-conditions", label: FOOTER.termsFull }}
      sections={SECTIONS}
    />
  );
}
