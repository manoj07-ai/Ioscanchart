/**
 * Lightweight client-side analytics event tracker.
 * Dispatches to /api/events if configured or logs cleanly to console in development.
 */
export function track(eventName: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  try {
    // Non-blocking beacon or fetch
    const payload = JSON.stringify({
      name: eventName,
      props,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", payload);
    } else {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics failures must never interrupt user experience
  }
}
