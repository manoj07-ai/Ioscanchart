import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/__tests__",
  testMatch: /.*\.e2e\.ts/,
  workers: 1, // run sequentially against local dev server to avoid concurrent lockups
  timeout: 45000,
  use: {
    baseURL: "http://localhost:3000",
  },
});
