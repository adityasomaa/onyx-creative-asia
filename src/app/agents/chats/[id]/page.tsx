import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "../../_components/PageHeader";
import ChatActions from "./_components/ChatActions";
import ChatReplyBox from "./_components/ChatReplyBox";
import ChatRename from "./_components/ChatRename";
import ContextEditor from "./_components/ContextEditor";
import MarkReadOnMount from "./_components/MarkReadOnMount";
import {
  getChatContext,
  getWaChatById,
  listMessagesForChat,
} from "@/lib/db/wa-chats";
import { vaultIsConfigured } from "@/lib/crypto-vault";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const chat = await getWaChatById(id);
  if (!chat) notFound();

  const [messages, context] = await Promise.all([
    listMessagesForChat(id),
    getChatContext(id),
  ]);

  const vaultStatus = vaultIsConfigured();

  return (
    <>
      <MarkReadOnMount chatId={id} alreadyRead={chat.is_read} />

      <PageHeader
        kicker="CHAT"
        title={chat.display_name ?? chat.wa_identifier}
        breadcrumb={[{ href: "/agents/chats", label: "Chats" }]}
        actions={
          <ChatActions
            chatId={id}
            classification={chat.classification}
            archived={chat.archived}
          />
        }
      />

      {/* Meta strip */}
      <div className="border-b border-bone/10 px-6 md:px-10 py-3 flex flex-wrap items-baseline gap-x-6 gap-y-1.5 text-[11px]">
        {chat.kind === "contact" && (
          <span>
            <span className="opacity-50 mr-1.5 tracking-[0.18em] uppercase text-[10px]">
              Phone
            </span>
            <span className="font-mono tabular-nums">{chat.wa_identifier}</span>
          </span>
        )}
        {chat.kind === "group" && chat.wa_group_name && (
          <span>
            <span className="opacity-50 mr-1.5 tracking-[0.18em] uppercase text-[10px]">
              Group
            </span>
            <span>{chat.wa_group_name}</span>
          </span>
        )}
        {chat.wa_pushname && (
          <span>
            <span className="opacity-50 mr-1.5 tracking-[0.18em] uppercase text-[10px]">
              WA profile
            </span>
            <span className="opacity-80">{chat.wa_pushname}</span>
          </span>
        )}
        <span>
          <span className="opacity-50 mr-1.5 tracking-[0.18em] uppercase text-[10px]">
            First seen
          </span>
          {DATE_FMT.format(new Date(chat.created_at))}
        </span>
        <span>
          <span className="opacity-50 mr-1.5 tracking-[0.18em] uppercase text-[10px]">
            Messages
          </span>
          <span className="tabular-nums">{chat.message_count}</span>
        </span>
      </div>

      {/* Subject pill */}
      {chat.subject && (
        <div className="px-6 md:px-10 py-3 border-b border-bone/10">
          <span className="text-[10px] tracking-[0.22em] uppercase opacity-50 mr-2">
            Subject
          </span>
          <span className="text-sm italic">{chat.subject}</span>
        </div>
      )}

      {/* Classification reason from Gemini, if present */}
      {chat.classification_reason && (
        <div className="px-6 md:px-10 py-2 border-b border-bone/10 text-[11px] opacity-55 italic">
          Classified as <strong>{chat.classification}</strong>:{" "}
          {chat.classification_reason}
        </div>
      )}

      {/* ─────────── Two-column body ─────────── */}
      <div className="px-6 md:px-10 py-6 grid gap-8 lg:grid-cols-[1fr_440px]">
        {/* LEFT — message thread + rename + reply */}
        <section className="min-w-0 flex flex-col gap-6">
          <ChatRename
            chatId={id}
            currentName={chat.display_name ?? ""}
            isOperatorSet={chat.display_name_source === "operator"}
            phoneFallback={chat.wa_identifier}
          />

          <div>
            <h2 className="text-[10px] tracking-[0.22em] uppercase opacity-50 mb-3">
              Thread
            </h2>
            {messages.length === 0 ? (
              <div className="border border-bone/15 px-4 py-8 text-sm italic opacity-55 text-center">
                No messages yet.
              </div>
            ) : (
              <ol className="space-y-2.5">
                {messages.map((m) => {
                  const inbound = m.direction === "in";
                  return (
                    <li
                      key={m.id}
                      className={`flex ${inbound ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] border px-3.5 py-2.5 text-sm leading-relaxed ${
                          inbound
                            ? "border-bone/20 bg-bone/[0.04] rounded-tr-md rounded-br-md rounded-bl-md"
                            : "border-emerald-300/30 bg-emerald-300/[0.05] rounded-tl-md rounded-bl-md rounded-br-md"
                        }`}
                      >
                        <div className="text-[10px] tracking-[0.18em] uppercase opacity-50 mb-1 flex items-center gap-2">
                          <span>
                            {inbound ? m.from_pushname ?? "Sender" : "Onyx"}
                          </span>
                          <span className="opacity-50">·</span>
                          <span className="tabular-nums">
                            {TIME_FMT.format(new Date(m.sent_at))}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap break-words">
                          {m.body_md}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {chat.kind === "contact" && (
            <ChatReplyBox chatId={id} target={chat.wa_identifier} />
          )}
          {chat.kind === "group" && (
            <p className="text-[12px] italic opacity-55 border border-bone/15 px-4 py-3">
              Replies to groups aren&apos;t supported yet — respond in WhatsApp
              directly.
            </p>
          )}
        </section>

        {/* RIGHT — project context vault */}
        <aside className="min-w-0">
          <h2 className="text-[10px] tracking-[0.22em] uppercase opacity-50 mb-3">
            Project context
          </h2>
          {!vaultStatus.ok && (
            <div className="mb-3 border border-amber-300/40 bg-amber-300/[0.06] px-3 py-2 text-[11px] text-amber-200">
              Vault key not configured. Credentials can&apos;t be saved.{" "}
              <Link
                href="/agents/profile"
                className="underline hover:opacity-80"
              >
                Set CHAT_CONTEXT_SECRET
              </Link>
              .
            </div>
          )}
          {context.credentials_undecryptable && (
            <div className="mb-3 border border-red-400/50 bg-red-400/[0.06] px-3 py-2 text-[11px] text-red-200">
              Stored credentials can&apos;t be decrypted (vault key changed
              or row tampered). Re-enter them below.
            </div>
          )}
          <ContextEditor chatId={id} initial={context} />
        </aside>
      </div>
    </>
  );
}
