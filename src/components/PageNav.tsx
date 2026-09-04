import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { NAV_LINKS, PROFILE } from '../data/profile';

/**
 * The bar at the top of a sub-page. The hero has its own nav, so this only
 * shows up on case studies and service pages, where the useful thing is a way
 * back rather than a way further in.
 *
 * It stays with you down the page. At the very top it is invisible chrome over
 * the hero; once you scroll it earns a frosted ground so the title marquee and
 * the white sections don't run underneath unreadably.
 */
export default function PageNav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame: number | null = null;

    const update = () => {
      frame = null;
      el.classList.toggle('page-nav-solid', window.scrollY > 24);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      ref={ref}
      className="page-nav sticky top-0 z-40 flex items-center justify-between gap-4 px-5 py-4
        sm:px-8 sm:py-5 md:px-10"
    >
      {/* The mark, not a back arrow. On a phone this is the only thing in the
          bar, and a logo that goes home reads as the site's identity — an arrow
          reads as "you are lost". */}
      <Link
        to="/"
        className="group inline-flex items-center gap-2.5 text-sm font-medium uppercase
          tracking-wider text-[#D7E2EA] transition-all duration-300 hover:text-[#C86BFF]
          md:text-base"
      >
        <Logo
          size={32}
          className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
        />
        {PROFILE.fullName}
      </Link>

      {/* Four links and a name don't fit across a phone, and the back link
          already covers the only navigation that matters here. */}
      <ul className="hidden items-center gap-4 sm:flex sm:gap-6">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="nav-link text-xs font-medium uppercase tracking-wider text-[#D7E2EA]
                opacity-70 transition-all duration-300 hover:opacity-100 hover:text-[#C86BFF] sm:text-sm md:text-base"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
