-- ============================================================
-- Onyx Agents Platform — seed data
-- Re-runnable: each insert uses `on conflict do nothing` against the
-- unique key, so running this twice doesn't duplicate rows.
--
-- Slimmed to seed ONLY the design-time records (agents + flow
-- templates). Transactional data (clients, projects, submissions,
-- agent_runs) is left empty so the dashboard reflects real
-- platform activity going forward. See migration 0007 for the
-- cleanup that removed the original dummy seed rows.
-- ============================================================

-- ---------- AGENTS (4 MVP roster) ----------
insert into public.agents (slug, name, role, number, manifesto, replaces, tools, hands_off_to, charter, status) values
  ('director', 'Director',
   'Routes inbound briefs · decomposes work · keeps the project ledger',
   '01',
   'First contact for every brief. Reads the room, decides who picks it up, and never lets a project drop between disciplines.',
   'Founder · Project Manager · Account Director',
   array['TodoWrite', 'Read', 'Write', 'WebSearch', 'WebFetch', 'Task (sub-agents)'],
   array['strategist', 'maker', 'account-manager'],
   array[
     'Every inbound brief — whether it arrives via WhatsApp, email, or the contact form — lands here first. Classifies by discipline mix, urgency, and fit, then routes.',
     'Maintains the project ledger. Tags each project with current owner, status, and next handoff.',
     'Refuses out-of-fit work directly. A brief that needs five disciplines in two weeks doesn''t get a discount — it gets a friendly no, with a referral when possible.'
   ],
   'idle'),

  ('strategist', 'Strategist',
   'Scopes briefs · writes proposals · plans timelines',
   '02',
   'Translates a vague brief into a one-page scope and an honest timeline. Won''t quote without naming the constraint.',
   'Senior Strategist · Producer',
   array['Read', 'Write', 'Edit', 'WebSearch', 'Glob', 'Grep'],
   array['maker', 'account-manager'],
   array[
     'Receives the routed brief from the Director. Reads scope conventions and any past projects in the same vertical.',
     'Produces three artifacts per brief: scope.md (one page, no more), timeline.md (mermaid gantt), and quote.md (numbered phases with cost band in USD).',
     'Pushes back on briefs that won''t fit the timeline before they reach the maker. Better a hard conversation now than a missed deadline later.'
   ],
   'idle'),

  ('maker', 'Maker',
   'Designs · builds · ships — combined craft role',
   '03',
   'The studio''s hand. Designs in Figma/Stitch, codes in Next.js, renders motion in Remotion, and treats every export as final.',
   'Designer · Developer · Motion Designer',
   array['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep', 'render.py · Remotion · Stitch MCP · GitHub MCP'],
   array['account-manager'],
   array[
     'Picks up scoped work from the Strategist. Reads the brand spec at design/brand/ before any pixel is drawn or any line of code is written.',
     'Ships in the same Black Box visual language across surfaces — web, social, motion. The discipline boundary between design and dev is internal; the client never feels the seam.',
     'Auto-pushes commits to the production repo on completion. No staging environment that goes stale.'
   ],
   'idle'),

  ('account-manager', 'Account Manager',
   'Client comms · status updates · invoicing · follow-ups',
   '04',
   'The voice the client hears between the kickoff and the launch. Writes like the brand — same restraint, same care.',
   'Account Manager · Customer Success',
   array['Gmail MCP', 'Drive MCP', 'Read', 'Write', 'Edit'],
   array['director'],
   array[
     'Drafts confirmation emails when a new project is approved, weekly status updates while it''s in flight, and the final handoff doc when it ships.',
     'Monitors inbound replies for tone — flags anything that sounds like a concern to the Director, not the Maker (so production keeps focus).',
     'Owns the invoicing rhythm. 50% on signature, 50% on ship, no exceptions for projects under $5k.'
   ],
   'idle')
on conflict (slug) do nothing;


-- ---------- FLOWS (defined in code, mirrored here for runtime) ----------
insert into public.flows (slug, name, description, trigger_kind, enabled, graph_json) values
  ('inbound-triage',
   'Inbound Triage',
   'New submission → Director classifies → routes to Strategist or Account Manager.',
   'submission.new',
   false,
   '{"nodes": [], "edges": []}'::jsonb),

  ('weekly-status',
   'Weekly Client Status',
   'Every Monday morning, Account Manager generates + sends status for each active project.',
   'cron.weekly',
   false,
   '{"nodes": [], "edges": []}'::jsonb),

  ('social-cycle',
   'Social Content Cycle',
   'Maker drafts next-week''s 4 posts from project brief + brand voice, drops to Drive for approval.',
   'cron.weekly',
   false,
   '{"nodes": [], "edges": []}'::jsonb)
on conflict (slug) do nothing;
