import { ArrowUpRight } from 'lucide-react';

type LiveProjectButtonProps = {
  href?: string;
  label?: string;
};

export default function LiveProjectButton({
  href,
  label = 'Live Project',
}: LiveProjectButtonProps) {
  const classes = `inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]
    text-[#D7E2EA] font-medium uppercase tracking-widest
    px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base
    transition-colors duration-200 hover:bg-[#D7E2EA]/10`;

  // Projects without a public URL get a non-clickable, dimmed pill instead of
  // a link that goes nowhere.
  if (!href) {
    return (
      <span className={`${classes} opacity-40`} aria-disabled="true">
        Private Build
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {label}
      <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
    </a>
  );
}
