// Turns the built SPA into real HTML, one file per route.
//
// Runs as the last step of `npm run build`:
//   vite build                    → dist/ with an empty <div id="root">
//   vite build --ssr …            → .ssr-build/entry-server.js
//   node scripts/prerender.mjs    → this, which fills that div in
//
// Why bother: Google will execute JavaScript to see a client-rendered page,
// eventually — but it costs indexing speed, and the AI crawlers that decide
// whether ChatGPT and Perplexity mention you mostly don't execute JavaScript
// at all. Without this step they see an empty page and nothing else.
//
// The sitemap is written here too, from the same route list the pages are
// generated from, so it can't drift out of date.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const entry = join(root, '.ssr-build', 'entry-server.js');

const { render, ALL_PATHS, SITE } = await import(pathToFileURL(entry).href);

const template = await readFile(join(dist, 'index.html'), 'utf8');

const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/;
const ROOT_DIV = '<div id="root"></div>';

if (!SEO_BLOCK.test(template)) {
  throw new Error('index.html has no <!--seo--> … <!--/seo--> block to replace');
}
if (!template.includes(ROOT_DIV)) {
  throw new Error(`index.html has no ${ROOT_DIV} to fill in`);
}

const today = new Date().toISOString().slice(0, 10);

for (const path of ALL_PATHS) {
  const { html, head } = render(path);

  // Function replacements, because `$&` and friends inside rendered markup
  // would otherwise be treated as substitution patterns.
  const page = template
    .replace(SEO_BLOCK, () => head)
    .replace(ROOT_DIV, () => `<div id="root">${html}</div>`);

  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page, 'utf8');
}

// Vercel serves dist/404.html for anything that doesn't match a real file, so
// a mistyped URL gets the site's own 404 page and a real 404 status — rather
// than index.html pretending every URL exists, which is how SPAs end up with
// hundreds of duplicate pages in Search Console.
{
  const { html, head } = render('/404');
  const page = template
    .replace(SEO_BLOCK, () => head)
    .replace(ROOT_DIV, () => `<div id="root">${html}</div>`);
  await writeFile(join(dist, '404.html'), page, 'utf8');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ALL_PATHS.map(
  (path) => `  <url>
    <loc>${SITE.url}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
).join('\n')}
</urlset>
`;

await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');

console.log(`prerendered ${ALL_PATHS.length} routes → dist/, sitemap written`);
