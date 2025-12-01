import { Providers } from "./providers";
import { WalletPanel } from "../components/WalletPanel";
import { CodeSnippet } from "../components/CodeSnippet";

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
  return (
    <Providers>
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
          <div className="flex flex-wrap gap-3 text-sm text-ink/70">
            <span className="rounded-full bg-white/70 px-3 py-1">Sepolia</span>
            <span className="rounded-full bg-white/70 px-3 py-1">黑名單 / 嚴格模式</span>
            <span className="rounded-full bg-white/70 px-3 py-1">買得進、賣出 revert</span>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <WalletPanel />
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-ink/10">
              <h2 className="text-2xl font-semibold">互動說明</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink/80">
                <li>連上錢包（建議 Sepolia）。</li>
                <li>點「買入 / faucet」拿 PIXIU，會成功。</li>
                <li>點「嘗試賣出」，轉出會 revert，錯誤訊息顯示「黑名單」或「嚴格模式」。</li>
              </ol>
            </div>
            <CodeSnippet title="轉出被攔截的核心">
              {blacklistSnippet}
            </CodeSnippet>
            <CodeSnippet title="買得進（faucet 代替 swap）">
              {faucetSnippet}
            </CodeSnippet>
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
      </main>
    </Providers>
  );
}
