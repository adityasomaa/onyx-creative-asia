"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  ErrorPill,
  FormStyles,
  Group,
  PillSet,
  SubmitRow,
  SuccessScreen,
} from "./shared";
import { useInquirySubmit } from "./use-submit";
import {
  isEmail,
  isHttpUrl,
  PARTNERSHIP_TYPES,
  type PartnershipType,
} from "../inquiry-types";

/**
 * Partnership — outreach from other studios, agencies, platforms.
 * Company, partnership type, website (for context), and the proposal.
 *
 * No WhatsApp pre-fill — partnership convos start in email.
 */
export default function PartnershipForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [partnershipType, setPartnershipType] = useState<PartnershipType | "">(
    ""
  );
  const [proposal, setProposal] = useState("");

  const { submitting, sent, error, setError, submit, reset } =
    useInquirySubmit();

  function validate(): boolean {
    if (!name.trim()) return fail("Please add your name.");
    if (!email.trim()) return fail("Please add your email.");
    if (!isEmail(email)) return fail("That email doesn't look right.");
    if (!company.trim()) return fail("Add your company name.");
    if (website.trim() && !isHttpUrl(website.trim())) {
      return fail("Website should start with http(s)://");
    }
    if (!partnershipType) return fail("Pick a partnership type.");
    if (!proposal.trim()) return fail("Outline the proposal in a few lines.");
    setError(null);
    return true;
  }
  function fail(msg: string) {
    setError(msg);
    return false;
  }

  async function send() {
    if (!validate()) return;
    await submit({
      inquiryType: "partnership",
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      website: website.trim() || null,
      partnershipType,
      proposal: proposal.trim(),
    });
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <SuccessScreen
          key="sent"
          kicker="(Partnership proposal received)"
          headline={
            <>
              Got it.{" "}
              <span className="font-light italic">
                We&apos;ll be in touch within 5 days.
              </span>
            </>
          }
          body={
            <>
              <p>
                Most partnerships start with a short call after the first
                async exchange. If the fit is clear, we move fast.
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] opacity-50">
                Or write us anytime at{" "}
                <a
                  href="mailto:hello@onyxcreative.asia"
                  className="underline underline-offset-4 hover:opacity-100 opacity-90"
                >
                  hello@onyxcreative.asia
                </a>
              </p>
            </>
          }
          onReset={() => {
            reset();
            setName("");
            setEmail("");
            setCompany("");
            setWebsite("");
            setPartnershipType("");
            setProposal("");
          }}
        />
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!submitting) void send();
          }}
          className="space-y-12 md:space-y-16"
          noValidate
        >
          <Group label="Hello, my name is" number="01">
            <input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={submitting}
              className="input"
            />
            <input
              type="text"
              required
              placeholder="Company / studio"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
              disabled={submitting}
              className="input"
            />
          </Group>

          <Group label="You can reach me at" number="02">
            <input
              type="email"
              required
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={submitting}
              className="input"
            />
            <input
              type="url"
              placeholder="https://company.com (optional)"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              disabled={submitting}
              className="input"
            />
          </Group>

          <Group label="Type of partnership" number="03">
            <PillSet
              options={PARTNERSHIP_TYPES}
              selected={partnershipType}
              onToggle={(t) =>
                setPartnershipType(
                  partnershipType === t ? "" : (t as PartnershipType)
                )
              }
              disabled={submitting}
            />
          </Group>

          <Group label="The proposal" number="04">
            <textarea
              required
              rows={6}
              placeholder="What are you proposing, what's in it for both sides, and what would the first 30 days look like?"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              disabled={submitting}
              className="input resize-none"
            />
          </Group>

          {error && <ErrorPill>{error}</ErrorPill>}

          <SubmitRow
            submitting={submitting}
            caption="We reply to every proposal within 5 days."
            ctaLabel="Send proposal"
            ctaKicker="EMAIL"
          />
          <FormStyles />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
