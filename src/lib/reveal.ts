/**
 * One IntersectionObserver for every entrance reveal on the page, rather than
 * one per element. Elements are revealed once and then dropped, so nothing
 * stays subscribed after it has done its job.
 *
 * Created lazily so importing this module doesn't touch `window` during the
 * build-time prerender.
 *
 * The animation itself is CSS — see `.reveal` and `.reveal-words` in
 * index.css. This file only decides *when* the class goes on.
 */
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('reveal-in');
        self.unobserve(entry.target);
      }
    },
    // Starts the reveal a little before the element's edge crosses the fold,
    // matching what the old `viewport={{ margin: '50px' }}` did.
    { rootMargin: '50px', threshold: 0 }
  );
  return observer;
}

/** Watches `el` and adds `.reveal-in` once. Returns an unsubscribe. */
export function observeReveal(el: Element): () => void {
  const io = getObserver();
  io.observe(el);
  return () => io.unobserve(el);
}
