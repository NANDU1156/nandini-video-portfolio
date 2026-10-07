"use client";
import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.ct{padding-bottom:40px}
.big{font-weight:700;letter-spacing:-.05em;line-height:.95;font-size:clamp(44px,9.2vw,150px)}
.big .ln{display:block}
.big .c{display:inline-block;white-space:pre}
.big .c.hop{animation:hop .6s var(--ease)}
@keyframes hop{0%{transform:none}35%{transform:translateY(-.14em)}100%{transform:none}}
.big em{font-family:var(--font-serif);font-weight:400;font-style:italic;color:var(--mute);letter-spacing:-.02em}
.ct-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px;align-items:end;margin-top:clamp(40px,7vh,80px)}
.mail{display:inline-block;font-weight:600;letter-spacing:-.035em;font-size:clamp(22px,4vw,56px);line-height:1.1;overflow-wrap:anywhere;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.14em;text-decoration-color:rgba(13,13,13,.3);transition:text-decoration-color .3s}
.mail:hover{text-decoration-color:var(--ink)}
.copy{margin-left:14px;vertical-align:middle;height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);transition:background .3s,color .3s}
.copy:hover{background:var(--ink);color:#fff}
.links{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.badge{position:relative;width:150px;height:150px;display:grid;place-items:center}
.badge svg{position:absolute;inset:0;animation:spin 18s linear infinite}
.badge span{width:56px;height:56px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:20px}
@keyframes spin{to{transform:rotate(360deg)}}
.foot-b{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:clamp(64px,10vh,120px);padding-top:22px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
.foot-b a:hover{color:var(--ink)}
@media(max-width:760px){.ct-row{grid-template-columns:minmax(0,1fr)}.badge{display:none}.copy{margin:10px 0 0 0;display:block}}
`;

function Letters({ text }: { text: string }) {
  const hop = (e: React.PointerEvent<HTMLSpanElement>) => {
    const t = e.currentTarget; t.classList.remove("hop"); void t.offsetWidth; t.classList.add("hop");
  };
  return <>{text.split("").map((ch, i) => <span key={i} className="c" aria-hidden onPointerEnter={hop}>{ch}</span>)}</>;
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); setCopied(true); clearTimeout(t.current); t.current = setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
  };
  return (
    <section id="contact" className="section ct" aria-labelledby="contact-h">
      <style>{css}</style>
      <div className="wrap">
        <p className="tag rv"><b>06</b><span aria-hidden>—</span><span>Contact</span></p>
        <h2 className="big" id="contact-h">
          <span className="sr">Let&rsquo;s build something together.</span>
          <span className="ln"><Letters text="Let’s build" /></span>
          <span className="ln"><em><Letters text="something together." /></em></span>
        </h2>
        <div className="ct-row">
          <div>
            <a className="mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <button className="copy" onClick={copy} aria-label="Copy email address"><span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span></button>
            <div className="links">
              <a className="btn btn-primary" href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
          </div>
          <div className="badge" aria-hidden>
            <svg viewBox="0 0 150 150"><defs><path id="circ" d="M75 75m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0" /></defs>
              <text fontFamily="var(--font-mono)" fontSize="11.5" letterSpacing="3.2" fill="#0d0d0d"><textPath href="#circ">say hello • say hello • say hello • say hello •</textPath></text></svg>
            <span>↗</span>
          </div>
        </div>
        <footer className="foot-b">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget("top"); }}>Back to top</a>
          <span>Built with Next.js</span>
        </footer>
      </div>
    </section>
  );
}
