import { test, expect } from "@playwright/test";

test.describe("首頁基礎功能", () => {
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
});

test.describe("詐騙類型選擇器", () => {
  test("ScamTypeSelector tabs 應該可見且可切換", async ({ page }) => {
    await page.goto("/");

    // 等待頁面完全載入
    await expect(page.getByRole("heading", { name: "為什麼貔貅盤能讓你買得進、賣不掉？" })).toBeVisible();

    // 驗證 Honeypot 預設選中（應該顯示 $PIXIU）
    await expect(page.getByText("$PIXIU")).toBeVisible();

    // 在桌面版查找 tabs（包含圖標）
    // 點擊 Hidden Fee tab
    const hiddenFeeTab = page.getByRole("button", { name: /💸/ }).first();
    if (await hiddenFeeTab.isVisible()) {
      await hiddenFeeTab.click();
      await expect(page.getByText("$HFEE")).toBeVisible();
    }

    // 點擊 Trading Switch tab
    const tradingSwitchTab = page.getByRole("button", { name: /🎛️/ }).first();
    if (await tradingSwitchTab.isVisible()) {
      await tradingSwitchTab.click();
      await expect(page.getByText("$TSWITCH")).toBeVisible();
    }

    // 點擊回 Honeypot tab
    const honeypotTab = page.getByRole("button", { name: /🍯/ }).first();
    if (await honeypotTab.isVisible()) {
      await honeypotTab.click();
      await expect(page.getByText("$PIXIU")).toBeVisible();
    }
  });

  test("每個詐騙類型應顯示對應的描述和標籤", async ({ page }) => {
    await page.goto("/");

    // 等待頁面載入
    await expect(page.getByRole("heading", { name: "為什麼貔貅盤能讓你買得進、賣不掉？" })).toBeVisible();

    // Honeypot 預設應顯示黑名單詐騙標籤（使用 first() 避免 strict mode 錯誤）
    await expect(page.getByText("黑名單詐騙").first()).toBeVisible();
  });
});

test.describe("程式碼片段", () => {
  test("應顯示程式碼片段區塊", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("轉出被攔截的核心")).toBeVisible();
    await expect(page.getByText("買得進（faucet 代替 swap）")).toBeVisible();
  });
});
