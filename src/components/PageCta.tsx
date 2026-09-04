import { Mail, MapPin } from 'lucide-react';
import FadeIn from './FadeIn';
import { CONTACT, PROFILE } from '../data/profile';
import { SocialLinksList } from './SocialLinks';

/**
 * The close on every sub-page. One line, one address — the same ask the home
 * page makes, so nobody has to scroll back to find out how to get in touch.
 */
export default function PageCta({ line }: { line: string }) {
  return (
    <section className="border-t border-[#D7E2EA]/10 px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <FadeIn
          as="h2"
          y={30}
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}
        >
          Let&apos;s talk
        </FadeIn>

        <FadeIn delay={0.1} y={20}>
          <p
            className="max-w-[540px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] opacity-70"
            style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.1rem)' }}
          >
            {line}
          </p>
        </FadeIn>

        <FadeIn delay={0.2} y={20}>
          <a
            href={`mailto:${CONTACT.email}`}
            // `leading-none` gives the line box the font's own height, which
            // on a phone leaves an 18px-tall target on the closing call to
            // action of every sub-page. Padded for the thumb, pulled back so
            // the block sits where it did.
            className="hero-heading -my-1.5 inline-flex items-center gap-3 break-all py-1.5
              font-black leading-none tracking-tight transition-all duration-300
              hover:text-[#C86BFF] hover:opacity-100"
            style={{ fontSize: 'clamp(1.1rem, 4vw, 2.5rem)' }}
          >
            <Mail
              className="hidden shrink-0 text-[#BBCCD7] sm:block"
              size={32}
              strokeWidth={2}
              aria-hidden="true"
            />
            {CONTACT.email}
          </a>
        </FadeIn>

        <FadeIn delay={0.3} y={20}>
          <SocialLinksList />
        </FadeIn>

        <FadeIn delay={0.4} y={20}>
          <p className="flex items-center gap-2 text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50 sm:text-sm">
            <MapPin size={16} strokeWidth={2} aria-hidden="true" />
            {PROFILE.location}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
