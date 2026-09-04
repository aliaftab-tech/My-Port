import { NAV_LINKS, PROFILE, CONTACT } from '../data/profile';

/* ─── tiny LinkedIn icon ─────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[#D7E2EA]/10 px-5 pt-10 pb-8 sm:px-8 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* ── LinkedIn card ──────────────────────────────────────── */}
        {CONTACT.linkedin && (
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-[#D7E2EA]/10
              bg-white/[0.03] px-5 py-4 backdrop-blur-sm
              transition-all duration-300
              hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/[0.06]
              sm:px-6"
            aria-label="View Ali Aftab on LinkedIn"
          >
            {/* Avatar placeholder — initials */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                border border-[#D7E2EA]/15 bg-white/5 text-sm font-semibold
                text-[#D7E2EA]/70 transition-colors duration-300
                group-hover:border-[#0A66C2]/60 group-hover:text-[#D7E2EA]"
            >
              AA
            </div>

            {/* Name + tagline */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#D7E2EA]/80 transition-colors duration-300 group-hover:text-[#D7E2EA]">
                {PROFILE.fullName}
              </p>
              <p className="mt-0.5 truncate text-xs font-light text-[#D7E2EA]/40 transition-colors duration-300 group-hover:text-[#D7E2EA]/60">
                {PROFILE.role} · Connect on LinkedIn
              </p>
            </div>

            {/* LinkedIn badge */}
            <span
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#0A66C2]/30
                bg-[#0A66C2]/10 px-3 py-1.5 text-xs font-medium text-[#0A66C2]/80
                transition-all duration-300
                group-hover:border-[#0A66C2]/60 group-hover:bg-[#0A66C2]/20 group-hover:text-[#4B9BFF]"
            >
              <LinkedInIcon />
              LinkedIn
            </span>
          </a>
        )}

        {/* ── copyright + nav ─────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
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

      </div>
    </footer>
  );
}

