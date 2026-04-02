"use client";

import { useEffect, useMemo, useState } from "react";

function formatMmSs(msRemaining: number): string {
  const seconds = Math.max(0, Math.ceil(msRemaining / 1000));
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function HomeNextUpdateCountdown({
  computedAt,
  ttlSec,
}: {
  computedAt: number;
  ttlSec: number;
}) {
  const targetMs = useMemo(() => computedAt + ttlSec * 1000, [computedAt, ttlSec]);
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, targetMs - Date.now()));

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, targetMs - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return (
    <p className="text-[11px] text-cyan-200/85 underline decoration-cyan-400/35 underline-offset-2">
      Next update in {formatMmSs(remainingMs)}
    </p>
  );
}
