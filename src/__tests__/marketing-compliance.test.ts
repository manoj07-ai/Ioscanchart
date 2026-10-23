import { describe, it, expect } from "vitest";
import { SHOW_TESTIMONIALS } from "@/config/brand";
import fs from "fs";
import path from "path";

describe("Marketing Compliance & Legal Integrity", () => {
  it("keeps SHOW_TESTIMONIALS disabled by default", () => {
    expect(SHOW_TESTIMONIALS).toBe(false);
  });

  it("contains no competitor fabricated statistics in marketing copy", () => {
    const marketingDir = path.resolve(process.cwd(), "src/components/marketing");
    const files = fs.readdirSync(marketingDir).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

    const forbiddenPatterns = [
      /1[,.]?300\+?\s*traders/i,
      /1[,.]?000\+?\s*traders/i,
      /4\.7\s*(stars|rating|on whop)/i,
      /guaranteed\s*(profits|returns|win)/i,
      /recover your investment/i,
    ];

    for (const file of files) {
      const content = fs.readFileSync(path.join(marketingDir, file), "utf-8");
      for (const pattern of forbiddenPatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it("contains {{FOUNDER_STORY}} comment marker in FounderNote", () => {
    const founderNotePath = path.resolve(process.cwd(), "src/components/marketing/FounderNote.tsx");
    const content = fs.readFileSync(founderNotePath, "utf-8");
    expect(content).toContain("{{FOUNDER_STORY}}");
  });
});
