import type { Metadata } from "next";
import NotesIndex from "@/components/notes2/NotesIndex";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Working notes from Onyx Creative Asia on digital business development: one team versus five vendors, SEO, AEO and GEO, and websites that sell.",
  alternates: { canonical: "/notes" },
  openGraph: { title: "Notes | Onyx Creative Asia", url: "/notes" },
};

export default function NotesPage() {
  return <NotesIndex />;
}
