import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Brain, Menu, RotateCcw, Sparkles, X } from 'lucide-react';
import Logo from '../components/Logo';
import ChatSidebar from '../components/chat/ChatSidebar';
import Composer from '../components/chat/Composer';
import MessageBubble from '../components/chat/MessageBubble';
import { PROFILE } from '../data/profile';
import {
  ChatError,
  MODEL_LABEL,
  makeMessage,
  streamChat,
  toWire,
  type ChatMessage,
} from '../lib/chat';
import {
  GREETING,
  emptyConversation,
  loadConversations,
  loadThinking,
  saveConversations,
  saveThinking,
  titleFrom,
  type Conversation,
} from '../lib/chatStore';

/**
 * Short openers, in the shape a prospective client actually arrives with —
 * "can you build my thing" rather than "write me a function".
 */
const SUGGESTIONS = [
  'What kind of work does Ali do?',
  'Can he build an online store for my business?',
  'Ali ke saath project kaise shuru karein?',
  'Show me work like the thing I need',
];

/**
 * The assistant, as a full-screen app rather than a page.
 *
 * Nothing scrolls except the conversation: the header, the status strip and
 * the composer are pinned, which is what makes it feel like a thing you use
 * instead of a section you scroll past. The reviews live at /reviews for the
 * same reason — a review form under a chat window is a page about two things.
 */
export default function ChatPage() {
  // Starts as one empty chat so the prerendered HTML and the first client
  // render agree. Anything stored arrives in the effect below, after hydration.
  const [conversations, setConversations] = useState<Conversation[]>(() => [emptyConversation()]);
  const [activeId, setActiveId] = useState('');
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pinned, setPinned] = useState(true);

  // Off by default: with reasoning on, this model spends several seconds and a
  // few thousand tokens working out loud before the first word of the answer,
  // which is the wrong trade for "what does Ali build". It's worth having for
  // the questions where it isn't — hence the switch rather than a constant.
  const [think, setThink] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const frameRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const messages = active?.messages ?? [];

  useEffect(() => {
    setThink(loadThinking());

    const stored = loadConversations();
    if (stored.length === 0) return;

    setConversations(stored);
    setActiveId(stored[0].id);
  }, []);

  const toggleThinking = () => {
    setThink((was) => {
      saveThinking(!was);
      return !was;
    });
  };

  // Persist on every change. It's a few KB of JSON against a user gesture, so
  // there's nothing to debounce — and debouncing would lose the last message
  // of anyone who closes the tab straight after sending it.
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // How much has been written into this conversation so far. A scalar rather
  // than the array itself, because the array is rebuilt on every render and
  // would re-run the effect below whether or not anything had changed.
  const written = messages.reduce(
    (total, message) => total + message.content.length + (message.reasoning?.length ?? 0),
    0
  );

  // Follow the reply down as it's written, unless the reader has scrolled up to
  // re-read something — then leave them where they are.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !pinned) return;
    el.scrollTop = el.scrollHeight;
  }, [written, pinned]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
    setPinned((was) => (was === atBottom ? was : atBottom));
  };

  /**
   * Sends `history` to the model and writes the reply into `conversationId` as
   * it arrives.
   *
   * Tokens land far faster than a browser can paint, so they're accumulated in
   * a plain object and committed once per animation frame. Setting state per
   * token instead means React re-renders the whole thread a hundred times a
   * second and the page stutters while the answer is still short.
   */
  const runTurn = useCallback(async (conversationId: string, history: ChatMessage[]) => {
    const reply = makeMessage('assistant', '');
    const buffer = { content: '', reasoning: '' };

    setStreaming(true);
    setError(null);
    setPinned(true);
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: [...history, reply], updatedAt: Date.now() }
          : conversation
      )
    );

    const write = (patch: Partial<ChatMessage>) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === reply.id ? { ...message, ...patch } : message
                ),
              }
            : conversation
        )
      );
    };

    const flush = () => {
      frameRef.current = null;
      write({ content: buffer.content, reasoning: buffer.reasoning || undefined });
    };

    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(flush);
    };

    const controller = new AbortController();
    abortRef.current = controller;
    let failure: string | null = null;

    try {
      await streamChat({
        messages: toWire(history),
        think,
        signal: controller.signal,
        onAnswer: (delta) => {
          buffer.content += delta;
          schedule();
        },
        onThinking: (delta) => {
          buffer.reasoning += delta;
          schedule();
        },
      });
    } catch (thrown) {
      const stopped = thrown instanceof DOMException && thrown.name === 'AbortError';
      if (!stopped) {
        failure =
          thrown instanceof ChatError
            ? thrown.message
            : 'Could not reach the assistant. Check your connection and try again.';
      }
    } finally {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (failure && !buffer.content) {
        write({ content: failure, reasoning: buffer.reasoning || undefined, failed: true });
      } else if (!buffer.content) {
        // Stopped before the first token — an empty bubble would look broken.
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: conversation.messages.filter((message) => message.id !== reply.id),
                }
              : conversation
          )
        );
      } else {
        write({ content: buffer.content, reasoning: buffer.reasoning || undefined });
        if (failure) setError(failure);
      }

      abortRef.current = null;
      setStreaming(false);
    }
    // `think` is read when the turn starts, so a turn already in flight keeps
    // the mode it was sent with.
  }, [think]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || streaming || !active) return;

    const question = makeMessage('user', content);
    const history = [...active.messages, question];

    setDraft('');
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === active.id
          ? {
              ...conversation,
              title: conversation.messages.length === 0 ? titleFrom(content) : conversation.title,
              messages: history,
              updatedAt: Date.now(),
            }
          : conversation
      )
    );

    void runTurn(active.id, history);
  };

  /** Drops the last reply and asks again from the same question. */
  const retry = () => {
    if (!active || streaming) return;

    const lastUser = active.messages.findLastIndex((message) => message.role === 'user');
    if (lastUser === -1) return;

    void runTurn(active.id, active.messages.slice(0, lastUser + 1));
  };

  const startNew = () => {
    abortRef.current?.abort();
    const fresh = emptyConversation();
    setConversations((prev) => [fresh, ...prev.filter((c) => c.messages.length > 0)]);
    setActiveId(fresh.id);
    setDraft('');
    setError(null);
    setMenuOpen(false);
  };

  const select = (id: string) => {
    abortRef.current?.abort();
    setActiveId(id);
    setError(null);
    setMenuOpen(false);
    setPinned(true);
  };

  const remove = (id: string) => {
    setConversations((prev) => {
      const left = prev.filter((conversation) => conversation.id !== id);
      const next = left.length > 0 ? left : [emptyConversation()];
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const lastIndex = messages.length - 1;
  const empty = messages.length === 0;

  return (
    // `100svh`, not `100vh`: on a phone, `vh` includes the space the browser's
    // own toolbar is sitting in, which puts the composer under it.
    <div className="chat-app flex h-[100svh] flex-col overflow-hidden">
      {/*
        Hidden rather than absent. The page had no h1 at all, which leaves a
        screen reader with no answer to "what is this page" and leaves a
        crawler ranking it on the <title> alone. A visible heading is the wrong
        fix here — this is an app filling the viewport, and a banner above the
        conversation would cost the composer real estate on a phone to say
        something the branding beside it already says.
      */}
      <h1 className="sr-only">Nova — ask anything about {PROFILE.fullName}&apos;s work</h1>

      <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-[13px] font-medium uppercase
            tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70"
        >
          <Logo
            size={32}
            className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
          />
          {PROFILE.fullName}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-full border border-[#D7E2EA]/16
            text-[#D7E2EA]/80 transition-colors duration-200 hover:border-[#D7E2EA]/40
            hover:text-[#D7E2EA]"
        >
          <Menu size={17} strokeWidth={2} />
        </button>
      </header>

      {/* What it's running on and what it knows, stated once and then out of
          the way — it's the first thing anyone asks of a chatbot on a site. */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-y border-[#D7E2EA]/8 px-4 py-2.5 sm:px-6">
        <p className="flex min-w-0 items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#D7E2EA]/45">
          <span
            className={`size-1.5 shrink-0 rounded-full ${streaming ? 'status-live bg-[#C86BFF]' : 'bg-[#C86BFF]/70'}`}
          />
          <span className="truncate">
            {streaming ? 'Answering' : `Grounded in ${PROFILE.firstName}'s public portfolio data`}
          </span>
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[#D7E2EA]/30 lg:inline">
            {MODEL_LABEL}
          </span>

          <button
            type="button"
            onClick={toggleThinking}
            aria-pressed={think}
            title={
              think
                ? 'Reasoning on — slower, shows its working'
                : 'Reasoning off — straight to the answer'
            }
            // py-1.5 rather than py-1: at 10px text the pill was 22px tall,
            // under the tap-target minimum, and this is a toggle people hit
            // mid-conversation on a phone.
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5
              text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                think
                  ? 'border-[#C86BFF]/45 bg-[#7621B0]/20 text-[#E7CDFF]'
                  : 'border-[#D7E2EA]/14 text-[#D7E2EA]/40 hover:text-[#D7E2EA]/75'
              }`}
          >
            <Brain size={12} strokeWidth={2.2} />
            <span className="hidden sm:inline">Thinking</span>
          </button>

          <button
            type="button"
            onClick={startNew}
            aria-label="Start a new chat"
            title="New chat"
            // A bare 15px icon is a 15px target. The padding makes it tappable
            // and the negative margin keeps the status bar the height it was.
            className="-m-1.5 p-1.5 text-[#D7E2EA]/45 transition-colors duration-200
              hover:text-[#D7E2EA]"
          >
            <RotateCcw size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="chat-scroll flex-1 overflow-y-auto px-4 sm:px-6"
      >
        <div className="mx-auto flex min-h-full max-w-3xl flex-col py-6">
          {empty ? (
            // Pushed to the bottom, so the greeting and the openers sit right
            // above the input rather than floating in the middle of a big screen.
            <div className="mt-auto flex flex-col items-start gap-5">
              <div
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-xl"
                style={{
                  background:
                    'radial-gradient(circle at 30% 26%, #C86BFF 0%, #7621B0 55%, #2A0A3C 100%)',
                  boxShadow: '0 0 30px rgba(118,33,176,0.45)',
                }}
              >
                <Sparkles size={16} strokeWidth={2.2} className="text-white/90" />
              </div>

              <p className="max-w-[34rem] text-[17px] leading-relaxed text-[#D7E2EA]/90 sm:text-[19px]">
                {GREETING}
              </p>

              <div className="mt-2 w-full">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/32">
                  Try asking
                </p>

                <ul className="mt-3 flex flex-wrap gap-2.5">
                  {SUGGESTIONS.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        onClick={() => send(suggestion)}
                        className="suggestion rounded-full border border-[#D7E2EA]/18 px-4 py-2.5
                          text-left text-[13.5px] leading-snug text-[#D7E2EA]/85 transition-all
                          duration-300 hover:border-[#D7E2EA]/40 hover:bg-[#D7E2EA]/[0.07]
                          hover:text-[#D7E2EA]"
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            // Bottom-aligned like every other chat: a two-message thread
            // belongs next to the input, not stranded at the top of the window.
            <div className="mt-auto flex flex-col gap-7">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  streaming={streaming && index === lastIndex && message.role === 'assistant'}
                  onRetry={
                    !streaming && index === lastIndex && message.role === 'assistant'
                      ? retry
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 px-4 pb-4 pt-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {error ? (
            <div className="mb-2 flex items-start gap-2 rounded-2xl border border-[#FFB27A]/25 bg-[#BE4C00]/10 px-3.5 py-2.5 text-[13px] text-[#FFC9A3]">
              <AlertCircle size={15} strokeWidth={2} className="mt-0.5 shrink-0" />
              <span className="flex-1">{error}</span>
              <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
                <X size={14} strokeWidth={2} className="opacity-70 hover:opacity-100" />
              </button>
            </div>
          ) : null}

          <Composer
            value={draft}
            onChange={setDraft}
            onSubmit={() => send(draft)}
            onStop={() => abortRef.current?.abort()}
            streaming={streaming}
          />

          <p className="mt-2.5 text-center text-[11px] text-[#D7E2EA]/28">
            Nova can be wrong about prices and timelines — check with {PROFILE.firstName} before you
            count on it.
          </p>
        </div>
      </div>

      <ChatSidebar
        conversations={conversations.filter((conversation) => conversation.messages.length > 0)}
        activeId={active?.id ?? ''}
        onSelect={select}
        onNew={startNew}
        onDelete={remove}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}
