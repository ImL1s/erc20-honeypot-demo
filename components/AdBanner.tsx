"use client";

import { useEffect, useRef } from "react";

type AdProvider = "adsense" | "carbon" | "custom" | "none";
type AdSlot = "header" | "sidebar" | "footer" | "inline";

interface AdBannerProps {
  slot: AdSlot;
  className?: string;
}

// 從環境變數讀取廣告配置
const AD_PROVIDER = (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) || "custom";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const ADSENSE_SLOTS: Record<AdSlot, string> = {
  header: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || "",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || "",
  inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE || ""
};
const CARBON_SERVE = process.env.NEXT_PUBLIC_CARBON_SERVE || "";
const CARBON_PLACEMENT = process.env.NEXT_PUBLIC_CARBON_PLACEMENT || "";

// 廣告位尺寸配置
const SLOT_STYLES: Record<AdSlot, { minHeight: string; maxWidth: string }> = {
  header: { minHeight: "90px", maxWidth: "728px" },
  sidebar: { minHeight: "250px", maxWidth: "300px" },
  footer: { minHeight: "90px", maxWidth: "728px" },
  inline: { minHeight: "100px", maxWidth: "100%" }
};

// Google AdSense 組件
function GoogleAdSense({ slot, className }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !ADSENSE_SLOTS[slot]) return;

    try {
      // @ts-expect-error - adsbygoogle is injected by Google
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      console.warn("AdSense failed to load");
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !ADSENSE_SLOTS[slot]) {
    return <AdPlaceholder slot={slot} className={className} message="AdSense 未配置" />;
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: SLOT_STYLES[slot].minHeight,
          maxWidth: SLOT_STYLES[slot].maxWidth,
          margin: "0 auto"
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOTS[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Carbon Ads 組件 (面向開發者的高質感廣告)
function CarbonAds({ slot, className }: AdBannerProps) {
  const carbonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CARBON_SERVE || !carbonRef.current) return;

    const script = document.createElement("script");
    script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE}&placement=${CARBON_PLACEMENT}`;
    script.id = "_carbonads_js";
    script.async = true;
    carbonRef.current.appendChild(script);

    return () => {
      const carbonContainer = document.getElementById("carbonads");
      if (carbonContainer) carbonContainer.remove();
    };
  }, []);

  if (!CARBON_SERVE) {
    return <AdPlaceholder slot={slot} className={className} message="Carbon Ads 未配置" />;
  }

  return (
    <div ref={carbonRef} className={`carbon-ads-container ${className || ""}`}>
      <style jsx global>{`
        #carbonads {
          font-family: inherit;
          max-width: 330px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        #carbonads a {
          color: inherit;
          text-decoration: none;
        }
        #carbonads .carbon-wrap {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        #carbonads .carbon-img img {
          border-radius: 6px;
        }
        #carbonads .carbon-text {
          font-size: 13px;
          line-height: 1.5;
          color: #374151;
        }
        #carbonads .carbon-poweredby {
          display: block;
          margin-top: 8px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

// 自定義廣告位 (可放置贊助商、自家產品推廣等)
function CustomAdSlot({ slot, className }: AdBannerProps) {
  // 可以在這裡放置自定義廣告內容或從 CMS/API 獲取
  const customAds: Record<AdSlot, { title: string; description: string; cta: string; link: string } | null> = {
    header: null,
    sidebar: {
      title: "Web3 安全課程",
      description: "深入學習智能合約審計與 DeFi 安全",
      cta: "了解更多",
      link: "#"
    },
    footer: {
      title: "支持本專案",
      description: "如果這個教學對你有幫助，歡迎分享給更多人！",
      cta: "分享到 Twitter",
      link: "https://twitter.com/intent/tweet?text=剛剛體驗了%20ERC-20%20蜜罐陷阱%20Demo%20🍯&url="
    },
    inline: null
  };

  const ad = customAds[slot];

  if (!ad) {
    return <AdPlaceholder slot={slot} className={className} message="廣告位待配置" />;
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-mint/20 to-sand p-4 ring-1 ring-ink/10 ${className || ""}`}
      style={{ maxWidth: SLOT_STYLES[slot].maxWidth }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-ink/50">贊助</p>
        <p className="font-semibold text-ink">{ad.title}</p>
        <p className="text-sm text-ink/70">{ad.description}</p>
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-sand transition-transform hover:scale-105"
        >
          {ad.cta}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// 廣告位佔位符 (開發/未配置時顯示)
function AdPlaceholder({ slot, className, message }: AdBannerProps & { message?: string }) {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) return null;

  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-ink/5 ${className || ""}`}
      style={{
        minHeight: SLOT_STYLES[slot].minHeight,
        maxWidth: SLOT_STYLES[slot].maxWidth
      }}
    >
      <div className="text-center text-sm text-ink/40">
        <p className="font-medium">AD: {slot.toUpperCase()}</p>
        {message && <p className="text-xs">{message}</p>}
      </div>
    </div>
  );
}

// 主廣告組件 - 根據配置自動選擇廣告提供商
export function AdBanner({ slot, className }: AdBannerProps) {
  switch (AD_PROVIDER) {
    case "adsense":
      return <GoogleAdSense slot={slot} className={className} />;
    case "carbon":
      return <CarbonAds slot={slot} className={className} />;
    case "custom":
      return <CustomAdSlot slot={slot} className={className} />;
    case "none":
      return null;
    default:
      return <CustomAdSlot slot={slot} className={className} />;
  }
}

// 導出各提供商組件供直接使用
export { GoogleAdSense, CarbonAds, CustomAdSlot, AdPlaceholder };
