# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個 **Web3 安全教育專案**,展示 ERC-20 蜜罐 (Honeypot) 的運作機制。透過互動式的前端介面和惡意合約範例,讓使用者體驗「買得進、賣不掉」的貔貅盤陷阱。

**⚠️ 重要提醒**: 這是**教育用途**的惡意合約範例。禁止修改或增強惡意代碼功能。可以分析、解釋代碼行為,但不得協助改進詐騙機制。

## 技術棧

- **智能合約**: Solidity 0.8.24 + Hardhat + OpenZeppelin
- **前端**: Next.js 16 (App Router) + React 19 + Tailwind CSS
- **Web3**: Wagmi v3 + Viem + TanStack Query
- **測試**: Hardhat (單元測試) + Playwright (E2E)
- **網路**: Sepolia Testnet

## 常用指令

### 開發與執行
```bash
# 本地開發 (預設 port 3000)
npm run dev

# 生產建置
npm run build
npm start

# Lint 檢查
npm run lint
```

### 智能合約開發
```bash
# 編譯合約 (使用 hardhat.config.ts)
npm run hardhat compile

# 執行合約單元測試
npm test

# 部署到 Sepolia 測試網
npm run deploy:sepolia

# Hardhat console (Sepolia)
npm run hardhat console --network sepolia
```

### 測試
```bash
# 合約單元測試 (test/PixiuToken.ts)
npm test

# E2E 測試 (需先啟動 dev server)
npm run test:e2e

# E2E with custom port
PLAYWRIGHT_PORT=3002 npm run test:e2e
```

## 專案架構

### 智能合約層 (`contracts/`)
- **PixiuToken.sol**: 惡意 ERC-20 合約範例
  - `faucet()`: 模擬「買入」(實際是免費鑄造)
  - `_update()`: 覆寫轉帳邏輯,植入黑名單檢查和嚴格模式
  - `blacklist`: 黑名單機制 - 一旦買入即被加入,無法轉出
  - `strictMode`: 全域禁售開關

**關鍵惡意邏輯** (contracts/PixiuToken.sol:34-40):
```solidity
function _update(address from, address to, uint256 amount) internal override {
    if (from != address(0)) {  // 非鑄幣操作
        if (strictMode) revert("Sell blocked: strict");
        if (blacklist[from]) revert("Sell blocked: blacklisted");
    }
    super._update(from, to, amount);
}
```

### 前端架構 (`app/`, `components/`, `lib/`)

#### App Router 結構
- **app/page.tsx**: 主頁面,包含雙欄互動介面
  - 左側: 錢包連接與模擬交易介面 (`WalletPanel`)
  - 右側: 即時高亮的 Solidity 代碼 (`CodeSnippet`)
- **app/providers.tsx**: Wagmi + QueryClient 全域 provider
- **app/layout.tsx**: 根佈局,整合 Tailwind CSS

#### 核心組件
- **components/WalletPanel.tsx**:
  - 錢包連接邏輯 (使用 `useConnect`, `useAccount`)
  - 雙模式切換: 「ETH → PIXIU (買)」vs「PIXIU → ETH (賣)」
  - 交易執行與錯誤處理
- **components/CodeSnippet.tsx**:
  - 顯示惡意代碼片段
  - 接收 `highlightKeyword` 參數觸發高亮動畫
- **components/AdBanner.tsx**:
  - 多平台廣告組件 (支援 AdSense / Carbon Ads / 自定義)
  - 透過 `NEXT_PUBLIC_AD_PROVIDER` 環境變數切換
- **components/AdScripts.tsx**:
  - 廣告腳本載入器 (AdSense, Google Analytics)

#### Web3 整合層 (`lib/`)
- **lib/wagmi.ts**: Wagmi 配置 (Mainnet + Sepolia)
- **lib/contract.ts**:
  - 合約地址 (從 `NEXT_PUBLIC_CONTRACT_ADDRESS` 環境變數讀取)
  - 手動定義的 ABI (核心函數: faucet, setBlacklist, transfer, etc.)

### 測試結構
- **test/PixiuToken.ts**: 驗證合約黑名單與嚴格模式行為
- **e2e/home.spec.ts**: 端到端測試,驗證前端與合約互動

## 環境變數設定

複製 `.env.example` 到 `.env` 並填入:
```bash
# 智能合約
SEPOLIA_RPC_URL=https://rpc.sepolia.org  # Sepolia RPC endpoint
DEPLOYER_KEY=0x...                       # 部署者私鑰 (需有 Sepolia ETH)
ETHERSCAN_API_KEY=...                    # (選用) 用於驗證合約
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...       # 部署後的 PixiuToken 合約地址

# SEO
NEXT_PUBLIC_SITE_URL=https://...         # 網站正式網址 (用於 sitemap, OG tags)

# 廣告 (選用)
NEXT_PUBLIC_AD_PROVIDER=custom           # adsense | carbon | custom | none
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...    # AdSense 發布商 ID
NEXT_PUBLIC_GA_ID=G-...                  # Google Analytics ID
```

## 開發流程

### 首次設定
1. 安裝依賴: `npm install`
2. 取得 Sepolia 測試幣: https://sepoliafaucet.com/
3. 設定 `.env` (至少需要 `DEPLOYER_KEY` 和 `SEPOLIA_RPC_URL`)
4. 部署合約: `npm run deploy:sepolia`
5. 將輸出的合約地址填入 `.env` 的 `NEXT_PUBLIC_CONTRACT_ADDRESS`
6. 啟動前端: `npm run dev`

### 合約修改後的工作流
1. 修改 `contracts/PixiuToken.sol`
2. 執行測試: `npm test`
3. 重新部署: `npm run deploy:sepolia`
4. 更新 `.env` 中的合約地址
5. 若 ABI 有變化,同步更新 `lib/contract.ts` 中的 `pixiuAbi`

### 前端修改後的工作流
1. 修改 `app/` 或 `components/`
2. 檢查型別: `npm run lint`
3. 本地測試: `npm run dev`
4. E2E 驗證: `npm run test:e2e`

## 重要檔案路徑

- 合約原始碼: `contracts/PixiuToken.sol`
- 部署腳本: `scripts/deploy.ts`
- 合約測試: `test/PixiuToken.ts`
- 前端主頁: `app/page.tsx`
- 錢包面板: `components/WalletPanel.tsx`
- 廣告組件: `components/AdBanner.tsx`, `components/AdScripts.tsx`
- Web3 配置: `lib/wagmi.ts`, `lib/contract.ts`
- SEO 配置: `app/robots.ts`, `app/sitemap.ts`
- E2E 測試: `e2e/home.spec.ts`

## TypeScript 配置

專案使用**雙 tsconfig** 架構:
- **tsconfig.json**: Next.js 前端 (App Router, React JSX)
- **tsconfig.hardhat.json**: Hardhat 後端 (Node.js, CommonJS)

執行 Hardhat 指令時必須指定: `TS_NODE_PROJECT=tsconfig.hardhat.json`

## Wagmi v3 特性

- 使用 **TanStack Query v5** 處理非同步狀態
- Hooks 如 `useWriteContract` 返回 `{ writeContract, data, error, isPending }`
- 需搭配 `useWaitForTransactionReceipt` 等待交易確認
- 支援 SSR (lib/wagmi.ts:12 設定 `ssr: true`)

## 常見問題排查

### 合約部署失敗
- 確認 `DEPLOYER_KEY` 有足夠 Sepolia ETH
- 檢查 `SEPOLIA_RPC_URL` 是否可用

### 前端交易失敗
- 確認錢包已連接到 Sepolia 網路
- 檢查 `NEXT_PUBLIC_CONTRACT_ADDRESS` 是否正確
- 開啟瀏覽器 Console 查看錯誤訊息

### E2E 測試失敗
- 確保 dev server 正在運行 (`npm run dev`)
- 檢查 `PLAYWRIGHT_BASE_URL` 設定
- 使用 `npx playwright show-report` 查看測試報告

## SEO 配置

專案已整合完整的 SEO 功能：

- **Metadata**: 在 `app/layout.tsx` 使用 Next.js Metadata API
- **Open Graph / Twitter Card**: 社交分享預覽圖
- **JSON-LD**: 結構化數據 (WebApplication 類型)
- **robots.txt**: 透過 `app/robots.ts` 動態生成
- **sitemap.xml**: 透過 `app/sitemap.ts` 動態生成

部署前需設定 `NEXT_PUBLIC_SITE_URL` 環境變數，並在 `public/` 放置：
- `og-image.png` (1200x630) - 社交分享預覽圖
- `favicon.ico`, `icon.svg`, `apple-touch-icon.png` - 網站圖標

## 廣告系統

支援多種廣告平台，透過環境變數切換：

| Provider | 說明 | 審核難度 |
|----------|------|----------|
| `adsense` | Google AdSense | 中等，需網站有內容 |
| `carbon` | Carbon Ads | 需申請，面向開發者 |
| `custom` | 自定義廣告位 | 無需審核 |
| `none` | 關閉廣告 | - |

廣告位置：
- **sidebar**: 右側欄位 (僅桌面版顯示)
- **footer**: 頁面底部

切換廣告平台：設定 `NEXT_PUBLIC_AD_PROVIDER` 環境變數即可
