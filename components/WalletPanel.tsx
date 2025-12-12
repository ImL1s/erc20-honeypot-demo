// ... imports ...
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
  useBalance
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatEther, parseEther } from "viem";
import { CONTRACT_ADDRESS, pixiuAbi } from "../lib/contract";
import { useLocale } from "./LocaleProvider";

const zeroAddress = "0x0000000000000000000000000000000000000000";

// Icons (Nature themed ideally, but clean rounded icons work)
const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
  </svg>
);

export function WalletPanel({ onError }: { onError?: (type: "blacklist" | null) => void }) {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { t } = useLocale();

  const { data: ethBalance } = useBalance({ address });

  const { writeContractAsync, isPending: writePending } = useWriteContract();
  const [actionTx, setActionTx] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"strict" | "blacklist" | "unknown" | null>(null);

  // Swap State: "buy" (Mint) or "sell" (Transfer)
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("1000");
  const [sellTarget, setSellTarget] = useState<`0x${string}` | undefined>();

  const hasContract =
    CONTRACT_ADDRESS !== zeroAddress &&
    CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  const copyAddress = () => {
    if (address) navigator.clipboard.writeText(address);
  };

  // Contract Reads
  const balanceQuery = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: pixiuAbi,
    functionName: "balanceOf",
    args: [address ?? zeroAddress],
    query: { enabled: Boolean(isConnected && hasContract) }
  });

  const ownerQuery = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: pixiuAbi,
    functionName: "owner",
    query: {
      enabled: hasContract
    }
  });

  const blacklistQuery = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: pixiuAbi,
    functionName: "blacklist",
    args: [address ?? zeroAddress],
    query: { enabled: Boolean(isConnected && hasContract) }
  });

  const strictModeQuery = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: pixiuAbi,
    functionName: "strictMode",
    query: { enabled: hasContract }
  });

  // Refresh balance after tx
  const receiptQuery = useWaitForTransactionReceipt({
    hash: actionTx,
    query: {
      enabled: Boolean(actionTx)
    }
  });

  // keep sell target in sync with owner address when fetched
  useEffect(() => {
    if (ownerQuery.data) {
      setSellTarget(ownerQuery.data as `0x${string}`);
    }
  }, [ownerQuery.data]);

  // refresh balance/blacklist once tx confirmed
  useEffect(() => {
    if (receiptQuery.isSuccess) {
      balanceQuery.refetch();
      blacklistQuery.refetch();
    }
  }, [receiptQuery.isSuccess, balanceQuery, blacklistQuery]);

  const handleAction = async () => {
    if (!address) return;
    if (chainId !== sepolia.id) {
      switchChain({ chainId: sepolia.id });
      return;
    }

    setError(null);
    setErrorType(null);
    onError?.(null);

    try {
      let hash: `0x${string}`;

      if (mode === "buy") {
        // Faucet / Mint
        hash = await writeContractAsync({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: pixiuAbi,
          functionName: "faucet",
          args: [address, parseEther(amount || "0")]
        });
      } else {
        // Sell / Transfer
        const target = sellTarget || zeroAddress;
        hash = await writeContractAsync({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: pixiuAbi,
          functionName: "transfer",
          args: [target, parseEther(amount || "0")]
        });
      }
      setActionTx(hash);
    } catch (err: any) {
      const msg = err?.message || "";
      console.error(err);

      if (msg.includes("Sell blocked: blacklisted")) {
        setError(t("wallet.errors.blacklist") as string);
        setErrorType("blacklist");
        onError?.("blacklist");
      } else if (msg.includes("User rejected")) {
        setError(t("wallet.errors.rejected") as string);
      } else {
        setError((err?.shortMessage as string) || (t("wallet.errors.unknown") as string));
        setErrorType("unknown");
      }
    }
  };

  // Switch mode
  const toggleMode = () => {
    setMode((prev) => (prev === "buy" ? "sell" : "buy"));
    setError(null);
    setErrorType(null);
    onError?.(null);
  };

  const balance = balanceQuery.isFetched && isConnected
    ? Number(formatEther((balanceQuery.data as bigint) ?? 0n)).toLocaleString()
    : "0";

  return (
    <div className="relative flex flex-col gap-6 rounded-[2.5rem] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-2 border-dashed border-stone-200 md:p-8">
      {/* Header: Wallet & Chain */}
      <div className="flex items-center justify-between mb-2">
        {isConnected ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="text-[13px] font-bold uppercase tracking-wider text-stone-400">
              {t("wallet.yourWallet") as string}
            </div>
            <div className="flex items-center justify-between">
              {chainId !== sepolia.id ? (
                <div className="flex items-center gap-2 w-full justify-between bg-red-50 p-3 rounded-2xl border border-red-100 text-red-700">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-bold">{t("wallet.wrongNetwork") as string}</span>
                  </div>
                  <button
                    onClick={() => switchChain({ chainId: sepolia.id })}
                    className="rounded-xl bg-red-400 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-500 shadow-sm transition-all hover:shadow-md"
                  >
                    {t("wallet.switchToSepolia") as string}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-bold ring-4 ring-blue-50">
                      {chain?.name?.[0] || "S"}
                    </div>
                    <span className="text-base font-bold text-stone-600">{chain?.name || "Sepolia"}</span>
                  </div>
                  <button onClick={() => disconnect()} className="rounded-xl px-3 py-1 text-xs font-bold text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-all">
                    {t("wallet.disconnect") as string}
                  </button>
                </>
              )}
            </div>

            {chainId === sepolia.id && (
              <div className="flex items-center justify-between mt-1 rounded-2xl bg-stone-50 p-4 border border-stone-100">
                <div className="flex flex-col">
                  <button
                    onClick={copyAddress}
                    className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-900 transition"
                    title="Copy Address"
                  >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                    <CopyIcon />
                  </button>
                  <span className="text-[11px] text-stone-400 font-bold tracking-wide mt-1">{t("wallet.walletTag") as string}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-stone-700">
                    {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0.0000"} <span className="text-sm font-bold text-stone-400">ETH</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-bold tracking-wide">{t("wallet.balanceTag") as string}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="text-[13px] font-bold uppercase tracking-wider text-stone-400">
              {t("wallet.yourWallet") as string}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-stone-400">
              <div className="h-2.5 w-2.5 rounded-full bg-stone-300" />
              <span>{t("wallet.disconnected") as string}</span>
            </div>
            <div className="flex gap-2">
              {connectors.slice(0, 2).map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="rounded-xl bg-stone-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-stone-700 hover:scale-[1.02] shadow-md"
                >
                  {t("wallet.connectWith", { name: connector.name }) as string}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Swap Card */}
      <div className="relative flex flex-col gap-2">

        {/* Top Input (From) */}
        <div className="rounded-[1.5rem] bg-stone-50 p-5 transition hover:bg-white hover:shadow-sm border border-stone-100 group">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t("wallet.payFrom") as string}</label>
            {mode === "sell" && <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg">{t("wallet.balanceLabel") as string}: {balance}</span>}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={mode === "buy" ? "0" : amount} // Buy is free (faucet)
              onChange={(e) => mode === "sell" && setAmount(e.target.value)}
              disabled={mode === "buy"}
              className="w-full bg-transparent text-4xl font-black text-stone-800 placeholder-stone-300 focus:outline-none disabled:text-stone-400"
            />
            <span className="rounded-xl bg-white px-4 py-2 text-lg font-bold shadow-sm ring-1 ring-stone-200 min-w-[90px] text-center text-stone-700">
              {mode === "buy" ? "ETH" : "PIXIU"}
            </span>
          </div>
        </div>

        {/* Arrow Switcher */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={toggleMode}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-sky-100 text-sky-600 shadow-md hover:bg-sky-200 hover:rotate-180 hover:scale-110 transition-all duration-300"
          >
            <ArrowDownIcon />
          </button>
        </div>

        {/* Bottom Input (To) */}
        <div className="rounded-[1.5rem] bg-stone-50 p-5 transition hover:bg-white hover:shadow-sm border border-stone-100 group">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t("wallet.receiveTo") as string}</label>
            {mode === "buy" && <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg">{t("wallet.balanceLabel") as string}: {balance}</span>}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={mode === "buy" ? amount : "0"} // Sell returns 0 in honeypot
              onChange={(e) => mode === "buy" && setAmount(e.target.value)}
              disabled={mode === "sell"}
              className={`w-full bg-transparent text-4xl font-black placeholder-stone-300 focus:outline-none ${mode === "sell" ? "text-red-400 line-through decoration-4 decoration-red-200" : "text-stone-800"}`}
            />
            <span className="rounded-xl bg-white px-4 py-2 text-lg font-bold shadow-sm ring-1 ring-stone-200 min-w-[90px] text-center text-stone-700">
              {mode === "buy" ? "PIXIU" : "ETH"}
            </span>
          </div>
        </div>
      </div>

      {/* Price Impact / Info */}
      <div className="flex justify-between px-3 text-xs font-bold text-stone-400">
        <span>{t("wallet.rateLabel") as string}</span>
        <span className="bg-stone-100 px-2 py-0.5 rounded-lg">1 ETH = 1 PIXIU</span>
      </div>

      {/* Action Button */}
      {/* Ghibli Style: Chunky, colorful buttons like candy or fruit */}
      <button
        onClick={handleAction}
        disabled={!isConnected || writePending || !hasContract}
        className={`
          group relative w-full overflow-hidden rounded-[20px] p-5 text-xl font-black text-white shadow-xl transition-all
          disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale
          ${mode === "buy"
            ? "bg-[#6BCB77] hover:bg-[#5daf69] hover:-translate-y-1 shadow-[#6BCB77]/30"
            : "bg-[#FF6B6B] hover:bg-[#fa5b5b] hover:-translate-y-1 shadow-[#FF6B6B]/30"}
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
          {writePending
            ? (t("wallet.actions.processing") as string)
            : mode === "buy"
              ? (
                <>
                  <span>🍃</span> {t("wallet.actions.buy") as string}
                </>
              )
              : (
                <>
                  <span>🔥</span> {t("wallet.actions.sell") as string}
                </>
              )}
        </span>
      </button>

      {/* Error / Feedback Panel */}
      {error && (
        <div className="animate-in fade-in zoom-in-95 duration-300 rounded-2xl border-l-8 border-red-400 bg-red-50 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl animate-bounce">👺</div>
            <div>
              <h4 className="font-black text-red-800 text-lg">{t("wallet.errors.title") as string}</h4>
              <p className="text-sm text-red-700 mt-1 font-bold leading-relaxed">{error}</p>
              <p className="text-xs text-red-500 mt-2 font-medium bg-white/50 p-2 rounded-lg">
                {errorType === "strict" && (t("wallet.errors.strictHint") as string)}
                {errorType === "blacklist" && (t("wallet.errors.blacklistHint") as string)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicators (Stamps) */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className={`
            flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold uppercase tracking-widest border-2 border-dashed
            ${blacklistQuery.data
            ? "bg-red-50 text-red-500 border-red-200"
            : "bg-green-50 text-green-600 border-green-200"}
         `}>
          {blacklistQuery.data ? "🚫 Listed" : "✅ Clean"}
        </div>
        <div className={`
             flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold uppercase tracking-widest border-2 border-dashed
            ${strictModeQuery.data
            ? "bg-orange-50 text-orange-500 border-orange-200"
            : "bg-blue-50 text-blue-500 border-blue-200"}
         `}>
          {strictModeQuery.data ? "🔒 Strict" : "🔓 Open"}
        </div>
      </div>

      {!hasContract && (
        <p className="text-center text-xs font-bold text-stone-300 bg-stone-50 py-2 rounded-lg">{t("wallet.status.contractMissing") as string}</p>
      )}
    </div>
  );
}
