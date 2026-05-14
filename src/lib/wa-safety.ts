/**
 * WhatsApp safety guards.
 *
 * Goal: keep the Fonnte-linked WhatsApp number from getting banned by
 * Meta's bot-detection. Until we move to the official Cloud API, every
 * outbound send must pass these checks:
 *
 *   1. Working hours — never send outside the operator's local
 *      window (default 08:00–22:00 Asia/Makassar / WITA).
 *   2. Rolling 24-hour quota — cap on successful sends across all
 *      recipients (default 50).
 *   3. Per-recipient cooldown — no two consecutive sends to the same
 *      number within N seconds (default 30s). Prevents accidental
 *      double-fire.
 *   4. Global minimum interval — at least M seconds between ANY two
 *      sends across the whole device (default 5s). Prevents
 *      robotic-velocity patterns.
 *
 * All four are configurable via env vars (see DEFAULTS below) so the
 * operator can dial them up / down without redeploying code. Defaults
 * are conservative.
 *
 * Hard rule we DON'T enforce here but call out in docs: never send
 * a first-touch message to a cold number. The reply endpoint already
 * scopes target to a submission's `from_phone`, which means the
 * recipient initiated contact. If we ever add a "send from scratch"
 * path, gate it explicitly.
 */

import { getServerSupabase } from "@/lib/supabase";

const DEFAULTS = {
  workingStart: 8,
  workingEnd: 22,
  timezone: "Asia/Makassar", // WITA / UTC+8
  dailyLimit: 50,
  perRecipientCooldownS: 30,
  minIntervalS: 5,
};

function readEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function readEnvStr(name: string, fallback: string): string {
  const raw = process.env[name];
  return raw && raw.trim() ? raw.trim() : fallback;
}

export function getSafetyConfig() {
  return {
    workingStart: readEnvInt("WA_WORKING_HOURS_START", DEFAULTS.workingStart),
    workingEnd: readEnvInt("WA_WORKING_HOURS_END", DEFAULTS.workingEnd),
    timezone: readEnvStr("WA_WORKING_HOURS_TZ", DEFAULTS.timezone),
    dailyLimit: readEnvInt("WA_DAILY_LIMIT", DEFAULTS.dailyLimit),
    perRecipientCooldownS: readEnvInt(
      "WA_PER_RECIPIENT_COOLDOWN_S",
      DEFAULTS.perRecipientCooldownS
    ),
    minIntervalS: readEnvInt("WA_MIN_INTERVAL_S", DEFAULTS.minIntervalS),
  };
}

/* ============================================================
 * Pre-send check.
 * ============================================================ */

export type SafetyAllow = { ok: true };
export type SafetyDeny = { ok: false; reason: string; code: string };
export type SafetyResult = SafetyAllow | SafetyDeny;

export async function canSendWhatsApp(
  target: string
): Promise<SafetyResult> {
  const cfg = getSafetyConfig();

  // 1. Working hours
  const localHour = hourInTimeZone(new Date(), cfg.timezone);
  if (
    localHour < cfg.workingStart ||
    localHour >= cfg.workingEnd
  ) {
    return {
      ok: false,
      code: "WA_OUTSIDE_WORKING_HOURS",
      reason:
        `Outside working hours (${cfg.workingStart}:00–${cfg.workingEnd}:00 ${cfg.timezone}). ` +
        `Current local hour: ${localHour}.`,
    };
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    // No DB = we can't enforce rate limits. Fail closed.
    return {
      ok: false,
      code: "WA_DB_UNAVAILABLE",
      reason: "Send blocked — safety log DB not configured.",
    };
  }

  // 2. Rolling 24h quota (successful sends only)
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: count24h, error: countErr } = await supabase
    .from("wa_send_log")
    .select("*", { count: "exact", head: true })
    .gte("sent_at", since24h)
    .eq("ok", true);
  if (countErr) {
    return {
      ok: false,
      code: "WA_SAFETY_QUERY_FAILED",
      reason: `Safety check failed (count): ${countErr.message}`,
    };
  }
  if ((count24h ?? 0) >= cfg.dailyLimit) {
    return {
      ok: false,
      code: "WA_DAILY_QUOTA_REACHED",
      reason:
        `Daily quota reached (${count24h}/${cfg.dailyLimit} sends in last 24h). ` +
        `Wait for the rolling window or raise WA_DAILY_LIMIT.`,
    };
  }

  // 3. Per-recipient cooldown
  const { data: lastToTarget } = await supabase
    .from("wa_send_log")
    .select("sent_at")
    .eq("target_phone", target)
    .eq("ok", true)
    .order("sent_at", { ascending: false })
    .limit(1);
  if (lastToTarget && lastToTarget.length > 0) {
    const lastSent = new Date(lastToTarget[0].sent_at).getTime();
    const elapsedS = Math.floor((Date.now() - lastSent) / 1000);
    if (elapsedS < cfg.perRecipientCooldownS) {
      const remaining = cfg.perRecipientCooldownS - elapsedS;
      return {
        ok: false,
        code: "WA_RECIPIENT_COOLDOWN",
        reason: `Cooldown for this number — wait ${remaining}s before resending.`,
      };
    }
  }

  // 4. Global minimum interval
  const { data: lastAny } = await supabase
    .from("wa_send_log")
    .select("sent_at")
    .eq("ok", true)
    .order("sent_at", { ascending: false })
    .limit(1);
  if (lastAny && lastAny.length > 0) {
    const lastSent = new Date(lastAny[0].sent_at).getTime();
    const elapsedS = Math.floor((Date.now() - lastSent) / 1000);
    if (elapsedS < cfg.minIntervalS) {
      const remaining = cfg.minIntervalS - elapsedS;
      return {
        ok: false,
        code: "WA_GLOBAL_INTERVAL",
        reason: `Sending too fast — wait ${remaining}s.`,
      };
    }
  }

  return { ok: true };
}

/* ============================================================
 * Post-send logging.
 * Best-effort: failures here are logged but never throw.
 * ============================================================ */

export async function logWhatsAppSend(opts: {
  target: string;
  message: string;
  ok: boolean;
  error?: string;
  sender?: string;
  submissionId?: string | null;
}): Promise<void> {
  const supabase = getServerSupabase();
  if (!supabase) return;
  try {
    await supabase.from("wa_send_log").insert({
      target_phone: opts.target,
      // Truncate so we don't bloat the table with full message bodies
      message: opts.message.slice(0, 500),
      ok: opts.ok,
      error: opts.error?.slice(0, 500) ?? null,
      sender: opts.sender ?? null,
      submission_id: opts.submissionId ?? null,
    });
  } catch (err) {
    console.error("[wa-safety] log insert threw:", err);
  }
}

/* ============================================================
 * Stats — used by the /agents/dashboard widget.
 * ============================================================ */

export type WaUsage = {
  sentLast24h: number;
  failedLast24h: number;
  dailyLimit: number;
  remaining: number;
  withinWorkingHours: boolean;
  localHour: number;
  workingStart: number;
  workingEnd: number;
  timezone: string;
};

export async function getWaUsage(): Promise<WaUsage> {
  const cfg = getSafetyConfig();
  const localHour = hourInTimeZone(new Date(), cfg.timezone);
  const within =
    localHour >= cfg.workingStart && localHour < cfg.workingEnd;

  const supabase = getServerSupabase();
  let sentLast24h = 0;
  let failedLast24h = 0;
  if (supabase) {
    const since24h = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();
    const [okRes, failRes] = await Promise.all([
      supabase
        .from("wa_send_log")
        .select("*", { count: "exact", head: true })
        .gte("sent_at", since24h)
        .eq("ok", true),
      supabase
        .from("wa_send_log")
        .select("*", { count: "exact", head: true })
        .gte("sent_at", since24h)
        .eq("ok", false),
    ]);
    sentLast24h = okRes.count ?? 0;
    failedLast24h = failRes.count ?? 0;
  }

  return {
    sentLast24h,
    failedLast24h,
    dailyLimit: cfg.dailyLimit,
    remaining: Math.max(0, cfg.dailyLimit - sentLast24h),
    withinWorkingHours: within,
    localHour,
    workingStart: cfg.workingStart,
    workingEnd: cfg.workingEnd,
    timezone: cfg.timezone,
  };
}

/* ============================================================
 * Time-zone helper
 * ============================================================ */

function hourInTimeZone(date: Date, timeZone: string): number {
  // Intl.DateTimeFormat with `hour: "2-digit"` + hourCycle "h23"
  // returns "00".."23" reliably across Chrome/Node.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hourPart = parts.find((p) => p.type === "hour");
  if (!hourPart) return date.getUTCHours();
  const n = Number.parseInt(hourPart.value, 10);
  // Some locales return "24" for midnight — normalize.
  return Number.isFinite(n) ? n % 24 : date.getUTCHours();
}
