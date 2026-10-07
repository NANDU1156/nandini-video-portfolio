"use client";
import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import TechLogo, { hasLogo } from "../ui/TechLogo";

const css = `
.acc{display:flex;gap:12px;height:min(78svh,600px);margin-top:48px}
.pn{position:relative;flex:1 1 0;min-width:84px;border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.pn.open{flex-grow:8;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -40px rgba(13,13,13,.28)}
.spine{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;width:100%;transition:opacity .4s var(--ease)}
.pn.open .spine{opacity:0;pointer-events:none}
.spine .no{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.spine .vt{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;font-size:clamp(18px,1.8vw,26px);letter-spacing:-.03em;white-space:nowrap}
.spine .pl{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);font-size:20px;line-height:1;transition:transform .6s var(--ease),background .3s,color .3s}
.pn:hover .pl,.spine:focus-visible .pl{transform:rotate(90deg);background:var(--ink);color:#fff}
.body{position:absolute;inset:0;min-width:640px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:28px;padding:clamp(22px,2.6vw,38px);opacity:0;transition:opacity .3s var(--ease);pointer-events:none}
.pn.open .body{opacity:1;pointer-events:auto;transition:opacity .7s var(--ease) .25s}
.col{display:flex;flex-direction:column;min-height:0;overflow:auto}
.kick{display:flex;gap:12px;font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.kick b{color:var(--ink);font-weight:500}
.body h3{font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(32px,3.8vw,56px);margin:14px 0 16px}
.body .ds{color:var(--ink-2);line-height:1.55;font-size:clamp(14px,1.1vw,16.5px)}
.feat{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin:20px 0;font-size:14px}
.feat li{display:flex;gap:8px;align-items:baseline}
.feat li::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--ink);flex:none;transform:translateY(-2px)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
.tc{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 13px 0 9px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);background:#fff}
.tc:not(:has(img,svg)){padding-left:13px}
.ui{border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);padding:14px;clip-path:inset(0 100% 0 0);transition:clip-path 1s var(--ease);display:flex;flex-direction:column;gap:10px;min-height:0;overflow:hidden;filter:grayscale(1)}
.pn.open .ui{clip-path:inset(0);transition-delay:.3s}
.ui-l{font-family:var(--font-mono);font-size:10px;color:var(--mute);text-align:center}
.g{background:#e3e0da;border-radius:8px}.g2{background:#cfccc5;border-radius:8px}.ink{background:var(--ink);border-radius:999px}
.bar{display:flex;gap:8px;align-items:center;background:#fff;border-radius:12px;padding:8px 10px;box-shadow:inset 0 0 0 1px var(--line)}
.prods{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex:1;min-height:0}
.prod{background:#fff;border-radius:12px;padding:8px;display:flex;flex-direction:column;gap:6px;box-shadow:inset 0 0 0 1px var(--line)}
.prod .g{flex:1;min-height:36px}
@media(max-width:900px){
 .acc{flex-direction:column;height:auto;gap:10px}
 .pn{flex:none;min-width:0;height:76px;transition:height .8s var(--ease),box-shadow .6s}
 .pn.open{height:auto}
 .spine{flex-direction:row;padding:0 20px;height:76px;justify-content:flex-start;gap:16px;text-align:left}
 .spine .vt{writing-mode:horizontal-tb;transform:none;flex:1;white-space:normal}
 .body{position:relative;inset:auto;min-width:0;grid-template-columns:minmax(0,1fr);display:none}
 .pn.open .body{display:grid}
 .ui{height:260px}
 .feat{grid-template-columns:1fr 1fr}
}
`;

function MiniUI({ kind }: { kind: Project["ui"] }) {
  return (
    <div className="ui" role="img" aria-label={kind === "store" ? "Illustration: a storefront with search, product grid and cart" : "Illustration: a portfolio page with navigation, skills and project cards"}>
      <span className="ui-l">Illustrative UI</span>
      {kind === "store" ? (
        <>
          <div className="bar"><span className="g" style={{ height: 10, width: 10, borderRadius: "50%" }} /><span className="g" style={{ height: 10, flex: 1 }} /><span className="ink" style={{ height: 18, width: 34 }} /></div>
          <div className="prods">{[0, 1, 2, 3, 4, 5].map((i) => (
            <div className="prod" key={i}><div className={i % 2 ? "g2" : "g"} /><span className="g" style={{ height: 6, width: "70%" }} /><span className="ink" style={{ height: 14, width: "100%" }} /></div>))}</div>
          <div className="bar" style={{ justifyContent: "space-between" }}><span className="g" style={{ height: 8, width: "30%" }} /><span className="ink" style={{ height: 22, width: 70 }} /></div>
        </>
      ) : (
        <>
          <div className="bar" style={{ justifyContent: "space-between" }}><span className="ink" style={{ height: 16, width: 16, borderRadius: "50%" }} /><span style={{ display: "flex", gap: 6 }}>{[0, 1, 2, 3].map((i) => <span key={i} className="g" style={{ height: 8, width: 28 }} />)}</span></div>
          <div style={{ display: "grid", gap: 8, padding: "10px 4px" }}><span className="ink" style={{ height: 16, width: "60%", borderRadius: 6 }} /><span className="g" style={{ height: 8, width: "85%" }} /><span className="g" style={{ height: 8, width: "55%" }} /></div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{[0, 1, 2, 3, 4].map((i) => <span key={i} className="g2" style={{ height: 20, width: 40 + i * 6, borderRadius: 999 }} />)}</div>
          <div className="prods" style={{ gridTemplateColumns: "1fr 1fr" }}>{[0, 1].map((i) => <div className="prod" key={i}><div className="g" /><span className="g" style={{ height: 6, width: "60%" }} /></div>)}</div>
        </>
      )}
    </div>
  );
}

export default function Work() {
  const [open, setOpen] = useState(0);
  return (
    <section id="work" className="section" aria-labelledby="work-h">
      <style>{css}</style>
      <div className="wrap">
        <div id="work-h"><SectionHead n="03" label="Selected work" lead="Things" accent="I've built." /></div>
        <div className="acc rv">
          {PROJECTS.map((p, i) => (
            <article key={p.id} className={`pn${open === i ? " open" : ""}`} onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)} aria-label={p.title}>
              <button className="spine" aria-expanded={open === i} aria-controls={`pn-${p.id}`} onFocus={() => setOpen(i)} onClick={() => setOpen(i)}>
                <span className="no">{p.index}</span>
                <span className="vt">{p.title}</span>
                <span className="pl" aria-hidden>+</span>
              </button>
              <div className="body" id={`pn-${p.id}`}>
                <div className="col">
                  <p className="kick"><b>{p.index}</b><span>{p.kicker}</span></p>
                  <h3>{p.title}</h3>
                  <p className="ds">{p.description}</p>
                  <ul className="feat">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <ul className="chips" aria-label="Tech used">
                    {p.tech.map((t) => <li key={t} className="tc">{hasLogo(t) && <TechLogo name={t} size={16} />}{t}</li>)}
                  </ul>
                  {p.github && <a className="btn btn-primary" style={{ marginTop: 16, alignSelf: "flex-start" }} href={p.github} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>}
                </div>
                <MiniUI kind={p.ui} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
