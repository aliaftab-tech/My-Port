import { Mail, MapPin } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { CONTACT, PROFILE } from '../data/profile';


import { SocialLinksList } from '../components/SocialLinks';

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
            font-black leading-none tracking-tight transition-all duration-300
            hover:text-[#C86BFF] hover:opacity-100"
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

      <FadeIn delay={0.4} y={20}>
        <SocialLinksList />
      </FadeIn>

      <FadeIn delay={0.5} y={20}>
        <p className="flex items-center gap-2 text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50 sm:text-sm">
          <MapPin size={16} strokeWidth={2} aria-hidden="true" />
          {PROFILE.location}
        </p>
      </FadeIn>
    </section>
  );
}

