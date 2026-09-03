import { useEffect, useRef } from 'react';
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { CONTACT } from '../data/profile';

/**
 * A bar that slides up from the bottom of a phone once the reader is past the
 * hero, so the way to start a conversation is never more than a thumb away on
 * the device most of this site is read on.
 *
 * Hidden from `sm` upwards — a desktop reader has the nav and the closing CTA
 * in comfortable reach, and a permanent bar there just eats the page.
 *
 * It hides itself again near the foot of the page so it never sits on top of
 * the real call to action it is standing in for.
 */
export default function StickyCta({ label = "Start a project" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame: number | null = null;

    const update = () => {
      frame = null;
      const y = window.scrollY;
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - (y + window.innerHeight);

      // Past the hero, but not yet into the closing section.
      const show = y > window.innerHeight * 0.6 && remaining > 560;
      el.classList.toggle('sticky-cta-in', show);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const whatsapp = CONTACT.whatsapp
    ? `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`
    : '';

  return (
    <div
      ref={ref}
      className="sticky-cta fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t
        border-[#D7E2EA]/10 bg-[#0C0C0C]/85 px-4 py-3 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <a
        href={`mailto:${CONTACT.email}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-xs
          font-medium uppercase tracking-widest text-white transition-transform duration-200
          active:scale-[0.98]"
        style={{
          background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
          boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
          outline: '2px solid #FFFFFF',
          outlineOffset: '-3px',
        }}
      >
        {label}
        <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
      </a>

      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message on WhatsApp"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full
            border border-[#D7E2EA]/25 text-[#D7E2EA] transition-colors duration-200
            active:bg-[#D7E2EA]/10"
        >
          <MessageCircle size={19} strokeWidth={2} aria-hidden="true" />
        </a>
      ) : (
        <a
          href={`mailto:${CONTACT.email}`}
          aria-label={`Email ${CONTACT.email}`}
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full
            border border-[#D7E2EA]/25 text-[#D7E2EA] transition-colors duration-200
            active:bg-[#D7E2EA]/10"
        >
          <Mail size={19} strokeWidth={2} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
