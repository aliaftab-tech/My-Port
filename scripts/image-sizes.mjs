// Generates the narrow variants of every project screenshot, so a phone stops
// downloading desktop-sized pixels.
//
// Measured before this existed: the home page pulled 599 kB of images, and the
// number was identical at 390px and at 1440px — a phone on mobile data was
// fetching 1440px-wide captures to paint them into a 234px box. That is the
// exact failure the site's own SEO & Performance page sells against.
//
// Run it after `npm run shots`, or on its own any time the source WebPs change:
//
//   node scripts/make-image-sizes.mjs
//
// Variants are written beside the original as `<name>-<width>.webp`. The
// original stays the largest source and remains the `src`, so an unmodified
// browser and any crawler that ignores srcset still get a working image.
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = fileURLToPath(new URL('../public/projects/', import.meta.url));

/**
 * The widths worth having, given how these are actually painted: a phone tile
 * lands around 80–140 CSS px, a marquee tile 300–420, and the case-study hero
 * runs to about 900. Doubling for high-DPI screens is what sets the ceiling.
 */
export const WIDTHS = [320, 640, 1024];

/** `foo.webp` at 640 becomes `foo-640.webp`. Kept here so the app can rebuild
 *  the same names without importing sharp. */
export const variantName = (src, width) => src.replace(/\.webp$/, `-${width}.webp`);

const isVariant = (file) => /-\d+\.webp$/.test(file);

const files = (await readdir(DIR)).filter((f) => f.endsWith('.webp') && !isVariant(f));

let written = 0;
let bytes = 0;

for (const file of files) {
  const src = join(DIR, file);
  const { width: intrinsic } = await sharp(src).metadata();

  for (const width of WIDTHS) {
    // No point upscaling, and no point writing a "smaller" copy that is within
    // a hair of the original.
    if (width >= intrinsic * 0.9) continue;

    const out = join(DIR, variantName(file, width));
    await sharp(src).resize({ width }).webp({ quality: 80, effort: 5 }).toFile(out);
    bytes += (await stat(out)).size;
    written++;
    console.log(`${file} -> ${variantName(file, width)} (${width}px)`);
  }
}

console.log(`\n${written} variants, ${(bytes / 1024).toFixed(0)} kB total`);
