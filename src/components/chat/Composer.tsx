import { useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp, Square } from 'lucide-react';

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  streaming: boolean;
  id?: string;
};

const MAX_HEIGHT = 168;

/**
 * The input: one rounded bar with the send button sitting in it.
 *
 * It grows with what's typed up to the height of a short paragraph, then
 * scrolls — a textarea that keeps growing pushes the conversation off the top
 * of the screen, which is worse than a scrollbar.
 */
export default function Composer({ value, onChange, onSubmit, onStop, streaming, id = 'chat-input' }: ComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const adjust = () => {
      if (el.scrollHeight === 0) return; // Ignore when display: none
      // Collapse before measuring, or the height only ever ratchets upwards.
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
      el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
    };

    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, [value]);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter is a newline. `isComposing` matters for IMEs —
    // without it, picking a candidate with Enter would send a half-typed word.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      onSubmit();
    }
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const ready = value.trim().length > 0;

  return (
    <form onSubmit={onFormSubmit} className="composer rounded-[28px] p-[1px]">
      <div className="flex items-end gap-2 rounded-[27px] bg-[#101011]/95 py-2 pl-5 pr-2 backdrop-blur-xl">
        <label htmlFor={id} className="sr-only">
          Message the assistant
        </label>

        {streaming ? (
          <div className="flex-1 flex items-center h-[40px] pl-1">
             <span className="text-[14.5px] font-medium tracking-wide bg-gradient-to-r from-[#D7E2EA]/40 via-[#D7E2EA] to-[#D7E2EA]/40 bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
               Generating response...
             </span>
          </div>
        ) : (
          <textarea
            id={id}
            ref={ref}
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about Ali's work, services or experience…"
            className="chat-scroll block flex-1 resize-none bg-transparent py-2.5 text-[15px]
              leading-relaxed text-[#D7E2EA] outline-none placeholder:text-[#D7E2EA]/32"
          />
        )}

        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="mb-0.5 grid size-10 shrink-0 place-items-center rounded-full border
              border-[#D7E2EA]/25 text-[#D7E2EA] transition-colors duration-200
              hover:bg-[#D7E2EA]/10"
          >
            <Square size={13} strokeWidth={2.5} fill="currentColor" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!ready}
            aria-label="Send message"
            className="send-button mb-0.5 grid size-10 shrink-0 place-items-center rounded-full
              text-[#0C0C0C] transition-all duration-200 disabled:cursor-not-allowed
              disabled:opacity-25"
          >
            <ArrowUp size={18} strokeWidth={2.6} />
          </button>
        )}
      </div>
    </form>
  );
}
