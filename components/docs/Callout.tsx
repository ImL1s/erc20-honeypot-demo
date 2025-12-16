'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type CalloutType = 'info' | 'warning' | 'danger' | 'tip' | 'note';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: ReactNode;
}

const calloutStyles: Record<CalloutType, { icon: string; bg: string; border: string; title: string }> = {
    info: {
        icon: '💡',
        bg: 'bg-blue-50',
        border: 'border-blue-400',
        title: '資訊',
    },
    warning: {
        icon: '⚠️',
        bg: 'bg-amber-50',
        border: 'border-amber-400',
        title: '注意',
    },
    danger: {
        icon: '🚨',
        bg: 'bg-red-50',
        border: 'border-red-400',
        title: '危險',
    },
    tip: {
        icon: '✨',
        bg: 'bg-mint/10',
        border: 'border-mint',
        title: '提示',
    },
    note: {
        icon: '📝',
        bg: 'bg-slate-50',
        border: 'border-slate-400',
        title: '備註',
    },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const style = calloutStyles[type];

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`my-4 rounded-xl border-l-4 p-4 ${style.bg} ${style.border}`}
        >
            <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{style.icon}</span>
                <div className="flex-1">
                    {title && (
                        <h5 className="font-semibold text-ink mb-1">
                            {title || style.title}
                        </h5>
                    )}
                    <div className="text-slate-700 text-sm leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
