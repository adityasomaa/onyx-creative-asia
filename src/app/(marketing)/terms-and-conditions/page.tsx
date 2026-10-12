import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { FOOTER } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing the use of the Onyx Creative Asia website at onyxcreative.asia.",
  alternates: { canonical: "/terms-and-conditions" },
};

const UPDATED = "October 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance",
    body: <p>Visiting or using onyxcreative.asia means you accept these terms. If you don&apos;t, please don&apos;t use the site.</p>,
  },
  {
    id: "about-this-site",
    title: "About this site",
    body: (
      <p>
        Onyx Creative Asia (&quot;Onyx&quot;) operates this site to show the studio&apos;s work, services and ways to get in touch. The site is not a
        contract: engagements are governed by separate written agreements.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <p>The site&apos;s design, copy, motion and code are our work or licensed to us. Don&apos;t copy, redistribute or reverse-engineer them without written permission.</p>
        <p>
          Client names, logos and case-study images belong to their owners and appear with permission for portfolio purposes. Some photography is used
          under the Unsplash licence.
        </p>
      </>
    ),
  },
  {
    id: "accuracy",
    title: "Accuracy",
    body: (
      <p>
        We try to keep the site accurate but don&apos;t guarantee every figure or price is current at all times. Prices shown are a guide; the price that
        applies to your project is the one in your written scope. Case-study outcomes describe the period of our work.
      </p>
    ),
  },
  {
    id: "submissions",
    title: "Your submissions",
    body: (
      <p>
        When you send the contact form you confirm the information is yours to share and accurate to the best of your knowledge. We handle it as described
        in our <a href="/privacy-policy">Privacy policy</a>.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-party links",
    body: <p>Links to client sites and social platforms lead to resources we don&apos;t control. We&apos;re not responsible for their content or practices.</p>,
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    body: (
      <p>
        The site is provided &quot;as is&quot;, without warranties of any kind, express or implied, including merchantability, fitness for a particular
        purpose and non-infringement.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the extent permitted by law, Onyx is not liable for indirect, incidental, special, consequential or punitive damages arising from your use of
        the site. Since the site is free to use, our total liability for any claim arising from it is limited to zero.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>We may update these terms when our practices change. The date at the top shows the latest revision; continued use means you accept the update.</p>,
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of the Republic of Indonesia. Disputes that can&apos;t be resolved in good faith will be handled by the competent
        courts in Bali, Indonesia.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions: <a href="mailto:hello@onyxcreative.asia">hello@onyxcreative.asia</a>.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms & conditions"
      updated={UPDATED}
      other={{ href: "/privacy-policy", label: FOOTER.privacy }}
      sections={SECTIONS}
    />
  );
}
