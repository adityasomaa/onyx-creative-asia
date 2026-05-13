"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  REPLY_TONES,
  REPLY_TONE_DESCRIPTION,
  REPLY_TONE_LABEL,
  type DashboardProfile,
  type ReplyTone,
} from "@/lib/db/profile";

const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/svg+xml";

/**
 * Profile form — keeps the four editable fields in local state and
 * batches them into a single PATCH on save.
 *
 * Avatar upload is a separate request (POST /api/profile/avatar) since
 * the file is base64-shipped, and we want to update the row + reset
 * the cache buster atomically on the server.
 */
export default function ProfileForm({
  initial,
}: {
  initial: DashboardProfile;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  const [displayName, setDisplayName] = useState(initial.display_name ?? "");
  const [signature, setSignature] = useState(initial.email_signature ?? "");
  const [tone, setTone] = useState<ReplyTone>(initial.reply_tone);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    displayName !== (profile.display_name ?? "") ||
    signature !== (profile.email_signature ?? "") ||
    tone !== profile.reply_tone;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);

  useEffect(() => {
    if (savedAt === null) return;
    const t = setTimeout(() => setSavedAt(null), 2400);
    return () => clearTimeout(t);
  }, [savedAt]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          email_signature: signature,
          reply_tone: tone,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        profile?: DashboardProfile;
      };
      if (!res.ok || data.ok === false || !data.profile) {
        setError(data.error ?? "Save failed.");
        return;
      }
      setProfile(data.profile);
      setSavedAt(Date.now());
      router.refresh(); // re-render header avatar / name
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file: File) {
    if (file.size > AVATAR_MAX_BYTES) {
      setError("Avatar must be ≤ 2 MB.");
      return;
    }
    setAvatarBusy(true);
    setError(null);
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          type: file.type || "image/png",
          dataBase64,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        profile?: DashboardProfile;
        url?: string;
      };
      if (!res.ok || data.ok === false || !data.profile) {
        setError(data.error ?? "Avatar upload failed.");
        return;
      }
      setProfile(data.profile);
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setAvatarBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeAvatar() {
    if (!profile.avatar_url) return;
    setAvatarBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/avatar", { method: "DELETE" });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        profile?: DashboardProfile;
      };
      if (!res.ok || data.ok === false || !data.profile) {
        setError(data.error ?? "Remove failed.");
        return;
      }
      setProfile(data.profile);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setAvatarBusy(false);
    }
  }

  return (
    <div className="space-y-10 max-w-2xl">
      {/* AVATAR */}
      <Section label="Avatar" hint="PNG, JPG, WebP, or SVG. ≤ 2 MB. Shown in the dashboard top bar.">
        <div className="flex items-center gap-5">
          <AvatarPreview url={profile.avatar_url} displayName={displayName || "?"} />
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={AVATAR_ACCEPT}
              disabled={avatarBusy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadAvatar(f);
              }}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarBusy}
              className="text-[11px] tracking-[0.22em] uppercase border border-bone/30 hover:border-bone/60 px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              {avatarBusy ? "Uploading…" : profile.avatar_url ? "Replace" : "Upload"}
            </button>
            {profile.avatar_url && !avatarBusy && (
              <button
                type="button"
                onClick={removeAvatar}
                className="text-[10px] tracking-[0.22em] uppercase opacity-55 hover:opacity-100 text-left"
              >
                Remove avatar
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* DISPLAY NAME */}
      <Section label="Display name" hint="Shown next to your avatar in the chrome header.">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Onyx"
          maxLength={80}
          className="bg-transparent border-b border-bone/25 focus:border-bone outline-none w-full max-w-sm py-2 text-base text-bone placeholder:text-bone/30 transition-colors"
        />
      </Section>

      {/* EMAIL SIGNATURE */}
      <Section
        label="Email signature"
        hint="Appended to outbound replies sent from the submission detail page. Plain text."
      >
        <textarea
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          rows={5}
          className="bg-transparent border border-bone/20 focus:border-bone/60 outline-none w-full p-3 text-sm leading-relaxed text-bone placeholder:text-bone/30 transition-colors resize-none font-mono"
          placeholder={"Talk soon,\nThe Onyx team"}
        />
      </Section>

      {/* REPLY TONE */}
      <Section
        label="Default reply tone"
        hint="The base tone Claude Opus uses when enhancing your draft replies. Per-reply you can still override."
      >
        <div className="space-y-2">
          {REPLY_TONES.map((t) => {
            const active = t === tone;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`block w-full text-left border px-4 py-3 transition-colors ${
                  active
                    ? "border-bone bg-bone/[0.04]"
                    : "border-bone/15 hover:border-bone/40"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium">
                    {REPLY_TONE_LABEL[t]}
                  </span>
                  {active && (
                    <span className="text-[10px] tracking-[0.22em] uppercase opacity-70">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs opacity-65 leading-snug">
                  {REPLY_TONE_DESCRIPTION[t]}
                </p>
              </button>
            );
          })}
        </div>
      </Section>

      {/* SAVE BAR */}
      <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 border-t border-bone/15 bg-ink/95 backdrop-blur flex items-center justify-between">
        <div className="text-[10px] tracking-[0.18em] uppercase opacity-50 min-h-[16px]">
          {error ? (
            <span className="text-red-300">{error}</span>
          ) : savedAt ? (
            <span className="text-emerald-300">Saved</span>
          ) : dirty ? (
            "Unsaved changes"
          ) : (
            "Up to date"
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="text-[11px] tracking-[0.22em] uppercase bg-bone text-ink px-4 py-2 disabled:opacity-40 transition-opacity"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3">
        <p className="text-[10px] tracking-[0.22em] uppercase opacity-65">
          {label}
        </p>
        {hint && (
          <p className="text-[11px] opacity-50 mt-1 italic leading-snug max-w-xl">
            {hint}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function AvatarPreview({
  url,
  displayName,
}: {
  url: string | null;
  displayName: string;
}) {
  const initial = (displayName.trim()[0] || "O").toUpperCase();
  return (
    <div className="w-16 h-16 rounded-full overflow-hidden border border-bone/20 bg-bone/5 flex items-center justify-center shrink-0">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-medium tracking-tight opacity-80">
          {initial}
        </span>
      )}
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = typeof r.result === "string" ? r.result : "";
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
