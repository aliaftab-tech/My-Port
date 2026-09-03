import { useState } from 'react';
import ContactModal from './ContactModal';

type ContactButtonProps = {
  label?: string;
  className?: string;
};

export default function ContactButton({ label = 'Contact Me', className = '' }: ContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-block rounded-full text-white font-medium uppercase tracking-widest
          px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
          text-xs sm:text-sm md:text-base cursor-pointer
          transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${className}`}
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
      </button>

      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
