import type { Metadata } from "next";
import ContactPage from "@/components/contact2/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Onyx Creative Asia. Six short questions, a reply from a person within a working day, Monday to Friday, 08:00–22:00 WITA. Email hello@onyxcreative.asia or WhatsApp.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | Onyx Creative Asia", url: "/contact" },
};

export default function Contact() {
  return <ContactPage />;
}
