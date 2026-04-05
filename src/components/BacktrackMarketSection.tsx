"use client";

import { useMemo, useState } from "react";
import HypeBacktrackingChart from "@/components/HypeBacktrackingChart";
import { MarketSidecarAside } from "@/components/MarketSidecarAside";
import { useMatchMedia } from "@/hooks/useMatchMedia";
import { sliceBacktrackView } from "@/lib/sliceBacktrackView";
import type { MarketHighlightKey, MarketYearlyOverlay } from "@/lib/marketBacktrack";

type YearScore = { year: number; score: number };
type YearEventSignal = { year: number; label: string; intensity: number };
type ChartPoint = YearScore & { month?: number; periodLabel?: string; key?: string };

type MarketSnap = {
  sp500: number | null;
  bitcoin: number | null;
  nintendo: number | null;
  nintendoPreviousClose: number | null;
  nintendoChangeAbs: number | null;
  nintendoChangeCurrency: "JPY" | "USD" | null;
  sp500GrowthPct: number | null;
  bitcoinGrowthPct: number | null;
  nintendoGrowthPct: number | null;
  updatedAt: string | null;
  nintendoSource: "adr" | "tokyo" | null;
  sp500Source: "stooq" | "stooq-daily" | "yahoo" | null;
  bitcoinSource: "stooq" | "stooq-daily" | "coingecko" | "binance" | null;
};

type Props = {
  history: YearScore[];
  events: YearEventSignal[];
  marketOverlay: MarketYearlyOverlay;
  market: MarketSnap;
  /** First 7 chars of VERCEL_GIT_COMMIT_SHA — confirms which build is live. */
  deploymentSha?: string | null;
};

/** Below `md` the chart uses the last N years so the x-axis isn’t cramped on phones. */
const MOBILE_CHART_LAST_N_YEARS = 2;
const MOBILE_CHART_MQ = "(max-width: 767px)";

function monthLabel(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/**
 * Build monthly points from yearly close-style points.
 * For each year Y and month M, interpolate from (Y-1 close) -> (Y close), so 24 months remain historical.
 */
function expandToMonthlyWindow(
  history: YearScore[],
  marketOverlay: MarketYearlyOverlay,
  events: YearEventSignal[],
  lastNYears: number,
): { history: ChartPoint[]; marketOverlay: MarketYearlyOverlay; events: YearEventSignal[] } {
  if (history.length === 0) return { history: [], marketOverlay, events: [] };
  const lastYear = history[history.length - 1]?.year ?? new Date().getFullYear();
  const startYear = lastYear - lastNYears + 1;
  const idxByYear = new Map(history.map((h, i) => [h.year, i]));
  const scoreByYear = new Map(history.map((h) => [h.year, h.score]));

  const buildMonthlySeries = (yearlyValues: number[], labels?: string[]): number[] => {
    if (labels && labels.length > 0) {
      // For market overlays prefer server-side historical monthly sampling.
      return yearlyValues.slice(0, labels.length);
    }
    const out: number[] = [];
    for (let y = startYear; y <= lastYear; y += 1) {
      const idx = idxByYear.get(y);
      if (idx === undefined) continue;
      const curr = yearlyValues[idx];
      const prevIdx = idxByYear.get(y - 1);
      const prev = prevIdx !== undefined ? yearlyValues[prevIdx] : curr;
      for (let m = 1; m <= 12; m += 1) {
        const t = m / 12;
        out.push(prev + (curr - prev) * t);
      }
    }
    return out;
  };

  const monthlyLabels = marketOverlay.monthly?.labels ?? [];
  const monthlyHistory: ChartPoint[] =
    monthlyLabels.length > 0
      ? monthlyLabels.map((label) => {
          const y = Number(label.slice(0, 4));
          const m = Number(label.slice(5, 7));
          const curr = scoreByYear.get(y) ?? 50;
          const prev = scoreByYear.get(y - 1) ?? curr;
          const t = m / 12;
          const score = Math.round(prev + (curr - prev) * t);
          return { year: y, month: m, score, periodLabel: label, key: label };
        })
      : (() => {
          const out: ChartPoint[] = [];
          for (let y = startYear; y <= lastYear; y += 1) {
            const curr = scoreByYear.get(y);
            if (curr === undefined) continue;
            const prev = scoreByYear.get(y - 1) ?? curr;
            for (let m = 1; m <= 12; m += 1) {
              const t = m / 12;
              const score = Math.round(prev + (curr - prev) * t);
              out.push({
                year: y,
                month: m,
                score,
                periodLabel: monthLabel(y, m),
                key: `${y}-${String(m).padStart(2, "0")}`,
              });
            }
          }
          return out;
        })();

  const monthlyOverlay: MarketYearlyOverlay = {
    sp500: marketOverlay.monthly?.sp500 ?? buildMonthlySeries(marketOverlay.sp500),
    btc: marketOverlay.monthly?.btc ?? buildMonthlySeries(marketOverlay.btc),
    nintendo: marketOverlay.monthly?.nintendo ?? buildMonthlySeries(marketOverlay.nintendo),
    inflationYoY: marketOverlay.monthly?.inflationYoY ?? buildMonthlySeries(marketOverlay.inflationYoY),
    inflation: marketOverlay.monthly?.inflation ?? buildMonthlySeries(marketOverlay.inflation),
    monthly: undefined,
  };

  const visibleYears = new Set<number>();
  for (let y = startYear; y <= lastYear; y += 1) visibleYears.add(y);
  return {
    history: monthlyHistory,
    marketOverlay: monthlyOverlay,
    events: events.filter((e) => visibleYears.has(e.year)),
  };
}

export default function BacktrackMarketSection({
  history,
  events,
  marketOverlay,
  market,
  deploymentSha,
}: Props) {
  const [highlight, setHighlight] = useState<MarketHighlightKey | null>(null);
  const isMobileChart = useMatchMedia(MOBILE_CHART_MQ);
  const { history: chartHistory, marketOverlay: chartOverlay, events: chartEvents } = useMemo(() => {
    if (!isMobileChart) return { history, marketOverlay, events };
    const sliced = sliceBacktrackView(history, marketOverlay, events, MOBILE_CHART_LAST_N_YEARS);
    return expandToMonthlyWindow(
      sliced.history,
      sliced.marketOverlay,
      sliced.events,
      MOBILE_CHART_LAST_N_YEARS,
    );
  }, [isMobileChart, history, marketOverlay, events]);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 hover-lift">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h3 className="min-w-0 shrink text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
          Hype Backtracking (2005 → now)
        </h3>
        <p className="shrink-0 text-right text-xs leading-snug text-slate-400 md:text-left">
          {isMobileChart && history.length > MOBILE_CHART_LAST_N_YEARS ? (
            <>
              {chartHistory[0]?.year}–{chartHistory[chartHistory.length - 1]?.year}
              <span className="text-slate-500"> · last {MOBILE_CHART_LAST_N_YEARS} yrs (monthly)</span>
              <span className="mt-0.5 block text-[10px] text-slate-600 md:hidden">
                Full {history[0]?.year}–{history[history.length - 1]?.year} on wider screens
              </span>
            </>
          ) : (
            <>
              First year: {history[0]?.year} • Latest: {history[history.length - 1]?.year}
            </>
          )}
        </p>
      </div>
      <div className="mt-4 grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,16rem)] lg:items-stretch">
        <div className="min-w-0 self-stretch lg:min-h-0">
          <HypeBacktrackingChart
            history={chartHistory}
            events={chartEvents}
            marketOverlay={chartOverlay}
            highlightSeries={highlight}
          />
        </div>
        <MarketSidecarAside
          initialMarket={market}
          marketOverlay={marketOverlay}
          history={history}
          deploymentSha={deploymentSha}
          highlight={highlight}
          setHighlight={setHighlight}
        />
      </div>
    </section>
  );
}
