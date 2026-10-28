import type { Trade, JournalDay, JournalSettings } from "./schema";
import { DEFAULT_JOURNAL_SETTINGS } from "./schema";

export interface GetTradesOptions {
  from?: string;
  to?: string;
  symbol?: string;
  tag?: string;
}

export interface JournalRepository {
  getTrades(opts?: GetTradesOptions): Promise<Trade[]>;
  saveTrade(trade: Omit<Trade, "id" | "user_id"> & { id?: string }): Promise<Trade>;
  importTrades(trades: Omit<Trade, "id" | "user_id">[]): Promise<{ count: number }>;
  updateTrade(id: string, trade: Partial<Trade>): Promise<Trade>;
  deleteTrade(id: string): Promise<boolean>;
  getDay(day: string): Promise<JournalDay | null>;
  saveDay(day: string, data: { note?: string | null; mood?: number | null }): Promise<JournalDay>;
  getSettings(): Promise<JournalSettings>;
  saveSettings(settings: Partial<JournalSettings>): Promise<JournalSettings>;
}

/**
 * Production API Repository for logged-in users.
 * Communicates with server endpoints under /api/journal.
 */
export class ApiRepository implements JournalRepository {
  async getTrades(opts: GetTradesOptions = {}): Promise<Trade[]> {
    const params = new URLSearchParams();
    if (opts.from) params.set("from", opts.from);
    if (opts.to) params.set("to", opts.to);
    if (opts.symbol) params.set("symbol", opts.symbol);
    if (opts.tag) params.set("tag", opts.tag);

    const res = await fetch(`/api/journal/trades?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch trades");
    const json = await res.json();
    return json.trades || [];
  }

  async saveTrade(trade: Omit<Trade, "id" | "user_id"> & { id?: string }): Promise<Trade> {
    const res = await fetch("/api/journal/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trade),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save trade");
    }
    const json = await res.json();
    return json.trade;
  }

  async importTrades(trades: Omit<Trade, "id" | "user_id">[]): Promise<{ count: number }> {
    const res = await fetch("/api/journal/trades/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trades }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to import trades");
    }
    return await res.json();
  }

  async updateTrade(id: string, trade: Partial<Trade>): Promise<Trade> {
    const res = await fetch(`/api/journal/trades/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trade),
    });
    if (!res.ok) throw new Error("Failed to update trade");
    const json = await res.json();
    return json.trade;
  }

  async deleteTrade(id: string): Promise<boolean> {
    const res = await fetch(`/api/journal/trades/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  }

  async getDay(day: string): Promise<JournalDay | null> {
    const res = await fetch(`/api/journal/days/${day}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.day || null;
  }

  async saveDay(
    day: string,
    data: { note?: string | null; mood?: number | null }
  ): Promise<JournalDay> {
    const res = await fetch(`/api/journal/days/${day}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save day note");
    const json = await res.json();
    return json.day;
  }

  async getSettings(): Promise<JournalSettings> {
    try {
      const res = await fetch("/api/journal/settings");
      if (res.ok) {
        const json = await res.json();
        return { ...DEFAULT_JOURNAL_SETTINGS, ...json.settings };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_JOURNAL_SETTINGS;
  }

  async saveSettings(settings: Partial<JournalSettings>): Promise<JournalSettings> {
    const res = await fetch("/api/journal/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to save settings");
    const json = await res.json();
    return json.settings;
  }
}

/**
 * Local Repository for Guest Mode (/tools/trading-journal).
 * Persists directly in the user's browser (localStorage).
 */
export class LocalRepository implements JournalRepository {
  private STORAGE_TRADES = "iosnapchart_guest_trades";
  private STORAGE_DAYS = "iosnapchart_guest_days";
  private STORAGE_SETTINGS = "iosnapchart_guest_settings";

  private getStoredTrades(): Trade[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_TRADES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private setStoredTrades(trades: Trade[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.STORAGE_TRADES, JSON.stringify(trades));
    } catch {
      // Ignore
    }
  }

  async getTrades(opts: GetTradesOptions = {}): Promise<Trade[]> {
    let trades = this.getStoredTrades();

    if (opts.from) trades = trades.filter((t) => t.trade_date >= opts.from!);
    if (opts.to) trades = trades.filter((t) => t.trade_date <= opts.to!);
    if (opts.symbol) {
      const q = opts.symbol.toUpperCase();
      trades = trades.filter((t) => t.symbol.includes(q));
    }
    if (opts.tag) {
      trades = trades.filter(
        (t) =>
          (t.setup_tags && t.setup_tags.includes(opts.tag!)) ||
          (t.mistake_tags && t.mistake_tags.includes(opts.tag!))
      );
    }

    return trades;
  }

  async saveTrade(trade: Omit<Trade, "id" | "user_id"> & { id?: string }): Promise<Trade> {
    const trades = this.getStoredTrades();
    const newTrade: Trade = {
      ...trade,
      id: trade.id || `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      user_id: "guest",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    trades.unshift(newTrade);
    this.setStoredTrades(trades);
    return newTrade;
  }

  async importTrades(newTrades: Omit<Trade, "id" | "user_id">[]): Promise<{ count: number }> {
    const current = this.getStoredTrades();
    const formatted: Trade[] = newTrades.map((t, idx) => ({
      ...t,
      id: `local-import-${Date.now()}-${idx}`,
      user_id: "guest",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const combined = [...formatted, ...current];
    this.setStoredTrades(combined);
    return { count: formatted.length };
  }

  async updateTrade(id: string, updates: Partial<Trade>): Promise<Trade> {
    const trades = this.getStoredTrades();
    const idx = trades.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Trade not found");

    const updated: Trade = {
      ...trades[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    trades[idx] = updated;
    this.setStoredTrades(trades);
    return updated;
  }

  async deleteTrade(id: string): Promise<boolean> {
    const trades = this.getStoredTrades();
    const filtered = trades.filter((t) => t.id !== id);
    this.setStoredTrades(filtered);
    return true;
  }

  async getDay(day: string): Promise<JournalDay | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(this.STORAGE_DAYS);
      const days: Record<string, JournalDay> = raw ? JSON.parse(raw) : {};
      return days[day] || null;
    } catch {
      return null;
    }
  }

  async saveDay(
    day: string,
    data: { note?: string | null; mood?: number | null }
  ): Promise<JournalDay> {
    if (typeof window === "undefined") return { day, ...data };
    try {
      const raw = localStorage.getItem(this.STORAGE_DAYS);
      const days: Record<string, JournalDay> = raw ? JSON.parse(raw) : {};
      days[day] = { day, note: data.note || null, mood: data.mood || null };
      localStorage.setItem(this.STORAGE_DAYS, JSON.stringify(days));
      return days[day];
    } catch {
      return { day, ...data };
    }
  }

  async getSettings(): Promise<JournalSettings> {
    if (typeof window === "undefined") return DEFAULT_JOURNAL_SETTINGS;
    try {
      const raw = localStorage.getItem(this.STORAGE_SETTINGS);
      return raw ? { ...DEFAULT_JOURNAL_SETTINGS, ...JSON.parse(raw) } : DEFAULT_JOURNAL_SETTINGS;
    } catch {
      return DEFAULT_JOURNAL_SETTINGS;
    }
  }

  async saveSettings(settings: Partial<JournalSettings>): Promise<JournalSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.STORAGE_SETTINGS, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
    return updated;
  }
}
