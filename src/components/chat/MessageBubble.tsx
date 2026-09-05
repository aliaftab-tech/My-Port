import { useMemo, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Bot, Check, Copy, RotateCcw } from 'lucide-react';
import { renderMarkdown } from '../../lib/markdown';
import type { ChatMessage } from '../../lib/chat';
import ThinkingPanel from './ThinkingPanel';

type MessageBubbleProps = {
  message: ChatMessage;
  /** True while this is the reply currently being written. */
  streaming?: boolean;
  onRetry?: () => void;
};

/**
 * One turn of the conversation.
 *
 * The user's words are rendered as plain text — they typed them, they know
 * what they said, and running them through a markdown pass would mangle any
 * code they pasted. The model's reply is rendered as markdown, escaped in
 * `lib/markdown.ts` before anything is wrapped around it.
 */
export default function MessageBubble({ message, streaming, onRetry }: MessageBubbleProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Re-parsing the whole reply on every token is the cost of streaming
  // markdown; memoising means it happens once per rAF-batched update rather
  // than once per re-render of the page around it.
  const html = useMemo(
    () => (message.role === 'assistant' ? renderMarkdown(message.content) : ''),
    [message.role, message.content]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard denied — nothing useful to say about it in the UI.
    }
  };

  /**
   * Links to the site's own pages come out of the markdown renderer as plain
   * anchors, which would reload the whole app. Catching the click here keeps
   * them client-side without the renderer having to know React Router exists.
   */
  const onBodyClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest('a');
    const href = anchor?.getAttribute('href');
    if (!href?.startsWith('/') || event.metaKey || event.ctrlKey) return;

    event.preventDefault();
    navigate(href);
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[86%] rounded-[22px] rounded-br-lg border border-[#D7E2EA]/14
            bg-gradient-to-br from-[#D7E2EA]/[0.12] to-[#D7E2EA]/[0.04] px-4 py-3 text-[15px]
            leading-relaxed text-[#D7E2EA] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]
            sm:max-w-[74%]"
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group/msg flex gap-3">
      <div
        aria-hidden="true"
        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[#D7E2EA]/15"
      >
        <Bot size={16} strokeWidth={2.2} color="#C86BFF" />
      </div>

      <div className="min-w-0 flex-1">
        {message.reasoning ? (
          <ThinkingPanel text={message.reasoning} live={!!streaming && !message.content} />
        ) : null}

        {message.failed ? (
          <p className="flex items-start gap-2 rounded-2xl border border-[#FFB27A]/25 bg-[#BE4C00]/10 px-4 py-3 text-[14px] leading-relaxed text-[#FFC9A3]">
            <AlertCircle size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>{message.content}</span>
          </p>
        ) : message.content ? (
          <div
            onClick={onBodyClick}
            className={`md text-[15px] leading-[1.75] text-[#D7E2EA] ${streaming ? 'md-streaming' : ''}`}
            // Safe by construction: renderMarkdown escapes every character of
            // model output before wrapping any of it in a tag. See lib/markdown.ts.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          // Sent, nothing back yet. Short on this model, but never so short
          // that an empty bubble is the right thing to show.
          <span className="flex items-center gap-2 py-2 text-[#D7E2EA]/40" aria-label="Thinking">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </span>
        )}

        {/* Actions stay out of the way until the reply has finished arriving. */}
        {!streaming && message.content ? (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover/msg:opacity-100">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]
                font-medium uppercase tracking-wider text-[#D7E2EA]/50 transition-colors
                hover:bg-[#D7E2EA]/8 hover:text-[#D7E2EA]"
            >
              {copied ? <Check size={12} strokeWidth={2.4} /> : <Copy size={12} strokeWidth={2} />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]
                  font-medium uppercase tracking-wider text-[#D7E2EA]/50 transition-colors
                  hover:bg-[#D7E2EA]/8 hover:text-[#D7E2EA]"
              >
                <RotateCcw size={12} strokeWidth={2} />
                Retry
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
