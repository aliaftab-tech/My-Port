export const PROFILE = {
  firstName: 'Ali',
  // The hero stays on first-name terms, but the footer and the structured data
  // in index.html both need the full name — a crawler that's told the page
  // belongs to "Ali Aftab" should be able to find that string on the page.
  fullName: 'Ali Aftab',
  role: 'Web Developer',
  location: 'Lahore, Pakistan',

  // Built from a photo by `node scripts/make-avatar.mjs <photo>`. Point this at
  // a different file to swap it; if the file is missing the hero falls back to
  // a gradient sphere, so nothing looks broken in the meantime.
  avatar: '/me.webp',
  heroLine:
    'a web developer in lahore building fast sites, apps and ai automation for businesses that want to be found',
  about:
    "I build websites and apps for businesses in Lahore and beyond — storefronts, learning platforms and AI-powered products — and I automate the parts that eat a whole day: WhatsApp replies, missed calls, follow-ups. I care about what people actually feel: how fast it loads, how it reads on a phone, and whether Google and ChatGPT can find it at all. Let's build something that works.",
};

export const CONTACT = {
  email: 'hello@aliaftab.dev',

  // TODO(Ali): fill these in and they'll appear automatically in the contact
  // section and footer. Leave a value as an empty string to hide that link.
  whatsapp: '', // e.g. '+92 300 1234567'
  github: 'https://github.com/aliaftab-tech',
  linkedin: '', // e.g. 'https://linkedin.com/in/your-handle'
};

// Rooted at "/" rather than bare fragments so the same list works on the home
// page and on a case study three levels down.
export const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Projects', href: '/#projects' },
  // The one part of the site built to be found rather than browsed — someone
  // arrives here from a search, not from the home page.
  { label: 'Writing', href: '/blog' },
  { label: 'Reviews', href: '/reviews' },
  // A whole page rather than a section, but it belongs in the same list — it's
  // the one thing on the site a visitor can use rather than read.
  { label: 'AI Chat', href: '/chat' },
  { label: 'Contact', href: '/#contact' },
];
