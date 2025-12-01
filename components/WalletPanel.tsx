"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { CONTRACT_ADDRESS, pixiuAbi } from "../lib/contract";

const zeroAddress = "0x0000000000000000000000000000000000000000";

export function WalletPanel() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync, isPending: writePending } = useWriteContract();
  const [actionTx, setActionTx] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("10");
  const [sellTarget, setSellTarget] = useState<`0x${string}` | undefined>();

  const hasContract =
    CONTRACT_ADDRESS !== zeroAddress &&
    CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

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
      select: (value) => value as `0x${string}`,
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

  useWaitForTransactionReceipt({
    hash: actionTx,
    query: {
      enabled: Boolean(actionTx),
      onSuccess: () => balanceQuery.refetch?.()
    }
  });

  const handleFaucet = async () => {
    if (!address) return;
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: pixiuAbi,
        functionName: "faucet",
        args: [address, parseEther(amount || "0")]
      });
      setActionTx(hash);
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || "Transaction failed");
    }
  };

  const handleSell = async () => {
    if (!address) return;
    setError(null);
    try {
      const target = sellTarget || zeroAddress;
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: pixiuAbi,
        functionName: "transfer",
        args: [target, parseEther(amount || "0")]
      });
      setActionTx(hash);
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || "Transaction failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-ink/10 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-ink/60">你的錢包</p>
          <p className="text-lg font-semibold">
            {isConnected ? address : "未連線"}
          </p>
        </div>
        <div className="flex gap-2">
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand hover:bg-ink/90"
            >
              斷開
            </button>
          ) : (
            connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={connectStatus === "pending"}
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand hover:bg-ink/90 disabled:opacity-50"
              >
                使用 {connector.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-ink text-sand p-4 shadow-inner">
        <p className="text-sm uppercase tracking-wide text-mint">PIXIU 餘額</p>
        <p className="text-3xl font-semibold">
          {balanceQuery.isFetched && isConnected
            ? Number(formatEther((balanceQuery.data as bigint) || 0)).toLocaleString()
            : "—"}
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-ink/80">數量 (PIXIU)</span>
        <input
          className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-lg font-semibold shadow-inner focus:border-ink/40 focus:outline-none"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10"
          type="number"
          min="0"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleFaucet}
          disabled={!isConnected || writePending || !hasContract}
          className="rounded-2xl bg-mint px-4 py-3 text-base font-semibold text-ink shadow hover:shadow-lg disabled:opacity-40"
        >
          買入 / faucet
        </button>
        <button
          onClick={handleSell}
          disabled={!isConnected || writePending || !hasContract}
          className="rounded-2xl bg-ink px-4 py-3 text-base font-semibold text-sand shadow hover:shadow-lg disabled:opacity-40"
        >
          嘗試賣出
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          賣出被擋住了：{error}
        </div>
      )}

      {strictModeQuery.data && (
        <div className="rounded-xl bg-orange-100 px-4 py-2 text-sm text-ink">
          嚴格模式啟用：任何轉出都會 revert。
        </div>
      )}

      {blacklistQuery.data && (
        <div className="rounded-xl bg-red-100 px-4 py-2 text-sm text-ink">
          你在黑名單內：轉出必定失敗。
        </div>
      )}

      {!hasContract && (
        <div className="rounded-xl bg-yellow-50 px-4 py-2 text-sm text-ink">
          尚未設定合約地址（設定 NEXT_PUBLIC_CONTRACT_ADDRESS）。
        </div>
      )}
      {ownerQuery.data && (
        <div className="rounded-xl bg-white px-4 py-2 text-xs text-ink/70">
          賣出嘗試目標：{ownerQuery.data}
        </div>
      )}
    </div>
  );
}
