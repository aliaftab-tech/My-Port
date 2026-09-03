import { newId } from './chat';

/**
 * Reviews of Ali's work — client testimonials, not feedback on the chatbot.
 *
 * Kept in the visitor's own browser: no account, no database, no moderation
 * queue. That has one consequence worth being blunt about, because it decides
 * what this page is worth as social proof:
 *
 *   A review written here is visible to the person who wrote it and NOBODY
 *   ELSE. A client who leaves five stars sees five stars; the next visitor
 *   sees the samples. Nothing is uploaded anywhere.
 *
 * TODO(Ali): when you want testimonials that every visitor can read, this
 * module is the only thing that has to change — move `loadReviews` and
 * `saveReviews` onto Supabase (a `reviews` table, insert open to anyone,
 * select limited to rows you've approved) and the section renders the same.
 * Until then, treat the page as a place to collect quotes, not to display them.
 */

export type Review = {
  id: string;
  name: string;
  /** Optional — "Founder, Nazir & Sons" reads better than a bare name. */
  role: string;
  rating: number;
  body: string;
  createdAt: number;
  /** True for the placeholders below, so the UI can say so out loud. */
  sample?: boolean;
};

const KEY = 'ali-chat:reviews:v1';

export const MAX_NAME = 40;
export const MAX_ROLE = 60;
export const MAX_BODY = 600;

/**
 * Placeholder copy, shown only while there are no real reviews.
 *
 * TODO(Ali): replace these with quotes clients actually gave you — one line of
 * what you built, one line of what it changed — or delete the array. They
 * render with a "sample" tag on purpose: invented testimonials presented as
 * real ones are a trust problem long before they're a legal one, and the tag is
 * what keeps this page honest until you have the real thing. The wording below
 * is deliberately generic so it can't be mistaken for a real client's words.
 */
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'sample-1',
    name: 'Sample review',
    role: 'Replace me in src/lib/reviews.ts',
    rating: 5,
    body: 'This is where a client says what you built for them and what changed after it launched — orders, enquiries, hours back in the week. One sentence of each is enough.',
    createdAt: Date.UTC(2026, 5, 12),
    sample: true,
  },
  {
    id: 'sample-2',
    name: 'Sample review',
    role: 'Replace me in src/lib/reviews.ts',
    rating: 5,
    body: 'A good second quote covers the working relationship rather than the product: how quickly you replied, what you flagged before it became a problem, whether the deadline held.',
    createdAt: Date.UTC(2026, 6, 3),
    sample: true,
  },
  {
    id: 'sample-3',
    name: 'Sample review',
    role: 'Replace me in src/lib/reviews.ts',
    rating: 5,
    body: 'And a third in Roman Urdu, agar client usi tarah baat karta hai — jaisa unhone likha ho, waise hi rakhein. Un ki apni zubaan sab se zyada asli lagti hai.',
    createdAt: Date.UTC(2026, 6, 28),
    sample: true,
  },
];

const canPersist = (): boolean => typeof window !== 'undefined' && !!window.localStorage;

export function loadReviews(): Review[] {
  if (!canPersist()) return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item): Review | null => {
        const review = item as Partial<Review> | null;
        if (!review || typeof review.id !== 'string') return null;
        if (typeof review.body !== 'string' || typeof review.rating !== 'number') return null;

        return {
          id: review.id,
          name: typeof review.name === 'string' ? review.name : 'Anonymous',
          role: typeof review.role === 'string' ? review.role : '',
          rating: Math.min(5, Math.max(1, Math.round(review.rating))),
          body: review.body,
          createdAt: typeof review.createdAt === 'number' ? review.createdAt : Date.now(),
        };
      })
      .filter((review): review is Review => review !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function saveReviews(reviews: Review[]): void {
  if (!canPersist()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(reviews.filter((review) => !review.sample)));
  } catch {
    // Storage full or blocked — the review stays on screen for this visit.
  }
}

export function makeReview(input: {
  name: string;
  role: string;
  rating: number;
  body: string;
}): Review {
  return {
    id: newId(),
    name: input.name.trim().slice(0, MAX_NAME) || 'Anonymous',
    role: input.role.trim().slice(0, MAX_ROLE),
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    body: input.body.trim().slice(0, MAX_BODY),
    createdAt: Date.now(),
  };
}

export type ReviewStats = {
  count: number;
  average: number;
  /** Index 0 is one star, index 4 is five. */
  distribution: number[];
};

export function statsFor(reviews: Review[]): ReviewStats {
  const distribution = [0, 0, 0, 0, 0];
  let total = 0;

  for (const review of reviews) {
    distribution[review.rating - 1] += 1;
    total += review.rating;
  }

  return {
    count: reviews.length,
    average: reviews.length ? total / reviews.length : 0,
    distribution,
  };
}

const RELATIVE = [
  { limit: 60_000, divisor: 1_000, unit: 'second' },
  { limit: 3_600_000, divisor: 60_000, unit: 'minute' },
  { limit: 86_400_000, divisor: 3_600_000, unit: 'hour' },
  { limit: 2_592_000_000, divisor: 86_400_000, unit: 'day' },
  { limit: 31_536_000_000, divisor: 2_592_000_000, unit: 'month' },
] as const;

/** "3 days ago", without pulling in a date library to say it. */
export function timeAgo(at: number): string {
  const elapsed = Date.now() - at;
  if (elapsed < 45_000) return 'just now';

  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  for (const { limit, divisor, unit } of RELATIVE) {
    if (elapsed < limit) return format.format(-Math.round(elapsed / divisor), unit);
  }

  return format.format(-Math.round(elapsed / 31_536_000_000), 'year');
}
