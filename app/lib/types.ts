export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinkingContent?: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  supportsThinking: boolean;
}

export interface AppSettings {
  apiKey: string;
  model: string;
  systemPrompt: string;
}
