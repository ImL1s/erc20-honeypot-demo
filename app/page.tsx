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
      {/* Background Decor: Clouds/Sky */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Blue Sky Gradient is in body, add subtle cloud-like blobs */}
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-white/40 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] h-[400px] w-[400px] rounded-full bg-white/30 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-green-100/30 blur-[120px]" />
      </div>

      {/* Floating Header */}
      <div className="fixed right-6 top-6 z-50 flex items-center gap-3">
        <LanguageSwitcher />
        <SponsorButton />
        <SocialLinks variant="floating" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 text-stone-700">

        {/* Hero Section */}
        <header className="flex flex-col gap-8 rounded-[3rem] bg-white/60 backdrop-blur-sm p-12 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white/50">
          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#7ebc59]">
              <span className="h-2 w-2 rounded-full bg-[#7ebc59] animate-pulse" />
              {t("home.kicker") as string}
            </p>
            <h1 className="text-5xl font-black leading-tight md:text-7xl text-stone-800 drop-shadow-sm font-display tracking-tight">
              {t("home.title") as string}
            </h1>
          </div>

          <p className="max-w-3xl text-2xl text-stone-500 font-medium leading-relaxed">
            {t("home.subtitle") as string}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {badges.map((badge) => (
              <span key={badge} className="rounded-full bg-stone-100 px-5 py-2 font-bold text-stone-500 ring-2 ring-white shadow-sm">
                {badge}
              </span>
            ))}
            <a
              href={ETHERSCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#e8f5e9] px-5 py-2 font-bold text-[#2e7d32] ring-2 ring-white transition-all hover:bg-[#c8e6c9] hover:shadow-md"
            >
              <svg className="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              {t("home.links.contract") as string}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-stone-100 px-5 py-2 font-bold text-stone-600 ring-2 ring-white transition-all hover:bg-stone-200 hover:shadow-md"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {t("home.links.repo") as string}
            </a>
          </div>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1fr,1.3fr] items-start">
          <div className="flex flex-col gap-6 sticky top-6">
            <WalletPanel onError={setHighlightError} />
            {/* 側邊廣告位 */}
            <AdBanner slot="sidebar" className="mt-2" />
          </div>

          <div className="flex flex-col gap-6">
            {/* Steps Card */}
            <div className="rounded-[2.5rem] bg-[#fffcf5] p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] ring-1 ring-stone-100">
              <h2 className="text-2xl font-black flex items-center gap-3 text-stone-800 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {t("home.interactionTitle") as string}
              </h2>
              <ol className="relative space-y-6 border-l-2 border-orange-100 pl-8 ml-4">
                {steps.map((step, idx) => (
                  <li key={step} className="relative text-lg text-stone-600 font-medium leading-relaxed">
                    <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-white ring-4 ring-orange-50 text-sm font-bold text-orange-400 shadow-sm">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
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
          </div>
        </section>

        {/* Red Flags / Warning Section */}
        <section className="relative overflow-hidden rounded-[3rem] bg-[#fff5f5] px-10 py-12 shadow-xl ring-1 ring-red-100">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="text-red-900">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>

          <h3 className="relative z-10 text-3xl font-black text-red-800 flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-100 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
                <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            {t("home.redFlagsTitle") as string}
          </h3>
          <ul className="relative z-10 grid gap-4 md:grid-cols-2 text-lg text-stone-700">
            {redFlags.map((flag) => (
              <li key={flag} className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-50 transition-all hover:shadow-md hover:ring-red-100">
                <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-red-400" />
                <span className="font-medium leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 底部廣告位 */}
        <section className="flex justify-center py-6">
          <AdBanner slot="footer" />
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-8 border-t-2 border-dashed border-stone-200 pt-12 pb-6">
          <SocialLinks variant="footer" />
          <p className="text-center text-sm font-bold text-stone-400 tracking-wide">{t("home.footerNotice") as string}</p>
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
