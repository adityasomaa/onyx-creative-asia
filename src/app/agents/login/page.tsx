import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Onyx Agents",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* logo + meta */}
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.3em] uppercase opacity-55 mb-6">
            [ LOGIN.SYS · INTERNAL ]
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[0.95]">
            Onyx Agents
            <span className="block font-light italic text-3xl md:text-4xl mt-1 opacity-85">
              authenticate.
            </span>
          </h1>
          <p className="mt-5 text-sm opacity-65 leading-relaxed">
            Internal console for the studio's automation roster. Sign in
            with your dashboard credentials.
          </p>
        </div>

        <LoginForm nextPath={next} initialError={error} />

        {/* footer line */}
        <p className="mt-14 text-[10px] tracking-[0.3em] uppercase opacity-40 text-center">
          ONYX · BALI · MMXXVI · NOT FOR PUBLIC INDEXING
        </p>
      </div>
    </div>
  );
}
