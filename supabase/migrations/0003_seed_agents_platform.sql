-- ============================================================
-- Onyx Agents Platform — seed data
-- Re-runnable: each insert uses `on conflict do nothing` against the
-- unique key, so running this twice doesn't duplicate rows.
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
   'working'),

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

-- ---------- CLIENTS (the 3 real ones + a few leads) ----------
insert into public.clients (slug, name, contact_email, status, notes_md) values
  ('great-bali-properties', 'Great Bali Properties',
   'agent@greatbaliproperties.com', 'active',
   'Premium villa marketplace. Phase 2 in progress — listing detail revamp.'),

  ('radcruiters', 'RADcruiters',
   'team@onlineresults.radcruiters.com', 'active',
   'Recruitment-marketing agency in NL. AI intake automation live; expansion scoping.'),

  ('the-hair-extensions-bali', 'The Hair Extensions Bali',
   'studio@thehairextensionsbali.com', 'active',
   'Premium salon in Kerobokan. Brand + site shipped, social retainer ongoing.'),

  ('northpeak-coffee', 'Northpeak Coffee',
   'hello@northpeak.example', 'lead',
   'NL-based specialty coffee. Inquired about paid media. Awaiting reply.'),

  ('atlas-realty', 'Atlas Realty',
   'sales@atlasrealty.example', 'lead',
   'Indonesian realty group. Looking at AI agent for lead qualification.')
on conflict (slug) do nothing;

-- ---------- PROJECTS ----------
insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date, started_at)
select c.id,
       'Phase 2 — listing detail revamp',
       'New listing-detail page with embedded WhatsApp routing, gallery refresh, and IDR/USD switch.',
       'in_progress',
       array['web'],
       date '2026-05-25',
       now() - interval '4 days'
from public.clients c where c.slug = 'great-bali-properties'
on conflict do nothing;

insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date, started_at)
select c.id,
       'AI intake — pipeline expansion',
       'Extend Make.com pipeline with Slack notification, vacancy auto-tagging, and Airtable enrichment.',
       'scoping',
       array['ai_systems'],
       date '2026-05-22',
       now() - interval '2 days'
from public.clients c where c.slug = 'radcruiters'
on conflict do nothing;

insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date, started_at)
select c.id,
       'May social cycle — 4 carousels',
       'Editorial cycle: 4 posts (process, transformations, color science, BTS).',
       'in_progress',
       array['social'],
       date '2026-05-30',
       now() - interval '7 days'
from public.clients c where c.slug = 'the-hair-extensions-bali'
on conflict do nothing;

insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date)
select c.id,
       'Brand identity — logo + wordmark',
       'Full identity system. Wordmark, color, type, motion principles.',
       'done',
       array['brand'],
       date '2026-03-15'
from public.clients c where c.slug = 'the-hair-extensions-bali'
on conflict do nothing;

-- ---------- SUBMISSIONS (mock inbound over past week) ----------
insert into public.submissions (source, from_name, from_email, subject, body_md, interest, budget_band, status, received_at)
values
  ('form', 'Maya Suryadi', 'maya@suryadigroup.com',
   'Web project for ecommerce launch',
   'Hi Onyx, we are launching a Bali-based ecommerce for handmade ceramics. Looking for the full web build + brand + first paid run. Budget around $5-10k. Timeline before September. Can we talk?',
   array['Web Development', 'Brand & Design', 'Paid Media'],
   '$5k–$10k',
   'new',
   now() - interval '2 hours'),

  ('email', 'David Tan', 'david@northpeak.example',
   'Paid media retainer — coffee brand',
   'Northpeak Coffee here. We''re running our own ads but want to bring in a partner for quarterly creative refresh + media buying. Standing budget about $3k/mo. References attached.',
   array['Paid Media'],
   '$3k–$5k',
   'triaged',
   now() - interval '1 day'),

  ('whatsapp', 'Pratiwi Wibowo', null,
   null,
   'Halo, saya tertarik untuk bangun website portofolio fotografi. Kira-kira budget berapa ya untuk web yang simple tapi premium? Thanks.',
   array['Web Development'],
   '$1k–$3k',
   'new',
   now() - interval '5 hours'),

  ('email', 'Atlas Realty Team', 'sales@atlasrealty.example',
   'AI agent for incoming leads',
   'We get 100+ inquiries a week. Want to qualify them automatically — schedule visits, answer FAQs, hand the warm ones to humans. Have you done this kind of thing?',
   array['AI Systems'],
   '$10k+',
   'qualified',
   now() - interval '2 days'),

  ('form', 'Anonymous', 'careers@gigantor.example',
   '(missing subject)',
   'Hello, we are a recruitment agency in Singapore looking for someone to do our social media. Please send rate card.',
   array['Social Media'],
   'Not sure yet',
   'archived',
   now() - interval '4 days'),

  ('whatsapp', 'Bayu Saputra', null,
   null,
   'Bro, lagi cari yang bisa handle ads buat warung kopi gw di Canggu. Budget kecil sih, sekitar 1 juta per bulan. Bisa?',
   array['Paid Media'],
   '< $1k',
   'replied',
   now() - interval '3 days'),

  ('form', 'Chiara Rosso', 'c.rosso@studio.example',
   'Co-production for a brand book',
   'I run a small studio in Milan. We have a client that wants a brand book printed and the design budget got blown out. Looking for a partner to absorb the design work. ~$4k.',
   array['Brand & Design'],
   '$3k–$5k',
   'triaged',
   now() - interval '6 days')
on conflict do nothing;

-- ---------- AGENT RUNS (mocked activity) ----------
insert into public.agent_runs (agent_id, project_id, input_md, output_md, status, started_at, completed_at, duration_ms)
select a.id, p.id,
       'New brief routed from Director.',
       'Drafted scope.md + timeline.md + quote.md. Estimated 6-week build, $6k band.',
       'success',
       now() - interval '2 hours' - interval '2 minutes',
       now() - interval '2 hours' - interval '20 seconds',
       100000
from public.agents a, public.projects p
where a.slug = 'strategist'
  and p.title like 'AI intake%'
on conflict do nothing;

insert into public.agent_runs (agent_id, project_id, input_md, output_md, status, started_at, completed_at, duration_ms)
select a.id, p.id,
       'Listing detail revamp — phase 2 build.',
       'Rendered new listing template. WhatsApp routing wired. Currency switch live in staging.',
       'success',
       now() - interval '4 hours',
       now() - interval '3 hours' - interval '15 minutes',
       2700000
from public.agents a, public.projects p
where a.slug = 'maker'
  and p.title like 'Phase 2%'
on conflict do nothing;

insert into public.agent_runs (agent_id, project_id, input_md, output_md, status, started_at, completed_at, duration_ms)
select a.id, p.id,
       'Weekly status email to client.',
       'Sent. Client confirmed Friday review session.',
       'success',
       now() - interval '1 day',
       now() - interval '1 day' + interval '40 seconds',
       40000
from public.agents a, public.projects p
where a.slug = 'account-manager'
  and p.title like 'May social%'
on conflict do nothing;

insert into public.agent_runs (agent_id, input_md, status, started_at)
select a.id, 'Triaging Maya Suryadi inbound', 'running', now() - interval '15 minutes'
from public.agents a where a.slug = 'director'
on conflict do nothing;

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
