import { useState } from 'react';
import { MessageCircle, type LucideProps } from 'lucide-react';
import { CONTACT, PROFILE } from '../data/profile';
import SpotlightCard from './SpotlightCard';

export function GithubIcon({ size = 24 }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 24 }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export const socials = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    href: CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}` : '',
  },
  { key: 'github', label: 'GitHub', icon: GithubIcon, href: CONTACT.github },
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, href: CONTACT.linkedin },
].filter((s) => s.href);

export function LinkedInHoverIcon({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li className="relative">
      <SpotlightCard
        className={`pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2
          w-56 -translate-x-1/2 rounded-2xl
          bg-[#0C0C0C]/90 px-4 py-3.5 backdrop-blur-md
          transition-all duration-300
          ${hovered ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
      >
        <div className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45
          border-b border-r border-[#D7E2EA]/10 bg-[#0C0C0C]/90" />

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3"
          tabIndex={hovered ? 0 : -1}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
            border border-[#C86BFF]/40 bg-[#C86BFF]/10 text-sm font-semibold text-[#D7E2EA]">
            AA
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-[#D7E2EA]">{PROFILE.fullName}</p>
            <p className="mt-0.5 truncate text-[10px] font-light text-[#D7E2EA]/50">
              {PROFILE.role}
            </p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full
              bg-[#C86BFF]/20 px-2 py-0.5 text-[10px] font-medium text-[#C86BFF]">
              <LinkedinIcon size={10} />
              View Profile
            </span>
          </div>
        </a>
      </SpotlightCard>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2
          transition-all duration-300
          ${hovered
            ? 'border-[#C86BFF] bg-[#C86BFF]/15 text-[#C86BFF]'
            : 'border-[#D7E2EA] text-[#D7E2EA] hover:bg-[#D7E2EA]/10'
          }`}
      >
        <LinkedinIcon size={20} />
      </a>
    </li>
  );
}

export function SocialLinksList() {
  if (socials.length === 0) return null;
  return (
    <ul className="flex items-center gap-4">
      {socials.map(({ key, label, icon: Icon, href }) => {
        if (key === 'linkedin' && CONTACT.linkedin) {
          return <LinkedInHoverIcon key={key} href={href} />;
        }
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2
                border-[#D7E2EA] text-[#D7E2EA] transition-all duration-300
                hover:border-[#C86BFF] hover:bg-[#C86BFF]/15 hover:text-[#C86BFF]"
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
