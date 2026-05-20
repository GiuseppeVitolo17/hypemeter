import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetStaticDataDbForTests } from "@/lib/staticDataDb";

vi.mock("server-only", () => ({}));

function freshDbDir() {
  return path.join(os.tmpdir(), `hypemeter-home-bootstrap-${Date.now()}-${Math.random().toString(36).slice(2)}`);
}

function rssResponse() {
  const now = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss><channel>
  <item>
    <title>Pokemon TCG Pocket announces new expansion</title>
    <link>https://example.com/pokemon-tcg-pocket-expansion</link>
    <pubDate>${now}</pubDate>
    <source>Example Cards</source>
    <description>New Pokemon card expansion details.</description>
  </item>
  <item>
    <title>Pokemon Presents reveals game update</title>
    <link>https://example.com/pokemon-presents-update</link>
    <pubDate>${now}</pubDate>
    <source>Example Games</source>
    <description>Pokemon game update and event news.</description>
  </item>
  <item>
    <title>Pokemon Center restock draws collector demand</title>
    <link>https://example.com/pokemon-center-restock</link>
    <pubDate>${now}</pubDate>
    <source>Example Market</source>
    <description>Collector demand rises after restock.</description>
  </item>
</channel></rss>`;
}

afterEach(() => {
  const dir = process.env.HYPEMETER_SQLITE_DIR;
  resetStaticDataDbForTests();
  vi.restoreAllMocks();
  if (dir) fs.rmSync(dir, { recursive: true, force: true });
  delete process.env.HYPEMETER_SQLITE_DIR;
});

describe("home page article bootstrap", () => {
  it("uses bounded Google News bootstrap instead of hardcoded hub articles on cold start", async () => {
    const dir = freshDbDir();
    fs.mkdirSync(dir, { recursive: true });
    process.env.HYPEMETER_SQLITE_DIR = dir;
    resetStaticDataDbForTests();

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(rssResponse(), { status: 200, headers: { "Content-Type": "application/rss+xml" } })),
    );

    const { loadHomePageDataForTests } = await import("@/app/page");
    const payload = await loadHomePageDataForTests();

    expect(payload.topArticles.map((item) => item.title)).toContain(
      "Pokemon TCG Pocket announces new expansion",
    );
    expect(payload.topArticles.map((item) => item.title)).not.toContain("Pokemon News Hub");
    expect(payload.items.length).toBeGreaterThanOrEqual(3);
    expect(payload.liveEventSignals.length).toBeGreaterThan(0);
  });
});
