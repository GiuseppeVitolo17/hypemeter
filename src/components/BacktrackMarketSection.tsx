"use client";

import { useState } from "react";
import HypeBacktrackingChart from "@/components/HypeBacktrackingChart";
import { formatGrowthPct, formatUsd } from "@/lib/marketFormat";
import type { MarketHighlightKey, MarketYearlyOverlay } from "@/lib/marketBacktrack";
import { YAHOO_QUOTE_BTC, YAHOO_QUOTE_NTDY, YAHOO_QUOTE_SP500 } from "@/lib/yahooQuotes";

type YearScore = { year: number; score: number };
type YearEventSignal = { year: number; label: string; intensity: number };

type MarketSnap = {
  sp500: number | null;
  bitcoin: number | null;
  nintendo: number | null;
  nintendoPreviousClose: number | null;
  sp500GrowthPct: number | null;
  bitcoinGrowthPct: number | null;
  nintendoGrowthPct: number | null;
  updatedAt: string | null;
};

type Props = {
  history: YearScore[];
  events: YearEventSignal[];
  marketOverlay: MarketYearlyOverlay;
  market: MarketSnap;
  /** First 7 chars of VERCEL_GIT_COMMIT_SHA — confirms which build is live. */
  deploymentSha?: string | null;
  /** Matches `export const revalidate` on the homepage (seconds). */
  pageRevalidateSeconds?: number;
};

export default function BacktrackMarketSection({
  history,
  events,
  marketOverlay,
  market,
  deploymentSha,
  pageRevalidateSeconds = 300,
}: Props) {
  const [highlight, setHighlight] = useState<MarketHighlightKey | null>(null);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 hover-lift">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h3 className="min-w-0 shrink text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
          Hype Backtracking (2005 → now)
        </h3>
        <p className="shrink-0 text-xs text-slate-400">
          First year: {history[0]?.year} • Latest: {history[history.length - 1]?.year}
        </p>
      </div>
      <div className="mt-4 grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)]">
        <div className="min-w-0 self-start">
          <HypeBacktrackingChart
            history={history}
            events={events}
            marketOverlay={marketOverlay}
            highlightSeries={highlight}
          />
        </div>
        <aside className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-4 hover-lift">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Market Sidecar</p>

          <div className="mt-4 space-y-3">
            <a
              href={YAHOO_QUOTE_SP500}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-[7.25rem] flex-col justify-between rounded-xl border bg-slate-900 p-3 transition-colors hover:bg-slate-900/90 ${
                highlight === "sp500"
                  ? "border-emerald-400/70 ring-1 ring-emerald-400/30"
                  : "border-white/10 hover:border-emerald-400/45"
              }`}
              onMouseEnter={() => setHighlight("sp500")}
              onMouseLeave={() => setHighlight(null)}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">S&P 500</p>
              <p className="text-2xl font-bold tabular-nums leading-none text-emerald-400">
                {formatGrowthPct(market.sp500GrowthPct)}
              </p>
              <p className="line-clamp-2 min-h-[2.5rem] text-[11px] leading-snug text-slate-500">
                level: {formatUsd(market.sp500)}
              </p>
            </a>
            <a
              href={YAHOO_QUOTE_BTC}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-[7.25rem] flex-col justify-between rounded-xl border bg-slate-900 p-3 transition-colors hover:bg-slate-900/90 ${
                highlight === "btc"
                  ? "border-amber-400/70 ring-1 ring-amber-400/30"
                  : "border-white/10 hover:border-amber-400/45"
              }`}
              onMouseEnter={() => setHighlight("btc")}
              onMouseLeave={() => setHighlight(null)}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Bitcoin</p>
              <p className="text-2xl font-bold tabular-nums leading-none text-amber-300">
                {formatGrowthPct(market.bitcoinGrowthPct)}
              </p>
              <p className="line-clamp-2 min-h-[2.5rem] text-[11px] leading-snug text-slate-500">
                level: {formatUsd(market.bitcoin)}
              </p>
            </a>
            <a
              href={YAHOO_QUOTE_NTDY}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-[7.25rem] flex-col justify-between rounded-xl border bg-slate-900 p-3 transition-colors hover:bg-slate-900/90 ${
                highlight === "nintendo"
                  ? "border-rose-400/70 ring-1 ring-rose-400/30"
                  : "border-white/10 hover:border-rose-400/45"
              }`}
              onMouseEnter={() => setHighlight("nintendo")}
              onMouseLeave={() => setHighlight(null)}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Nintendo (NTDOY)</p>
              <p className="text-2xl font-bold tabular-nums leading-none text-rose-400">
                {formatGrowthPct(market.nintendoGrowthPct)}
              </p>
              <p className="line-clamp-2 min-h-[2.5rem] text-[11px] leading-snug text-slate-500">
                level: {formatUsd(market.nintendo)}
                {market.nintendoPreviousClose !== null ? (
                  <span className="text-slate-500">
                    {" "}
                    · prev {formatUsd(market.nintendoPreviousClose)}
                  </span>
                ) : null}
              </p>
            </a>
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            S&amp;P 500 and Bitcoin levels/% vs prior close follow{" "}
            <a
              href="https://finance.yahoo.com/quote/%5EGSPC/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/90 underline-offset-2 hover:underline"
            >
              Yahoo ^GSPC
            </a>{" "}
            and{" "}
            <a
              href="https://finance.yahoo.com/quote/BTC-USD/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/90 underline-offset-2 hover:underline"
            >
              BTC-USD
            </a>{" "}
            (same API as the site; can be delayed). Nintendo matches{" "}
            <a
              href="https://finance.yahoo.com/quote/NTDOY/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/90 underline-offset-2 hover:underline"
            >
              Yahoo NTDOY
            </a>{" "}
            (OTC can be delayed). Chart overlay is monthly; if Yahoo fails, price fallbacks: Stooq (indices) /
            CoinGecko (BTC)—% may be omitted for BTC without Yahoo.
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Last market update: {market.updatedAt ?? "Unavailable"}
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-600">
            Build {deploymentSha ?? "local"} · page cache ~{Math.round(pageRevalidateSeconds / 60)}m
          </p>
        </aside>
      </div>
    </section>
  );
}
