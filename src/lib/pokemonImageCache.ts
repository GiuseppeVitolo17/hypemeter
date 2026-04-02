import { unstable_cache } from "next/cache";
import { HYPEMETER_CACHE_TAG_HOME } from "@/lib/homePageCacheConfig";

const POKEMON_IMAGE_CACHE_SEC = 24 * 60 * 60;

function isTrustedRasterContentType(raw: string): boolean {
  const base = raw.split(/[;]/)[0]?.trim().toLowerCase() ?? "";
  if (base === "image/svg+xml") return false;
  return /^image\/(jpeg|jpg|pjpeg|png|gif|webp|avif|x-png|bmp|tiff|heic|heif)$/i.test(base);
}

export function isAllowedPokemonImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return (
      host === "raw.githubusercontent.com" ||
      host.endsWith(".pokemon.com") ||
      host === "pokemon.com" ||
      host.endsWith(".pokeapi.co") ||
      host === "pokeapi.co"
    );
  } catch {
    return false;
  }
}

export async function fetchPokemonImageBytesUncached(imageUrl: string): Promise<{
  body: Buffer;
  contentType: string;
}> {
  const trimmed = imageUrl.trim();
  if (!trimmed || !isAllowedPokemonImageUrl(trimmed)) {
    throw new Error("pokemon_image: URL not allowed or empty");
  }

  const res = await fetch(trimmed, {
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`pokemon_image: upstream HTTP ${res.status}`);

  const body = Buffer.from(await res.arrayBuffer());
  if (body.length < 32) throw new Error("pokemon_image: body too small");

  const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "application/octet-stream";
  if (!isTrustedRasterContentType(contentType)) {
    throw new Error("pokemon_image: untrusted Content-Type");
  }
  return { body, contentType };
}

const getCachedPokemonImageInner = unstable_cache(
  async (imageUrl: string, dayKey: string) => {
    void dayKey;
    const data = await fetchPokemonImageBytesUncached(imageUrl);
    return { bodyB64: data.body.toString("base64"), contentType: data.contentType };
  },
  ["pokemon-highlight-image-bytes-v1"],
  { revalidate: POKEMON_IMAGE_CACHE_SEC, tags: [HYPEMETER_CACHE_TAG_HOME] },
);

export async function getCachedPokemonImage(
  imageUrl: string,
  dayKey: string,
): Promise<{ body: Buffer; contentType: string }> {
  const row = await getCachedPokemonImageInner(imageUrl, dayKey);
  return { body: Buffer.from(row.bodyB64, "base64"), contentType: row.contentType };
}
