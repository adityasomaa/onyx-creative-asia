import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import {
  sendAutoReply,
  sendInternalNotification,
  type InquiryType,
} from "@/lib/email";

export const runtime = "nodejs";

/**
 * POST /api/leads
 *
 * Single entry point for every kind of inquiry submitted from the
 * marketing site's /contact page. The visitor picks a type (general,
 * project, career, partnership) and the relevant sub-form posts here.
 *
 * Every submission:
 *   1. Writes a row to public.submissions (visible in /agents/submissions)
 *   2. For 'project': also mirrors to the legacy public.leads table
 *   3. For 'career' with a CV: uploads the file to Supabase Storage
 *      (bucket: career-cvs) and writes a row to public.files
 *   4. Sends a branded auto-reply via Resend (per-type copy)
 *   5. Sends an internal notification to hello@onyxcreative.asia with
 *      a deep link to the new submission in the dashboard
 *
 * Email + file-upload failures are logged but don't propagate — the
 * submission row is the system of record, and the dashboard is the
 * fallback channel.
 */

const VALID_TYPES: InquiryType[] = [
  "general",
  "project",
  "career",
  "partnership",
];

const MAX_CV_BYTES = 3 * 1024 * 1024; // 3 MB
const CAREER_BUCKET = "career-cvs";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function isEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
function asStringOrNull(v: unknown): string | null {
  const s = asString(v);
  return s ? s : null;
}
function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
}

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100);
}

/* ============================================================
 * Per-type normalisation: turn raw form payload into the columns the
 * submissions table cares about + meta-rows for the email templates.
 * ============================================================ */

type Normalised = {
  inquiryType: InquiryType;
  fromName: string;
  fromEmail: string;
  subject: string;
  body: string;
  interest: string[];
  budgetBand: string | null;
  companyName: string | null;
  department: string | null;
  portfolioUrl: string | null;
  payloadJson: Record<string, unknown>;
  // Email-template inputs
  autoReplyMeta: { label: string; value: string }[];
  internalMeta: { label: string; value: string }[];
  internalHighlight: string | null;
  externalLink: { label: string; url: string } | null;
  // Only set for career
  cv: {
    name: string;
    type: string;
    size: number;
    dataBase64: string;
  } | null;
};

function normalise(body: Record<string, unknown>): Normalised | { error: string } {
  const rawType = asString(body.inquiryType);
  if (!(VALID_TYPES as string[]).includes(rawType)) {
    return { error: "Unknown inquiry type." };
  }
  const inquiryType = rawType as InquiryType;

  const name = asString(body.name);
  const email = asString(body.email);
  if (!name || name.length > 200) return { error: "Name is required." };
  if (!isEmail(email)) return { error: "Valid email required." };

  if (inquiryType === "general") {
    const message = asString(body.message);
    if (!message || message.length > 5000)
      return { error: "Tell us what's on your mind." };
    return {
      inquiryType,
      fromName: name,
      fromEmail: email,
      subject: `${name} — general question`,
      body: message,
      interest: [],
      budgetBand: null,
      companyName: null,
      department: null,
      portfolioUrl: null,
      payloadJson: {},
      autoReplyMeta: [],
      internalMeta: [],
      internalHighlight: null,
      externalLink: null,
      cv: null,
    };
  }

  if (inquiryType === "project") {
    const services = asStringArray(body.services);
    const budget = asStringOrNull(body.budget);
    const company = asStringOrNull(body.company);
    const message = asString(body.message);
    if (!message || message.length > 5000)
      return { error: "Please add a short brief." };
    const servicesText = services.length > 0 ? services.join(", ") : "—";
    return {
      inquiryType,
      fromName: name,
      fromEmail: email,
      subject: `${name} — ${services.length > 0 ? services.join(" · ") : "project"}`,
      body: message,
      interest: services,
      budgetBand: budget,
      companyName: company,
      department: null,
      portfolioUrl: null,
      payloadJson: { company, services },
      autoReplyMeta: [
        { label: "Services", value: servicesText },
        { label: "Budget", value: budget ?? "—" },
      ],
      internalMeta: [
        { label: "Company", value: company ?? "—" },
        { label: "Services", value: servicesText },
        { label: "Budget", value: budget ?? "—" },
      ],
      internalHighlight: `${budget ?? "no budget"} · ${servicesText}`,
      externalLink: null,
      cv: null,
    };
  }

  if (inquiryType === "career") {
    const department = asStringOrNull(body.department);
    const portfolioUrl = asStringOrNull(body.portfolioUrl);
    const coverLetter = asString(body.coverLetter);
    if (!department) return { error: "Pick a department." };
    if (!coverLetter || coverLetter.length > 5000)
      return { error: "Cover letter is required." };

    let cv: Normalised["cv"] = null;
    const rawCv = body.cv as
      | { name?: unknown; type?: unknown; size?: unknown; dataBase64?: unknown }
      | null
      | undefined;
    if (rawCv && typeof rawCv === "object") {
      const cvName = asString(rawCv.name);
      const cvType = asString(rawCv.type) || "application/octet-stream";
      const cvSize = typeof rawCv.size === "number" ? rawCv.size : 0;
      const cvData = asString(rawCv.dataBase64);
      if (cvData) {
        if (cvSize > MAX_CV_BYTES) return { error: "CV must be ≤ 3 MB." };
        cv = { name: safeFilename(cvName || "cv"), type: cvType, size: cvSize, dataBase64: cvData };
      }
    }

    return {
      inquiryType,
      fromName: name,
      fromEmail: email,
      subject: `${name} — ${department}`,
      body: coverLetter,
      interest: [department],
      budgetBand: null,
      companyName: null,
      department,
      portfolioUrl,
      payloadJson: { department, portfolio_url: portfolioUrl },
      autoReplyMeta: [
        { label: "Department", value: department },
        ...(portfolioUrl ? [{ label: "Portfolio", value: portfolioUrl }] : []),
      ],
      internalMeta: [
        { label: "Department", value: department },
        ...(portfolioUrl ? [{ label: "Portfolio", value: portfolioUrl }] : []),
        { label: "CV attached", value: cv ? `${cv.name} (${Math.round(cv.size / 1024)}KB)` : "—" },
      ],
      internalHighlight: department,
      externalLink: portfolioUrl ? { label: "Portfolio", url: portfolioUrl } : null,
      cv,
    };
  }

  // partnership
  const company = asString(body.company);
  const website = asStringOrNull(body.website);
  const partnershipType = asString(body.partnershipType);
  const proposal = asString(body.proposal);
  if (!company) return { error: "Company name is required." };
  if (!partnershipType) return { error: "Pick a partnership type." };
  if (!proposal || proposal.length > 5000)
    return { error: "Outline the proposal in a few lines." };

  return {
    inquiryType: "partnership",
    fromName: name,
    fromEmail: email,
    subject: `${name} (${company}) — ${partnershipType}`,
    body: proposal,
    interest: [partnershipType],
    budgetBand: null,
    companyName: company,
    department: null,
    portfolioUrl: null,
    payloadJson: { company, website, partnership_type: partnershipType },
    autoReplyMeta: [
      { label: "Company", value: company },
      { label: "Partnership type", value: partnershipType },
    ],
    internalMeta: [
      { label: "Company", value: company },
      { label: "Type", value: partnershipType },
      ...(website ? [{ label: "Website", value: website }] : []),
    ],
    internalHighlight: `${company} · ${partnershipType}`,
    externalLink: website ? { label: "Website", url: website } : null,
    cv: null,
  };
}

/* ============================================================
 * Handler
 * ============================================================ */

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const norm = normalise(raw);
  if ("error" in norm) {
    return NextResponse.json({ ok: false, error: norm.error }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    // No DB → still fire emails for dev parity.
    console.warn("[leads] Supabase env not set — logging instead.", {
      type: norm.inquiryType,
      name: norm.fromName,
    });
    await Promise.allSettled([
      sendAutoReply({
        toName: norm.fromName,
        toEmail: norm.fromEmail,
        inquiryType: norm.inquiryType,
        metaRows: norm.autoReplyMeta,
      }),
      sendInternalNotification({
        fromName: norm.fromName,
        fromEmail: norm.fromEmail,
        inquiryType: norm.inquiryType,
        highlight: norm.internalHighlight ?? undefined,
        metaRows: norm.internalMeta,
        body: norm.body,
        externalLink: norm.externalLink,
        submissionId: null,
      }),
    ]);
    return NextResponse.json({ ok: true, mock: true });
  }

  // 1. Insert into submissions — system of record
  const { data: submission, error: submissionErr } = await supabase
    .from("submissions")
    .insert({
      source: "form",
      inquiry_type: norm.inquiryType,
      from_name: norm.fromName,
      from_email: norm.fromEmail,
      subject: norm.subject,
      body_md: norm.body,
      interest: norm.interest,
      budget_band: norm.budgetBand,
      department: norm.department,
      portfolio_url: norm.portfolioUrl,
      company_name: norm.companyName,
      status: "new",
      payload_json: norm.payloadJson,
    })
    .select("id")
    .single();

  if (submissionErr || !submission) {
    console.error("[leads] submission insert error", submissionErr);
    return NextResponse.json(
      { ok: false, error: "Could not save submission." },
      { status: 500 }
    );
  }

  const submissionId = submission.id as string;

  // 2. Legacy leads mirror — only for 'project' (the only type that
  //    existed in the old flow). Log-only on failure.
  if (norm.inquiryType === "project") {
    const { error: leadsErr } = await supabase.from("leads").insert({
      name: norm.fromName,
      email: norm.fromEmail,
      company: norm.companyName,
      budget: norm.budgetBand,
      services: norm.interest,
      message: norm.body,
      source: "website",
    });
    if (leadsErr) console.error("[leads] legacy insert error", leadsErr);
  }

  // 3. CV upload (career only) — Supabase Storage + files table
  let cvSignedUrl: string | null = null;
  if (norm.cv) {
    try {
      const buffer = Buffer.from(norm.cv.dataBase64, "base64");
      const storagePath = `${submissionId}/${safeFilename(norm.cv.name)}`;
      const { error: uploadErr } = await supabase.storage
        .from(CAREER_BUCKET)
        .upload(storagePath, buffer, {
          contentType: norm.cv.type,
          upsert: false,
        });
      if (uploadErr) {
        console.error("[leads] CV upload error", uploadErr);
      } else {
        // Insert into files table
        const { error: filesErr } = await supabase.from("files").insert({
          submission_id: submissionId,
          kind: "attachment",
          name: norm.cv.name,
          storage_path: `${CAREER_BUCKET}/${storagePath}`,
          mime_type: norm.cv.type,
          size_bytes: norm.cv.size,
          uploaded_by: norm.fromEmail,
        });
        if (filesErr) console.error("[leads] files insert error", filesErr);

        // Signed URL for the internal-notification email
        const { data: signed } = await supabase.storage
          .from(CAREER_BUCKET)
          .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);
        cvSignedUrl = signed?.signedUrl ?? null;
      }
    } catch (err) {
      console.error("[leads] CV processing threw", err);
    }
  }

  // 4 + 5 — fire emails in parallel. Fire-and-forget so the response
  // is fast (caller sees the success state quickly even if SMTP is
  // slow). Errors are logged.
  void Promise.allSettled([
    sendAutoReply({
      toName: norm.fromName,
      toEmail: norm.fromEmail,
      inquiryType: norm.inquiryType,
      metaRows: norm.autoReplyMeta,
    }),
    sendInternalNotification({
      fromName: norm.fromName,
      fromEmail: norm.fromEmail,
      inquiryType: norm.inquiryType,
      highlight: norm.internalHighlight ?? undefined,
      metaRows: norm.internalMeta,
      body: norm.body,
      cvUrl: cvSignedUrl,
      externalLink: norm.externalLink,
      submissionId,
    }),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(
          `[leads] email ${i === 0 ? "auto-reply" : "internal"} rejected:`,
          r.reason
        );
      } else if (r.value.ok === false) {
        console.error(
          `[leads] email ${i === 0 ? "auto-reply" : "internal"} failed:`,
          r.value.error
        );
      }
    });
  });

  return NextResponse.json({ ok: true, submissionId });
}
