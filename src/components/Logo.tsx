/**
 * The site's mark — the same "A" as `public/favicon.svg`.
 *
 * Inlined rather than loaded as an image, for two reasons: it's in the
 * prerendered HTML, so it paints with the first frame instead of after a round
 * trip, and it inherits the page's own gradient rather than a flat copy of it.
 *
 * The gradient's `id` is global to the document, so if this ever renders twice
 * on one page both instances resolve to the first definition — which is fine
 * while they're the same gradient, and something to remember if they stop being.
 */
export default function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Ali Aftab"
      className={className}
    >
      <defs>
        <linearGradient id="logo-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B600A8" />
          <stop offset="55%" stopColor="#7621B0" />
          <stop offset="100%" stopColor="#BE4C00" />
        </linearGradient>
      </defs>

      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="14"
        fill="#0C0C0C"
        stroke="rgba(215, 226, 234, 0.18)"
        strokeWidth="2"
      />
      <path
        d="M14 48 L32 15 L50 48 L42.5 48 L32 29 L21.5 48 Z M24.5 40 H39.5 L42 44.5 H22 Z"
        fill="url(#logo-mark)"
      />
    </svg>
  );
}
