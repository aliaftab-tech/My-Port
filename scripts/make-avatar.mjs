// Builds the hero avatar at public/me.webp.
//
//   npm run avatar -- <path-to-image>
//
// Two modes, picked automatically from the source:
//
//   cutout  — the image already has a transparent background (e.g. a 3D avatar
//             run through remove.bg). Trimmed, resized and compressed as-is.
//   photo   — an ordinary opaque photo. Cropped square around the face,
//             feathered to a circle, and vignetted into #0C0C0C so the face
//             reads as emerging from the dark rather than pasted onto it.
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = process.argv[2];
if (!SOURCE) {
  console.error('usage: npm run avatar -- <path-to-image>');
  process.exit(1);
}

const OUT = fileURLToPath(new URL('../public/me.webp', import.meta.url));
const SIZE = 900;

// Photo mode only. cx/cy are the crop centre as a fraction of the source,
// scale is the crop width as a fraction of the shorter side.
const FRAME = { cx: 0.53, cy: 0.44, scale: 1.0 };

const meta = await sharp(SOURCE).metadata();

// A source with an alpha channel that actually varies is already a cutout.
const stats = await sharp(SOURCE).stats();
const alpha = stats.channels[3];
const isCutout = Boolean(meta.hasAlpha) && alpha && alpha.min < 8;

if (isCutout) {
  await sharp(SOURCE)
    .rotate()
    .trim({ threshold: 1 }) // drop any empty transparent border
    .resize({ width: SIZE, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(OUT);
} else {
  const side = Math.round(Math.min(meta.width, meta.height) * FRAME.scale);
  const left = Math.max(0, Math.min(meta.width - side, Math.round(meta.width * FRAME.cx - side / 2)));
  const top = Math.max(0, Math.min(meta.height - side, Math.round(meta.height * FRAME.cy - side / 2)));

  // Sinks the outer ring into the page colour.
  const vignette = Buffer.from(`
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="vig">
      <stop offset="52%" stop-color="#0C0C0C" stop-opacity="0"/>
      <stop offset="80%" stop-color="#0C0C0C" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0C0C0C" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#vig)"/>
</svg>`);

  // Opaque to 93%, then feathered so there's no aliased rim on the dark page.
  const mask = Buffer.from(`
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="fade">
      <stop offset="0%"  stop-color="#fff" stop-opacity="1"/>
      <stop offset="93%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="url(#fade)"/>
</svg>`);

  await sharp(SOURCE)
    .rotate()
    .extract({ left, top, width: side, height: side })
    .resize(SIZE, SIZE, { fit: 'cover' })
    .modulate({ saturation: 0.9, brightness: 1.18 })
    .linear(1.1, -4)
    .composite([
      { input: vignette, blend: 'over' },
      { input: mask, blend: 'dest-in' },
    ])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(OUT);
}

const out = await sharp(OUT).metadata();
const { size } = await stat(OUT);
console.log(`mode:   ${isCutout ? 'cutout (transparent source)' : 'photo (circular crop)'}`);
console.log(`source: ${meta.width}x${meta.height}`);
console.log(`wrote:  public/me.webp — ${out.width}x${out.height}, ${Math.round(size / 1024)} KB`);

if (out.width < 800) {
  console.log('\nNote: under 800px wide, so it will look soft on a high-DPI');
  console.log('screen. A larger source image is worth re-exporting if you have one.');
}
