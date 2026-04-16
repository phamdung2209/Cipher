'use client';

import { useEffect, useRef } from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import type { Message } from '../lib/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ThinkingBlock } from './ThinkingBlock';

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  streamingThinking: string;
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function MessageItem({
  message,
  isLast,
  isStreaming,
  streamingContent,
  streamingThinking,
}: {
  message: Message;
  isLast: boolean;
  isStreaming: boolean;
  streamingContent: string;
  streamingThinking: string;
}) {
  const isUser = message.role === 'user';
  const isStreamingThis = isLast && isStreaming && !isUser;

  const content = isStreamingThis ? streamingContent : message.content;
  const thinking = isStreamingThis ? streamingThinking : message.thinkingContent;
  const showTyping = isStreamingThis && !content && !thinking;

  return (
    <div className={`flex gap-3 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? '' : 'bg-zinc-900/30 -mx-4 px-4 rounded-xl'}`}>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isUser ? 'bg-indigo-600' : 'bg-emerald-700'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-xs font-semibold text-zinc-500">
          {isUser ? 'You' : 'Assistant'}
        </p>
        <div className="prose-chat text-sm leading-relaxed text-zinc-200">
          {thinking && <ThinkingBlock content={thinking} />}
          {showTyping ? (
            <TypingIndicator />
          ) : content ? (
            <MarkdownRenderer content={content} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ChatMessages({ messages, isStreaming, streamingContent, streamingThinking }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, streamingThinking]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-6">
          <Sparkles size={28} className="text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Nexum AI Chat</h1>
        <p className="text-sm text-zinc-500 max-w-md">
          Powered by Dialagram Router. Choose a model and start a conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-1">
        {messages.map((msg, i) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isLast={i === messages.length - 1}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            streamingThinking={streamingThinking}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
