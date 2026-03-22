import { fetchCardTraderPokemonBestSeller } from "@/lib/fetchCardTraderBestSeller";
import {
  fetchCardTraderImageBytesUncached,
  isAllowedCardTraderImageUrl,
} from "@/lib/cardHighlightImageCache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isDebugAllowed(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.ENABLE_DEBUG_CARDTRADER === "1";
}

/**
 * Diagnose Card Highlight image pipeline (seller parse + upstream fetch).
 * Set ENABLE_DEBUG_CARDTRADER=1 on Vercel or use local dev.
 */
export async function GET() {
  if (!isDebugAllowed()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const seller = await fetchCardTraderPokemonBestSeller();
  const imageUrl = seller?.imageUrl?.trim() ?? "";
  const allowed = imageUrl ? isAllowedCardTraderImageUrl(imageUrl) : false;

  let upstream: { ok: true; status: number; contentType: string; bytes: number } | { ok: false; error: string } =
    { ok: false, error: "no image URL" };

  if (imageUrl && allowed) {
    try {
      const data = await fetchCardTraderImageBytesUncached(imageUrl);
      upstream = {
        ok: true,
        status: 200,
        contentType: data.contentType,
        bytes: data.body.length,
      };
    } catch (e) {
      upstream = { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  } else if (imageUrl && !allowed) {
    upstream = { ok: false, error: "imageUrl failed host allowlist" };
  }

  return NextResponse.json({
    seller,
    imageUrl,
    allowedHost: allowed,
    upstream,
    hints: [
      "If upstream fails with HTTP 403, CardTrader may block datacenter IPs — try again from /api/card-highlight-image after deploy.",
      "Home uses /api/card-highlight-image (same-origin <img>) so the browser never hotlinks CardTrader.",
    ],
  });
}
