"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  ErrorPill,
  FormStyles,
  Group,
  SubmitRow,
  SuccessScreen,
} from "./shared";
import { useInquirySubmit } from "./use-submit";
import { isEmail } from "../inquiry-types";

/**
 * General Question — the shortest path. Name, email, message. Auto-reply
 * confirms receipt; we follow up by replying to the email thread.
 */
export default function GeneralForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { submitting, sent, error, setError, submit, reset } =
    useInquirySubmit();

  function validate(): boolean {
    if (!name.trim()) return fail("Please add your name.");
    if (!email.trim()) return fail("Please add your email.");
    if (!isEmail(email)) return fail("That email doesn't look right.");
    if (!message.trim()) return fail("Tell us what's on your mind.");
    setError(null);
    return true;
  }
  function fail(msg: string) {
    setError(msg);
    return false;
  }

  function buildWhatsAppText(): string {
    return (
      "Hi Onyx Creative Asia! I just sent a quick question via the contact form.\n\n" +
      `Name: ${name.trim()}\n` +
      `Email: ${email.trim()}\n\n` +
      `Question:\n${message.trim()}`
    );
  }

  async function send() {
    if (!validate()) return;
    await submit(
      {
        inquiryType: "general",
        name: name.trim(),
        email: email.trim(),
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
          kicker="(Question received)"
          headline={
            <>
              Got it.{" "}
              <span className="font-light italic">
                We&apos;ll reply within 48 hours.
              </span>
            </>
          }
          body={
            <>
              <p>
                A copy of your question is in your inbox now — keep an eye
                on it (and check spam, just in case). We also opened a
                WhatsApp tab if you&apos;d rather keep the conversation there.
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

          <Group label="What's on your mind" number="03">
            <textarea
              required
              rows={5}
              placeholder="Ask us anything — we read everything."
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
            ctaLabel="Send question"
            ctaKicker="EMAIL + WHATSAPP"
          />
          <FormStyles />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
