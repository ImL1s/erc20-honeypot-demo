"use client";

import { useState, useEffect } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useWriteContract, useSwitchChain, useChainId } from "wagmi";
import { parseEther, parseUnits } from "viem";
import { mainnet, polygon, bsc, arbitrum, optimism, base } from "wagmi/chains";

const WALLET_ADDRESS = "0x889A5fDa61adA9E99f75A53c323e32430d1C34d8" as `0x${string}`;

// USDT contract addresses on different chains
const USDT_ADDRESSES: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  [polygon.id]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  [bsc.id]: "0x55d398326f99059fF775485246999027B3197955",
  [arbitrum.id]: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  [optimism.id]: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base (no native USDT)
};

// ERC20 transfer ABI
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const SUPPORTED_CHAINS = [
  { id: mainnet.id, name: "Ethereum", icon: "⟠", color: "bg-blue-100 text-blue-700", native: "ETH", decimals: 18 },
  { id: polygon.id, name: "Polygon", icon: "⬡", color: "bg-purple-100 text-purple-700", native: "MATIC", decimals: 18 },
  { id: bsc.id, name: "BSC", icon: "⬢", color: "bg-yellow-100 text-yellow-700", native: "BNB", decimals: 18 },
  { id: arbitrum.id, name: "Arbitrum", icon: "🔵", color: "bg-sky-100 text-sky-700", native: "ETH", decimals: 18 },
  { id: optimism.id, name: "Optimism", icon: "🔴", color: "bg-red-100 text-red-700", native: "ETH", decimals: 18 },
  { id: base.id, name: "Base", icon: "🔷", color: "bg-indigo-100 text-indigo-700", native: "ETH", decimals: 18 },
];

const PRESET_AMOUNTS_NATIVE = ["0.001", "0.005", "0.01", "0.05"];
const PRESET_AMOUNTS_USDT = ["1", "5", "10", "20"];

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("0.005");
  const [txSuccess, setTxSuccess] = useState(false);
  const [tokenType, setTokenType] = useState<"native" | "usdt">("native");
  const [selectedChainId, setSelectedChainId] = useState<number>(mainnet.id);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Native transfer
  const { data: nativeHash, isPending: nativePending, sendTransaction, reset: resetNative } = useSendTransaction();
  const { isLoading: nativeConfirming, isSuccess: nativeSuccess } = useWaitForTransactionReceipt({ hash: nativeHash });

  // ERC20 transfer
  const { data: erc20Hash, isPending: erc20Pending, writeContract, reset: resetErc20 } = useWriteContract();
  const { isLoading: erc20Confirming, isSuccess: erc20Success } = useWaitForTransactionReceipt({ hash: erc20Hash });

  const isPending = nativePending || erc20Pending;
  const isConfirming = nativeConfirming || erc20Confirming;
  const isSuccess = nativeSuccess || erc20Success;
  const hash = nativeHash || erc20Hash;

  const selectedChain = SUPPORTED_CHAINS.find(c => c.id === selectedChainId) || SUPPORTED_CHAINS[0];
  const presetAmounts = tokenType === "native" ? PRESET_AMOUNTS_NATIVE : PRESET_AMOUNTS_USDT;

  // Update amount when switching token type
  useEffect(() => {
    setAmount(tokenType === "native" ? "0.005" : "5");
  }, [tokenType]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Switch chain if needed
    if (chainId !== selectedChainId) {
      try {
        await switchChain({ chainId: selectedChainId });
        // Wait a bit for chain switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error("Failed to switch chain:", err);
        return;
      }
    }

    if (tokenType === "native") {
      sendTransaction({
        to: WALLET_ADDRESS,
        value: parseEther(amount),
      });
    } else {
      const usdtAddress = USDT_ADDRESSES[selectedChainId];
      if (!usdtAddress) return;

      // USDT has 6 decimals on most chains
      const decimals = selectedChainId === base.id ? 6 : 6; // USDC on Base also has 6 decimals
      writeContract({
        address: usdtAddress,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [WALLET_ADDRESS, parseUnits(amount, decimals)],
      });
    }
  };

  // Show success state
  if (isSuccess && !txSuccess) {
    setTxSuccess(true);
  }

  const handleClose = () => {
    resetNative();
    resetErc20();
    setTxSuccess(false);
    setAmount(tokenType === "native" ? "0.005" : "5");
    onClose();
  };

  const getExplorerUrl = (hash: string) => {
    const explorers: Record<number, string> = {
      [mainnet.id]: "https://etherscan.io",
      [polygon.id]: "https://polygonscan.com",
      [bsc.id]: "https://bscscan.com",
      [arbitrum.id]: "https://arbiscan.io",
      [optimism.id]: "https://optimistic.etherscan.io",
      [base.id]: "https://basescan.org",
    };
    return `${explorers[selectedChainId] || "https://etherscan.io"}/tx/${hash}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-mint to-emerald-400 p-6 text-ink sticky top-0 z-10">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-white/20"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-2 text-4xl">☕</div>
          <h2 className="text-2xl font-bold">贊助這個專案</h2>
          <p className="mt-1 text-ink/80">支持 Web3 安全教育</p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {txSuccess ? (
            // Success State
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-ink">感謝你的贊助！</h3>
                <p className="mt-2 text-sm text-ink/70">你的支持是我持續創作的動力 ❤️</p>
              </div>
              {hash && (
                <a
                  href={getExplorerUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-mint hover:underline"
                >
                  查看交易 →
                </a>
              )}
              <button
                onClick={handleClose}
                className="mt-4 rounded-xl bg-ink px-6 py-2.5 text-sm font-medium text-sand hover:bg-ink/80"
              >
                關閉
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink/70">
                如果這個 Honeypot Demo 對你有幫助，歡迎請我喝杯咖啡！
              </p>

              {/* Direct Transfer Section */}
              {isConnected && (
                <div className="space-y-4 rounded-xl border-2 border-mint/30 bg-mint/5 p-4">
                  {/* Chain Selector */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-xs font-medium text-ink/70">
                      選擇網路
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {SUPPORTED_CHAINS.map((chain) => (
                        <button
                          key={chain.id}
                          onClick={() => setSelectedChainId(chain.id)}
                          className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium transition-all ${
                            selectedChainId === chain.id
                              ? `${chain.color} ring-2 ring-offset-1`
                              : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                          }`}
                        >
                          <span className="text-base">{chain.icon}</span>
                          <span>{chain.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Token Type Selector */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-xs font-medium text-ink/70">
                      選擇代幣
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTokenType("native")}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          tokenType === "native"
                            ? "bg-mint text-ink"
                            : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                        }`}
                      >
                        {selectedChain.native}
                      </button>
                      <button
                        onClick={() => setTokenType("usdt")}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          tokenType === "usdt"
                            ? "bg-mint text-ink"
                            : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                        }`}
                      >
                        {selectedChainId === base.id ? "USDC" : "USDT"}
                      </button>
                    </div>
                  </div>

                  {/* Preset amounts */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-xs font-medium text-ink/70">
                      金額
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setAmount(preset)}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                            amount === preset
                              ? "bg-mint text-ink"
                              : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                          }`}
                        >
                          {preset} {tokenType === "native" ? selectedChain.native : (selectedChainId === base.id ? "USDC" : "USDT")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={tokenType === "native" ? "0.001" : "1"}
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="自訂金額"
                      className="flex-1 rounded-lg border border-ink/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
                    />
                    <span className="text-sm text-ink/50 min-w-[50px]">
                      {tokenType === "native" ? selectedChain.native : (selectedChainId === base.id ? "USDC" : "USDT")}
                    </span>
                  </div>

                  {/* Chain mismatch warning */}
                  {chainId !== selectedChainId && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>將自動切換到 {selectedChain.name}</span>
                    </div>
                  )}

                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-mint to-emerald-400 px-4 py-3 text-sm font-bold text-ink shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        確認中...
                      </>
                    ) : isConfirming ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        等待確認...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        立即轉帳 {amount} {tokenType === "native" ? selectedChain.native : (selectedChainId === base.id ? "USDC" : "USDT")}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-ink/10" />
                <span className="text-xs text-ink/40">或掃描 QR Code</span>
                <div className="h-px flex-1 bg-ink/10" />
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="rounded-xl border-2 border-ink/10 bg-white p-3 shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${WALLET_ADDRESS}&bgcolor=ffffff&color=0f172a`}
                    alt="Wallet QR Code"
                    className="h-[120px] w-[120px]"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-xs font-medium text-ink/50">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  錢包地址（支援所有 EVM 鏈）
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all rounded-lg border border-ink/10 bg-sand/50 px-3 py-2 font-mono text-[10px] text-ink/70">
                    {WALLET_ADDRESS}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-ink text-sand hover:bg-ink/80"
                    }`}
                  >
                    {copied ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Sponsor Button Component
export function SponsorButton({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mint to-emerald-400 px-4 py-2 text-sm font-medium text-ink shadow-lg transition-all hover:shadow-xl hover:brightness-105 ${className}`}
      >
        <span>☕</span>
        <span>贊助我</span>
      </button>
      <SponsorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
