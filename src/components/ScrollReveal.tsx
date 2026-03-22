"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export default function ScrollReveal({ children, className = "", delayMs = 0 }: Props) {
  // Ref targets the DOM node observed for viewport intersection.
  const ref = useRef<HTMLDivElement | null>(null);
  // Switches CSS class from hidden to revealed once entered viewport.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Optional stagger allows sequential reveals between sections.
        window.setTimeout(() => setVisible(true), delayMs);
        observer.unobserve(node);
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={`reveal-item ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

