export type PostSection = {
  heading: string;
  body: string[];
  /** Bullets after the prose, where a list genuinely reads better than a paragraph. */
  list?: string[];
};

/**
 * A written piece at /blog/<slug>.
 *
 * These exist to be found, and they are aimed at the searches this site can
 * realistically win: specific questions with a buyer behind them, not "web
 * developer lahore". A one-person site does not outrank an agency on a head
 * term for years, but almost nobody is answering "what does a website actually
 * cost in Pakistan" with a number — and that is the search with the client in
 * it.
 *
 * The rule for anything added here: it has to be true, and it has to be
 * something Ali can defend on a call. No invented client figures, no claims
 * the service pages do not already stand behind. A post that wins a click and
 * loses the trust in the first meeting has cost more than it earned.
 */
export type Post = {
  /** URL segment: /blog/<slug> */
  slug: string;
  title: string;
  /** One sentence. The meta description, and the opening line on the page. */
  summary: string;
  /**
   * ISO date, and it has to be the real one.
   *
   * TODO(Ali): these are all set to the day the section was built. Set each to
   * the date the post actually goes live — `datePublished` ships in the
   * BlogPosting markup, so a wrong date here is a wrong date in Google's index,
   * and a post that claims to be older than the domain is a bad first
   * impression to give a crawler.
   */
  published: string;
  updated?: string;
  /** Rounded reading time, shown beside the date. */
  minutes: number;
  /** Two or three words, used to group the index. */
  topic: string;
  /** The opening paragraphs, before the first heading. */
  intro: string[];
  sections: PostSection[];
  /** Slug from SERVICES — where a convinced reader should go next. */
  relatedService?: string;
};

export const POSTS: Post[] = [
  {
    slug: 'what-a-website-costs-in-pakistan',
    title: 'What a website actually costs in Pakistan',
    summary:
      'Real starting figures for a custom site, a storefront and an app in Pakistan, what moves each number, and why the cheapest quote is usually the most expensive one.',
    published: '2026-08-14',
    minutes: 7,
    topic: 'Pricing',
    intro: [
      'Ask a developer what a website costs and you will usually be told it depends on scope. That is true, and it is useless — you asked because you are trying to work out whether this is a PKR 20,000 conversation or a PKR 200,000 one, and "it depends" does not tell you which room you are standing in.',
      'So here are the actual numbers I work from, what makes each one move, and the part nobody puts in writing: what you are really buying at each level.',
    ],
    sections: [
      {
        heading: 'The honest range',
        body: [
          'These are starting prices — the floor for the smallest honest version of each thing, not an average. A bigger scope costs more and gets quoted as one fixed number after a call, never as an hourly rate.',
        ],
        list: [
          'A focused marketing or portfolio site — from PKR 45,000. Most business sites land between that and PKR 150,000.',
          'An online store with a cart, checkout and an admin panel — from PKR 95,000.',
          'A cross-platform mobile app on both stores — from PKR 150,000.',
          'A WhatsApp automation setup — from PKR 35,000, plus what Meta bills you per conversation.',
          'One automated workflow, live in production — from PKR 25,000.',
        ],
      },
      {
        heading: 'What actually moves the number',
        body: [
          'Three things, in roughly this order of impact.',
          'The first is how many genuinely different page layouts there are. Twelve pages that share one template is a small job. Four pages that each look and behave differently is a bigger one. People tend to count pages; count layouts instead and your own estimate gets much closer.',
          'The second is whether you need to change the content yourself. A site where the text is in the code is cheaper to build and means emailing me every time a price changes. A site with an admin panel behind it costs more up front and costs nothing every time after. Which one is right depends entirely on how often your content actually moves.',
          'The third is whether anything has to talk to something else — a payment gateway, a courier API, an accounting system, your existing database. Every integration is a second system that can change without warning, and that is where the real work hides.',
        ],
      },
      {
        heading: 'Why the PKR 10,000 site is the expensive one',
        body: [
          'Those quotes are real and you will find plenty of them. What you get is usually a purchased theme with your logo dropped into it, filled with stock photos, on hosting nobody will explain to you.',
          'The cost is not in what you paid. It is in what happens next. The person who set it up stops replying within a year — not out of malice, it just was not a job worth staying available for at that price. Now you need a change, and the next developer opens it, finds a theme they do not know layered with plugins they cannot audit, and quotes you more to work inside it than to start again. That quote is the real price of the first one.',
          'The other cost is slower and worse: it is slow on a mid-range Android over mobile data, which is how most of your customers will meet it. A site that takes four or five seconds to open has already lost about half the people who tapped the link, and you will never see them in any report, because they left before anything could count them.',
          'I am not arguing everyone needs a custom build. If you need a page up this week and you will never touch it again, buy the theme — I will tell you that for free. But the low quote is not a cheaper version of the same thing, and it is worth knowing that before you compare them side by side.',
        ],
      },
      {
        heading: 'What you should be paying for',
        body: [
          'Whoever you hire, four things are worth holding out for, because they are the ones that are expensive to add later and cheap to ask for now.',
        ],
        list: [
          'The code in your own repository, under your account. No licence to keep paying, no lock-in, and the next developer can pick it up.',
          'Fast on a mid-range phone over mobile data — not fast on the developer\'s laptop on office wifi.',
          'Search groundwork done at build time rather than bolted on afterwards, so you are findable from launch instead of six months in.',
          'A handover walkthrough of everything you can safely change yourself.',
        ],
      },
      {
        heading: 'What it costs to keep running',
        body: [
          'Less than most people expect, and it is worth separating from the build cost when you are comparing quotes.',
          'Hosting on a modern static host has a free tier that a new business site fits inside comfortably, with an SSL certificate and a global CDN included. A database has one too. Realistically you are paying for a domain, and later for a paid database tier once your traffic and order history grow enough to need it.',
          'If someone quotes you a monthly hosting fee for a small brochure site, ask what it is for. Sometimes there is a real answer. Often it is a line item that exists because it always has.',
        ],
      },
      {
        heading: 'How to get a number out of anyone',
        body: [
          'Send three things and almost any developer can give you a fixed price rather than a range: what a visitor should be able to accomplish on the site, what you need to be able to change yourself afterwards, and a link to one site you want yours to work like.',
          'That last one does more than the first two combined. "Like this, but for my business" removes most of the ambiguity that makes people hedge.',
        ],
      },
    ],
    relatedService: 'web-development',
  },
  {
    slug: 'whatsapp-automation-that-does-not-get-you-banned',
    title: 'The WhatsApp automation that gets your number banned',
    summary:
      'The difference between the official WhatsApp Cloud API and the cheap tools that automate WhatsApp Web — and why the second kind fails at the worst possible moment.',
    published: '2026-08-14',
    minutes: 6,
    topic: 'Automation',
    intro: [
      'In Pakistan the enquiry does not arrive by email. It arrives on WhatsApp, at 11pm, and it says "price?" — and if nobody answers until 10am, that customer has already asked three other businesses.',
      'So automating WhatsApp is one of the highest-return things a small business here can do. It is also where I see the most expensive mistake, and it is a mistake that looks like a saving right up until the day it is not.',
    ],
    sections: [
      {
        heading: 'There are two completely different products',
        body: [
          'Both get sold as "WhatsApp automation" and they are not the same category of thing.',
          'The first is the official WhatsApp Cloud API from Meta. You verify your business, you get a verified business number, and you send and receive messages through an interface Meta built for exactly this. It is unglamorous and it stays switched on.',
          'The second is a tool that automates WhatsApp Web — software that drives the browser interface the way a very fast person would. It is cheaper, it sets up in an afternoon, and it does not require verifying anything. It is also against WhatsApp\'s terms, and the enforcement is not a warning.',
        ],
      },
      {
        heading: 'Why the cheap one fails at the worst moment',
        body: [
          'Numbers running unofficial automation get banned. Not always immediately — that is the trap. The pattern I see is that it works fine for months, the business quietly builds its whole enquiry flow around it, and the ban lands once there is real volume going through it.',
          'And it is the number that gets banned. Not the software. The number on your shopfront, your van, your Instagram bio, your printed cards — the one your existing customers have saved. You do not lose an automation tool that day, you lose the address your business is reachable at.',
          'That is why the price difference is not really a price difference. You are being quoted for two different risk profiles and only one of them is on the invoice.',
        ],
      },
      {
        heading: 'What the official one actually costs',
        body: [
          'This is the part people find genuinely surprising, so it is worth being specific.',
          'Meta bills per conversation, not per message. A conversation is a 24-hour window, so a customer who sends you fifteen messages in an evening is one conversation, not fifteen. The rate depends on category and country: service conversations, the ones your customer starts, are the cheapest. Marketing ones you start cost more.',
          'For most small businesses this lands in the low thousands of rupees a month. That bill comes to you directly from Meta, and it is separate from whatever you pay whoever builds the thing.',
          'The setup work — business verification, the Cloud API number, message templates submitted for approval — is mostly paperwork, and it is the part worth paying someone to do because the template approval process is fussy in ways that are not documented anywhere useful.',
        ],
      },
      {
        heading: 'Automate the six questions first',
        body: [
          'The instinct is to build a bot that can handle everything. Do not. Go and read your last two weeks of real WhatsApp chats instead, and count.',
          'It will be the same six questions, over and over: what does it cost, do you have it in stock, where are you, what are your timings, where is my order, do you deliver to my area. Those six are most of your message volume and none of them need a person.',
          'Automate exactly those, and what reaches your team is the conversation actually worth their time. That is the whole return, and you get it in the first fortnight — long before anything clever.',
        ],
      },
      {
        heading: 'The handoff is the entire product',
        body: [
          'A bot that cannot answer has two options and only one of them is survivable.',
          'It can guess, which means one day it quotes a price you do not honour or promises a delivery date you cannot meet. Now you either eat the cost or spend the conversation explaining why your own system was wrong. That bot has cost you more than having no bot at all.',
          'Or it can stop, say a person will pick this up, and hand over with the whole conversation attached so the customer does not have to repeat themselves. That is the bit worth building carefully, and it is the bit most cheap builds skip, because it is invisible in a demo.',
          'One more thing, since it comes up every time: yes, customers should be able to tell it is a bot, and no, they do not mind. Pretending otherwise backfires the moment it slips — and nobody who got a real answer at 2am has ever complained that it was automated.',
        ],
      },
    ],
    relatedService: 'whatsapp-automation',
  },
  {
    slug: 'why-chatgpt-has-never-heard-of-your-business',
    title: 'Why ChatGPT has never heard of your business',
    summary:
      'A growing share of "who should I hire in Lahore" never reaches a search page. What decides whether an AI assistant names your business — and how to check today.',
    published: '2026-08-14',
    minutes: 6,
    topic: 'Search & AI',
    intro: [
      'Someone needs what you sell. They open ChatGPT instead of Google, type "who should I hire for this in Lahore", get three names, and ring one of them.',
      'If you are not one of the three, nothing happened. There is no impression to look at, no bounce to explain, no line in any report. You simply never learned the enquiry existed. That is a different kind of invisible from ranking tenth, and it is growing.',
    ],
    sections: [
      {
        heading: 'Four things decide whether you get named',
        body: [
          'This overlaps with SEO but it is not the same job. Search rewards being relevant. AI answers reward being legible — an assistant has to be able to read you, work out what you are, find something specific enough to repeat, and see it confirmed somewhere that is not your own website.',
        ],
        list: [
          'Crawlable — an AI crawler can read the page without running JavaScript.',
          'Identifiable — your name, location and services are structured data, not just words in a design.',
          'Quotable — there is a specific sentence worth lifting, and it has a number in it.',
          'Corroborated — something other than your own site says you exist.',
        ],
      },
      {
        heading: 'Most sites fail the first one by accident',
        body: [
          'Modern sites are usually built as applications: the server sends an almost empty page and JavaScript fills it in. Google will generally run that JavaScript eventually. Most AI crawlers will not — they request the page, get a shell with nothing in it, and move on.',
          'So a site can be beautiful, fast, well-written and completely blank to the systems increasingly deciding who gets recommended. The fix is to render the pages to real HTML at build time, which is a change in how the site is deployed rather than a change to the site.',
          'The second accidental failure is robots.txt. Plenty of sites block AI crawlers without anyone having decided to — it arrives as a hosting default or a plugin setting. Worth knowing: the crawlers that decide whether you can be *cited* in an answer are not the same ones that gather training data. Blocking the first group is how a business quietly disappears from AI answers. For a publisher whose content is the product, that trade-off is real. For a business that wants customers, it is close to self-harm.',
        ],
      },
      {
        heading: 'Being quotable means having numbers',
        body: [
          'Read your own services page as though you were an assistant trying to summarise it for someone. Most read like this: "We deliver innovative solutions tailored to your business needs." There is nothing in that to repeat. Nothing is specific enough to be wrong, which is exactly why nothing is specific enough to be quoted.',
          'What gets lifted is the sentence with a figure in it. A starting price. A timeline. A number of something. That is also why so few businesses get quoted — the specific sentence is the one that commits you to something, and most marketing copy is written to avoid exactly that.',
          'You do not have to publish everything. But one page with real numbers on it will get cited more than ten pages of careful, unfalsifiable copy.',
        ],
      },
      {
        heading: 'Corroboration is the slow half, and the half that works',
        body: [
          'Everything above is on your own site, which means everything above is a claim. Assistants weigh confirmation from somewhere else much more heavily, for the obvious reason.',
          'That means the boring things: a complete Google Business Profile, real directory listings, profiles on the platforms you actually use, and mentions on sites you do not control. It is slower than the technical work and it is mostly not code. It is also the part that separates the businesses getting named from the ones that fixed their markup and waited.',
        ],
      },
      {
        heading: 'How to check where you stand',
        body: [
          'Two things, and the first one takes five minutes.',
          'Ask the assistants directly. Open ChatGPT, Gemini and Perplexity and ask each what they know about your business, then ask who they would recommend for what you do in your city. Write down what comes back. That is your baseline, and it is usually uncomfortable — most Pakistani small businesses get a polite "I could not find information about this."',
          'Then watch your referral traffic for chatgpt.com, perplexity.ai and the rest. It is a small number today. It is rising, and it is the only way to tell whether any of this worked rather than assuming.',
          'Do that first, before paying anyone for anything. It costs nothing and it tells you whether you have a problem worth spending on.',
        ],
      },
    ],
    relatedService: 'geo-llm-optimisation',
  },
];

export const POST_BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]));

/** Newest first — the order the index and the sitemap both use. */
export const POSTS_BY_DATE = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));
