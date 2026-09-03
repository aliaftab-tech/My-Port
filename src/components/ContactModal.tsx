import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, Mail, X, Copy, Check, ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../data/profile';

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(CONTACT.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !mounted) return null;

  const rawPhone = CONTACT.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    "Hi Ali, I saw your portfolio and want to discuss a project."
  )}`;
  const mailtoUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    'Project Inquiry — ali'
  )}`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] border border-[#D7E2EA]/20
          bg-[#0e0e12] p-6 shadow-2xl sm:p-8"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(118, 33, 176, 0.18)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full
            border border-[#D7E2EA]/15 text-[#D7E2EA]/60 transition-colors duration-200
            hover:border-[#D7E2EA]/40 hover:bg-white/5 hover:text-[#D7E2EA]"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#B600A8]">
            Direct Contact
          </span>
          <h3
            id="contact-modal-title"
            className="mt-1 font-black uppercase tracking-tight text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)' }}
          >
            Let&apos;s connect
          </h3>
          <p className="mt-1.5 text-xs font-light leading-relaxed text-[#D7E2EA]/70 sm:text-sm">
            Choose your preferred way to connect. I reply personally to every inquiry.
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3.5">
          {/* WhatsApp Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-4 rounded-2xl border
              border-emerald-500/25 bg-emerald-950/20 p-4 transition-all duration-200
              hover:border-emerald-500/50 hover:bg-emerald-950/35 active:scale-[0.99] sm:p-5"
          >
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                bg-emerald-500/20 text-emerald-400 transition-transform duration-200 group-hover:scale-110">
                <MessageCircle size={24} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white sm:text-base">WhatsApp</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-emerald-300">
                    Fastest
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#D7E2EA]/70">
                  {CONTACT.whatsapp} · Instant chat &amp; quick quotes
                </p>
              </div>
            </div>
            <ArrowUpRight
              size={18}
              className="shrink-0 text-emerald-400/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-300"
            />
          </a>

          {/* Email Card */}
          <div
            className="group relative flex flex-col gap-3 rounded-2xl border border-[#D7E2EA]/15
              bg-white/[0.03] p-4 transition-all duration-200 hover:border-[#D7E2EA]/35
              hover:bg-white/[0.05] sm:p-5"
          >
            <a
              href={mailtoUrl}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                  bg-[#7621B0]/25 text-[#D7E2EA] transition-transform duration-200 group-hover:scale-110">
                  <Mail size={24} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white sm:text-base">Email</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-[#D7E2EA]/80">
                      In-Depth
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#D7E2EA]/70">
                    {CONTACT.email}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-[#D7E2EA]/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
              />
            </a>

            {/* Quick Copy Action */}
            <div className="flex items-center justify-between border-t border-[#D7E2EA]/10 pt-2.5">
              <span className="text-[0.7rem] text-[#D7E2EA]/50">
                Detailed briefs, scopes &amp; files
              </span>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D7E2EA]/15
                  bg-white/5 px-2.5 py-1 text-xs font-medium text-[#D7E2EA]/80 transition-colors
                  hover:bg-white/10 hover:text-white cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-5 text-center text-[0.72rem] font-light text-[#D7E2EA]/40">
          Lahore, Pakistan · Available for local &amp; worldwide projects
        </p>
      </div>
    </div>,
    document.body
  );
}
