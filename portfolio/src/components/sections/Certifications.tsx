"use client";
import { CERTIFICATIONS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

const css = `
.certs{background:#fff;border-block:1px solid var(--line)}
.cert-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(24px,5vw,80px);align-items:start}
.cert-l{position:sticky;top:120px}
.cert-l .cnt{margin-top:22px;font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.cl li{border-top:1px solid var(--line)}
.cl li:last-child{border-bottom:1px solid var(--line)}
.row{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:16px;align-items:center;padding:30px 20px;overflow:hidden;isolation:isolate;transition:color .45s var(--ease);outline-offset:-3px}
.row::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease);z-index:-1}
.row:hover,.row:focus-visible{color:#fff}
.row:hover::before,.row:focus-visible::before{transform:scaleX(1)}
.row .i{font-family:var(--font-mono);font-size:13px;color:var(--mute);transition:color .45s}
.row:hover .i,.row:focus-visible .i,.row:hover .is,.row:focus-visible .is{color:rgba(255,255,255,.65)}
.row h3{font-weight:700;letter-spacing:-.035em;line-height:1.1;font-size:clamp(22px,2.6vw,36px)}
.row .is{display:block;margin-top:6px;font-size:14px;color:var(--mute);transition:color .45s}
.row .ar{font-size:22px;transform:translateX(-14px);opacity:0;transition:transform .6s var(--ease),opacity .4s}
.row:hover .ar,.row:focus-visible .ar{transform:none;opacity:1}
@media(max-width:860px){.cert-grid{grid-template-columns:minmax(0,1fr)}.cert-l{position:static}.row{grid-template-columns:36px minmax(0,1fr) auto;padding:24px 8px}}
`;

export default function Certifications() {
  return (
    <section id="certifications" className="section certs" aria-labelledby="cert-h">
      <style>{css}</style>
      <div className="wrap cert-grid">
        <div className="cert-l">
          <div id="cert-h"><SectionHead n="04" label="Certifications" lead="Always" accent="learning." /></div>
          <p className="cnt rv">{CERTIFICATIONS.length} certifications</p>
        </div>
        <ol className="cl rv" aria-label="Certifications">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title}>
              <div className="row" tabIndex={0}>
                <span className="i">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{c.title}</h3><span className="is">{c.issuer}{c.year && `, ${c.year}`}</span></div>
                <span className="ar" aria-hidden>✓</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
