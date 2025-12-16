'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface DocItem {
    slug: string;
    title: string;
    icon: string;
    difficulty: number;
}

const eipDocs: DocItem[] = [
    { slug: 'eip-20', title: 'ERC-20 代幣標準', icon: '🪙', difficulty: 1 },
    { slug: 'eip-721', title: 'ERC-721 NFT 標準', icon: '🖼️', difficulty: 2 },
    { slug: 'eip-1155', title: 'ERC-1155 多代幣', icon: '📦', difficulty: 2 },
    { slug: 'eip-712', title: 'EIP-712 簽名標準', icon: '✍️', difficulty: 3 },
    { slug: 'eip-1559', title: 'EIP-1559 Gas 機制', icon: '⛽', difficulty: 2 },
    { slug: 'eip-4337', title: 'EIP-4337 帳戶抽象', icon: '🔐', difficulty: 3 },
    { slug: 'eip-2612', title: 'EIP-2612 Permit', icon: '📝', difficulty: 2 },
];

const bipDocs: DocItem[] = [
    { slug: 'bip-32', title: 'BIP-32 HD 錢包', icon: '🌳', difficulty: 2 },
    { slug: 'bip-39', title: 'BIP-39 助記詞', icon: '🔑', difficulty: 2 },
    { slug: 'bip-44', title: 'BIP-44 多帳戶', icon: '📂', difficulty: 2 },
    { slug: 'bip-141', title: 'BIP-141 SegWit', icon: '⚡', difficulty: 3 },
];

function DifficultyBadge({ level }: { level: number }) {
    const stars = '⭐'.repeat(level);
    return (
        <span className="text-xs opacity-70" title={`難度: ${level}/3`}>
            {stars}
        </span>
    );
}

function DocLink({ item, category }: { item: DocItem; category: string }) {
    const pathname = usePathname();
    const href = `/docs/${category}/${item.slug}`;
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive
                        ? 'bg-mint/20 text-mint font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
            >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-sm truncate">{item.title}</span>
                <DifficultyBadge level={item.difficulty} />
            </motion.div>
        </Link>
    );
}

export function DocSidebar() {
    return (
        <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8 glass rounded-2xl p-4 space-y-6">
                {/* EIP Section */}
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-ink uppercase tracking-wide mb-3">
                        <span className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center text-xs">
                            E
                        </span>
                        Ethereum EIPs
                    </h3>
                    <nav className="space-y-1">
                        {eipDocs.map((item) => (
                            <DocLink key={item.slug} item={item} category="eip" />
                        ))}
                    </nav>
                </div>

                {/* BIP Section */}
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-ink uppercase tracking-wide mb-3">
                        <span className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-xs">
                            B
                        </span>
                        Bitcoin BIPs
                    </h3>
                    <nav className="space-y-1">
                        {bipDocs.map((item) => (
                            <DocLink key={item.slug} item={item} category="bip" />
                        ))}
                    </nav>
                </div>

                {/* Quick Links */}
                <div className="border-t border-slate-200 pt-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                        快速連結
                    </h3>
                    <nav className="space-y-1">
                        <Link
                            href="/lab"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <span>🧪</span>
                            互動實驗室
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <span>🍯</span>
                            Honeypot Demo
                        </Link>
                    </nav>
                </div>
            </div>
        </aside>
    );
}
