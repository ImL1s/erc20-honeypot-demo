"use client";

import { ReactNode, useState } from "react";

export function CodeSnippet({ title, children }: { title: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-lg ring-1 ring-ink/10">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-ink/70">
        <span>{title}</span>
        <button
          onClick={copy}
          className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-sand hover:bg-ink/90"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-auto rounded-lg bg-ink px-4 py-3 text-sm text-sand shadow-inner">
        <code>{children}</code>
      </pre>
    </div>
  );
}
