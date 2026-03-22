import {
  fetchCardTraderJinaRaw,
  parseCardTraderBestSellerFromText,
  extractBestSellersSection,
} from "@/lib/fetchCardTraderBestSeller";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isDebugAllowed(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.ENABLE_DEBUG_CARDTRADER === "1";
}

/**
 * Inspect CardTrader + Jina parsing (markdown preview, section length, parsed card).
 * Enable with ENABLE_DEBUG_CARDTRADER=1 on Vercel or use dev.
 */
export async function GET() {
  if (!isDebugAllowed()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = await fetchCardTraderJinaRaw();
  const section = raw.text ? extractBestSellersSection(raw.text) : null;
  const parsed = raw.text ? parseCardTraderBestSellerFromText(raw.text) : null;

  const preview =
    section?.slice(0, 2500) ?? raw.text.slice(0, 2500) ?? "";

  return NextResponse.json({
    jinaOk: raw.ok,
    jinaStatus: raw.status,
    textLength: raw.text.length,
    sectionLength: section?.length ?? 0,
    sectionPreview: preview,
    parsed,
    hints: [
      "Set DEBUG_CARDTRADER=1 on the server to log [cardtrader] lines in function logs.",
      "If parsed is null, sectionPreview shows what Jina returned — adjust parsing in fetchCardTraderBestSeller.ts.",
    ],
  });
}
