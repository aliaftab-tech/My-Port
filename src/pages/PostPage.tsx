import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import Orb from '../components/Orb';
import PageNav from '../components/PageNav';
import PageCta from '../components/PageCta';
import ScrollProgress from '../components/ScrollProgress';
import { POSTS_BY_DATE, POST_BY_SLUG } from '../data/posts';
import { SERVICE_BY_SLUG } from '../data/services';
import { formatPostDate } from '../lib/dates';

export default function PostPage() {
  const { slug } = useParams();
  const post = slug ? POST_BY_SLUG.get(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const index = POSTS_BY_DATE.findIndex((p) => p.slug === post.slug);
  const next = POSTS_BY_DATE[(index + 1) % POSTS_BY_DATE.length];
  const service = post.relatedService ? SERVICE_BY_SLUG.get(post.relatedService) : undefined;

  return (
    <article>
      <ScrollProgress />
      <PageNav />

      <header className="relative overflow-clip px-5 pb-10 pt-14 sm:px-8 sm:pt-16 md:px-10 md:pb-12">
        <Orb
          kind="ember"
          className="parallax -right-24 top-[20%] h-[170px] w-[170px] opacity-25 blur-[1px]
            sm:right-[-4%] sm:h-[220px] sm:w-[220px] md:h-[280px] md:w-[280px]"
          style={{ '--parallax-from': '-60px', '--parallax-to': '60px' } as CSSProperties}
        />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn y={20}>
            <p className="mb-5 text-xs font-light uppercase tracking-[0.25em] text-[#D7E2EA] opacity-50 sm:text-sm">
              {post.topic} —{' '}
              {/* The machine-readable date sits on the same element a reader sees, so
                  the two can't drift apart the way a hidden meta tag can. */}
              <time dateTime={post.published}>{formatPostDate(post.published)}</time> ·{' '}
              {post.minutes}{' '}
              min read
            </p>
          </FadeIn>

          <FadeIn
            as="h1"
            delay={0.05}
            y={40}
            className="hero-heading font-black uppercase leading-[1] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 6.5vw, 4.5rem)' }}
          >
            {post.title}
          </FadeIn>
        </div>
      </header>

      <div className="px-5 pb-4 sm:px-8 md:px-10">
        <div className="mx-auto max-w-3xl">
          {post.intro.map((paragraph, i) => (
            <FadeIn key={i} delay={i * 0.05} y={20}>
              <p
                className="mb-6 font-light leading-relaxed text-[#D7E2EA] opacity-85"
                style={{ fontSize: 'clamp(1.05rem, 2vw, 1.35rem)' }}
              >
                {paragraph}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>

      {post.sections.map((section) => (
        <section key={section.heading} className="px-5 pt-10 sm:px-8 md:px-10 md:pt-12">
          <div className="mx-auto max-w-3xl">
            <FadeIn
              as="h2"
              y={30}
              className="mb-6 font-black uppercase leading-none tracking-tight text-[#D7E2EA] opacity-90"
              style={{ fontSize: 'clamp(1.35rem, 3.4vw, 2.4rem)' }}
            >
              {section.heading}
            </FadeIn>

            {section.body.map((paragraph, p) => (
              <FadeIn key={p} delay={p * 0.04} y={20}>
                <p
                  className="mb-5 font-light leading-relaxed text-[#D7E2EA] opacity-75"
                  style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)' }}
                >
                  {paragraph}
                </p>
              </FadeIn>
            ))}

            {section.list && (
              <ul className="mt-6 flex flex-col">
                {section.list.map((item, l) => (
                  <FadeIn
                    as="li"
                    key={item}
                    delay={l * 0.05}
                    y={20}
                    className="border-t border-[#D7E2EA]/15 py-4 font-light leading-relaxed
                      text-[#D7E2EA] opacity-80 last:border-b"
                    style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.15rem)' }}
                  >
                    {item}
                  </FadeIn>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      {service && (
        <section className="px-5 pt-14 sm:px-8 md:px-10 md:pt-16">
          <FadeIn y={20} className="mx-auto max-w-3xl">
            <Link
              to={`/services/${service.slug}`}
              className="group flex items-center justify-between gap-6 rounded-3xl border
                border-[#D7E2EA]/20 p-6 transition-colors duration-200 hover:border-[#D7E2EA]/50 sm:p-8"
            >
              <span className="flex flex-col gap-2">
                <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50">
                  The service this belongs to
                </span>
                <span
                  className="hero-heading font-black uppercase leading-none tracking-tight"
                  style={{ fontSize: 'clamp(1.35rem, 4.5vw, 2.5rem)' }}
                >
                  {service.name}
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
      )}

      {next.slug !== post.slug && (
        <section className="px-5 pt-6 sm:px-8 md:px-10">
          <FadeIn y={20} className="mx-auto max-w-3xl">
            <Link
              to={`/blog/${next.slug}`}
              className="group flex items-center justify-between gap-6 rounded-3xl border
                border-[#D7E2EA]/20 p-6 transition-colors duration-200 hover:border-[#D7E2EA]/50 sm:p-8"
            >
              <span className="flex flex-col gap-2">
                <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50">
                  Read next
                </span>
                <span
                  className="font-black uppercase leading-[1.1] tracking-tight text-[#D7E2EA] opacity-90"
                  style={{ fontSize: 'clamp(1.15rem, 3.2vw, 1.9rem)' }}
                >
                  {next.title}
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
      )}

      <PageCta line="Tell me what you're building and I'll tell you what it takes — no obligation, and a straight answer." />
    </article>
  );
}
