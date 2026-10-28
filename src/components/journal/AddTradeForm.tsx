"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MARKET_PACK_LIST } from "@/config/markets";
import { MISTAKE_TAGS, COMMON_SETUP_TAGS, type Trade } from "@/lib/journal/schema";
import { parseAmountInput, deriveFromFills, deriveR } from "@/lib/journal/format";

interface AddTradeFormProps {
  initialDate?: string;
  previousSymbols?: string[];
  initialTrade?: Trade | null;
  currency: string;
  onSaveTrade: (trade: Omit<Trade, "id" | "user_id"> & { id?: string }) => Promise<void>;
  onCancelEdit?: () => void;
}

export function AddTradeForm({
  initialDate,
  previousSymbols = [],
  initialTrade,
  currency,
  onSaveTrade,
  onCancelEdit,
}: AddTradeFormProps) {
  const symbolInputRef = useRef<HTMLInputElement>(null);

  // Quick row inputs
  const [tradeDate, setTradeDate] = useState<string>(
    initialTrade?.trade_date || initialDate || new Date().toISOString().slice(0, 10)
  );
  const [symbol, setSymbol] = useState<string>(initialTrade?.symbol || "");
  const [pnlInput, setPnlInput] = useState<string>(
    initialTrade ? (initialTrade.pnl > 0 ? `+${initialTrade.pnl}` : `${initialTrade.pnl}`) : ""
  );
  const [note, setNote] = useState<string>(initialTrade?.note || "");

  // More details accordion state
  const [showDetails, setShowDetails] = useState(!!initialTrade?.entry_price || !!initialTrade?.analysis_id);
  const [direction, setDirection] = useState<"long" | "short">(initialTrade?.direction || "long");
  const [market, setMarket] = useState<string>(initialTrade?.market || "us-equities");
  const [entryPrice, setEntryPrice] = useState<string>(initialTrade?.entry_price ? String(initialTrade.entry_price) : "");
  const [exitPrice, setExitPrice] = useState<string>(initialTrade?.exit_price ? String(initialTrade.exit_price) : "");
  const [quantity, setQuantity] = useState<string>(initialTrade?.quantity ? String(initialTrade.quantity) : "");
  const [multiplier, setMultiplier] = useState<string>(initialTrade?.multiplier ? String(initialTrade.multiplier) : "1");
  const [fees, setFees] = useState<string>(initialTrade?.fees ? String(initialTrade.fees) : "0");
  const [riskAmount, setRiskAmount] = useState<string>(initialTrade?.risk_amount ? String(initialTrade.risk_amount) : "");
  const [rMultipleInput, setRMultipleInput] = useState<string>(
    initialTrade?.r_multiple !== null && initialTrade?.r_multiple !== undefined ? String(initialTrade.r_multiple) : ""
  );
  const [selectedSetupTags, setSelectedSetupTags] = useState<string[]>(initialTrade?.setup_tags || []);
  const [selectedMistakeTags, setSelectedMistakeTags] = useState<string[]>(initialTrade?.mistake_tags || []);
  const [followedPlan, setFollowedPlan] = useState<"yes" | "partly" | "no" | "">(initialTrade?.followed_plan || "");
  const analysisId = initialTrade?.analysis_id || "";

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync date when initialDate prop changes in add mode
  useEffect(() => {
    if (!initialTrade && initialDate) {
      setTradeDate(initialDate);
    }
  }, [initialDate, initialTrade]);

  // Live P&L parsing indicator
  const parsedPnl = parseAmountInput(pnlInput);
  const isPnlValid = parsedPnl.ok;
  const pnlVal = isPnlValid ? parsedPnl.value : 0;

  // Derive R automatically if riskAmount and valid P&L exist
  useEffect(() => {
    if (isPnlValid && riskAmount && Number(riskAmount) > 0) {
      const derived = deriveR(pnlVal, Number(riskAmount));
      if (derived !== null) {
        setRMultipleInput(String(derived));
      }
    }
  }, [pnlVal, riskAmount, isPnlValid]);

  // Calculate P&L from fills
  function handleCalculatePnl() {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const qty = parseFloat(quantity);
    const mult = parseFloat(multiplier) || 1;
    const f = parseFloat(fees) || 0;

    const calc = deriveFromFills({
      direction,
      entry,
      exit,
      quantity: qty,
      multiplier: mult,
      fees: f,
    });

    if (calc !== null) {
      setPnlInput(calc > 0 ? `+${calc}` : `${calc}`);
      setErrorMsg(null);
    } else {
      setErrorMsg("Please fill valid entry, exit, and quantity to compute P&L");
    }
  }

  function toggleSetupTag(tag: string) {
    setSelectedSetupTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function toggleMistakeTag(tag: string) {
    setSelectedMistakeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const cleanSymbol = symbol.trim().toUpperCase();
    if (!cleanSymbol) {
      setErrorMsg("Symbol is required");
      symbolInputRef.current?.focus();
      return;
    }

    if (!parsedPnl.ok) {
      setErrorMsg(parsedPnl.error || "Please enter a valid P&L amount (e.g. +250 or -80)");
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<Trade, "id" | "user_id"> & { id?: string } = {
        id: initialTrade?.id,
        trade_date: tradeDate,
        symbol: cleanSymbol,
        pnl: parsedPnl.value,
        currency,
        direction: direction || null,
        market: market || null,
        entry_price: entryPrice ? parseFloat(entryPrice) : null,
        exit_price: exitPrice ? parseFloat(exitPrice) : null,
        quantity: quantity ? parseFloat(quantity) : null,
        multiplier: multiplier ? parseFloat(multiplier) : 1,
        fees: fees ? parseFloat(fees) : 0,
        risk_amount: riskAmount ? parseFloat(riskAmount) : null,
        r_multiple: rMultipleInput ? parseFloat(rMultipleInput) : null,
        setup_tags: selectedSetupTags,
        mistake_tags: selectedMistakeTags,
        followed_plan: (followedPlan as "yes" | "partly" | "no") || null,
        analysis_id: analysisId || null,
        note: note.trim() || null,
      };

      await onSaveTrade(payload);

      // Fast multi-trade entry: reset fields but keep the date
      if (!initialTrade) {
        setSymbol("");
        setPnlInput("");
        setNote("");
        setEntryPrice("");
        setExitPrice("");
        setQuantity("");
        setRMultipleInput("");
        setSelectedSetupTags([]);
        setSelectedMistakeTags([]);
        symbolInputRef.current?.focus();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save trade");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-sm font-bold text-[var(--text-0)] flex items-center gap-2">
          <span>{initialTrade ? "✏️" : "⚡"}</span>
          <span>{initialTrade ? "Edit Trade" : "Add Trade"}</span>
        </h3>
        {initialTrade && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-[var(--text-2)] hover:text-[var(--text-0)]"
          >
            Cancel
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-[var(--bear)]/10 border border-[var(--bear)]/30 text-xs text-[var(--bear)]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Row: Date, Symbol, P&L */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Day Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
              Date
            </label>
            <Input
              type="date"
              value={tradeDate}
              onChange={(e) => setTradeDate(e.target.value)}
              required
              className="text-xs h-9 font-mono"
            />
          </div>

          {/* Symbol with Autocomplete list */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
              Symbol
            </label>
            <Input
              ref={symbolInputRef}
              type="text"
              list="previous-symbols"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. NIFTY, AAPL"
              required
              className="text-xs h-9 font-mono uppercase"
            />
            {previousSymbols.length > 0 && (
              <datalist id="previous-symbols">
                {previousSymbols.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            )}
          </div>

          {/* Profit / Loss with Live Indicator */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
              <span className="font-bold text-[var(--text-2)]">Profit / Loss</span>
              {isPnlValid && (
                <span
                  className={`font-bold ${
                    pnlVal > 0
                      ? "text-[var(--candle)]"
                      : pnlVal < 0
                      ? "text-[var(--bear)]"
                      : "text-[var(--text-2)]"
                  }`}
                >
                  {pnlVal > 0 ? "▲ Win" : pnlVal < 0 ? "▼ Loss" : "BE"}
                </span>
              )}
            </div>
            <Input
              type="text"
              value={pnlInput}
              onChange={(e) => setPnlInput(e.target.value)}
              placeholder="+250 or -80"
              required
              className={`text-xs h-9 font-mono ${
                isPnlValid && pnlVal > 0
                  ? "border-[var(--candle)]/50 focus:border-[var(--candle)]"
                  : isPnlValid && pnlVal < 0
                  ? "border-[var(--bear)]/50 focus:border-[var(--bear)]"
                  : ""
              }`}
            />
          </div>
        </div>

        {/* Note input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
            Quick Note / Setup Observation
          </label>
          <Input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. 15m pullback held 20 EMA with expanding volume"
            className="text-xs h-9"
          />
        </div>

        {/* Toggle More Details Accordion */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--candle)] hover:underline font-medium cursor-pointer"
          >
            <span>{showDetails ? "▲ Hide execution details" : "▼ More execution details (Fills, R, Tags)"}</span>
          </button>
        </div>

        {/* Detailed Fields (Fills, Risk, Tags) */}
        {showDetails && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-2)]/60 border border-[var(--line)] space-y-4 pt-3">
            {/* Direction and Market */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-[var(--text-2)] uppercase">
                  Direction
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection("long")}
                    className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                      direction === "long"
                        ? "bg-[var(--candle)]/20 text-[var(--candle)] border border-[var(--candle)]/50"
                        : "bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)]"
                    }`}
                  >
                    ▲ Long
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("short")}
                    className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                      direction === "short"
                        ? "bg-[var(--bear)]/20 text-[var(--bear)] border border-[var(--bear)]/50"
                        : "bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)]"
                    }`}
                  >
                    ▼ Short
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-[var(--text-2)] uppercase">
                  Market Pack
                </label>
                <select
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  className="w-full text-xs rounded-md bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] px-2.5 py-1.5 focus:border-[var(--candle)] focus:outline-none"
                >
                  {MARKET_PACK_LIST.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.icon} {m.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fills: Entry, Exit, Quantity, Multiplier, Fees */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-2)]">Entry Price</label>
                <Input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-2)]">Exit Price</label>
                <Input
                  type="number"
                  step="any"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="0.00"
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-2)]">Quantity</label>
                <Input
                  type="number"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-2)]">Multiplier</label>
                <Input
                  type="number"
                  step="any"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  placeholder="1"
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-2)]">Fees</label>
                <Input
                  type="number"
                  step="any"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  placeholder="0.00"
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            {entryPrice && exitPrice && quantity && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCalculatePnl}
                  className="text-[11px] font-mono text-[var(--candle)] hover:underline cursor-pointer"
                >
                  Calculate P&L from Fills →
                </button>
              </div>
            )}

            {/* Risk and R-Multiple */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-2)]">Planned Risk ($)</label>
                <Input
                  type="number"
                  step="any"
                  value={riskAmount}
                  onChange={(e) => setRiskAmount(e.target.value)}
                  placeholder="e.g. 150"
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--text-2)]">R-Multiple</label>
                <Input
                  type="number"
                  step="0.01"
                  value={rMultipleInput}
                  onChange={(e) => setRMultipleInput(e.target.value)}
                  placeholder="e.g. 2.25"
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            {/* Plan Adherence */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-mono font-bold text-[var(--text-2)] uppercase">
                Did you follow your trade plan?
              </label>
              <div className="flex gap-2">
                {[
                  { id: "yes", label: "Yes ✓" },
                  { id: "partly", label: "Partly ~" },
                  { id: "no", label: "No ✕" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFollowedPlan(opt.id as "yes" | "partly" | "no")}
                    className={`flex-1 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      followedPlan === opt.id
                        ? "bg-[var(--bg-3)] border border-[var(--candle)] text-[var(--candle)] font-bold"
                        : "bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-2)] hover:text-[var(--text-0)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Setup Tags */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-mono font-bold text-[var(--text-2)] uppercase">
                Setup Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SETUP_TAGS.map((tag) => {
                  const active = selectedSetupTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSetupTag(tag)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        active
                          ? "bg-[var(--candle)]/20 text-[var(--candle)] border border-[var(--candle)]/40"
                          : "bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)] hover:text-[var(--text-0)]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mistake Tags */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-mono font-bold text-[var(--bear)] uppercase">
                Mistake Tags (Honest Self-Review)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MISTAKE_TAGS.map((tag) => {
                  const active = selectedMistakeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleMistakeTag(tag)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        active
                          ? "bg-[var(--bear)]/20 text-[var(--bear)] border border-[var(--bear)]/40"
                          : "bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)] hover:text-[var(--text-0)]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary-gradient"
            disabled={saving}
            className="w-full text-xs font-semibold h-10 shadow-sm"
          >
            {saving ? "Saving trade..." : initialTrade ? "Update Trade" : "Save Trade (Enter)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
