import type { Message } from './types';

interface StreamCallbacks {
  onContent: (content: string) => void;
  onThinking: (content: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export function createAbortController() {
  return new AbortController();
}

export async function streamChat(
  messages: Message[],
  model: string,
  apiKey: string,
  systemPrompt: string,
  signal: AbortSignal,
  callbacks: StreamCallbacks,
) {
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
    stream: true,
  };

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, body }),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error ${res.status}: ${err}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop()!;

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') {
        callbacks.onDone();
        return;
      }

      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta;
        if (delta?.reasoning_content) {
          callbacks.onThinking(delta.reasoning_content);
        }
        if (delta?.content) {
          callbacks.onContent(delta.content);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  callbacks.onDone();
}
