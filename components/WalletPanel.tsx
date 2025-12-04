"use client";

import { useState } from "react";
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

const zeroAddress = "0x0000000000000000000000000000000000000000";

// Icons
const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
  </svg>
);

export function WalletPanel({ onError }: { onError?: (type: "strict" | "blacklist" | null) => void }) {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  
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
      enabled: hasContract,
      onSuccess: (ownerAddr) => setSellTarget(ownerAddr as `0x${string}`)
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
  useWaitForTransactionReceipt({
    hash: actionTx,
    query: {
      enabled: Boolean(actionTx),
      onSuccess: () => {
        balanceQuery.refetch();
        blacklistQuery.refetch();
        // ethBalance automatically refreshes via wagmi
      }
    }
  });

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
      
      if (msg.includes("Sell blocked: strict")) {
        setError("交易失敗：嚴格模式已開啟 (Strict Mode)");
        setErrorType("strict");
        onError?.("strict");
      } else if (msg.includes("Sell blocked: blacklisted")) {
        setError("交易失敗：你已被列入黑名單 (Blacklisted)");
        setErrorType("blacklist");
        onError?.("blacklist");
      } else if (msg.includes("User rejected")) {
        setError("使用者取消交易");
      } else {
        setError(err?.shortMessage || "交易失敗");
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
    ? Number(formatEther((balanceQuery.data as bigint) || 0)).toLocaleString()
    : "0";

  return (
    <div className="relative flex flex-col gap-4 rounded-[2rem] bg-white p-4 shadow-2xl ring-1 ring-black/5 md:p-6">
      {/* Header: Wallet & Chain */}
      <div className="flex items-center justify-between mb-2">
        {isConnected ? (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
               {chainId !== sepolia.id ? (
                 <div className="flex items-center gap-2 w-full justify-between bg-red-50 p-2 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold">Wrong Network</span>
                    </div>
                    <button 
                      onClick={() => switchChain({ chainId: sepolia.id })}
                      className="rounded-md bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 shadow-sm"
                    >
                      Switch to Sepolia
                    </button>
                 </div>
               ) : (
                 <>
                   <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                        {chain?.name?.[0] || "S"}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{chain?.name || "Sepolia"}</span>
                   </div>
                   <button onClick={() => disconnect()} className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors">
                     斷開
                   </button>
                 </>
               )}
            </div>
            
            {chainId === sepolia.id && (
              <div className="flex items-center justify-between mt-2 rounded-xl bg-slate-50 p-3 border border-slate-100">
                 <div className="flex flex-col">
                    <button 
                      onClick={copyAddress}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                      title="Copy Address"
                    >
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                      <CopyIcon />
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">WALLET</span>
                 </div>
                 <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">
                      {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0.0000"} <span className="text-xs text-slate-500">ETH</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide">BALANCE</span>
                 </div>
              </div>
            )}
          </div>
        ) : (
           <div className="flex items-center justify-between w-full">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <div className="h-2 w-2 rounded-full bg-slate-300" />
                <span>未連線</span>
             </div>
             <div className="flex gap-1">
                {connectors.slice(0,2).map((connector) => (
                   <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-700"
                  >
                    連線 {connector.name}
                  </button>
                ))}
              </div>
           </div>
        )}
      </div>

      {/* Main Swap Card */}
      <div className="relative flex flex-col gap-1">
        
        {/* Top Input (From) */}
        <div className="rounded-2xl bg-slate-100 p-4 transition hover:bg-slate-50 border border-transparent hover:border-slate-200">
          <div className="flex justify-between mb-1">
             <label className="text-xs font-semibold text-slate-500">支付 (From)</label>
             {mode === "sell" && <span className="text-xs text-slate-500">餘額: {balance}</span>}
          </div>
          <div className="flex items-center gap-3">
             <input
              type="number"
              value={mode === "buy" ? "0" : amount} // Buy is free (faucet)
              onChange={(e) => mode === "sell" && setAmount(e.target.value)}
              disabled={mode === "buy"}
              className="w-full bg-transparent text-3xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
             />
             <span className="rounded-full bg-white px-3 py-1 text-lg font-bold shadow-sm ring-1 ring-black/5 min-w-[80px] text-center">
               {mode === "buy" ? "ETH" : "PIXIU"}
             </span>
          </div>
        </div>

        {/* Arrow Switcher */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={toggleMode}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-white bg-slate-100 text-slate-600 shadow-sm hover:bg-slate-200 hover:scale-105 transition"
          >
            <ArrowDownIcon />
          </button>
        </div>

        {/* Bottom Input (To) */}
        <div className="rounded-2xl bg-slate-100 p-4 transition hover:bg-slate-50 border border-transparent hover:border-slate-200">
           <div className="flex justify-between mb-1">
             <label className="text-xs font-semibold text-slate-500">收到 (To)</label>
             {mode === "buy" && <span className="text-xs text-slate-500">餘額: {balance}</span>}
          </div>
          <div className="flex items-center gap-3">
             <input
              type="number"
              value={mode === "buy" ? amount : "0"} // Sell returns 0 in honeypot
              onChange={(e) => mode === "buy" && setAmount(e.target.value)}
              disabled={mode === "sell"}
              className={`w-full bg-transparent text-3xl font-medium placeholder-slate-400 focus:outline-none ${mode === "sell" ? "text-red-500/50" : "text-slate-900"}`}
             />
             <span className="rounded-full bg-white px-3 py-1 text-lg font-bold shadow-sm ring-1 ring-black/5 min-w-[80px] text-center">
               {mode === "buy" ? "PIXIU" : "ETH"}
             </span>
          </div>
        </div>
      </div>

      {/* Price Impact / Info */}
      <div className="flex justify-between px-2 text-xs font-medium text-slate-500">
        <span>匯率 (模擬)</span>
        <span>1 ETH = ∞ PIXIU</span>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAction}
        disabled={!isConnected || writePending || !hasContract}
        className={`
          group relative w-full overflow-hidden rounded-2xl p-4 text-xl font-bold text-white shadow-lg transition-all
          disabled:cursor-not-allowed disabled:opacity-50
          ${mode === "buy" ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.01]" : "bg-gradient-to-r from-red-500 to-pink-600 hover:scale-[1.01]"}
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
           {writePending ? "處理中..." : mode === "buy" ? "立即買入 (Faucet)" : "確認賣出"}
        </span>
      </button>

      {/* Error / Feedback Panel */}
      {error && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 shadow-inner">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-2xl">🚨</div>
            <div>
              <h4 className="font-bold text-red-900">交易失敗 (Honeypot!)</h4>
              <p className="text-sm text-red-800 mt-1 font-medium">{error}</p>
              <p className="text-xs text-red-600 mt-2 leading-relaxed opacity-80">
                {errorType === "strict" && "這就是「嚴格模式」：合約中的 strictMode 變數為 true，直接阻擋任何轉出操作。"}
                {errorType === "blacklist" && "這就是「黑名單機制」：你的地址被標記在 blacklist 中，無法進行轉帳。"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-2 mt-2">
         <div className={`rounded-lg p-2 text-center text-xs font-bold ${strictModeQuery.data ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200" : "bg-slate-100 text-slate-400"}`}>
            嚴格模式: {strictModeQuery.data ? "開啟 (ON)" : "關閉"}
         </div>
         <div className={`rounded-lg p-2 text-center text-xs font-bold ${blacklistQuery.data ? "bg-red-100 text-red-700 ring-1 ring-red-200" : "bg-slate-100 text-slate-400"}`}>
            黑名單: {blacklistQuery.data ? "YES" : "NO"}
         </div>
      </div>

      {!hasContract && (
         <p className="text-center text-xs text-slate-400">Contract not configured</p>
      )}
    </div>
  );
}
