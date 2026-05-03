import { NextResponse } from "next/server";
import { getServerSupabase, type Lead } from "@/lib/supabase";

export const runtime = "nodejs";

function isEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  let body: Partial<Lead>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => typeof s === "string")
    : [];
  const company = typeof body.company === "string" ? body.company.trim() : null;
  const budget = typeof body.budget === "string" ? body.budget.trim() : null;

  if (!name || name.length > 200) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    console.warn("[leads] Supabase env not set — logging instead.", {
      name,
      email,
      services,
      message: message.slice(0, 80),
    });
    return NextResponse.json({ ok: true, mock: true });
  }

  const { error } = await supabase.from("leads").insert({
    name,
    email,
    company,
    budget,
    services,
    message,
    source: "website",
  });

  if (error) {
    console.error("[leads] insert error", error);
    return NextResponse.json({ ok: false, error: "Could not save." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
