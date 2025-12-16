"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Providers } from "./providers";
import { WalletPanel } from "../components/WalletPanel";
import { CodeSnippet } from "../components/CodeSnippet";
import { AdBanner } from "../components/AdBanner";
import { SocialLinks } from "../components/SocialLinks";
import { SponsorButton } from "../components/SponsorModal";
import { ScamTypeSelector } from "../components/ScamTypeSelector";
import { type ScamType, SCAM_CONTRACTS } from "../lib/contract";
import { useLocale } from "../components/LocaleProvider";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

const GITHUB_URL = "https://github.com/ImL1s/erc20-honeypot-demo";

// Code snippets for each scam type
const codeSnippets: Record<ScamType, { transfer: string; faucet: string }> = {
  honeypot: {
    transfer: `
function _update(address from, address to, uint256 amount) internal override {
    if (from != address(0)) {
        // 白名單地址可以轉帳（團隊可以賣）
        if (!whitelist[from]) {
            if (blacklist[from]) revert("Sell blocked: blacklisted");
        }
    }
    super._update(from, to, amount);
}`,
    faucet: `
function faucet(address to, uint256 amount) external {
    require(amount <= FAUCET_MAX, "Faucet too large");
    _mint(to, amount);
    // 買家自動加入黑名單（真實貔貅行為）
    if (autoBlacklist && !whitelist[to]) {
        blacklist[to] = true;
    }
}`,
  },
  hiddenFee: {
    transfer: `
function _update(address from, address to, uint256 amount) internal override {
    if (from == address(0)) { super._update(from, to, amount); return; }
    if (whitelist[from]) { super._update(from, to, amount); return; }

    // 🔴 收取 90% 手續費！
    uint256 fee = (amount * sellFee) / 100;  // sellFee = 90
    super._update(from, owner(), fee);       // 手續費給 Owner
    super._update(from, to, amount - fee);   // 用戶只拿到 10%
}`,
    faucet: `
function faucet(address to, uint256 amount) external {
    require(amount <= FAUCET_MAX, "Faucet too large");
    // 買入時手續費為 0%，看起來很安全
    uint256 fee = (amount * buyFee) / 100;  // buyFee = 0
    _mint(to, amount - fee);
}`,
  },
  tradingSwitch: {
    transfer: `
function _update(address from, address to, uint256 amount) internal override {
    if (from == address(0)) { super._update(from, to, amount); return; }
    if (whitelist[from]) { super._update(from, to, amount); return; }

    // 🔴 交易開關陷阱！
    if (!tradingEnabled) {
        revert("Trading is disabled");
    }

    super._update(from, to, amount);
}`,
    faucet: `
// tradingEnabled 初始為 true，讓用戶可以買入
bool public tradingEnabled = true;

function setTradingEnabled(bool _enabled) external onlyOwner {
    tradingEnabled = _enabled;  // Owner 隨時可以關閉
}`,
  },
  maxTx: {
    transfer: `
function _update(address from, address to, uint256 amount) internal override {
    if (from == address(0)) { super._update(from, to, amount); return; }
    if (whitelist[from]) { super._update(from, to, amount); return; }

    // 🔴 交易限額陷阱！
    if (amount > maxTxAmount) {
        revert("Exceeds max transaction amount");
    }

    super._update(from, to, amount);
}`,
    faucet: `
// maxTxAmount 設為 0，沒人能賣出
uint256 public maxTxAmount = 0;

function setMaxTxAmount(uint256 _maxTx) external onlyOwner {
    maxTxAmount = _maxTx;  // Owner 可以調整
}`,
  },
  cooldown: {
    transfer: `
function _update(address from, address to, uint256 amount) internal override {
    if (from == address(0)) { super._update(from, to, amount); return; }
    if (whitelist[from]) { super._update(from, to, amount); return; }

    // 🔴 冷卻時間陷阱！
    uint256 elapsed = block.timestamp - lastReceiveTime[from];
    if (elapsed < cooldown) {
        revert("Cooldown active: 365 days remaining");
    }

    super._update(from, to, amount);
}`,
    faucet: `
// 365 天冷卻時間！
uint256 public cooldown = 365 days;

function faucet(address to, uint256 amount) external {
    _mint(to, amount);
    lastReceiveTime[to] = block.timestamp;  // 開始冷卻
}`,
  },
};

function HomeContent() {
  const { t } = useLocale();
  const [highlightError, setHighlightError] = useState<"blacklist" | null>(null);
  const [scamType, setScamType] = useState<ScamType>("honeypot");

  const badges = useMemo(() => t<string[]>("home.badges"), [t]);
  const steps = useMemo(() => t<string[]>("home.steps"), [t]);
  const redFlags = useMemo(() => t<string[]>("home.redFlags"), [t]);

  const currentConfig = SCAM_CONTRACTS[scamType];
  const currentSnippets = codeSnippets[scamType];
  const ETHERSCAN_URL = `https://sepolia.etherscan.io/address/${currentConfig.contractAddress}#code`;

  let highlightKeyword = "";
  if (highlightError === "blacklist") highlightKeyword = "blacklist[from]";

  return (
    <>
      {/* 右上角浮動按鈕 */}
      <div className="fixed right-4 top-4 z-40 flex items-center gap-3">
        <LanguageSwitcher />
        <SponsorButton />
        <SocialLinks variant="floating" />
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:px-6 py-8 md:py-12">
        {/* Hero Section with Banner */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-slate-800 to-slate-900 shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/hero-banner.png"
              alt="Web3 Security"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">
              {t("home.kicker") as string}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight text-white max-w-3xl">
              {t("home.title") as string}
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed">
              {t("home.subtitle") as string}
            </p>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {badges.map((badge, i) => (
                <span
                  key={badge}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${i === 0 ? "bg-mint/20 text-mint" : "bg-white/10 text-slate-200"
                    }`}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={ETHERSCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 hover-lift"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                {t("home.links.contract") as string}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 hover-lift"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {t("home.links.repo") as string}
              </a>
            </div>
          </div>
        </header>

        {/* Scam Type Selector */}
        <section>
          <ScamTypeSelector selected={scamType} onChange={setScamType} />
        </section>

        {/* Main Content Grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          <WalletPanel scamType={scamType} onError={setHighlightError} />
          <div className="flex flex-col gap-4">
            <div className="glass rounded-3xl p-6 shadow-xl hover-lift">
              <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                <span className="text-2xl">📖</span>
                {t("home.interactionTitle") as string}
              </h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700">
                {steps.map((step) => (
                  <li key={step} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
            <CodeSnippet
              title={t("home.code.transferTitle") as string}
              highlightKeyword={highlightKeyword}
            >
              {currentSnippets.transfer}
            </CodeSnippet>
            <CodeSnippet title={t("home.code.faucetTitle") as string}>
              {currentSnippets.faucet}
            </CodeSnippet>
            {/* 側邊廣告位 */}
            <AdBanner slot="sidebar" className="mt-2" />
          </div>
        </section>

        {/* Red Flags Section - Enhanced */}
        <section className="glass-dark rounded-3xl px-6 md:px-8 py-8 text-sand shadow-2xl">
          <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
            <span className="text-3xl animate-pulse-slow">🚨</span>
            {t("home.redFlagsTitle") as string}
          </h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {redFlags.map((flag) => (
              <li key={flag} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-mint flex-shrink-0" />
                <span className="text-slate-200 leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer Ad */}
        <section className="flex justify-center">
          <AdBanner slot="footer" />
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-6 border-t border-ink/10 pt-10">
          <SocialLinks variant="footer" />
          <p className="text-center text-xs text-ink/40 max-w-md">
            {t("home.footerNotice") as string}
          </p>
        </footer>
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  );
}
