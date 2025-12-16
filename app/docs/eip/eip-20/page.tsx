'use client';

import { Metadata } from 'next';
import { FlowDiagram } from '../../../../components/docs/FlowDiagram';
import { CodeBlock } from '../../../../components/docs/CodeBlock';
import { Callout } from '../../../../components/docs/Callout';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Metadata
const docMeta = {
    title: 'ERC-20 代幣標準',
    number: 'EIP-20',
    status: 'Final',
    type: 'ERC',
    authors: ['Vitalik Buterin', 'Fabian Vogelsteller'],
    created: '2015-11-19',
    difficulty: 1,
};

// Transfer flow diagram
const transferFlowChart = `
sequenceDiagram
    participant User as 👤 用戶
    participant Token as 📄 ERC-20 合約
    participant Recipient as 👥 收款人

    User->>Token: transfer(to, amount)
    Note over Token: 檢查餘額
    alt 餘額足夠
        Token->>Token: balances[from] -= amount
        Token->>Token: balances[to] += amount
        Token-->>User: ✅ Transfer 事件
        Token-->>Recipient: 🪙 收到代幣
    else 餘額不足
        Token-->>User: ❌ Revert
    end
`;

// Approve and transferFrom flow
const approveFlowChart = `
sequenceDiagram
    participant Owner as 👤 代幣持有者
    participant Token as 📄 ERC-20 合約
    participant DEX as 🔄 DEX/Spender
    participant Pool as 💧 流動性池

    Note over Owner,Pool: 第一步：授權
    Owner->>Token: approve(DEX, amount)
    Token-->>Owner: ✅ Approval 事件
    
    Note over Owner,Pool: 第二步：代操作
    Owner->>DEX: swap(tokenA, tokenB, amount)
    DEX->>Token: transferFrom(owner, pool, amount)
    Note over Token: 檢查 allowance
    Token->>Token: 扣除 allowance
    Token->>Token: 轉移代幣
    Token-->>DEX: ✅ Transfer 事件
    DEX-->>Owner: 🪙 TokenB
`;

// Minimal implementation code
const minimalCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("My Token", "MTK") {
        // 鑄造 1,000,000 個代幣給部署者
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}`;

// Full interface code
const interfaceCode = `interface IERC20 {
    // ===== 查詢函數 =====
    
    /// @notice 返回代幣總供應量
    function totalSupply() external view returns (uint256);
    
    /// @notice 返回指定帳戶的餘額
    function balanceOf(address account) external view returns (uint256);
    
    /// @notice 返回 spender 被允許從 owner 帳戶支出的金額
    function allowance(address owner, address spender) external view returns (uint256);
    
    // ===== 操作函數 =====
    
    /// @notice 從呼叫者帳戶轉移代幣到指定地址
    /// @return 是否成功
    function transfer(address to, uint256 amount) external returns (bool);
    
    /// @notice 授權 spender 從呼叫者帳戶支出指定金額
    function approve(address spender, uint256 amount) external returns (bool);
    
    /// @notice 從 from 帳戶轉移代幣到 to（需要授權）
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    // ===== 事件 =====
    
    /// @notice 當代幣轉移時觸發
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    /// @notice 當授權額度變更時觸發
    event Approval(address indexed owner, address indexed spender, uint256 value);
}`;

// Honeypot example
const honeypotCode = `// ⚠️ 警告：這是惡意代碼示範
function _update(address from, address to, uint256 amount) internal override {
    if (from != address(0)) {
        // 🔴 黑名單陷阱：買入時自動加入黑名單
        if (blacklist[from]) {
            revert("Transfer blocked");  // 永遠無法賣出！
        }
    }
    super._update(from, to, amount);
}`;

export default function EIP20Page() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-slate-200 pb-6"
            >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-4xl">🪙</span>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {docMeta.number}
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                {docMeta.status}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {docMeta.type}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-ink">
                            {docMeta.title}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div>
                        <span className="font-medium">作者：</span>
                        {docMeta.authors.join(', ')}
                    </div>
                    <div>
                        <span className="font-medium">創建日期：</span>
                        {docMeta.created}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-medium">難度：</span>
                        {'⭐'.repeat(docMeta.difficulty)}
                    </div>
                </div>
            </motion.header>

            {/* One-liner */}
            <Callout type="tip" title="一句話解釋">
                ERC-20 定義了以太坊上可互換代幣的統一接口標準，讓所有代幣都能與錢包、交易所、DApp 無縫互動。
            </Callout>

            {/* Why Section */}
            <section>
                <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <span>🤔</span> 為什麼需要 ERC-20？
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-semibold text-red-600 mb-2">❌ 沒有標準之前</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li>• 每個代幣合約接口都不同</li>
                            <li>• 錢包需要為每個代幣寫專屬代碼</li>
                            <li>• 交易所整合成本極高</li>
                            <li>• DApp 無法通用處理代幣</li>
                        </ul>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-semibold text-green-600 mb-2">✅ 有標準之後</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li>• 統一的 6 個必要函數</li>
                            <li>• 錢包一次支援所有代幣</li>
                            <li>• Uniswap 可以交易任何代幣</li>
                            <li>• DeFi 生態系統蓬勃發展</li>
                        </ul>
                    </div>
                </div>

                <Callout type="info" title="歷史背景">
                    ERC-20 由 Vitalik Buterin 和 Fabian Vogelsteller 於 2015 年提出，
                    2017 年正式成為標準。它催生了 2017 年的 ICO 熱潮，
                    至今仍是以太坊上最重要的代幣標準。
                </Callout>
            </section>

            {/* Interface Section */}
            <section>
                <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <span>🔧</span> 技術規格
                </h2>

                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-2 text-left">函數</th>
                                <th className="px-4 py-2 text-left">類型</th>
                                <th className="px-4 py-2 text-left">說明</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="px-4 py-2 font-mono text-mint">totalSupply()</td>
                                <td className="px-4 py-2">查詢</td>
                                <td className="px-4 py-2">返回代幣總供應量</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-mint">balanceOf(address)</td>
                                <td className="px-4 py-2">查詢</td>
                                <td className="px-4 py-2">返回指定地址的餘額</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-mint">transfer(to, amount)</td>
                                <td className="px-4 py-2">操作</td>
                                <td className="px-4 py-2">轉移代幣</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-mint">approve(spender, amount)</td>
                                <td className="px-4 py-2">操作</td>
                                <td className="px-4 py-2">授權第三方支出</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-mint">allowance(owner, spender)</td>
                                <td className="px-4 py-2">查詢</td>
                                <td className="px-4 py-2">查詢授權額度</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-mint">transferFrom(from, to, amount)</td>
                                <td className="px-4 py-2">操作</td>
                                <td className="px-4 py-2">代為轉移（需授權）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <CodeBlock
                    code={interfaceCode}
                    language="solidity"
                    filename="IERC20.sol"
                    highlightLines={[5, 8, 11, 16, 19, 22]}
                    showLineNumbers
                />
            </section>

            {/* Flow Diagrams */}
            <section>
                <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <span>📊</span> 互動流程圖
                </h2>

                <FlowDiagram
                    chart={transferFlowChart}
                    title="基本轉帳流程 (transfer)"
                    caption="用戶直接轉帳給另一個地址"
                />

                <FlowDiagram
                    chart={approveFlowChart}
                    title="授權與代轉帳流程 (approve + transferFrom)"
                    caption="這是 DEX 和 DeFi 協議的核心運作機制"
                />
            </section>

            {/* Implementation */}
            <section>
                <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <span>💻</span> 實作範例
                </h2>

                <Callout type="tip" title="最佳實踐">
                    在生產環境中，強烈建議使用 OpenZeppelin 的 ERC20 實作，
                    它經過多次審計並被業界廣泛使用。
                </Callout>

                <CodeBlock
                    code={minimalCode}
                    language="solidity"
                    filename="MyToken.sol"
                    showLineNumbers
                />
            </section>

            {/* Security Warning */}
            <section>
                <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <span>⚠️</span> 安全警示：惡意實作
                </h2>

                <Callout type="danger" title="Honeypot 陷阱">
                    許多詐騙代幣會覆寫 <code>_update</code> 函數來阻止用戶賣出。
                    買入時一切正常，但嘗試轉出時會永遠失敗！
                </Callout>

                <CodeBlock
                    code={honeypotCode}
                    language="solidity"
                    filename="⚠️ HoneypotToken.sol"
                    highlightLines={[4, 5, 6]}
                    showLineNumbers
                />

                <div className="mt-4 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <span>🍯</span>
                        體驗 Honeypot Demo
                    </Link>
                </div>
            </section>

            {/* Lab CTA */}
            <section className="glass-dark rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                    🧪 準備好實際操作了嗎？
                </h3>
                <p className="text-slate-300 mb-4">
                    連接錢包，在測試網上實際執行 transfer、approve、transferFrom
                </p>
                <Link
                    href="/lab/eip-20"
                    className="inline-flex items-center gap-2 bg-mint text-ink font-semibold px-6 py-3 rounded-full hover:bg-mint/90 transition-colors"
                >
                    進入 ERC-20 實驗室 →
                </Link>
            </section>
        </div>
    );
}
