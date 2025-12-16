'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { motion } from 'framer-motion';

interface FlowDiagramProps {
    chart: string;
    title?: string;
    caption?: string;
}

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        primaryColor: '#00D4AA',
        primaryTextColor: '#1E293B',
        primaryBorderColor: '#00B894',
        lineColor: '#64748B',
        secondaryColor: '#F8FAFC',
        tertiaryColor: '#E2E8F0',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    },
    flowchart: {
        curve: 'basis',
        padding: 20,
    },
    sequence: {
        actorMargin: 50,
        messageMargin: 40,
    },
});

export function FlowDiagram({ chart, title, caption }: FlowDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current) return;

            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
                setError(null);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError('圖表渲染失敗');
            }
        };

        renderDiagram();
    }, [chart]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="my-6"
        >
            {title && (
                <h4 className="text-lg font-semibold text-ink mb-3 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    {title}
                </h4>
            )}

            <div
                ref={containerRef}
                className="glass rounded-2xl p-6 overflow-x-auto"
            >
                {error ? (
                    <div className="text-red-500 text-center py-8">
                        ⚠️ {error}
                    </div>
                ) : svg ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: svg }}
                        className="flex justify-center [&>svg]:max-w-full"
                    />
                ) : (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-mint border-t-transparent rounded-full" />
                    </div>
                )}
            </div>

            {caption && (
                <p className="text-sm text-slate-500 text-center mt-2 italic">
                    {caption}
                </p>
            )}
        </motion.div>
    );
}
