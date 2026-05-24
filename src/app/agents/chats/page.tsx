import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import {
  listWaChats,
  WA_CHAT_TABS,
  WA_CHAT_TAB_LABEL,
  type WaChatRow,
  type WaChatTab,
} from "@/lib/db/wa-chats";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function relativeAgo(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diffS = Math.floor((Date.now() - then) / 1000);
  if (diffS < 60) return `${diffS}s ago`;
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ago`;
  if (diffS < 86_400) return `${Math.floor(diffS / 3600)}h ago`;
  if (diffS < 86_400 * 7) return `${Math.floor(diffS / 86_400)}d ago`;
  return DATE_FMT.format(new Date(iso));
}

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const rawTab = sp.tab ?? "active";
  const tab: WaChatTab = (WA_CHAT_TABS as string[]).includes(rawTab)
    ? (rawTab as WaChatTab)
    : "active";

  const chats = await listWaChats({ tab, limit: 200 });
  const unreadCount = chats.filter((c) => !c.is_read).length;

  return (
    <>
      <PageHeader
        kicker="WHATSAPP INBOX"
        title="Chats"
        count={`${chats.length}`}
        actions={
          <span className="text-[10px] tracking-[0.18em] uppercase opacity-50">
            {WA_CHAT_TAB_LABEL[tab]}
            {tab === "active" && unreadCount > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="text-emerald-300">{unreadCount} unread</span>
              </>
            )}
          </span>
        }
      />

      {/* TAB FILTER */}
      <div className="border-b border-bone/10 px-6 md:px-10 py-3 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] uppercase">
        <span className="opacity-50 mr-2">View</span>
        {WA_CHAT_TABS.map((t) => {
          const active = t === tab;
          return (
            <Link
              key={t}
              href={t === "active" ? "/agents/chats" : `/agents/chats?tab=${t}`}
              className={`px-2.5 py-1 border transition-colors ${
                active
                  ? "border-bone bg-bone text-ink"
                  : "border-bone/25 hover:border-bone/50 opacity-75"
              }`}
            >
              {WA_CHAT_TAB_LABEL[t]}
            </Link>
          );
        })}
      </div>

      <div className="px-6 md:px-10 py-6">
        {chats.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <ul className="border border-bone/15 divide-y divide-bone/10">
            {chats.map((chat) => (
              <ChatRow key={chat.id} chat={chat} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function ChatRow({ chat }: { chat: WaChatRow }) {
  const unread = !chat.is_read;
  return (
    <li>
      <Link
        href={`/agents/chats/${chat.id}`}
        className={`flex items-start gap-4 px-4 py-4 transition-colors hover:bg-bone/[0.03] ${
          unread ? "bg-emerald-400/[0.025]" : ""
        }`}
      >
        {/* Unread dot */}
        <span
          className={`mt-2 inline-block w-2 h-2 rounded-full shrink-0 ${
            unread ? "bg-emerald-300" : "bg-bone/15"
          }`}
          aria-label={unread ? "Unread" : "Read"}
        />

        {/* Main column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
            <span className={`text-sm ${unread ? "font-medium" : "opacity-90"} truncate`}>
              {chat.display_name ?? chat.wa_identifier}
            </span>
            {chat.kind === "group" && (
              <span className="text-[9px] tracking-[0.22em] uppercase border border-bone/25 px-1 py-0.5 opacity-65">
                Group
              </span>
            )}
            <ClassificationChip classification={chat.classification} />
          </div>

          {/* Subject — LLM-generated action phrase */}
          <p
            className={`text-sm leading-snug ${
              unread ? "text-bone" : "text-bone/75"
            } line-clamp-2`}
          >
            {chat.subject ??
              chat.last_message_preview ??
              "(no messages yet)"}
          </p>

          {/* Raw preview as faded sub-line so context isn't lost */}
          {chat.subject && chat.last_message_preview && (
            <p className="text-[11px] italic opacity-45 mt-0.5 line-clamp-1">
              {chat.last_message_direction === "out" && "↳ "}
              {chat.last_message_preview}
            </p>
          )}
        </div>

        {/* Meta column */}
        <div className="text-right shrink-0 flex flex-col items-end gap-1">
          <span className="text-[10px] tracking-[0.14em] uppercase tabular-nums opacity-70 whitespace-nowrap">
            {relativeAgo(chat.last_message_at)}
          </span>
          <span className="text-[9px] tracking-[0.18em] uppercase opacity-45">
            {chat.message_count} msg
          </span>
        </div>
      </Link>
    </li>
  );
}

function ClassificationChip({
  classification,
}: {
  classification: WaChatRow["classification"];
}) {
  if (classification === "business" || classification === "manual_business") {
    return null; // default — no chip
  }
  if (classification === "pending") {
    return (
      <span className="text-[9px] tracking-[0.22em] uppercase border border-amber-300/40 text-amber-200/80 px-1 py-0.5">
        Pending
      </span>
    );
  }
  if (classification === "personal" || classification === "manual_ignored") {
    return (
      <span className="text-[9px] tracking-[0.22em] uppercase border border-bone/20 opacity-50 px-1 py-0.5">
        {classification === "manual_ignored" ? "Ignored" : "Personal"}
      </span>
    );
  }
  return null;
}

function EmptyState({ tab }: { tab: WaChatTab }) {
  let copy = "No chats yet. New WhatsApp messages will land here.";
  if (tab === "personal") {
    copy = "Nothing filed as personal yet.";
  } else if (tab === "archived") {
    copy = "No archived chats.";
  }
  return (
    <div className="border border-bone/15 px-4 py-12 text-sm italic opacity-55 text-center">
      {copy}
    </div>
  );
}
