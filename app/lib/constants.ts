import type { ModelOption } from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.dialagram.me/router/v1/chat/completions';

export const MODELS: ModelOption[] = [
  { id: 'qwen-3.6-plus-thinking', name: 'Qwen 3.6 Plus Thinking', provider: 'Qwen', supportsThinking: true },
  { id: 'qwen-3.6-plus', name: 'Qwen 3.6 Plus', provider: 'Qwen', supportsThinking: false },
  { id: 'qwen-3.5-plus-thinking', name: 'Qwen 3.5 Plus Thinking', provider: 'Qwen', supportsThinking: true },
  { id: 'qwen-3.5-plus', name: 'Qwen 3.5 Plus', provider: 'Qwen', supportsThinking: false },
];

export const DEFAULT_SETTINGS = {
  apiKey: '',
  model: 'qwen-3.6-plus-thinking',
  systemPrompt: 'You are a helpful assistant.',
};
