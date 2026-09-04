import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import Orb from '../components/Orb';
import PageNav from '../components/PageNav';
import PageCta from '../components/PageCta';
import ScrollProgress from '../components/ScrollProgress';
import WordReveal from '../components/WordReveal';
import { POSTS_BY_DATE } from '../data/posts';
import { formatPostDate } from '../lib/dates';

export default function BlogPage() {
  return (
    <div>
      <ScrollProgress />
      <PageNav />

      {/* Clip, not hidden — the orb overhangs the edge on purpose. */}
      <header className="relative overflow-clip px-5 pb-12 pt-14 sm:px-8 sm:pt-16 md:px-10 md:pb-16">
        <Orb
          kind="ember"
          className="parallax -right-20 top-[18%] h-[180px] w-[180px] opacity-30 blur-[1px]
            sm:right-[-3%] sm:h-[240px] sm:w-[240px] md:h-[300px] md:w-[300px]"
          style={{ '--parallax-from': '-70px', '--parallax-to': '70px' } as CSSProperties}
        />

        <div className="relative mx-auto max-w-5xl">
          <FadeIn y={20}>
            <p className="mb-5 text-xs font-light uppercase tracking-[0.25em] text-[#D7E2EA] opacity-50 sm:text-sm">
              Writing
            </p>
          </FadeIn>

          <WordReveal
            as="h1"
            text="Notes on building"
            gradient
            className="font-black uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)' }}
          />

          <FadeIn delay={0.15} y={20}>
            <p
              className="mt-8 max-w-3xl font-light leading-relaxed text-[#D7E2EA] opacity-75"
              style={{ fontSize: 'clamp(1rem, 1.9vw, 1.35rem)' }}
            >
              The questions clients actually ask, answered properly — what things cost, what
              breaks, and what is worth paying for. Written for the person deciding, not for
              other developers.
            </p>
          </FadeIn>
        </div>
      </header>

      <section className="px-5 pb-16 sm:px-8 md:px-10">
        <ul className="mx-auto flex max-w-5xl flex-col">
          {POSTS_BY_DATE.map((post, i) => (
            <FadeIn as="li" key={post.slug} delay={i * 0.06} y={24}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col gap-4 border-t border-[#D7E2EA]/15 py-8
                  transition-all duration-300 hover:border-[#C86BFF]
                  sm:flex-row sm:items-start sm:gap-10 sm:py-10"
              >
                <span
                  className="flex shrink-0 flex-col gap-1 text-xs font-light uppercase
                    tracking-widest text-[#D7E2EA] opacity-45 sm:w-40 sm:pt-2"
                >
                  <span>{post.topic}</span>
                  <span>
                    {formatPostDate(post.published)} · {post.minutes} min
                  </span>
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-3">
                  <span
                    className="font-black uppercase leading-[1.05] tracking-tight text-[#D7E2EA]
                      opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:text-[#C86BFF]"
                    style={{ fontSize: 'clamp(1.35rem, 3.4vw, 2.4rem)' }}
                  >
                    {post.title}
                  </span>
                  <span
                    className="max-w-2xl font-light leading-relaxed text-[#D7E2EA] opacity-65"
                    style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)' }}
                  >
                    {post.summary}
                  </span>
                </span>

                <ArrowUpRight
                  size={26}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="hidden shrink-0 text-[#D7E2EA] opacity-40 transition-all
                    duration-300 group-hover:opacity-100 group-hover:text-[#C86BFF] sm:block sm:mt-2"
                />
              </Link>
            </FadeIn>
          ))}
        </ul>
      </section>

      <PageCta line="Got a question none of these answered? Ask it directly — I reply to my own email." />
    </div>
  );
}
