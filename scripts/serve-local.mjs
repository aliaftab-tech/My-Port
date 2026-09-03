// Minimal static server with SPA fallback. Used to screenshot projects from
// their already-built dist/ folder when the public domain isn't resolving.
// Run this, then: npm run shots -- --local
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

export const LOCAL_SITES = [
  { slug: 'nazir', root: 'D:\\paper web\\dist', port: 5051 },
  { slug: 'alielectronics', root: 'D:\\Haier Store\\frontend\\dist', port: 5052 },
];

function serve(root, port) {
  createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = join(root, normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));

    try {
      const s = await stat(file);
      if (s.isDirectory()) file = join(file, 'index.html');
    } catch {
      file = join(root, 'index.html'); // SPA fallback
    }

    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  }).listen(port, () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
}

for (const site of LOCAL_SITES) serve(site.root, site.port);
