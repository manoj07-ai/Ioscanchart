import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/__tests__",
  testMatch: /.*\.e2e\.ts/,
  use: {
    baseURL: "http://localhost:3000",
  },
});
