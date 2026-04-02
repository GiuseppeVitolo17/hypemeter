import { describe, expect, it } from "vitest";
import { formatSignedChange } from "@/lib/marketFormat";

describe("marketFormat.formatSignedChange", () => {
  it("formats JPY delta with sign and no decimals", () => {
    expect(formatSignedChange(106.2, "JPY")).toBe("+106 JPY");
    expect(formatSignedChange(-243.7, "JPY")).toBe("-244 JPY");
  });

  it("formats USD delta with currency symbol", () => {
    expect(formatSignedChange(0.52, "USD")).toBe("+$0.52");
    expect(formatSignedChange(-1.25, "USD")).toBe("-$1.25");
  });

  it("returns N/A for undefined or non-finite payloads", () => {
    expect(formatSignedChange(undefined, "JPY")).toBe("N/A");
    expect(formatSignedChange(Number.NaN, "USD")).toBe("N/A");
    expect(formatSignedChange(Infinity, "USD")).toBe("N/A");
    expect(formatSignedChange(12, undefined)).toBe("N/A");
  });
});
