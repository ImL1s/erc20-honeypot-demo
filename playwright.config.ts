import type { PlaywrightTestConfig } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT || 3002);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;
const reuse = Boolean(process.env.PLAYWRIGHT_USE_EXISTING_SERVER);

const config: PlaywrightTestConfig = {
  testDir: "e2e",
  retries: 0,
  use: {
    baseURL,
    headless: true
  },
  webServer: reuse
    ? undefined
    : {
        command: `npm run dev -- --hostname 0.0.0.0 --port ${port}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000
      }
};

export default config;
