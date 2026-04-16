'use client';

import { useState, useRef, useCallback } from 'react';
import { Menu, Cpu } from 'lucide-react';
import type { Chat, Message, AppSettings } from '../lib/types';
import { DEFAULT_SETTINGS, MODELS } from '../lib/constants';
import { streamChat, createAbortController } from '../lib/chat-service';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Sidebar } from './Sidebar';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatApp() {
  const [chats, setChats, chatsLoaded] = useLocalStorage<Chat[]>('nexum_chats', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('nexum_settings', DEFAULT_SETTINGS);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingThinking, setStreamingThinking] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const currentChat = chats.find(c => c.id === currentChatId) ?? null;
  const currentModel = MODELS.find(m => m.id === settings.model);

  const updateSettings = useCallback(
    (partial: Partial<AppSettings>) => {
      setSettings(prev => ({ ...prev, ...partial }));
    },
    [setSettings],
  );

  const createChat = useCallback(
    (firstMessage: string): Chat => {
      const chat: Chat = {
        id: generateId(),
        title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : ''),
        messages: [],
        model: settings.model,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setChats(prev => [chat, ...prev]);
      setCurrentChatId(chat.id);
      return chat;
    },
    [settings.model, setChats],
  );

  const addMessage = useCallback(
    (chatId: string, message: Message) => {
      setChats(prev =>
        prev.map(c =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
            : c,
        ),
      );
    },
    [setChats],
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!settings.apiKey) {
        alert('Please enter your API key in Settings');
        return;
      }

      let chat = currentChat;
      if (!chat) {
        chat = createChat(text);
      }

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: text,
        createdAt: Date.now(),
      };
      addMessage(chat.id, userMessage);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };
      addMessage(chat.id, assistantMessage);

      setIsStreaming(true);
      setStreamingContent('');
      setStreamingThinking('');

      const controller = createAbortController();
      abortRef.current = controller;

      let fullContent = '';
      let fullThinking = '';

      try {
        const allMessages = [...chat.messages, userMessage];

        await streamChat(
          allMessages,
          settings.model,
          settings.apiKey,
          settings.systemPrompt,
          controller.signal,
          {
            onContent(content) {
              fullContent += content;
              setStreamingContent(fullContent);
            },
            onThinking(content) {
              fullThinking += content;
              setStreamingThinking(fullThinking);
            },
            onDone() {
              // handled in finally
            },
            onError(error) {
              fullContent = `Error: ${error}`;
              setStreamingContent(fullContent);
            },
          },
        );
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          fullContent = `Error: ${err.message}`;
          setStreamingContent(fullContent);
        }
      } finally {
        setChats(prev =>
          prev.map(c => {
            if (c.id !== chat!.id) return c;
            const msgs = [...c.messages];
            const lastIdx = msgs.length - 1;
            if (msgs[lastIdx]?.role === 'assistant') {
              msgs[lastIdx] = {
                ...msgs[lastIdx],
                content: fullContent,
                thinkingContent: fullThinking || undefined,
              };
            }
            return { ...c, messages: msgs, updatedAt: Date.now() };
          }),
        );
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingThinking('');
        abortRef.current = null;
      }
    },
    [currentChat, settings, createChat, addMessage, setChats],
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleNewChat = useCallback(() => {
    setCurrentChatId(null);
    setStreamingContent('');
    setStreamingThinking('');
  }, []);

  const handleDeleteChat = useCallback(
    (id: string) => {
      setChats(prev => prev.filter(c => c.id !== id));
      if (currentChatId === id) setCurrentChatId(null);
    },
    [currentChatId, setChats],
  );

  if (!chatsLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        settings={settings}
        isOpen={sidebarOpen}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
        onDeleteChat={handleDeleteChat}
        onUpdateSettings={updateSettings}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-sm font-medium text-zinc-300 truncate">
            {currentChat?.title ?? 'New Chat'}
          </h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/80 text-xs text-zinc-500 ml-auto">
            <Cpu size={12} />
            {currentModel?.name ?? settings.model}
          </div>
        </div>

        {/* Messages */}
        <ChatMessages
          messages={currentChat?.messages ?? []}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          streamingThinking={streamingThinking}
        />

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={isStreaming}
          disabled={!settings.apiKey}
        />
      </main>
    </div>
  );
}
