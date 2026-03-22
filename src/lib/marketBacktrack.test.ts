import { describe, expect, it } from "vitest";
import { alignYearSeries, normalizeTo100 } from "@/lib/marketBacktrack";

describe("marketBacktrack", () => {
  it("alignYearSeries returns null when no Yahoo data (avoid fake flat → normalize collapse)", () => {
    const years = [2020, 2021, 2022];
    const empty = new Map<number, number>();
    expect(alignYearSeries(years, empty)).toBeNull();
  });

  it("alignYearSeries forward-fills from first known close", () => {
    const years = [2020, 2021, 2022];
    const m = new Map<number, number>([
      [2020, 100],
      [2021, 110],
      [2022, 120],
    ]);
    expect(alignYearSeries(years, m)).toEqual([100, 110, 120]);
  });

  it("normalizeTo100 returns empty when there is no variance", () => {
    expect(normalizeTo100([5, 5, 5])).toEqual([]);
  });

  it("normalizeTo100 maps min→0 and max→100", () => {
    expect(normalizeTo100([10, 20])).toEqual([0, 100]);
  });
});
