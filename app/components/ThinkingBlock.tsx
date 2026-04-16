'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Brain } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function ThinkingBlock({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="thinking-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Brain size={14} />
        <span>Thinking{isOpen ? '' : '...'}</span>
      </button>
      {isOpen && (
        <div className="mt-2 text-sm text-zinc-400 border-l-2 border-indigo-500/30 pl-3">
          <MarkdownRenderer content={content} />
        </div>
      )}
    </div>
  );
}
