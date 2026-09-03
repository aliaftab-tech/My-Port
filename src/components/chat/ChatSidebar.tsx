import { Link } from 'react-router-dom';
import { Cpu, MessageSquare, Plus, Star, Trash2, X, Zap } from 'lucide-react';
import type { Conversation } from '../../lib/chatStore';
import { MODEL_LABEL, MODEL_SUBLABEL } from '../../lib/chat';

type ChatSidebarProps = {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  open: boolean;
  onClose: () => void;
};

/**
 * Past conversations, behind the menu button.
 *
 * A drawer at every width rather than a column that appears on desktop: the
 * conversation is the page, and a permanent list of chat titles beside it is
 * furniture nobody came for. It's one tap away when it's wanted.
 */
export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  open,
  onClose,
}: ChatSidebarProps) {
  return (
    <>
      {/* The scrim stops taking taps once it's transparent, so a closed drawer
          can't swallow a click on the chat behind it. */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-black/65 backdrop-blur-sm transition-opacity duration-300
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[300px] max-w-[86vw] flex-col gap-4
          border-l border-[#D7E2EA]/10 bg-[#0C0C0C]/97 p-4 backdrop-blur-xl transition-transform
          duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNew}
            className="group flex flex-1 items-center gap-2 rounded-2xl border border-[#D7E2EA]/14
              bg-[#D7E2EA]/[0.04] px-3.5 py-2.5 text-[12px] font-medium uppercase tracking-wider
              text-[#D7E2EA] transition-colors duration-200 hover:border-[#D7E2EA]/35
              hover:bg-[#D7E2EA]/[0.09]"
          >
            <Plus
              size={15}
              strokeWidth={2.4}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            New chat
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 shrink-0 place-items-center rounded-2xl border
              border-[#D7E2EA]/14 text-[#D7E2EA]/70 transition-colors hover:text-[#D7E2EA]"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
          <p className="px-1 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#D7E2EA]/32">
            Recent
          </p>

          {conversations.length === 0 ? (
            <p className="px-1 text-[13px] leading-relaxed text-[#D7E2EA]/45">
              Nothing here yet. Your chats stay in this browser — never on a server.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {conversations.map((conversation) => {
                const active = conversation.id === activeId;

                return (
                  <li key={conversation.id} className="group/item relative">
                    <button
                      type="button"
                      onClick={() => onSelect(conversation.id)}
                      className={`flex w-full items-center gap-2.5 rounded-xl py-2.5 pl-3 pr-9
                        text-left text-[13.5px] transition-colors duration-200 ${
                          active
                            ? 'bg-[#D7E2EA]/10 text-[#D7E2EA]'
                            : 'text-[#D7E2EA]/58 hover:bg-[#D7E2EA]/[0.05] hover:text-[#D7E2EA]/90'
                        }`}
                    >
                      <MessageSquare size={14} strokeWidth={2} className="shrink-0 opacity-60" />
                      <span className="truncate">{conversation.title}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(conversation.id)}
                      aria-label={`Delete ${conversation.title}`}
                      className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2
                        place-items-center rounded-lg text-[#D7E2EA]/35 opacity-0 transition
                        hover:bg-[#D7E2EA]/10 hover:text-[#FFB27A] focus-visible:opacity-100
                        group-hover/item:opacity-100"
                    >
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Link
          to="/reviews"
          className="flex items-center gap-2.5 rounded-2xl border border-[#D7E2EA]/12 px-3.5 py-3
            text-[13px] text-[#D7E2EA]/75 transition-colors duration-200 hover:border-[#D7E2EA]/30
            hover:text-[#D7E2EA]"
        >
          <Star size={14} strokeWidth={2} className="text-[#FFB27A]" />
          Client reviews
        </Link>

        <div className="rounded-2xl border border-[#D7E2EA]/10 bg-[#D7E2EA]/[0.03] p-3.5">
          <p className="flex items-center gap-2 text-[12px] font-medium text-[#D7E2EA]/85">
            <Cpu size={13} strokeWidth={2} className="text-[#C86BFF]" />
            {MODEL_LABEL}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#D7E2EA]/40">{MODEL_SUBLABEL}</p>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#D7E2EA]/40">
            <Zap size={11} strokeWidth={2.4} className="text-[#FFB27A]" />
            Streaming, ~4× faster than its size suggests
          </p>
        </div>
      </aside>
    </>
  );
}
