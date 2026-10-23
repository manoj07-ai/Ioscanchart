/**
 * Brand configuration — single source of truth for the product name.
 * NEVER hardcode the product name in components or copy; always import from here.
 */

export const brand = {
  /** The full product name */
  name: "Iosnapchart",
  /** Short tagline */
  tagline: "Drop any chart — from Wall Street to Dalal Street — and get a plan with the reasoning shown.",
  /** Domain (update before launch) */
  domain: "iosnapchart.com",
  /** Support email */
  supportEmail: "support@iosnapchart.com",
  /** Social handles */
  twitter: "@iosnapchart",
} as const;

export type Brand = typeof brand;
