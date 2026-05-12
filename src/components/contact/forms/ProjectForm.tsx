"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  ErrorPill,
  FormStyles,
  Group,
  PillSet,
  SubmitRow,
  SuccessFallback,
  SuccessScreen,
} from "./shared";
import { useInquirySubmit } from "./use-submit";
import { isEmail } from "../inquiry-types";

const SERVICES = [
  "Web Development",
  "Paid Media",
  "Social Media",
  "AI Systems",
  "Brand & Design",
] as const;

const BUDGETS = [
  "< $1k",
  "$1k–$3k",
  "$3k–$5k",
  "$5k–$10k",
  "$10k+",
  "Not sure yet",
] as const;

/**
 * Project Brief — the original full contact form. Pre-fills WhatsApp so
 * the conversation can move there if the visitor prefers chat.
 */
export default function ProjectForm() {
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
      curr.includes(s) ? curr.filter((c) => c !== s) : [...curr, s]
    );
  }

  function validate(): boolean {
    if (!name.trim()) return fail("Please add your name.");
    if (!email.trim()) return fail("Please add your email.");
    if (!isEmail(email)) return fail("That email doesn't look right.");
    if (!message.trim()) return fail("Please add a short brief.");
    setError(null);
    return true;
  }
  function fail(msg: string) {
    setError(msg);
    return false;
  }

  function buildWhatsAppText(): string {
    const interest = services.length > 0 ? services.join(", ") : "—";
    return (
      "Hi Onyx Creative Asia! I just sent a project brief via the contact form. Quick recap:\n\n" +
      `Name: ${name.trim()}\n` +
      `Company: ${company.trim() || "—"}\n` +
      `Email: ${email.trim()}\n` +
      `Interested in: ${interest}\n` +
      `Budget: ${budget ?? "—"}\n\n` +
      `Brief:\n${message.trim()}`
    );
  }

  async function send() {
    if (!validate()) return;
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
      { whatsappText: buildWhatsAppText() }
    );
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <SuccessScreen
          key="sent"
          kicker="(Brief sent — confirmation on its way)"
          headline={
            <>
              We got it. We&apos;ll{" "}
              <span className="font-light italic">reply within 48 hours.</span>
            </>
          }
          body={
            <>
              <p>
                A copy of your brief is in your inbox now — keep an eye on it
                (and check spam, just in case). We also opened a WhatsApp tab
                if you&apos;d rather keep the conversation there.
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
            setBudget(null);
            setServices([]);
            setMessage("");
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
              placeholder="Company (optional)"
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
          </Group>

          <Group label="I'm interested in" number="03">
            <PillSet
              options={SERVICES}
              selected={services}
              onToggle={toggleService}
              multi
              disabled={submitting}
            />
          </Group>

          <Group label="Budget in mind" number="04">
            <PillSet
              options={BUDGETS}
              selected={budget ?? ""}
              onToggle={(b) => setBudget(budget === b ? null : b)}
              disabled={submitting}
            />
          </Group>

          <Group label="A bit about the project" number="05">
            <textarea
              required
              rows={5}
              placeholder="Goals, timing, anything we should know…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
              className="input resize-none"
            />
          </Group>

          {error && <ErrorPill>{error}</ErrorPill>}

          <SubmitRow
            submitting={submitting}
            caption="One send — email lands automatically, WhatsApp opens for the follow-up. Reply within 48h."
            ctaLabel="Send the brief"
            ctaKicker="EMAIL + WHATSAPP"
          />
          <FormStyles />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
