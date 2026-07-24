"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SuccessScreen } from "./shared";
import { StepForm, type Step } from "./StepForm";
import { useInquirySubmit } from "./use-submit";
import { isEmail } from "../inquiry-types";
import { useT } from "@/lib/i18n";

/**
 * General Question, the shortest path. Name, email, message. Auto-reply
 * confirms receipt; we follow up by replying to the email thread.
 */
export default function GeneralForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { submitting, sent, error, setError, submit, reset } =
    useInquirySubmit();

  function buildWhatsAppText(): string {
    return (
      "Hi Onyx Creative Asia! I just sent a quick question via the contact form.\n\n" +
      `Name: ${name.trim()}\n` +
      `Email: ${email.trim()}\n\n` +
      `Question:\n${message.trim()}`
    );
  }

  async function send() {
    await submit(
      {
        inquiryType: "general",
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
      { whatsappText: buildWhatsAppText() },
    );
  }

  const steps: Step[] = [
    {
      number: "01",
      label: "What's your name?",
      validate: () => (!name.trim() ? "Please add your name." : null),
      node: (
        <input
          type="text"
          placeholder={t("Full name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          disabled={submitting}
          className="input"
        />
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
      label: "What's on your mind?",
      validate: () =>
        !message.trim() ? "Tell us what's on your mind." : null,
      node: (
        <textarea
          rows={4}
          placeholder={t("Ask us anything, we read everything.")}
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
          kicker="(Question received)"
          headline={
            <>
              {t("Got it.")}{" "}
              <span className="font-normal italic">
                {t("We'll reply within 48 hours.")}
              </span>
            </>
          }
          body={
            <p>
              {t(
                "A copy of your question is in your inbox now, keep an eye on it (and check spam, just in case). We also opened a WhatsApp tab if you'd rather keep the conversation there.",
              )}
            </p>
          }
          onReset={() => {
            reset();
            setName("");
            setEmail("");
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
          submitLabel="Send question"
          submitKicker="EMAIL + WHATSAPP"
        />
      )}
    </AnimatePresence>
  );
}
