import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import PageNav from '../components/PageNav';

export default function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col">
      <PageNav />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-24 text-center">
        <FadeIn
          as="h1"
          y={30}
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 14vw, 12rem)' }}
        >
          404
        </FadeIn>

        <FadeIn delay={0.1} y={20}>
          <p className="max-w-[420px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] opacity-60">
            That page isn&apos;t here. It may have moved, or it may never have existed.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} y={20}>
          <Link
            to="/"
            className="inline-flex items-center rounded-full border-2 border-[#D7E2EA] px-7 py-3
              text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors
              duration-200 hover:bg-[#D7E2EA]/10"
          >
            Back to the start
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
