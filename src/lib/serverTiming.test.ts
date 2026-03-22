import { describe, expect, it } from "vitest";
import { timedAsync } from "./serverTiming";

describe("serverTiming", () => {
  it("timedAsync returns the async result", async () => {
    const result = await timedAsync("test:noop", async () => 42);
    expect(result).toBe(42);
  });

  it("timedAsync propagates rejection", async () => {
    await expect(
      timedAsync("test:throw", async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });
});
