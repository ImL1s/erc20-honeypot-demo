// Scam Type Definitions
export type ScamType = "honeypot" | "hiddenFee" | "tradingSwitch" | "maxTx" | "cooldown";

export interface ScamTypeConfig {
  id: ScamType;
  icon: string;
  image: string;
  symbol: string;
  contractAddress: string;
}

// Contract addresses - will be set after deployment
export const SCAM_CONTRACTS: Record<ScamType, ScamTypeConfig> = {
  honeypot: {
    id: "honeypot",
    icon: "🍯",
    image: "/honeypot.png",
    symbol: "PIXIU",
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
  hiddenFee: {
    id: "hiddenFee",
    icon: "💸",
    image: "/hidden-fee.png",
    symbol: "HFEE",
    contractAddress: process.env.NEXT_PUBLIC_HIDDEN_FEE_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
  tradingSwitch: {
    id: "tradingSwitch",
    icon: "🎛️",
    image: "/trading-switch.png",
    symbol: "TSWITCH",
    contractAddress: process.env.NEXT_PUBLIC_TRADING_SWITCH_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
  maxTx: {
    id: "maxTx",
    icon: "📊",
    image: "/max-tx.png",
    symbol: "MAXTX",
    contractAddress: process.env.NEXT_PUBLIC_MAX_TX_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
  cooldown: {
    id: "cooldown",
    icon: "⏰",
    image: "/cooldown.png",
    symbol: "COOL",
    contractAddress: process.env.NEXT_PUBLIC_COOLDOWN_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
};

// Legacy export for backward compatibility
export const CONTRACT_ADDRESS = SCAM_CONTRACTS.honeypot.contractAddress;

// Common ABI parts shared by all tokens
const commonAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "whitelist",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// PixiuToken (Honeypot) ABI
export const pixiuAbi = [
  ...commonAbi,
  {
    inputs: [{ internalType: "address", name: "from", type: "address" }],
    name: "blacklist",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "autoBlacklist",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// HiddenFeeToken ABI
export const hiddenFeeAbi = [
  ...commonAbi,
  {
    inputs: [],
    name: "buyFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// TradingSwitchToken ABI
export const tradingSwitchAbi = [
  ...commonAbi,
  {
    inputs: [],
    name: "tradingEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// MaxTxToken ABI
export const maxTxAbi = [
  ...commonAbi,
  {
    inputs: [],
    name: "maxTxAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// CooldownToken ABI
export const cooldownAbi = [
  ...commonAbi,
  {
    inputs: [],
    name: "cooldown",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getRemainingCooldown",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "lastReceiveTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Get ABI by scam type
export function getAbiByType(type: ScamType) {
  switch (type) {
    case "honeypot":
      return pixiuAbi;
    case "hiddenFee":
      return hiddenFeeAbi;
    case "tradingSwitch":
      return tradingSwitchAbi;
    case "maxTx":
      return maxTxAbi;
    case "cooldown":
      return cooldownAbi;
    default:
      return pixiuAbi;
  }
}
