'use client';

import { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-700/80 hover:bg-zinc-600 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
      title="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
  '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
};

function cleanContent(text: string) {
  // Convert Qwen citation references [[1]] -> superscript ¹
  return text.replace(/\[\[(\d+)\]\]/g, (_, num: string) =>
    [...num].map(d => SUPERSCRIPT_DIGITS[d]).join('')
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre({ children, ...props }) {
          const codeElement = children as React.ReactElement<{ children?: React.ReactNode }>;
          const code = codeElement?.props?.children?.toString() || '';

          return (
            <div className="relative group my-3">
              <CopyButton code={code} />
              <pre {...props} className="rounded-lg overflow-x-auto bg-zinc-900 border border-zinc-800">
                {children}
              </pre>
            </div>
          );
        },
        code({ className, children, ...props }) {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[13px] font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={`${className} block p-4 text-sm font-mono`} {...props}>
              {children}
            </code>
          );
        },
        table({ children, ...props }) {
          return (
            <div className="overflow-x-auto my-3">
              <table className="w-full border-collapse text-sm" {...props}>
                {children}
              </table>
            </div>
          );
        },
        th({ children, ...props }) {
          return (
            <th className="border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left font-semibold" {...props}>
              {children}
            </th>
          );
        },
        td({ children, ...props }) {
          return (
            <td className="border border-zinc-700 px-3 py-2" {...props}>
              {children}
            </td>
          );
        },
        blockquote({ children, ...props }) {
          return (
            <blockquote className="border-l-3 border-indigo-500 pl-4 my-3 text-zinc-400 italic" {...props}>
              {children}
            </blockquote>
          );
        },
        a({ children, href, ...props }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              {...props}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {cleanContent(content)}
    </ReactMarkdown>
  );
}
