// Turns the client logos in assets-source/logos/ into the square brand tiles
// the home-page marquee shows between screenshots.
//
//   node scripts/make-logos.mjs
//
// Sources are whatever each client actually has — a 2048px render, a 512px
// mark, an apple-touch-icon — in whatever format, with or without
// transparency. What comes out is one consistent set: same square, same
// margin, same ground.
//
// **The ground is white on purpose.** Every screenshot in that strip is a
// light website UI, so a white logo tile sits in the row as another card
// rather than a hole in it. Dropping the logos straight onto the page's own
// #0C0C0C would also lose two of them outright — Noxesol's mark is dark navy
// and Nazir's is dark on light.
//
// Add a client by putting <slug>.<png|jpg|webp|svg> in assets-source/logos/
// and re-running. The slug has to match the one in src/data/projects.ts, and
// `LOGO_SLUGS` there has to list it, or the tile is skipped.
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SRC = fileURLToPath(new URL('../assets-source/logos/', import.meta.url));
const OUT = fileURLToPath(new URL('../public/projects/', import.meta.url));

/** Matches the tile the marquee paints and the intrinsic width images.ts assumes. */
const SIZE = 512;
/** Breathing room so a wordmark never touches the tile edge. */
const PAD = 62;

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f));
if (files.length === 0) {
  console.log('nothing in assets-source/logos/ — add <slug>.png and re-run');
}

for (const file of files) {
  const slug = basename(file, extname(file));
  const out = join(OUT, `${slug}-logo.webp`);

  const meta = await sharp(join(SRC, file)).metadata();

  // Trim first, then fit. Trimming afterwards would eat the padding we just
  // added; the sources arrive with wildly different amounts of their own
  // whitespace, and without this the marks come out at visibly different
  // sizes on the same row.
  let img = sharp(join(SRC, file));
  if (meta.hasAlpha) {
    // Trim on transparency, then put the mark on white — a logo drawn for a
    // light header is usually dark, and would disappear on the page ground.
    img = img.trim().flatten({ background: WHITE });
  } else {
    // Opaque source: trim against whatever it uses as its own background.
    img = img.trim({ background: WHITE, threshold: 12 });
  }

  await img
    .resize(SIZE - PAD * 2, SIZE - PAD * 2, { fit: 'contain', background: WHITE })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: WHITE })
    .webp({ quality: 88, effort: 5 })
    .toFile(out);

  const kb = Math.round((await stat(out)).size / 1024);
  console.log(`${file.padEnd(24)} -> ${slug}-logo.webp  ${SIZE}x${SIZE}  ${kb} kB`);
}

console.log(`\n${files.length} logo tiles. Run \`npm run image-sizes\` to build their variants.`);
