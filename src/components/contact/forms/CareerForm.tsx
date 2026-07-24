"use client";

import { AnimatePresence } from "framer-motion";
import { forwardRef, useRef, useState } from "react";
import { PillSet, SuccessScreen } from "./shared";
import { StepForm, type Step } from "./StepForm";
import { useInquirySubmit } from "./use-submit";
import {
  CAREER_DEPARTMENTS,
  isEmail,
  isHttpUrl,
  type CareerDepartment,
} from "../inquiry-types";
import { useT } from "@/lib/i18n";

const MAX_CV_BYTES = 3 * 1024 * 1024; // 3 MB
const ACCEPTED_TYPES = [".pdf", ".doc", ".docx"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Career application. Department, portfolio link, optional CV upload
 * (PDF/doc, ≤3MB, base64 in the JSON body), cover letter.
 */
export default function CareerForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState<CareerDepartment | "">("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { submitting, sent, error, setError, submit, reset } =
    useInquirySubmit();

  function cvError(): string | null {
    if (!cvFile) return null;
    if (cvFile.size > MAX_CV_BYTES) return "CV must be ≤ 3 MB. Drop a slimmer PDF.";
    const okMime =
      ACCEPTED_MIME.includes(cvFile.type) ||
      ACCEPTED_TYPES.some((ext) => cvFile.name.toLowerCase().endsWith(ext));
    if (!okMime) return "CV must be PDF, DOC, or DOCX.";
    return null;
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const result = typeof r.result === "string" ? r.result : "";
        const comma = result.indexOf(",");
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  }

  function buildWhatsAppText(): string {
    const portfolioLine = portfolioUrl.trim()
      ? `Portfolio: ${portfolioUrl.trim()}\n`
      : "";
    const cvLine = cvFile ? `CV attached: ${cvFile.name}\n` : "";
    return (
      "Hi Onyx Creative Asia! I just submitted a job application via the contact form.\n\n" +
      `Name: ${name.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Department: ${department}\n` +
      portfolioLine +
      cvLine +
      `\nCover letter:\n${coverLetter.trim()}`
    );
  }

  async function send() {
    let cvPayload:
      | { name: string; type: string; size: number; dataBase64: string }
      | null = null;

    if (cvFile) {
      try {
        const b64 = await fileToBase64(cvFile);
        cvPayload = {
          name: cvFile.name,
          type: cvFile.type || "application/octet-stream",
          size: cvFile.size,
          dataBase64: b64,
        };
      } catch (err) {
        console.error("[career] CV read failed:", err);
        setError("Couldn't read that CV file. Try a different file.");
        return;
      }
    }

    await submit(
      {
        inquiryType: "career",
        name: name.trim(),
        email: email.trim(),
        department,
        portfolioUrl: portfolioUrl.trim() || null,
        coverLetter: coverLetter.trim(),
        cv: cvPayload,
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
      label: "Which team do you want to join?",
      validate: () =>
        !department ? "Pick a department (or 'Open application')." : null,
      node: (
        <PillSet
          options={CAREER_DEPARTMENTS}
          selected={department}
          onToggle={(d) =>
            setDepartment(department === d ? "" : (d as CareerDepartment))
          }
          disabled={submitting}
        />
      ),
    },
    {
      number: "04",
      label: "Portfolio and CV",
      validate: () =>
        portfolioUrl.trim() && !isHttpUrl(portfolioUrl.trim())
          ? "Portfolio link should start with http(s)://"
          : cvError(),
      node: (
        <>
          <input
            type="url"
            placeholder={t("https://your-portfolio.com (optional)")}
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            disabled={submitting}
            className="input"
          />
          <FileField
            ref={fileInputRef}
            file={cvFile}
            onChange={setCvFile}
            disabled={submitting}
          />
          <p className="text-xs opacity-50 leading-relaxed">
            {t("PDF, DOC, or DOCX. Max 3 MB. Optional, but speeds things up.")}
          </p>
        </>
      ),
    },
    {
      number: "05",
      label: "Why Onyx?",
      validate: () => (!coverLetter.trim() ? "Add a short cover letter." : null),
      node: (
        <textarea
          rows={4}
          placeholder={t(
            "What kind of work do you want to make next? Anything we should look at first?",
          )}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
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
          kicker="(Application received)"
          headline={
            <>
              {t("Thanks for applying. We'll")}{" "}
              <span className="font-light italic">{t("read every word.")}</span>
            </>
          }
          body={
            <p>
              {t(
                "We'll get back within 7 days. If we want to move forward we'll send a short async exercise, no panel interviews, no whiteboards. A copy is in your inbox now.",
              )}
            </p>
          }
          onReset={() => {
            reset();
            setName("");
            setEmail("");
            setDepartment("");
            setPortfolioUrl("");
            setCoverLetter("");
            setCvFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
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
          submitLabel="Send application"
        />
      )}
    </AnimatePresence>
  );
}

/* ============================================================
 * FileField, minimal styled file input.
 * ============================================================ */

const FileField = forwardRef<
  HTMLInputElement,
  {
    file: File | null;
    onChange: (f: File | null) => void;
    disabled?: boolean;
  }
>(function FileField({ file, onChange, disabled }, ref) {
  const t = useT();
  return (
    <label
      className={
        "flex items-center justify-between gap-4 border border-dashed border-ink/30 hover:border-ink/60 rounded-xl px-4 py-3.5 cursor-pointer transition-colors " +
        (disabled ? "opacity-55 cursor-not-allowed" : "")
      }
    >
      <div className="flex-1 min-w-0">
        {file ? (
          <span className="text-sm font-medium truncate block">
            {file.name}{" "}
            <span className="opacity-50 ml-1">
              · {(file.size / 1024).toFixed(0)} KB
            </span>
          </span>
        ) : (
          <span className="text-sm opacity-55">
            {t("Drop CV here or click to choose")}
          </span>
        )}
      </div>
      <span className="text-xs uppercase tracking-[0.22em] opacity-60">
        {file ? t("Replace") : t("Choose file")}
      </span>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
});
