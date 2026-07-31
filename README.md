# Studio Noir — Creative Agency Website

A premium, Awwwards-inspired marketing site for a freelance web design &
development practice. Built with Next.js App Router, TypeScript, Tailwind
CSS, Framer Motion, GSAP (ScrollTrigger), Lenis smooth scrolling, and a
minimal React Three Fiber scene in the hero.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

- **Next.js 14 (App Router)** — routing, image optimization, metadata API
- **Tailwind CSS** — all styling is utility classes; `app/globals.css` only
  contains Tailwind's base layers plus a handful of `@layer` primitives
  (focus rings, selection color, reduced-motion) that Tailwind utilities
  can't express directly
- **Framer Motion** — text reveals, page/menu transitions, scroll-linked
  parallax
- **GSAP + ScrollTrigger** — the pinned horizontal work gallery, marquee,
  and magnetic button physics
- **Lenis** — smooth scrolling, synced to GSAP's ticker and ScrollTrigger
- **React Three Fiber** — a single lightweight wireframe form in the hero,
  lazy-loaded client-side only (`next/dynamic`, `ssr: false`)
- **Lucide** — icon set

## Structure

```
app/            Routes, layout, metadata, sitemap/robots
components/     Section components + reusable primitives
hooks/          useMagnetic, useInView
lib/            SmoothScroll provider (Lenis + GSAP wiring)
data/           Project & service content
```

## Design tokens

| Token      | Value      |
| ---------- | ---------- |
| Background | `#F8F8F6`  |
| Surface    | `#EFEDE8`  |
| Ink (text) | `#111111`  |
| Muted      | `#6B6B6B`  |
| Accent     | `#000000`  |
| Radius     | `28px`     |

Fonts: the brief calls for PP Neue Montreal / General Sans / Satoshi,
which are licensed foundry fonts (Pangram Pangram / Fontshare) that can't
be redistributed here. `app/layout.tsx` loads free, visually adjacent
`next/font/google` substitutes (Bricolage Grotesque for display, Inter for
body, JetBrains Mono for labels) through the same `--font-display` /
`--font-body` / `--font-mono` CSS variables — swap in the licensed font
files there when available and nothing else needs to change.

## Notes

- Images use a placeholder Unsplash set (swap for real project photography
  in `data/projects.ts` and `About.tsx`/`Contact.tsx`).
- Replace the mailto address, social links, and legal copy before launch.
- Custom cursor auto-disables on coarse pointers (touch devices).
- All animation respects `prefers-reduced-motion`.
