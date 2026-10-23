"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { brand } from "@/config/brand";

export function FaqSection() {
  const faqs = [
    {
      id: "faq-1",
      question: "Is this financial advice or a trade signal service?",
      answer:
        "No. This platform provides educational technical analysis only. It is an algorithmic second pair of eyes that reads the chart structure, key levels, and scenarios on the image you upload. We never advise on buying or selling any security, and you are solely responsible for your own trading decisions.",
    },
    {
      id: "faq-2",
      question: "Which markets and instruments are supported?",
      answer:
        "We support global equities (US NYSE, NASDAQ, ETFs), Forex currency pairs, Crypto (spot & perps), Gold and major commodities, Global indices (S&P, Nasdaq, DAX), and Indian markets including NIFTY, BANKNIFTY, FINNIFTY, SENSEX, NSE/BSE stocks, and options.",
    },
    {
      id: "faq-3",
      question: "Does it support option chains and payoff diagrams?",
      answer:
        "Yes! Under the Indian Options market pack (and US options coming next), you can drop a screenshot of an option chain or payoff graph. The model identifies Max Pain, Put-Call Ratio (PCR), and major Call/Put Open Interest concentration zones.",
    },
    {
      id: "faq-4",
      question: "What happens if my chart screenshot is blurry or cropped?",
      answer:
        "Our Data-Quality Gate inspects the image before performing analysis. If the price scale, ticker, or candles cannot be determined reliably, we inform you and ask for a cleaner screenshot rather than hallucinating fake levels. Your credit is refunded automatically.",
    },
    {
      id: "faq-5",
      question: "How accurate is the analysis? Can it be wrong?",
      answer:
        "Yes, it can be wrong — technical analysis inherently deals with probabilities and market uncertainty. We deliberately label our scores as 'Model Confidence' (the AI's self-assessed certainty of the chart pattern) rather than fake statistical win rates. Always manage your own position sizing.",
    },
    {
      id: "faq-6",
      question: "What should I upload for the best results?",
      answer:
        "Upload a clean chart screenshot showing: 1) Ticker symbol, 2) Timeframe, 3) Price scale on the right axis, and 4) At least 80 to 100 historical candles. You can also upload up to 3 charts at once (e.g. Daily + 1-Hour + 15-Minute) for multi-timeframe confluence.",
    },
    {
      id: "faq-7",
      question: "What is your refund policy?",
      answer:
        "We offer a 7-day refund period for monthly subscriptions if you have used fewer than 5 analyses. For lifetime plans, refunds are assessed on a case-by-case basis. If an analysis fails due to a system error, your credit is restored immediately.",
    },
    {
      id: "faq-8",
      question: "Can I cancel my monthly subscription anytime?",
      answer:
        "Yes, you can cancel your subscription with a single click inside your account settings. You will retain full access until the end of your current billing cycle with no cancellation penalties.",
    },
    {
      id: "faq-9",
      question: "Do you guarantee profits or winning trades?",
      answer:
        "Absolutely not. No legitimate trading tool can guarantee profits, and anyone making such claims is deceptive. Trading financial instruments carries substantial risk of loss, including loss of principal. Past chart patterns never guarantee future results.",
    },
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="neutral" size="sm" className="mb-3">
            Frequently Asked Questions
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            Have questions about {brand.name}? Here are clear, straightforward answers about how the tool works and our strict risk management philosophy.
          </p>
        </div>

        <Accordion type="single" defaultValue="faq-1" className="bg-[var(--bg-2)] rounded-2xl border border-[var(--line)] p-4 sm:p-6">
          {faqs.map((f) => (
            <AccordionItem key={f.id} id={f.id}>
              <AccordionTrigger className="text-sm sm:text-base font-semibold text-[var(--text-0)] hover:text-[var(--candle)]">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-[var(--text-1)] leading-relaxed pt-2">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
