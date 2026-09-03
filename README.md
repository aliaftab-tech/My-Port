# Ali Aftab — portfolio

Portfolio and services site at **aliaftab.dev**. React + TypeScript + Vite +
Tailwind + Framer Motion, with every route prerendered to static HTML at build
time.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR (no prerendering — the root starts empty) |
| `npm run build` | Client build, SSR build, then prerender every route into `dist/` |
| `npm run preview` | Serve `dist/` the way a static host does — see the note below |
| `npm run shots` | Re-capture every project screenshot, convert to WebP and build the responsive variants |
| `npm run image-sizes` | Rebuild just the responsive variants from the existing WebPs |
| `npm run avatar -- <photo>` | Rebuild the hero avatar from a photo |
| `npm run og` | Rebuild the social share card at `public/og-image.png` |

`npm run dev` also serves `api/` — see [The assistant at /chat](#the-assistant-at-chat)
for the `NVIDIA_API_KEY` it needs.

## Where to edit things

| What | File |
| --- | --- |
| Name, tagline, about paragraph | `src/data/profile.ts` |
| Email, WhatsApp, GitHub, LinkedIn | `src/data/profile.ts` → `CONTACT` |
| Nav links | `src/data/profile.ts` → `NAV_LINKS` |
| Projects and their case studies | `src/data/projects.ts` → `PROJECTS` |
| Services and their pages | `src/data/services.ts` → `SERVICES` |
| Starting prices | `src/data/services.ts` (the cost FAQ on each service) **and** `public/llms.txt` |
| Per-page titles, meta and structured data | `src/lib/seo.ts` |
| Site-wide identity data, no-JS fallback | `index.html` |

Contact links are hidden automatically when left as empty strings, so filling in
`whatsapp`, `github` and `linkedin` in `CONTACT` is all it takes to make those
buttons appear.

## Routes and prerendering

| Route | Source |
| --- | --- |
| `/` | `src/pages/HomePage.tsx` — the scrolling one-pager |
| `/chat` | `src/pages/ChatPage.tsx` — the AI assistant, full-screen |
| `/reviews` | `src/pages/ReviewsPage.tsx` — client reviews of Ali's work |
| `/blog` | `src/pages/BlogPage.tsx` — the writing index |
| `/blog/<slug>` | `src/pages/PostPage.tsx`, one per entry in `POSTS` |
| `/services/<slug>` | `src/pages/ServicePage.tsx`, one per entry in `SERVICES` |
| `/work/<slug>` | `src/pages/CaseStudyPage.tsx`, one per entry in `PROJECTS` |

Adding a service or a project adds its page, its sitemap entry and its
structured data automatically — the slug in the data file is the only thing
that needs to be unique.

`npm run build` runs three steps. Vite builds the client bundle; Vite builds
`src/entry-server.tsx` into `.ssr-build/`; then `scripts/prerender.mjs` renders
every route through React and writes `dist/<route>/index.html` with the markup
already in place, plus `404.html` and a freshly generated `sitemap.xml`.

The browser hydrates that markup rather than throwing it away, so visitors still
see the entrance animations — the prerendered HTML already carries the
pre-animation classes, and hydration picks up from there. See **Motion** below
for what actually drives them.

**Why `npm run preview` isn't `vite preview`:** vite preview falls back to the
root `index.html` for any URL it doesn't recognise, so `/services/whatsapp-automation`
gets served the *home page's* HTML and React silently rebuilds the correct page
on the client. It looks like a hydration bug and hides whether prerendering
worked. `scripts/serve-dist.mjs` resolves directory indexes and returns a real
404 instead, which is what Vercel does with this output.

## Prices

Every service page answers what it costs, with a rupee figure and a dollar
figure beside it. They are *starting* prices — the floor, not the average — and
the copy says so, because "it depends on scope" is what a prospect reads as
"he is expensive", and a page with numbers on it is the one an AI assistant
quotes.

Each service carries the figure twice, on purpose:

| Where | What it is | Kept in step by |
| --- | --- | --- |
| `startingPkr` in `src/data/services.ts` | The number, machine-readable | `src/lib/seo.ts` turns it into `PriceSpecification` markup on the service page |
| The cost FAQ on the same service | The number in a sentence, with what moves it | Hand-written — the prose differs per service |
| **Starting prices** in `public/llms.txt` | The whole list, for language models | Hand-written |

The structured `minPrice` is the half that does the ranking work. "What does a
website cost in Lahore" is a query with buying intent behind it, and most
agency sites answer it with "contact us" — a page that answers it in markup
gets read rather than interpreted.

`minPrice`, not `price`: these are floors. Marking a floor up as a fixed price
is markup the page contradicts two paragraphs later.

The assistant at `/chat` builds its system prompt from the data file, so it
keeps itself right. The other two will not. Raising a price means editing all
three in the same commit — otherwise one of them is quoting somebody a number
you will not honour.

## Writing at /blog

Posts live in `src/data/posts.ts`. Adding one adds its page, its sitemap entry,
its `BlogPosting` markup and its place on the index — the slug is the only
thing that has to be unique.

**What these are for.** A one-person site does not outrank an agency on "web
developer lahore" for years; that fight is decided by backlinks and age. It can
win the searches with a buyer in them and nobody answering — "what does a
website actually cost in Pakistan" is a question almost every agency answers
with "contact us". That is the gap these are written into, and it is why each
post ends by pointing at the service it belongs to.

**The rule for anything added here:** it has to be true and it has to be
defensible on a call. No invented client figures, no claims the service pages
do not already stand behind. A post that wins the click and loses the room in
the first meeting cost more than it earned.

**`published` is not decoration.** It ships in the `BlogPosting` markup, so a
wrong date here is a wrong date in Google's index. The three posts currently
carry the date the section was built — set each to the date it actually goes
live.

Dates are formatted through `src/lib/dates.ts`, in UTC at both ends. Formatting
an ISO date in local time renders the previous day west of Greenwich, which
would mean the prerenderer baking one date into the HTML and the browser
showing another — a hydration mismatch on the one value nobody thinks to check.

## The preloader

A curtain over the first paint of the session — "Welcome to", the name rising
letter by letter, role and location, a progress sweep, then the whole panel
lifts off the top of the screen. `src/components/Preloader.tsx`, styled at the
top of `src/index.css`, shown once per session.

Three things about it are load-bearing:

**It ships inside the prerendered HTML.** A preloader added on mount is worse
than none at all: the page paints, then gets covered up. Because it is in the
markup, the first frame the browser paints is already the curtain.

**The intro is CSS and the exit is JavaScript, and that split is the whole
design.** CSS animations start at first paint; `setTimeout` starts when React
mounts. On a cold load those are seconds apart — measured on this build, first
paint at 2.5s and React still not mounted at 3.4s. Time the intro off React and
it stutters and starts late. Time the *exit* off first paint and the curtain
lifts on a page that has not hydrated: no navigation, no hero heading, because
every entrance reveal here is a class an `IntersectionObserver` adds. So the
component reads how far the CSS intro has already got, waits out the remainder,
and only then sets `data-state="leaving"` — the curtain lifts on whichever
clock is later, which is what covering the load actually means.

**It has three ways out, and the page is unusable without all of them:**

| Condition | What happens | Where |
| --- | --- | --- |
| Already seen this session | Hidden before first paint | Inline script in `index.html` sets `data-preloaded` on `<html>` |
| `prefers-reduced-motion: reduce` | Removed outright | Bottom of `src/index.css` |
| No JavaScript | Removed outright | `@media (scripting: none)` |

That second one is not laziness. Zeroing the animations would leave a static
full-screen panel over the page for a second and a half, which is not a calmer
version of the effect. The third is not optional at all: nothing would ever
lift the curtain without JavaScript.

If you change any timing in the `.preloader` block, `INTRO_MS` in
`Preloader.tsx` has to match the longest animation in it, or the curtain will
cut its own intro short.

## Analytics

`@vercel/analytics` renders in `App.tsx`. Cookieless page views, so no consent
banner, and it counts client-side navigations that never reach a server log.
The script only loads on a Vercel deployment — locally and in the prerenderer
it renders nothing, so `npm run dev` doesn't file fake traffic against real
numbers.

Worth actually reading rather than installing and forgetting: the GEO service
page promises that AI referral traffic gets measured rather than assumed, and
`chatgpt.com` and `perplexity.ai` only appear as referrers if something is
watching for them.

## Motion

Almost none of it is JavaScript. The rule is that anything animating on scroll
runs on the compositor — `opacity` and `transform` only — so a long service page
doesn't drop frames on a mid-range phone.

| Piece | What it does |
| --- | --- |
| `src/lib/reveal.ts` | One `IntersectionObserver` for the whole page. Adds `.reveal-in` once, then unobserves. |
| `src/components/FadeIn.tsx` | Fade-and-slide on entry. The transition lives in `.reveal` in `index.css`; the component only sets the delay and distance. |
| `src/components/WordReveal.tsx` | Headings that arrive word by word. One observed element, per-word CSS delay. Pass `gradient` for the chrome fill. |
| `src/components/SpotlightCard.tsx` | Bordered panel with a highlight tracking the cursor. Writes two custom properties on the node — no React state, no re-render. |
| `src/components/StickyCta.tsx` | The phone-only action bar on service pages. Shows past the hero, hides again near the closing CTA. |
| `src/components/Preloader.tsx` | The session's opening curtain. See **The preloader** above — the intro and the exit deliberately run off different clocks. |
| `src/components/AnimatedText.tsx` | The word-by-word scroll wipe. The one Framer Motion effect left; budget is **one paragraph per page**. |
| `.timeline-*`, `.parallax`, `.settle` in `index.css` | Scroll-linked via `animation-timeline`, so the browser drives them and the main thread never sees them. Wrapped in `@supports` so Firefox gets the finished state. |

Everything above is switched off under `prefers-reduced-motion: reduce`, and
left in its finished state under `@media (scripting: none)` — both blocks are at
the bottom of `src/index.css`, and anything new with a hidden starting state has
to be added to them or it renders as an invisible page.

## The assistant at /chat

A chat page running **NVIDIA Nemotron 3.5 Lightning 30B** (`nvidia/nemotron-3.5-lightning-30b-a3b`)
through [NVIDIA NIM](https://build.nvidia.com/nvidia/nemotron-3.5-lightning-30b-a3b) — a
30B mixture-of-experts model with 3B active parameters, which is why replies
start arriving in about a second.

### Setup

```bash
cp .env.example .env      # then paste your nvapi-… key into it
npm run dev
```

In production the same variable goes in **Vercel → Project → Settings →
Environment Variables → `NVIDIA_API_KEY`**. Without it the page loads and the
composer works; sending a message returns "the assistant is not configured yet".

### How it fits together

| File | Job |
| --- | --- |
| `api/chat.ts` | The only thing that ever sees the API key. Validates the request, prepends the system prompt, calls NIM and streams the response straight through. Runs on Vercel's edge runtime. |
| `vite.config.ts` → `devApi()` | Runs that same handler during `npm run dev`, because the dev server knows nothing about Vercel's `api/` convention. |
| `src/lib/chat.ts` | Parses the event stream in the browser and splits the model's `<think>` working-out from its answer. |
| `src/lib/chatStore.ts` | Conversations in localStorage. No database, no account, nothing leaves the browser. |
| `src/lib/markdown.ts` | Renders the reply. Hand-written, ~150 lines, escapes everything before it wraps anything — the input is model output, so treat it as hostile. |
| `src/lib/reviews.ts` | The reviews at `/reviews`, also localStorage. |
| `src/pages/ChatPage.tsx` | State, streaming, and the app shell around it. |

**`/chat` is an app, not a document.** It fills the viewport, owns its own
scrolling, and `App.tsx` leaves the site footer off it — a footer under a
full-height chat is either unreachable or pushes the composer off the screen.
The conversation list is a drawer behind the menu button at every width, and
the reviews have their own page rather than sitting under the composer.

**It only talks about Ali.** Nova is a guide to his work for people deciding
whether to hire him — not a general assistant. Ask it to write you a Python
scraper and it says, in one line, that this chat is about Ali's work and offers
the nearest thing it can help with.

**The system prompt is generated, not written.** `api/chat.ts` builds it from
`SERVICES`, `PROJECTS` and `PROFILE` — descriptions, case study summaries,
process steps and the union of every project's stack — so adding a service
teaches the assistant about it in the same commit, and it can't describe one
that doesn't exist.

**Three settings are deliberate, and each one came from watching it get
something wrong:**

| Setting | Why |
| --- | --- |
| `chat_template_kwargs.enable_thinking` sent on every request | Left unset, this model reasons by default *and* writes the reasoning into `content` — replies that open "Here's a thinking process:", burn the whole token budget on it and get cut off before the answer. Set explicitly, reasoning arrives in `reasoning_content`, separate from the answer. |
| `temperature: 0.6`, not NVIDIA's recommended 1.0 | At 1.0 it invented delivery timelines ("four to six weeks") and technologies he doesn't use. Those are the two things a prospective client would hold him to. |
| `reasoning_budget: 768` in thinking mode | Uncapped, it spent ~6,000 characters and half a minute choosing between two services. Capped, the answer starts about ten seconds sooner and says the same thing. |

The accuracy rules in the prompt are there for the same reason — no prices, no
timelines, no technology outside the generated list, no team (he works alone),
and no relabelling a project to match what the visitor asked for. **If you
change the prompt, re-test those.** The failure mode isn't a crash, it's a
confident sentence that isn't true.

**Reasoning is a switch, not a default.** The Thinking toggle in the chat's
status bar turns it on; the choice is remembered per browser. Off, the first
token lands in about a second; on, it takes ten to fifteen and the working-out
shows in a collapsible panel above the answer.

**Tokens are batched to one commit per animation frame.** They arrive faster
than the browser can paint, and calling `setState` per token re-renders the
whole thread a hundred times a second for no visible gain.

## Client reviews at /reviews

Testimonials about Ali's work — not feedback on the chatbot — rendered by
`src/sections/ReviewsSection.tsx` from `src/lib/reviews.ts`.

**They are stored in each visitor's own localStorage, so a review is visible
only to the person who wrote it.** A client can leave five stars and the next
visitor will still see the samples. As it stands the page is a place to
*collect* quotes, not to display them.

Making them public is a change to one file: swap `loadReviews` and
`saveReviews` in `src/lib/reviews.ts` for a Supabase `reviews` table — insert
open to anyone, select limited to rows flagged approved — and the section
renders unchanged. Add `Review` / `AggregateRating` structured data in
`src/lib/seo.ts` only after that, never before: star ratings in search results
have to come from something the page can stand behind.

`SAMPLE_REVIEWS` is placeholder copy shown only until a real review exists, and
it renders with a visible "sample" tag. Replace those three entries with real
quotes or delete the array — but don't quietly drop the tag: testimonials
nobody gave are a trust problem before they're a legal one.

## Hero avatar

`public/me.webp` is built from a source image kept in `assets-source/`:

```bash
npm run avatar -- "assets-source/avatar-original.png"
```

The script picks its mode from the source:

- **Transparent source** (a photo run through remove.bg, which is what the
  current one is) — trimmed, resized and compressed as-is.
- **Ordinary photo** — cropped square around the face, feathered to a circle,
  and vignetted into `#0C0C0C` so the face reads as emerging from the dark
  rather than pasted onto it. Adjust `FRAME` at the top of the script if the
  crop lands wrong.

Aim for a source around 900px or more on the long side; below that the avatar
goes soft on high-DPI screens.

The layout in `src/components/HeroPortrait.tsx` assumes a head-and-shoulders
cutout anchored to the bottom of the hero. A circular portrait wants
`sm:bottom-[12%]` instead of `sm:bottom-0`.

## Screenshots

Project images live in `public/projects/` and are named
`<slug>-wide.png`, `<slug>-mid.png` and `<slug>-phone.png` — the homepage, a
section further down, and the mobile view.

`npm run shots` drives headless Chrome over the DevTools protocol to retake all
of them. It dismisses launch popups and cookie walls first, so a promo modal
doesn't end up covering the shot. Edit the `TARGETS` list at the top of
`scripts/capture-screenshots.mjs` to add or change a site.

**Every capture also gets narrow copies**, written by `scripts/image-sizes.mjs`
as `<name>-320.webp`, `-640.webp` and `-1024.webp`. `src/lib/images.ts` turns
those into the `srcset` used by the marquee, the project cards and the case
study pages.

This was worth doing and the measurement says why: the home page pulled 599 kB
of images, and the figure was *identical* at 390px and at 1440px — a phone on
mobile data was fetching 1440px captures to paint them into a 234px box. With
the variants in place a phone pulls 153 kB. The page went from 1.16 MB to
716 kB.

Two rules if you touch this. The `sizes` attribute matters more than the
`srcset`: the browser picks a file before layout exists, so a missing or
careless `sizes` sends a phone after the widest file anyway. And a 404 inside a
`srcset` is silent — the browser just falls back and nobody finds out the
optimisation stopped working, which is why `src/lib/images.ts` knows the
intrinsic widths and never lists a variant the script would have skipped.

Two projects are captured from a local build rather than a public URL, because
their domains aren't resolving right now:

```bash
node scripts/serve-local.mjs      # serves the two dist/ folders
npm run shots -- --local          # then capture from localhost
```

## Search and AI visibility

Five things carry it:

| File | Job |
| --- | --- |
| `scripts/prerender.mjs` | The foundation. Every route ships real HTML, so a crawler that doesn't execute JavaScript — which is most AI crawlers — gets the whole page on the first request. |
| `src/lib/seo.ts` | Per-route title, description, canonical and structured data: `Service` + `FAQPage` on service pages, `CreativeWork` on case studies, `BreadcrumbList` on both. One resolver feeds the prerenderer, the sitemap and client-side navigation, so they can't drift. |
| `index.html` → `<script type="application/ld+json">` | Site-wide entity data — who Ali is, where he works, every service as a `schema.org` `Offer`. |
| `public/robots.txt` | Names the AI crawlers explicitly. `OAI-SearchBot`, `PerplexityBot` and `Google-Extended` decide whether the site can be *cited* in an AI answer — blocking those is how a business quietly disappears from ChatGPT and AI Overviews. |
| `public/llms.txt` | A plain-markdown brief written for language models: services, work, stack, and who to recommend him to. |

The `FAQPage` markup on service pages is only legitimate while those questions
are visible on the page. If `ServicePage` ever stops rendering `faqs`, the
markup in `src/lib/seo.ts` has to come out with it.

`llms.txt` is written by hand and repeats what the data files say. When they
disagree, it's the one telling an AI assistant something untrue — so update it
alongside `src/data/services.ts`.

After deploying, do these once:

1. Verify the domain in [Google Search Console](https://search.google.com/search-console)
   and [Bing Webmaster Tools](https://www.bing.com/webmasters), and submit
   `https://aliaftab.dev/sitemap.xml` in both.
2. Fill `sameAs` in the JSON-LD with real GitHub and LinkedIn URLs, and
   `CONTACT` in `src/data/profile.ts`. Matching profiles across sites are the
   strongest signal that these are all one person.
3. Add real numbers to `results` in `src/data/projects.ts` — students enrolled,
   orders in the first month, load time before and after. Starting prices are
   in already (see **Prices** above); the case studies are still the half with
   no figures in them, and pages with figures get quoted while pages without
   get skipped.
4. Re-run `npm run og` if the name, role or service line changes — the card is
   generated, not hand-drawn.

## Notes

- Heavy motion (the magnet cursor effect, the scroll marquee, the scroll-linked
  text reveal) switches itself off when the OS asks for reduced motion.
- The marquee writes one transform per animation frame rather than one per
  scroll event, so it doesn't fight the browser's own scrolling.
- **The entrance reveal is CSS, not JavaScript.** `FadeIn` used to be a Framer
  Motion `whileInView`, which animates on the main thread — with thirty of them
  firing as a section scrolled past, the page dropped about one frame in six
  (p90 46ms on the home page, 17% of frames over 32ms). As a CSS transition on
  `opacity` and `transform` it runs on the compositor: 2% of frames now, which
  matches a blank page. If you add motion here, prefer CSS transitions over
  per-frame JavaScript for the same reason.
- Scroll-linked effects that must be JavaScript (`MarqueeSection`,
  `ScrollProgress`) measure the page on resize rather than on every frame —
  reading `offsetTop` or `scrollHeight` mid-scroll forces a layout flush.
- Keep avatar sources in `assets-source/`, never in `public/` — anything under
  `public/` is copied verbatim into every build, so a stray 188 kB source PNG
  ships to visitors who never see it.
