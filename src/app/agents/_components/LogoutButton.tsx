"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [pending, setPending] = useState(false);
  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      // even if the request fails, force a navigation to /login to clear
      // the session UX-wise; middleware will redirect anyway
    }
    window.location.href = "/login";
  }
  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="text-[10px] tracking-[0.25em] uppercase opacity-60 hover:opacity-100 transition-opacity disabled:opacity-40"
    >
      {pending ? "Signing out…" : "Sign out →"}
    </button>
  );
}
