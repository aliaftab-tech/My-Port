import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyHead, metaForPath } from '../lib/seo';

/**
 * Keeps the document head in step with the route during client-side
 * navigation, and puts the reader back at the top of a new page.
 *
 * The head each page *ships* with is written into the HTML at build time by
 * scripts/prerender.mjs — this only covers what happens after a link is
 * clicked, so a crawler never depends on it.
 */
export default function RouteHead() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    applyHead(metaForPath(pathname));
  }, [pathname]);

  useEffect(() => {
    // A hash means the reader asked for a section, so leave the scroll alone.
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
