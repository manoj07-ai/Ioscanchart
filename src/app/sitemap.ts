import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iosnapchart.com";
  const now = new Date();

  const routes = [
    "",
    "/pricing",
    "/markets",
    "/markets/india-indices",
    "/markets/india-options",
    "/markets/india-equities",
    "/markets/us-equities",
    "/markets/crypto",
    "/markets/forex",
    "/markets/commodities",
    "/markets/global-indices",
    "/trading-journal",
    "/tools/trading-journal",
    "/trading-journal/forex",
    "/trading-journal/crypto",
    "/trading-journal/stocks",
    "/trading-journal/options",
    "/trading-journal/futures",
    "/trading-journal/nifty-banknifty",
    "/blog",
    "/blog/how-to-keep-a-trading-journal",
    "/blog/what-to-record-in-a-trading-journal",
    "/blog/win-rate-vs-expectancy",
    "/blog/how-to-read-your-trading-pnl-calendar",
    "/blog/how-to-take-a-chart-screenshot-ai-can-read",
    "/blog/reading-an-option-chain-oi-pcr-max-pain",
    "/blog/why-a-good-plan-starts-with-invalidation",
    "/faq",
    "/disclaimer",
    "/risk",
    "/terms",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
