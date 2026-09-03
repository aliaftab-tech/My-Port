import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PROFILE } from '../data/profile';

/**
 * The curtain over the first paint of the session.
 *
 * It is rendered into the prerendered HTML rather than added on mount, because
 * a preloader that appears *after* hydration is worse than none at all — the
 * page flashes, then gets covered up. Shipping it in the markup means the very
 * first frame the browser paints is already the curtain.
 *
 * The intro animation is entirely CSS and this component knows nothing about
 * it. What it owns is the exit, and the reason that split exists is written
 * where the animation lives, at the top of src/index.css: the intro has to run
 * on the first-paint clock, and the exit has to wait for React. This is the
 * piece that reconciles the two.
 *
 * The other half of the once-per-session behaviour is in index.html — a
 * blocking inline script that sets `data-preloaded` on <html>, so CSS can hide
 * the curtain before the first paint rather than after hydration.
 */

/**
 * When the CSS intro has finished, in ms on its own clock. Keep in step with
 * the longest animation in the `.preloader` block of index.css — currently the
 * last letter, at a 0.56s delay plus a 0.7s duration.
 */
const INTRO_MS = 1300;

/** Long enough for `preloader-inner-out` and `preloader-lift` to both finish. */
const EXIT_MS = 700;

/** Seconds before the first letter moves, then the gap between one and the next. */
const LETTER_START = 0.24;
const LETTER_STEP = 0.04;

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'leaving' | 'gone'>('idle');

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('aa:preloaded') !== null;
      sessionStorage.setItem('aa:preloaded', '1');
    } catch {
      // Private browsing, or storage disabled. Showing the curtain once per
      // page load rather than once per session is a worse experience, not a
      // broken one — so carry on instead of bailing out.
    }

    // Already seen this session: the inline script in index.html has had it
    // hidden since before the first paint, so there is nothing to wait for.
    if (seen) {
      setState('gone');
      return;
    }

    // How far the CSS intro has already got. Reaching mount before the intro
    // is over means waiting out the remainder; reaching it afterwards — which
    // is the normal case on a cold load — means leaving straight away, because
    // hydration was always the thing worth waiting for.
    let elapsed = 0;
    for (const animation of ref.current?.getAnimations({ subtree: true }) ?? []) {
      elapsed = Math.max(elapsed, Number(animation.currentTime) || 0);
    }
    const remaining = Math.max(0, INTRO_MS - elapsed);

    // One frame of slack on top. Effects run before the browser has painted
    // the entrance classes the reveal observer just added, and uncovering the
    // page a frame early shows it with those elements still at opacity 0.
    const lift = setTimeout(() => {
      requestAnimationFrame(() => setState('leaving'));
    }, remaining);

    const remove = setTimeout(() => setState('gone'), remaining + EXIT_MS);

    return () => {
      clearTimeout(lift);
      clearTimeout(remove);
    };
  }, []);

  if (state === 'gone') return null;

  // Split from the profile rather than hard-coded, so renaming `fullName`
  // cannot quietly leave the curtain spelling the old one.
  const letters = [...PROFILE.fullName];

  return (
    <div
      ref={ref}
      className="preloader"
      data-state={state}
      // Decoration over content that is already in the DOM and already
      // readable. Announcing it would make a screen reader wait on a loading
      // state that is not describing any real work.
      aria-hidden="true"
    >
      <div className="preloader-inner">
        <p className="preloader-eyebrow">Welcome to</p>

        {/*
          A div, not a heading: the real <h1> is in the page underneath, and a
          second one in the prerendered HTML hands every crawler two competing
          headings for the same document.

          The gradient is per letter rather than on the row for the same reason
          it is per word in WordReveal — `background-clip: text` on an ancestor
          of a transformed child paints unreliably.
        */}
        <div className="preloader-name">
          {letters.map((char, i) => (
            <span
              // Index is the identity here: a fixed string that never reorders,
              // with letters that repeat.
              key={i}
              style={
                {
                  '--letter-delay': `${(LETTER_START + i * LETTER_STEP).toFixed(3)}s`,
                } as CSSProperties
              }
            >
              {char}
            </span>
          ))}
        </div>

        <p className="preloader-role">
          {PROFILE.role} <span className="preloader-sep">·</span> {PROFILE.location}
        </p>

        <div className="preloader-bar" />
      </div>
    </div>
  );
}
