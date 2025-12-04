# ERC20 Honeypot Demo Context

This file provides context for the `erc20_honeypot_demo` project, an educational application demonstrating a "Honeypot" (Pixiu) scam token where users can buy (mint) tokens but are blocked from selling (transferring) them.

## Project Overview

*   **Goal:** To illustrate the mechanics of a "Honeypot" scam using a minimal malicious ERC-20 contract and a frontend interface.
*   **Mechanism:**
    *   **Buying (Faucet):** Users can freely mint tokens via a `faucet` function ("Honey...").
    *   **Selling (Trap):** Transfers are restricted. A `strictMode` or `blacklist` prevents tokens from being transferred out (sold), effectively trapping the user's funds ("...Pot").

## Tech Stack

### Smart Contracts & Blockchain
*   **Framework:** Hardhat (v2.27.x) with TypeScript.
*   **Language:** Solidity (v0.8.24).
*   **Libraries:** OpenZeppelin Contracts (ERC20, Ownable).
*   **Network:** Local Hardhat Network, Sepolia Testnet.

### Frontend
*   **Framework:** Next.js 16 (App Router).
*   **UI Library:** React 19, Tailwind CSS.
*   **Web3 Integration:** Wagmi v3, Viem, TanStack Query.

### Testing
*   **Unit Tests:** Hardhat/Chai (`npm run test`).
*   **E2E Tests:** Playwright (`npm run test:e2e`).

## Key Files & Directories

*   **Contracts:**
    *   `contracts/PixiuToken.sol`: The core malicious contract. Contains `blacklist`, `strictMode`, and overridden `_update` logic to revert transfers.
*   **Frontend:**
    *   `app/page.tsx`: The main UI allowing users to connect wallets, mint tokens, and attempt transfers.
    *   `lib/wagmi.ts`: Wagmi client configuration.
    *   `components/`: UI components (`WalletPanel`, etc.).
*   **Configuration:**
    *   `hardhat.config.ts`: Hardhat network and plugin configuration.
    *   `package.json`: Project dependencies and scripts.
    *   `.env`: Environment variables (RPC URLs, Keys).

## Development Workflow

### 1. Installation
```bash
npm install
cp .env.example .env
# Configure .env with SEPOLIA_RPC_URL, DEPLOYER_KEY, etc.
```

### 2. Smart Contract Development
*   **Compile:** `npx hardhat compile`
*   **Test:** `npm run test` (Runs Hardhat unit tests)
*   **Local Node:** `npx hardhat node` (Starts a local JSON-RPC server)
*   **Deploy (Sepolia):** `npm run deploy:sepolia`
    *   *Note:* After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env` with the new address.

### 3. Frontend Development
*   **Start Dev Server:** `npm run dev` (Runs on `http://localhost:3000`)
*   **Lint:** `npm run lint`

### 4. End-to-End Testing
*   **Run Playwright:** `npm run test:e2e`

## Contract Logic (The "Scam")

The `PixiuToken.sol` contract overrides the standard ERC-20 `_update` function:
1.  **Minting is allowed:** If `from == address(0)`, the transfer proceeds.
2.  **Transfers are checked:** If `to != address(0)` (not burning):
    *   If `strictMode` is `true`, the transfer REVERTS.
    *   If `blacklist[from]` is `true`, the transfer REVERTS.
    *   The owner can toggle `strictMode` and modify `blacklist`.

## Common Tasks
*   **Verify Contract:** `npx hardhat verify --network sepolia <contract_address>`
*   **Check Balance:** Use the frontend or standard cast/ethers scripts against the deployed contract.
