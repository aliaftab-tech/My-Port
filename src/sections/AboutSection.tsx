import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import Orb from '../components/Orb';
import { PROFILE } from '../data/profile';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden
        px-5 py-20 sm:px-8 md:px-10"
    >
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
        <Orb
          kind="chrome"
          className="left-[1%] top-[4%] h-[120px] w-[120px] sm:left-[2%] sm:h-[160px] sm:w-[160px]
            md:left-[4%] md:h-[210px] md:w-[210px]"
        />
      </FadeIn>

      <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
        <Orb
          kind="outline"
          className="bottom-[8%] left-[3%] h-[100px] w-[100px] sm:left-[6%] sm:h-[140px] sm:w-[140px]
            md:left-[10%] md:h-[180px] md:w-[180px]"
        />
      </FadeIn>

      <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
        <Orb
          kind="violet"
          className="right-[1%] top-[4%] h-[120px] w-[120px] sm:right-[2%] sm:h-[160px] sm:w-[160px]
            md:right-[4%] md:h-[210px] md:w-[210px]"
        />
      </FadeIn>

      <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
        <Orb
          kind="ember"
          className="bottom-[8%] right-[3%] h-[130px] w-[130px] sm:right-[6%] sm:h-[170px]
            sm:w-[170px] md:right-[10%] md:h-[220px] md:w-[220px]"
        />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn
            as="h2"
            delay={0}
            y={40}
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </FadeIn>

          <AnimatedText
            text={PROFILE.about}
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        <FadeIn delay={0.1} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
