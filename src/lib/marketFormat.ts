export function formatUsd(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatGrowthPct(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "N/A";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/** Tailwind classes for % change — negatives must not use “up” green. */
export function growthPctColorClass(
  value: number | null,
  positiveHue: "emerald" | "amber" | "rose" = "emerald",
): string {
  if (value === null || Number.isNaN(value)) return "text-slate-400";
  if (value < 0) return "text-rose-400";
  if (value > 0) {
    if (positiveHue === "amber") return "text-amber-300";
    if (positiveHue === "rose") return "text-rose-300";
    return "text-emerald-400";
  }
  return "text-slate-300";
}
