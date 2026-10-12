import type { Metadata } from "next";
import AboutPage from "@/components/about2/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Onyx Creative Asia is an independent digital business development agency in Bali. One team plans, builds and runs the website, software and marketing, from the first call to launch and after.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About | Onyx Creative Asia", url: "/about" },
};

export default function About() {
  return <AboutPage />;
}
