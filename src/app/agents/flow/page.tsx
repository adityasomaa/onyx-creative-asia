import { listFlows, TRIGGER_LABEL } from "@/lib/db/flows";

export const dynamic = "force-dynamic";

export default async function FlowPage() {
  const flows = await listFlows();

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 space-y-16">
      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-55 mb-5">
          [ FLOW.GRAPH · {flows.length} REGISTERED ]
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
          Flows
          <br />
          <span className="font-light italic">— the studio runs itself.</span>
        </h1>
        <p className="mt-8 text-base md:text-lg opacity-75 max-w-xl leading-relaxed">
          Each flow connects a trigger to one or more agents and a result.
          Phase 1 just registers them. Phase 3 visualises the node graph.
          Phase 4 runs them autonomously via the Claude Agent SDK.
        </p>
      </section>

      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-65 mb-6">
          // REGISTRY
        </p>

        {flows.length === 0 ? (
          <p className="text-sm opacity-60 italic">
            No flows registered yet. Once Supabase is wired and migrations
            have run, the seed file inserts three placeholders.
          </p>
        ) : (
          <ul className="border-t border-bone/15">
            {flows.map((f, i) => (
              <li
                key={f.id}
                className="border-b border-bone/15 py-6 md:py-7 grid grid-cols-12 gap-4 md:gap-6 items-baseline"
              >
                <span className="col-span-1 text-xs tabular-nums opacity-50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-11 md:col-span-5">
                  <p className="text-lg md:text-xl font-medium tracking-tight leading-tight">
                    {f.name}
                  </p>
                  <p className="text-[11px] tracking-[0.18em] uppercase opacity-60 mt-1 font-mono">
                    {f.slug}
                  </p>
                  {f.description && (
                    <p className="mt-3 text-sm opacity-75 italic leading-relaxed">
                      {f.description}
                    </p>
                  )}
                </div>
                <div className="col-span-6 md:col-span-3 text-sm">
                  <p className="text-[11px] tracking-[0.18em] uppercase opacity-55 mb-1">
                    Trigger
                  </p>
                  <p>{TRIGGER_LABEL[f.trigger_kind] ?? f.trigger_kind}</p>
                </div>
                <div className="col-span-6 md:col-span-3 text-sm">
                  <p className="text-[11px] tracking-[0.18em] uppercase opacity-55 mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block border rounded-sm px-2 py-0.5 text-[11px] tracking-[0.2em] uppercase ${
                      f.enabled
                        ? "border-emerald-400 text-emerald-300"
                        : "border-bone/30 opacity-70"
                    }`}
                  >
                    {f.enabled ? "Enabled" : "Disabled"}
                  </span>
                  {f.last_run_at && (
                    <p className="text-[11px] opacity-60 mt-2 italic">
                      Last run · {new Date(f.last_run_at).toUTCString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-bone/15 pt-10 space-y-6">
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-65">
          // ROADMAP
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
          <Phase
            n="P1"
            title="Registry"
            done
            body="Flows stored in DB. Visible here. Read-only from the dashboard."
          />
          <Phase
            n="P2"
            title="Live ingest"
            body="Form/email/WhatsApp pipe submissions into the table. Manual triggers via API."
          />
          <Phase
            n="P3"
            title="Graph editor"
            body="React Flow renders the node DAG. I edit via code commits — you watch."
          />
          <Phase
            n="P4"
            title="Autonomous runs"
            body="Claude Agent SDK executes the graph end-to-end. Agent runs land in the activity log."
          />
        </div>
      </section>
    </div>
  );
}

function Phase({
  n,
  title,
  body,
  done,
}: {
  n: string;
  title: string;
  body: string;
  done?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] tracking-[0.25em] uppercase opacity-60 flex items-center gap-3">
        <span className="border border-bone/30 rounded-sm px-1.5 py-0.5">
          {n}
        </span>
        {done && (
          <span className="text-emerald-300 text-[10px] tracking-[0.3em]">
            ✓ DONE
          </span>
        )}
      </p>
      <p className="text-lg md:text-xl font-medium tracking-tight">{title}</p>
      <p className="text-sm opacity-75 leading-relaxed">{body}</p>
    </div>
  );
}
