import { test, expect } from "@playwright/test";

test("首頁載入並顯示主要操作按鈕", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "為什麼貔貅盤能讓你買得進、賣不掉？" })).toBeVisible();
  await expect(page.getByText("買得進、賣出 revert")).toBeVisible();

  // 錢包未連線時應顯示狀態與禁用操作
  await expect(page.getByText("未連線")).toBeVisible();
  await expect(page.getByRole("button", { name: "立即買入 (Faucet)" })).toBeDisabled();

  // 主要 swap 表單應存在
  await expect(page.getByText("支付 (From)")).toBeVisible();
  await expect(page.getByText("收到 (To)")).toBeVisible();
});
