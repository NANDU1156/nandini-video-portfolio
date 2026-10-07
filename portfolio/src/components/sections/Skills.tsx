"use client";
import { useEffect, useRef, useState } from "react";
import { FAMILIES, SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

const css = `
.sk-top{display:flex;flex-wrap:wrap;gap:8px;margin:40px 0 24px}
.chip{height:38px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background .3s var(--ease),color .3s var(--ease),transform .4s var(--ease)}
.chip:hover{transform:translateY(-1px)}
.chip[aria-pressed=true]{background:var(--ink);color:#fff;box-shadow:none}
.sk-wrap{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
.pt{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.tile{position:relative;aspect-ratio:1/1.12;border-radius:16px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 6px 9px;text-align:center;min-width:0;
 opacity:0;transform:translateY(16px) scale(.96);transition:opacity .35s var(--ease),transform .5s var(--ease),background .3s var(--ease),color .3s var(--ease),box-shadow .4s var(--ease)}
.pt.in .tile{opacity:1;transform:none}
.pt.in:not(.settled) .tile{transition-delay:var(--d)}
.pt.in .tile.dim{opacity:.22}
.pt.in .tile:hover,.pt.in .tile.sel{background:var(--ink);color:#fff;transform:translateY(-3px);box-shadow:0 18px 30px -16px rgba(13,13,13,.5);opacity:1}
.tile .z{align-self:flex-start;font-family:var(--font-mono);font-size:10px;color:var(--mute)}
.tile:hover .z,.tile.sel .z{color:rgba(255,255,255,.6)}
.tile .s{font-weight:700;letter-spacing:-.04em;font-size:clamp(22px,2.6vw,38px);line-height:1}
.tile .n{font-size:clamp(8.5px,.85vw,11px);font-weight:500;line-height:1.15;overflow-wrap:anywhere}
.tile .f{font-family:var(--font-mono);font-size:8px;color:var(--mute);display:none}
.tile:hover .f,.tile.sel .f{color:rgba(255,255,255,.55)}
@media(min-width:1100px){.tile .f{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}}
.insp{position:sticky;top:110px;padding:26px 24px 24px;min-height:430px;display:flex;flex-direction:column;align-items:center;text-align:center}
.insp .lg{position:relative;width:150px;height:150px;display:grid;place-items:center;margin:8px 0 18px}
.insp .lg::before{content:"";position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(closest-side,var(--glow,transparent),transparent)}
.insp .lg>*{position:relative;animation:pop .7s var(--ease) both}
@keyframes pop{from{opacity:0;transform:scale(.6) rotate(-8deg)}60%{transform:scale(1.06)}to{opacity:1;transform:none}}
.insp .lg svg{color:var(--ink)}
.insp h3{font-weight:700;font-size:28px;letter-spacing:-.04em;line-height:1.05}
.insp .fam{font-family:var(--font-mono);font-size:12px;color:var(--mute);margin-top:6px}
.insp .u{align-self:stretch;margin-top:20px;padding-top:16px;border-top:1px solid var(--line);text-align:left;font-size:14px;color:var(--ink-2)}
.insp .u b{display:block;font-family:var(--font-mono);font-size:11px;font-weight:500;color:var(--mute);margin-bottom:8px}
.insp .u li+li{margin-top:4px}
@media(max-width:1000px){.sk-wrap{grid-template-columns:minmax(0,1fr)}.insp{position:static;min-height:0}.pt{grid-template-columns:repeat(4,minmax(0,1fr))}}
`;

const ALL = SKILL_GROUPS.flatMap((g) => g.skills);

export default function Skills() {
  const grid = useRef<HTMLUListElement>(null);
  const seen = useInView(grid, 0.15, true);
  const [fam, setFam] = useState<string>("All");
  const [sel, setSel] = useState(0);
  const [settled, setSettled] = useState(false);
  useEffect(() => { if (!seen) return; const t = setTimeout(() => setSettled(true), 1500); return () => clearTimeout(t); }, [seen]);
  const cur = ALL[sel];
  const cols = typeof window !== "undefined" && window.innerWidth <= 1000 ? 4 : 8;

  return (
    <section id="skills" className="section" aria-labelledby="skills-h">
      <style>{css}</style>
      <div className="wrap">
        <div id="skills-h"><SectionHead n="02" label="Skills" lead="The periodic table" accent="of my stack." /></div>
        <p className="mono rv" style={{ fontSize: 12, color: "var(--mute)", marginTop: 20 }}>{ALL.length} skills · {FAMILIES.length} families, as listed on my résumé</p>
        <div className="sk-top" role="group" aria-label="Filter by family">
          {["All", ...FAMILIES].map((f) => (
            <button key={f} className="chip" aria-pressed={fam === f} onClick={() => setFam(f)}>{f}</button>
          ))}
        </div>
        <div className="sk-wrap">
          <ul ref={grid} className={`pt${seen ? " in" : ""}${settled ? " settled" : ""}`} aria-label="Skills">
            {ALL.map((s, i) => (
              <li key={s.name} style={{ display: "contents" }}>
                <button className={`tile${sel === i ? " sel" : ""}${fam !== "All" && fam !== s.family ? " dim" : ""}`}
                  style={{ ["--d" as string]: `${(Math.floor(i / cols) + (i % cols)) * 40}ms` }}
                  onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)}>
                  <span className="z" aria-hidden>{i + 1}</span>
                  <span className="s" aria-hidden>{s.symbol}</span>
                  <span className="n">{s.name}</span>
                  <span className="f">{s.family}</span>
                </button>
              </li>
            ))}
          </ul>
          <aside className="insp card" aria-live="polite" aria-label="Skill details"
            style={{ ["--glow" as string]: BRAND[cur.name]?.glow ?? (isBrand(cur.name) ? "rgba(13,13,13,.06)" : "transparent") }}>
            <div className="lg" key={cur.name}><TechLogo name={cur.name} size={150} /></div>
            <h3>{cur.name}</h3>
            <p className="fam">{cur.family}</p>
            <div className="u">
              <b>{cur.usedIn.length ? "Where it shows up" : "Listed on résumé"}</b>
              {cur.usedIn.length ? <ul>{cur.usedIn.map((u) => <li key={u}>{u}</li>)}</ul> : <p>Languages Spoken</p>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
