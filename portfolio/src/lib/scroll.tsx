"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); lenis = null; };
  }, []);
  return null;
}

export const setScrollLocked = (locked: boolean) => {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop(); else lenis?.start();
};

export function scrollToTarget(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(id === "top" ? 0 : el, { offset: -8 });
  else el.scrollIntoView({ behavior: "auto" });
  if (id !== "top") history.replaceState(null, "", `#${id}`);
}
