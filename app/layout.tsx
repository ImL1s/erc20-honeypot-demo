import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { AdScripts } from "../components/AdScripts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://honeypot-demo.example.com";
const SITE_NAME = "PIXIU Honeypot Demo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PIXIU Honeypot Demo | 貔貅盤 ERC-20 安全教育",
    template: "%s | PIXIU Honeypot Demo"
  },
  description:
    "親身體驗「買得進、賣不掉」的貔貅盤陷阱。透過互動式 DEX 前端，了解 ERC-20 蜜罐合約的黑名單與嚴格模式機制，提升 Web3 安全意識。",
  keywords: [
    "honeypot",
    "貔貅盤",
    "ERC-20",
    "蜜罐",
    "Web3 安全",
    "區塊鏈詐騙",
    "智能合約",
    "Solidity",
    "黑名單",
    "DEX",
    "加密貨幣安全",
    "rug pull",
    "scam token"
  ],
  authors: [{ name: "Web3 Security Education" }],
  creator: "Web3 Security Education",
  publisher: "Web3 Security Education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "PIXIU Honeypot Demo | 貔貅盤互動教學",
    description:
      "為什麼貔貅盤能讓你買得進、賣不掉？透過真實合約互動，揭露 ERC-20 蜜罐陷阱的運作機制。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PIXIU Honeypot Demo - Web3 安全教育"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PIXIU Honeypot Demo | 貔貅盤互動教學",
    description:
      "為什麼貔貅盤能讓你買得進、賣不掉？透過真實合約互動，揭露 ERC-20 蜜罐陷阱的運作機制。",
    images: ["/og-image.png"],
    creator: "@web3security"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: SITE_URL
  },
  category: "education"
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
  width: "device-width",
  initialScale: 1
};

// JSON-LD 結構化數據
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description:
    "互動式 ERC-20 蜜罐（Honeypot）教學平台，展示貔貅盤的黑名單與嚴格模式機制。",
  url: SITE_URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  author: {
    "@type": "Organization",
    name: "Web3 Security Education"
  },
  educationalUse: ["Security Awareness", "Blockchain Education"],
  learningResourceType: "Interactive Demo",
  teaches: "ERC-20 Honeypot/Scam Token Detection"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-sand text-ink min-h-screen">
        {children}
        <AdScripts />
      </body>
    </html>
  );
}
