/**
 * Clients queries — feeds /agents/onboarding/[client] and /agents/results/[client].
 *
 * Phase 1 just exposes list + by-slug. RLS comes online in Phase 2 when
 * client-side portals land.
 */

import { getServerSupabase } from "@/lib/supabase";
import type { ClientRow, ClientStatus } from "./types";

export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  lead: "Lead",
  active: "Active",
  paused: "Paused",
  closed: "Closed",
};

export async function listClients(): Promise<ClientRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[db/clients] listClients:", error.message);
    return [];
  }
  return (data ?? []) as ClientRow[];
}

export async function getClientBySlug(slug: string): Promise<ClientRow | null> {
  const sb = getServerSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from("clients")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn("[db/clients] getClientBySlug:", error.message);
    return null;
  }
  return (data ?? null) as ClientRow | null;
}

export async function countClientsByStatus(): Promise<Record<ClientStatus, number>> {
  const empty: Record<ClientStatus, number> = {
    lead: 0,
    active: 0,
    paused: 0,
    closed: 0,
  };
  const sb = getServerSupabase();
  if (!sb) return empty;

  const { data, error } = await sb.from("clients").select("status");
  if (error || !data) {
    if (error) console.warn("[db/clients] countByStatus:", error.message);
    return empty;
  }

  const counts = { ...empty };
  for (const row of data as Pick<ClientRow, "status">[]) {
    if (row.status in counts) counts[row.status] += 1;
  }
  return counts;
}
