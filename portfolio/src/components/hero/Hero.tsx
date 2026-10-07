"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.hero{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;padding-top:70px}
.ghost{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(120px,24vw,420px);color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.13);white-space:nowrap;user-select:none;pointer-events:none}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:clamp(12px,3vw,48px)}
.vid{position:relative;grid-column:2;height:min(96svh,1040px);aspect-ratio:768/960}
.vid video{width:100%;height:100%;display:block;object-fit:contain;mix-blend-mode:multiply}
.sound{position:absolute;right:6%;bottom:9%;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:transform .5s var(--ease)}
.sound:hover{transform:scale(1.08)}
.sound.ping::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(13,13,13,.45);animation:ping 2s var(--ease) infinite}
@keyframes ping{to{box-shadow:0 0 0 22px rgba(13,13,13,0)}}
.hl{grid-column:1;grid-row:1;align-self:end;padding-bottom:12svh}
.hr{grid-column:3;grid-row:1;align-self:end;padding-bottom:12svh;display:flex;flex-direction:column;align-items:flex-start;gap:12px}
.h1{font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(40px,5.2vw,84px)}
.sub{margin-top:18px;color:var(--ink-2);max-width:30ch;font-size:clamp(15px,1.2vw,18px)}
.sub b{display:block;font-family:var(--font-mono);font-size:12px;font-weight:500;color:var(--mute);margin-top:8px}
@media(max-width:900px){
 .hero{padding-top:84px;align-items:flex-start}
 .hero-grid{grid-template-columns:minmax(0,1fr);gap:8px;justify-items:center;text-align:center}
 .vid{grid-column:1;height:62svh;max-width:100%}
 .hl,.hr{grid-column:1;grid-row:auto;padding:0;align-items:center}
 .hl{margin-top:-24px}
 .hr{flex-direction:row;flex-wrap:wrap;justify-content:center;padding-bottom:56px}
 .ghost{top:34%;font-size:19vw}
}
`;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);          // sound currently audible
  const [blocked, setBlocked] = useState(false); // autoplay-with-sound was refused
  const visible = useRef(true);
  const unlocked = useRef(false);

  const start = useCallback(async () => {
    const v = vid.current; if (!v) return;
    v.muted = false;
    // Some browsers reject a blocked play(), others leave it pending: treat both as "blocked".
    const res = await Promise.race([
      v.play().then(() => "ok", () => "blocked"),
      new Promise<string>((r) => setTimeout(() => r("pending"), 800)),
    ]);
    if (res === "ok") { setOn(true); setBlocked(false); return; }
    v.muted = true; setOn(false); setBlocked(true); v.play().catch(() => {});
  }, []);

  useEffect(() => {
    start();
    const unlock = (e: Event) => {
      if (unlocked.current) return;
      if ((e.target as Element | null)?.closest?.(".sound")) return; // the button handles its own click
      const v = vid.current;
      if (!v || !v.muted) return; // already audible: nothing to unlock
      unlocked.current = true;
      if (visible.current) { v.muted = false; v.play().then(() => { setOn(true); setBlocked(false); }).catch(() => {}); }
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    evs.forEach((e) => addEventListener(e, unlock, { passive: true }));
    const io = new IntersectionObserver(([e]) => {
      const v = vid.current; if (!v) return;
      visible.current = e.intersectionRatio >= 0.35;
      if (visible.current) v.play().catch(() => {}); else v.pause();
    }, { threshold: [0, 0.35, 1] });
    if (root.current) io.observe(root.current);
    return () => { io.disconnect(); evs.forEach((e) => removeEventListener(e, unlock)); };
  }, [start]);

  const toggle = () => {
    const v = vid.current; if (!v) return;
    unlocked.current = true;
    if (v.muted || v.paused) { v.muted = false; v.play().then(() => { setOn(true); setBlocked(false); }).catch(() => {}); }
    else { v.muted = true; setOn(false); }
  };

  return (
    <section id="hero" ref={root} className="hero" aria-label="Introduction">
      <style>{css}</style>
      <div className="ghost" aria-hidden>{PROFILE.firstName.toUpperCase()}</div>
      <div className="wrap hero-grid">
        <div className="vid">
          <video ref={vid} muted loop playsInline preload="auto" aria-label={`${PROFILE.name} introducing herself`}>
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
          <button className={`sound${blocked ? " ping" : ""}`} onClick={toggle} aria-label={on ? "Mute introduction" : "Play introduction with sound"} aria-pressed={on}>
            {on ? (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><rect x="3" y="2" width="3.4" height="12" rx="1" fill="currentColor" /><rect x="9.6" y="2" width="3.4" height="12" rx="1" fill="currentColor" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M4 2.2v11.6a.6.6 0 00.9.5l9-5.8a.6.6 0 000-1L4.9 1.7a.6.6 0 00-.9.5z" fill="currentColor" /></svg>
            )}
          </button>
        </div>
        <div className="hl">
          <h1 className="h1"><span className="sr">{PROFILE.name} — </span>{PROFILE.role.replace("Student", "")}<em>Student.</em></h1>
          <p className="sub">{PROFILE.degreeShort}<b>{PROFILE.status} · {PROFILE.location}</b></p>
        </div>
        <div className="hr">
          <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget("work"); }}>Explore work</a>
          <a className="btn btn-ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("contact"); }}>Let&rsquo;s talk</a>
          <a className="btn btn-ghost" href={PROFILE.resume} download>Résumé ↓</a>
        </div>
      </div>
    </section>
  );
}
