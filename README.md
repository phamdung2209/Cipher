# Cipher

A sleek AI chat client powered by open-source models. Built with Next.js, streaming responses, and thinking visualization.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Real-time Streaming** — Responses stream token-by-token as the model generates them
- **Thinking Visualization** — Collapsible thinking blocks for reasoning models (Qwen Thinking)
- **Markdown Rendering** — Full markdown support with syntax-highlighted code blocks, tables, and more
- **Copy Code** — One-click copy button on all code blocks
- **Chat Management** — Create, switch, and delete multiple conversations
- **System Prompt** — Customize the AI's behavior with custom system prompts
- **Local Storage** — All chats and settings persist in your browser
- **Responsive Design** — Works on desktop and mobile with collapsible sidebar
- **Dark Theme** — Clean, modern dark UI

## Supported Models

| Model | Type | Description |
|-------|------|-------------|
| Qwen 3.6 Plus Thinking | Reasoning | Latest, most capable with step-by-step thinking |
| Qwen 3.6 Plus | Fast | Latest model, fast responses |
| Qwen 3.5 Plus Thinking | Reasoning | Stable reasoning model |
| Qwen 3.5 Plus | Fast | Stable, fast responses |

Models are accessed via [Dialagram Nexum Router](https://www.dialagram.me/router) (OpenAI-compatible API).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Icons**: Lucide React
- **Code Highlighting**: highlight.js

## Getting Started

### Prerequisites

- Node.js 18+
- An API key from [Dialagram Nexum Router](https://www.dialagram.me/router)

### Installation

```bash
git clone https://github.com/phamdung2209/ai-chat.git
cd ai-chat
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Usage

1. Open the app in your browser
2. Click **Settings** in the sidebar
3. Enter your API key
4. Select a model
5. Start chatting

## Project Structure

```
app/
  api/chat/route.ts        # API proxy to avoid CORS
  components/
    ChatApp.tsx             # Main orchestrator component
    Sidebar.tsx             # Chat list + settings panel
    ChatMessages.tsx        # Message list display
    ChatInput.tsx           # Text input + send/stop
    MarkdownRenderer.tsx    # Markdown + code highlight
    ThinkingBlock.tsx       # Collapsible thinking block
  hooks/
    useLocalStorage.ts      # Generic localStorage hook
  lib/
    types.ts                # TypeScript interfaces
    constants.ts            # API URL, models config
    chat-service.ts         # Streaming logic
  globals.css               # Tailwind + custom styles
  layout.tsx                # Root layout
  page.tsx                  # Entry page
```

## License

MIT
