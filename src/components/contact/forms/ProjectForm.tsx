"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PillSet, SuccessScreen } from "./shared";
import { StepForm, type Step } from "./StepForm";
import { useInquirySubmit } from "./use-submit";
import { isEmail } from "../inquiry-types";
import { SERVICES } from "@/lib/data";
import { useT } from "@/lib/i18n";

const SERVICE_OPTIONS = SERVICES.map((s) => s.title);

const BUDGETS = [
  "< $1k",
  "$1k–$3k",
  "$3k–$5k",
  "$5k–$10k",
  "$10k+",
  "Not sure yet",
] as const;

/**
 * Project Brief. Pre-fills WhatsApp so the conversation can move there if
 * the visitor prefers chat.
 */
export default function ProjectForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const { submitting, sent, error, setError, submit, reset } =
    useInquirySubmit();

  function toggleService(s: string) {
    setServices((curr) =>
      curr.includes(s) ? curr.filter((c) => c !== s) : [...curr, s],
    );
  }

  function buildWhatsAppText(): string {
    const interest = services.length > 0 ? services.join(", ") : ", ";
    return (
      "Hi Onyx Creative Asia! I just sent a project brief via the contact form. Quick recap:\n\n" +
      `Name: ${name.trim()}\n` +
      `Company: ${company.trim() || ", "}\n` +
      `Email: ${email.trim()}\n` +
      `Interested in: ${interest}\n` +
      `Budget: ${budget ?? ", "}\n\n` +
      `Brief:\n${message.trim()}`
    );
  }

  async function send() {
    await submit(
      {
        inquiryType: "project",
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || null,
        services,
        budget,
        message: message.trim(),
      },
      { whatsappText: buildWhatsAppText() },
    );
  }

  const steps: Step[] = [
    {
      number: "01",
      label: "Who are we talking to?",
      validate: () => (!name.trim() ? "Please add your name." : null),
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
            placeholder={t("Company (optional)")}
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
      label: "Where can we reach you?",
      validate: () =>
        !email.trim()
          ? "Please add your email."
          : !isEmail(email)
            ? "That email doesn't look right."
            : null,
      node: (
        <input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={submitting}
          className="input"
        />
      ),
    },
    {
      number: "03",
      label: "What do you need?",
      node: (
        <PillSet
          options={SERVICE_OPTIONS}
          selected={services}
          onToggle={toggleService}
          multi
          disabled={submitting}
        />
      ),
    },
    {
      number: "04",
      label: "Budget in mind?",
      node: (
        <PillSet
          options={BUDGETS}
          selected={budget ?? ""}
          onToggle={(b) => setBudget(budget === b ? null : b)}
          disabled={submitting}
        />
      ),
    },
    {
      number: "05",
      label: "Tell us about the project.",
      validate: () => (!message.trim() ? "Please add a short brief." : null),
      node: (
        <textarea
          rows={4}
          placeholder={t("Goals, timing, anything we should know…")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
          kicker="(Brief sent, confirmation on its way)"
          headline={
            <>
              {t("We got it. We'll")}{" "}
              <span className="font-normal italic">
                {t("reply within 48 hours.")}
              </span>
            </>
          }
          body={
            <p>
              {t(
                "A copy of your brief is in your inbox now, keep an eye on it (and check spam, just in case). We also opened a WhatsApp tab if you'd rather keep the conversation there.",
              )}
            </p>
          }
          onReset={() => {
            reset();
            setName("");
            setEmail("");
            setCompany("");
            setBudget(null);
            setServices([]);
            setMessage("");
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
          submitLabel="Send the brief"
          submitKicker="EMAIL + WHATSAPP"
        />
      )}
    </AnimatePresence>
  );
}
