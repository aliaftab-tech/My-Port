/**
 * A slow-moving strip of the page's own title, borrowing the scrolling
 * screenshot band from the home page so a sub-page reads as part of the same
 * site rather than a document that happens to share a colour scheme.
 *
 * The movement is a CSS keyframe animation on `transform`, so it runs on the
 * compositor and costs the main thread nothing while you scroll past it.
 */
export default function TitleMarquee({ text }: { text: string }) {
  // Two identical halves, each translated by exactly -50% over one cycle, so
  // the seam lands where the second copy starts and the loop is invisible.
  const run = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="shrink-0 px-4 sm:px-10">
      {text}
    </span>
  ));

  return (
    <div
      aria-hidden="true"
      className="relative flex overflow-hidden border-y border-[#D7E2EA]/10 py-5 sm:py-7"
    >
      <div className="title-marquee flex w-max items-center">
        <div className="flex shrink-0 items-center">{run}</div>
        <div className="flex shrink-0 items-center">{run}</div>
      </div>

      {/* Fades the strip into the page ground at both ends. Narrow on phones
          on purpose: at the desktop width these cover half a 390px screen
          between them, which washes the band out rather than framing it. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-40"
        style={{ background: 'linear-gradient(90deg, #0C0C0C, transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-40"
        style={{ background: 'linear-gradient(270deg, #0C0C0C, transparent)' }}
      />
    </div>
  );
}
