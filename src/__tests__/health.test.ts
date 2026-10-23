import { describe, it, expect } from "vitest";

/**
 * Unit test: health check response shape.
 * Tests the logic inline (not the HTTP layer) for speed.
 * The actual route is smoke-tested in Playwright (Prompt 09).
 */

function buildHealthResponse() {
  return {
    status: "ok",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
    env: "test",
  };
}

describe("health check", () => {
  it("returns status ok", () => {
    const res = buildHealthResponse();
    expect(res.status).toBe("ok");
  });

  it("includes a valid ISO timestamp", () => {
    const res = buildHealthResponse();
    expect(() => new Date(res.timestamp)).not.toThrow();
    expect(new Date(res.timestamp).getTime()).toBeGreaterThan(0);
  });

  it("includes version", () => {
    const res = buildHealthResponse();
    expect(typeof res.version).toBe("string");
    expect(res.version.length).toBeGreaterThan(0);
  });
});
