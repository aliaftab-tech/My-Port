import { NAV_LINKS, PROFILE } from '../data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-[#D7E2EA]/10 px-5 py-8 sm:px-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50">
          © {new Date().getFullYear()} {PROFILE.fullName} — {PROFILE.role}, {PROFILE.location}
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {/* The padding is the tap target and the negative margin gives
                  the spacing back, so the hit area clears 24px on a phone
                  without the footer looking any different. At 12px uppercase
                  these links were 18px tall — under the WCAG 2.2 minimum, and
                  genuinely fiddly with a thumb. */}
              <a
                href={link.href}
                className="-my-1.5 inline-block py-1.5 text-xs font-light uppercase tracking-widest
                  text-[#D7E2EA] opacity-50 transition-opacity duration-200 hover:opacity-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
