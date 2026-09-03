// Builds the social share card at public/og-image.png.
//
//   npm run og
//
// This is the image WhatsApp, LinkedIn, X, Slack and a fair few AI answer
// panels show when the site gets shared, so it carries the same three facts
// the page leads with: name, what he does, where he is.
//
// Text is drawn as SVG, which means it renders in whatever font the machine
// has — Kanit if it's installed, otherwise a system sans. The layout doesn't
// depend on the metrics, so a fallback font looks different but never broken.
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
const AVATAR = fileURLToPath(new URL('../public/me.webp', import.meta.url));

const W = 1200;
const H = 630;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const NAME = 'ALI AFTAB';
const ROLE = 'WEB DEVELOPER — LAHORE, PAKISTAN';
const LINES = ['Websites · Storefronts · Mobile apps', 'WhatsApp bots · AI call agents · SEO & GEO'];
const URL_LINE = 'aliaftab.dev';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141619"/>
      <stop offset="55%" stop-color="#0C0C0C"/>
      <stop offset="100%" stop-color="#0C0C0C"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8A929C"/>
      <stop offset="100%" stop-color="#D7E2EA"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#7621B0" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#7621B0" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ground)"/>
  <circle cx="960" cy="300" r="330" fill="url(#glow)"/>

  <g font-family="Kanit, 'Segoe UI', Arial, sans-serif">
    <text x="80" y="230" font-size="104" font-weight="800" letter-spacing="-2"
          fill="url(#chrome)">${esc(NAME)}</text>
    <text x="82" y="292" font-size="30" font-weight="400" letter-spacing="3"
          fill="#D7E2EA" opacity="0.75">${esc(ROLE)}</text>

    <rect x="82" y="330" width="120" height="2" fill="#D7E2EA" opacity="0.35"/>

    <text x="82" y="400" font-size="30" font-weight="300" fill="#D7E2EA" opacity="0.9">${esc(LINES[0])}</text>
    <text x="82" y="446" font-size="30" font-weight="300" fill="#D7E2EA" opacity="0.9">${esc(LINES[1])}</text>

    <text x="82" y="548" font-size="34" font-weight="600" letter-spacing="1"
          fill="#BBCCD7">${esc(URL_LINE)}</text>
  </g>
</svg>`;

// The avatar is a head-and-shoulders cutout, so it's anchored to the bottom
// edge on the right the same way the hero anchors it on the page.
const avatar = await sharp(AVATAR)
  .resize({ height: 560, fit: 'inside', withoutEnlargement: false })
  .png()
  .toBuffer();
const { width: aw = 0, height: ah = 0 } = await sharp(avatar).metadata();

await sharp(Buffer.from(svg))
  .composite([{ input: avatar, left: Math.round(W - aw - 40), top: Math.round(H - ah) }])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`og-image.png written — ${W}x${H}`);
