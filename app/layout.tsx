import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "PIXIU Honeypot Demo",
  description: "為什麼貔貅盤買得進、賣不掉？互動演示 ERC-20 轉出阻擋邏輯。"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="bg-sand text-ink min-h-screen">
        {children}
      </body>
    </html>
  );
}
