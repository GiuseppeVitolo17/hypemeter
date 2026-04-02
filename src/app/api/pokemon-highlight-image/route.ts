import { cardHighlightCalendarDayKey } from "@/lib/cardHighlightCalendarDay";
import { getCachedPokemonImage, isAllowedPokemonImageUrl } from "@/lib/pokemonImageCache";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw) return new Response(null, { status: 400 });

  let imageUrl = "";
  try {
    imageUrl = decodeURIComponent(raw).trim();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!imageUrl || !isAllowedPokemonImageUrl(imageUrl)) {
    return new Response(null, { status: 404 });
  }

  const dayKey = cardHighlightCalendarDayKey();
  try {
    const data = await getCachedPokemonImage(imageUrl, dayKey);
    const maxAge = 24 * 60 * 60;
    return new Response(new Uint8Array(data.body), {
      headers: {
        "Content-Type": data.contentType,
        "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${Math.floor(maxAge / 2)}`,
        "X-Pokemon-Image-Day": dayKey,
      },
    });
  } catch {
    if (isAllowedPokemonImageUrl(imageUrl)) {
      return Response.redirect(imageUrl, 302);
    }
    return new Response(null, { status: 502 });
  }
}
