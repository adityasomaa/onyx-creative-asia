import type { Metadata } from "next";
import "../globals.css";
import AgentsChrome from "./_components/AgentsChrome";
import { getProfile } from "@/lib/db/profile";

export const metadata: Metadata = {
  title: "Onyx Agents — internal",
  description: "Private dashboard for the Onyx automation roster.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR-fetch the dashboard operator profile so the chrome can render
  // the avatar + display name on first paint (no client flicker).
  const profile = await getProfile();

  return (
    // overflow-x-hidden — prevents the page itself from scrolling sideways
    // on narrow viewports if any child component overflows by accident.
    // The sticky header's inner nav is the one that scrolls horizontally.
    <div className="min-h-screen bg-ink text-bone font-sans antialiased overflow-x-hidden">
      <AgentsChrome
        displayName={profile.display_name || "Onyx"}
        avatarUrl={profile.avatar_url}
      >
        {children}
      </AgentsChrome>
    </div>
  );
}
