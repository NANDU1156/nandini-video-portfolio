"use client";
import { RefObject, useEffect, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True while the element intersects the viewport (or stays true once seen when `once`). */
export function useInView<T extends Element>(ref: RefObject<T | null>, threshold = 0.15, once = false) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setOn(true); if (once) io.disconnect(); } else if (!once) setOn(false);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return on;
}

/** 0 → 1 as `start` (fraction of viewport height) travels from the element top to its bottom. */
export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T | null>, start = 0.6) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const v = Math.min(1, Math.max(0, (window.innerHeight * start - r.top) / r.height));
      setP((o) => (Math.abs(o - v) > 0.001 ? v : o));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, [ref, start]);
  return p;
}
