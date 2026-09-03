// Converts the captured PNG screenshots to WebP. The raw PNGs are ~5 MB in
// total, which is far too much to ship on a landing page; WebP at q80 gets the
// whole set under a megabyte with no visible difference at tile size.
import { readdir, unlink, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = fileURLToPath(new URL('../public/projects/', import.meta.url));

const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'));
let before = 0;
let after = 0;

for (const file of files) {
  const src = join(DIR, file);
  const out = src.replace(/\.png$/, '.webp');

  before += (await stat(src)).size;
  await sharp(src).webp({ quality: 80, effort: 5 }).toFile(out);
  after += (await stat(out)).size;
  await unlink(src);

  console.log(`${file} -> ${file.replace(/\.png$/, '.webp')}`);
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\n${files.length} files: ${mb(before)} MB -> ${mb(after)} MB`);
