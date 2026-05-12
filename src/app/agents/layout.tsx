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
    // overflow-x-hidden — prevents the page itself from scrolling sideways
    // on narrow viewports if any child component overflows by accident.
    // The sticky header's inner nav is the one that scrolls horizontally.
    <div className="min-h-screen bg-ink text-bone font-sans antialiased overflow-x-hidden">
      <AgentsChrome>
        {children}
      </AgentsChrome>
    </div>
  );
}
