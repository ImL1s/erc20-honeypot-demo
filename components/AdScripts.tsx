"use client";

import Script from "next/script";

const AD_PROVIDER = process.env.NEXT_PUBLIC_AD_PROVIDER || "custom";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/**
 * 廣告腳本載入器
 * 在 layout 或 page 中使用，負責載入廣告平台所需的外部腳本
 */
export function AdScripts() {
  return (
    <>
      {/* Google AdSense */}
      {AD_PROVIDER === "adsense" && ADSENSE_CLIENT && (
        <Script
          id="adsense-script"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      {/* Google Analytics (常搭配廣告使用) */}
      {GA_ID && (
        <>
          <Script
            id="ga-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
