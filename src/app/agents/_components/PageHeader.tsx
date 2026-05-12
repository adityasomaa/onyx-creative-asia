import Link from "next/link";

/**
 * Compact SaaS page header — replaces the editorial hero blocks. Lives at
 * the top of every internal page and gives the page a name, a count,
 * optional breadcrumbs, and a slot for actions (filters, "new" buttons).
 *
 * Visual reference: Linear / Vercel dashboard / Stripe header. Stays
 * dense (small type, single row) so the data below it gets the real
 * estate.
 */
export default function PageHeader({
  title,
  kicker,
  count,
  breadcrumb,
  actions,
}: {
  title: string;
  kicker?: string;
  count?: number | string;
  breadcrumb?: { href: string; label: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-bone/10 px-6 md:px-10 py-4 md:py-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="text-[10px] tracking-[0.18em] uppercase opacity-50 mb-1.5 flex items-center gap-2">
            {breadcrumb.map((b, i) => (
              <span key={b.href} className="flex items-center gap-2">
                <Link
                  href={b.href}
                  className="hover:opacity-80 transition-opacity"
                >
                  {b.label}
                </Link>
                {i < breadcrumb.length - 1 && <span aria-hidden>/</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-baseline gap-3">
          {kicker && (
            <span className="text-[10px] tracking-[0.22em] uppercase opacity-50">
              {kicker}
            </span>
          )}
          <h1 className="text-xl md:text-2xl font-medium tracking-tight">
            {title}
          </h1>
          {count !== undefined && (
            <span className="text-[11px] tabular-nums opacity-50 tracking-wider">
              {count}
            </span>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase">
          {actions}
        </div>
      )}
    </div>
  );
}
