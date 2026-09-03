export type ServiceFaq = { q: string; a: string };

/**
 * One thing the business is losing money or hours to today, and what replaces
 * it. Kept as a pair because the pair is the argument — a list of features
 * tells a prospect what gets built, this tells them why they'd bother.
 */
export type ServiceProblem = { pain: string; fix: string };

export type Service = {
  number: string;
  /** URL segment: /services/<slug> */
  slug: string;
  name: string;
  /**
   * Starting price in rupees — the floor, not the average.
   *
   * This exists so the figure is machine-readable as well as written out in
   * the cost FAQ below. `src/lib/seo.ts` turns it into `PriceSpecification`
   * markup on the service page, which is what puts a number in front of a
   * search engine or an AI assistant answering "what does X cost in Lahore".
   * A price only stated in a paragraph has to be understood; a price in
   * structured data just gets read.
   *
   * The prose in `faqs` still carries the same number by hand, because the
   * sentence around it differs per service. If you change one, change both —
   * and `public/llms.txt` with them.
   */
  startingPkr: number;
  /** One line, shown on the home page list and at the top of the service page. */
  description: string;
  /**
   * Meta description override, used only in `<head>`.
   *
   * Google cuts a description off around 160 characters, and several of these
   * services need more than that to describe themselves properly on the page
   * itself. Rather than shorten copy a visitor reads to suit a snippet, the
   * long ones carry a tightened version here — with the starting price in it,
   * since a number is the part of a snippet that earns the click.
   *
   * Leave it out when `description` is already under ~160 characters.
   */
  metaDescription?: string;
  /** Three or four words each — who should still be reading. */
  idealFor: string[];
  /** The opening paragraphs on the service's own page. */
  intro: string[];
  problems: ServiceProblem[];
  youGet: string[];
  process: { step: string; detail: string }[];
  /**
   * Answered honestly and specifically — these are the paragraphs an AI
   * assistant lifts when someone asks it a question in this shape, and the
   * ones a prospect reads before deciding whether to email.
   *
   * Every service carries a starting price, in rupees with a dollar figure
   * beside it, because a page with numbers on it outranks and out-cites a page
   * without — and because "depends on scope" is what a prospect reads as "he
   * is expensive". They are *starting* prices, deliberately the floor rather
   * than the average, and the copy says so.
   *
   * If these change, change them in three places or they will contradict each
   * other: here, `public/llms.txt`, and any figure quoted in `intro`. The
   * assistant at /chat reads this file directly, so it stays correct on its
   * own.
   */
  faqs: ServiceFaq[];
};

export const SERVICES: Service[] = [
  {
    number: '01',
    slug: 'web-development',
    name: 'Web Development',
    startingPkr: 45000,
    description:
      'Custom sites built with React and TypeScript — no page builders, no template bloat. Fast, typed, and yours to own outright.',
    idealFor: ['No site yet', 'Outgrown a page builder', 'Losing people on mobile'],
    intro: [
      'Most business sites in Pakistan are a theme someone bought, filled with stock photos and left to rot. They load slowly, they break on a mid-range Android, and the person who set them up is unreachable a year later.',
      'I write them from scratch in React and TypeScript instead. That takes longer than dragging blocks around a page builder, and it is worth it for the two things you actually feel: the site is fast on mobile data, and when you want something changed, it can be changed — by me or by whoever you hire next, because the code is plain and it is yours.',
    ],
    problems: [
      {
        pain: 'Your site takes four or five seconds to open on a phone, and most people never wait that long.',
        fix: 'A static build served from a CDN, first paint under a second on mobile data — the difference between an enquiry and a bounce.',
      },
      {
        pain: 'Every small change means messaging whoever set it up, and waiting days for a price.',
        fix: 'Plain typed code in your own repository, and a handover walkthrough of everything you can safely change yourself.',
      },
      {
        pain: 'You look smaller online than you are, so enquiries go to a competitor who does not.',
        fix: 'A site built to your brand rather than a template — the first impression finally matches the business the client meets afterwards.',
      },
    ],
    youGet: [
      'A site built to your brand rather than adapted from a template',
      'Typed React and TypeScript source, in your own Git repository',
      'Fast on a mid-range phone over mobile data, not just on your laptop',
      'Search-engine groundwork done at build time, not bolted on later',
      'Deployed on Vercel with a free SSL certificate and a global CDN',
    ],
    process: [
      {
        step: 'Scope',
        detail:
          'A call to work out what the site has to do — what a visitor should be able to accomplish, and what you should be able to change yourself afterwards.',
      },
      {
        step: 'Design',
        detail:
          'Layout and motion agreed before a line of production code goes in, so revisions happen while they are cheap.',
      },
      {
        step: 'Build',
        detail:
          'Section by section, with a live preview link you can open at any point rather than a reveal at the end.',
      },
      {
        step: 'Launch',
        detail:
          'Domain, SSL, analytics, Search Console, and a handover walkthrough of anything you will want to edit.',
      },
    ],
    faqs: [
      {
        q: 'How long does a site take to build?',
        a: 'A focused marketing or portfolio site is usually two to three weeks from the first call. Anything with accounts, payments or an admin panel is longer — that is a product, not a site, and the honest answer comes after scoping it.',
      },
      {
        q: 'What does a custom website cost?',
        a: 'A focused marketing or portfolio site starts at PKR 45,000 (about $160). Most business sites land between that and PKR 150,000, and three things move the number: how many distinct page layouts there are, whether the content has to be editable by you, and whether anything has to talk to a payment gateway or another system. Send me what you have in mind and you will get one fixed number back rather than an hourly rate.',
      },
      {
        q: 'Do I own the code?',
        a: 'Yes. It goes in your Git repository under your account, deployed to your hosting. There is no licence to keep paying and no lock-in — you can hand it to another developer tomorrow and they will find ordinary React.',
      },
      {
        q: 'Can you work with a design I already have?',
        a: 'Yes. A Figma file, a PDF, or a site you want to work like — any of those is a fine starting point, and it usually shortens the build.',
      },
      {
        q: 'Will it work on WordPress?',
        a: 'No, and that is deliberate. These sites are React applications deployed as static files, which is why they load in under a second and why there are no plugins to update or get hacked. If you specifically need WordPress because your team already edits in it, say so up front and I will tell you honestly whether I am the right person.',
      },
    ],
  },
  {
    number: '02',
    slug: 'ecommerce-development',
    name: 'E-Commerce',
    startingPkr: 95000,
    description:
      'Storefronts with real carts, checkout, order tracking and an admin panel behind them, backed by Supabase and deployed on Vercel.',
    idealFor: ['Selling through DMs', 'Platform fees biting', 'Orders tracked by hand'],
    intro: [
      'Selling through an Instagram DM works until it does not. Somewhere around thirty orders a month, you stop being a shop and start being a person copying addresses into a notebook at midnight.',
      'A proper storefront takes that off you: the customer picks, pays and gets a confirmation, and you get an admin panel that shows what was ordered and what still has to ship. Built on Supabase and deployed on Vercel, so it stays fast and the running cost is close to nothing until real volume arrives.',
    ],
    problems: [
      {
        pain: 'Orders arrive as DMs and get lost between three people and one phone.',
        fix: 'Every order lands in one panel with a status, a customer and a history you can search — nothing depends on remembering.',
      },
      {
        pain: '"Is it in stock?" cannot be answered until somebody walks to the shelf, and the sale cools while they do.',
        fix: 'Live stock on the product page. The question stops being asked, and the order completes itself.',
      },
      {
        pain: 'A platform takes a monthly fee and a cut of every transaction, for as long as you sell.',
        fix: 'The storefront is yours. Hosting stays near-free until real volume arrives, and nobody takes a percentage of it.',
      },
    ],
    youGet: [
      'Product catalogue with categories, search and stock tracking',
      'Cart and checkout that survives a page refresh and a flaky connection',
      'Order management panel — statuses, customer details, history',
      'Local payment options wired up, or cash on delivery done properly',
      'Product pages marked up so they can appear as rich results in Google',
    ],
    process: [
      {
        step: 'Catalogue',
        detail:
          'How your products are actually structured — variants, sizes, stock — modelled before anything is designed around it.',
      },
      {
        step: 'Storefront',
        detail: 'Browsing, product pages, cart and checkout, built mobile-first because that is where the orders come from.',
      },
      {
        step: 'Admin',
        detail: 'The panel you will live in: orders, stock, and adding products without calling me.',
      },
      {
        step: 'Launch',
        detail: 'Payments tested with real transactions, analytics on, and a run-through of your first few orders together.',
      },
    ],
    faqs: [
      {
        q: 'Why not just use Shopify?',
        a: 'If you want to launch this week and never touch the code, use Shopify — I will tell you that for free. A custom build makes sense when the monthly fees and per-transaction cut start to hurt, when you need something the platform will not do, or when you want the storefront to be genuinely yours. Ali Electronics and Nazir & Sons are both in that second category.',
      },
      {
        q: 'Can customers pay online in Pakistan?',
        a: 'Yes — local gateways can be integrated, and cash on delivery is built properly rather than as an afterthought, with order confirmation and status updates so the customer is not left guessing.',
      },
      {
        q: 'Who adds new products?',
        a: 'You do, through the admin panel. That is the point of building one. Bulk import is possible too if you are starting with a large catalogue.',
      },
      {
        q: 'What does a storefront cost to build?',
        a: 'A storefront with a catalogue, cart, checkout and an admin panel behind it starts at PKR 95,000 (about $340). Two things move it: how complicated your catalogue really is — variants, sizes, stock rules — and whether you need an online payment gateway on top of cash on delivery. You get one fixed price after a scoping call, not an hourly rate.',
      },
      {
        q: 'What does it cost to run each month?',
        a: 'Hosting on Vercel and a database on Supabase both have free tiers that a new store comfortably fits inside. Realistically you are paying for a domain and, later, a paid database tier once traffic and order history grow.',
      },
    ],
  },
  {
    number: '03',
    slug: 'mobile-app-development',
    name: 'Mobile Apps',
    startingPkr: 150000,
    description:
      'Cross-platform apps with React Native and Expo — one codebase running on both iOS and Android, sharing the same backend as the web.',
    idealFor: ['Customers who return weekly', 'Push, camera or offline', 'Already have a web app'],
    intro: [
      'Two native apps means two codebases, two sets of bugs and two bills. For most businesses that is not a trade worth making.',
      'React Native and Expo give you one codebase that ships to both the App Store and Play Store, sharing its backend with your website — so a change to your data does not have to be made three times in three places. SpeakLab runs exactly this way: a web app and a companion mobile app over one Supabase backend.',
    ],
    problems: [
      {
        pain: 'Two native builds means two codebases, two bug lists and two invoices for the same feature.',
        fix: 'One React Native codebase ships to both stores and shares the backend your website already runs on.',
      },
      {
        pain: 'Customers forget you exist between one purchase and the next.',
        fix: 'Push notifications you control — restocks, reminders, order updates — arriving on the lock screen rather than in an inbox nobody opens.',
      },
      {
        pain: 'Every small fix waits a week behind an app-store review.',
        fix: 'Over-the-air updates put the small things in front of users the same day.',
      },
    ],
    youGet: [
      'One codebase, both platforms, one set of bugs to fix',
      'Push notifications, camera, location and offline storage as needed',
      'The same backend and data as your website',
      'Over-the-air updates — small fixes ship without an app-store review',
      'Store submission handled, including the parts that get apps rejected',
    ],
    process: [
      { step: 'Scope', detail: 'What genuinely needs to be an app rather than a mobile website — that conversation first, honestly.' },
      { step: 'Build', detail: 'Screens and flows, tested on real devices rather than only in a simulator.' },
      { step: 'Test', detail: 'A TestFlight and Play internal-testing build in your hands well before launch.' },
      { step: 'Ship', detail: 'Store listings, screenshots, review submission, and the fixes that first review usually asks for.' },
    ],
    faqs: [
      {
        q: 'Do I actually need an app?',
        a: 'Often not. If people will visit a few times a year, a fast mobile website beats an app they have to be persuaded to install. Apps earn their keep when you need push notifications, offline use, or hardware like the camera — or when customers open you weekly rather than yearly.',
      },
      {
        q: 'Will it feel like a real app or like a website in a box?',
        a: 'A real app. React Native renders actual native components, so gestures, scrolling and transitions behave the way the platform does. It is not a website wrapped in a shell.',
      },
      {
        q: 'What does an app cost?',
        a: 'A cross-platform app shipping to both stores starts at PKR 150,000 (about $540). Apps cost more than sites for reasons that do not go away: there are two stores to satisfy, real devices to test on, and a review process with its own rules. It costs meaningfully less when the app shares a backend with a site I have already built — at that point most of the work exists and the app is a new front end on it.',
      },
      {
        q: 'How long does app store approval take?',
        a: 'Apple usually reviews within a day or two now, Google similar. The delay is rarely the review itself — it is the first rejection, which is normal, and which I handle as part of the launch.',
      },
      {
        q: 'Can it work with my existing website or system?',
        a: 'If your system has an API, yes. If it does not, that becomes part of the work and I will say so during scoping rather than after.',
      },
    ],
  },
  {
    number: '04',
    slug: 'whatsapp-automation',
    name: 'WhatsApp Automation',
    startingPkr: 35000,
    description:
      'Bots on the official WhatsApp Cloud API — order updates, catalogue browsing, lead qualification and instant replies at 2am, handing off to a human the moment it actually matters.',
    metaDescription:
      'WhatsApp bots on the official Meta Cloud API — instant replies, order updates and lead capture, with clean handoff to a human. From PKR 35,000 in Lahore.',
    idealFor: ['Enquiries arriving at 11pm', 'Same six questions daily', 'Leads lost to slow replies'],
    intro: [
      'In Pakistan the enquiry does not come by email. It comes on WhatsApp, at 11pm, and it says "price?" — and if nobody answers until 10am the next morning, that customer has already asked three other businesses.',
      'A WhatsApp bot on the official Cloud API answers immediately, every time. It sends the catalogue, quotes what it is allowed to quote, takes the order details, tells the customer where their delivery is — and the moment the conversation needs a human, it hands over cleanly with the full history attached, instead of dumping the customer into a menu loop.',
    ],
    problems: [
      {
        pain: 'The message lands at 11pm and gets answered at 10am. By then they have asked three other businesses.',
        fix: 'A useful first reply within seconds, every hour of the day, in Urdu or English — usually the whole reason they pick you.',
      },
      {
        pain: 'Your team spends its day typing the same six answers instead of closing anything.',
        fix: 'Those six get automated first. What reaches a person is a conversation actually worth their time.',
      },
      {
        pain: 'Unofficial WhatsApp tools get numbers banned, usually once the business has come to depend on one.',
        fix: 'The official Meta Cloud API on a verified business number. Unexciting, and it stays switched on.',
      },
    ],
    youGet: [
      'Official WhatsApp Cloud API setup — a verified business number, not an unofficial hack that gets banned',
      'Instant first response, 24 hours a day, in Urdu or English',
      'Catalogue browsing, order capture and delivery status inside the chat',
      'Lead qualification, so your team only picks up conversations worth their time',
      'Clean handoff to a human, with everything the customer already said',
      'Broadcast templates for order updates and offers, within Meta’s rules',
    ],
    process: [
      {
        step: 'Map',
        detail:
          'We read your last two weeks of real WhatsApp chats. The same six questions will be most of them — those are what gets automated first.',
      },
      {
        step: 'Set up',
        detail:
          'Meta Business verification, the Cloud API number, and message templates submitted for approval. This part is paperwork and I do it for you.',
      },
      {
        step: 'Build',
        detail: 'Conversation flows, catalogue, order capture, and the handoff rules that decide when a human is needed.',
      },
      {
        step: 'Watch',
        detail:
          'The first fortnight live is where the real fixes come from — the questions nobody predicted. Those get folded in.',
      },
    ],
    faqs: [
      {
        q: 'Is this the official WhatsApp API or an unofficial workaround?',
        a: 'Official — the WhatsApp Cloud API from Meta. Unofficial tools that automate WhatsApp Web are cheaper and get numbers banned, usually right when the business has come to depend on them. It is not worth it.',
      },
      {
        q: 'Can the bot reply in Urdu?',
        a: 'Yes, and in Roman Urdu, which is how most customers actually type. It can also switch based on what the customer used first.',
      },
      {
        q: 'What happens when the bot cannot answer?',
        a: 'It stops guessing and hands over to a person, passing the whole conversation across. A bot that invents an answer about price or delivery costs you more than having no bot at all, so it is built to say "let me get someone" instead.',
      },
      {
        q: 'What does the setup cost?',
        a: 'Setup starts at PKR 35,000 (about $125). That covers Meta Business verification, the Cloud API number, message templates submitted for approval, the conversation flows for the questions your customers actually ask, and the handoff rules. Bigger builds — live order tracking, a catalogue pulled from your own database, a CRM on the other end — cost more, and get a fixed price once we have read your last two weeks of chats. What Meta charges is separate; see below.',
      },
      {
        q: 'What does WhatsApp itself charge?',
        a: 'Meta bills per conversation, not per message, and the rate depends on category and country — service conversations started by the customer are the cheapest, marketing ones cost more. For most small businesses this lands in the low thousands of rupees a month. That bill is yours directly from Meta; my fee is separate.',
      },
      {
        q: 'Can it take orders and payments?',
        a: 'It can take the order, confirm it, and send a payment link. Full checkout inside the chat is possible but usually a worse experience than sending the customer to a proper checkout page for thirty seconds.',
      },
      {
        q: 'Will customers know it is a bot?',
        a: 'Yes, and they should. Pretending otherwise backfires the moment it slips. Done right, nobody minds — they got an answer at 2am instead of waiting until morning.',
      },
    ],
  },
  {
    number: '05',
    slug: 'ai-call-agents',
    name: 'AI Call Agents',
    startingPkr: 60000,
    description:
      'Voice agents that pick up the phone and make outbound calls in Urdu or English — booking appointments, answering the same twenty questions, and logging every call where your team can see it.',
    metaDescription:
      'AI voice agents that answer and place calls in Urdu or English, book appointments and log every call to your CRM. From PKR 60,000, Lahore and remote.',
    idealFor: ['Clinics and showrooms', 'Calls missed after hours', 'Reminders dialled by hand'],
    intro: [
      'A missed call is a customer who called your competitor thirty seconds later. Most businesses miss a lot of them: during prayers, after closing, when the one person who answers is already on another line.',
      'An AI call agent picks up every one. It answers the routine questions — timings, location, price list, is the item in stock — books appointments straight into your calendar, and writes up what was said afterwards. It can also make outbound calls: appointment reminders, delivery confirmations, following up on leads that went cold.',
    ],
    problems: [
      {
        pain: 'A missed call is a customer who rang your competitor thirty seconds later, and you never find out.',
        fix: 'Every call answered on the first ring — during prayers, after closing, and while your one line is already busy.',
      },
      {
        pain: 'One person answers the phone, and whatever else they were doing stops each time it rings.',
        fix: 'The routine ten questions never reach them. What does reach them arrives with the caller already identified.',
      },
      {
        pain: 'Nobody can remember what was agreed on a call last Tuesday.',
        fix: 'Every call transcribed, summarised and written to your CRM or a sheet your team can search.',
      },
    ],
    youGet: [
      'Inbound calls answered on the first ring, at any hour',
      'Urdu and English, switching to whichever the caller uses',
      'Appointment booking written directly into your calendar',
      'Outbound calling for reminders, confirmations and follow-ups',
      'Every call transcribed, summarised and logged to your CRM or a sheet',
      'Escalation to a real person when the caller asks or the agent is out of its depth',
    ],
    process: [
      {
        step: 'Listen',
        detail:
          'What do people actually ring you about? Usually it is under ten things. That list is the agent’s job description.',
      },
      {
        step: 'Script',
        detail:
          'Voice, tone, greeting, and — most importantly — the boundaries. What it must never quote, promise or decide on its own.',
      },
      { step: 'Wire up', detail: 'Number provisioning, calendar, CRM, and the escalation path to your team.' },
      {
        step: 'Tune',
        detail:
          'Real calls get reviewed together for the first couple of weeks. Accents, interruptions and background noise are where the tuning actually happens.',
      },
    ],
    faqs: [
      {
        q: 'Does it sound like a robot?',
        a: 'It sounds like a clear, calm call-centre voice — good enough that most callers do not comment on it. It is not indistinguishable from a person and I would not sell it that way. What it is, reliably, is better than ringing out.',
      },
      {
        q: 'How well does it handle Urdu and Pakistani accents?',
        a: 'English and Urdu both work. Heavy regional accents and noisy lines are where accuracy drops, which is exactly why the first two weeks are spent listening to real calls and tuning. If your callers are mostly rural and the line quality is poor, I will tell you before you pay for it.',
      },
      {
        q: 'What does it cost to set up?',
        a: 'Setup starts at PKR 60,000 (about $215): the number, the script and the hard limits on what it may never quote or promise, the calendar and CRM wiring, the escalation path to your team, and the first two weeks of tuning against real calls. The per-minute running cost is separate and billed by usage — see the next answer, because for voice that number matters more than the setup fee.',
      },
      {
        q: 'What does it cost to run?',
        a: 'Voice is billed per minute — speech recognition, the language model, the voice itself and the phone line all add up, and it is meaningfully more expensive than a chatbot. Rule of thumb: it pays for itself when a single recovered missed call is worth more than an hour of call time. For a clinic, a showroom or a property office, that maths usually works.',
      },
      {
        q: 'Can it transfer me a call?',
        a: 'Yes. It can hand a live call to a person, or take a message and text your team the summary — whichever fits how you work.',
      },
      {
        q: 'What stops it from promising something wrong?',
        a: 'Hard limits, set during scripting. It works from your actual price list and availability, and anything outside that gets a "let me put you through" rather than a guess. This is the single most important part of the build.',
      },
    ],
  },
  {
    number: '06',
    slug: 'ai-integration',
    name: 'AI Integration',
    startingPkr: 50000,
    description:
      'Chatbots, tutors and assistants powered by modern language models, designed into the product rather than bolted on the side.',
    idealFor: ['Catalogues people cannot decode', 'Repetitive support load', 'An AI feature nobody clicks'],
    intro: [
      'Most "AI features" are a chat bubble in the corner that nobody clicks. The useful ones are the ones sitting where the work already happens.',
      'SpeakLab has an AI tutor students actually practise speaking with. Ali Electronics has an assistant that answers "will this inverter run my house in load-shedding" in plain language instead of showing a spec sheet. Both are grounded in the business’s real data, and both are built to admit when they do not know.',
    ],
    problems: [
      {
        pain: 'A customer cannot tell from a spec sheet whether the thing does what they need, so they leave to think about it.',
        fix: 'An assistant that answers the question they actually asked, in plain language, out of your real catalogue.',
      },
      {
        pain: 'A generic chatbot invents a price, and you either honour it or lose the customer explaining why not.',
        fix: 'Grounded in your data with hard limits, and an honest "I don’t know — here’s who does" everywhere else.',
      },
      {
        pain: 'AI bills that arrive as a surprise at the end of a busy month.',
        fix: 'Keys kept server-side, rate limits and a spend cap set before it ever goes live.',
      },
    ],
    youGet: [
      'An assistant grounded in your own content, not general internet knowledge',
      'Honest failure — "I don’t know, here’s who does" instead of a confident invention',
      'Streaming responses, so it feels instant rather than frozen',
      'API keys kept server-side, never shipped in the browser bundle',
      'Rate limiting and cost caps, so a bad day cannot produce a shocking bill',
    ],
    process: [
      { step: 'Pick the job', detail: 'One task it should do well. Assistants that try to do everything do nothing convincingly.' },
      { step: 'Ground it', detail: 'Your catalogue, documents or policies become what it answers from — a source, not a vibe.' },
      { step: 'Constrain it', detail: 'What it must refuse, what it must escalate, and how it says so.' },
      { step: 'Ship and watch', detail: 'Real conversations get read. That is how you find what it gets wrong.' },
    ],
    faqs: [
      {
        q: 'Which AI model do you use?',
        a: 'Whichever fits the job and the budget — Claude, Gemini and the OpenAI models each win in different places, and cost varies by an order of magnitude between them. The integration is built so the model can be swapped without rewriting the product.',
      },
      {
        q: 'Will it make things up about my business?',
        a: 'That is the risk, and it is handled by grounding: it answers from your data, and where your data is silent it says so and points to a human. An assistant that invents a price has cost you a customer and possibly a refund.',
      },
      {
        q: 'What does an integration cost to build?',
        a: 'An assistant built into a site or app you already have starts at PKR 50,000 (about $180) — picking the one job it should do well, grounding it in your content, the constraints on what it must refuse, and the streaming interface it lives in. It costs more when your data has to be cleaned or converted before anything can be grounded on it, and I will tell you that during scoping rather than after.',
      },
      {
        q: 'How much does it cost to run?',
        a: 'Text assistants are cheap — usually a fraction of a cent per conversation, so a few hundred conversations a month is a rounding error. Costs get real when you process documents or images at volume, and that gets estimated honestly before you commit.',
      },
      {
        q: 'Is my data used to train someone’s model?',
        a: 'Not on business API tiers, which is what these are built on. That is a different arrangement from a free consumer chatbot, and it matters if your data is sensitive.',
      },
    ],
  },
  {
    number: '07',
    slug: 'workflow-automation',
    name: 'Workflow Automation',
    startingPkr: 25000,
    description:
      'The busywork wired together — forms into your CRM, orders into sheets, payments into invoices, alerts into the inbox your team already watches. Built once, running while you sleep.',
    metaDescription:
      'Forms into your CRM, orders into sheets, payments into invoices — running while you sleep. One workflow live in production from PKR 25,000.',
    idealFor: ['Data typed in twice', 'Reports built by hand', 'Afternoons lost to copy-paste'],
    intro: [
      'Every business has someone whose afternoon is spent moving information from one place to another. Copying an order into a spreadsheet. Retyping a form into the CRM. Making an invoice from a payment that already happened.',
      'None of that needs a person. Wired up once, it runs continuously and quietly — and the person gets their afternoon back for work that actually needs a human.',
    ],
    problems: [
      {
        pain: 'Someone on your payroll spends every afternoon moving information between two screens.',
        fix: 'Wired once, it runs continuously — and that afternoon goes back to the work only a person can do.',
      },
      {
        pain: 'Leads and orders fall through the cracks, and you find out about it weeks later.',
        fix: 'Failure handling on every step: a message to a human, and a retry wherever retrying is safe.',
      },
      {
        pain: 'The weekly numbers only exist when somebody remembers to build them.',
        fix: 'Scheduled, generated and delivered to the inbox or group your team already watches.',
      },
    ],
    youGet: [
      'Form submissions landing in your CRM, tagged and assigned',
      'Orders and payments flowing into sheets, invoices and accounts',
      'Alerts where your team already looks — WhatsApp, email, Slack',
      'Scheduled reports that arrive without anyone remembering to build them',
      'Error handling, so a failed step tells someone instead of vanishing',
    ],
    process: [
      { step: 'Find it', detail: 'Half a day watching how the work moves now. The waste is always in the handoffs.' },
      { step: 'Automate the worst one', detail: 'One workflow first, proven in production, before touching the rest.' },
      { step: 'Extend', detail: 'The next-worst, once the first has been running clean for a fortnight.' },
      { step: 'Document', detail: 'A plain-language map of what runs where, so it is not a black box after I leave.' },
    ],
    faqs: [
      {
        q: 'Do I need to change the tools I already use?',
        a: 'Usually not. Most business tools have an API or at least a webhook, and the automation goes around them. Where a tool is genuinely closed, I will say so rather than quietly build something fragile.',
      },
      {
        q: 'What does it cost?',
        a: 'One workflow, built and running in production, starts at PKR 25,000 (about $90). That is deliberately the smallest thing I sell, because it is also the right way to start: automate the worst job first, let it run clean for a fortnight, and only then decide whether the next one is worth paying for. A set of connected workflows is quoted together, after the half day spent watching how the work moves today.',
      },
      {
        q: 'What happens when something breaks?',
        a: 'It tells you. Every workflow has failure handling — a message to a person, a retry where retrying is safe. Silent failure is the one thing worse than manual work, because you find out weeks later.',
      },
      {
        q: 'Is this n8n and Make, or custom code?',
        a: 'Whichever is right. Off-the-shelf tools are faster to set up and easy for you to adjust; custom code is better when the logic is complicated or the volume is high enough that per-run pricing starts to bite.',
      },
    ],
  },
  {
    number: '08',
    slug: 'seo-and-performance',
    name: 'SEO & Performance',
    startingPkr: 30000,
    description:
      'Prerendering, structured data and Core Web Vitals work, so the site loads quickly and actually shows up when someone searches for it.',
    idealFor: ['Invisible on Google', 'Slow on mobile data', 'Paying for ads to compensate'],
    intro: [
      'A site nobody finds is a brochure in a drawer. And speed is not a nice-to-have here: on Pakistani mobile data, a site that takes four seconds has already lost half the people who tapped the link.',
      'This is the unglamorous work — real HTML for crawlers, structured data, image weight, Core Web Vitals, and the technical checks that decide whether Google can index you at all. Nazir & Sons prerenders every route at build time for exactly this reason.',
    ],
    problems: [
      {
        pain: 'You are nowhere for the searches your customers actually type, and you do not know why.',
        fix: 'The technical reasons you cannot rank get removed first — indexing, rendering, structured data — with the measurements to show it.',
      },
      {
        pain: 'Four seconds to load on mobile data, and half the people who tapped the link are already gone.',
        fix: 'Core Web Vitals fixed at the source and images cut to size — usually the single biggest win available.',
      },
      {
        pain: 'You are paying for ads to cover traffic the site should be earning by itself.',
        fix: 'Search traffic that keeps arriving after the invoice stops, rather than the day you pause the campaign.',
      },
    ],
    youGet: [
      'Real HTML served to crawlers instead of an empty JavaScript shell',
      'Structured data so search engines understand what your business is and sells',
      'Core Web Vitals fixed at the source, not patched with a plugin',
      'Images compressed and correctly sized — usually the biggest single win',
      'Search Console and Bing Webmaster set up, verified, sitemap submitted',
      'A written report of what was wrong, what changed, and what to watch',
    ],
    process: [
      { step: 'Audit', detail: 'What is broken, in priority order, with the actual measurements rather than a colour-coded score.' },
      { step: 'Fix the technical', detail: 'Indexing, rendering, speed, structured data — the things that cap everything else.' },
      { step: 'Fix the content', detail: 'Titles, headings and pages that match what people actually search for.' },
      { step: 'Measure', detail: 'Search Console over the following weeks. Rankings move slowly and honestly.' },
    ],
    faqs: [
      {
        q: 'How long before I see results?',
        a: 'Technical fixes show up in weeks — indexing and speed improve quickly. Ranking for competitive terms takes months, and anyone promising page one by next month is selling you something. What you get immediately is a site that is no longer disqualifying itself.',
      },
      {
        q: 'What does it cost?',
        a: 'An audit with the technical fixes actually carried out starts at PKR 30,000 (about $110), including the written report of what was wrong, what changed and what to watch afterwards. Ongoing content work is quoted monthly, and it is only worth starting once the technical floor is fixed — writing pages for a site Google cannot index properly is paying twice for the same traffic.',
      },
      {
        q: 'Can you guarantee first place on Google?',
        a: 'No, and neither can anyone else. What can be guaranteed is that the technical reasons you are not ranking get removed, and that is usually most of the problem for a small business site.',
      },
      {
        q: 'My site is built on WordPress or Shopify — can you still help?',
        a: 'Yes. The audit and the content work apply anywhere. Some deeper fixes are limited by the platform, and I will tell you where that line falls for your setup.',
      },
      {
        q: 'Is this different from running Google Ads?',
        a: 'Completely. Ads stop the day you stop paying; this is the traffic that keeps arriving afterwards. Most businesses want both, and I do not manage ads.',
      },
    ],
  },
  {
    number: '09',
    slug: 'geo-llm-optimisation',
    name: 'GEO & LLM Optimisation',
    startingPkr: 35000,
    description:
      'Generative engine optimisation — entity markup, citable pages and clean crawlable answers, so ChatGPT, Gemini, Perplexity and Google AI Overviews name your business instead of a competitor.',
    metaDescription:
      'Get named by ChatGPT, Gemini and Perplexity: entity markup, citable pages and crawler access audited. GEO from PKR 35,000, Lahore and worldwide.',
    idealFor: ['Categories people now ask AI about', 'Already investing in SEO', 'Willing to move early'],
    intro: [
      'A growing share of "who should I hire for this in Lahore" never reaches a search results page. Someone asks ChatGPT, gets three names, and rings one of them. If you are not one of the three, you never knew the enquiry existed.',
      'Generative engine optimisation is the work of being one of those three. It overlaps with SEO but is not the same thing: AI systems need to be able to crawl you without running JavaScript, to understand what you are as an entity, to find specific quotable facts, and to see you corroborated somewhere other than your own website.',
    ],
    problems: [
      {
        pain: 'Someone asks an assistant who to hire in Lahore, gets three names, and rings one. You never learn the enquiry existed.',
        fix: 'The four things that decide whether you are one of the three: crawlable, identifiable, quotable, corroborated. Each one fixed in turn.',
      },
      {
        pain: 'Your hosting quietly blocks the crawlers that decide those citations — a default nobody chose.',
        fix: 'Crawler access audited and opened at the source, so you stop being invisible to the channel by accident.',
      },
      {
        pain: 'You have no way of telling whether any of this is working.',
        fix: 'A monthly record of what each assistant says about you, plus AI referral traffic tracked in analytics.',
      },
    ],
    youGet: [
      'AI crawler access audited and fixed — most sites silently block the crawlers that decide citations',
      'Entity markup: schema.org data tying your name, location, services and profiles into one identity',
      'An llms.txt brief written for language models to read directly',
      'Content restructured into specific, quotable answers instead of marketing paragraphs',
      'A plan for third-party mentions, which weigh more than anything on your own domain',
      'Tracking for AI referral traffic, so this is measured rather than assumed',
    ],
    process: [
      {
        step: 'Test',
        detail:
          'Ask the assistants what they currently say about you and your competitors. That answer is the baseline, and it is usually uncomfortable.',
      },
      { step: 'Open the doors', detail: 'robots.txt, JavaScript rendering, structured data — the mechanical blockers first.' },
      { step: 'Become quotable', detail: 'Pages restructured so there is a specific sentence worth lifting, with a number in it.' },
      { step: 'Get corroborated', detail: 'Directories, profiles and genuine third-party mentions. This is the slow half, and the half that works.' },
    ],
    faqs: [
      {
        q: 'What is GEO, and is it different from SEO?',
        a: 'GEO is generative engine optimisation: being cited in AI-generated answers rather than ranked in a list of links. It shares the technical foundation with SEO, but the goal differs — search rewards being relevant, AI answers reward being specific, structured and corroborated elsewhere.',
      },
      {
        q: 'Can you actually make ChatGPT recommend my business?',
        a: 'Nobody can force it, and treat anyone who says otherwise carefully. What is genuinely controllable: whether the crawlers can read you at all, whether your identity is unambiguous, whether your pages contain facts worth quoting, and whether other sites confirm you exist. Businesses that get named tend to have all four; most Pakistani small businesses have none.',
      },
      {
        q: 'What does it cost?',
        a: 'A GEO pass starts at PKR 35,000 (about $125): crawler access audited and opened, entity markup tying your name, location, services and profiles into one identity, an llms.txt brief written for models to read directly, and your key pages restructured into answers worth quoting. The third-party corroboration work is quoted separately — it runs over months and it is mostly outreach rather than code.',
      },
      {
        q: 'How do I know whether it worked?',
        a: 'Two ways. Ask the assistants the same questions monthly and record the answers. And watch referral traffic from chatgpt.com, perplexity.ai and the rest in analytics — it is a small number today and rising quickly.',
      },
      {
        q: 'Is it too early to bother with this?',
        a: 'It is early, which is the point. The businesses that are quotable today are the ones being cited while competitors have not noticed the channel exists. It is also cheap right now, because it mostly means fixing structure rather than buying anything.',
      },
      {
        q: 'Does blocking AI crawlers protect my content?',
        a: 'It protects it from being used and from being recommended, both. That is a real trade-off for a publisher whose content is the product. For a business that wants customers, blocking them is close to self-harm — and a lot of sites do it by accident, through a hosting default nobody chose.',
      },
    ],
  },
];

export const SERVICE_BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));
