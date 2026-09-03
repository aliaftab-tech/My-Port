import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { observeReveal } from '../lib/reveal';

type FadeInProps = {
  children: ReactNode;
  /** Element type to render, e.g. 'h1', 'li'. Defaults to a div. */
  as?: keyof HTMLElementTagNameMap;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Fades and slides its children in the first time they scroll into view.
 *
 * The animation itself lives in `.reveal` in index.css — this component only
 * decides when the class goes on. See the note there for why it isn't a
 * Framer Motion animation any more.
 */
export default function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeReveal(el);
  }, []);

  return createElement(
    as,
    {
      ref,
      className: className ? `reveal ${className}` : 'reveal',
      style: {
        ...style,
        '--reveal-x': `${x}px`,
        '--reveal-y': `${y}px`,
        '--reveal-delay': `${delay}s`,
        '--reveal-duration': `${duration}s`,
      } as CSSProperties,
    },
    children
  );
}
