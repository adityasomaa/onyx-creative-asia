import type { Metadata } from "next";
import EnquirePage, { type Kind } from "@/components/enquire/EnquirePage";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Start a project, propose a partnership, apply for a role or ask anything. A few short questions, one at a time, and a reply from a person within a working day, Monday to Friday, 08:00–22:00 WITA.",
  alternates: { canonical: "/enquire" },
  openGraph: { title: "Enquire | Onyx Creative Asia", url: "/enquire" },
};

// Kept here, not imported from the client component: a value exported
// from a "use client" module is only a client reference on the server.
const KINDS: Kind[] = ["project", "partnership", "career", "general"];

/** `?type=project` (the "Start a project" buttons) skips the first question. */
export default async function Enquire({ searchParams }: { searchParams: Promise<{ type?: string | string[] }> }) {
  const { type } = await searchParams;
  const initial = KINDS.find((k) => k === type) ?? null;
  return <EnquirePage initial={initial} />;
}
