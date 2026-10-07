"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

const css = `
.nav{position:fixed;inset:0 0 auto 0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:14px var(--gutter);pointer-events:none}
.nav>*{pointer-events:auto}
.nav-bar{position:fixed;top:0;left:0;height:2px;width:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(var(--p,0));z-index:60}
.brand{display:flex;align-items:center;gap:12px;font-weight:600;letter-spacing:-.02em}
.mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);font-family:var(--font-mono);font-size:13px;font-weight:600;transition:transform .8s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.nav.scrolled .mark{background:var(--ink);color:#fff}
.mark::before{content:attr(data-i)}
.brand:hover .mark{transform:rotate(360deg)}
.brand-name{transition:opacity .4s var(--ease),transform .4s var(--ease)}
.nav.scrolled .brand-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.pill{position:relative;display:flex;padding:5px;border-radius:999px;transition:background .4s var(--ease),box-shadow .4s var(--ease),backdrop-filter .4s}
.nav.scrolled .pill{background:rgba(255,255,255,.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -14px rgba(13,13,13,.25)}
.pill a{position:relative;z-index:1;padding:9px 16px;font-size:14px;font-weight:500;border-radius:999px;color:var(--ink-2);transition:color .35s var(--ease)}
.pill a.on{color:#fff}
.ind{position:absolute;top:5px;bottom:5px;left:0;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
.menu-btn{display:none;height:44px;padding:0 20px;border-radius:999px;font-weight:500;font-size:14px;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line)}
.ov{position:fixed;inset:0;z-index:70;background:var(--paper);clip-path:circle(0 at calc(100% - 60px) 38px);visibility:hidden;transition:clip-path .9s var(--ease),visibility 0s .9s;display:flex;flex-direction:column;justify-content:center;padding:90px var(--gutter) 40px}
.ov.open{clip-path:circle(150% at calc(100% - 60px) 38px);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.ov-close{position:absolute;top:14px;right:var(--gutter);height:44px;padding:0 20px;border-radius:999px;background:var(--ink);color:#fff;font-weight:500;font-size:14px}
.ov a{display:flex;align-items:baseline;gap:16px;padding:10px 0;font-size:clamp(40px,12vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1.05;opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.ov a small{font-family:var(--font-mono);font-size:12px;font-weight:400;color:var(--mute);letter-spacing:0}
.ov.open a{opacity:1;transform:none;transition-delay:calc(.25s + var(--i)*70ms)}
@media(max-width:860px){.pill{display:none}.menu-btn{display:block}.brand-name{display:none}}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        barRef.current?.style.setProperty("--p", String(max > 0 ? scrollY / max : 0));
        setScrolled(scrollY > 40);
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const ids = ["hero", ...NAV.map((n) => n.id)];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id === "hero" ? "" : e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const measure = () => { const a = links.current[active]; setInd(a ? { x: a.offsetLeft, w: a.offsetWidth } : null); };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [active, scrolled]);

  useEffect(() => {
    setScrollLocked(open);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => { removeEventListener("keydown", k); setScrollLocked(false); };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToTarget(id), open ? 50 : 0); };

  return (
    <>
      <style>{css}</style>
      <div className="nav-bar" ref={barRef} aria-hidden />
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="#top" className="brand" onClick={go("top")} >
          <span className="mark" aria-hidden data-i={PROFILE.initials} />
          <span className="brand-name">{PROFILE.name}</span><span className="sr"> — back to top</span>
        </a>
        <nav aria-label="Primary" className="pill">
          <span className="ind" aria-hidden style={{ width: ind?.w ?? 0, opacity: ind ? 1 : 0, transform: `translateX(${ind?.x ?? 0}px)` }} />
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} ref={(el) => { links.current[n.id] = el; }} className={active === n.id ? "on" : ""}
              aria-current={active === n.id ? "true" : undefined} onClick={go(n.id)}>{n.label}</a>
          ))}
        </nav>
        <button className="menu-btn" aria-expanded={open} aria-controls="overlay" onClick={() => setOpen(true)}>Menu</button>
      </header>
      <div id="overlay" className={`ov${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} inert={!open}>
        <button className="ov-close" onClick={() => setOpen(false)}>Close</button>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} style={{ ["--i" as string]: i }} onClick={go(n.id)}><small>0{i + 1}</small>{n.label}</a>
        ))}
      </div>
    </>
  );
}
