// Serves dist/ the way a static host does.
//
//   npm run preview
//
// This replaced `vite preview`, which is actively misleading for this project:
// it falls back to the root index.html for any URL it doesn't recognise, so a
// prerendered page like /services/whatsapp-automation gets served the *home
// page's* HTML and then repaired by React on the client. That looks like a
// hydration bug in the console and hides whether prerendering worked at all.
//
// Here a URL maps to a real file, a directory maps to its index.html, and
// anything unmatched gets 404.html with an actual 404 status — which is what
// Vercel does with the built output.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = Number(process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

if (!existsSync(ROOT)) {
  console.error('no dist/ to serve — run `npm run build` first');
  process.exit(1);
}

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const target = normalize(join(ROOT, url));

  // Anything that resolves outside dist/ is a traversal attempt.
  if (!target.startsWith(normalize(ROOT))) {
    res.writeHead(403).end('forbidden');
    return;
  }

  let file = null;
  if (existsSync(target) && statSync(target).isFile()) file = target;
  else if (existsSync(join(target, 'index.html'))) file = join(target, 'index.html');
  else if (existsSync(`${target}.html`)) file = `${target}.html`;

  if (!file) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    createReadStream(join(ROOT, '404.html')).pipe(res);
    return;
  }

  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`dist/ served on http://localhost:${PORT}`);
});
