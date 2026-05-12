import type { Metadata } from "next";
import "../globals.css";
import AgentsChrome from "./_components/AgentsChrome";

export const metadata: Metadata = {
  title: "Onyx Agents — internal",
  description: "Private dashboard for the Onyx automation roster.",
  robots: { index: false, follow: false },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-bone font-sans antialiased">
      <AgentsChrome>
        {children}
      </AgentsChrome>
    </div>
  );
}
