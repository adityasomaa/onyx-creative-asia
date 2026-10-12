import type { Metadata } from "next";
import ProjectGrid from "@/components/projects2/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by Onyx Creative Asia: websites, software, campaigns and content for businesses across Indonesia and Europe. Every case study names the client and links the live work.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects | Onyx Creative Asia", url: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectGrid />;
}
