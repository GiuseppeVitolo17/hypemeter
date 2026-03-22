"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

const PLACEHOLDER = "/card-highlight-placeholder.svg";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

/**
 * CardTrader CDNs / querystrings sometimes break Next/Image; on error we fall back to a local SVG.
 */
export function CardTraderHighlightImage({ src, alt, width, height, className }: Props) {
  const [usePlaceholder, setUsePlaceholder] = useState(!src?.trim());

  const onError = useCallback(() => {
    setUsePlaceholder(true);
  }, []);

  const effective = usePlaceholder ? PLACEHOLDER : src.trim();

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
