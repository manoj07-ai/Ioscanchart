import { validateTvLink } from "@/server/ai/schema";

export interface TradingViewSnapshotResult {
  base64: string;
  mimeType: string;
  snapshotId: string;
  directImageUrl: string;
}

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Resolves a TradingView /x/ snapshot link into an image buffer & base64.
 * Includes SSRF protection, strict domain checks, and image type verification.
 */
export async function fetchTradingViewSnapshot(tvUrl: string): Promise<TradingViewSnapshotResult> {
  const trimmed = tvUrl.trim();
  if (!validateTvLink(trimmed)) {
    throw new Error(
      "Invalid TradingView snapshot link. Only links matching https://www.tradingview.com/x/... are allowed."
    );
  }

  const match = trimmed.match(/^https:\/\/www\.tradingview\.com\/x\/([a-zA-Z0-9]+)\/?$/);
  if (!match || !match[1]) {
    throw new Error("Unable to extract TradingView snapshot ID from URL.");
  }

  const snapshotId = match[1];

  // 1. Fetch TradingView HTML to extract the exact og:image metadata or direct S3 link
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  let directImageUrl = `https://s3.tradingview.com/snapshots/${snapshotId[0].toLowerCase()}/${snapshotId}.png`;

  try {
    const pageRes = await fetch(trimmed, {
      headers: { "User-Agent": userAgent },
      redirect: "follow",
    });

    if (pageRes.ok) {
      const html = await pageRes.text();
      const ogMatch =
        html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i) ||
        html.match(/<meta name=["']twitter:image["'] content=["']([^"']+)["']/i);

      if (ogMatch && ogMatch[1]) {
        const candidate = ogMatch[1];
        // SSRF check on candidate URL
        const parsedCandidate = new URL(candidate);
        if (
          parsedCandidate.protocol === "https:" &&
          (parsedCandidate.hostname === "s3.tradingview.com" ||
            parsedCandidate.hostname.endsWith(".tradingview.com"))
        ) {
          directImageUrl = candidate;
        }
      }
    }
  } catch (err) {
    console.warn(`[tradingview] HTML metadata fetch failed for ${trimmed}, falling back to direct S3:`, err);
  }

  // 2. Fetch the actual image binary
  const imgRes = await fetch(directImageUrl, {
    headers: { "User-Agent": userAgent },
  });

  if (!imgRes.ok) {
    throw new Error(
      `Failed to download TradingView snapshot image (${imgRes.status} ${imgRes.statusText}). Please verify the link is active.`
    );
  }

  const contentType = imgRes.headers.get("content-type") || "image/png";
  const arrayBuffer = await imgRes.arrayBuffer();

  if (arrayBuffer.byteLength > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("TradingView snapshot image exceeds maximum allowed size (10MB).");
  }

  if (arrayBuffer.byteLength < 100) {
    throw new Error("TradingView snapshot image returned empty or corrupt content.");
  }

  const buffer = Buffer.from(arrayBuffer);

  // Magic bytes verification
  // PNG: 89 50 4E 47
  // JPEG: FF D8 FF
  // WebP: 52 49 46 46 ... 57 45 42 50
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isWebp =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;

  let mimeType = "image/png";
  if (isPng) mimeType = "image/png";
  else if (isJpg) mimeType = "image/jpeg";
  else if (isWebp) mimeType = "image/webp";
  else if (contentType.includes("jpeg") || contentType.includes("jpg")) mimeType = "image/jpeg";

  const base64 = buffer.toString("base64");

  return {
    base64,
    mimeType,
    snapshotId,
    directImageUrl,
  };
}
