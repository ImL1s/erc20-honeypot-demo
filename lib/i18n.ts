export type Locale = "en" | "ja" | "zh-Hant" | "zh-Hans";

export const LOCALES: Locale[] = ["zh-Hant", "zh-Hans", "en", "ja"];
export const DEFAULT_LOCALE: Locale = "zh-Hant";

type Messages = Record<string, string | string[] | Record<string, any>>;

const translations: Record<Locale, Messages> = {
  "zh-Hant": {
    home: {
      kicker: "Honeypot Demo · ERC-20",
      title: "為什麼貔貅盤能讓你買得進、賣不掉？",
      subtitle:
        "別被數字騙了。在 Web3 世界，顯示在錢包裡的「餘額」不代表真的屬於你。只要合約在 transfer 函數動了手腳，代幣就是看得到、出不去。這是一個教育專案，讓你安全體驗被「割韭菜」的過程。",
      badges: ["Sepolia", "黑名單 / 嚴格模式", "買得進、賣出 revert"],
      interactionTitle: "互動說明",
      steps: [
        "連上錢包（請使用 Sepolia 測試網）。",
        "1. 貪婪的開始 (Buy)：切換到 ETH → PIXIU。看著代幣輕鬆入帳，以為發現了下一個百倍幣 (模擬買入)。",
        "2. 恐慌的瞬間 (Sell)：切換到 PIXIU → ETH。試圖獲利了結時，交易被回滾 (Revert)。",
        "3. 真相大白 (Code)：交易失敗時，觀察右側程式碼，惡意邏輯正在閃爍，說明為何錢出不去。"
      ],
      redFlagsTitle: "如何識破騙局？",
      redFlags: [
        "🕵️‍♂️ 魔改的 transfer 函數：ERC-20 標準轉帳邏輯中，不應該包含複雜的判斷。",
        "💀 Owner 權限未放棄：如果 Owner 還在，他能否隨時修改黑名單？能否暫停交易？",
        "🎛️ 隱藏的開關：搜尋 enableTrading, limitSell 等關鍵字。",
        "🌊 流動性未鎖：項目方隨時可以抽走池子裡的 ETH (Rug Pull)。"
      ],
      code: {
        transferTitle: "轉出被攔截的核心",
        faucetTitle: "買得進（faucet 代替 swap）"
      },
      links: {
        contract: "合約原始碼",
        repo: "專案原始碼"
      },
      footerNotice: "本專案僅供教育與研究用途，旨在提升 Web3 安全意識。Don’t trust, verify."
    },
    wallet: {
      yourWallet: "你的錢包",
      disconnected: "未連線",
      disconnect: "斷開",
      connectWith: "連線 {name}",
      balanceLabel: "PIXIU 餘額",
      walletTag: "WALLET",
      balanceTag: "BALANCE",
      wrongNetwork: "網路錯誤",
      switchToSepolia: "切換到 Sepolia",
      amountLabel: "數量 (PIXIU)",
      payFrom: "支付 (From)",
      receiveTo: "收到 (To)",
      rateLabel: "匯率 (模擬)",
      rateValue: "1 ETH = ∞ PIXIU",
      actions: {
        buy: "立即買入 (Faucet)",
        sell: "確認賣出",
        processing: "處理中..."
      },
      errors: {
        title: "交易失敗 (Honeypot!)",
        strict: "交易失敗：嚴格模式已開啟 (Strict Mode)",
        blacklist: "交易失敗：你已被列入黑名單 (Blacklisted)",
        rejected: "使用者取消交易",
        unknown: "交易失敗",
        strictHint: "這就是「嚴格模式」：合約中的 strictMode 變數為 true，直接阻擋任何轉出操作。",
        blacklistHint: "這就是「黑名單機制」：你的地址被標記在 blacklist 中，無法進行轉帳。"
      },
      status: {
        whitelistYes: "白名單: YES",
        whitelistNo: "白名單: NO",
        blacklistYes: "黑名單: YES",
        blacklistNo: "黑名單: NO",
        autoBlacklistOn: "自動黑名單: ON",
        autoBlacklistOff: "自動黑名單: OFF",
        contractMissing: "尚未設定合約地址"
      }
    },
    switcherLabel: "語言",
    scamTypes: {
      honeypot: {
        short: "貔貅盤",
        name: "貔貅盤 (Honeypot)",
        description: "買入時自動加入黑名單，無法轉出代幣。經典的「買得進、賣不掉」陷阱。",
        tag: "黑名單詐騙",
        errorHint: "你的地址被加入黑名單了！這就是貔貅盤的運作方式。"
      },
      hiddenFee: {
        short: "隱藏手續費",
        name: "隱藏手續費 (Hidden Fee)",
        description: "買入時 0% 手續費，賣出時收取高達 90% 的隱藏手續費。你以為賺到了，其實 90% 被扣走。",
        tag: "手續費詐騙",
        errorHint: "賣出時被收取了 90% 的手續費！只有 10% 到帳。"
      },
      tradingSwitch: {
        short: "交易開關",
        name: "交易開關 (Trading Switch)",
        description: "Owner 可以隨時關閉交易功能。當你想賣出時，交易已被關閉。",
        tag: "開關詐騙",
        errorHint: "交易已被關閉！Owner 可以隨時開關交易功能。"
      },
      maxTx: {
        short: "交易限額",
        name: "交易限額 (Max Tx Limit)",
        description: "設定極低的交易限額（甚至為 0），讓你無法轉出任何代幣。",
        tag: "限額詐騙",
        errorHint: "交易限額為 0！你無法轉出任何代幣。"
      },
      cooldown: {
        short: "冷卻時間",
        name: "冷卻時間 (Cooldown Trap)",
        description: "買入後設定超長冷卻時間（如 365 天），實際上永遠無法賣出。",
        tag: "冷卻詐騙",
        errorHint: "冷卻時間為 365 天！實際上永遠無法賣出。"
      }
    }
  },
  "zh-Hans": {
    home: {
      kicker: "Honeypot Demo · ERC-20",
      title: "为什么貔貅盘能让你买得进、卖不掉？",
      subtitle:
        "别被数字骗了。在 Web3 世界，钱包里的“余额”不代表真的属于你。只要合约在 transfer 函数动了手脚，代币就是看得到、出不去。这里用一个 honeypot 合约 + 前端，安全体验被割的过程。",
      badges: ["Sepolia", "黑名单 / 严格模式", "买得进、卖出 revert"],
      interactionTitle: "互动说明",
      steps: [
        "连上钱包（请使用 Sepolia 测试网）。",
        "1. 贪婪的开始 (Buy)：切换到 ETH → PIXIU，看着代币轻松入账（模拟买入）。",
        "2. 恐慌的瞬间 (Sell)：切换到 PIXIU → ETH，试图套现时交易被回滚 (Revert)。",
        "3. 真相大白 (Code)：交易失败时看右侧代码，恶意逻辑在告诉你钱为何出不去。"
      ],
      redFlagsTitle: "如何识破骗局？",
      redFlags: [
        "🕵️‍♂️ 魔改的 transfer 函数：标准转账不该有复杂判断",
        "💀 Owner 权限未放弃：能否随时改黑名单/暂停交易？",
        "🎛️ 隐藏开关：搜索 enableTrading、limitSell 等关键词",
        "🌊 流动性未锁：可以把池子里的 ETH 抽走 (Rug Pull)"
      ],
      code: {
        transferTitle: "转出被拦截的核心",
        faucetTitle: "买得进（faucet 代替 swap）"
      },
      links: {
        contract: "合约源码",
        repo: "项目源码"
      },
      footerNotice: "本项目仅供教育与研究用途，用于提升 Web3 安全意识。Don’t trust, verify."
    },
    wallet: {
      yourWallet: "你的钱包",
      disconnected: "未连接",
      disconnect: "断开",
      connectWith: "连接 {name}",
      balanceLabel: "PIXIU 余额",
      walletTag: "WALLET",
      balanceTag: "BALANCE",
      wrongNetwork: "网络错误",
      switchToSepolia: "切换到 Sepolia",
      amountLabel: "数量 (PIXIU)",
      payFrom: "支付 (From)",
      receiveTo: "收到 (To)",
      rateLabel: "汇率 (模拟)",
      rateValue: "1 ETH = ∞ PIXIU",
      actions: {
        buy: "立即买入 (Faucet)",
        sell: "确认卖出",
        processing: "处理中..."
      },
      errors: {
        title: "交易失败 (Honeypot!)",
        strict: "交易失败：严格模式已开启 (Strict Mode)",
        blacklist: "交易失败：你已被列入黑名单 (Blacklisted)",
        rejected: "使用者取消交易",
        unknown: "交易失败",
        strictHint: "这就是“严格模式”：合约中的 strictMode 为 true，直接阻挡任何转出操作。",
        blacklistHint: "这就是“黑名单机制”：你的地址被标记在 blacklist 中，无法转账。"
      },
      status: {
        whitelistYes: "白名单: YES",
        whitelistNo: "白名单: NO",
        blacklistYes: "黑名单: YES",
        blacklistNo: "黑名单: NO",
        autoBlacklistOn: "自动黑名单: ON",
        autoBlacklistOff: "自动黑名单: OFF",
        contractMissing: "尚未设定合约地址"
      }
    },
    switcherLabel: "语言",
    scamTypes: {
      honeypot: {
        short: "貔貅盘",
        name: "貔貅盘 (Honeypot)",
        description: "买入时自动加入黑名单，无法转出代币。经典的「买得进、卖不掉」陷阱。",
        tag: "黑名单诈骗",
        errorHint: "你的地址被加入黑名单了！这就是貔貅盘的运作方式。"
      },
      hiddenFee: {
        short: "隐藏手续费",
        name: "隐藏手续费 (Hidden Fee)",
        description: "买入时 0% 手续费，卖出时收取高达 90% 的隐藏手续费。",
        tag: "手续费诈骗",
        errorHint: "卖出时被收取了 90% 的手续费！只有 10% 到账。"
      },
      tradingSwitch: {
        short: "交易开关",
        name: "交易开关 (Trading Switch)",
        description: "Owner 可以随时关闭交易功能。当你想卖出时，交易已被关闭。",
        tag: "开关诈骗",
        errorHint: "交易已被关闭！Owner 可以随时开关交易功能。"
      },
      maxTx: {
        short: "交易限额",
        name: "交易限额 (Max Tx Limit)",
        description: "设定极低的交易限额（甚至为 0），让你无法转出代币。",
        tag: "限额诈骗",
        errorHint: "交易限额为 0！你无法转出任何代币。"
      },
      cooldown: {
        short: "冷却时间",
        name: "冷却时间 (Cooldown Trap)",
        description: "买入后设定超长冷却时间（如 365 天），实际上永远无法卖出。",
        tag: "冷却诈骗",
        errorHint: "冷却时间为 365 天！实际上永远无法卖出。"
      }
    }
  },
  en: {
    home: {
      kicker: "Honeypot Demo · ERC-20",
      title: "Why can a honeypot let you buy in but never sell?",
      subtitle:
        "Don’t be fooled by the balance number. In Web3, the balance you see isn’t truly yours if transfer logic blocks exits. This demo lets you safely feel how a honeypot traps you.",
      badges: ["Sepolia", "Blacklist / Strict mode", "Buy works, sell reverts"],
      interactionTitle: "How to try",
      steps: [
        "Connect your wallet (use Sepolia).",
        "1. Greed (Buy): switch to ETH → PIXIU, mint for free and feel “early”.",
        "2. Panic (Sell): switch to PIXIU → ETH, the sell reverts when you try to exit.",
        "3. Reveal (Code): when it fails, look at the code on the right—malicious logic explains why funds are stuck."
      ],
      redFlagsTitle: "How to spot the scam?",
      redFlags: [
        "🕵️‍♂️ Hacked transfer: standard transfer shouldn’t have complex checks",
        "💀 Owner still in control: can they flip blacklist/pauses anytime?",
        "🎛️ Hidden switches: search for enableTrading, limitSell, etc.",
        "🌊 Liquidity unlocked: team can pull the pool (rug)"
      ],
      code: {
        transferTitle: "Core that blocks selling",
        faucetTitle: "Buy path (faucet stands in for swap)"
      },
      links: {
        contract: "Contract source",
        repo: "Project repo"
      },
      footerNotice: "For education/research only. Raise Web3 security awareness. Don’t trust, verify."
    },
    wallet: {
      yourWallet: "Your Wallet",
      disconnected: "Not connected",
      disconnect: "Disconnect",
      connectWith: "Connect {name}",
      balanceLabel: "PIXIU Balance",
      walletTag: "WALLET",
      balanceTag: "BALANCE",
      wrongNetwork: "Wrong Network",
      switchToSepolia: "Switch to Sepolia",
      amountLabel: "Amount (PIXIU)",
      payFrom: "Pay (From)",
      receiveTo: "Receive (To)",
      rateLabel: "Rate (simulated)",
      rateValue: "1 ETH = ∞ PIXIU",
      actions: {
        buy: "Buy now (Faucet)",
        sell: "Confirm Sell",
        processing: "Processing..."
      },
      errors: {
        title: "Transaction failed (Honeypot!)",
        strict: "Transaction failed: strict mode is on.",
        blacklist: "Transaction failed: you are blacklisted.",
        rejected: "User rejected the transaction",
        unknown: "Transaction failed",
        strictHint: "Strict mode: the contract blocks any outgoing transfer when strictMode=true.",
        blacklistHint: "Blacklist: your address is flagged and cannot transfer."
      },
      status: {
        whitelistYes: "Whitelist: YES",
        whitelistNo: "Whitelist: NO",
        blacklistYes: "Blacklist: YES",
        blacklistNo: "Blacklist: NO",
        autoBlacklistOn: "Auto-Blacklist: ON",
        autoBlacklistOff: "Auto-Blacklist: OFF",
        contractMissing: "Contract not configured"
      }
    },
    switcherLabel: "Language",
    scamTypes: {
      honeypot: {
        short: "Honeypot",
        name: "Honeypot (Blacklist)",
        description: "Auto-blacklists buyers on purchase. Classic 'buy works, sell blocked' trap.",
        tag: "Blacklist Scam",
        errorHint: "Your address is blacklisted! This is how honeypots work."
      },
      hiddenFee: {
        short: "Hidden Fee",
        name: "Hidden Fee (Tax Scam)",
        description: "0% buy fee, but 90% sell fee. You think you're profiting, but 90% is taken.",
        tag: "Fee Scam",
        errorHint: "90% sell fee charged! Only 10% reaches you."
      },
      tradingSwitch: {
        short: "Trading Switch",
        name: "Trading Switch (Kill Switch)",
        description: "Owner can disable trading anytime. When you try to sell, trading is off.",
        tag: "Switch Scam",
        errorHint: "Trading is disabled! Owner controls the switch."
      },
      maxTx: {
        short: "Max Tx Limit",
        name: "Max Transaction Limit",
        description: "Sets max transaction to 0, preventing any token transfers.",
        tag: "Limit Scam",
        errorHint: "Max transaction is 0! You cannot transfer any tokens."
      },
      cooldown: {
        short: "Cooldown",
        name: "Cooldown Trap",
        description: "Sets 365-day cooldown. You effectively can never sell.",
        tag: "Cooldown Scam",
        errorHint: "365-day cooldown! You can never actually sell."
      }
    }
  },
  ja: {
    home: {
      kicker: "Honeypot Demo · ERC-20",
      title: "なぜハニーポットは買えるのに売れないのか？",
      subtitle:
        "残高の数字に惑わされないでください。transfer ロジックで出口を塞がれると、表示される残高はあなたのものではありません。安全にハニーポットを体験するデモです。",
      badges: ["Sepolia", "ブラックリスト / ストリクトモード", "買える・売ると revert"],
      interactionTitle: "試し方",
      steps: [
        "ウォレットを接続（Sepolia を使用）。",
        "1. 欲望の始まり (Buy)：ETH → PIXIU に切り替え、無料ミントで“早期参入”を体験。",
        "2. パニック (Sell)：PIXIU → ETH に切り替え、出口でトランザクションが revert。",
        "3. 稼働中の悪意 (Code)：失敗したら右側のコードを確認、なぜ資金が出られないかを示します。"
      ],
      redFlagsTitle: "詐欺を見抜くポイント",
      redFlags: [
        "🕵️‍♂️ 改変された transfer：標準の送金に複雑な条件は不要",
        "💀 オーナー権限が残存：いつでも blacklist/停止を切替できるか？",
        "🎛️ 隠しスイッチ：enableTrading, limitSell などを検索",
        "🌊 流動性がロックされていない：プールを抜かれる（rug）"
      ],
      code: {
        transferTitle: "売却をブロックするコア",
        faucetTitle: "買いパス（faucet が swap 代替）"
      },
      links: {
        contract: "コントラクトソース",
        repo: "リポジトリ"
      },
      footerNotice: "教育・研究目的のみ。Web3 セキュリティ意識向上のため。Don’t trust, verify."
    },
    wallet: {
      yourWallet: "あなたのウォレット",
      disconnected: "未接続",
      disconnect: "切断",
      connectWith: "{name} で接続",
      balanceLabel: "PIXIU 残高",
      walletTag: "WALLET",
      balanceTag: "BALANCE",
      wrongNetwork: "ネットワークエラー",
      switchToSepolia: "Sepolia に切替",
      amountLabel: "数量 (PIXIU)",
      payFrom: "支払う (From)",
      receiveTo: "受け取る (To)",
      rateLabel: "レート (シミュレート)",
      rateValue: "1 ETH = ∞ PIXIU",
      actions: {
        buy: "今すぐ購入 (Faucet)",
        sell: "売却を確認",
        processing: "処理中..."
      },
      errors: {
        title: "トランザクション失敗 (Honeypot!)",
        strict: "失敗：ストリクトモードが ON",
        blacklist: "失敗：ブラックリストに登録されています",
        rejected: "ユーザーがトランザクションを拒否",
        unknown: "トランザクション失敗",
        strictHint: "ストリクトモード：strictMode=true のとき、すべての送金をブロックします。",
        blacklistHint: "ブラックリスト：このアドレスはフラグされており、送金できません。"
      },
      status: {
        whitelistYes: "ホワイトリスト: YES",
        whitelistNo: "ホワイトリスト: NO",
        blacklistYes: "ブラックリスト: YES",
        blacklistNo: "ブラックリスト: NO",
        autoBlacklistOn: "自動ブラックリスト: ON",
        autoBlacklistOff: "自動ブラックリスト: OFF",
        contractMissing: "コントラクト未設定"
      }
    },
    switcherLabel: "言語",
    scamTypes: {
      honeypot: {
        short: "ハニーポット",
        name: "ハニーポット (Blacklist)",
        description: "購入時に自動でブラックリスト登録。「買えるけど売れない」典型的な罠。",
        tag: "ブラックリスト詐欺",
        errorHint: "あなたのアドレスはブラックリストに登録されました！"
      },
      hiddenFee: {
        short: "隠し手数料",
        name: "隠し手数料 (Hidden Fee)",
        description: "買い手数料 0%、売り手数料 90%。利益が出たと思ったら 90% 取られる。",
        tag: "手数料詐欺",
        errorHint: "売却時に 90% の手数料！10% しか受け取れません。"
      },
      tradingSwitch: {
        short: "取引スイッチ",
        name: "取引スイッチ (Kill Switch)",
        description: "オーナーがいつでも取引を無効化可能。売ろうとしたら取引停止。",
        tag: "スイッチ詐欺",
        errorHint: "取引が無効化されています！オーナーがスイッチを制御。"
      },
      maxTx: {
        short: "最大取引制限",
        name: "最大取引制限 (Max Tx)",
        description: "最大取引量を 0 に設定し、トークン転送を完全にブロック。",
        tag: "制限詐欺",
        errorHint: "最大取引量が 0！トークンを転送できません。"
      },
      cooldown: {
        short: "クールダウン",
        name: "クールダウントラップ",
        description: "365 日間のクールダウン。実質的に永久に売却不可。",
        tag: "クールダウン詐欺",
        errorHint: "365 日間のクールダウン！実際には売却不可能。"
      }
    }
  }
};

function getFromPath(messages: Messages, path: string): string | string[] | Messages {
  return path.split(".").reduce((acc: any, key) => acc?.[key], messages);
}

function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return Object.keys(vars).reduce(
    (acc, key) => acc.replace(new RegExp(`{${key}}`, "g"), String(vars[key])),
    template
  );
}

export function translate<T = string | string[] | Messages>(
  locale: Locale,
  path: string,
  vars?: Record<string, string | number>
): T {
  const value = getFromPath(translations[locale] || translations[DEFAULT_LOCALE], path);
  if (typeof value === "string") return format(value, vars) as T;
  return (value as T) ?? ((translations[DEFAULT_LOCALE] as any)[path] as T);
}

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
