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
    <div className="relative overflow-hidden rounded-2xl bg-[#fffcf5] shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-stone-200 transition-all hover:shadow-lg">
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200 opacity-50" />

      <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/50 px-5 py-3">
        <span className="flex items-center gap-2 text-sm font-bold text-stone-600">
          {highlightKeyword && <span className="animate-pulse text-red-400">●</span>}
          {title}
        </span>
        <button
          onClick={copy}
          className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-stone-500 shadow-sm ring-1 ring-stone-200 hover:bg-stone-50 transition-colors"
        >
          {copied ? "✨" : "📋"}
        </button>
      </div>

      <pre className="overflow-x-auto bg-[#fffcf5] p-2 text-sm text-stone-700 scrollbar-thin scrollbar-thumb-stone-200">
        <code className="block font-mono">
          {lines.map((line, i) => {
            const isHighlighted = highlightKeyword && line.includes(highlightKeyword);
            return (
              <div
                key={i}
                className={`px-3 py-1 transition-colors duration-500 border-l-[3px] ${isHighlighted
                    ? "bg-red-50 border-red-400 text-red-800 font-bold"
                    : "border-transparent hover:bg-stone-50"
                  }`}
              >
                {/* Visual line number */}
                <span className="inline-block w-6 select-none text-right text-xs text-stone-300 mr-3">{i + 1}</span>
                {line}
              </div>
            );
          })}
        </code>
      </pre>

      <div className="absolute bottom-0 h-2 w-full bg-gradient-to-t from-stone-50 to-transparent opacity-50" />
    </div>
  );
}
