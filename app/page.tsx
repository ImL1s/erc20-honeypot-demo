"use client";

import { useState } from "react";
import { Providers } from "./providers";
import { WalletPanel } from "../components/WalletPanel";
import { CodeSnippet } from "../components/CodeSnippet";
import { AdBanner } from "../components/AdBanner";
import { SocialLinks } from "../components/SocialLinks";
import { CONTRACT_ADDRESS } from "../lib/contract";

const ETHERSCAN_URL = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}#code`;
const GITHUB_URL = "https://github.com/ImL1s/erc20-honeypot-demo";

const blacklistSnippet = `
function _update(address from, address to, uint256 amount) internal override {
    if (from != address(0)) {
        if (strictMode) revert("Sell blocked: strict");
        if (blacklist[from]) revert("Sell blocked: blacklisted");
    }
    super._update(from, to, amount);
}
`;

const faucetSnippet = `
function faucet(address to, uint256 amount) external {
    require(amount <= FAUCET_MAX, "Faucet too large");
    _mint(to, amount); // 買得進
}
`;

const redFlags = [
  "transfer / transferFrom 內嵌黑名單或怪條件",
  "owner 權限保留、可隨時改 blacklist / strictMode",
  "沒有鎖流動性、流動池可被抽乾",
  "無上限 faucet / 任意增發"
];

export default function Home() {
  const [highlightError, setHighlightError] = useState<"strict" | "blacklist" | null>(null);

  let highlightKeyword = "";
  if (highlightError === "strict") highlightKeyword = "strictMode";
  if (highlightError === "blacklist") highlightKeyword = "blacklist[from]";

  return (
    <Providers>
      {/* 右上角浮動社交按鈕 */}
      <SocialLinks variant="floating" />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-mint/70 via-white to-sand p-8 shadow-xl ring-1 ring-ink/10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/70">
            Honeypot Demo · ERC-20
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            為什麼貔貅盤能讓你買得進、賣不掉？
          </h1>
          <p className="max-w-3xl text-lg text-ink/80">
            在 ERC-20 裡，餘額只是 mapping。團隊只要在 <code>transfer</code> 轉出邏輯加阻擋，就能讓你永遠賣不掉。下面用一個
            honeypot 合約 + 互動前端，直接感受。
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
            <span className="rounded-full bg-white/70 px-3 py-1">Sepolia</span>
            <span className="rounded-full bg-white/70 px-3 py-1">黑名單 / 嚴格模式</span>
            <span className="rounded-full bg-white/70 px-3 py-1">買得進、賣出 revert</span>
            <a
              href={ETHERSCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink/10 px-3 py-1 transition-colors hover:bg-ink/20"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              合約原始碼
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink/10 px-3 py-1 transition-colors hover:bg-ink/20"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              專案原始碼
            </a>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <WalletPanel onError={setHighlightError} />
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-ink/10">
              <h2 className="text-2xl font-semibold">互動說明</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink/80">
                <li>連上錢包（請使用 Sepolia 測試網）。</li>
                <li>
                  <span className="font-bold text-ink">買入 (Buy)：</span>
                  切換到 <strong>ETH → PIXIU</strong> 模式，輸入數量並點擊「立即買入」。這會呼叫 Faucet 免費獲得代幣（模擬買入成功）。
                </li>
                <li>
                  <span className="font-bold text-ink">賣出 (Sell)：</span>
                  點擊中間箭頭切換為 <strong>PIXIU → ETH</strong> 模式。嘗試將代幣換回 ETH。
                </li>
                <li>
                  觀察結果：賣出交易會失敗（Revert），下方會出現紅色警告，說明是被「嚴格模式」或「黑名單」攔截。
                </li>
              </ol>
            </div>
            <CodeSnippet
              title="轉出被攔截的核心"
              highlightKeyword={highlightKeyword}
            >
              {blacklistSnippet}
            </CodeSnippet>
            <CodeSnippet title="買得進（faucet 代替 swap）">
              {faucetSnippet}
            </CodeSnippet>
            {/* 側邊廣告位 - 放在說明區塊下方 */}
            <AdBanner slot="sidebar" className="mt-2" />
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl bg-ink px-6 py-8 text-sand shadow-lg">
          <h3 className="text-xl font-semibold">你應該檢查的紅旗</h3>
          <ul className="grid gap-2 text-base">
            {redFlags.map((flag) => (
              <li key={flag} className="flex items-start gap-3">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-mint" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 底部廣告位 */}
        <section className="flex justify-center">
          <AdBanner slot="footer" />
        </section>

        {/* Footer 社交連結與版權 */}
        <footer className="flex flex-col items-center gap-6 border-t border-ink/10 pt-10">
          <SocialLinks variant="footer" />
          <p className="text-center text-xs text-ink/40">
            本專案僅供教育與研究用途，旨在提升 Web3 安全意識。
            <br />
            Don&apos;t trust, verify.
          </p>
        </footer>
      </main>
    </Providers>
  );
}
