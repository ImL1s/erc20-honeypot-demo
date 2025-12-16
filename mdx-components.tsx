import type { MDXComponents } from 'mdx/types';
import { FlowDiagram } from './components/docs/FlowDiagram';
import { CodeBlock } from './components/docs/CodeBlock';
import { Callout } from './components/docs/Callout';

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Custom components for MDX
        FlowDiagram,
        CodeBlock,
        Callout,
        // Override default elements
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 text-ink">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3 text-ink flex items-center gap-2">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-medium mt-4 mb-2 text-ink">{children}</h3>
        ),
        p: ({ children }) => (
            <p className="text-slate-700 leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700">{children}</ol>
        ),
        code: ({ children }) => (
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto mb-4 text-sm">
                {children}
            </pre>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-mint pl-4 italic text-slate-600 my-4">
                {children}
            </blockquote>
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-slate-200 rounded-lg">
                    {children}
                </table>
            </div>
        ),
        th: ({ children }) => (
            <th className="border border-slate-200 bg-slate-50 px-4 py-2 text-left font-semibold">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="border border-slate-200 px-4 py-2">{children}</td>
        ),
        ...components,
    };
}
