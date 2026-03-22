import { NextRequest, NextResponse } from "next/server";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

const MAX_YEARS = 5;

// Small XML helper to extract a single tag value from an <item> block.
function readTag(itemXml: string, tag: string) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = itemXml.match(regex);
  return match ? match[1].trim() : "";
}

// Decode RSS entities and strip remaining HTML tags from feed content.
function decodeHtml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "")
    .trim();
}

// Parse feed XML into typed news entries for scoring.
function parseNews(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match = itemRegex.exec(xml);
  while (match) {
    const block = match[1];
    const title = decodeHtml(readTag(block, "title"));
    const link = decodeHtml(readTag(block, "link"));
    const pubDate = decodeHtml(readTag(block, "pubDate"));
    const source = decodeHtml(readTag(block, "source")) || "Unknown";
    if (title && link) {
      items.push({ title, link, pubDate, source });
    }
    match = itemRegex.exec(xml);
  }
  return items;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Ensure Google query date syntax uses UTC yyyy-mm-dd.
function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

// Validate date input and enforce rolling 5-year range.
function validateDate(dateStr: string) {
  const parsed = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return { ok: false as const, error: "Invalid date format" };
  }

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const min = new Date(today);
  min.setUTCFullYear(min.getUTCFullYear() - MAX_YEARS);

  if (parsed > today) return { ok: false as const, error: "Date cannot be in the future" };
  if (parsed < min) return { ok: false as const, error: "Date older than 5-year window" };
  return { ok: true as const, parsed };
}

// Convert headline language into simple day-level market/sentiment metrics.
function computeStats(items: NewsItem[]) {
  const text = items.map((item) => item.title.toLowerCase()).join(" | ");
  const eventHits = ["reveal", "release", "presents", "prerelease", "expansion"].reduce(
    (sum, token) => sum + (text.includes(token) ? 1 : 0),
    0,
  );
  const pressureHits = ["sold out", "preorder", "queue", "allocation", "reprint"].reduce(
    (sum, token) => sum + (text.includes(token) ? 1 : 0),
    0,
  );
  const positiveHits = ["hype", "surge", "launch", "strong", "record", "win"].reduce(
    (sum, token) => sum + (text.includes(token) ? 1 : 0),
    0,
  );
  const negativeHits = ["delay", "drop", "crash", "backlash", "scam", "lawsuit"].reduce(
    (sum, token) => sum + (text.includes(token) ? 1 : 0),
    0,
  );

  const headlineCount = items.length;
  const uniqueSources = new Set(items.map((item) => item.source)).size;
  const sentiment = clamp(
    Math.round(50 + (positiveHits - negativeHits) * 8 + Math.log10(headlineCount + 1) * 12),
    0,
    100,
  );

  // Normalize each signal so score does not explode with raw headline count.
  const headlineIntensity = clamp(
    Math.round((Math.log10(headlineCount + 1) / Math.log10(26)) * 100),
    0,
    100,
  );
  const sourceDiversity = clamp(Math.round((uniqueSources / 12) * 100), 0, 100);
  const eventIntensity = clamp(eventHits * 24, 0, 100);
  const pressureIntensity = clamp(pressureHits * 22, 0, 100);

  // Weighted blend tuned to keep "normal days" in a realistic mid range.
  const dayScore = clamp(
    Math.round(
      headlineIntensity * 0.35 +
        sourceDiversity * 0.2 +
        eventIntensity * 0.2 +
        pressureIntensity * 0.15 +
        sentiment * 0.1,
    ),
    0,
    100,
  );

  return {
    headlineCount,
    uniqueSources,
    eventHits,
    pressureHits,
    sentiment,
    dayScore,
  };
}

export async function GET(request: NextRequest) {
  // Query param driving stats computation for a specific calendar day.
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing date query param" }, { status: 400 });
  }

  const valid = validateDate(date);
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 });
  }

  const start = valid.parsed;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const query = encodeURIComponent(
    `("Pokemon" OR "Pokémon" OR "Pokemon TCG") after:${toIsoDate(start)} before:${toIsoDate(end)}`,
  );
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

  try {
    // Force fresh fetch for selected day so user sees runtime-computed data.
    const response = await fetch(url, {
      next: { revalidate: 0 },
      headers: { "user-agent": "Mozilla/5.0 hypemeter-runtime" },
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Upstream feed unavailable" }, { status: 502 });
    }

    const xml = await response.text();
    const allItems = parseNews(xml).filter((item) => /(pokemon|pokémon)/i.test(item.title));
    const items = allItems.slice(0, 20);
    const stats = computeStats(items);
    return NextResponse.json({
      date,
      stats,
      headlines: items.slice(0, 8),
    });
  } catch {
    return NextResponse.json({ error: "Failed to compute daily stats" }, { status: 500 });
  }
}

