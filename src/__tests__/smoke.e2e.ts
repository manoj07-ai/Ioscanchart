import { test, expect } from "@playwright/test";
import { brand } from "@/config/brand";

test.describe("Marketing Landing Page Smoke Test", () => {
  test("loads landing page and renders primary sections", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Title contains brand name
    await expect(page).toHaveTitle(new RegExp(brand.name));

    // Hero headline is visible
    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toBeVisible();
    await expect(headline).toContainText("Drop any chart");

    // Navigation and CTA are present
    const primaryCta = page.getByRole("button", { name: /Analyze a chart/i }).first();
    await expect(primaryCta).toBeVisible();

    // Verify sections exist
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("#markets")).toBeVisible();
    await expect(page.locator("#how-it-works")).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();
  });
});
