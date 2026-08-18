/**
 * One line icon per service, drawn rather than pulled from an icon set so
 * the stroke weight matches the rest of the brand and every glyph sits on
 * the same 24px grid.
 */
const PATHS: Record<string, React.ReactNode> = {
  "web-software-development": (
    <>
      <rect x="2" y="4" width="20" height="14" rx="1.5" />
      <path d="M2 8h20M8.5 12l-2 2 2 2M15.5 12l2 2-2 2M2 21h20" />
    </>
  ),
  "social-media-management": (
    <>
      <circle cx="8.5" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.4" />
      <path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2.5 1.6-4.6 3.9-5.2" />
    </>
  ),
  "ads-management": (
    <>
      <path d="M3 9v6h4l6 4V5L7 9H3Z" />
      <path d="M17 9.5a4 4 0 0 1 0 5M19.5 7a7.5 7.5 0 0 1 0 10" />
    </>
  ),
  "graphic-design": (
    <>
      <path d="M16.5 3.5 20.5 7.5 8 20H4v-4L16.5 3.5Z" />
      <path d="m14 6 4 4M4 20l4-4" />
    </>
  ),
  "growth-analytics": (
    <>
      <path d="M3 21V3M3 21h18" />
      <path d="m6 15 4-4 3.5 3.5L21 7" />
      <path d="M21 7h-4.5M21 7v4.5" />
    </>
  ),
  "maintenance-service": (
    <>
      <path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8.5 8.5a2.5 2.5 0 0 1-3.6-3.6l8.5-8.5Z" />
      <path d="M14.7 6.3 18 3l3 3-3.3 3.3" />
    </>
  ),
  "all-in-one-digital-marketing": (
    <>
      <path d="M12 2.5 14.4 9l6.6.3-5.2 4.1 1.8 6.4L12 16.2 6.4 19.8l1.8-6.4L3 9.3 9.6 9 12 2.5Z" />
    </>
  ),
};

export default function ServiceIcon({ id }: { id: string }) {
  const shape = PATHS[id];
  if (!shape) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-8 w-8"
    >
      {shape}
    </svg>
  );
}
