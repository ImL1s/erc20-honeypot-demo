import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'EIP/BIP 互動式教育平台',
    description: '深入理解區塊鏈標準，從原理到實踐',
};

const featuredDocs = [
    {
        slug: 'eip/eip-20',
        title: 'ERC-20 代幣標準',
        icon: '🪙',
        description: '定義以太坊上可互換代幣的統一接口標準，是 DeFi 生態的基石。',
        difficulty: 1,
        tags: ['基礎', '代幣', 'DeFi'],
    },
    {
        slug: 'eip/eip-721',
        title: 'ERC-721 NFT 標準',
        icon: '🖼️',
        description: '非同質化代幣標準，讓每個代幣都獨一無二，推動了數位藝術革命。',
        difficulty: 2,
        tags: ['NFT', '收藏品', '藝術'],
    },
    {
        slug: 'eip/eip-1559',
        title: 'EIP-1559 Gas 機制',
        icon: '⛽',
        description: '革命性的 Gas 費用改革，引入基礎費用銷毀機制，讓 ETH 更具價值。',
        difficulty: 2,
        tags: ['Gas', '經濟模型', 'London'],
    },
    {
        slug: 'bip/bip-39',
        title: 'BIP-39 助記詞',
        icon: '🔑',
        description: '將複雜的私鑰轉換為人類可讀的 12-24 個單詞，讓錢包備份變得簡單。',
        difficulty: 2,
        tags: ['錢包', '安全', '備份'],
    },
];

const learningPaths = [
    {
        title: '🌱 新手入門',
        description: '從零開始理解區塊鏈標準',
        docs: ['EIP-20', 'BIP-39'],
        color: 'from-green-400 to-emerald-500',
    },
    {
        title: '💎 代幣開發',
        description: '掌握代幣經濟與安全實踐',
        docs: ['EIP-20', 'EIP-2612', 'EIP-1155'],
        color: 'from-blue-400 to-indigo-500',
    },
    {
        title: '🎨 NFT 創建',
        description: '打造獨特的數位收藏品',
        docs: ['EIP-721', 'EIP-1155', 'EIP-712'],
        color: 'from-purple-400 to-pink-500',
    },
    {
        title: '🔐 進階安全',
        description: '深入理解帳戶抽象與簽名',
        docs: ['EIP-712', 'EIP-4337', 'BIP-32'],
        color: 'from-orange-400 to-red-500',
    },
];

function DifficultyStars({ level }: { level: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
                <span key={i} className={i <= level ? 'text-amber-400' : 'text-slate-300'}>
                    ⭐
                </span>
            ))}
        </div>
    );
}

export default function DocsHome() {
    return (
        <div className="space-y-12">
            {/* Hero */}
            <section className="text-center py-8">
                <h1 className="text-4xl md:text-5xl font-bold text-ink">
                    📚 EIP/BIP 互動式教育平台
                </h1>
                <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
                    深入理解區塊鏈標準，從原理到實踐。每個標準都有完整的解說、
                    互動式流程圖、原始碼範例與實驗環境。
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <span className="px-3 py-1 bg-mint/20 text-mint rounded-full text-sm">
                        ✅ 互動式圖表
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                        ✅ 完整原始碼
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                        ✅ 實驗環境
                    </span>
                </div>
            </section>

            {/* Featured Docs */}
            <section>
                <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2">
                    <span>🔥</span> 熱門標準
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {featuredDocs.map((doc) => (
                        <Link
                            key={doc.slug}
                            href={`/docs/${doc.slug}`}
                            className="group glass rounded-2xl p-5 hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{doc.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-ink group-hover:text-mint transition-colors">
                                            {doc.title}
                                        </h3>
                                        <DifficultyStars level={doc.difficulty} />
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{doc.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {doc.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Learning Paths */}
            <section>
                <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2">
                    <span>🛤️</span> 學習路徑
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {learningPaths.map((path) => (
                        <div
                            key={path.title}
                            className="glass rounded-2xl p-5 hover:shadow-lg transition-all"
                        >
                            <div className={`h-2 rounded-full bg-gradient-to-r ${path.color} mb-4`} />
                            <h3 className="font-semibold text-ink mb-2">{path.title}</h3>
                            <p className="text-sm text-slate-600 mb-4">{path.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {path.docs.map((doc, i) => (
                                    <span key={doc} className="text-xs text-slate-500">
                                        {doc}
                                        {i < path.docs.length - 1 && ' → '}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="text-center py-8 glass-dark rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-4">
                    🧪 準備好動手實驗了嗎？
                </h2>
                <p className="text-slate-300 mb-6">
                    前往互動實驗室，連接錢包，親身體驗每個標準的運作機制
                </p>
                <Link
                    href="/lab"
                    className="inline-flex items-center gap-2 bg-mint text-ink font-semibold px-6 py-3 rounded-full hover:bg-mint/90 transition-colors"
                >
                    <span>🚀</span>
                    進入實驗室
                </Link>
            </section>
        </div>
    );
}
