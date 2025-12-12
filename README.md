# 🍯 ERC-20 貔貅盤 (Honeypot) - The Beautiful Trap
![Honeypot Banner](banner.png)

**「為什麼 K 線圖一路向北，但我手裡的幣卻賣不掉？」**

這是一個 **Web3 安全教育專案**，透過一個**吉卜力風格 (Studio Ghibli Style)** 的優美介面，包裝一個致命的「流動性陷阱（Honeypot）」合約。我們希望展示：**越美麗的陷阱，越令人防不勝防**。

本專案帶你體驗**「買入容易、賣出無門」**的驚悚瞬間，並讓你**看見**陷阱被觸發的那一刻。

---

## 🎯 核心體驗

我們打造了一個**擬真的 Swap 介面**，讓你安全地體驗詐騙盤的運作機制：

### 1. 貪婪的開始 (Buy / Faucet) 🤑
*   切換到 **ETH → PIXIU** 模式。
*   點擊「立即買入」，你會發現交易無比順暢，代幣輕鬆入帳。
*   *(背後機制：其實是呼叫 `faucet` 免費鑄造，模擬項目方讓你輕鬆上車)*

### 2. 恐慌的瞬間 (Sell / Trap) 😱
*   切換到 **PIXIU → ETH** 模式，試圖獲利了結。
*   點擊「確認賣出」—— **Boom! 交易失敗 (Revert)**。
*   你會看見紅色的警告：「交易失敗：你已被列入黑名單」。

### 3. 真相大白 (Code Highlight) 💡
*   **這就是本專案最強大的功能**：
*   當你的交易被阻擋時，網頁右側的 Solidity 程式碼會**自動高亮閃爍**。
*   系統會直接指給你看：「看！就是這行 `if (blacklist[from])` 殺死了你的交易。」

---

## 🕵️‍♂️ 惡意機制揭秘

這個專案展示了兩種最經典的貔貅手段：

| 機制 | 描述 | 體驗方式 |
|------|------|----------|
| **黑名單 (Blacklist)** | 針對特定地址進行封鎖。通常在用戶買入時，合約會自動將其加入黑名單。 | 預設開啟，任何新用戶嘗試轉出都會觸發。 |
| **嚴格模式 (Strict Mode)** | 項目方的一鍵必殺技。開啟後，全網暫停轉帳（除了白名單與 Owner）。 | 合約內建開關，演示「永遠過不了的條件」。 |

**💀 致命代碼 (`contracts/PixiuToken.sol`)：**

```solidity
function _update(address from, address to, uint256 amount) internal override {
    // 這裡就是陷阱！
    if (from != address(0)) { // 如果不是鑄幣（買入）
        // 🔴 嚴格模式：一鍵關門，誰都別想跑
        if (strictMode) revert("Sell blocked: strict");
        
        // ⚫ 黑名單：你買入的那一刻，就已經被鎖定了
        if (blacklist[from]) revert("Sell blocked: blacklisted");
    }
    super._update(from, to, amount);
}
```

---

## 🚩 你該如何自保？(Red Flags)

在衝土狗（Meme coin）或投資新項目之前，請務必檢查合約是否包含以下特徵：

1.  **魔改的 `transfer` 函數**：ERC-20 標準轉帳邏輯中，不應該包含複雜的 `if/else` 判斷。
2.  **Owner 權限未放棄**：如果 Owner 還在，他能否隨時修改黑名單？能否暫停交易？
3.  **隱藏的開關**：搜尋 `enableTrading`、`limitSell`、`maxTxAmount` 等關鍵字，這些都可能是限制你出貨的參數。
4.  **蜜罐檢測工具**：使用 Token Sniffer 或 GoPlus 等工具掃描合約安全性。

---

## 🛠️ 技術架構

*   **智能合約**: Solidity 0.8.24, Hardhat, OpenZeppelin (ERC20 + Ownable)
*   **現代化前端**: Next.js 16 (App Router), React 19, Tailwind CSS
*   **Web3 整合**: Wagmi v3, Viem, TanStack Query
*   **自動化測試**: Hardhat (Unit Tests), Playwright (E2E Tests)

---

## 🚀 快速開始

### 1. 安裝與設定

```bash
git clone https://github.com/ImL1s/erc20-honeypot-demo.git
cd erc20-honeypot-demo
npm install

# 設定環境變數
cp .env.example .env
# 填入你的 SEPOLIA_RPC_URL 和 DEPLOYER_KEY
```

### 2. 部署合約 (Sepolia)

```bash
npm run deploy:sepolia
# 部署成功後，終端機會顯示合約地址
# 請將地址填入 .env 的 NEXT_PUBLIC_CONTRACT_ADDRESS
```

### 3. 啟動前端

```bash
npm run dev
# 開啟 http://localhost:3000 開始體驗
```

---

## 🧪 測試指令

我們包含了完整的測試套件來確保演示的正確性：

*   **合約單元測試**：驗證黑名單邏輯是否如預期般運作（買得進、賣不掉）。
    ```bash
    npm run test
    ```
*   **E2E 整合測試**：使用 Playwright 模擬真實瀏覽器操作，測試前端與合約的互動。
    ```bash
    npm run test:e2e
    ```

---

## ⚠️ 免責聲明

本專案僅供**教育與研究用途**，旨在提升開發者與用戶對區塊鏈安全的認識。請勿將相關代碼用於欺詐、惡意攻擊或任何非法用途。

在區塊鏈世界中，**保持懷疑，永遠驗證 (Don't trust, verify)**。

---
*Built with ☕ and 🍯 for Web3 Security Education*