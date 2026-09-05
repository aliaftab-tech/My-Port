import { useEffect, useRef } from 'react';
import { MARQUEE_TILES, type MarqueeTile } from '../data/projects';
import { SIZES, srcSetFor } from '../lib/images';

const MARQUEE_SIZES = {
  wide: SIZES.marqueeWide,
  phone: SIZES.marqueePhone,
  logo: SIZES.marqueeLogo,
} as const;
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const SPLIT = Math.ceil(MARQUEE_TILES.length / 2);
const ROW_ONE = MARQUEE_TILES.slice(0, SPLIT);
const ROW_TWO = MARQUEE_TILES.slice(SPLIT);

// Row height is fixed; the width follows the capture's aspect ratio so nothing
// is scaled up. Landscape tiles are cropped a touch on the sides, portrait
// ones a touch at the bottom — neither is enlarged.
// Phone values are a straight ~32% reduction of what they were, both shapes
// scaled by the same factor so the crops stay identical — a 430px screen was
// showing about one and a half tiles of a band whose whole point is that it
// runs past you. `sm` and up are unchanged.
//
// These widths and the row height below are mirrored in `SIZES.marquee*` in
// src/lib/images.ts. Change one without the other and the browser picks its
// file from a box size that no longer exists.
const TILE_WIDTH = {
  wide: 'w-[205px] sm:w-[360px] md:w-[420px]',
  phone: 'w-[66px] sm:w-[116px] md:w-[136px]',
  // Square: the logo tiles are 512×512, and matching the row height exactly is
  // what keeps them reading as marks rather than as cropped pictures.
  logo: 'w-[130px] sm:w-[230px] md:w-[270px]',
} as const;

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let frame: number | null = null;

    // Measured once instead of every frame. Reading offsetTop mid-scroll
    // forces the browser to flush layout, and doing that on each frame while
    // other things are writing styles is how a scroll handler ends up costing
    // more than everything it's animating.
    let sectionTop = sectionRef.current?.offsetTop ?? 0;

    const update = () => {
      frame = null;
      const section = sectionRef.current;
      if (!section) return;

      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      const shift = offset - 200;

      if (rowOneRef.current) {
        rowOneRef.current.style.transform = `translateX(${shift}px)`;
      }
      if (rowTwoRef.current) {
        rowTwoRef.current.style.transform = `translateX(${-shift}px)`;
      }
    };

    // Coalesce scroll events into one write per frame so the transform never
    // fights the browser's own scrolling work.
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      sectionTop = sectionRef.current?.offsetTop ?? sectionTop;
      onScroll();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="flex flex-col gap-2 bg-[#0C0C0C] pb-8 pt-14 sm:gap-3 sm:pb-10 sm:pt-32 md:pt-40"
      style={{ overflowX: 'clip' }}
    >
      <Row innerRef={rowOneRef} images={ROW_ONE} />
      <Row innerRef={rowTwoRef} images={ROW_TWO} />
    </section>
  );
}

function Row({
  innerRef,
  images,
}: {
  innerRef: React.RefObject<HTMLDivElement | null>;
  images: MarqueeTile[];
}) {
  // Tripled so there is always more strip either side of the viewport.
  const tiles = [...images, ...images, ...images];

  return (
    <div className="flex w-max gap-2 sm:gap-3" ref={innerRef} style={{ willChange: 'transform' }}>
      {tiles.map((tile, i) => (
        <div
          key={`${tile.src}-${i}`}
          className={`h-[130px] shrink-0 overflow-hidden rounded-xl bg-white/5 sm:h-[230px]
            sm:rounded-2xl md:h-[270px] ${TILE_WIDTH[tile.shape]}`}
        >
          <img
            src={tile.src}
            srcSet={srcSetFor(tile.src)}
            sizes={MARQUEE_SIZES[tile.shape]}
            width={tile.shape === 'logo' ? 400 : 1200}
            height={tile.shape === 'logo' ? 400 : 900}
            alt={tile.alt}
            loading="lazy"
            decoding="async"
            // A logo is fitted, never cropped — the tile and the file are both
            // square, so `contain` costs nothing and survives either one being
            // resized later. Screenshots stay cropped from the top, which is
            // where a homepage keeps its navigation.
            className={
              tile.shape === 'logo'
                ? 'h-full w-full object-contain'
                : 'h-full w-full object-cover object-top'
            }
          />
        </div>
      ))}
    </div>
  );
}
