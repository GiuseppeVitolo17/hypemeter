"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

const PLACEHOLDER = "/card-highlight-placeholder.svg";

/** Relative CardTrader paths must load from their origin, not the app host. */
function resolveRemoteCardImageSrc(src: string): string {
  const t = src.trim();
  if (!t) return "";
  if (t.startsWith("/uploads/") || t.startsWith("/assets/")) {
    return `https://www.cardtrader.com${t}`;
  }
  return t;
}

type Props = {
  /** Full image URL from parser (https://www.cardtrader.com/...). Empty → placeholder only. */
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

type LoadMode = "proxy" | "placeholder";

function shouldLoadDirectly(src: string): boolean {
  try {
    return new URL(src).hostname === "cdn.pokoin.com";
  } catch {
    return false;
  }
}

/**
 * Always load through same-origin `/api/card-highlight-image` so CardTrader never sees the
 * visitor's browser/referrer. If the proxy fails, fall back to a local placeholder.
 */
export function CardTraderHighlightImage({ imageUrl, alt, width, height, className }: Props) {
  const direct = resolveRemoteCardImageSrc(imageUrl.trim());
  const [mode, setMode] = useState<LoadMode>(() => (direct ? "proxy" : "placeholder"));

  const onError = useCallback(() => {
    setMode("placeholder");
  }, []);

  if (!direct || mode === "placeholder") {
    return (
      <Image
        src={PLACEHOLDER}
        alt={alt}
        width={width}
        height={height}
        className={className}
        unoptimized
      />
    );
  }

  /**
   * Pokoin CDN allows browser image loads but returns 403 to Vercel/server fetches.
   * CardTrader assets still use the same-origin proxy to avoid leaking visitor referrers.
   */
  const src = shouldLoadDirectly(direct)
    ? direct
    : `/api/card-highlight-image?url=${encodeURIComponent(direct)}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- same-origin image proxy avoids leaking referrers.
    <img
      src={src}
      alt={alt || "Card highlight"}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      onError={onError}
    />
  );
}
