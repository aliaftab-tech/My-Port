import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import Orb from '../components/Orb';
import PageNav from '../components/PageNav';
import PageCta from '../components/PageCta';
import ScrollProgress from '../components/ScrollProgress';
import SpotlightCard from '../components/SpotlightCard';
import StickyCta from '../components/StickyCta';
import TitleMarquee from '../components/TitleMarquee';
import WordReveal from '../components/WordReveal';
import { SERVICES, SERVICE_BY_SLUG } from '../data/services';
import { PROFILE } from '../data/profile';

export default function ServicePage() {
  const { slug } = useParams();
  const service = slug ? SERVICE_BY_SLUG.get(slug) : undefined;

  if (!service) return <Navigate to="/" replace />;

  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <article>
      <ScrollProgress />
      <PageNav />

      {/*
        `overflow-clip` rather than `overflow-hidden`: hidden would make this
        header a scroll container, and the `view()` timelines on the parallax
        decoration inside would then measure against a box that never scrolls
        and sit frozen. Clip crops the same way without that side effect.
      */}
      <header className="relative overflow-clip px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 md:px-10 md:pb-24">
        {/* Kept clear of the nav bar and dimmed well down — this is depth
            behind the title, not a light source competing with it. */}
        <Orb
          kind="violet"
          className="parallax -right-20 top-[18%] h-[200px] w-[200px] opacity-35 blur-[1px]
            sm:right-[-4%] sm:h-[260px] sm:w-[260px] md:h-[320px] md:w-[320px]"
          style={{ '--parallax-from': '-70px', '--parallax-to': '70px' } as CSSProperties}
        />
        <Orb
          kind="chrome"
          className="parallax -left-24 bottom-[4%] h-[150px] w-[150px] opacity-30 sm:left-[-6%]
            sm:h-[210px] sm:w-[210px]"
          style={{ '--parallax-from': '40px', '--parallax-to': '-40px' } as CSSProperties}
        />

        {/* The service's index, blown up and pushed behind the title. Purely
            decorative — the same number is announced in the eyebrow below. */}
        <span
          aria-hidden="true"
          className="parallax pointer-events-none absolute -top-4 right-4 select-none font-black
            leading-none text-[#D7E2EA] opacity-[0.04] sm:right-10 md:top-0"
          style={{ fontSize: 'clamp(9rem, 26vw, 24rem)' }}
        >
          {service.number}
        </span>

        <div className="relative mx-auto max-w-4xl">
          <FadeIn y={20}>
            <p className="mb-5 flex items-center gap-3 text-xs font-light uppercase tracking-[0.25em] text-[#D7E2EA] opacity-50 sm:text-sm">
              <span className="h-px w-8 bg-[#D7E2EA] sm:w-12" aria-hidden="true" />
              {service.number} — Service
            </p>
          </FadeIn>

          <WordReveal
            as="h1"
            text={service.name}
            gradient
            delay={0.05}
            className="font-black uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)' }}
          />

          <FadeIn delay={0.2} y={20}>
            <p
              className="mt-8 max-w-2xl font-light leading-relaxed text-[#D7E2EA] opacity-70"
              style={{ fontSize: 'clamp(1rem, 1.9vw, 1.35rem)' }}
            >
              {service.description}
            </p>
          </FadeIn>

          {/* Who should keep reading. A prospect who recognises themselves in
              one of these has already decided the page is about them. */}
          <FadeIn delay={0.28} y={20}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {service.idealFor.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[#D7E2EA]/20 bg-[#D7E2EA]/[0.03] px-4 py-2
                    text-[11px] font-light uppercase tracking-widest text-[#D7E2EA] opacity-70 sm:text-xs"
                >
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.36} y={20}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <ContactButton
                label="Start a project"
                showArrow
                subject={`${service.name} enquiry`}
                whatsappMessage={`Hi Ali, I'm interested in ${service.name} and want to discuss a project.`}
                align="start"
              />

              {/* A plain anchor, not a router Link: this leaves for a hash on
                  another route, and the browser handles that scroll properly. */}
              <a
                href="/#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border
                  border-[#D7E2EA]/25 px-8 py-4 text-xs font-medium uppercase tracking-widest
                  text-[#D7E2EA] transition-all duration-300 hover:border-[#C86BFF]
                  hover:bg-[#C86BFF]/5 hover:text-[#C86BFF] sm:text-sm"
              >
                See the work
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.44} y={20}>
            <p className="mt-8 text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-40 sm:text-sm">
              {PROFILE.location} · remote worldwide
            </p>
          </FadeIn>
        </div>
      </header>

      <TitleMarquee text={service.name} />

      <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl">
          {service.intro.map((paragraph, i) =>
            // The opening line gets the same word-by-word scroll reveal the home
            // page uses on the about text — one paragraph per page, which is
            // the budget that effect was measured at.
            i === 0 ? (
              <AnimatedText
                key={i}
                text={paragraph}
                className="mb-6 font-light leading-relaxed text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1.05rem, 2vw, 1.5rem)' }}
              />
            ) : (
              <FadeIn key={i} delay={i * 0.05} y={20}>
                <p
                  className="mb-6 font-light leading-relaxed text-[#D7E2EA] opacity-80"
                  style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)' }}
                >
                  {paragraph}
                </p>
              </FadeIn>
            )
          )}
        </div>
      </div>

      {/*
        The commercial argument, before the feature list. Each row is one thing
        the business is losing today and what stands in its place afterwards —
        stacked on a phone with the connector running downwards, side by side
        from `sm` with it running across.
      */}
      <section className="px-5 pb-16 sm:px-8 md:px-10 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading>What this fixes</SectionHeading>

          <ul className="flex flex-col gap-4 sm:gap-5">
            {service.problems.map((problem, i) => (
              <FadeIn
                as="li"
                key={problem.pain}
                delay={i * 0.06}
                y={24}
                className="grid grid-cols-1 items-center gap-0 rounded-3xl border border-[#D7E2EA]/10
                  bg-[#D7E2EA]/[0.02] p-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-2 sm:p-7 md:gap-4"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D7E2EA] opacity-30 sm:text-xs">
                    Right now
                  </span>
                  <p
                    className="font-light leading-relaxed text-[#D7E2EA] opacity-45"
                    style={{ fontSize: 'clamp(0.92rem, 1.5vw, 1.1rem)' }}
                  >
                    {problem.pain}
                  </p>
                </div>

                {/* The hairline draws itself in as the row arrives — see
                    `.swap-line` in index.css for the axis swap. */}
                <span
                  aria-hidden="true"
                  className="relative flex h-12 w-full items-center justify-center sm:h-full sm:w-14 md:w-20"
                >
                  <span
                    className="swap-line absolute h-full w-px bg-gradient-to-b from-transparent
                      via-[#D7E2EA]/30 to-transparent sm:h-px sm:w-full sm:bg-gradient-to-r"
                  />
                  {/* A node on the connector rather than an icon floating over
                      it — the disc hides the hairline running underneath. */}
                  <span
                    className="relative flex h-8 w-8 items-center justify-center rounded-full
                      border border-[#D7E2EA]/15 bg-[#101012]"
                  >
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      className="rotate-90 text-[#BBCCD7] opacity-70 sm:rotate-0"
                    />
                  </span>
                </span>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#BBCCD7] opacity-70 sm:text-xs">
                    Once it&apos;s built
                  </span>
                  <p
                    className="font-light leading-relaxed text-[#D7E2EA]"
                    style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}
                  >
                    {problem.fix}
                  </p>
                </div>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 md:px-10 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading>What you get</SectionHeading>

          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {service.youGet.map((item, i) => (
              <FadeIn as="li" key={item} delay={i * 0.05} y={24} className="h-full">
                <SpotlightCard className="flex h-full flex-col rounded-3xl p-6 sm:p-7">
                  <span className="mb-4 block text-xs font-medium uppercase tracking-[0.3em] text-[#D7E2EA] opacity-30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="block font-light leading-relaxed text-[#D7E2EA] opacity-80"
                    style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)' }}
                  >
                    {item}
                  </span>
                </SpotlightCard>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* White ground for the process, the same tonal break the home page makes
          at the services list — it keeps a long page from reading as one
          endless dark scroll. */}
      <section
        className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24
          md:rounded-t-[60px] md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-4xl">
          <WordReveal
            text="How it works"
            className="mb-12 font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-16"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 4rem)' }}
          />

          <ol className="timeline relative">
            {/* The unfilled spine, and the darker line that fills down it as
                the list scrolls past. Both are the same geometry; only the
                second one is animated. */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[11px] top-3 w-px bg-[#0C0C0C]/12 sm:left-[13px]"
            />
            <span
              aria-hidden="true"
              className="timeline-fill absolute bottom-6 left-[11px] top-3 w-px bg-[#0C0C0C]/70 sm:left-[13px]"
            />

            {service.process.map((phase, i) => (
              <FadeIn
                as="li"
                key={phase.step}
                delay={i * 0.06}
                y={20}
                className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8"
                style={dotRange(i, service.process.length)}
              >
                <span
                  aria-hidden="true"
                  className="relative z-10 mt-1 flex h-[23px] w-[23px] shrink-0 items-center
                    justify-center rounded-full border-2 border-[#0C0C0C] bg-white sm:h-[27px] sm:w-[27px]"
                >
                  <span className="timeline-dot-fill h-[9px] w-[9px] rounded-full bg-[#0C0C0C] sm:h-[11px] sm:w-[11px]" />
                </span>

                <div className="timeline-step flex min-w-0 flex-col gap-2 pt-0.5">
                  <h3
                    className="font-black uppercase leading-none tracking-tight text-[#0C0C0C]"
                    style={{ fontSize: 'clamp(1.15rem, 2.6vw, 2rem)' }}
                  >
                    <span className="mr-3 opacity-25">{String(i + 1).padStart(2, '0')}</span>
                    {phase.step}
                  </h3>
                  <p
                    className="max-w-2xl font-light leading-relaxed text-[#0C0C0C] opacity-60"
                    style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
                  >
                    {phase.detail}
                  </p>
                </div>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/*
        These answers are also marked up as FAQPage structured data in
        src/lib/seo.ts. The markup is only legitimate while the questions are
        on the page, so the two move together or not at all — and the answers
        stay in the DOM when collapsed for the same reason.
      */}
      <section className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-16 pt-20 sm:-mt-12
        sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeading>Questions</SectionHeading>

          <div>
            {service.faqs.map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 0.04} y={20}>
                <details className="faq border-t border-[#D7E2EA]/15 last:border-b">
                  <summary className="flex items-start justify-between gap-6 py-6 transition-opacity duration-200 hover:opacity-70">
                    <h3
                      className="font-medium leading-snug text-[#D7E2EA]"
                      style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}
                    >
                      {faq.q}
                    </h3>
                    <Plus
                      className="faq-sign mt-1 shrink-0 text-[#D7E2EA] opacity-50"
                      size={22}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </summary>

                  <div className="faq-answer">
                    <div>
                      <p
                        className="max-w-3xl pb-7 pr-2 font-light leading-relaxed text-[#D7E2EA] opacity-65 sm:pr-10"
                        style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)' }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 md:px-10 md:pb-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading>Other services</SectionHeading>

          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {others.map((other, i) => (
              <FadeIn as="li" key={other.slug} delay={i * 0.05} y={24} className="h-full">
                <SpotlightCard className="h-full rounded-3xl">
                  <Link
                    to={`/services/${other.slug}`}
                    className="group flex h-full items-start justify-between gap-4 p-6 sm:p-7"
                  >
                    <span className="flex flex-col gap-2">
                      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#D7E2EA] opacity-30">
                        {other.number}
                      </span>
                      <span className="font-medium uppercase leading-tight tracking-tight text-[#D7E2EA] sm:text-lg">
                        {other.name}
                      </span>
                      <span className="text-sm font-light leading-relaxed text-[#D7E2EA] opacity-50">
                        {other.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-[#D7E2EA] opacity-40 transition-all duration-300
                        group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </SpotlightCard>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      <PageCta
        line={`Tell me what you need ${service.name.toLowerCase()} for and I'll tell you what it takes.`}
      />

      <StickyCta />
    </article>
  );
}

/**
 * Where a step sits along the list's scroll timeline, as a slice of the same
 * `cover 12% → 72%` range the filling line uses (see `.timeline-*` in
 * index.css). Nudged past the row's own start so a dot fills just as the line
 * arrives at it rather than a moment before.
 */
function dotRange(index: number, total: number): CSSProperties {
  const FILL_START = 12;
  const FILL_LENGTH = 60;
  const at = FILL_START + FILL_LENGTH * ((index + 0.35) / total);

  return {
    '--dot-from': `${(at - 2).toFixed(1)}%`,
    '--dot-to': `${(at + 5).toFixed(1)}%`,
  } as CSSProperties;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <WordReveal
      text={children}
      className="mb-8 font-black uppercase leading-none tracking-tight text-[#D7E2EA] opacity-90 sm:mb-10"
      style={{ fontSize: 'clamp(1.75rem, 6vw, 4rem)' }}
    />
  );
}
