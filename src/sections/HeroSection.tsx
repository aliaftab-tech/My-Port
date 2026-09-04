import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';
import AskAiButton from '../components/AskAiButton';
import HeroPortrait from '../components/HeroPortrait';
import { NAV_LINKS, PROFILE } from '../data/profile';

export default function HeroSection() {
  return (
    <header className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} className="relative z-30">
        {/* Six links don't fit across a phone in one row, so they wrap there
            and spread out from `sm` up, where they do. */}
        <ul
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 pt-6
            sm:justify-between sm:gap-x-2 md:px-10 md:pt-8"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {/* Padded for the thumb, pulled back so the row sits where it
                  did. 14px uppercase gave a 21px-tall target on a phone. */}
              <a
                href={link.href}
                className="-my-1 inline-block py-1 text-sm font-medium uppercase tracking-wider
                  text-[#D7E2EA] transition-all duration-300 hover:opacity-100 hover:text-[#C86BFF] md:text-lg
                  lg:text-[1.4rem]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <div className="relative z-0 overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[14vw]
            font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[15vw]
            md:-mt-5 md:text-[16vw] lg:text-[17.5vw]"
        >
          Hi, i&apos;m {PROFILE.firstName}
        </FadeIn>
      </div>

      <HeroPortrait />

      {/* Absolute so it always sits above the portrait, whatever height that is. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6
        pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide
              text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            {PROFILE.heroLine}
          </p>
        </FadeIn>

        {/* Stacked, so the pair still fits beside the hero line on a phone. */}
        <FadeIn delay={0.5} y={20} className="flex flex-col items-end gap-2.5">
          <AskAiButton />
          <ContactButton />
        </FadeIn>
      </div>
    </header>
  );
}
