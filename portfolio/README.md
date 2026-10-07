# Bade Nandini — Portfolio

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis. No GSAP, no three.js, no external scripts at runtime. Fonts are self-hosted.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL` to your deployed URL so Open Graph images resolve.

## Content

Everything on the page comes from `src/lib/data.ts`, which was written from `Bade_Nandini_Resume.pdf`. Components only read from it. Edit that file to change text, and nothing else needs touching.
Things deliberately left out because the résumé does not contain them: achievements/ranks, ID number, internships or jobs, project repository links, certificate links.
The résumé lists "AI Tools" under both Artificial Intelligence and Tools; it appears once in the skills grid.

## Sections

| # | Section | Component | Motion |
|---|---|---|---|
| – | Hero | `hero/Hero.tsx` | Looping intro video (multiply-blended), sound button, pauses off-screen |
| 01 | About | `sections/About.tsx` | Lanyard ID card: damped pendulum, flip (hover / tap / Enter / Space) |
| 02 | Skills | `sections/Skills.tsx` | Periodic-table grid, diagonal wave reveal, family filter, inspector |
| 03 | Work | `sections/Work.tsx` | Expanding accordion; vertical accordion on mobile |
| 04 | Certifications | `sections/Certifications.tsx` | Ink-flood rows |
| 05 | Experience | `sections/Experience.tsx` | Scroll-drawn timeline (education + experience) |
| 06 | Contact | `sections/Contact.tsx` | Hopping letters, copy-email chip, spinning badge |

## Rebuilding the hero video

Requires `ffmpeg`, `ffprobe`, Python 3 and `numpy`.

```bash
python3 scripts/build-hero-assets.py scripts/intro.mp4
# or force a crop:  --crop=W:H:X:Y
```

It detects the person and crops head to toe at 768×960, measures the backdrop and whitens it to pure white, builds a 0.5 s cross-faded loop (video via `xfade`, audio cross-faded in numpy so there is no click), and writes `public/hero/hero.mp4`, `public/hero/hero.webm`, `public/portrait-bust.webp` and `public/og.jpg`. Lip-sync is never retimed.

## Credits

Brand logos in `public/logos/` are from [Devicon](https://github.com/devicons/devicon) (MIT, see `LICENSE-devicon.txt`). Logos remain trademarks of their owners. Fonts: Inter Tight, Instrument Serif and JetBrains Mono (SIL OFL 1.1).
