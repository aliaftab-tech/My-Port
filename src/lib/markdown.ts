/**
 * A small markdown renderer, written rather than installed.
 *
 * The model answers in markdown, so the alternative to this file is shipping a
 * parser plus a sanitiser — around 40 kB of JavaScript on a portfolio whose
 * whole point is that it loads fast. This covers what a chat reply actually
 * contains: fenced code, headings, lists, quotes, tables of nothing more
 * exotic than text, links, bold, italic, inline code.
 *
 * Safety rule, and the reason every branch below escapes before it wraps: the
 * input is model output, which is to say text from a stranger. Nothing reaches
 * `dangerouslySetInnerHTML` that hasn't been through `escapeHtml` first, so a
 * reply containing `<img onerror=…>` renders as those characters and does
 * nothing else. If you add a rule here, escape first and wrap second.
 */

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Everything that happens inside a line of text. */
function inline(text: string): string {
  // Code spans are split out first so that `**` inside them stays literal.
  return text
    .split(/(`[^`]+`)/g)
    .map((part) => {
      if (part.length > 1 && part.startsWith('`') && part.endsWith('`')) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      }

      return escapeHtml(part)
        .replace(
          /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|mailto:[^\s)]+)\)/g,
          (_match, label: string, href: string) =>
            href.startsWith('/')
              ? `<a href="${href}">${label}</a>`
              : `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
        )
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>')
        .replace(/~~([^~]+)~~/g, '<s>$1</s>');
    })
    .join('');
}

const FENCE = /^\s*```(\S*)\s*$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const QUOTE = /^\s*>\s?(.*)$/;
const RULE = /^\s*(?:---+|\*\*\*+|___+)\s*$/;

/**
 * Markdown in, HTML string out.
 *
 * Called on every animation frame of a streaming reply, so it stays a single
 * linear pass over the lines — no backtracking, no regex over the whole
 * document, nothing that grows quadratically as the answer gets longer.
 */
export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    // Fenced code. An unclosed fence is normal mid-stream — the block just
    // runs to the end of what has arrived so far and closes itself.
    const fence = FENCE.exec(line);
    if (fence) {
      const language = fence[1];
      const body: string[] = [];
      index += 1;

      while (index < lines.length && !FENCE.test(lines[index])) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1; // The closing fence, or the end of the input.

      const label = language ? `<span class="md-lang">${escapeHtml(language)}</span>` : '';
      out.push(
        `<figure class="md-pre">${label}<pre><code>${escapeHtml(body.join('\n'))}</code></pre></figure>`
      );
      continue;
    }

    if (RULE.test(line)) {
      out.push('<hr />');
      index += 1;
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      // Chat bubbles are small; an h1 inside one looks broken, so everything
      // shifts down two levels and lands somewhere sane.
      const level = Math.min(heading[1].length + 2, 6);
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (BULLET.test(line) || NUMBERED.test(line)) {
      const ordered = !BULLET.test(line);
      const items: string[] = [];

      while (index < lines.length) {
        const match = ordered ? NUMBERED.exec(lines[index]) : BULLET.exec(lines[index]);
        if (!match) break;
        items.push(`<li>${inline(match[1])}</li>`);
        index += 1;
      }

      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    if (QUOTE.test(line)) {
      const quoted: string[] = [];
      while (index < lines.length) {
        const match = QUOTE.exec(lines[index]);
        if (!match) break;
        quoted.push(match[1]);
        index += 1;
      }
      out.push(`<blockquote>${inline(quoted.join(' '))}</blockquote>`);
      continue;
    }

    if (!line.trim()) {
      index += 1;
      continue;
    }

    // Anything left is a paragraph, which runs until a blank line or the start
    // of a block that isn't one.
    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index];
      if (
        !current.trim() ||
        FENCE.test(current) ||
        HEADING.test(current) ||
        BULLET.test(current) ||
        NUMBERED.test(current) ||
        QUOTE.test(current) ||
        RULE.test(current)
      ) {
        break;
      }
      paragraph.push(current);
      index += 1;
    }
    out.push(`<p>${inline(paragraph.join('\n')).replace(/\n/g, '<br />')}</p>`);
  }

  return out.join('');
}
