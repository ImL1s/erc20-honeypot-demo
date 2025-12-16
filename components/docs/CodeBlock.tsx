'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    highlightLines?: number[];
    showLineNumbers?: boolean;
}

export function CodeBlock({
    code,
    language = 'solidity',
    filename,
    highlightLines = [],
    showLineNumbers = true,
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.trim().split('\n');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-4 rounded-2xl overflow-hidden bg-slate-900 shadow-xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    {filename && (
                        <span className="text-sm text-slate-400 font-mono">
                            {filename}
                        </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase">
                        {language}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            已複製
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            複製
                        </>
                    )}
                </button>
            </div>

            {/* Code */}
            <div className="overflow-x-auto">
                <pre className="p-4 text-sm font-mono">
                    {lines.map((line, i) => {
                        const lineNum = i + 1;
                        const isHighlighted = highlightLines.includes(lineNum);

                        return (
                            <div
                                key={i}
                                className={`flex ${isHighlighted ? 'bg-mint/20 -mx-4 px-4' : ''}`}
                            >
                                {showLineNumbers && (
                                    <span className="select-none text-slate-600 w-8 text-right pr-4 flex-shrink-0">
                                        {lineNum}
                                    </span>
                                )}
                                <code className="text-slate-100 whitespace-pre">
                                    {line || ' '}
                                </code>
                            </div>
                        );
                    })}
                </pre>
            </div>
        </motion.div>
    );
}
