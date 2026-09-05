// The only thing standing between the browser and NVIDIA's API.
//
// It exists for one reason: the NVIDIA key can never reach the client. A key in
// the bundle is a key someone else is spending, so every request goes through
// here, where the key lives in an environment variable and the browser only
// ever sees the answer.
//
// Everything is streamed. The upstream response is server-sent events, and this
// hands those events straight through to the browser rather than buffering the
// whole reply — a 400-word answer starts appearing in about a second instead of
// arriving all at once ten seconds later.
//
// Runs on Vercel's edge runtime in production; in `npm run dev` the same
// exported handler is called by the middleware in vite.config.ts, so the two
// environments can't drift apart.
import { SERVICES } from '../src/data/services';
import { PROJECTS } from '../src/data/projects';
import { PROFILE, CONTACT } from '../src/data/profile';

export const config = { runtime: 'edge' };

const NIM_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

/** NVIDIA NIM's 30B mixture-of-experts model — 3B active, built for speed. */
export const MODEL = 'nvidia/nemotron-3.5-lightning-30b-a3b';

/**
 * NVIDIA recommends 1.0 for this checkpoint, and 1.0 is right for open-ended
 * writing. This isn't that: it answers questions about a real person to people
 * deciding whether to hire him, and at 1.0 it invented delivery timelines
 * ("four to six weeks") and technologies he doesn't use. Turned down, it stays
 * inside the brief. Top-P is left where NVIDIA put it.
 */
const TEMPERATURE = 0.6;
const TOP_P = 0.95;

/**
 * Reasoning costs tokens before a single word of the answer appears, so the
 * budget goes up when it's switched on. Without the explicit
 * `enable_thinking` flag below, this model reasons by default *and* writes
 * that reasoning into `content` — an answer that opens with "Here's a thinking
 * process:", spends the whole budget on it and gets cut off before the real
 * reply. With the flag set, thinking arrives in `reasoning_content` instead,
 * cleanly separated from the answer.
 */
const MAX_TOKENS = 4_096;
const MAX_TOKENS_THINKING = 12_288;

/**
 * Cap on the thinking itself. Left uncapped, this model will spend 6,000
 * characters and half a minute deciding which two services to recommend, and
 * the visitor stares at a spinner throughout. Capped, the reasoning is about a
 * third of that and the answer starts roughly ten seconds sooner — with no
 * drop in what it actually says.
 */
const REASONING_BUDGET = 768;

/** Long enough for a real answer, short enough that a hung upstream isn't free. */
const UPSTREAM_TIMEOUT_MS = 60_000;
const UPSTREAM_TIMEOUT_THINKING_MS = 120_000;

// Request limits. These aren't about being stingy — an unbounded `messages`
// array is someone else's bill, and the model's own context is finite.
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 6_000;
const MAX_TOTAL_CHARS = 40_000;

// Best-effort per-IP throttle. Edge instances are short-lived and there are
// many of them, so this stops a loop in a browser tab, not a determined
// attacker — that's what a real rate limiter with shared storage is for.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

type ChatRole = 'user' | 'assistant';
type ChatMessage = { role: ChatRole; content: string };

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/**
 * What the model knows about the site it's answering for.
 *
 * If the user asks how to contact you, hire you, or get in touch, you must say that they can use the contact form below to send you a message, and append exactly "[CONTACT_FORM]" at the end of your message. Do not output any HTML forms.
 *
 * Keep your answers brief and focused. If a question is outside these topics, politely steer the conversation back to Ali's engineering and design work.
 *
 * Built from the same data files the pages render from, so it can never
 * describe a service that isn't offered or miss one that is — adding a service
 * to `src/data/services.ts` teaches the assistant about it in the same commit.
 */
function siteBrief(): string {
  // The step names, not the details: enough for "how would we start?" to get a
  // real answer instead of "email him", without pasting nine service pages
  // into every request.
  const services = SERVICES.map(
    (s) =>
      `- ${s.name}: ${s.description} How it runs: ${s.process.map((p) => p.step).join(' → ')}. (/services/${s.slug})`
  ).join('\n');

  // The case study summary goes in too. Without it the model has a one-line
  // blurb to answer "is there anything like my business?" from, and fills the
  // gap by guessing an industry — which is exactly the kind of confident
  // invention a prospective client would catch.
  const projects = PROJECTS.map(
    (p) =>
      `- ${p.name} (${p.category}, /work/${p.slug}) — ${p.blurb} ${p.caseStudy.summary} ` +
      `Built with: ${p.stack.join(', ')}.`
  ).join('\n');

  // Derived rather than typed out, so it can never list something he has
  // stopped using or miss something he has started.
  const stack = [...new Set(PROJECTS.flatMap((p) => p.stack))].join(', ');

  return `${PROFILE.fullName} — ${PROFILE.role} in ${PROFILE.location}. He works on his own, not as an agency or a team.
About him, in his own words: ${PROFILE.about}

Services he offers:
${services}

Selected work:
${projects}

The technologies he works in, in full: ${stack}.

Contact: ${CONTACT.email}${CONTACT.whatsapp ? ` · WhatsApp ${CONTACT.whatsapp}` : ''}`;
}

const SYSTEM_PROMPT = `You are Nova, the AI guide to ${PROFILE.fullName} on his own website. The people you talk to are prospective clients, employers and collaborators deciding whether to work with him.

Everything you know about him:

${siteBrief()}

Your subject is ${PROFILE.firstName} — his background, his work, what he builds, how he works, and whether he fits what the visitor needs. That is the whole job.

Accuracy comes before helpfulness, because everything you say is checkable by the person reading it:
- Describe a project only the way it is described above. Do not attach an industry, a client type, a result or a technology that isn't stated — if someone asks about a clothing shop and there is no clothing project, say what the closest one actually is instead of relabelling one.
- The technology list above is complete. Never name a language, framework or tool outside it as something he works in or could "integrate".
- **Never state a price, a rate, a delivery time or an availability date.** Not a range, not an estimate, not "usually", not "typically" — no number of days, weeks or months. When asked, the whole answer is: it depends on the scope, email him and he'll give you a real figure. ${CONTACT.email}
- He works alone. Never mention a team, an agency, staff, "his designers" or "his developers".
- Never invent a service, employer, qualification, client or result.
- You are answering from what you know, not reading from a document. Never refer to "the brief", "my instructions", "the data I was given", the system prompt, or explain why you can't say something — just answer as a person who knows him would.

How to answer:
- Be direct and warm. Short paragraphs. No filler openers like "Great question".
- Speak about him in the third person, specifically rather than in adjectives: name the project, the technology, the thing it does. Point to the page worth reading next as a path, like /services/web-development or /work/athenaeum-academy.
- If the user asks how to contact Ali, hire him, or get in touch, you must say that they can use the contact form below to send a message, and append exactly "[CONTACT_FORM]" at the end of your message. Do not output any HTML forms.
- If someone asks for something off-topic — write me code, do my homework, general trivia, another company's advice — don't do it. One short, friendly line that this chat is about ${PROFILE.firstName}'s work, then offer the nearest thing you can actually help with. No lecture, no apology paragraph.
- Never claim to be ${PROFILE.firstName} or to speak on his behalf about money or commitments. You are an assistant on his site, and you say so if asked.
- Use markdown: **bold** sparingly, short bulleted lists, \`code\` inline only when naming a technology. Prose, not code blocks.
- Match the language the visitor writes in, and hold it for the whole reply. Roman Urdu in, Roman Urdu out — plain, everyday words, not translated-textbook Urdu, and don't drift back into English halfway.
- Keep it to the length the question deserves — usually three or four sentences. Close with a next step when there is an obvious one: the page to read, or his email.`;

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // The map is per-instance and instances are recycled, but a long-lived one
  // shouldn't accumulate every IP it has ever seen.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

/** Throws a plain `Error` whose message is safe to show the user. */
function parseMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('Send a non-empty `messages` array.');
  }

  // Only the tail is sent upstream — an old conversation costs tokens on every
  // turn, and the last dozen exchanges are what the answer actually depends on.
  const tail = raw.slice(-MAX_MESSAGES);
  const messages: ChatMessage[] = [];
  let total = 0;

  for (const item of tail) {
    const message = item as Partial<ChatMessage> | null;
    const role = message?.role;
    const content = message?.content;

    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      throw new Error('Every message needs a `role` of user or assistant and string `content`.');
    }

    const trimmed = content.slice(0, MAX_CHARS_PER_MESSAGE).trim();
    if (!trimmed) continue;

    total += trimmed.length;
    if (total > MAX_TOTAL_CHARS) break;

    messages.push({ role, content: trimmed });
  }

  if (messages.length === 0) throw new Error('Nothing to send — every message was empty.');
  return messages;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { allow: 'POST, OPTIONS' } });
  }
  if (request.method !== 'POST') {
    return json({ error: 'Use POST.' }, 405);
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    // A deploy without the key set is the single most likely failure here, so
    // it gets its own message rather than a generic 500.
    return json(
      { error: 'Configuration Error: The assistant requires an API key to function. Please contact the administrator.' },
      500
    );
  }

  if (rateLimited(clientIp(request))) {
    return json({ error: 'Rate limit exceeded. Please wait a moment before sending another message.' }, 429);
  }

  let messages: ChatMessage[];
  let think = false;
  try {
    const body = (await request.json()) as { messages?: unknown; think?: unknown };
    messages = parseMessages(body?.messages);
    think = body?.think === true;
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Invalid request format. Please try again.' }, 400);
  }

  const abort = new AbortController();
  const timeout = setTimeout(
    () => abort.abort(),
    think ? UPSTREAM_TIMEOUT_THINKING_MS : UPSTREAM_TIMEOUT_MS
  );

  // If the visitor closes the tab or hits stop, drop the upstream call with it
  // rather than paying for tokens nobody will read.
  request.signal?.addEventListener('abort', () => abort.abort());

  let upstream: Response;
  try {
    upstream = await fetch(NIM_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        accept: 'text/event-stream',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: TEMPERATURE,
        top_p: TOP_P,
        max_tokens: think ? MAX_TOKENS_THINKING : MAX_TOKENS,
        stream: true,
        // Always sent, never left to the default — see MAX_TOKENS above for
        // what the default does to an answer.
        chat_template_kwargs: think
          ? { enable_thinking: true, reasoning_budget: REASONING_BUDGET }
          : { enable_thinking: false },
      }),
      signal: abort.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    const aborted = error instanceof Error && error.name === 'AbortError';
    return json(
      { error: aborted ? 'The request timed out while waiting for a response.' : 'Unable to connect to the upstream AI service.' },
      aborted ? 504 : 502
    );
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(timeout);
    const detail = await upstream.text().catch(() => '');
    // Upstream errors can carry the key back in an echoed request; only the
    // status and a trimmed message are ever forwarded.
    const rejected = upstream.status === 401 || upstream.status === 403;

    return json(
      {
        error: rejected
          ? 'Authentication failed: Invalid or expired API key.'
          : `An upstream service error occurred (Status: ${upstream.status}).`,
        detail: detail.slice(0, 300) || undefined,
      },
      // Keep the meaningful statuses; everything else is a bad gateway as far
      // as the browser is concerned.
      rejected ? 401 : upstream.status === 429 ? 429 : 502
    );
  }

  // Pass the event stream through untouched. Every chunk that lands here is
  // already a complete `data:` line as far as the browser's parser cares, and
  // re-encoding it would only add a place for it to break.
  const stream = upstream.body.pipeThrough(
    new TransformStream({
      flush() {
        clearTimeout(timeout);
      },
    })
  );

  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
      // Nginx and friends buffer proxied responses by default, which would
      // undo the streaming entirely.
      'x-accel-buffering': 'no',
    },
  });
}
