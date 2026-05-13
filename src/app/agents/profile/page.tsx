import PageHeader from "../_components/PageHeader";
import ProfileForm from "./_components/ProfileForm";
import { getProfile } from "@/lib/db/profile";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        kicker="ME"
        title="Profile"
        breadcrumb={[
          { href: "/agents", label: "Console" },
          { href: "/agents/profile", label: "Profile" },
        ]}
      />

      <div className="px-6 md:px-10 py-6 md:py-8 space-y-8">
        <ProfileForm initial={profile} />

        {/* PASSWORD + SESSION NOTE */}
        <section className="max-w-2xl border border-bone/15 p-5 space-y-2 mt-8">
          <p className="text-[10px] tracking-[0.22em] uppercase opacity-55">
            Password &amp; sessions
          </p>
          <p className="text-sm opacity-80 leading-relaxed">
            The dashboard login uses env-var credentials (
            <code className="text-[12px] font-mono opacity-70">
              DASHBOARD_USER
            </code>{" "}
            +{" "}
            <code className="text-[12px] font-mono opacity-70">
              DASHBOARD_PASSWORD
            </code>
            ) and HMAC-signed cookie sessions (7-day TTL).
          </p>
          <p className="text-sm opacity-80 leading-relaxed">
            To change the password: edit the env var in Vercel → Settings →
            Environment Variables → redeploy.
          </p>
          <p className="text-sm opacity-80 leading-relaxed">
            To invalidate every active session: rotate{" "}
            <code className="text-[12px] font-mono opacity-70">
              DASHBOARD_SECRET
            </code>{" "}
            in Vercel → redeploy. The next request from any device will be
            kicked back to /login.
          </p>
        </section>
      </div>
    </>
  );
}
