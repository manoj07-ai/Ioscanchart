import { test, expect } from "@playwright/test";

test.describe("App Workspace & Uploader Flow (Prompt 05)", () => {
  test.beforeAll(async ({ request }) => {
    // Ensure test runner has unlimited monthly entitlement
    await request.post("http://localhost:3000/api/dev/set-plan", {
      data: { plan: "monthly", credits: 999, resetDailyUsage: true },
    });
  });

  test.beforeEach(async ({ page }) => {
    // Dismiss guided tour in tests to avoid dynamic banner shifts
    await page.addInitScript(() => {
      localStorage.setItem("ioscan_tour_seen", "true");
    });
  });

  test("renders app shell, navigation, and upload inputs", async ({ page }) => {
    await page.goto("http://localhost:3000/app");
    await page.waitForLoadState("domcontentloaded");

    // Shell check: sidebar and new analysis CTA
    await expect(page.getByRole("button", { name: /New analysis/i })).toBeVisible();
    await expect(page.getByText("Workspace")).toBeVisible();
    await expect(page.getByText("Open TradingView")).toBeVisible();

    // Dropzone check
    await expect(page.getByText(/Drop your chart here/i)).toBeVisible();

    // Fine-tune controls toggle
    const fineTuneBtn = page.getByRole("button", { name: /Fine-tune analysis/i });
    await expect(fineTuneBtn).toBeVisible();
    await fineTuneBtn.click();
    await expect(page.getByText("Account Size (USD/INR)")).toBeVisible();
    await expect(page.getByText("Risk % per trade")).toBeVisible();

    // Start analysis button should be disabled initially without inputs
    const startBtn = page.getByRole("button", { name: /Start analysis/i });
    await expect(startBtn).toBeDisabled();
  });

  test("submits TradingView link, displays progress, and redirects to result (AI_MOCK mode)", async ({ page }) => {
    await page.goto("http://localhost:3000/app");
    await page.waitForLoadState("domcontentloaded");

    // Enter a valid TradingView link
    const linkInput = page.getByPlaceholder(/paste TradingView link/i);
    await linkInput.click();
    await linkInput.pressSequentially("https://www.tradingview.com/x/ABC12345/", { delay: 20 });

    // Validation indicator appears
    await expect(page.getByText(/Valid TV link/i)).toBeVisible();

    // Start button becomes enabled
    const startBtn = page.getByRole("button", { name: /Start analysis/i });
    await expect(startBtn).toBeEnabled();

    // Click start analysis
    await startBtn.click();

    // Verify progress UI triggers
    await expect(page.getByText(/Analyzing your chart/i)).toBeVisible();
    await expect(page.getByText(/Reading your chart/i)).toBeVisible();

    // Wait for redirect to /app/analysis/[id]
    await page.waitForURL(/\/app\/analysis\/.+/, { timeout: 25000 });
    await expect(page.getByText("Quality")).toBeVisible();
    await expect(page.getByText("Key Technical Levels")).toBeVisible();
  });
});
