'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  MessageSquare,
  Settings,
  Eye,
  EyeOff,
  X,
  Cpu,
  Key,
  MessageCircle,
} from 'lucide-react';
import type { Chat, AppSettings } from '../lib/types';
import { MODELS } from '../lib/constants';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  settings: AppSettings;
  isOpen: boolean;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onClose: () => void;
}

export function Sidebar({
  chats,
  currentChatId,
  settings,
  isOpen,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onUpdateSettings,
  onClose,
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-sm font-bold text-indigo-400 tracking-wide">NEXUM CHAT</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="New chat"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {chats.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-8">No conversations yet</p>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  onClose();
                }}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  chat.id === currentChatId
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
                }`}
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="flex-1 truncate text-sm">{chat.title}</span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700 text-zinc-500 hover:text-red-400 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Settings toggle */}
        <div className="border-t border-zinc-800">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          {showSettings && (
            <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
              {/* Model */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5">
                  <Cpu size={12} /> Model
                </label>
                <select
                  value={settings.model}
                  onChange={e => onUpdateSettings({ model: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 outline-none focus:border-indigo-500 transition-colors"
                >
                  {MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5">
                  <Key size={12} /> API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={e => onUpdateSettings({ apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 pr-10 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5">
                  <MessageCircle size={12} /> System Prompt
                </label>
                <textarea
                  value={settings.systemPrompt}
                  onChange={e => onUpdateSettings({ systemPrompt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="You are a helpful assistant."
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
