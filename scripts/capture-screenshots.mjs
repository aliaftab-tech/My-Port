// Retakes every project screenshot by driving headless Chrome over the
// DevTools protocol. Going through CDP rather than `chrome --screenshot` buys
// two things: launch popups and cookie walls can be dismissed before the shot,
// and the page can be scrolled so the second frame isn't another crop of the
// same hero.
//
//   npm run shots            capture the live sites
//   npm run shots -- --local capture from `npm run serve:local` instead
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { LOCAL_SITES } from './serve-local.mjs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = fileURLToPath(new URL('../public/projects/', import.meta.url));
const PROFILE = fileURLToPath(new URL('../node_modules/.cache/shot-profile/', import.meta.url));
const PORT = 9333;

const LOCAL = process.argv.includes('--local');

mkdirSync(OUT, { recursive: true });

const LIVE_TARGETS = [
  { slug: 'athenaeum', url: 'https://athenaeumacademy.com/' },
  { slug: 'speaklab', url: 'https://www.speaklabbyshayan.com/' },
  { slug: 'noxesol', url: 'file:///D:/Noxesol/index.html' },
  // { slug: 'zord', url: 'https://zordpakistan.shop/' }, // site currently renders blank
];

const TARGETS = LOCAL
  ? LOCAL_SITES.map((s) => ({ slug: s.slug, url: `http://127.0.0.1:${s.port}/` }))
  : LIVE_TARGETS;

const SHOTS = [
  { tag: 'wide', width: 1440, height: 900, scroll: 0 },
  { tag: 'mid', width: 1440, height: 900, scroll: 1.15 }, // ~1 viewport down
  { tag: 'phone', width: 430, height: 880, scroll: 0 },
];

// Clears launch popups, cookie walls and other full-screen overlays. Only
// `fixed` elements are removed — absolutely positioned ones are usually real
// page content (hero carousel slides, for one).
const DISMISS = `
(() => {
  document.querySelectorAll(
    '[class*="close" i],[id*="close" i],[aria-label*="close" i],[class*="dismiss" i]'
  ).forEach(el => { try { el.click(); } catch (e) {} });

  document.querySelectorAll('body *').forEach(el => {
    const s = getComputedStyle(el);
    if (s.position !== 'fixed') return;
    if (!(parseInt(s.zIndex, 10) >= 900)) return;
    const r = el.getBoundingClientRect();
    // Big enough to be an overlay, not a sticky header or chat bubble.
    if (r.width > innerWidth * 0.5 && r.height > innerHeight * 0.4) el.remove();
  });

  document.querySelectorAll('[class*="backdrop" i],[class*="overlay" i]').forEach(el => {
    if (getComputedStyle(el).position !== 'fixed') return;
    const r = el.getBoundingClientRect();
    if (r.width > innerWidth * 0.8 && r.height > innerHeight * 0.8) el.remove();
  });
  document.body.style.overflow = 'auto';
  return true;
})()
`;

// Scrolling to a bare multiple of the viewport lands wherever it lands, which
// usually means the frame opens halfway through a heading. Instead, aim for
// that depth and then snap to the nearest section start below the fold, so the
// shot begins at a real edge in the design.
const snapScroll = (factor) => `
(() => {
  const target = innerHeight * ${factor};
  const candidates = document.querySelectorAll('section, [class*="section" i], main > div, h2');

  let best = target;
  let bestDistance = Infinity;

  for (const el of candidates) {
    const top = el.getBoundingClientRect().top + scrollY;
    if (top < innerHeight * 0.5) continue;   // still inside the hero
    const distance = Math.abs(top - target);
    // Only snap to something reasonably near the depth we asked for.
    if (distance < bestDistance && distance < innerHeight * 0.75) {
      bestDistance = distance;
      best = top;
    }
  }

  scrollTo(0, Math.max(0, Math.round(best) - 24)); // a little air above the edge
  return true;
})()
`;

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-sandbox',
  '--no-first-run',
  '--no-default-browser-check',
  '--allow-file-access-from-files',
  '--force-device-scale-factor=1',
  `--user-data-dir=${PROFILE}`,
  `--remote-debugging-port=${PORT}`,
  'about:blank',
]);

let msgId = 0;
function send(ws, method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.id !== id) return;
      ws.removeEventListener('message', onMsg);
      if (data.error) reject(new Error(`${method}: ${data.error.message}`));
      else resolve(data.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  for (let i = 0; i < 40; i++) {
    try {
      await fetch(`http://127.0.0.1:${PORT}/json/version`);
      break;
    } catch {
      await sleep(250);
    }
  }

  for (const t of TARGETS) {
    for (const s of SHOTS) {
      const name = `${t.slug}-${s.tag}.png`;
      try {
        const created = await (
          await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })
        ).json();

        const pages = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
        const page = pages.find((p) => p.id === created.id);
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((r) => ws.addEventListener('open', r, { once: true }));

        await send(ws, 'Page.enable');
        await send(ws, 'Runtime.enable');
        await send(ws, 'Emulation.setDeviceMetricsOverride', {
          width: s.width,
          height: s.height,
          deviceScaleFactor: 1,
          mobile: s.width < 600,
        });

        await send(ws, 'Page.navigate', { url: t.url });
        await sleep(7000); // let fonts, images and entrance animations settle

        await send(ws, 'Runtime.evaluate', { expression: DISMISS });
        await sleep(600);

        if (s.scroll > 0) {
          await send(ws, 'Runtime.evaluate', { expression: snapScroll(s.scroll) });
          await sleep(2500); // scroll-triggered content needs a beat to appear
        }

        const { data } = await send(ws, 'Page.captureScreenshot', { format: 'png' });
        writeFileSync(OUT + name, Buffer.from(data, 'base64'));
        console.log(`OK   ${name}`);

        ws.close();
        await fetch(`http://127.0.0.1:${PORT}/json/close/${created.id}`);
      } catch (err) {
        console.log(`FAIL ${name} — ${err.message}`);
      }
    }
  }

  chrome.kill();
  console.log('\nCaptured as PNG. Run `node scripts/optimise-shots.mjs` to convert to WebP.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  chrome.kill();
  process.exit(1);
});
