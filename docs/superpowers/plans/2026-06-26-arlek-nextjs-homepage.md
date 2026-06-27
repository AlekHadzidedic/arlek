# arlek.ca Next.js Homepage Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the static `index.html` mockup to a Next.js app (App Router, TypeScript, Tailwind v4) that renders the homepage pixel-close to the mockup and deploys to Vercel.

**Architecture:** Single homepage composed from focused section components. Project cards are driven by a typed data array. Design tokens from the mockup become Tailwind v4 `@theme` variables. Satoshi font loads locally via `next/font/local`. Component behavior (data rendering, metadata, no external font link) is covered by Vitest + React Testing Library; layout fidelity is verified by build + screenshot comparison against the mockup.

**Tech Stack:** Next.js (App Router) · TypeScript · Tailwind v4 · pnpm · Vitest + @testing-library/react + jsdom · next/font/local

## Global Constraints

- Package manager: **pnpm**. Node: v22.
- Styling: **Tailwind v4** only, tokens via `@theme` in `app/globals.css`. No inline `<style>` blocks.
- Font: **Satoshi via `next/font/local`** (weights 400/500/600/700). No Fontshare `<link>`, no external font preconnect.
- Single responsive breakpoint at **860px**, matching mockup behavior.
- All copy (hero text, project names, descriptions, tags, footer email, meta description) copied **verbatim** from `index.html`. Do not paraphrase.
- Deploy target: **Vercel**, zero-config. No deployment adapter.
- The unused `.decision` CSS block from the mockup is **dropped**, not ported.
- TypeScript strict; `pnpm build` must pass with no type errors.

### Token reference (used across tasks)

| `@theme` variable | Value |
|---|---|
| `--color-bg` | `#080809` |
| `--color-bg-2` | `#0F0F11` |
| `--color-fg` | `#FAFAFA` |
| `--color-fg-2` | `#B7B7BD` |
| `--color-fg-3` | `#75757C` |
| `--color-line` | `rgba(250,250,250,0.08)` |
| `--color-line-2` | `rgba(250,250,250,0.14)` |

### Project data (verbatim from mockup, in order)

| name | tag | gradient (from→to) | desc |
|---|---|---|---|
| Zinc North | Client | `#1a1d24` → `#2a2f3a` | Industrial plating & coating manufacturer. Site rebuild on Cloudflare Workers. |
| PianoChords | Product | `#0f1220` → `#1c2140` | Interactive chord & progression explorer for pianists. |
| Spend Monitor | Automation | `#0e1a14` → `#1a2e24` | Parses bank emails, classifies transactions, monthly view with alerts. |
| Sonja Paints | Portfolio | `#181614` → `#2a2520` | Sanity-backed portfolio for a contemporary painter. |
| Inside Joke | Pro-bono | `#201418` → `#2e1d25` | Lightweight content site. |

Note `&` in descriptions appears as `&amp;` in the mockup HTML — in JSX/TSX strings use a plain `&`.

---

## Task 1: Scaffold Next.js app

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (via create-next-app)
- Create: `.gitignore` additions for Next (`/.next`, `/node_modules`, `/out`)

**Interfaces:**
- Produces: a building Next.js App Router project at repo root using pnpm and Tailwind v4.

- [ ] **Step 1: Scaffold into repo root**

The repo root already contains `index.html`, `README.md`, `docs/`. create-next-app refuses a non-empty dir with conflicting files, but `index.html`/`README.md`/`docs` do not conflict with its generated files. Run:

```bash
pnpm dlx create-next-app@latest . \
  --ts --tailwind --app --src-dir=false \
  --eslint --no-import-alias --use-pnpm --no-git
```

If it still refuses due to non-empty dir, scaffold into a temp subdir and move files up:

```bash
pnpm dlx create-next-app@latest .arlek-tmp --ts --tailwind --app --src-dir=false --eslint --no-import-alias --use-pnpm --no-git
# then move generated files (app/, package.json, tsconfig.json, next.config.*, postcss/eslint configs, public/) to root and remove .arlek-tmp
```

- [ ] **Step 2: Verify Tailwind v4 is installed**

Run: `pnpm ls tailwindcss`
Expected: version `4.x`. If create-next-app installed v3, upgrade: `pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest` and set `postcss.config.mjs` to use `@tailwindcss/postcss`. Confirm `app/globals.css` starts with `@import "tailwindcss";`.

- [ ] **Step 3: Strip create-next-app boilerplate**

Replace `app/page.tsx` with a minimal placeholder and clear the demo CSS from `app/globals.css` below the `@import` line. Remove `app/page.module.css` if present and any demo SVGs in `public/` (next.svg, vercel.svg).

`app/page.tsx`:
```tsx
export default function Home() {
  return <main />;
}
```

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: build succeeds, no type errors. A blank page renders.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind v4"
```

---

## Task 2: Design tokens, global styles, Satoshi font

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `app/fonts/` (Satoshi `.woff2` files)

**Interfaces:**
- Produces: Tailwind theme tokens (`bg`, `bg-2`, `fg`, `fg-2`, `fg-3`, `line`, `line-2`) usable as utilities; `body` styled with Satoshi, base bg/fg, antialiasing, `ss01`/`ss02`.

- [ ] **Step 1: Add Satoshi font files**

Download Satoshi weights 400/500/600/700 as `.woff2` into `app/fonts/`:
`Satoshi-Regular.woff2`, `Satoshi-Medium.woff2`, `Satoshi-Bold.woff2`, and `Satoshi-Semibold.woff2` (600). Source: Fontshare (the mockup already used Fontshare-hosted Satoshi). If a weight is unavailable as woff2, fetch the variable woff2 `Satoshi-Variable.woff2` and declare a single variable face spanning 400–700 instead.

- [ ] **Step 2: Bind font in layout**

In `app/layout.tsx`:
```tsx
import localFont from "next/font/local";

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});
```
Apply `className={satoshi.variable}` on `<html>`. (If using the variable font, declare one `src` entry with `weight: "400 700"`.)

- [ ] **Step 3: Write tokens and base styles in globals.css**

```css
@import "tailwindcss";

@theme {
  --color-bg: #080809;
  --color-bg-2: #0F0F11;
  --color-fg: #FAFAFA;
  --color-fg-2: #B7B7BD;
  --color-fg-3: #75757C;
  --color-line: rgba(250, 250, 250, 0.08);
  --color-line-2: rgba(250, 250, 250, 0.14);
  --font-sans: var(--font-satoshi), system-ui, sans-serif;
}

html, body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01", "ss02";
}
* { box-sizing: border-box; margin: 0; padding: 0; }
```

- [ ] **Step 4: Verify**

Run: `pnpm build`
Expected: build passes. Then `pnpm dev`, load `/`, confirm dark `#080809` background and Satoshi applied, **no console errors** and no network request to `api.fontshare.com`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, base styles, local Satoshi font"
```

---

## Task 3: Project data + ProjectCard + Work grid

**Files:**
- Create: `content/projects.ts`
- Create: `components/ProjectCard.tsx`
- Create: `components/Work.tsx`
- Create: `components/SectionHead.tsx`
- Test: `components/__tests__/Work.test.tsx`

**Interfaces:**
- Produces:
  - `content/projects.ts` exports `type Project = { name: string; tag: "Client" | "Product" | "Automation" | "Portfolio" | "Pro-bono"; desc: string; from: string; to: string }` and `const projects: Project[]`.
  - `components/ProjectCard.tsx` default export `ProjectCard({ project }: { project: Project })`.
  - `components/SectionHead.tsx` default export `SectionHead({ label, counter }: { label: string; counter: string })`.
  - `components/Work.tsx` default export `Work()` rendering `SectionHead` + grid of `ProjectCard`.

- [ ] **Step 1: Set up Vitest + RTL**

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```
Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
});
```
Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```
Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the project data**

`content/projects.ts`:
```ts
export type Project = {
  name: string;
  tag: "Client" | "Product" | "Automation" | "Portfolio" | "Pro-bono";
  desc: string;
  from: string;
  to: string;
};

export const projects: Project[] = [
  { name: "Zinc North", tag: "Client", desc: "Industrial plating & coating manufacturer. Site rebuild on Cloudflare Workers.", from: "#1a1d24", to: "#2a2f3a" },
  { name: "PianoChords", tag: "Product", desc: "Interactive chord & progression explorer for pianists.", from: "#0f1220", to: "#1c2140" },
  { name: "Spend Monitor", tag: "Automation", desc: "Parses bank emails, classifies transactions, monthly view with alerts.", from: "#0e1a14", to: "#1a2e24" },
  { name: "Sonja Paints", tag: "Portfolio", desc: "Sanity-backed portfolio for a contemporary painter.", from: "#181614", to: "#2a2520" },
  { name: "Inside Joke", tag: "Pro-bono", desc: "Lightweight content site.", from: "#201418", to: "#2e1d25" },
];
```

- [ ] **Step 3: Write the failing test**

`components/__tests__/Work.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import Work from "../Work";
import { projects } from "../../content/projects";

test("renders every project name and description", () => {
  render(<Work />);
  for (const p of projects) {
    expect(screen.getByText(p.name)).toBeInTheDocument();
    expect(screen.getByText(p.desc)).toBeInTheDocument();
  }
});

test("renders the selected-work section head", () => {
  render(<Work />);
  expect(screen.getByText("Selected work")).toBeInTheDocument();
  expect(screen.getByText("05 · 2024–2026")).toBeInTheDocument();
});
```

- [ ] **Step 4: Run test, verify it fails**

Run: `pnpm test`
Expected: FAIL — `Work` module not found.

- [ ] **Step 5: Implement SectionHead**

`components/SectionHead.tsx`:
```tsx
export default function SectionHead({ label, counter }: { label: string; counter: string }) {
  return (
    <div className="flex items-baseline justify-between px-5 pb-3.5 pt-7 md:px-10">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-fg-3">{label}</div>
      <div className="text-xs tabular-nums text-fg-3">{counter}</div>
    </div>
  );
}
```

- [ ] **Step 6: Implement ProjectCard**

`components/ProjectCard.tsx`:
```tsx
import type { Project } from "../content/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a className="group flex cursor-pointer flex-col gap-2.5">
      <div
        className="aspect-[4/3] overflow-hidden rounded-md border border-line transition duration-200 group-hover:-translate-y-0.5 group-hover:border-line-2"
        style={{ background: `linear-gradient(135deg, ${project.from}, ${project.to})` }}
      />
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-base font-semibold tracking-[-0.01em]">{project.name}</div>
        <div className="whitespace-nowrap text-[11px] font-medium uppercase text-fg-3">{project.tag}</div>
      </div>
      <div className="text-[13px] leading-[1.45] text-fg-2">{project.desc}</div>
    </a>
  );
}
```

- [ ] **Step 7: Implement Work**

`components/Work.tsx`:
```tsx
import SectionHead from "./SectionHead";
import ProjectCard from "./ProjectCard";
import { projects } from "../content/projects";

export default function Work() {
  return (
    <>
      <SectionHead label="Selected work" counter="05 · 2024–2026" />
      <section className="grid grid-cols-2 gap-3.5 px-5 pb-8 md:grid-cols-3 md:gap-[18px] md:px-10">
        {projects.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </section>
    </>
  );
}
```

- [ ] **Step 8: Run tests, verify pass**

Run: `pnpm test`
Expected: PASS (both tests).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add project data and Work grid with cards"
```

---

## Task 4: TopBar, Hero, CTA, Footer

**Files:**
- Create: `components/TopBar.tsx`
- Create: `components/Hero.tsx`
- Create: `components/CTA.tsx`
- Create: `components/Footer.tsx`
- Test: `components/__tests__/sections.test.tsx`

**Interfaces:**
- Produces default exports `TopBar()`, `Hero()`, `CTA()`, `Footer()` — no props.

- [ ] **Step 1: Write the failing test**

`components/__tests__/sections.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import TopBar from "../TopBar";
import Hero from "../Hero";
import Footer from "../Footer";

test("topbar shows availability and book link", () => {
  render(<TopBar />);
  expect(screen.getByText("Available · April 2026")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /book a call/i })).toBeInTheDocument();
});

test("hero contains the headline copy", () => {
  render(<Hero />);
  expect(screen.getByText(/Modern websites and quiet automations/)).toBeInTheDocument();
});

test("footer links the contact email", () => {
  render(<Footer />);
  const mail = screen.getByRole("link", { name: "hello@arlek.ca" });
  expect(mail).toHaveAttribute("href", "mailto:hello@arlek.ca");
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm test`
Expected: FAIL — section modules not found.

- [ ] **Step 3: Implement TopBar**

`components/TopBar.tsx`:
```tsx
export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-[18px] md:px-10">
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold tracking-[-0.02em]">
          Arlek<span className="font-normal text-fg-3">.ca</span>
        </div>
        <span className="hidden items-center gap-[7px] rounded-full border border-line-2 px-2.5 py-1 text-[11.5px] font-medium text-fg-2 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6BCB77] shadow-[0_0_6px_#6BCB77]" />
          Available · April 2026
        </span>
      </div>
      <a
        href="#book"
        className="inline-flex items-center gap-2 rounded-full bg-fg px-[18px] py-[9px] text-[13px] font-semibold text-bg hover:bg-white"
      >
        Book a call →
      </a>
    </header>
  );
}
```

- [ ] **Step 4: Implement Hero**

`components/Hero.tsx`:
```tsx
export default function Hero() {
  return (
    <section className="border-b border-line px-5 pb-9 pt-14 md:px-10 md:pb-[56px] md:pt-[88px]">
      <h1 className="max-w-[19ch] text-[clamp(38px,5.2vw,76px)] font-semibold leading-[1.02] tracking-[-0.03em]">
        Modern websites and quiet automations{" "}
        <span className="text-fg-3">for Canadian small businesses.</span>
      </h1>
    </section>
  );
}
```

- [ ] **Step 5: Implement CTA**

`components/CTA.tsx`:
```tsx
export default function CTA() {
  return (
    <section className="grid grid-cols-1 items-center gap-[18px] border-t border-line px-5 py-12 md:grid-cols-[1.4fr_1fr] md:gap-10 md:px-10">
      <div className="text-[clamp(22px,2.4vw,30px)] font-semibold leading-[1.2] tracking-[-0.02em]">
        Site dated, slow, or embarrassing to send? <span className="text-fg-3">Let&apos;s fix that.</span>
      </div>
      <div className="flex flex-wrap justify-start gap-2.5 md:justify-end">
        <a href="#book" className="inline-flex items-center gap-1.5 rounded-full bg-fg px-[18px] py-2.5 text-[13px] font-semibold text-bg">
          Book a 20-min call →
        </a>
        <a href="mailto:hello@arlek.ca" className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-[18px] py-2.5 text-[13px] font-semibold text-fg-2 hover:border-fg hover:text-fg">
          Send a note
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Implement Footer**

`components/Footer.tsx`:
```tsx
export default function Footer() {
  return (
    <footer className="flex flex-col items-start gap-1.5 border-t border-line px-5 py-3.5 text-xs text-fg-3 md:flex-row md:items-center md:justify-between md:px-10">
      <div>© 2026 Arlek</div>
      <div>
        <a href="mailto:hello@arlek.ca" className="text-fg-3 hover:text-fg">hello@arlek.ca</a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Run tests, verify pass**

Run: `pnpm test`
Expected: PASS (all section tests).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add TopBar, Hero, CTA, Footer sections"
```

---

## Task 5: Compose page + layout metadata

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Test: `app/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: `TopBar`, `Hero`, `Work`, `CTA`, `Footer` (default exports, no props).
- Produces: full homepage at `/`; `metadata` export with title, description, Open Graph.

- [ ] **Step 1: Write the failing test**

`app/__tests__/page.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import Home from "../page";

test("homepage renders hero, all projects, and footer email", () => {
  render(<Home />);
  expect(screen.getByText(/Modern websites and quiet automations/)).toBeInTheDocument();
  expect(screen.getByText("Zinc North")).toBeInTheDocument();
  expect(screen.getByText("Inside Joke")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "hello@arlek.ca" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm test`
Expected: FAIL — page still renders empty `<main />`.

- [ ] **Step 3: Compose the page**

`app/page.tsx`:
```tsx
import TopBar from "../components/TopBar";
import Hero from "../components/Hero";
import Work from "../components/Work";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <Hero />
      <Work />
      <CTA />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Set layout metadata**

In `app/layout.tsx`, export:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arlek — websites & automations for Canadian small businesses",
  description:
    "Arlek is a one-person studio in Ottawa building modern websites and quiet automations for Canadian small businesses.",
  openGraph: {
    title: "Arlek — websites & automations for Canadian small businesses",
    description:
      "Arlek is a one-person studio in Ottawa building modern websites and quiet automations for Canadian small businesses.",
    type: "website",
    url: "https://arlek.ca",
  },
};
```
Ensure `<html lang="en">` and `<body>` wrap `{children}`.

- [ ] **Step 5: Run tests, verify pass**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: compose homepage and add metadata"
```

---

## Task 6: Visual verification + remove old mockup

**Files:**
- Delete: `index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: full app from Tasks 1–5.

- [ ] **Step 1: Build and run**

Run: `pnpm build` (expect clean, no type errors), then `pnpm dev`.

- [ ] **Step 2: Screenshot desktop**

Serve/visit `http://localhost:3000` at viewport 1280×900, full-page screenshot. Compare against the mockup desktop render: hero left-aligned, 3-col work grid with gradient tiles, CTA two-up, footer split. Note any divergence and fix the offending component before proceeding.

- [ ] **Step 3: Screenshot mobile**

Viewport 390×844, full-page screenshot. Confirm: availability pill hidden, work grid 2-col, CTA stacked, footer stacked.

- [ ] **Step 4: Confirm no console errors**

In the dev session, check the browser console — zero errors, and no request to `api.fontshare.com`.

- [ ] **Step 5: Remove the old mockup and update README**

Delete `index.html`. Update `README.md` to describe the Next.js app (dev: `pnpm dev`, build: `pnpm build`, deploy: Vercel) and drop the "single-page mockup / Next.js build comes next" line.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: remove static mockup, update README for Next.js app"
```

---

## Self-Review

- **Spec coverage:** stack (T1), Tailwind v4 tokens (T2), local Satoshi font + no Fontshare (T2), file structure / componentization (T3–T5), typed projects data (T3), 860px responsive behavior (T3–T5 classes), metadata + OG (T5), drop `.decision` (never ported), remove index.html (T6), success criteria build/console/screenshots (T6). Covered.
- **Placeholder scan:** every code step shows full code; no TBD/TODO.
- **Type consistency:** `Project` shape (`name/tag/desc/from/to`) defined in T3, consumed identically in `ProjectCard` (T3) and tests; component default-export names match imports in `page.tsx` (T5).
