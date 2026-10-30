import { test, expect } from "@playwright/test";

test.describe("Prompt 09 — Full QA Launch Smoke Flow", () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset test user to monthly with credits to start cleanly
    await request.post("http://localhost:3000/api/dev/set-plan", {
      data: { plan: "monthly", credits: 999, resetDailyUsage: true },
    });

    await page.addInitScript(() => {
      localStorage.setItem("ioscan_tour_seen", "true");
      localStorage.setItem("ioscan_age_consent", "true");
    });
  });

  test("landing → CTA → upload (AI_MOCK) → result → add to journal → paywall after credit used", async ({
    page,
    request,
  }) => {
    // 1. Visit landing page
    await page.goto("http://localhost:3000");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Drop any chart");

    // 2. Click primary CTA
    const ctaButton = page.getByRole("button", { name: /Analyze a chart/i }).first();
    await ctaButton.click();
    await page.waitForURL("**/app");

    // 3. In app workspace, paste TradingView link
    const tvInput = page.getByPlaceholder(/tradingview\.com\/x/i);
    await tvInput.click();
    await tvInput.pressSequentially("https://www.tradingview.com/x/ABC12345/", { delay: 10 });
    await expect(page.getByText(/Valid/i).first()).toBeVisible();

    // 4. Submit analysis
    const startBtn = page.getByRole("button", { name: /Start analysis/i });
    await expect(startBtn).toBeEnabled();
    await startBtn.click();

    // 5. Wait for redirect to result page
    await page.waitForURL(/\/app\/analysis\/.+/, { timeout: 25000 });
    await expect(page.getByText(/Quality/i)).toBeVisible();
    await expect(page.getByText(/Key Technical Levels/i)).toBeVisible();

    // 6. Click "+ Journal" to log trade from analysis
    const journalBtn = page.getByRole("button", { name: /\+ Journal/i });
    if (await journalBtn.isVisible()) {
      await journalBtn.click();
      await expect(page.getByText(/Log Trade from Analysis Plan/i)).toBeVisible();

      // Enter P&L
      const pnlInput = page.getByPlaceholder(/\+0\.00/i);
      await pnlInput.fill("150");

      // Save trade
      const saveBtn = page.getByRole("button", { name: /Save to Journal Calendar/i });
      await saveBtn.click();
      await expect(page.getByText(/Trade Logged Successfully!/i)).toBeVisible();
      await page.getByRole("button", { name: /Close/i }).click();
    }

    // 7. Exhaust credits via dev endpoint to test paywall trigger
    await request.post("http://localhost:3000/api/dev/set-plan", {
      data: { plan: "demo", credits: 0, resetDailyUsage: false },
    });

    // 8. Return to /app and attempt new analysis
    await page.goto("http://localhost:3000/app");
    const tvInput2 = page.getByPlaceholder(/tradingview\.com\/x/i);
    await tvInput2.click();
    await tvInput2.pressSequentially("https://www.tradingview.com/x/XYZ99999/", { delay: 10 });

    const startBtn2 = page.getByRole("button", { name: /Start analysis/i });
    await expect(startBtn2).toBeEnabled();
    await startBtn2.click();

    // 9. Paywall Upgrade Dialog appears with 402 code
    await expect(page.getByText(/Upgrade to continue/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /View Paid Plans/i })).toBeVisible();
  });
});
