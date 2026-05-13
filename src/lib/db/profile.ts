/**
 * Dashboard operator profile — reads + updates from public.dashboard_profile.
 *
 * Profile is single-row (id='primary') because the dashboard auth is
 * env-var-based (one operator). When we move to multi-user auth, this
 * table grows a user_id FK and the queries swap to lookup-by-user.
 */

import { getServerSupabase } from "@/lib/supabase";

export type ReplyTone = "restrained" | "friendly" | "formal" | "playful";

export const REPLY_TONES: ReplyTone[] = [
  "restrained",
  "friendly",
  "formal",
  "playful",
];

export const REPLY_TONE_LABEL: Record<ReplyTone, string> = {
  restrained: "Restrained",
  friendly: "Friendly",
  formal: "Formal",
  playful: "Playful",
};

export const REPLY_TONE_DESCRIPTION: Record<ReplyTone, string> = {
  restrained: "Editorial, minimal, no exclamations. The brand default.",
  friendly: "Warm and conversational. Easy hello, casual register.",
  formal: "Business correspondence. Polite, structured, no slang.",
  playful: "A bit of humor. Lighter punctuation.",
};

export type DashboardProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email_signature: string | null;
  reply_tone: ReplyTone;
  created_at: string;
  updated_at: string;
};

const FALLBACK: DashboardProfile = {
  id: "primary",
  display_name: "Onyx",
  avatar_url: null,
  email_signature:
    "Talk soon,\nThe Onyx Creative Asia team\nBali · onyxcreative.asia",
  reply_tone: "restrained",
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

/** Read the operator profile. Falls back to brand defaults when DB
 *  isn't reachable or the row hasn't been seeded yet. */
export async function getProfile(): Promise<DashboardProfile> {
  const sb = getServerSupabase();
  if (!sb) return FALLBACK;

  const { data, error } = await sb
    .from("dashboard_profile")
    .select("*")
    .eq("id", "primary")
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[db/profile] getProfile:", error.message);
    return FALLBACK;
  }

  // Normalise reply_tone to one of the known values
  const tone =
    (REPLY_TONES as string[]).includes(data.reply_tone)
      ? (data.reply_tone as ReplyTone)
      : "restrained";

  return {
    ...(data as DashboardProfile),
    reply_tone: tone,
  };
}

export type ProfileUpdate = {
  display_name?: string | null;
  avatar_url?: string | null;
  email_signature?: string | null;
  reply_tone?: ReplyTone;
};

export async function updateProfile(
  patch: ProfileUpdate
): Promise<{ ok: true; profile: DashboardProfile } | { ok: false; error: string }> {
  const sb = getServerSupabase();
  if (!sb) return { ok: false, error: "DB not configured." };

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.display_name !== undefined) update.display_name = patch.display_name;
  if (patch.avatar_url !== undefined) update.avatar_url = patch.avatar_url;
  if (patch.email_signature !== undefined)
    update.email_signature = patch.email_signature;
  if (patch.reply_tone !== undefined) update.reply_tone = patch.reply_tone;

  // Upsert keyed on id='primary' so it always works even if the row
  // hasn't been seeded yet.
  const { data, error } = await sb
    .from("dashboard_profile")
    .upsert({ id: "primary", ...update })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Update failed." };
  }
  return { ok: true, profile: data as DashboardProfile };
}
