import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, X, ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../data/profile';

type ContactButtonProps = {
  label?: string;
  className?: string;
  showArrow?: boolean;
  subject?: string;
  whatsappMessage?: string;
  align?: 'start' | 'center' | 'end';
};

export default function ContactButton({
  label = 'Contact Me',
  className = '',
  showArrow = false,
  subject,
  whatsappMessage,
  align = 'end',
}: ContactButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const rawPhone = CONTACT.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    whatsappMessage || 'Hi Ali, I saw your portfolio and want to discuss a project.'
  )}`;
  const mailtoUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    subject || 'Project Inquiry — Ali'
  )}`;

  const alignClass =
    align === 'start'
      ? 'justify-start'
      : align === 'center'
        ? 'justify-center'
        : 'justify-center sm:justify-end';

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="inline-block rounded-full text-white font-medium uppercase tracking-widest
              px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
              text-xs sm:text-sm md:text-base cursor-pointer
              transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background:
                'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
              boxShadow:
                '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
              outline: '2px solid #FFFFFF',
              outlineOffset: '-3px',
            }}
          >
            {label}
            {showArrow && <ArrowUpRight size={17} strokeWidth={2.5} aria-hidden="true" />}
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-wrap items-center gap-2 sm:gap-2.5 ${alignClass}`}
          >
            {/* WhatsApp Pill */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full text-white font-medium uppercase tracking-widest
                px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5
                text-xs sm:text-sm cursor-pointer
                transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background:
                  'linear-gradient(123deg, #052613 7%, #047857 37%, #059669 72%, #10B981 100%)',
                boxShadow:
                  '0px 4px 4px rgba(5, 150, 105, 0.35), 4px 4px 12px #047857 inset',
                outline: '2px solid #FFFFFF',
                outlineOffset: '-3px',
              }}
            >
              <MessageCircle size={17} strokeWidth={2.5} className="shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Email Pill (Exact match to Contact Me style) */}
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-2 rounded-full text-white font-medium uppercase tracking-widest
                px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5
                text-xs sm:text-sm cursor-pointer
                transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background:
                  'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                boxShadow:
                  '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                outline: '2px solid #FFFFFF',
                outlineOffset: '-3px',
              }}
            >
              <Mail size={17} strokeWidth={2.5} className="shrink-0" />
              <span>Email</span>
            </a>

            {/* Close Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-label="Close contact options"
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full
                border border-white/40 bg-black/70 text-white/80 transition-colors
                hover:bg-white/20 hover:text-white active:scale-95 cursor-pointer"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
