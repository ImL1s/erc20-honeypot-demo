"use client";

import { useState } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

const WALLET_ADDRESS = "0x889A5fDa61adA9E99f75A53c323e32430d1C34d8" as `0x${string}`;

const SUPPORTED_NETWORKS = [
  { name: "Ethereum", icon: "⟠", color: "bg-blue-100 text-blue-700" },
  { name: "Polygon", icon: "⬡", color: "bg-purple-100 text-purple-700" },
  { name: "BSC", icon: "⬢", color: "bg-yellow-100 text-yellow-700" },
  { name: "Arbitrum", icon: "🔵", color: "bg-sky-100 text-sky-700" },
  { name: "Optimism", icon: "🔴", color: "bg-red-100 text-red-700" },
  { name: "Base", icon: "🔷", color: "bg-indigo-100 text-indigo-700" },
];

const PRESET_AMOUNTS = ["0.001", "0.005", "0.01", "0.05"];

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("0.005");
  const [txSuccess, setTxSuccess] = useState(false);

  const { isConnected } = useAccount();
  const { data: hash, isPending, sendTransaction, reset } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSend = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    sendTransaction({
      to: WALLET_ADDRESS,
      value: parseEther(amount),
    });
  };

  // Show success state
  if (isSuccess && !txSuccess) {
    setTxSuccess(true);
  }

  const handleClose = () => {
    reset();
    setTxSuccess(false);
    setAmount("0.005");
    onClose();
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
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-mint to-emerald-400 p-6 text-ink">
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
        <div className="space-y-5 p-6">
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
                  href={`https://etherscan.io/tx/${hash}`}
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
                如果這個 Honeypot Demo 對你有幫助，歡迎請我喝杯咖啡！支援所有 EVM 相容鏈。
              </p>

              {/* Direct Transfer Section */}
              {isConnected && (
                <div className="space-y-3 rounded-xl border-2 border-mint/30 bg-mint/5 p-4">
                  <label className="flex items-center gap-1 text-xs font-medium text-ink/70">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    快速轉帳（當前網路）
                  </label>

                  {/* Preset amounts */}
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                          amount === preset
                            ? "bg-mint text-ink"
                            : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                        }`}
                      >
                        {preset} ETH
                      </button>
                    ))}
                  </div>

                  {/* Custom amount input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="自訂金額"
                      className="flex-1 rounded-lg border border-ink/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
                    />
                    <span className="text-sm text-ink/50">ETH</span>
                  </div>

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
                        立即轉帳 {amount} ETH
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
                  錢包地址
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

              {/* Supported Networks */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-ink/50">支援的網路</label>
                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_NETWORKS.map((network) => (
                    <span
                      key={network.name}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${network.color}`}
                    >
                      {network.icon} {network.name}
                    </span>
                  ))}
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
