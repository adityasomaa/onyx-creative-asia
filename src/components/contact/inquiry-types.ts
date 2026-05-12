/**
 * The shape of every contact-form submission, regardless of which sub-form
 * the visitor chose. The /api/leads handler reads `inquiryType` and pulls
 * the relevant fields from the rest of the payload.
 *
 * Kept in its own file so both the chooser, each sub-form, and the API
 * route share one source of truth.
 */

export type InquiryType =
  | "general"
  | "project"
  | "career"
  | "partnership";

export const INQUIRY_TYPES: InquiryType[] = [
  "general",
  "project",
  "career",
  "partnership",
];

export const INQUIRY_LABEL: Record<InquiryType, string> = {
  general: "General Question",
  project: "Project Brief",
  career: "Career",
  partnership: "Partnership",
};

export const INQUIRY_DESCRIPTION: Record<InquiryType, string> = {
  general: "Quick question, a hello, or anything that doesn't fit the others.",
  project: "You want us to design, build, or scale something for you.",
  career: "You want to work with us. We're a small, opinionated team.",
  partnership: "You run a studio, agency, or platform and you're proposing a collab.",
};

export const INQUIRY_KICKER: Record<InquiryType, string> = {
  general: "01",
  project: "02",
  career: "03",
  partnership: "04",
};

/* ============================================================
 * Career — department options
 * ============================================================ */

export const CAREER_DEPARTMENTS = [
  "Web Development",
  "Paid Media",
  "Social Media",
  "AI Systems",
  "Brand & Design",
  "Operations",
  "Open application",
] as const;

export type CareerDepartment = (typeof CAREER_DEPARTMENTS)[number];

/* ============================================================
 * Partnership — collab type options
 * ============================================================ */

export const PARTNERSHIP_TYPES = [
  "Co-production",
  "White-label",
  "Reseller",
  "Affiliate / referral",
  "Strategic alliance",
  "Other",
] as const;

export type PartnershipType = (typeof PARTNERSHIP_TYPES)[number];

/* ============================================================
 * Shared validation helpers
 * ============================================================ */

export function isEmail(s: string): boolean {
  return /^\S+@\S+\.\S+$/.test(s);
}

export function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
