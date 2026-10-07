"use client";
import { useEffect, useRef, useState } from "react";
import { TIMELINE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

const css = `
.tl{position:relative;margin-top:64px;padding-left:clamp(28px,6vw,96px)}
.spine-l,.spine-p{position:absolute;left:7px;top:8px;bottom:8px;width:2px}
.spine-l{background:var(--line)}
.spine-p{background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p,0))}
.stop{position:relative;padding-bottom:clamp(48px,8vh,88px);color:var(--mute);transition:color .8s var(--ease)}
.stop h3,.stop li,.stop .pl{transition:color .8s var(--ease)}
.stop.lit{color:var(--ink)}
.stop.lit h3{color:var(--ink)}
.stop:not(.lit) h3{color:var(--mute)}
.stop.lit li{color:var(--ink-2)}
.stop:not(.lit) li{color:var(--mute)}
.dot{position:absolute;left:calc(-1 * clamp(28px,6vw,96px) + 0px);top:8px;width:16px;height:16px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:background .5s var(--ease),box-shadow .5s var(--ease),transform .6s var(--ease)}
.stop.lit .dot{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.08);transform:scale(1.1)}
.stop .pe{font-family:var(--font-mono);font-size:13px;color:var(--mute);display:flex;gap:12px}
.stop .pe b{color:var(--ink);font-weight:500}
.stop h3{font-weight:700;letter-spacing:-.04em;line-height:1.05;font-size:clamp(26px,3.6vw,52px);margin:12px 0 10px;max-width:22ch}
.stop .pl{color:var(--mute);font-size:clamp(15px,1.2vw,18px)}
.stop ul{margin-top:20px;max-width:64ch;display:grid;gap:10px}
.stop li{padding-left:18px;position:relative;line-height:1.5}
.stop li::before{content:"";position:absolute;left:0;top:.7em;width:6px;height:1px;background:var(--ink)}
.next{margin-top:8px;padding:clamp(22px,3vw,34px);border-radius:26px;border:1.5px dashed rgba(13,13,13,.28);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px}
.next h3{font-weight:700;letter-spacing:-.04em;font-size:clamp(26px,3vw,40px);line-height:1}
.next h3 em{font-family:var(--font-serif);font-weight:400;color:var(--mute)}
`;

export default function Experience() {
  const list = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(list, 0.6);
  const [lit, setLit] = useState<boolean[]>(TIMELINE.map(() => false));

  useEffect(() => {
    const el = list.current; if (!el) return;
    const h = el.getBoundingClientRect().height;
    const next = Array.from(el.querySelectorAll<HTMLElement>(".stop")).map((s) => p * h >= s.offsetTop + 8);
    setLit((o) => (o.join() === next.join() ? o : next));
  }, [p]);

  return (
    <section id="experience" className="section" aria-labelledby="exp-h">
      <style>{css}</style>
      <div className="wrap">
        <div id="exp-h"><SectionHead n="05" label="Education & experience" lead="The path" accent="so far." /></div>
        <div className="tl" ref={list}>
          <span className="spine-l" aria-hidden /><span className="spine-p" aria-hidden style={{ ["--p" as string]: p }} />
          {TIMELINE.map((s, i) => (
            <article key={s.title} className={`stop${lit[i] ? " lit" : ""}`}>
              <span className="dot" aria-hidden />
              <p className="pe"><b>{s.period}</b><span>{s.kind}</span></p>
              <h3>{s.title}</h3>
              <p className="pl">{s.place}</p>
              <ul>{s.details.map((d) => <li key={d}>{d}</li>)}</ul>
            </article>
          ))}
          <div className="next rv">
            <h3>Next — <em>Your team?</em></h3>
            <a className="btn btn-primary" href="#contact">Get in touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}
