/**
 * Responsive sources for the project screenshots.
 *
 * The captures are 1440px wide (430px for the phone views) and were being
 * served at that size to every visitor: measured on the home page, 599 kB of
 * images, and the same 599 kB at 390px as at 1440px. A phone on mobile data
 * was downloading desktop pixels to paint a 234px-wide tile.
 *
 * `scripts/make-image-sizes.mjs` writes the narrow copies; this builds the
 * `srcset` that points at them. The original stays the `src`, so a browser
 * that ignores srcset — or a crawler taking the plain attribute — still gets a
 * working image rather than a broken one.
 */

/** Must match `WIDTHS` in scripts/make-image-sizes.mjs. */
const WIDTHS = [320, 640, 1024];

/**
 * Intrinsic widths of the two kinds of capture, so a variant that was never
 * written — the script skips any width within a hair of the original — is
 * never referenced. A 404 in a srcset is silent: the browser just falls back,
 * and nobody finds out the optimisation is doing nothing.
 */
const INTRINSIC = { phone: 430, logo: 512, wide: 1440 } as const;

const intrinsicFor = (src: string) => {
  if (src.includes('-phone')) return INTRINSIC.phone;
  if (src.includes('-logo')) return INTRINSIC.logo;
  return INTRINSIC.wide;
};

/** `/projects/foo.webp` at 640 → `/projects/foo-640.webp`. */
const variant = (src: string, width: number) => src.replace(/\.webp$/, `-${width}.webp`);

export function srcSetFor(src: string): string | undefined {
  if (!src.endsWith('.webp')) return undefined;

  const intrinsic = intrinsicFor(src);
  const entries = WIDTHS.filter((w) => w < intrinsic * 0.9).map((w) => `${variant(src, w)} ${w}w`);

  if (entries.length === 0) return undefined;

  // The original closes the list at its own width, so a large display still
  // has something sharp to pick.
  return [...entries, `${src} ${intrinsic}w`].join(', ');
}

/**
 * `sizes` for each place these appear. Getting this wrong costs more than
 * omitting srcset entirely — the browser picks from `sizes` before layout, so
 * a default of `100vw` makes a phone choose the widest file for a tile a
 * quarter of the screen across.
 */
export const SIZES = {
  /**
   * Home-page scrolling band: fixed tile widths per breakpoint, so these are
   * exact rather than estimated. They mirror `TILE_WIDTH` in
   * src/sections/MarqueeSection.tsx — if a tile is resized there, it has to be
   * resized here in the same commit or the browser keeps choosing its file
   * from the old box.
   */
  marqueeWide: '(min-width: 768px) 420px, (min-width: 640px) 360px, 205px',
  marqueePhone: '(min-width: 768px) 136px, (min-width: 640px) 116px, 66px',
  marqueeLogo: '(min-width: 768px) 270px, (min-width: 640px) 230px, 130px',
  /**
   * Project card: a narrow left column holding the logo plate above the phone
   * capture, and the desktop capture taking the rest of the row. The column is
   * `clamp(88px, 16vw, 228px)` in ProjectsSection — the small-screen figure
   * here is deliberately above 16vw because the clamp's 88px floor is what
   * actually applies down there, and `sizes` can only speak in vw.
   */
  cardWide: '(min-width: 1024px) 850px, (min-width: 640px) 66vw, 58vw',
  cardPhone: '(min-width: 1024px) 228px, 24vw',
  /** Same column as the phone tile, so the same box. */
  cardLogo: '(min-width: 1024px) 228px, 24vw',
  /** Case study: full content width, capped by the 5xl container. */
  caseStudyHero: '(min-width: 1024px) 1024px, 100vw',
  caseStudyMid: '(min-width: 1024px) 740px, 70vw',
  caseStudyPhone: '(min-width: 1024px) 260px, 26vw',
} as const;
