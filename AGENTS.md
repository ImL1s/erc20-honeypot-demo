# Repository Guidelines

This guide helps contributors navigate the ERC-20 honeypot demo (Hardhat + Next.js). Keep changes focused, reproducible, and secure.

## Project Structure & Module Organization
- Frontend (Next.js App Router): `app/` for routes/providers, `components/` for UI pieces, `lib/` for client helpers, styles via Tailwind configs (`tailwind.config.js`, `postcss.config.js`).
- Smart contracts: `contracts/` (e.g., `PixiuToken.sol`), deployment scripts in `scripts/`, tests in `test/`, Hardhat config in `hardhat.config.ts`. Generated outputs land in `artifacts/`, `cache/`, `typechain-types/` (do not hand-edit).
- Env files: `.env.example` documents required vars (`SEPOLIA_RPC_URL`, `DEPLOYER_KEY`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, optional `ETHERSCAN_API_KEY`). Copy to `.env` locally.

## Build, Test, and Development Commands
- `npm run dev` — start Next.js locally at `localhost:3000`.
- `npm run build` / `npm run start` — production build and serve.
- `npm run lint` — Next.js ESLint (`next/core-web-vitals`); fix before PRs.
- `npm run test` — Hardhat test suite (TypeScript).
- `npm run hardhat <task>` — run arbitrary Hardhat tasks (set `TS_NODE_PROJECT=tsconfig.hardhat.json`).
- `npm run deploy:sepolia` — deploy `PixiuToken` to Sepolia (requires env vars). Example: `npm run hardhat node` for a local chain, then use `--network localhost`.

## Coding Style & Naming Conventions
- TypeScript/React: 2-space indent, functional components, hooks-first data flow, keep UI copy concise; co-locate component styles via Tailwind classes. Name components/files in PascalCase; utility modules in camelCase.
- Solidity: 4-space indent, SPDX header, pragma pinned (`^0.8.24`), NatSpec summaries for public methods; keep revert strings short and purposeful.
- Prefer explicit imports; avoid unused exports. Run `npm run lint` before pushing.

## Testing Guidelines
- Place contract tests in `test/*.ts`; name cases for behavior (e.g., `PixiuToken.blacklist reverts on transfer`). Cover success + revert paths, especially blacklist/strict mode logic and faucet caps.
- For UI changes, validate main flows (connect wallet, faucet, blocked sell) against the contract address in `.env`. Add minimal React tests if logic grows.

## Commit & Pull Request Guidelines
- Commits: short imperative sentences (current history: `Add Pixiu honeypot demo` style); group related changes per commit.
- PRs: include summary, linked issue (if any), test results (`npm run lint`, `npm run test`), env/contract address notes, and screenshots/GIFs for UI changes. Mention if deployments or new ABI outputs are included.

## Security & Configuration Tips
- Never commit secrets; only `NEXT_PUBLIC_*` values belong in client code. Rotate keys if exposed.
- When deploying, record the emitted contract address and sync it to `NEXT_PUBLIC_CONTRACT_ADDRESS` to keep frontend interactions accurate.
