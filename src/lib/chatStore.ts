import { newId, type ChatMessage } from './chat';

/**
 * Conversations, kept in localStorage.
 *
 * There's no account and no database — a visitor's chats live in their own
 * browser and nowhere else, which is both the cheapest thing to run and the
 * easiest thing to promise on a privacy note.
 *
 * Every read is defensive. localStorage is shared with every other tab, script
 * and extension on the origin, and it survives deploys, so the shape that comes
 * back is whatever an older version of this file wrote — never assume it fits.
 */

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

const KEY = 'ali-chat:conversations:v1';

/** Enough history to feel persistent, not enough to fill the 5MB quota. */
const MAX_CONVERSATIONS = 40;

export const canPersist = (): boolean => typeof window !== 'undefined' && !!window.localStorage;

export function emptyConversation(): Conversation {
  const now = Date.now();
  return { id: newId(), title: 'New chat', messages: [], createdAt: now, updatedAt: now };
}

/** The first thing the user said, trimmed to something that fits the sidebar. */
export function titleFrom(text: string): string {
  const line = text.replace(/\s+/g, ' ').trim();
  if (!line) return 'New chat';
  return line.length > 42 ? `${line.slice(0, 42).trimEnd()}…` : line;
}

function reviveMessage(raw: unknown): ChatMessage | null {
  const message = raw as Partial<ChatMessage> | null;
  if (!message || (message.role !== 'user' && message.role !== 'assistant')) return null;
  if (typeof message.content !== 'string') return null;

  return {
    id: typeof message.id === 'string' ? message.id : newId(),
    role: message.role,
    content: message.content,
    reasoning: typeof message.reasoning === 'string' ? message.reasoning : undefined,
    createdAt: typeof message.createdAt === 'number' ? message.createdAt : Date.now(),
    failed: message.failed === true ? true : undefined,
  };
}

export function loadConversations(): Conversation[] {
  if (!canPersist()) return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item): Conversation | null => {
        const conversation = item as Partial<Conversation> | null;
        if (!conversation || typeof conversation.id !== 'string') return null;

        const messages = Array.isArray(conversation.messages)
          ? conversation.messages.map(reviveMessage).filter((m): m is ChatMessage => m !== null)
          : [];

        return {
          id: conversation.id,
          title: typeof conversation.title === 'string' ? conversation.title : 'New chat',
          messages,
          createdAt: typeof conversation.createdAt === 'number' ? conversation.createdAt : Date.now(),
          updatedAt: typeof conversation.updatedAt === 'number' ? conversation.updatedAt : Date.now(),
        };
      })
      .filter((c): c is Conversation => c !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (!canPersist()) return;

  // Empty chats are noise in the sidebar and pointless on disk.
  const worth = conversations.filter((c) => c.messages.length > 0).slice(0, MAX_CONVERSATIONS);

  try {
    window.localStorage.setItem(KEY, JSON.stringify(worth));
  } catch {
    // Quota exceeded, or storage blocked entirely (Safari private mode). The
    // chat still works for this session; it just won't be there tomorrow.
  }
}

/**
 * What an empty chat says. A constant rather than a seeded message, because a
 * greeting stored as the first turn would be sent back to the model on every
 * request as something it supposedly said.
 */
export const GREETING =
  "Hi — I'm Nova, an AI guide to Ali's work and experience. Ask about his background, what he's " +
  'built, what he could build for you, or whether he fits what your team needs.';

/** Remembers whether the visitor left reasoning mode switched on. */
const THINKING_KEY = 'ali-chat:thinking:v1';

export function loadThinking(): boolean {
  if (!canPersist()) return false;
  try {
    return window.localStorage.getItem(THINKING_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveThinking(on: boolean): void {
  if (!canPersist()) return;
  try {
    window.localStorage.setItem(THINKING_KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked — the setting just won't survive a reload.
  }
}
