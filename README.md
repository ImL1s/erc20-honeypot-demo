# PIXIU Honeypot Demo (ERC-20)

用最小惡意範例說明「貔貅盤：買得進、賣不掉」。合約在轉出邏輯動手腳：黑名單與嚴格模式讓 `transfer` 直接 revert。前端以 wagmi 互動，體驗 faucet（買入）成功、賣出失敗。

## 合約重點
- `contracts/PixiuToken.sol`：基於 OpenZeppelin ERC20 + Ownable。
- `blacklist(address => bool)`：被列入者轉出直接 revert。
- `strictMode`：全域阻擋轉出，演示「永遠過不了條件」。
- `faucet(to, amount)`：開放鑄幣（上限 `FAUCET_MAX`），模擬「買得進」。
- `_update` 內檢查轉出方：非 mint 時若嚴格模式或黑名單即 revert。

## 專案結構
- Hardhat (TypeScript) 在根目錄：`hardhat.config.ts`, `scripts/deploy.ts`, `test/`.
- 前端 Next.js App Router + wagmi：`app/`, `components/`, `lib/`.
- 共享設定：`tsconfig.hardhat.json`（Hardhat）、`tailwind.config.js`、`.eslintrc.json`。

## 安裝與環境
```bash
npm install
cp .env.example .env
# 設定以下環境變數
# SEPOLIA_RPC_URL, DEPLOYER_KEY, ETHERSCAN_API_KEY(可選), NEXT_PUBLIC_CONTRACT_ADDRESS
```

## Hardhat 指令
- 測試（已通過）：`npm run test`
- 本地節點：`npx hardhat node`
- 部署到 Sepolia：`npm run deploy:sepolia`
  - 部署後會輸出地址，填入 `.env` 的 `NEXT_PUBLIC_CONTRACT_ADDRESS`
- 驗證（可選）：`npx hardhat verify --network sepolia <contractAddress>`

## 前端啟動
```bash
npm run dev
# 瀏覽 http://localhost:3000
```
互動步驟：
1) 錢包連到 Sepolia。
2) 點「買入 / faucet」取得 PIXIU（成功）。
3) 點「嘗試賣出」轉回合約 owner（視為賣出），會因黑名單或嚴格模式 revert，UI 顯示錯誤訊息。

## Lint / E2E 測試
- Lint：`npm run lint`（使用 eslint + eslint-config-next）。
- E2E：`npm run test:e2e`（Playwright，預設自啟開發伺服器在 3002）。
  - 若本機已跑 `npm run dev` 在 3001，可重用：
    ```bash
    PLAYWRIGHT_USE_EXISTING_SERVER=1 PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
    ```

## 風險提示 / 要檢查的紅旗
- `transfer/transferFrom` 內嵌黑名單或怪條件。
- owner 權限未移除，可隨時開啟黑名單或嚴格模式。
- 流動性未鎖、可抽走。
- 任意增發或無上限 faucet。

## 版本
- Node: 請用 LTS 以上
- Hardhat: 2.27.x
- Solidity: 0.8.24
- Next.js: 16
