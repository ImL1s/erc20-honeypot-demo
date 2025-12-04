"use client";

import { useMemo, useState } from "react";
import { Providers } from "./providers";
import { WalletPanel } from "../components/WalletPanel";
import { CodeSnippet } from "../components/CodeSnippet";
import { AdBanner } from "../components/AdBanner";
import { SocialLinks } from "../components/SocialLinks";
import { SponsorButton } from "../components/SponsorModal";
import { CONTRACT_ADDRESS } from "../lib/contract";
import { useLocale } from "../components/LocaleProvider";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

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

function HomeContent() {
  const { t } = useLocale();
  const [highlightError, setHighlightError] = useState<"strict" | "blacklist" | null>(null);

  const badges = useMemo(() => t<string[]>("home.badges"), [t]);
  const steps = useMemo(() => t<string[]>("home.steps"), [t]);
  const redFlags = useMemo(() => t<string[]>("home.redFlags"), [t]);

  let highlightKeyword = "";
  if (highlightError === "strict") highlightKeyword = "strictMode";
  if (highlightError === "blacklist") highlightKeyword = "blacklist[from]";

  return (
    <>
      {/* 右上角浮動按鈕 */}
      <div className="fixed right-4 top-4 z-40 flex items-center gap-3">
        <LanguageSwitcher />
        <SponsorButton />
        <SocialLinks variant="floating" />
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-mint/70 via-white to-sand p-8 shadow-xl ring-1 ring-ink/10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/70">
            {t("home.kicker") as string}
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            {t("home.title") as string}
          </h1>
          <p className="max-w-3xl text-lg text-ink/80">
            {t("home.subtitle") as string}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
            {badges.map((badge) => (
              <span key={badge} className="rounded-full bg-white/70 px-3 py-1">
                {badge}
              </span>
            ))}
            <a
              href={ETHERSCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink/10 px-3 py-1 transition-colors hover:bg-ink/20"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              {t("home.links.contract") as string}
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
              {t("home.links.repo") as string}
            </a>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <WalletPanel onError={setHighlightError} />
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-ink/10">
              <h2 className="text-2xl font-semibold">{t("home.interactionTitle") as string}</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink/80">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <CodeSnippet
              title={t("home.code.transferTitle") as string}
              highlightKeyword={highlightKeyword}
            >
              {blacklistSnippet}
            </CodeSnippet>
            <CodeSnippet title={t("home.code.faucetTitle") as string}>
              {faucetSnippet}
            </CodeSnippet>
            {/* 側邊廣告位 - 放在說明區塊下方 */}
            <AdBanner slot="sidebar" className="mt-2" />
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl bg-ink px-6 py-8 text-sand shadow-lg">
          <h3 className="text-xl font-semibold">{t("home.redFlagsTitle") as string}</h3>
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
          <p className="text-center text-xs text-ink/40">{t("home.footerNotice") as string}</p>
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
