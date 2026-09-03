import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { metaForPath, renderHead } from './lib/seo';

/**
 * Build-time only. scripts/prerender.mjs calls this once per route and writes
 * the result into dist/, so every URL on the site serves real HTML instead of
 * an empty <div id="root">.
 *
 * The markup this produces is the *pre-animation* state — Framer Motion's
 * `initial` styles are baked in, which means an element can arrive at
 * opacity 0 and animate up once React hydrates. That's deliberate: the text is
 * in the HTML for anything reading it, and a visitor sees the animation
 * exactly as they would have without prerendering, with no flash of a
 * differently-laid-out page.
 */
// Fast refresh never touches this file — it's only ever imported by a build
// script in Node — so the "components only" rule doesn't apply here.
// oxlint-disable-next-line react/only-export-components
export function render(path: string): { html: string; head: string } {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>
  );

  return { html, head: renderHead(metaForPath(path)) };
}

export { ALL_PATHS, SITE } from './lib/seo';
