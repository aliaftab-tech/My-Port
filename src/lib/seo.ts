import { POSTS, POSTS_BY_DATE, POST_BY_SLUG } from '../data/posts';
import { PROJECTS, PROJECT_BY_SLUG } from '../data/projects';
import { SERVICES, SERVICE_BY_SLUG } from '../data/services';
import { PROFILE, CONTACT } from '../data/profile';

export const SITE = {
  url: 'https://www.aliaftab.dev',
  name: PROFILE.fullName,
  ogImage: '/og-image.png',
} as const;

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Extra structured data for this page, on top of what index.html already carries. */
  jsonLd?: unknown;
};

const abs = (path: string) => `${SITE.url}${path === '/' ? '/' : path}`;

/** Breadcrumbs are what put the "Home › Services › …" trail under a result. */
const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: abs(crumb.path),
  })),
});

function homeMeta(): PageMeta {
  return {
    path: '/',
    title: `${SITE.name} — Full-Stack Engineer | AI & WhatsApp Automation`,
    description:
      'Full-stack software engineer building fast websites, storefronts and mobile apps, plus ' +
      'WhatsApp bots and AI call agents. React, TypeScript and Supabase.',
  };
}

function chatMeta(): PageMeta {
  const path = '/chat';

  return {
    path,
    title: `Ask about ${SITE.name} — AI guide to his work | Nova`,
    description:
      `Ask Nova anything about ${SITE.name}: his background, his projects and what he could ` +
      'build for your business. Answers stream instantly and stay in your browser.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `${abs(path)}#app`,
          name: 'Nova',
          url: abs(path),
          applicationCategory: 'CommunicationApplication',
          browserRequirements: 'Requires JavaScript',
          author: { '@id': `${SITE.url}/#person` },
          description:
            `An AI guide that answers visitors' questions about ${SITE.name} — his background, ` +
            'his projects and his services — built on NVIDIA Nemotron 3.5 Lightning 30B.',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'AI assistant', path },
        ]),
      ],
    },
  };
}

function reviewsMeta(): PageMeta {
  const path = '/reviews';

  return {
    path,
    title: `Client reviews — ${SITE.name}, full-stack engineer`,
    description:
      `What it's like to work with ${SITE.name}: reviews from the businesses he has built ` +
      'websites, storefronts and automation for, and a form to leave your own.',
    // No AggregateRating or Review markup here, deliberately: the ratings live
    // in each visitor's own localStorage, so a star rating in search results
    // would be a number the page cannot stand behind. Add it the day these
    // come from a database of quotes real clients gave — not before.
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Reviews', path },
        ]),
      ],
    },
  };
}

function blogMeta(): PageMeta {
  const path = '/blog';

  return {
    path,
    title: `Writing — ${SITE.name}, full-stack engineer`,
    description:
      'What things cost, what breaks and what is worth paying for — the questions clients ask ' +
      'about websites, apps and automation in Pakistan, answered with numbers.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          '@id': `${abs(path)}#blog`,
          name: `Writing — ${SITE.name}`,
          url: abs(path),
          inLanguage: 'en',
          publisher: { '@id': `${SITE.url}/#person` },
          // Listing the posts here rather than only linking them means a
          // crawler that reads one page of this site gets the whole index.
          blogPost: POSTS_BY_DATE.map((post) => ({
            '@type': 'BlogPosting',
            '@id': `${abs(`/blog/${post.slug}`)}#post`,
            headline: post.title,
            url: abs(`/blog/${post.slug}`),
            datePublished: post.published,
          })),
        },
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Writing', path },
        ]),
      ],
    },
  };
}

function postMeta(slug: string): PageMeta | null {
  const post = POST_BY_SLUG.get(slug);
  if (!post) return null;

  const path = `/blog/${post.slug}`;

  return {
    path,
    title: `${post.title} — ${SITE.name}`,
    description: post.summary,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${abs(path)}#post`,
          headline: post.title,
          description: post.summary,
          url: abs(path),
          // `mainEntityOfPage` is what tells Google this posting *is* the page
          // rather than something the page happens to mention.
          mainEntityOfPage: { '@type': 'WebPage', '@id': abs(path) },
          datePublished: post.published,
          dateModified: post.updated ?? post.published,
          inLanguage: 'en',
          author: { '@id': `${SITE.url}/#person` },
          publisher: { '@id': `${SITE.url}/#person` },
          image: `${SITE.url}${SITE.ogImage}`,
          articleSection: post.topic,
          isPartOf: { '@id': `${abs('/blog')}#blog` },
          ...(post.relatedService
            ? { about: { '@id': `${abs(`/services/${post.relatedService}`)}#service` } }
            : {}),
        },
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Writing', path: '/blog' },
          { name: post.title, path },
        ]),
      ],
    },
  };
}

function serviceMeta(slug: string): PageMeta | null {
  const service = SERVICE_BY_SLUG.get(slug);
  if (!service) return null;

  const path = `/services/${service.slug}`;

  return {
    path,
    title: `${service.name} — ${SITE.name}`,
    description: service.metaDescription ?? service.description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${abs(path)}#service`,
          name: service.name,
          description: service.description,
          serviceType: service.name,
          url: abs(path),
          provider: { '@id': `${SITE.url}/#person` },
          areaServed: [
            { '@type': 'Country', name: 'Pakistan' },
            { '@type': 'Place', name: 'Worldwide (remote)' },
          ],
          // The starting price, machine-readable. `minPrice` rather than
          // `price` because that is what it is — quoting it as a fixed price
          // would be markup the page itself contradicts two paragraphs later.
          //
          // This is generated from `startingPkr` rather than written out, so
          // the number a search engine reads and the number the page shows
          // cannot drift apart. "What does a website cost in Lahore" is a
          // question with buying intent behind it, and most agency sites
          // answer it with "contact us".
          offers: {
            '@type': 'Offer',
            url: abs(path),
            availability: 'https://schema.org/InStock',
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: service.startingPkr,
              priceCurrency: 'PKR',
              valueAddedTaxIncluded: false,
            },
          },
        },
        // Every question below is answered in visible text on the page. Marking
        // up FAQs that aren't on the page is a guidelines violation, so if the
        // page ever stops rendering `faqs`, this has to come out with it.
        {
          '@type': 'FAQPage',
          '@id': `${abs(path)}#faq`,
          mainEntity: service.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        },
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/#services' },
          { name: service.name, path },
        ]),
      ],
    },
  };
}

function caseStudyMeta(slug: string): PageMeta | null {
  const project = PROJECT_BY_SLUG.get(slug);
  if (!project) return null;

  const path = `/work/${project.slug}`;

  return {
    path,
    title: `${project.name} — case study by ${SITE.name}`,
    description: project.caseStudy.metaDescription ?? project.caseStudy.summary,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CreativeWork',
          '@id': `${abs(path)}#work`,
          name: project.name,
          abstract: project.caseStudy.summary,
          url: abs(path),
          creator: { '@id': `${SITE.url}/#person` },
          keywords: project.stack.join(', '),
          ...(project.href ? { sameAs: project.href } : {}),
        },
        breadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/#projects' },
          { name: project.name, path },
        ]),
      ],
    },
  };
}

/**
 * One resolver used by three callers that must never disagree: the prerender
 * script, the client-side title updater, and the sitemap generator.
 */
export function metaForPath(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/') return homeMeta();
  if (path === '/chat') return chatMeta();
  if (path === '/reviews') return reviewsMeta();
  if (path === '/blog') return blogMeta();

  const post = path.startsWith('/blog/') && postMeta(path.slice('/blog/'.length));
  if (post) return post;

  const service = path.startsWith('/services/') && serviceMeta(path.slice('/services/'.length));
  if (service) return service;

  const work = path.startsWith('/work/') && caseStudyMeta(path.slice('/work/'.length));
  if (work) return work;

  return {
    path,
    title: `Page not found — ${SITE.name}`,
    description: 'That page does not exist.',
  };
}

/** Every route the site has, for prerendering and for the sitemap. */
export const ALL_PATHS: string[] = [
  '/',
  '/chat',
  '/reviews',
  '/blog',
  ...POSTS.map((p) => `/blog/${p.slug}`),
  ...SERVICES.map((s) => `/services/${s.slug}`),
  ...PROJECTS.map((p) => `/work/${p.slug}`),
];

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/**
 * The `<head>` block for a page, as a string. The prerender script drops this
 * between the markers in index.html so each route ships with its own metadata
 * in the raw HTML rather than having JavaScript patch it in afterwards.
 */
export function renderHead(meta: PageMeta): string {
  const canonical = abs(meta.path);
  const image = `${SITE.url}${SITE.ogImage}`;
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);

  const tags = [
    `<title>${meta.title.replace(/</g, '&lt;')}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="author" content="${SITE.name}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />',
    `<link rel="canonical" href="${canonical}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE.name}" />`,
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${SITE.name} — full-stack engineer" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];

  if (meta.jsonLd) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`
    );
  }

  return tags.join('\n    ');
}

/**
 * Client-side equivalent, for when someone navigates between routes without a
 * page load. Only touches the tags that actually differ per route — the
 * site-wide identity data in index.html is left alone.
 */
export function applyHead(meta: PageMeta): void {
  document.title = meta.title;

  const set = (selector: string, attr: string, value: string) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  set('meta[name="description"]', 'content', meta.description);
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[property="og:url"]', 'content', abs(meta.path));
  set('link[rel="canonical"]', 'href', abs(meta.path));
}

export const CONTACT_EMAIL = CONTACT.email;
