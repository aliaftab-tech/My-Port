import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * A bordered panel with a soft highlight that follows the cursor across it.
 *
 * The pointer position is written straight to the element's own custom
 * properties — no React state, so moving the mouse never re-renders anything,
 * and the highlight is a `radial-gradient` on a pseudo-element whose opacity is
 * all that transitions. Touch devices never fire `pointermove` without a press,
 * so they simply get the plain card, and `prefers-reduced-motion` is handled in
 * CSS alongside the rest of the page's motion.
 */
export default function SpotlightCard({ children, className, style }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;

    const { clientX, clientY } = event;
    if (frame.current !== null) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${clientX - rect.left}px`);
      el.style.setProperty('--spot-y', `${clientY - rect.top}px`);
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={className ? `spotlight ${className}` : 'spotlight'}
      style={style}
    >
      {children}
    </div>
  );
}
