"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({
  nextPath,
  initialError,
}: {
  nextPath?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Invalid credentials.");
        setSubmitting(false);
        return;
      }
      // Cookie is now set. Hard-navigate so middleware re-reads.
      const target = nextPath && nextPath.startsWith("/") ? nextPath : "/";
      window.location.href = target;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Field label="USERNAME" number="01">
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
          className="dash-input"
          placeholder="onyx"
        />
      </Field>

      <Field label="PASSWORD" number="02">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="dash-input"
          placeholder="••••••••••••"
        />
      </Field>

      {error && (
        <p
          role="alert"
          className="text-xs tracking-[0.18em] uppercase text-red-300 border-l-2 border-red-400 pl-3 py-1"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-2 inline-flex items-center justify-between gap-3 rounded-full bg-bone text-ink px-6 py-3.5 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-wait"
      >
        <span className="text-sm font-medium">
          {submitting ? "Authenticating…" : "Sign in"}
        </span>
        <span
          aria-hidden
          className="text-xs tracking-wider opacity-65"
        >
          {submitting ? "//" : "→"}
        </span>
      </button>

      <style>{`
        .dash-input {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(244, 241, 236, 0.35);
          padding: 0.75rem 0;
          font-size: 1rem;
          font-family: inherit;
          color: #f4f1ec;
          outline: none;
          transition: border-color 200ms ease;
        }
        .dash-input::placeholder {
          color: rgba(244, 241, 236, 0.35);
        }
        .dash-input:focus {
          border-color: #f4f1ec;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  number,
  children,
}: {
  label: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase opacity-60 mb-1.5">
        <span className="tabular-nums">{number}</span>
        <span className="h-px w-6 bg-bone/30" />
        <span>{label}</span>
      </p>
      {children}
    </div>
  );
}
