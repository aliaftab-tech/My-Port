import { useState } from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  value: number;
  /** Leave out for a read-only display. */
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
};

/**
 * Five stars, read-only or clickable depending on whether `onChange` is passed.
 *
 * The interactive version is a radiogroup rather than five buttons, so the
 * keyboard behaviour a screen reader announces matches what it actually is:
 * one choice out of five, not five separate actions.
 */
export default function StarRating({ value, onChange, size = 16, className }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  if (!onChange) {
    return (
      <span
        className={`inline-flex items-center gap-0.5 ${className ?? ''}`}
        aria-label={`${value} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            strokeWidth={1.8}
            aria-hidden="true"
            className={star <= value ? 'text-[#FFB27A]' : 'text-[#D7E2EA]/18'}
            fill={star <= value ? 'currentColor' : 'none'}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      role="radiogroup"
      aria-label="Rating"
      // No gap: the padding on each button below supplies the spacing now, and
      // keeping both would push the row wider than it was.
      className={`inline-flex items-center ${className ?? ''}`}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          // The padding is the tap target. A bare 22px star is under the 24px
          // minimum, and this is the one control on the page a visitor has to
          // hit accurately — miss it and they have rated the wrong number.
          className="rounded p-1 transition-transform duration-200 hover:scale-110"
        >
          <Star
            size={size}
            strokeWidth={1.8}
            aria-hidden="true"
            className={star <= shown ? 'text-[#FFB27A]' : 'text-[#D7E2EA]/22'}
            fill={star <= shown ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </span>
  );
}
