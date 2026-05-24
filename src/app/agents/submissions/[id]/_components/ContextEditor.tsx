"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertContextAction } from "../../actions";
import type {
  ChatCredential,
  ChatDeliverable,
  ChatLink,
  ChatReportingItem,
  ChatSocialAccount,
  SubmissionContextRow,
} from "@/lib/db/submissions";

/**
 * Project-context vault editor.
 *
 * Sections: Brief / Links / Social / Deliverables / Reporting / Credentials.
 *
 * Credentials are AES-256-GCM-encrypted server-side before storage.
 * The list is held locally as plaintext until "Save context" — one
 * round-trip writes the whole row. Atomic encryption boundary; no
 * per-field auto-save spinners.
 */

type FormState = {
  brief_md: string;
  links: ChatLink[];
  social_accounts: ChatSocialAccount[];
  deliverables: ChatDeliverable[];
  reporting_setup: ChatReportingItem[];
  credentials: ChatCredential[];
};

export default function ContextEditor({
  submissionId,
  initial,
}: {
  submissionId: string;
  initial: SubmissionContextRow;
}) {
  const [form, setForm] = useState<FormState>({
    brief_md: initial.brief_md ?? "",
    links: initial.links ?? [],
    social_accounts: initial.social_accounts ?? [],
    deliverables: initial.deliverables ?? [],
    reporting_setup: initial.reporting_setup ?? [],
    credentials: initial.credentials ?? [],
  });
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const router = useRouter();

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await upsertContextAction(submissionId, form);
      if (!res.ok) return setMsg({ kind: "err", text: res.error ?? "Save failed" });
      setMsg({ kind: "ok", text: "Saved" });
      router.refresh();
    });
  }

  return (
    <div className="border border-bone/15">
      <Section title="Brief">
        <textarea
          value={form.brief_md}
          onChange={(e) =>
            setForm((f) => ({ ...f, brief_md: e.target.value }))
          }
          rows={5}
          placeholder="Project description, goals, deadlines, brand-voice notes, anything an agent should know..."
          className="w-full bg-bone/[0.04] border border-bone/15 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:border-bone/40 resize-y"
        />
      </Section>

      <Section title="Links">
        <List
          items={form.links}
          onChange={(items) => setForm((f) => ({ ...f, links: items }))}
          emptyHint="No links yet. Add the website, GA dashboard, Drive folder, FB page, IG, etc."
          newItem={(): ChatLink => ({ label: "", url: "", notes: "" })}
          render={(item, update) => (
            <>
              <Input
                placeholder="Label (e.g. Website admin)"
                value={item.label}
                onChange={(v) => update({ ...item, label: v })}
              />
              <Input
                placeholder="https://..."
                value={item.url}
                onChange={(v) => update({ ...item, url: v })}
                mono
              />
              <Input
                placeholder="Notes (optional)"
                value={item.notes ?? ""}
                onChange={(v) => update({ ...item, notes: v })}
                small
              />
            </>
          )}
        />
      </Section>

      <Section title="Social accounts">
        <List
          items={form.social_accounts}
          onChange={(items) =>
            setForm((f) => ({ ...f, social_accounts: items }))
          }
          emptyHint="Instagram, Facebook, TikTok, LinkedIn, YouTube..."
          newItem={(): ChatSocialAccount => ({
            platform: "",
            handle: "",
            business_id: "",
            access_level: "",
            notes: "",
          })}
          render={(item, update) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Platform"
                  value={item.platform}
                  onChange={(v) => update({ ...item, platform: v })}
                />
                <Input
                  placeholder="Handle / @username"
                  value={item.handle}
                  onChange={(v) => update({ ...item, handle: v })}
                  mono
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Business ID (optional)"
                  value={item.business_id ?? ""}
                  onChange={(v) => update({ ...item, business_id: v })}
                  mono
                />
                <Input
                  placeholder="Access level"
                  value={item.access_level ?? ""}
                  onChange={(v) => update({ ...item, access_level: v })}
                />
              </div>
              <Input
                placeholder="Notes (optional)"
                value={item.notes ?? ""}
                onChange={(v) => update({ ...item, notes: v })}
                small
              />
            </>
          )}
        />
      </Section>

      <Section title="Deliverables">
        <List
          items={form.deliverables}
          onChange={(items) =>
            setForm((f) => ({ ...f, deliverables: items }))
          }
          emptyHint="What needs to ship? Logo files, website launch, content calendar..."
          newItem={(): ChatDeliverable => ({ name: "", status: "todo" })}
          render={(item, update) => (
            <>
              <Input
                placeholder="Deliverable name"
                value={item.name}
                onChange={(v) => update({ ...item, name: v })}
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={item.status}
                  onChange={(e) =>
                    update({
                      ...item,
                      status: e.target.value as ChatDeliverable["status"],
                    })
                  }
                  className="bg-bone/[0.04] border border-bone/15 px-2.5 py-1.5 text-sm focus:outline-none focus:border-bone/40"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
                <Input
                  type="date"
                  placeholder="Deadline"
                  value={item.deadline ?? ""}
                  onChange={(v) => update({ ...item, deadline: v })}
                />
              </div>
              <Input
                placeholder="File / preview URL (optional)"
                value={item.file_url ?? ""}
                onChange={(v) => update({ ...item, file_url: v })}
                mono
                small
              />
              <Input
                placeholder="Notes (optional)"
                value={item.notes ?? ""}
                onChange={(v) => update({ ...item, notes: v })}
                small
              />
            </>
          )}
        />
      </Section>

      <Section title="Reporting setup">
        <List
          items={form.reporting_setup}
          onChange={(items) =>
            setForm((f) => ({ ...f, reporting_setup: items }))
          }
          emptyHint="Recurring reports — KPI, frequency, recipient."
          newItem={(): ChatReportingItem => ({
            kpi: "",
            frequency: "monthly",
          })}
          render={(item, update) => (
            <>
              <Input
                placeholder="KPI (e.g. Sessions, IG followers, ROAS)"
                value={item.kpi}
                onChange={(v) => update({ ...item, kpi: v })}
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={item.frequency}
                  onChange={(e) =>
                    update({
                      ...item,
                      frequency: e.target
                        .value as ChatReportingItem["frequency"],
                    })
                  }
                  className="bg-bone/[0.04] border border-bone/15 px-2.5 py-1.5 text-sm focus:outline-none focus:border-bone/40"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <Input
                  placeholder="Recipient (email)"
                  value={item.recipient ?? ""}
                  onChange={(v) => update({ ...item, recipient: v })}
                  mono
                />
              </div>
              <Input
                placeholder="Notes (optional)"
                value={item.notes ?? ""}
                onChange={(v) => update({ ...item, notes: v })}
                small
              />
            </>
          )}
        />
      </Section>

      <Section
        title="Credentials"
        subtitle="Encrypted with AES-256-GCM before storage. Passwords masked until you click Show."
      >
        <List
          items={form.credentials}
          onChange={(items) =>
            setForm((f) => ({ ...f, credentials: items }))
          }
          emptyHint="WordPress admin, Gmail, IG Business, Meta Ads Manager, hosting..."
          newItem={(): ChatCredential => ({
            service: "",
            login: "",
            password: "",
          })}
          render={(item, update) => (
            <CredentialRow item={item} update={update} />
          )}
        />
      </Section>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-bone/15 bg-bone/[0.02]">
        <span className="text-[10px] tracking-[0.18em] uppercase opacity-50">
          {initial.updated_by
            ? `Last by ${initial.updated_by}`
            : "Never saved"}
        </span>
        <div className="flex items-center gap-3">
          {msg && (
            <span
              className={`text-[11px] italic ${
                msg.kind === "ok" ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {msg.text}
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="text-[10px] tracking-[0.18em] uppercase border border-emerald-300/50 text-emerald-200 px-3 py-1.5 hover:bg-emerald-300/10 disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save context"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Helpers (Section / Input / List / CredentialRow)
 * ============================================================ */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-bone/10 last:border-b-0">
      <header className="px-4 pt-3 pb-2">
        <h3 className="text-[10px] tracking-[0.22em] uppercase opacity-65">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[10px] opacity-50 mt-1 leading-snug">
            {subtitle}
          </p>
        )}
      </header>
      <div className="px-4 pb-4">{children}</div>
    </section>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  mono,
  small,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  small?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-bone/[0.04] border border-bone/15 px-2.5 py-1.5 ${
        small ? "text-[12px]" : "text-sm"
      } ${mono ? "font-mono" : ""} focus:outline-none focus:border-bone/40`}
    />
  );
}

function List<T>({
  items,
  onChange,
  render,
  newItem,
  emptyHint,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
  newItem: () => T;
  emptyHint: string;
}) {
  function addRow() {
    onChange([...items, newItem()]);
  }
  function removeRow(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function updateRow(i: number, next: T) {
    onChange(items.map((it, idx) => (idx === i ? next : it)));
  }
  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-[11px] italic opacity-50 py-1">{emptyHint}</p>
      )}
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-bone/15 p-2.5 space-y-1.5 relative"
        >
          {render(item, (next) => updateRow(i, next))}
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="absolute top-1.5 right-1.5 text-[10px] tracking-[0.18em] uppercase opacity-50 hover:opacity-100 hover:text-red-300 px-1"
            title="Remove this row"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="text-[10px] tracking-[0.18em] uppercase border border-dashed border-bone/30 px-3 py-1.5 w-full hover:bg-bone/[0.05]"
      >
        + Add
      </button>
    </div>
  );
}

function CredentialRow({
  item,
  update,
}: {
  item: ChatCredential;
  update: (next: ChatCredential) => void;
}) {
  const [reveal, setReveal] = useState(false);
  return (
    <>
      <Input
        placeholder="Service (e.g. WordPress admin, Gmail, IG Business)"
        value={item.service}
        onChange={(v) => update({ ...item, service: v })}
      />
      <Input
        placeholder="Login (email/username)"
        value={item.login}
        onChange={(v) => update({ ...item, login: v })}
        mono
      />
      <div className="flex items-center gap-1.5">
        <input
          type={reveal ? "text" : "password"}
          value={item.password}
          onChange={(e) => update({ ...item, password: e.target.value })}
          placeholder="Password"
          className="flex-1 bg-bone/[0.04] border border-bone/15 px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:border-bone/40"
        />
        <button
          type="button"
          onClick={() => setReveal((r) => !r)}
          className="text-[10px] tracking-[0.18em] uppercase border border-bone/30 px-2 py-1.5 hover:bg-bone hover:text-ink"
        >
          {reveal ? "Hide" : "Show"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Scope (admin/editor/...)"
          value={item.scope ?? ""}
          onChange={(v) => update({ ...item, scope: v })}
          small
        />
        <Input
          placeholder="MFA notes (recovery codes etc)"
          value={item.mfa_notes ?? ""}
          onChange={(v) => update({ ...item, mfa_notes: v })}
          small
        />
      </div>
      <Input
        placeholder="Notes (optional)"
        value={item.notes ?? ""}
        onChange={(v) => update({ ...item, notes: v })}
        small
      />
    </>
  );
}
