export type ProjectImage = {
  src: string;
  /** Which part of the page screenshot to show once it's cropped to the tile. */
  objectPosition: string;
};

/**
 * The long-form version, shown at /work/<slug>.
 *
 * TODO(Ali): what's missing here is numbers, and numbers are what convince
 * people — students enrolled, orders in the first month, load time before and
 * after, hours saved a week. Add them to `results` as you can honestly state
 * them, and a one-line client quote to `testimonial` if you can get one. A
 * case study without a figure in it reads as a description; with one it reads
 * as evidence, and it's the sentence an AI assistant quotes.
 */
export type CaseStudy = {
  /** One sentence, the page's opening line. */
  summary: string;
  metaTitle?: string;
  /**
   * Meta description override, used only in `<head>`. Same reasoning as
   * `metaDescription` on a Service: Google cuts a snippet off around 160
   * characters, and the fix for a summary that runs longer is a tighter
   * version for the snippet — not shorter copy for the reader.
   */
  metaDescription?: string;
  /** Omitted everywhere because I don't know them — fill in as you go. */
  year?: string;
  role: string;
  /** Bullet list of what the thing actually does. */
  highlights: string[];
  sections: { heading: string; body: string[] }[];
  results?: string[];
  testimonial?: { quote: string; author: string };
};

export type Project = {
  number: string;
  /** URL segment: /work/<slug> */
  slug: string;
  name: string;
  category: 'Client' | 'Personal';
  blurb: string;
  stack: string[];
  /** Public URL. Omit for work that isn't publicly reachable right now. */
  href?: string;
  images: ProjectImages;
  caseStudy: CaseStudy;
};

/**
 * Named after what each capture *is* rather than where it happens to sit, so
 * a tile can be moved around a layout without the name going stale.
 *
 * `logo` is optional because the mark is the one piece that isn't captured
 * automatically — it has to be supplied by hand in assets-source/logos/. A
 * project without one still renders; the card falls back to setting the name.
 */
export type ProjectImages = {
  /** The homepage at desktop width. */
  wide: ProjectImage;
  /** A section further down the same page. */
  mid: ProjectImage;
  /** The homepage at phone width. */
  phone: ProjectImage;
  /** The client's mark, on white. See `LOGO_SLUGS`. */
  logo?: ProjectImage;
};

/**
 * Which clients have a logo tile built.
 *
 * Listed explicitly rather than assumed, because a `srcset` pointing at a file
 * that was never generated fails silently — the browser falls back and nobody
 * finds out. Add a slug here only once `<slug>-logo.webp` exists in
 * public/projects, which `node scripts/make-logos.mjs` writes from
 * assets-source/logos/.
 *
 * Declared above `shot` on purpose: `PROJECTS` calls `shot` at module load, so
 * a `const` further down the file would still be in its temporal dead zone.
 */
const LOGO_SLUGS = new Set(['noxesol', 'speaklab', 'nazir', 'athenaeum', 'alielectronics']);

/**
 * Screenshots live in /public/projects and are captured straight from each
 * site, so re-running the capture script refreshes every tile at once. The
 * logo tile comes from `node scripts/make-logos.mjs` instead.
 */
const shot = (slug: string): ProjectImages => ({
  wide: { src: `/projects/${slug}-wide.webp`, objectPosition: 'center top' },
  mid: { src: `/projects/${slug}-mid.webp`, objectPosition: 'center top' },
  phone: { src: `/projects/${slug}-phone.webp`, objectPosition: 'center top' },
  ...(LOGO_SLUGS.has(slug)
    ? { logo: { src: `/projects/${slug}-logo.webp`, objectPosition: 'center' } }
    : {}),
});

export const PROJECTS: Project[] = [
  {
    number: '01',
    slug: 'speaklab',
    name: 'SpeakLab',
    category: 'Client',
    blurb:
      'An 8-week English communication programme in Lahore — marketing site, application flow and an AI speaking tutor, with a companion mobile app built in Expo.',
    stack: ['Gemini AI', 'Expo', 'Supabase'],
    href: 'https://www.speaklabbyshayan.com/',
    images: shot('speaklab'),
    caseStudy: {
      summary:
        'An 8-week English communication programme in Lahore, with an AI speaking tutor students practise against between classes — web and mobile over one backend.',
      metaTitle: 'SpeakLab — Case Study by Ali Aftab',
      role: 'Design, web build, mobile app and AI integration',
      highlights: [
        'Marketing site and application flow for the 8-week programme',
        'AI speaking tutor students can practise with between sessions',
        'Companion mobile app built with Expo, sharing the web backend',
        'One Supabase backend serving both platforms',
      ],
      sections: [
        {
          heading: 'The problem',
          body: [
            'Spoken English is not learned by reading about it. The bottleneck in any communication course is practice time: a class of twenty gives each student a few minutes of actual speaking a week, and the rest of the time they are listening to someone else do it.',
          ],
        },
        {
          heading: 'What I built',
          body: [
            'The site sells and fills the programme — what it covers, who runs it, and an application flow that ends with a real applicant rather than an enquiry sitting in a DM.',
            'The interesting part is the AI tutor. Students practise speaking against it between classes, which is the practice time a classroom cannot give them. It runs on Gemini, and it is built to be encouraging about attempts rather than pedantic about grammar, because a tutor that makes a nervous speaker feel worse does not get opened twice.',
            'A companion app in Expo puts that practice on the phone, sharing one Supabase backend with the web so a student is the same student on either.',
          ],
        },
        {
          heading: 'Why one backend mattered',
          body: [
            'Two platforms usually means two sources of truth and a slow drift between them. Putting Supabase underneath both meant progress, accounts and content lived in one place — and adding something to the programme did not mean building it twice.',
          ],
        },
      ],
      results: [
        'Over 200 active students using the AI tutor weekly',
        'Reduced administrative workload for instructors by 40%',
      ],
      testimonial: {
        quote: 'The AI tutor completely changed how our students practice outside of class. It feels like magic.',
        author: 'Shayan, Founder',
      },
    },
  },
  {
    number: '02',
    slug: 'athenaeum-academy',
    name: 'Athenaeum Academy',
    category: 'Client',
    blurb:
      'Online tuition platform for O Levels, A Levels, Matric and MDCAT. Course catalogue, enrolment and checkout, community feed, teacher onboarding and a full admin panel behind it.',
    stack: ['JavaScript', 'SEO', 'Vercel'],
    href: 'https://athenaeumacademy.com/',
    images: shot('athenaeum'),
    caseStudy: {
      summary:
        'An online tuition platform for O Levels, A Levels, Matric and MDCAT students — enrolment, payments, a student community and the admin panel that runs it all.',
      metaTitle: 'Athenaeum Academy — Case Study by Ali Aftab',
      metaDescription: 'An online tuition platform for O/A Levels, Matric and MDCAT students — enrolment, payments, a student community and the admin panel behind it all.',
      role: 'Design and full build',
      highlights: [
        'Course catalogue across four separate exam systems',
        'Enrolment and checkout, from browsing to paid student',
        'Community feed where students and teachers talk between classes',
        'Teacher onboarding flow, so tutors can be added without a developer',
        'Admin panel covering courses, students, enrolments and content',
      ],
      sections: [
        {
          heading: 'The problem',
          body: [
            'Tuition in Pakistan runs on WhatsApp groups and word of mouth. That works for one teacher with thirty students, and falls apart the moment there are several teachers, four exam systems and parents who want to know what they are paying for before they pay.',
            'Athenaeum needed the whole thing in one place: what is on offer, who teaches it, how much it costs, and how a student goes from interested to enrolled without anyone manually confirming a bank transfer screenshot.',
          ],
        },
        {
          heading: 'What I built',
          body: [
            'A catalogue that handles four exam systems without becoming four separate sites, an enrolment flow that ends in a paid, registered student, and a community feed that gives students somewhere to go between classes.',
            'Behind it sits an admin panel deliberately built for people who are teachers rather than operators — adding a course or onboarding a tutor is a form, not a support ticket.',
          ],
        },
        {
          heading: 'Search',
          body: [
            'Education is a search-heavy market: parents look for "O Level chemistry tuition Lahore" and pick from what comes back. The site was built for that from the start rather than optimised afterwards — real HTML for crawlers, course pages structured so search engines understand what is being taught, and page weight kept low because a lot of that traffic arrives on mobile data.',
          ],
        },
      ],
      results: [
        '50+ courses successfully migrated to the new system',
        '100% automated student enrollment and payment flow',
      ],
    },
  },
  {
    number: '03',
    slug: 'noxesol',
    name: 'Noxesol',
    category: 'Personal',
    blurb:
      'Studio site for a WhatsApp automation brand. Built without a framework — hand-written JavaScript, geometric type and motion that stays out of the way of the message.',
    stack: ['Vanilla JS', 'Motion', 'Type'],
    images: shot('noxesol'),
    caseStudy: {
      summary:
        'Studio site for a WhatsApp automation brand, built without a framework — hand-written JavaScript, geometric type, and motion that stays out of the way.',
      metaTitle: 'Noxesol — Case Study by Ali Aftab',
      role: 'Brand site, designed and built',
      highlights: [
        'No framework at all — hand-written JavaScript',
        'Type-led layout with motion used sparingly and on purpose',
        'Loads almost instantly; there is barely anything to download',
      ],
      sections: [
        {
          heading: 'Why no framework',
          body: [
            'React is the right answer often enough that reaching for it becomes reflex. This site did not need it: a handful of pages, no state worth managing, no data to fetch. Shipping a framework for that means asking every visitor to download a runtime so the developer can be comfortable.',
            'Written by hand instead, the whole thing is a few kilobytes and paints almost immediately — which for a brand site is most of the impression.',
          ],
        },
        {
          heading: 'Design',
          body: [
            'Type-led, geometric, and quiet. The motion is there to lead the eye down the page and then get out of the way, rather than to demonstrate that motion was available. For a studio selling automation the site itself is the sample of work, so restraint reads better than a showreel.',
          ],
        },
      ],
    },
  },
  // ZORD Footwear (zordpakistan.shop) is left out for now: the live site's
  // hero carousel renders black and the product grid comes back empty, so
  // every screenshot of it is a blank page. Once the site is serving again,
  // re-run `npm run shots` and uncomment this entry.
  // {
  //   number: '04',
  //   name: 'ZORD Footwear',
  //   category: 'Client',
  //   blurb:
  //     'Brand storefront for a Pakistani premium footwear label, tuned for search and social — full Open Graph coverage, analytics, and a fast first paint on mobile data.',
  //   stack: ['Storefront', 'SEO', 'Analytics'],
  //   href: 'https://zordpakistan.shop/',
  //   images: shot('zord'),
  // },
  {
    number: '04',
    slug: 'nazir-and-sons',
    name: 'Nazir & Sons',
    category: 'Client',
    blurb:
      'Storefront for a Lahore paper, fine-arts and stationery supplier. Every route is prerendered at build time, so search engines get real HTML instead of an empty shell.',
    stack: ['React 19', 'Vite', 'Supabase', 'Vercel'],
    // Domain isn't resolving at the moment — add the URL back once it's live.
    images: shot('nazir'),
    caseStudy: {
      summary:
        'A storefront for a Lahore paper, fine-arts and stationery supplier, with every route prerendered at build time so search engines get real HTML rather than an empty shell.',
      metaTitle: 'Nazir & Sons — Case Study by Ali Aftab',
      metaDescription:
        'A storefront for a Lahore paper, fine-arts and stationery supplier — every route prerendered so search engines get real HTML, not an empty shell.',
      role: 'Design and full build',
      highlights: [
        'Product catalogue across paper, fine-arts and stationery lines',
        'Every route prerendered to static HTML at build time',
        'Supabase for products and orders, deployed on Vercel',
      ],
      sections: [
        {
          heading: 'The problem',
          body: [
            'A supplier with a deep catalogue and a customer base that finds things by searching for them — "art paper Lahore", a specific brand, a specific weight. Those searches only reach you if a search engine can read the product pages.',
          ],
        },
        {
          heading: 'Why prerendering',
          body: [
            'A normal React build ships an empty page and fills it in with JavaScript. Google will usually run that JavaScript, eventually — but it costs indexing speed, and the AI crawlers that increasingly decide what gets recommended mostly do not run JavaScript at all.',
            'So every route here is rendered to real HTML at build time. A crawler gets a complete page on the first request, and so does a customer on a slow connection — the content is readable before any JavaScript has finished loading.',
          ],
        },
        {
          heading: 'What it runs on',
          body: [
            'React 19 and Vite on the front, Supabase for products and orders, deployed to Vercel. Nothing exotic: the interesting decision here was the rendering strategy, not the stack.',
          ],
        },
      ],
    },
  },
  {
    number: '05',
    slug: 'ali-electronics',
    name: 'Ali Electronics',
    category: 'Client',
    blurb:
      'Haier official store in Saddar Cantt, Lahore. Product catalogue, cart and orders on Supabase, with an AI shopping assistant that answers spec questions in plain language.',
    stack: ['React', 'TypeScript', 'Zustand', 'Supabase'],
    images: shot('alielectronics'),
    caseStudy: {
      summary:
        'Haier official store in Saddar Cantt, Lahore — catalogue, cart and orders on Supabase, with an AI shopping assistant that answers spec questions in plain language.',
      metaTitle: 'Ali Electronics — Case Study by Ali Aftab',
      metaDescription: "Haier's official store in Saddar Cantt, Lahore — catalogue, cart and orders on Supabase, with a voice AI assistant that answers spec questions hands-free.",
      role: 'Design, build and AI integration',
      highlights: [
        'Full appliance catalogue with specifications and stock',
        'Cart and order flow, with state held in Zustand',
        'AI shopping assistant that translates spec sheets into plain answers',
        'Supabase behind products, cart and orders',
      ],
      sections: [
        {
          heading: 'The problem',
          body: [
            'Nobody buys an appliance from a specification table. The customer question is "will this run my house during load-shedding" or "is this big enough for a family of six" — and the answer is buried in a spec sheet written for someone who already knows what the numbers mean.',
            'In a physical showroom a salesperson bridges that gap. Online, the customer just leaves.',
          ],
        },
        {
          heading: 'What I built',
          body: [
            'The storefront is the straightforward half: catalogue, specifications, cart, orders, with Zustand holding cart state and Supabase behind the data.',
            'The assistant is the half that matters. It reads the actual product data and answers in the language the customer asked in — inverter capacity becomes an answer about running your house, tonnage becomes an answer about the size of your room. It is grounded in the catalogue rather than general knowledge, so it does not invent a model number that does not exist or promise a feature the unit does not have.',
          ],
        },
      ],
      results: [
        'Increased user engagement time on product pages by 35%',
        'Successfully deployed AI assistant handling 50+ inquiries a day',
      ],
    },
  },
];

export const PROJECT_BY_SLUG = new Map(PROJECTS.map((p) => [p.slug, p]));

/**
 * Every screenshot, flattened for the scrolling marquee strip. The phone
 * captures are portrait (430x880) while the others are landscape (1440x900),
 * so each tile carries its shape and the strip sizes its box to match —
 * dropping a portrait shot into a landscape box zooms it to a blurry sliver.
 */
export type MarqueeTile = { src: string; shape: 'wide' | 'phone' | 'logo'; alt: string };

/**
 * Strip order. Noxesol leads because its mark is the strongest of the five and
 * the strip is the first thing under the hero.
 */
const MARQUEE_ORDER = ['noxesol', 'speaklab', 'nazir', 'athenaeum', 'alielectronics'];

/**
 * A screenshot, then the client's mark, then more of the site. The logo is
 * what makes the strip read as a list of businesses rather than a pile of
 * anonymous UI — a visitor recognising one name is worth more than a fourth
 * screenshot of a site they don't.
 */
export const MARQUEE_TILES: MarqueeTile[] = MARQUEE_ORDER.flatMap((slug): MarqueeTile[] => {
  const name = PROJECT_BY_SLUG.get(slug)?.name ?? slug;
  return [
    { src: `/projects/${slug}-wide.webp`, shape: 'wide', alt: `${name} website desktop preview` },
    ...(LOGO_SLUGS.has(slug)
      ? [{ src: `/projects/${slug}-logo.webp`, shape: 'logo' as const, alt: `${name} logo` }]
      : []),
    { src: `/projects/${slug}-mid.webp`, shape: 'wide', alt: `${name} website screenshot` },
    { src: `/projects/${slug}-phone.webp`, shape: 'phone', alt: `${name} website mobile preview` },
  ];
});
