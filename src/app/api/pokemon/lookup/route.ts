import { NextRequest, NextResponse } from "next/server";

import { fetchPokemonByIdentifier } from "@/lib/pokemonApi";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing q query param" }, { status: 400 });
  }

  const profile = await fetchPokemonByIdentifier(query.toLowerCase());
  if (!profile) {
    return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
  }

  return NextResponse.json(profile, {
    headers: {
      // Public, long-lived cache because profile payload is static.
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
