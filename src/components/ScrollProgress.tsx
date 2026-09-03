import { useEffect, useRef } from 'react';

/**
 * A hairline at the top of the window showing how far down the page you are.
 * Long-form pages need it; the home page doesn't, so only the sub-pages use it.
 *
 * Writes one transform per animation frame, and the page height is measured on
 * resize rather than on every frame — reading scrollHeight mid-scroll forces a
 * layout flush, which is exactly the thing that makes a progress bar cost more
 * than it's worth.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number | null = null;
    let max = document.documentElement.scrollHeight - window.innerHeight;

    const update = () => {
      frame = null;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
      onScroll();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left
        bg-gradient-to-r from-[#646973] to-[#D7E2EA]"
      style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      ref={ref}
    />
  );
}
