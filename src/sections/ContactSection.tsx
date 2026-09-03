import { Mail, MessageCircle, MapPin, type LucideProps } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { CONTACT, PROFILE } from '../data/profile';

// Lucide dropped brand marks in v1, so these two are inlined. Same call
// signature as a Lucide icon so they drop into the list below unchanged.
function GithubIcon({ size = 24 }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 24 }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const socials = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    href: CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}` : '',
  },
  { key: 'github', label: 'GitHub', icon: GithubIcon, href: CONTACT.github },
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, href: CONTACT.linkedin },
].filter((s) => s.href);

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="flex flex-col items-center gap-10 px-5 py-24 sm:gap-14 sm:px-8 sm:py-32 md:px-10 md:py-40"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Let&apos;s talk
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <p
          className="max-w-[520px] text-center font-light uppercase leading-snug tracking-wide text-[#D7E2EA] opacity-70"
          style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)' }}
        >
          Got a site, an app, or a pile of WhatsApp messages you&apos;d rather automate? Tell me
          what you&apos;re building and I&apos;ll tell you what it takes.
        </p>
      </FadeIn>

      <FadeIn delay={0.3} y={20}>
        <a
          href={`mailto:${CONTACT.email}`}
          // `leading-none` makes the line box exactly the font size, which on a
          // phone is 20px — under the tap-target minimum for the single most
          // important link on the site. Padded and pulled back so it sits where
          // it did.
          className="hero-heading -my-1.5 inline-flex items-center gap-3 break-all py-1.5
            font-black leading-none tracking-tight transition-opacity duration-200
            hover:opacity-70"
          style={{ fontSize: 'clamp(1.25rem, 5vw, 3.5rem)' }}
        >
          <Mail
            className="hidden shrink-0 text-[#BBCCD7] sm:block"
            size={40}
            strokeWidth={2}
            aria-hidden="true"
          />
          {CONTACT.email}
        </a>
      </FadeIn>

      {socials.length > 0 && (
        <FadeIn delay={0.4} y={20}>
          <ul className="flex items-center gap-4">
            {socials.map(({ key, label, icon: Icon, href }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2
                    border-[#D7E2EA] text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10"
                >
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      )}

      <FadeIn delay={0.5} y={20}>
        <p className="flex items-center gap-2 text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50 sm:text-sm">
          <MapPin size={16} strokeWidth={2} aria-hidden="true" />
          {PROFILE.location}
        </p>
      </FadeIn>
    </section>
  );
}
