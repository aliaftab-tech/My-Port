import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, MessageSquare, Plus, Trash2, X } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import WordReveal from '../components/WordReveal';
import SpotlightCard from '../components/SpotlightCard';
import StarRating from '../components/StarRating';
import {
  MAX_BODY,
  MAX_NAME,
  MAX_ROLE,
  SAMPLE_REVIEWS,
  loadReviews,
  makeReview,
  saveReviews,
  statsFor,
  timeAgo,
  type Review,
} from '../lib/reviews';

const BLANK = { name: '', role: '', rating: 5, body: '' };

/**
 * What clients say about working with Ali.
 *
 * Reviews live in localStorage — see `lib/reviews.ts` — which means the average
 * under the heading is this visitor's view of the world, not a global one, and
 * a client's review is never seen by the next visitor. The copy says so rather
 * than implying social proof the page can't back up.
 */
export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [justPosted, setJustPosted] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Storage is read after hydration on purpose: the prerendered HTML has the
  // samples in it, and rendering something different on the first client pass
  // would throw the markup away and flash.
  useEffect(() => {
    setMounted(true);
    const stored = loadReviews();
    if (stored.length > 0) setReviews(stored);
  }, []);

  const showingSamples = reviews.some((review) => review.sample);
  const stats = useMemo(() => statsFor(reviews), [reviews]);

  const persist = (next: Review[]) => {
    setReviews(next);
    saveReviews(next);
  };

  const submit = () => {
    if (!form.body.trim()) {
      bodyRef.current?.focus();
      return;
    }

    // The first real review replaces the samples outright — a placeholder
    // sitting next to a genuine quote is worse than no placeholder at all.
    const kept = reviews.filter((review) => !review.sample);
    persist([makeReview(form), ...kept]);

    setForm(BLANK);
    setOpen(false);
    setJustPosted(true);
    setTimeout(() => setJustPosted(false), 3200);
  };

  const remove = (id: string) => {
    const next = reviews.filter((review) => review.id !== id);
    persist(next.length > 0 ? next : SAMPLE_REVIEWS);
  };

  return (
    <section id="reviews" className="border-t border-[#D7E2EA]/10 px-5 py-20 sm:px-8 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeIn y={14}>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#D7E2EA]/40">
                Client reviews
              </span>
            </FadeIn>

            {/* h1, not h2: this section is the whole of /reviews, and it is
                not rendered anywhere else. As an h2 the page shipped with no
                h1 at all — a heading outline starting at level two, and
                nothing telling a crawler what the page is about. */}
            <WordReveal
              as="h1"
              text="What it's like to work with Ali"
              gradient
              className="mt-3 font-black uppercase leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(1.9rem, 5.5vw, 3.6rem)' }}
            />
          </div>

          <FadeIn delay={0.1} y={14}>
            <button
              type="button"
              onClick={() => setOpen((was) => !was)}
              className="group inline-flex items-center gap-2.5 rounded-full border
                border-[#D7E2EA]/20 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.14em]
                text-[#D7E2EA] transition-colors duration-300 hover:bg-[#D7E2EA]
                hover:text-[#0C0C0C]"
            >
              {open ? (
                <X size={15} strokeWidth={2.2} />
              ) : (
                <Plus
                  size={15}
                  strokeWidth={2.2}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />
              )}
              {open ? 'Close' : 'Write a review'}
            </button>
          </FadeIn>
        </div>

        {justPosted ? (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#C86BFF]/30 bg-[#7621B0]/15 px-4 py-2 text-[13px] text-[#E7CDFF]">
            <Check size={14} strokeWidth={2.4} />
            Thanks — saved in this browser. Send it to Ali if you'd like it published here.
          </p>
        ) : null}

        {/* A grid that collapses rather than a modal: nothing here is important
            enough to take over the screen. */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${open ? 'mt-8 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <div className="rounded-[26px] border border-[#D7E2EA]/12 bg-[#D7E2EA]/[0.03] p-5 sm:p-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#D7E2EA]/50">
                    Your rating
                  </span>
                  <StarRating
                    value={form.rating}
                    size={22}
                    onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={form.name}
                    maxLength={MAX_NAME}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your name"
                    aria-label="Your name"
                    className="field"
                  />
                  <input
                    value={form.role}
                    maxLength={MAX_ROLE}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    placeholder="Company or role (optional)"
                    aria-label="Company or role"
                    className="field"
                  />
                </div>

                <div>
                  <textarea
                    ref={bodyRef}
                    value={form.body}
                    maxLength={MAX_BODY}
                    rows={4}
                    onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                    placeholder="What did Ali build for you, and how did it go?"
                    aria-label="Your review"
                    className="field resize-none"
                  />
                  <p className="mt-1.5 text-right text-[11px] text-[#D7E2EA]/30">
                    {form.body.length}/{MAX_BODY}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="max-w-[22rem] text-[11.5px] leading-relaxed text-[#D7E2EA]/35">
                    Saved in this browser only — nothing is uploaded, so only you will see it here.
                  </p>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={!form.body.trim()}
                    className="rounded-full bg-[#D7E2EA] px-6 py-3 text-[12px] font-semibold
                      uppercase tracking-[0.14em] text-[#0C0C0C] transition-opacity duration-200
                      hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Post review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* `items-start` so the score card is as tall as its own contents —
            stretching it to match a two-row grid of reviews leaves a hole. */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
          <FadeIn y={22}>
            <SpotlightCard className="flex flex-col gap-7 rounded-[26px] p-6">
              <div>
                <p className="flex items-end gap-2">
                  <span
                    className="hero-heading font-black leading-none tracking-tight"
                    style={{ fontSize: 'clamp(2.6rem, 7vw, 3.6rem)' }}
                  >
                    {stats.average.toFixed(1)}
                  </span>
                  <span className="pb-1.5 text-[13px] text-[#D7E2EA]/40">out of 5</span>
                </p>

                <StarRating value={Math.round(stats.average)} size={18} className="mt-3" />

                <p className="mt-3 flex items-center gap-2 text-[12.5px] text-[#D7E2EA]/45">
                  <MessageSquare size={13} strokeWidth={2} />
                  {stats.count} review{stats.count === 1 ? '' : 's'}
                  {showingSamples ? ' · samples' : ''}
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star - 1];
                  const share = stats.count ? (count / stats.count) * 100 : 0;

                  return (
                    <li key={star} className="flex items-center gap-3 text-[11px] text-[#D7E2EA]/40">
                      <span className="w-3 tabular-nums">{star}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D7E2EA]/8">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-[#C86BFF] to-[#FFB27A]
                            transition-[width] duration-700 ease-out"
                          style={{ width: `${share}%` }}
                        />
                      </span>
                      <span className="w-4 text-right tabular-nums">{count}</span>
                    </li>
                  );
                })}
              </ul>
            </SpotlightCard>
          </FadeIn>

          <ul className="grid gap-5 sm:grid-cols-2">
            {reviews.map((review, index) => (
              <li key={review.id}>
                <FadeIn y={22} delay={Math.min(index, 4) * 0.06} className="h-full">
                  <SpotlightCard className="group/review relative flex h-full flex-col gap-4 rounded-[26px] p-6">
                    <div className="flex items-start justify-between gap-3">
                      <StarRating value={review.rating} size={15} />

                      {review.sample ? (
                        <span className="rounded-full border border-[#D7E2EA]/15 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#D7E2EA]/40">
                          Sample
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => remove(review.id)}
                          aria-label="Delete this review"
                          className="rounded-lg p-1 text-[#D7E2EA]/25 opacity-0 transition
                            hover:text-[#FFB27A] focus-visible:opacity-100 group-hover/review:opacity-100"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      )}
                    </div>

                    <p className="flex-1 text-[14.5px] leading-relaxed text-[#D7E2EA]/78">
                      “{review.body}”
                    </p>

                    <div className="border-t border-[#D7E2EA]/10 pt-4">
                      <p className="text-[13.5px] font-medium text-[#D7E2EA]">{review.name}</p>
                      <p className="mt-0.5 text-[12px] text-[#D7E2EA]/38">
                        {review.role}
                        {review.role && mounted ? ' · ' : ''}
                        {mounted ? timeAgo(review.createdAt) : ''}
                      </p>
                    </div>
                  </SpotlightCard>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
