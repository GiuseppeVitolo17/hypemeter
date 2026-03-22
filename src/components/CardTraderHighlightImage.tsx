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
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

/**
 * Same-origin `/api/card-highlight-image` uses a plain `<img>` (Next/Image can fail on dynamic API routes).
 * External CardTrader URLs still go through next/image + unoptimized when used.
 */
export function CardTraderHighlightImage({ src, alt, width, height, className }: Props) {
  const [usePlaceholder, setUsePlaceholder] = useState(!src?.trim());

  const onError = useCallback(() => {
    setUsePlaceholder(true);
  }, []);

  const effective = usePlaceholder ? PLACEHOLDER : resolveRemoteCardImageSrc(src);
  const useApiProxy = !usePlaceholder && effective.startsWith("/api/card-highlight-image");

  if (useApiProxy) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- intentional: reliable proxy loading
      <img
        src={effective}
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

  return (
    <Image
      src={effective}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={onError}
    />
  );
}
