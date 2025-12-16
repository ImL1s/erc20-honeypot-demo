import { ReactNode } from 'react';
import Link from 'next/link';
import { DocSidebar } from '../../components/docs/DocSidebar';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { SocialLinks } from '../../components/SocialLinks';
import { LocaleProvider } from '../../components/LocaleProvider';

export default function DocsLayout({ children }: { children: ReactNode }) {
    return (
        <LocaleProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Header */}
                <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/docs" className="flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                <span className="font-bold text-xl text-ink">EIP/BIP 教學平台</span>
                            </Link>
                            <nav className="hidden md:flex items-center gap-4 text-sm">
                                <Link href="/docs" className="text-slate-600 hover:text-ink transition-colors">
                                    文檔
                                </Link>
                                <Link href="/lab" className="text-slate-600 hover:text-ink transition-colors">
                                    實驗室
                                </Link>
                                <Link href="/" className="text-slate-600 hover:text-ink transition-colors">
                                    Honeypot Demo
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher />
                            <SocialLinks variant="floating" />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex gap-8">
                        <DocSidebar />
                        <main className="flex-1 min-w-0">
                            <article className="glass rounded-3xl p-6 md:p-8 shadow-xl">
                                {children}
                            </article>
                        </main>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-slate-200 py-8 mt-16">
                    <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
                        <p>📚 EIP/BIP 互動式教育平台 - 深入理解區塊鏈標準</p>
                        <p className="mt-2">Built with ☕ for Web3 Education</p>
                    </div>
                </footer>
            </div>
        </LocaleProvider>
    );
}
