import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import Orb from '../components/Orb';
import PageNav from '../components/PageNav';
import PageCta from '../components/PageCta';
import ScrollProgress from '../components/ScrollProgress';
import TitleMarquee from '../components/TitleMarquee';
import { PROJECTS, PROJECT_BY_SLUG } from '../data/projects';
import { SIZES, srcSetFor } from '../lib/images';

export default function CaseStudyPage() {
  const { slug } = useParams();
  const project = slug ? PROJECT_BY_SLUG.get(slug) : undefined;

  if (!project) return <Navigate to="/" replace />;

  const study = project.caseStudy;
  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <article>
      <ScrollProgress />
      <PageNav />

      {/* Clip, not hidden — see the note on the same element in ServicePage. */}
      <header className="relative overflow-clip px-5 pb-12 pt-14 sm:px-8 sm:pt-16 md:px-10 md:pb-16">
        <Orb
          kind="ember"
          className="parallax -right-20 top-[16%] h-[180px] w-[180px] opacity-30 blur-[1px]
            sm:right-[-3%] sm:h-[240px] sm:w-[240px] md:h-[300px] md:w-[300px]"
          style={{ '--parallax-from': '-70px', '--parallax-to': '70px' } as CSSProperties}
        />

        <span
          aria-hidden="true"
          className="parallax pointer-events-none absolute -top-4 right-4 select-none font-black
            leading-none text-[#D7E2EA] opacity-[0.04] sm:right-10 md:top-0"
          style={{ fontSize: 'clamp(9rem, 26vw, 24rem)' }}
        >
          {project.number}
        </span>

        <div className="relative mx-auto max-w-5xl">
          <FadeIn y={20}>
            <p className="mb-5 text-xs font-light uppercase tracking-[0.25em] text-[#D7E2EA] opacity-50 sm:text-sm">
              {project.number} — {project.category} work
            </p>
          </FadeIn>

          <FadeIn
            as="h1"
            delay={0.05}
            y={40}
            className="hero-heading font-black uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)' }}
          >
            {project.name}
          </FadeIn>

          <FadeIn delay={0.15} y={20} className="mt-8">
            <span className="mb-3 inline-block rounded-md bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]">
              TL;DR
            </span>
            <p
              className="max-w-3xl font-light leading-relaxed text-[#D7E2EA] opacity-75"
              style={{ fontSize: 'clamp(1rem, 1.9vw, 1.35rem)' }}
            >
              {study.summary}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
              <Fact label="Role" value={study.role} />
              {study.year && <Fact label="Year" value={study.year} />}
              <Fact label="Built with" value={project.stack.join(', ')} />
            </dl>
          </FadeIn>

          {project.href && (
            <FadeIn delay={0.25} y={20}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]
                  px-6 py-3 text-sm font-medium uppercase tracking-wider text-[#D7E2EA]
                  transition-all duration-300 hover:border-[#C86BFF] hover:bg-[#C86BFF]/15 hover:text-[#C86BFF]"
              >
                Visit the live site
                <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
              </a>
            </FadeIn>
          )}
        </div>
      </header>

      <TitleMarquee text={project.name} />

      <FadeIn y={30} className="px-5 pt-16 sm:px-8 sm:pt-20 md:px-10">
        <div className="mx-auto max-w-5xl overflow-clip rounded-[28px] bg-white/5 sm:rounded-[40px]">
          <img
            src={project.images.wide.src}
            srcSet={srcSetFor(project.images.wide.src)}
            sizes={SIZES.caseStudyHero}
            width={1200}
            height={900}
            alt={`${project.name} — the homepage`}
            className="settle w-full"
            decoding="async"
          />
        </div>
      </FadeIn>

      <section className="px-5 py-16 sm:px-8 sm:py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl">
          <FadeIn
            as="h2"
            y={30}
            className="mb-8 font-black uppercase leading-none tracking-tight text-[#D7E2EA] opacity-90"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
          >
            What it does
          </FadeIn>

          <ul className="flex flex-col">
            {study.highlights.map((item, i) => (
              <FadeIn
                as="li"
                key={item}
                delay={i * 0.05}
                y={20}
                className="border-t border-[#D7E2EA]/15 py-5 font-light leading-relaxed text-[#D7E2EA]
                  opacity-80 last:border-b"
                style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)' }}
              >
                {item}
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {study.sections.map((section, i) => (
        <section key={section.heading} className="px-5 pb-14 sm:px-8 md:px-10 md:pb-16">
          <div className="mx-auto max-w-4xl">
            <FadeIn
              as="h2"
              y={30}
              className="mb-6 font-black uppercase leading-none tracking-tight text-[#D7E2EA] opacity-90"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
            >
              {section.heading}
            </FadeIn>

            {section.body.map((paragraph, p) => (
              <FadeIn key={p} delay={p * 0.05} y={20}>
                <p
                  className="mb-5 max-w-3xl font-light leading-relaxed text-[#D7E2EA] opacity-75"
                  style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)' }}
                >
                  {paragraph}
                </p>
              </FadeIn>
            ))}

            {/* The mid-page and phone captures, dropped in after the first
                block of prose so the page isn't a wall of text. */}
            {i === 0 && (
              <FadeIn y={30} className="mt-10">
                <div className="flex gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1 overflow-hidden rounded-[20px] bg-white/5 sm:rounded-[28px]">
                    <img
                      src={project.images.mid.src}
                      srcSet={srcSetFor(project.images.mid.src)}
                      sizes={SIZES.caseStudyMid}
                      width={1200}
                      height={900}
                      alt={`${project.name} — a section further down the page`}
                      loading="lazy"
                      decoding="async"
                      className="w-full"
                    />
                  </div>
                  <div className="w-[26%] shrink-0 overflow-hidden rounded-[16px] bg-white/5 sm:rounded-[22px]">
                    <img
                      src={project.images.phone.src}
                      srcSet={srcSetFor(project.images.phone.src)}
                      sizes={SIZES.caseStudyPhone}
                      width={600}
                      height={1300}
                      alt={`${project.name} on mobile`}
                      loading="lazy"
                      decoding="async"
                      className="w-full"
                    />
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      ))}

      {study.results && study.results.length > 0 && (
        <section className="px-5 pb-16 sm:px-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <FadeIn
              as="h2"
              y={30}
              className="mb-8 font-black uppercase leading-none tracking-tight text-[#D7E2EA] opacity-90"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
            >
              What were the results?
            </FadeIn>
            <ul className="flex flex-col">
              {study.results.map((item) => (
                <FadeIn
                  as="li"
                  key={item}
                  y={20}
                  className="border-t border-[#D7E2EA]/15 py-5 font-light leading-relaxed text-[#D7E2EA]
                    opacity-80 last:border-b"
                  style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)' }}
                >
                  {item}
                </FadeIn>
              ))}
            </ul>
          </div>
        </section>
      )}

      {study.testimonial && (
        <section className="px-5 pb-16 sm:px-8 md:px-10">
          <FadeIn y={30} className="mx-auto max-w-4xl">
            <blockquote className="border-l-2 border-[#D7E2EA]/30 pl-6">
              <p
                className="font-light leading-relaxed text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.75rem)' }}
              >
                “{study.testimonial.quote}”
              </p>
              <footer className="mt-4 text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50 sm:text-sm">
                {study.testimonial.author}
              </footer>
            </blockquote>
          </FadeIn>
        </section>
      )}

      <section className="px-5 pb-16 sm:px-8 md:px-10">
        <FadeIn y={20} className="mx-auto max-w-4xl">
          <Link
            to={`/work/${next.slug}`}
            className="group flex items-center justify-between gap-6 rounded-3xl border
              border-[#D7E2EA]/20 p-6 transition-all duration-300 hover:border-[#C86BFF] sm:p-8"
          >
            <span className="flex flex-col gap-2">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50">
                Next project
              </span>
              <span
                className="hero-heading font-black uppercase leading-none tracking-tight"
                style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}
              >
                {next.name}
              </span>
            </span>
            <ArrowUpRight
              size={28}
              strokeWidth={2}
              aria-hidden="true"
              className="shrink-0 text-[#D7E2EA] opacity-50 transition-opacity duration-200 group-hover:opacity-100"
            />
          </Link>
        </FadeIn>
      </section>

      <PageCta line="Want something like this? Tell me what you're building and I'll tell you what it takes." />
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-40">
        {label}
      </dt>
      <dd className="text-sm font-medium uppercase tracking-wide text-[#D7E2EA] sm:text-base">
        {value}
      </dd>
    </div>
  );
}
