import type { ReactNode } from "react";

/** Real brand logos (devicon "original", MIT) live in /public/logos. Glow = very soft brand tint. */
export const BRAND: Record<string, { src: string; glow: string }> = {
  Java: { src: "/logos/java.svg", glow: "rgba(231,111,0,.16)" },
  HTML: { src: "/logos/html.svg", glow: "rgba(228,77,38,.16)" },
  CSS: { src: "/logos/css.svg", glow: "rgba(33,150,243,.16)" },
  JavaScript: { src: "/logos/javascript.svg", glow: "rgba(247,223,30,.22)" },
  MongoDB: { src: "/logos/mongodb.svg", glow: "rgba(71,162,72,.16)" },
  GitHub: { src: "/logos/github.svg", glow: "rgba(13,13,13,.08)" },
  "GitHub Pages": { src: "/logos/github.svg", glow: "rgba(13,13,13,.08)" },
};
const MERN_PARTS = ["mongodb", "express", "react", "node"];

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** Thin line icons for skills that have no brand logo. */
export const CONCEPT: Record<string, ReactNode> = {
  "AI Tools": (<g {...line}><rect x="14" y="14" width="20" height="20" rx="4" /><path d="M20 24h8M24 20v8M19 10v4M29 10v4M19 34v4M29 34v4M10 19h4M10 29h4M34 19h4M34 29h4" /></g>),
  "Prompt Engineering": (<g {...line}><rect x="7" y="10" width="34" height="28" rx="5" /><path d="M14 20l6 5-6 5M24 31h10" /></g>),
  English: (<g {...line}><path d="M8 12h22a3 3 0 013 3v12a3 3 0 01-3 3H20l-7 6v-6H8a3 3 0 01-3-3V15a3 3 0 013-3z" transform="translate(2 -1)" /><path d="M14 19h14M14 24h9" /></g>),
  Telugu: (<g {...line}><circle cx="24" cy="24" r="16" /><path d="M8 24h32M24 8c-6 5-6 27 0 32M24 8c6 5 6 27 0 32" /></g>),
  JWT: (<g {...line}><circle cx="18" cy="24" r="7" /><path d="M25 24h16M35 24v6M41 24v4" /></g>),
};

export const isBrand = (name: string) => name === "MERN" || name in BRAND;
export const hasLogo = (name: string) => isBrand(name) || name in CONCEPT;

export default function TechLogo({ name, size = 48, className = "" }: { name: string; size?: number; className?: string }) {
  if (name === "MERN") {
    const s = size * 0.46;
    return (
      <span role="img" aria-label="MERN: MongoDB, Express, React, Node.js" className={className}
        style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr", gap: size * 0.08, width: size, height: size, placeItems: "center" }}>
        {MERN_PARTS.map((p) => <img key={p} src={`/logos/${p}.svg`} alt="" width={s} height={s} loading="lazy" />)}
      </span>
    );
  }
  const b = BRAND[name];
  if (b) return <img src={b.src} alt={`${name} logo`} width={size} height={size} className={className} loading="lazy" />;
  const c = CONCEPT[name];
  if (c) return <svg role="img" aria-label={`${name} icon`} viewBox="0 0 48 48" width={size} height={size} className={className}>{c}</svg>;
  return null;
}
