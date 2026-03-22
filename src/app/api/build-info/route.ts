import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Minimal deploy fingerprint — compare with `git rev-parse HEAD` after push. */
export async function GET() {
  return NextResponse.json({
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    vercelGitCommitRef: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
    /** Present only after the debug refactor that removed ENABLE_DEBUG_CARDTRADER gate */
    debugApiUngated: true,
  });
}
