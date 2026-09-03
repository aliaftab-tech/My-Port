/**
 * The browser half of the chat: message shapes, and one function that turns
 * `/api/chat`'s event stream into callbacks.
 *
 * Nothing here knows about React, so the streaming logic can be reasoned about
 * (and fixed) without touching a component.
 */

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  /** The model's private working-out, if it emitted any. Shown collapsed. */
  reasoning?: string;
  createdAt: number;
  /** Set when the turn failed, so the bubble can render as a failure. */
  failed?: boolean;
};

export type WireMessage = { role: ChatRole; content: string };

export const MODEL_LABEL = 'Nemotron 3.5 Lightning 30B';
export const MODEL_SUBLABEL = 'NVIDIA NIM · 30B MoE, 3B active';

export function newId(): string {
  // `crypto.randomUUID` needs a secure context; a local IP over http isn't one.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeMessage(role: ChatRole, content = ''): ChatMessage {
  return { id: newId(), role, content, createdAt: Date.now() };
}

/** Everything the server needs, and nothing it doesn't. */
export const toWire = (messages: ChatMessage[]): WireMessage[] =>
  messages
    .filter((message) => !message.failed && message.content.trim())
    .map(({ role, content }) => ({ role, content }));

/**
 * Splits a stream of text into "thinking" and "answer" as it arrives.
 *
 * Reasoning models mark their working-out one of two ways: a separate
 * `reasoning_content` field, or `<think>…</think>` inline in the content. The
 * first is handled by the caller; this handles the second, and has to cope with
 * a tag arriving split across two chunks — `<thi` at the end of one and `nk>`
 * at the start of the next is normal, and matching naively would print it.
 */
function createThinkSplitter(onThinking: (text: string) => void, onAnswer: (text: string) => void) {
  const OPEN = '<think>';
  const CLOSE = '</think>';
  let buffer = '';
  let inside = false;

  /** How much of the tail could still turn into `tag` once more text arrives. */
  const partialTail = (text: string, tag: string): number => {
    const max = Math.min(text.length, tag.length - 1);
    for (let size = max; size > 0; size -= 1) {
      if (text.endsWith(tag.slice(0, size))) return size;
    }
    return 0;
  };

  return {
    push(chunk: string) {
      buffer += chunk;

      for (;;) {
        const tag = inside ? CLOSE : OPEN;
        const at = buffer.indexOf(tag);

        if (at !== -1) {
          const before = buffer.slice(0, at);
          if (before) (inside ? onThinking : onAnswer)(before);
          buffer = buffer.slice(at + tag.length);
          inside = !inside;
          continue;
        }

        const held = partialTail(buffer, tag);
        const ready = buffer.slice(0, buffer.length - held);
        if (ready) (inside ? onThinking : onAnswer)(ready);
        buffer = held ? buffer.slice(buffer.length - held) : '';
        return;
      }
    },

    /**
     * Nothing more is coming, so whatever is still held back was never the
     * start of a tag after all — an answer ending in "5 &lt;" would otherwise
     * lose its last character.
     */
    flush() {
      if (!buffer) return;
      (inside ? onThinking : onAnswer)(buffer);
      buffer = '';
    },
  };
}

export type StreamHandlers = {
  messages: WireMessage[];
  /**
   * Let the model reason before it answers. Slower and more thorough — the
   * working-out comes back separately and is shown collapsed.
   */
  think?: boolean;
  signal?: AbortSignal;
  onAnswer: (delta: string) => void;
  onThinking: (delta: string) => void;
};

/** Thrown for anything the user should read, rather than a stack trace. */
export class ChatError extends Error {}

type StreamChunk = {
  choices?: { delta?: { content?: string | null; reasoning_content?: string | null } }[];
  error?: { message?: string };
};

/**
 * POSTs the conversation and resolves once the model has finished talking.
 *
 * Deltas arrive through the callbacks rather than as a returned string so the
 * UI can paint each token as it lands — which is the entire reason the response
 * is streamed in the first place.
 */
export async function streamChat({
  messages,
  think = false,
  signal,
  onAnswer,
  onThinking,
}: StreamHandlers): Promise<void> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, think }),
    signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response
      .json()
      .then((body: { error?: string }) => body?.error)
      .catch(() => undefined);
    throw new ChatError(detail ?? `The assistant is unavailable right now (${response.status}).`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const split = createThinkSplitter(onThinking, onAnswer);
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Server-sent events are separated by a blank line; a chunk boundary can
    // land anywhere, so only whole events are parsed and the rest waits.
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue;

        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;

        let chunk: StreamChunk;
        try {
          chunk = JSON.parse(payload) as StreamChunk;
        } catch {
          continue; // A keep-alive comment or a half-line — nothing to show.
        }

        if (chunk.error?.message) throw new ChatError(chunk.error.message);

        const delta = chunk.choices?.[0]?.delta;
        if (delta?.reasoning_content) onThinking(delta.reasoning_content);
        if (delta?.content) split.push(delta.content);
      }
    }
  }

  split.flush();
}
