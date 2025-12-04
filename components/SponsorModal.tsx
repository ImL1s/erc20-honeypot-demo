"use client";

import { useState } from "react";

const WALLET_ADDRESS = "0x889A5fDa61adA9E99f75A53c323e32430d1C34d8";

const SUPPORTED_NETWORKS = [
  { name: "Ethereum", icon: "⟠", color: "bg-blue-100 text-blue-700" },
  { name: "Polygon", icon: "⬡", color: "bg-purple-100 text-purple-700" },
  { name: "BSC", icon: "⬢", color: "bg-yellow-100 text-yellow-700" },
  { name: "Arbitrum", icon: "🔵", color: "bg-sky-100 text-sky-700" },
  { name: "Optimism", icon: "🔴", color: "bg-red-100 text-red-700" },
  { name: "Base", icon: "🔷", color: "bg-indigo-100 text-indigo-700" },
];

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-mint to-emerald-400 p-6 text-ink">
          <button
            onClick={onClose}
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
          <p className="text-sm text-ink/70">
            如果這個 Honeypot Demo 對你有幫助，歡迎請我喝杯咖啡！支援所有 EVM 相容鏈。
          </p>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="rounded-xl border-2 border-ink/10 bg-white p-3 shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${WALLET_ADDRESS}&bgcolor=ffffff&color=0f172a`}
                alt="Wallet QR Code"
                className="h-[140px] w-[140px]"
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
              <code className="flex-1 break-all rounded-lg border border-ink/10 bg-sand/50 px-3 py-2.5 font-mono text-[11px] text-ink/70">
                {WALLET_ADDRESS}
              </code>
              <button
                onClick={handleCopy}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-ink text-sand hover:bg-ink/80"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">已複製</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">複製</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Supported Networks */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-ink/50">支援的網路</label>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_NETWORKS.map((network) => (
                <span
                  key={network.name}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${network.color}`}
                >
                  {network.icon} {network.name}
                </span>
              ))}
            </div>
          </div>

          {/* Thanks message */}
          <div className="rounded-xl border border-mint/30 bg-mint/10 p-4 text-center">
            <p className="text-sm text-ink/70">感謝你的支持！每一杯咖啡都是持續創作的動力 ❤️</p>
          </div>
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
