import { Brain, ChevronDown } from 'lucide-react';

/**
 * The model's working-out, folded away.
 *
 * Nemotron emits its reasoning separately from its answer, and it's genuinely
 * interesting — but it's three times the length of the reply and reads like a
 * draft, so it arrives collapsed and stays that way unless someone asks.
 */
export default function ThinkingPanel({ text, live }: { text: string; live: boolean }) {
  return (
    <details className="think group/think mb-3 rounded-2xl border border-[#D7E2EA]/12 bg-[#D7E2EA]/[0.03]">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 text-[11px]
          font-medium uppercase tracking-[0.14em] text-[#D7E2EA]/55 transition-colors
          hover:text-[#D7E2EA]/85"
      >
        <Brain size={13} strokeWidth={2} aria-hidden="true" className={live ? 'think-pulse' : ''} />
        {live ? 'Thinking' : 'Thought process'}
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden="true"
          className="think-caret ml-auto opacity-60"
        />
      </summary>

      <div className="think-body">
        <div>
          <p className="whitespace-pre-wrap px-3.5 pb-3.5 text-[13px] leading-relaxed text-[#D7E2EA]/50">
            {text}
          </p>
        </div>
      </div>
    </details>
  );
}
