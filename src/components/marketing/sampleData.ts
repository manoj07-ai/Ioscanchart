export interface SamplePlan {
  id: string;
  ticker: string;
  name: string;
  market: string;
  timeframe: string;
  currentPrice: number;
  currency: string;
  marketPack: string;
  dataQuality: {
    tickerVisible: boolean;
    timeframeVisible: boolean;
    priceScaleReadable: boolean;
    indicators: string[];
    note: string;
  };
  structure: {
    trend: "Bullish" | "Bearish" | "Ranging";
    phase: string;
    summary: string;
  };
  levels: Array<{
    type: "support" | "resistance" | "zone";
    price: number;
    strength: 1 | 2 | 3;
    reason: string;
  }>;
  scenarios: {
    bull: {
      bias: "bullish";
      trigger: string;
      path: string;
      targets: number[];
      modelConfidence: number;
    };
    bear: {
      bias: "bearish";
      trigger: string;
      path: string;
      targets: number[];
      modelConfidence: number;
    };
  };
  plan: {
    direction: "Long" | "Short" | "Wait for Confirmation";
    bias: "bullish" | "bearish" | "neutral";
    entry: string;
    stop: number;
    targets: number[];
    rr: number;
    invalidation: string;
    optionsView?: {
      maxPain: number;
      pcr: number;
      callResistance: number;
      putSupport: number;
      expiryInsight: string;
    };
  };
}

export const SAMPLE_PLANS: Record<string, SamplePlan> = {
  nifty: {
    id: "nifty",
    ticker: "NIFTY 50",
    name: "Nifty 50 Index (NSE)",
    market: "India Indices",
    timeframe: "1D / 1H",
    currentPrice: 24395.5,
    currency: "₹",
    marketPack: "india-indices",
    dataQuality: {
      tickerVisible: true,
      timeframeVisible: true,
      priceScaleReadable: true,
      indicators: ["20 EMA", "50 EMA", "RSI (14)", "Volume Profile"],
      note: "Clear high-resolution daily candle sequence with right-axis points.",
    },
    structure: {
      trend: "Bullish",
      phase: "Ascending Continuation Shelf",
      summary: "Higher swing lows established after testing the 24,180 volume shelf. Daily close holds above 20 EMA with bullish compression.",
    },
    levels: [
      {
        type: "resistance",
        price: 24520,
        strength: 3,
        reason: "Prior swing rejection cluster and upper boundary of weekly value area.",
      },
      {
        type: "support",
        price: 24260,
        strength: 3,
        reason: "Confluence of 20 EMA, prior breakout resistance turned support, and point of control.",
      },
      {
        type: "zone",
        price: 24150,
        strength: 2,
        reason: "Institutional liquidity pool and lower trendline defense boundary.",
      },
    ],
    scenarios: {
      bull: {
        bias: "bullish",
        trigger: "Sustained 15m candle close above 24,420 with expanding volume.",
        path: "Consolidation push towards 24,520; clean breakout opens 24,680 expansion.",
        targets: [24520, 24680],
        modelConfidence: 78,
      },
      bear: {
        bias: "bearish",
        trigger: "Break and close below 24,250 during the morning session.",
        path: "Liquidity cascade down to 24,150 demand zone before reaction.",
        targets: [24250, 24150],
        modelConfidence: 48,
      },
    },
    plan: {
      direction: "Long",
      bias: "bullish",
      entry: "24,320 – 24,360 pullback zone",
      stop: 24230,
      targets: [24520, 24680],
      rr: 2.8,
      invalidation: "Hourly close below 24,230 invalidates the long structure immediately.",
      optionsView: {
        maxPain: 24400,
        pcr: 1.14,
        callResistance: 24500,
        putSupport: 24200,
        expiryInsight: "High Call OI at 24,500 acts as ceiling. PCR > 1 indicates healthy put writing support.",
      },
    },
  },

  aapl: {
    id: "aapl",
    ticker: "AAPL",
    name: "Apple Inc. (NASDAQ)",
    market: "US Equities",
    timeframe: "4H",
    currentPrice: 228.4,
    currency: "$",
    marketPack: "us-equities",
    dataQuality: {
      tickerVisible: true,
      timeframeVisible: true,
      priceScaleReadable: true,
      indicators: ["VWAP", "MACD", "Volume"],
      note: "NASDAQ trading session chart with complete volume histogram.",
    },
    structure: {
      trend: "Bullish",
      phase: "Bull Flag Breakout",
      summary: "Bull flag consolidation above the 50-day moving average followed by volume surge upon earnings anticipation.",
    },
    levels: [
      {
        type: "resistance",
        price: 233.0,
        strength: 3,
        reason: "All-time high resistance zone and psychological round handle.",
      },
      {
        type: "support",
        price: 224.5,
        strength: 3,
        reason: "Top of flag consolidation pattern; prior supply flipped to demand.",
      },
      {
        type: "zone",
        price: 220.0,
        strength: 2,
        reason: "Anchored VWAP from quarterly low and swing defense line.",
      },
    ],
    scenarios: {
      bull: {
        bias: "bullish",
        trigger: "Hold above $226.50 on any morning retest.",
        path: "Continuation ramp towards $233.00 with momentum follow-through.",
        targets: [233.0, 238.5],
        modelConfidence: 82,
      },
      bear: {
        bias: "bearish",
        trigger: "Failure to hold $224.50 with heavy volume rejection.",
        path: "Drift back to flag low at $219.80.",
        targets: [224.5, 219.8],
        modelConfidence: 35,
      },
    },
    plan: {
      direction: "Long",
      bias: "bullish",
      entry: "$226.00 – $227.50 retest zone",
      stop: 223.8,
      targets: [233.0, 238.5],
      rr: 3.2,
      invalidation: "Daily close below $223.80 breaks flag structure.",
    },
  },

  xauusd: {
    id: "xauusd",
    ticker: "XAUUSD",
    name: "Gold Spot / US Dollar",
    market: "Commodities",
    timeframe: "1D",
    currentPrice: 2734.2,
    currency: "$",
    marketPack: "commodities",
    dataQuality: {
      tickerVisible: true,
      timeframeVisible: true,
      priceScaleReadable: true,
      indicators: ["RSI (14)", "ATR (14)", "200 SMA"],
      note: "Continuous spot price feed with clean candle wicks across key central bank sessions.",
    },
    structure: {
      trend: "Bullish",
      phase: "Range Expansion at Highs",
      summary: "Macro uptrend intact. Consolidating tight range above $2,700 psychological benchmark with declining volatility compression.",
    },
    levels: [
      {
        type: "resistance",
        price: 2758.0,
        strength: 3,
        reason: "Record peak wick high and multi-day sell limit wall.",
      },
      {
        type: "support",
        price: 2708.0,
        strength: 3,
        reason: "Strong daily demand base and London session liquidity floor.",
      },
      {
        type: "zone",
        price: 2685.0,
        strength: 2,
        reason: "Ascending weekly trendline and previous month's high.",
      },
    ],
    scenarios: {
      bull: {
        bias: "bullish",
        trigger: "Clear 4H breakout above $2,740 with sustained momentum.",
        path: "Direct advance to retest $2,758 followed by blue-sky expansion to $2,790.",
        targets: [2758.0, 2790.0],
        modelConfidence: 74,
      },
      bear: {
        bias: "bearish",
        trigger: "Rejection at $2,740 with failure to hold $2,720.",
        path: "Retest of key $2,708 support shelf.",
        targets: [2720.0, 2708.0],
        modelConfidence: 45,
      },
    },
    plan: {
      direction: "Long",
      bias: "bullish",
      entry: "$2,718 – $2,725 support retest",
      stop: 2703.0,
      targets: [2758.0, 2790.0],
      rr: 2.7,
      invalidation: "4-hour close below $2,703 signals deeper correction to $2,685.",
    },
  },
};
