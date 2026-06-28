# arlek.ca — Next.js homepage rebuild

**Date:** 2026-06-26
**Status:** Approved
**Scope:** Port the existing static `index.html` mockup to a Next.js application. Homepage only.

## Goal

Replace the single-file static mockup (`index.html`) with a maintainable Next.js codebase that renders the homepage pixel-close to the current mockup, deploys to Vercel, and provides a clean foundation for future pages (booking, contact, case studies) without rework.

This pass ports the homepage 1:1. It does not add functionality.

## Stack

- **Framework:** Next.js, App Router, TypeScript. Scaffolded with `create-next-app`.
- **Styling:** Tailwind v4 using `@theme` design tokens in `globals.css`.
- **Font:** Satoshi loaded via `next/font/local` (weights 400/500/600/700). Removes the runtime Fontshare `<link>` and its console error / FOUT. Font files committed under `app/fonts/`.
- **Package manager:** pnpm.
- **Deploy:** Vercel (zero-config). No adapter needed.

## File structure

```
app/
  layout.tsx        # html/body shell, font binding, site metadata
  page.tsx          # composes the section components in order
  globals.css       # @import "tailwindcss" + @theme tokens
  fonts/            # Satoshi .woff2 files
components/
  TopBar.tsx        # mark "Arlek.ca" + availability pill + Book button
  Hero.tsx          # h1 with dimmed trailing clause
  SectionHead.tsx   # reusable label + counter row ("Selected work" / "05 · 2024–2026")
  Work.tsx          # grid; maps over projects[]
  ProjectCard.tsx   # one card: gradient media tile, name, tag, desc
  CTA.tsx           # closing prompt + two CTA buttons
  Footer.tsx        # copyright + email
content/
  projects.ts       # typed Project[] data
```

## Design tokens

Port the mockup's CSS custom properties into Tailwind `@theme`:

| Token | Value | Tailwind use |
|-------|-------|--------------|
| `--color-bg` | `#080809` | `bg-bg` |
| `--color-bg-2` | `#0F0F11` | `bg-bg-2` |
| `--color-fg` | `#FAFAFA` | `text-fg` |
| `--color-fg-2` | `#B7B7BD` | `text-fg-2` |
| `--color-fg-3` | `#75757C` | `text-fg-3` |
| `--color-line` | `rgba(250,250,250,.08)` | `border-line` |
| `--color-line-2` | `rgba(250,250,250,.14)` | `border-line-2` |

`font-feature-settings: "ss01","ss02"` and antialiasing applied on `body` in `globals.css`. Hero `clamp(38px, 5.2vw, 76px)` kept via a Tailwind arbitrary value or a small CSS rule.

## Content model

```ts
// content/projects.ts
type Project = {
  name: string;
  tag: "Client" | "Product" | "Automation" | "Portfolio" | "Pro-bono";
  desc: string;
  gradient: string;   // tailwind/class key mapping to the per-card gradient
};
```

Five entries, in mockup order: Zinc North (Client), PianoChords (Product), Spend Monitor (Automation), Sonja Paints (Portfolio), Inside Joke (Pro-bono). Descriptions copied verbatim from the mockup.

Gradient tiles remain CSS-only placeholders this pass (no images). `ProjectCard` selects the gradient from the data key.

## Responsive behavior

Single breakpoint at 860px, matching the mockup:
- Padding shrinks 40px → 20px.
- Availability pill hidden on mobile.
- Work grid 3-col → 2-col.
- CTA row stacks; footer stacks.

## Metadata

`layout.tsx` exports `metadata`: title, description (verbatim from mockup `<meta>`), plus basic Open Graph (title, description, type=website, url). Lang `en`.

## Out of scope (explicitly)

- Booking integration, contact form, server actions, mailto wiring beyond the existing footer `mailto:`.
- Additional pages or routes.
- Real project screenshots / image assets.
- The unused `.decision` CSS block from the mockup — dropped, not ported.
- Analytics, SEO sitemap, robots.

## Success criteria

- `pnpm dev` renders the homepage matching the mockup at desktop (≥860px) and mobile (<860px), verified by screenshot comparison against the current mockup.
- No console errors (Fontshare error eliminated by local font).
- `pnpm build` succeeds with no type errors.
- Each section is its own component; project data lives in `content/projects.ts`, not inline JSX.

## Verification

1. Screenshot rebuild at 1280px and 390px; compare against mockup renders.
2. Confirm no console errors in the running dev server.
3. `pnpm build` clean.
