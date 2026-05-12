"use client";

import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useRef, useState } from "react";
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
  CAREER_DEPARTMENTS,
  isEmail,
  isHttpUrl,
  type CareerDepartment,
} from "../inquiry-types";

const MAX_CV_BYTES = 3 * 1024 * 1024; // 3 MB

const ACCEPTED_TYPES = [".pdf", ".doc", ".docx"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Career — application form. Department selector, portfolio link,
 * cover letter, optional CV upload (PDF/doc, ≤3MB).
 *
 * CV upload: file is read on the client as base64 and POSTed in the
 * JSON body. The API decodes it and uploads to Supabase Storage
 * (bucket: career-cvs), then writes a row in public.files linking
 * back to the submission.
 *
 * No WhatsApp pre-fill — career applications belong in writing.
 */
export default function CareerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState<CareerDepartment | "">("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { submitting, sent, error, setError, submit, reset } =
    useInquirySubmit();

  function validate(): boolean {
    if (!name.trim()) return fail("Please add your name.");
    if (!email.trim()) return fail("Please add your email.");
    if (!isEmail(email)) return fail("That email doesn't look right.");
    if (!department) return fail("Pick a department (or 'Open application').");
    if (portfolioUrl.trim() && !isHttpUrl(portfolioUrl.trim())) {
      return fail("Portfolio link should start with http(s)://");
    }
    if (!coverLetter.trim()) return fail("Add a short cover letter.");
    if (cvFile && cvFile.size > MAX_CV_BYTES) {
      return fail("CV must be ≤ 3 MB. Drop a slimmer PDF.");
    }
    if (cvFile) {
      const okMime =
        ACCEPTED_MIME.includes(cvFile.type) ||
        ACCEPTED_TYPES.some((ext) =>
          cvFile.name.toLowerCase().endsWith(ext)
        );
      if (!okMime) return fail("CV must be PDF, DOC, or DOCX.");
    }
    setError(null);
    return true;
  }
  function fail(msg: string) {
    setError(msg);
    return false;
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const result = typeof r.result === "string" ? r.result : "";
        // strip the "data:<mime>;base64," prefix — backend just wants raw b64
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
    if (!validate()) return;

    let cvPayload: {
      name: string;
      type: string;
      size: number;
      dataBase64: string;
    } | null = null;

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
      { whatsappText: buildWhatsAppText() }
    );
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <SuccessScreen
          key="sent"
          kicker="(Application received)"
          headline={
            <>
              Thanks for applying. We&apos;ll{" "}
              <span className="font-light italic">read every word.</span>
            </>
          }
          body={
            <>
              <p>
                We&apos;ll get back within 7 days. If we want to move forward
                we&apos;ll send a short async exercise — no panel interviews,
                no whiteboards. A copy is in your inbox now, and we
                opened a WhatsApp tab in case you want to nudge us.
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
            setDepartment("");
            setPortfolioUrl("");
            setCoverLetter("");
            setCvFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
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

          <Group label="I want to join" number="03">
            <PillSet
              options={CAREER_DEPARTMENTS}
              selected={department}
              onToggle={(d) =>
                setDepartment(department === d ? "" : (d as CareerDepartment))
              }
              disabled={submitting}
            />
          </Group>

          <Group label="Portfolio / work link" number="04">
            <input
              type="url"
              placeholder="https://your-portfolio.com (optional but encouraged)"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              disabled={submitting}
              className="input"
            />
          </Group>

          <Group label="CV / résumé" number="05">
            <FileField
              ref={fileInputRef}
              file={cvFile}
              onChange={setCvFile}
              disabled={submitting}
            />
            <p className="text-xs opacity-50 leading-relaxed">
              PDF, DOC, or DOCX. Max 3 MB. Optional — but speeds things up.
            </p>
          </Group>

          <Group label="Cover letter" number="06">
            <textarea
              required
              rows={6}
              placeholder="Why Onyx? What kind of work do you want to make next? Anything we should look at first?"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={submitting}
              className="input resize-none"
            />
          </Group>

          {error && <ErrorPill>{error}</ErrorPill>}

          <SubmitRow
            submitting={submitting}
            caption="One send — email lands automatically, WhatsApp opens for the follow-up. Reply within 7 days."
            ctaLabel="Send application"
            ctaKicker="EMAIL + WHATSAPP"
          />
          <FormStyles />
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
 * FileField — minimal drag-and-drop styled file input.
 * ============================================================ */

const FileField = forwardRef<
  HTMLInputElement,
  {
    file: File | null;
    onChange: (f: File | null) => void;
    disabled?: boolean;
  }
>(function FileField({ file, onChange, disabled }, ref) {
  return (
    <label
      className={
        "flex items-center justify-between gap-4 border border-dashed border-ink/30 hover:border-ink/60 rounded-sm px-4 py-3.5 cursor-pointer transition-colors " +
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
            Drop CV here or click to choose
          </span>
        )}
      </div>
      <span className="text-xs uppercase tracking-[0.22em] opacity-60">
        {file ? "Replace" : "Choose file"}
      </span>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          onChange(f);
        }}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
});
