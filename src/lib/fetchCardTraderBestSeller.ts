/**
 * CardTrader Pokémon hub “Best sellers” via Jina reader (markdown/HTML varies).
 */

export type CardTraderBestSeller = {
  name: string;
  /** Empty string → UI shows placeholder */
  imageUrl: string;
  cardUrl: string;
  fromPrice: string;
};

export const CARDTRADER_POKEMON_HUB = "https://www.cardtrader.com/en/pokemon";

const JINA_PREFIX = "https://r.jina.ai/";

function dbg(...args: unknown[]) {
  if (process.env.DEBUG_CARDTRADER === "1") {
    console.log("[cardtrader]", ...args);
  }
}

function looksLikeImageUrl(u: string): boolean {
  const s = u.trim();
  if (!/^https:\/\//i.test(s)) return false;
  return /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(s) || /\/uploads\//i.test(s) || /\/images?\//i.test(s);
}

function looksLikeCardProductUrl(u: string): boolean {
  if (!/cardtrader\.com/i.test(u)) return false;
  if (/cardtrader\.com\/en\/pokemon\/?$/i.test(u)) return false;
  return /\/(cards|products|sell)\//i.test(u);
}

function buildResult(
  imageUrl: string,
  rawLabel: string,
  cardUrl: string,
  fallbackName: string,
): CardTraderBestSeller {
  const nameFromLabel = rawLabel.split(/\s+Starting from:/i)[0]?.trim() || fallbackName;
  const priceMatch = rawLabel.match(/Starting from:\s*\$([\d.]+)/i);
  return {
    name: nameFromLabel || "Featured card",
    imageUrl: imageUrl.trim(),
    cardUrl: cardUrl.trim(),
    fromPrice: priceMatch?.[1] ?? "",
  };
}

/** Extract markdown section after a “Best sellers” heading. */
export function extractBestSellersSection(text: string): string | null {
  const m = text.match(/##\s*Best\s+sellers[^\n]*\n([\s\S]*?)(?=\n##\s+|\n#\s[^\n#]|$)/i);
  if (m?.[1]?.trim()) return m[1].trim();

  const m2 = text.match(
    /(?:^|\n)#{1,3}\s*Best\s+sellers[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n##\s|$)/i,
  );
  if (m2?.[1]?.trim()) return m2[1].trim();

  const idx = text.toLowerCase().indexOf("best seller");
  if (idx >= 0) {
    const slice = text.slice(idx, idx + 12000);
    return slice;
  }
  return null;
}

/**
 * Parse Jina / page text for first best-seller card row (image + listing link).
 * Tries markdown patterns first, then HTML, then loose URL pairing.
 */
export function parseCardTraderBestSellerFromText(fullText: string): CardTraderBestSeller | null {
  const section = extractBestSellersSection(fullText) ?? fullText.slice(0, 24_000);
  dbg("section length", section.length);

  // 1) Classic: [![...](img)](card) with label between
  const mdWrapped = section.match(
    /\[!\[[^\]]*\]\((https:\/\/[^)]+)\)\s*([\s\S]*?)\]\((https:\/\/(?:www\.)?cardtrader\.com[^)]+)\)/i,
  );
  if (mdWrapped && looksLikeCardProductUrl(mdWrapped[3])) {
    dbg("match: md wrapped image+card");
    return buildResult(mdWrapped[1], mdWrapped[2], mdWrapped[3], "Best seller");
  }

  // 2) Image markdown then link on next lines
  const mdImg = section.match(/!\[[^\]]*\]\((https:\/\/[^)]+)\)/);
  const mdLink = section.match(/(https:\/\/(?:www\.)?cardtrader\.com\/[^\s\)]*\/cards\/[^\s\)]*)/i);
  if (mdImg?.[1] && mdLink?.[1] && looksLikeImageUrl(mdImg[1])) {
    dbg("match: md image + card url");
    const labelBlock = section.slice(0, Math.min(section.length, 800));
    return buildResult(mdImg[1], labelBlock, mdLink[1], "Best seller");
  }

  // 3) HTML: img src + anchor to /cards/
  const htmlImg = section.match(/<img[^>]+src=["'](https:\/\/[^"']+)["'][^>]*>/i);
  const htmlLink = section.match(
    /href=["'](https:\/\/(?:www\.)?cardtrader\.com[^"']*\/cards\/[^"']*)["']/i,
  );
  if (htmlImg?.[1] && htmlLink?.[1]) {
    dbg("match: html img + link");
    return buildResult(htmlImg[1], section.slice(0, 400), htmlLink[1], "Best seller");
  }

  // 4) Any card product URL + first plausible image URL in same section
  const cardUrls = [
    ...section.matchAll(/https:\/\/(?:www\.)?cardtrader\.com\/[^\s\)"']*\/cards\/[^\s\)"']*/gi),
  ].map((x) => x[0]);
  const imageUrls = [
    ...section.matchAll(/https:\/\/[^\s\)"']+\.(?:png|jpe?g|webp|gif)(?:\?[^\s\)"']*)?/gi),
  ].map((x) => x[0]);
  if (cardUrls[0]) {
    const img = imageUrls.find((u) => looksLikeImageUrl(u));
    if (img) {
      dbg("match: loose image + card url");
      return buildResult(img, section.slice(0, 500), cardUrls[0], "Best seller");
    }
    dbg("match: card url only (no image) — placeholder");
    return buildResult("", section.slice(0, 500), cardUrls[0], "Best seller");
  }

  dbg("no match");
  return null;
}

async function fetchJinaMarkdown(): Promise<string | null> {
  const jinaUrl = `${JINA_PREFIX}${CARDTRADER_POKEMON_HUB}`;
  const res = await fetch(jinaUrl, {
    next: { revalidate: 3600 },
    headers: { "user-agent": "Mozilla/5.0 hypemeter" },
    signal: AbortSignal.timeout(18_000),
  });
  if (!res?.ok) {
    dbg("jina http", res?.status);
    return null;
  }
  return res.text();
}

export async function fetchCardTraderPokemonBestSeller(): Promise<CardTraderBestSeller | null> {
  try {
    const text = await fetchJinaMarkdown();
    if (!text) return null;
    return parseCardTraderBestSellerFromText(text);
  } catch (e) {
    dbg("fetch error", e);
    return null;
  }
}

/** Raw Jina body for debug API (do not log full text in production). */
export async function fetchCardTraderJinaRaw(): Promise<{ ok: boolean; status: number; text: string }> {
  const jinaUrl = `${JINA_PREFIX}${CARDTRADER_POKEMON_HUB}`;
  try {
    const res = await fetch(jinaUrl, {
      next: { revalidate: 0 },
      headers: { "user-agent": "Mozilla/5.0 hypemeter-debug" },
      signal: AbortSignal.timeout(18_000),
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch {
    return { ok: false, status: 0, text: "" };
  }
}
