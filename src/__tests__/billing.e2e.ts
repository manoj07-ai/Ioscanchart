import { test, expect } from "@playwright/test";

test.describe("Prompt 08 — Billing, Upgrade Page & Early Access E2E", () => {
  test("renders /app/upgrade with plans, comparison table and money-honest note", async ({ page }) => {
    await page.goto("http://localhost:3000/app/upgrade");

    // Title and currency notice
    await expect(page.getByText("Upgrade to Professional Chart Intelligence")).toBeVisible();
    await expect(page.getByText(/Prices shown in USD/i)).toBeVisible();

    // Plan cards
    await expect(page.getByRole("button", { name: /Upgrade to Monthly/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Get Lifetime Access/i })).toBeVisible();
    await expect(page.getByText("MOST POPULAR")).toBeVisible();
    await expect(page.getByText("BEST VALUE")).toBeVisible();

    // Demo vs Paid comparison table
    await expect(page.getByText("Demo vs. Paid Breakdown")).toBeVisible();
    await expect(page.getByText("Analyses Allowance")).toBeVisible();
    await expect(page.getByText("Money-Honest Guarantee")).toBeVisible();
  });

  test("triggers early access modal on checkout click and submits email", async ({ page }) => {
    await page.goto("http://localhost:3000/app/upgrade");

    // Click checkout
    const monthlyBtn = page.getByRole("button", { name: /Upgrade to Monthly/i });
    await monthlyBtn.click();

    // Early Access modal appears due to 501 stub
    await expect(page.getByText("Payments Launching Soon")).toBeVisible();
    await expect(page.getByText(/Join our priority early-access list/i)).toBeVisible();

    // Fill in waitlist email
    const emailInput = page.getByLabel("Email address");
    await emailInput.fill("playwright.trader@example.com");

    // Submit early access form
    const submitBtn = page.getByRole("button", { name: /Join Priority List/i });
    await submitBtn.click();

    // Success state confirms waitlist reservation
    await expect(page.getByText("You're on the priority list!")).toBeVisible();
  });

  test("dev admin helper /dev/plan allows switching plans and resets credits", async ({ page }) => {
    await page.goto("http://localhost:3000/dev/plan");

    await expect(page.getByText("Billing & Plan Switcher")).toBeVisible();
    await expect(page.getByText("DEV ONLY • NODE_ENV !== production")).toBeVisible();

    // Switch to Demo 0 credits to test paywall state
    const demoExhaustedBtn = page.getByRole("button", { name: /Demo — Exhausted/i });
    await demoExhaustedBtn.click();
    await expect(page.getByText(/Plan updated to demo with 0 credits/i)).toBeVisible();

    // Switch back to Monthly
    const monthlyBtn = page.getByRole("button", { name: /Monthly Plan/i });
    await monthlyBtn.click();
    await expect(page.getByText(/Plan updated to monthly with 999 credits/i)).toBeVisible();
  });
});
