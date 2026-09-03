import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type MagnetProps = {
  children: ReactNode;
  /** How far outside the element's box the cursor still counts as "near". */
  padding?: number;
  /** Higher = weaker pull. The offset is divided by this. */
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
};

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // No pointer to follow on touch, and nothing to follow if motion is off.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;

    const onMove = (e: MouseEvent) => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;

        const { left, top, width, height } = el.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const withinX = Math.abs(e.clientX - centerX) < width / 2 + padding;
        const withinY = Math.abs(e.clientY - centerY) < height / 2 + padding;

        if (withinX && withinY) {
          setActive(true);
          setOffset({
            x: (e.clientX - centerX) / strength,
            y: (e.clientY - centerY) / strength,
          });
        } else {
          setActive(false);
          setOffset({ x: 0, y: 0 });
        }
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [padding, strength, reducedMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
