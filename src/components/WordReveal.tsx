import { createElement, useEffect, useRef, type CSSProperties } from 'react';
import { observeReveal } from '../lib/reveal';

type WordRevealProps = {
  text: string;
  /** Element type to render, e.g. 'h1', 'h2'. Defaults to a heading. */
  as?: keyof HTMLElementTagNameMap;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between one word and the next. */
  stagger?: number;
  className?: string;
  style?: CSSProperties;
  /** Adds the chrome gradient fill to each word. */
  gradient?: boolean;
};

/**
 * A heading whose words rise into place one after another instead of the whole
 * block fading at once. It costs one observed element and no JavaScript per
 * frame — every word is a CSS transition with its own delay, so the compositor
 * runs the whole thing.
 *
 * The gradient is applied per word rather than to the heading, deliberately:
 * `background-clip: text` on an ancestor of a *transformed* child paints
 * unreliably, and per-word also keeps the fill consistent when a title wraps
 * onto two lines.
 */
export default function WordReveal({
  text,
  as = 'h2',
  delay = 0,
  stagger = 0.055,
  className,
  style,
  gradient = false,
}: WordRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeReveal(el);
  }, []);

  const words = text.split(' ');

  return createElement(
    as,
    {
      ref,
      className: className ? `reveal-words ${className}` : 'reveal-words',
      style,
    },
    words.map((word, i) =>
      createElement(
        'span',
        {
          key: i,
          className: gradient ? 'hero-heading' : undefined,
          style: { '--word-delay': `${delay + i * stagger}s` } as CSSProperties,
        },
        // A trailing space inside the span keeps the gap between words at the
        // font's own word spacing; a gap between inline-blocks would collapse.
        i < words.length - 1 ? `${word} ` : word
      )
    )
  );
}
