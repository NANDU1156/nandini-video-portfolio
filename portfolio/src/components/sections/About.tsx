"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion, useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

const css = `
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px);margin-top:48px;align-items:stretch}
.about-l,.about-r{display:flex;flex-direction:column;gap:22px;padding-top:6px}
.hi{font-weight:700;letter-spacing:-.04em;line-height:1;font-size:clamp(34px,3.6vw,52px)}
.about-l p{color:var(--ink-2);font-size:clamp(16px,1.25vw,19px);line-height:1.55;max-width:46ch}
.about-l .btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto}
.facts{display:flex;flex-direction:column}
.facts li{display:grid;grid-template-columns:96px 1fr;gap:12px;padding:15px 0;border-top:1px solid var(--line);font-size:15px}
.facts li:last-child{border-bottom:1px solid var(--line)}
.facts span{font-family:var(--font-mono);font-size:12px;color:var(--mute);padding-top:2px}
.facts a,.facts b{font-weight:500;overflow-wrap:anywhere}
.facts a:hover{text-decoration:underline}
.quote{margin-top:auto;font-family:var(--font-serif);font-style:italic;font-size:clamp(22px,2vw,30px);line-height:1.2;color:var(--ink-2)}
.quote small{display:block;margin-top:10px;font-family:var(--font-mono);font-style:normal;font-size:11px;color:var(--mute)}
.about-c{position:relative;display:flex;justify-content:center}
.lany{position:relative;margin-top:calc(-1 * var(--sec-y));width:300px}
.swing{transform-origin:50% 0;will-change:transform;display:flex;flex-direction:column;align-items:center}
.strap{position:relative;width:30px;height:calc(var(--sec-y) + 56px);background:var(--ink);overflow:hidden;border-radius:0 0 3px 3px}
.strap div{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;animation:strap 14s linear infinite}
.strap span{writing-mode:vertical-rl;color:#fff;font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:14px 0;white-space:nowrap}
@keyframes strap{to{transform:translateY(-50%)}}
.clip{width:22px;height:30px;margin-top:-2px;position:relative;z-index:2}
.flip{position:relative;perspective:1400px;margin-top:-6px;display:block;width:300px;height:404px;border-radius:22px;text-align:left}
.flip-hit{position:absolute;inset:0;z-index:3;border-radius:22px;cursor:pointer}
.flip-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
.flip.flipped .flip-in{transform:rotateY(180deg)}
@media(hover:hover){.flip:hover .flip-in{transform:rotateY(180deg)}}
.face{position:absolute;inset:0;border-radius:22px;background:#fff;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -30px rgba(13,13,13,.35),0 10px 24px -12px rgba(13,13,13,.2)}
.back{transform:rotateY(180deg);padding:26px 24px;display:flex;flex-direction:column}
.band{height:42px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font-family:var(--font-mono);font-size:11px;letter-spacing:.22em}
.band i{width:44px;height:6px;border-radius:3px;background:rgba(255,255,255,.28)}
.ph{display:block;margin:14px auto 10px;width:128px;height:156px;padding:3px;border-radius:22px;background:linear-gradient(145deg,#d9d6d0,#6b6963 55%,#c9c6c0);position:relative}
.ph::before{content:"";position:absolute;inset:-14px;border-radius:34px;background:radial-gradient(closest-side,rgba(13,13,13,.1),transparent);z-index:-1}
.ph div{width:100%;height:100%;border-radius:19px;overflow:hidden;background:#fff}
.ph img{width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .8s var(--ease)}
.flip:hover .ph img{transform:scale(1.07)}
.nm{text-align:center;font-weight:700;font-size:21px;letter-spacing:-.03em;line-height:1.1}
.rl{text-align:center;font-size:12.5px;color:var(--mute);margin-top:3px}
.rows{margin:10px 22px 0;display:grid;gap:3px;font-size:11.5px}
.rows div{display:flex;justify-content:space-between;gap:12px}
.rows dt{font-family:var(--font-mono);color:var(--mute)}
.rows dd{margin:0;font-weight:500;text-align:right}
.foot{position:absolute;left:22px;right:22px;bottom:14px;display:flex;align-items:flex-end;justify-content:space-between}
.bars{display:flex;align-items:flex-end;gap:2px;height:26px}
.bars i{display:block;background:var(--ink);height:100%}
.holo{width:32px;height:32px;border-radius:50%;background:conic-gradient(from 20deg,#f2f2f2,#9a9a9a,#ededed,#7d7d7d,#f6f6f6,#a8a8a8,#f2f2f2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.15);animation:holo 6s linear infinite}
@keyframes holo{to{transform:rotate(360deg)}}
.back h3{font-weight:700;font-size:26px;letter-spacing:-.04em;margin-bottom:14px}
.back li{font-size:13px;line-height:1.4;padding:8px 0;border-top:1px solid var(--line);color:var(--ink-2)}
.sig{margin-top:auto;font-family:var(--font-serif);font-style:italic;font-size:30px;line-height:1}
.back small{margin-top:10px;font-family:var(--font-mono);font-size:10px;color:var(--mute);overflow-wrap:anywhere}
@media(max-width:1040px){
 .about-grid{grid-template-columns:minmax(0,1fr);margin-top:0}
 .about-c{order:-1;margin-bottom:24px}
 .about-l .btns,.quote{margin-top:6px}
}
`;

const BARS = [2,1,3,1,1,2,3,1,2,1,1,3,2,1,2,3,1,1,2,1,3,2,1,1,2,3,1,2,1,3,1,2];

export default function About() {
  const sec = useRef<HTMLElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const visible = useInView(sec, 0.05);
  const vis = useRef(false);
  vis.current = visible;

  // Damped pendulum: pointer velocity → impulse, spring back to an idle sway.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ang = 0, vel = 0, last = performance.now(), lx = 0, raf = 0;
    const move = (e: PointerEvent) => {
      if (!vis.current) return;
      const dx = e.clientX - lx; lx = e.clientX;
      vel += Math.max(-6, Math.min(6, dx)) * 0.045;
    };
    const loop = (now: number) => {
      const f = Math.min(3, (now - last) / 16.7); last = now;
      if (vis.current) {
        const sway = Math.sin(now / 1700) * 1.6;
        vel += (-0.012 * (ang - sway) - 0.028 * vel) * f;
        ang = Math.max(-16, Math.min(16, ang + vel * f));
        if (swing.current) swing.current.style.transform = `rotate(${ang.toFixed(3)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  const facts: [string, React.ReactNode][] = [
    ["Location", <b key="l">{PROFILE.location}</b>],
    ["Education", <b key="e">{PROFILE.degreeShort}, CGPA {PROFILE.cgpa}</b>],
    ["Current", <b key="c">B.Tech student ({PROFILE.status})</b>],
    ["Email", <a key="m" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>],
  ];

  return (
    <section id="about" ref={sec} className="section" aria-labelledby="about-h">
      <style>{css}</style>
      <div className="wrap">
        <div id="about-h"><SectionHead n="01" label="About" lead="A little" accent="about me." /></div>
        <div className="about-grid">
          <div className="about-l">
            <h3 className="hi rv">Hi, I&rsquo;m {PROFILE.firstName}.</h3>
            <p className="rv" style={{ ["--i" as string]: 1 }}>{PROFILE.resumeSummary}.</p>
            <p className="rv" style={{ ["--i" as string]: 2 }}>{PROFILE.resumeLine2}.</p>
            <div className="btns rv" style={{ ["--i" as string]: 3 }}>
              <a className="btn btn-primary" href={PROFILE.resume} download>Résumé</a>
              <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
          </div>

          <div className="about-c">
            <div className="lany">
              <div className="swing" ref={swing}>
                <div className="strap" aria-hidden>
                  <div>{[0, 1].map((k) => <span key={k}>{PROFILE.name} · {PROFILE.role} · {PROFILE.name} · {PROFILE.role} ·</span>)}</div>
                </div>
                <svg className="clip" viewBox="0 0 22 30" aria-hidden><rect x="3" y="0" width="16" height="10" rx="2" fill="#bdbab4" /><path d="M5 8h12l3 6v10a4 4 0 01-4 4H6a4 4 0 01-4-4V14z" fill="#8f8c86" /><rect x="8" y="14" width="6" height="9" rx="3" fill="#f4f2ee" /></svg>
                <div className={`flip${flipped ? " flipped" : ""}`}>
                  <div role="button" tabIndex={0} className="flip-hit" onClick={() => setFlipped((f) => !f)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } }}
                  aria-pressed={flipped} aria-label={flipped ? "Flip ID card to front" : "Flip ID card to back"} />
                  <span className="flip-in" aria-hidden style={{ display: "block" }}>
                    <span className="face" style={{ display: "block" }}>
                      <span className="band"><i />STUDENT ID<i /></span>
                      <span className="ph"><div><img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} /></div></span>
                      <span className="nm" style={{ display: "block" }}>{PROFILE.name}</span>
                      <span className="rl" style={{ display: "block" }}>{PROFILE.role}</span>
                      <dl className="rows">
                        <div><dt>Dept.</dt><dd>CSE – AI &amp; ML</dd></div>
                        <div><dt>Batch</dt><dd>2023 – 2027</dd></div>
                        <div><dt>Valid till</dt><dd>{PROFILE.validTill}</dd></div>
                      </dl>
                      <span className="foot" aria-hidden>
                        <span className="bars">{BARS.map((w, i) => <i key={i} style={{ width: w * 1.5 }} />)}</span>
                        <span className="holo" />
                      </span>
                    </span>
                    <span className="face back" style={{ display: "flex" }}>
                      <h3>What I am</h3>
                      <ul>
                        <li>{PROFILE.role} — {PROFILE.degreeShort}, {PROFILE.status}</li>
                        <li>CGPA {PROFILE.cgpa} at {PROFILE.college}</li>
                        <li>Built ApexStore and a Personal Portfolio Website</li>
                        <li>Certified: AI Tools Prompt Engineer (2025)</li>
                        <li>MERN Stack Workshop Programme</li>
                      </ul>
                      <span className="sig">{PROFILE.name}</span>
                      <small>If found, say hello · {PROFILE.email}</small>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="sr">
            ID card. {PROFILE.name}, {PROFILE.role}. Department CSE – AI &amp; ML. Batch 2023 – 2027. Valid till {PROFILE.validTill}.
            On the back: {PROFILE.degreeShort} student, {PROFILE.status}; CGPA {PROFILE.cgpa} at {PROFILE.college}; built ApexStore and a Personal Portfolio Website;
            certified AI Tools Prompt Engineer (2025); MERN Stack Workshop Programme. If found, say hello: {PROFILE.email}.
          </p>
          <div className="about-r">
            <ul className="facts rv" aria-label="Quick facts">
              {facts.map(([k, v]) => <li key={k}><span>{k}</span>{v}</li>)}
            </ul>
            <blockquote className="quote rv" style={{ ["--i" as string]: 1, margin: 0 }}>
              &ldquo;{PROFILE.quote}&rdquo;<small>Paraphrased from my résumé</small>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
