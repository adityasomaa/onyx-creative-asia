"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PillSet, SuccessScreen } from "./shared";
import { StepForm, type Step } from "./StepForm";
import { useInquirySubmit } from "./use-submit";
import {
  isEmail,
  isHttpUrl,
  PARTNERSHIP_TYPES,
  type PartnershipType,
} from "../inquiry-types";
import { useT } from "@/lib/i18n";

/**
 * Partnership, outreach from other studios, agencies, platforms.
 * No WhatsApp pre-fill, partnership convos start in email.
 */
export default function PartnershipForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [partnershipType, setPartnershipType] = useState<PartnershipType | "">(
    "",
  );
  const [proposal, setProposal] = useState("");

  const { submitting, sent, error, setError, submit, reset } =
    useInquirySubmit();

  function buildWhatsAppText(): string {
    const websiteLine = website.trim() ? `Website: ${website.trim()}\n` : "";
    return (
      "Hi Onyx Creative Asia! I just sent a partnership proposal via the contact form.\n\n" +
      `Name: ${name.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Company: ${company.trim()}\n` +
      websiteLine +
      `Partnership type: ${partnershipType}\n\n` +
      `Proposal:\n${proposal.trim()}`
    );
  }

  async function send() {
    await submit(
      {
        inquiryType: "partnership",
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        website: website.trim() || null,
        partnershipType,
        proposal: proposal.trim(),
      },
      { whatsappText: buildWhatsAppText() },
    );
  }

  const steps: Step[] = [
    {
      number: "01",
      label: "Who's reaching out?",
      validate: () =>
        !name.trim()
          ? "Please add your name."
          : !company.trim()
            ? "Add your company name."
            : null,
      node: (
        <>
          <input
            type="text"
            placeholder={t("Full name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            disabled={submitting}
            className="input"
          />
          <input
            type="text"
            placeholder={t("Company / studio")}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
            disabled={submitting}
            className="input"
          />
        </>
      ),
    },
    {
      number: "02",
      label: "How do we reach you?",
      validate: () =>
        !email.trim()
          ? "Please add your email."
          : !isEmail(email)
            ? "That email doesn't look right."
            : website.trim() && !isHttpUrl(website.trim())
              ? "Website should start with http(s)://"
              : null,
      node: (
        <>
          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={submitting}
            className="input"
          />
          <input
            type="url"
            placeholder={t("https://company.com (optional)")}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={submitting}
            className="input"
          />
        </>
      ),
    },
    {
      number: "03",
      label: "What kind of partnership?",
      validate: () => (!partnershipType ? "Pick a partnership type." : null),
      node: (
        <PillSet
          options={PARTNERSHIP_TYPES}
          selected={partnershipType}
          onToggle={(pt) =>
            setPartnershipType(
              partnershipType === pt ? "" : (pt as PartnershipType),
            )
          }
          disabled={submitting}
        />
      ),
    },
    {
      number: "04",
      label: "Outline the proposal.",
      validate: () =>
        !proposal.trim() ? "Outline the proposal in a few lines." : null,
      node: (
        <textarea
          rows={4}
          placeholder={t(
            "What are you proposing, what's in it for both sides, and what would the first 30 days look like?",
          )}
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          disabled={submitting}
          className="input resize-none"
        />
      ),
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <SuccessScreen
          key="sent"
          kicker="(Partnership proposal received)"
          headline={
            <>
              {t("Got it.")}{" "}
              <span className="font-light italic">
                {t("We'll be in touch within 5 days.")}
              </span>
            </>
          }
          body={
            <p>
              {t(
                "Most partnerships start with a short call after the first async exchange. If the fit is clear, we move fast. A copy is in your inbox now.",
              )}
            </p>
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
        <StepForm
          key="form"
          steps={steps}
          submitting={submitting}
          error={error}
          setError={setError}
          onSubmit={() => void send()}
          submitLabel="Send proposal"
        />
      )}
    </AnimatePresence>
  );
}
