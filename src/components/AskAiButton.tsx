import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PROFILE } from '../data/profile';

/**
 * The way in to the assistant, wherever someone happens to be standing.
 *
 * Deliberately quieter than the contact button next to it: emailing is still
 * the thing worth doing, and this is for the visitor who has questions first.
 */
export default function AskAiButton({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/chat"
      className={`group inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25
        bg-[#0C0C0C]/60 px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]
        backdrop-blur-sm transition-colors duration-300 hover:border-[#D7E2EA]/60
        hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3 sm:text-sm ${className}`}
    >
      <Sparkles
        size={15}
        strokeWidth={2.2}
        aria-hidden="true"
        className="text-[#C86BFF] transition-transform duration-500 group-hover:rotate-12"
      />
      Ask about {PROFILE.firstName}
    </Link>
  );
}
