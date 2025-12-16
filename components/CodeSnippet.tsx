"use client";

import { useState } from "react";

interface CodeSnippetProps {
  title: string;
  children: string;
  highlightKeyword?: string;
}

export function CodeSnippet({ title, children, highlightKeyword }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  
  const copy = async () => {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const lines = children.trim().split("\n");

  return (
    <div className="rounded-2xl bg-white/90 p-4 shadow-lg ring-1 ring-ink/10 backdrop-blur transition-all">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-ink/70">
        <span className="flex items-center gap-2">
          {highlightKeyword && <span className="animate-pulse text-red-500">●</span>}
          {title}
        </span>
        <button
          onClick={copy}
          className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-sand hover:bg-ink/90 transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-ink text-sm text-sand shadow-inner">
        <code className="block py-3">
          {lines.map((line, i) => {
            const isHighlighted = highlightKeyword && line.includes(highlightKeyword);
            return (
              <div
                key={i}
                className={`px-4 py-0.5 font-mono transition-colors duration-500 ${
                  isHighlighted
                    ? "bg-red-500/30 text-red-100 font-bold border-l-4 border-red-500"
                    : "border-l-4 border-transparent opacity-80"
                }`}
              >
                {line}
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
