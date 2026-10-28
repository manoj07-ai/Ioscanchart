import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iosnapchart.com";
  const now = new Date();

  const routes = [
    "",
    "/pricing",
    "/markets",
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
