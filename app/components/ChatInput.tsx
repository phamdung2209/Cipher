'use client';

import { useRef, useEffect, useCallback } from 'react';
import { SendHorizonal, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, []);

  const handleSubmit = useCallback(() => {
    const text = textareaRef.current?.value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  }, [onSend, isStreaming]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-sm px-4 py-4">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <textarea
          ref={textareaRef}
          onInput={adjustHeight}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all min-h-[46px] max-h-[200px] disabled:opacity-50"
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex items-center justify-center w-[46px] h-[46px] rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shrink-0"
            title="Stop generating"
          >
            <Square size={16} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="flex items-center justify-center w-[46px] h-[46px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <SendHorizonal size={18} />
          </button>
        )}
      </div>
      <p className="text-center text-[11px] text-zinc-600 mt-2">
        Enter to send &middot; Shift+Enter for new line
      </p>
    </div>
  );
}
