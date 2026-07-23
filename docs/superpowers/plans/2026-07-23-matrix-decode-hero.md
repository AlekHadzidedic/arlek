# Matrix Decode Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give arlek.ca a one-time character-decode hero in a mono display face, and make the Work and Rebuild sections legible on mobile.

**Architecture:** A `Decode` client component owns all scramble logic and is used only by `Hero`. Everything else is token, type-scale, and layout changes across existing components. No animation library.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, `next/font/local`, Vitest + Testing Library.

## Global Constraints

- Display/utility face: **Monaspace Krypton**, weights 500 and 600, self-hosted `.woff2`, latin subset. Loaded via `next/font/local` under CSS var `--font-krypton`, exposed as Tailwind `--font-mono`.
- Body face: **Satoshi**, unchanged.
- Accent token: `--color-accent: #4ADE80`. Four permitted uses only: in-flight decode characters, availability dot, section-head leader rule, link hover underline. Never a background, never body text, never a button fill.
- `--color-fg-3` becomes `#7E7E86` (was `#75757C`).
- Scramble alphabet contains **no katakana** — the latin subset has no such glyphs and would render tofu: `A–Z a–z 0–9 / \ < > [ ] { } # $ % & * + = _ | ~ ^`
- Decode runs **once** on mount. No loop, no scroll re-trigger.
- Decode appears on the `h1` and nowhere else.
- All font sizes in `rem`, never `px`.
- Both former `#book` links become `mailto:hello@arlek.ca?subject=Website%20project`, labelled "Start a project".
- Every section head renders `<h2>`; every project name renders `<h3>`.

---

### Task 1: Install the Monaspace Krypton font files

**Files:**
- Create: `app/fonts/MonaspaceKrypton-Medium.woff2`
- Create: `app/fonts/MonaspaceKrypton-SemiBold.woff2`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS var `--font-krypton`; Tailwind utility `font-mono`; color tokens `--color-accent`, updated `--color-fg-3`.

- [ ] **Step 1: Extract the two weights from the npm package**

The package ships static weights only — there is no variable file despite the package keywords. Pull the files out; do not add the package as a dependency.

```bash
cd "$(mktemp -d)" && npm pack @fontsource/monaspace-krypton@5.3.0 --silent >/dev/null \
  && tar -xzf fontsource-monaspace-krypton-5.3.0.tgz
cp package/files/monaspace-krypton-latin-500-normal.woff2 <repo>/app/fonts/MonaspaceKrypton-Medium.woff2
cp package/files/monaspace-krypton-latin-600-normal.woff2 <repo>/app/fonts/MonaspaceKrypton-SemiBold.woff2
```

- [ ] **Step 2: Register the font in `app/layout.tsx`**

```tsx
const krypton = localFont({
  src: [
    { path: "./fonts/MonaspaceKrypton-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/MonaspaceKrypton-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-krypton",
  display: "swap",
});
```

And on `<html>`: `className={`${satoshi.variable} ${krypton.variable}`}`

- [ ] **Step 3: Add tokens in `app/globals.css`**

```css
@theme {
  --color-bg: #080809;
  --color-bg-2: #0F0F11;
  --color-fg: #FAFAFA;
  --color-fg-2: #B7B7BD;
  --color-fg-3: #7E7E86;
  --color-accent: #4ADE80;
  --color-line: rgba(250, 250, 250, 0.08);
  --color-line-2: rgba(250, 250, 250, 0.14);
  --font-sans: var(--font-satoshi), system-ui, sans-serif;
  --font-mono: var(--font-krypton), ui-monospace, SFMono-Regular, monospace;
}
```

- [ ] **Step 4: Add the reduced-motion floor in `app/globals.css`**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Verify the build compiles**

Run: `pnpm build`
Expected: success, no font resolution errors.

- [ ] **Step 6: Commit**

```bash
git add app/fonts app/layout.tsx app/globals.css
git commit -m "feat: add Monaspace Krypton, accent token, contrast fix"
```

---

### Task 2: The `Decode` component

**Files:**
- Create: `components/Decode.tsx`
- Test: `components/__tests__/Decode.test.tsx`

**Interfaces:**
- Produces: `export default function Decode({ text, className, delay }: { text: string; className?: string; delay?: number })` and `export const STAGGER_MS: number`.

**Three constraints that drive the implementation:**

1. **SSR renders real text.** Initial state must be the final string, not scrambled. Shipping a scrambled `h1` means Google indexes garbage. The component renders plain text on the server and on first client render, then swaps to the animated form in `useEffect` — no hydration mismatch, because the first client render matches the server.

2. **Words must not break mid-word.** Per-character `<span>`s let the browser wrap at any character. Characters are grouped into word-level `inline-block` spans so breaks only happen at spaces.

3. **Render must stay pure.** Glyph randomisation happens inside the animation frame callback and is stored in state — never computed during render.

- [ ] **Step 1: Write the failing tests**

```tsx
import { render, screen } from "@testing-library/react";
import Decode from "../Decode";

test("renders the real text on first paint", () => {
  render(<Decode text="Websites and automation" />);
  expect(screen.getByText("Websites and automation")).toBeInTheDocument();
});

test("renders real text when reduced motion is preferred", () => {
  window.matchMedia = ((q: string) => ({
    matches: true, media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  render(<Decode text="Canadian small businesses" />);
  expect(screen.getByText("Canadian small businesses")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm vitest run components/__tests__/Decode.test.tsx`
Expected: FAIL — cannot resolve `../Decode`.

- [ ] **Step 3: Implement `components/Decode.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\<>[]{}#$%&*+=_|~^";

const SCRAMBLE_MS = 260;
export const STAGGER_MS = 14;
const FRAME_MS = 50;

type Cell = { ch: string; locked: boolean };

export default function Decode({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [cells, setCells] = useState<Cell[] | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const total = delay + SCRAMBLE_MS + text.length * STAGGER_MS;
    let raf = 0;
    let start = 0;
    let last = -Infinity;

    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;

      if (elapsed - last >= FRAME_MS) {
        last = elapsed;
        setCells(
          [...text].map((ch, i) => {
            if (ch === " ") return { ch, locked: true };
            const revealAt = delay + SCRAMBLE_MS + i * STAGGER_MS;
            if (elapsed >= revealAt) return { ch, locked: true };
            return { ch: GLYPHS[(Math.random() * GLYPHS.length) | 0], locked: false };
          }),
        );
      }

      if (elapsed < total) raf = requestAnimationFrame(tick);
      else setCells(null);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);

  if (cells === null) return <span className={className}>{text}</span>;

  const words: Cell[][] = [];
  let current: Cell[] = [];
  for (const cell of cells) {
    if (cell.ch === " ") {
      words.push(current);
      current = [];
    } else {
      current.push(cell);
    }
  }
  words.push(current);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span className={className} aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi}>
            {wi > 0 ? " " : null}
            <span className="inline-block">
              {word.map((cell, ci) => (
                <span key={ci} className={cell.locked ? undefined : "text-accent"}>
                  {cell.ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run components/__tests__/Decode.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add components/Decode.tsx components/__tests__/Decode.test.tsx
git commit -m "feat: add Decode component"
```

---

### Task 3: Hero

**Files:**
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `Decode`, `STAGGER_MS` from Task 2.

**Sizing constraint:** Monaspace advance width is 0.6em, materially wider than Satoshi. The existing `clamp(38px, 5.2vw, 76px)` overflows at every width in mono — 29 characters at 76px is 1322px against 1360px available at 1440, and catastrophic at 375. New scale is `clamp(1.75rem, 4.6vw, 4rem)` (28px→64px), which fits the longest word at 375 and the longest line at 1440 with room to spare.

- [ ] **Step 1: Rewrite `components/Hero.tsx`**

```tsx
import Decode, { STAGGER_MS } from "./Decode";

const LINE_1 = "Websites and automation";
const LINE_2 = "for Canadian small businesses.";

export default function Hero() {
  return (
    <section className="border-b border-line px-5 pb-9 pt-14 md:px-10 md:pb-14 md:pt-[5.5rem]">
      <h1 className="max-w-[26ch] font-mono text-[clamp(1.75rem,4.6vw,4rem)] font-semibold leading-[1.14] tracking-[-0.03em]">
        <Decode text={LINE_1} />{" "}
        <Decode text={LINE_2} className="text-fg-3" delay={LINE_1.length * STAGGER_MS} />
      </h1>
    </section>
  );
}
```

The second line's `delay` continues the stagger from the first, so the decode reads as one continuous left-to-right sweep rather than two independent animations.

- [ ] **Step 2: Verify no horizontal overflow at 375**

Run the dev server and check `document.documentElement.scrollWidth === 375` at a 375px viewport.
Expected: equal, no overflow.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: decode animation on hero headline"
```

---

### Task 4: SectionHead — mono, leader rule, `h2`

**Files:**
- Modify: `components/SectionHead.tsx`

**Interfaces:**
- Produces: `SectionHead` renders `<h2>` containing the label. Props unchanged: `{ label: string; counter: string }`.

- [ ] **Step 1: Rewrite `components/SectionHead.tsx`**

```tsx
export default function SectionHead({ label, counter }: { label: string; counter: string }) {
  return (
    <div className="flex items-center gap-4 px-5 pb-3.5 pt-7 md:px-10">
      <h2 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-fg-2">
        {label}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/25 to-line" />
      <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.08em] text-fg-3">
        {counter}
      </span>
    </div>
  );
}
```

The label moves from `text-fg-3` to `text-fg-2` — mono at 11px is optically lighter than Satoshi at the same size, and this is the page's structural signposting.

- [ ] **Step 2: Commit**

```bash
git add components/SectionHead.tsx
git commit -m "feat: mono section heads with leader rule, render h2"
```

---

### Task 5: Work grid legibility + `h3`

**Files:**
- Modify: `components/Work.tsx`
- Modify: `components/ProjectCard.tsx`

**Problem:** `grid-cols-2` at 375 yields ~160px cards. The three portfolio screenshots — the actual proof of the work — are illegible thumbnails, and the third card orphans on its own row.

- [ ] **Step 1: One-up on mobile in `components/Work.tsx`**

```tsx
<section className="grid grid-cols-1 gap-7 px-5 pb-8 sm:grid-cols-2 sm:gap-3.5 md:grid-cols-3 md:gap-[18px] md:px-10">
```

- [ ] **Step 2: Mono name as `h3` in `components/ProjectCard.tsx`**

```tsx
<h3 className="font-mono text-[0.9375rem] font-medium tracking-[-0.01em]">{project.name}</h3>
<p className="text-[0.8125rem] leading-[1.45] text-fg-2">{project.desc}</p>
```

And on the image wrapper, replace the unconditional hover lift so it respects the motion preference:

```tsx
className="relative aspect-[4/3] overflow-hidden rounded-md border border-line transition duration-200 group-hover:border-line-2 motion-safe:group-hover:-translate-y-0.5"
```

- [ ] **Step 3: Commit**

```bash
git add components/Work.tsx components/ProjectCard.tsx
git commit -m "feat: one-up work grid on mobile, project names as h3"
```

---

### Task 6: Rebuild — legible before/after, testimonial with presence

**Files:**
- Modify: `components/Rebuild.tsx`

**Problem:** two full-page screenshots (1425×3183 and 1425×3745) render at roughly 10% scale on mobile, occupying about two-thirds of a 4080px-tall page while communicating nothing readable. The copy claims "Shown in full, top to bottom", which the rendering cannot deliver.

**Approach:** desktop keeps the full-length shots, because seeing the whole page is the actual argument. Mobile caps each frame at `28rem` with `object-position: top`, a fade-out mask, and an explicit "View full page" link to the raw image. The copy drops the claim it cannot honour.

- [ ] **Step 1: Cap the frame on mobile and add the full-page link**

In `PageFrame`, wrap the image:

```tsx
<div className="relative max-h-[28rem] overflow-hidden md:max-h-none">
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 92vw"
    className="h-auto w-full"
  />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-2 to-transparent md:hidden"
  />
</div>
<a
  href={src}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-1.5 border-t border-line py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-fg-3 hover:text-fg md:hidden"
>
  View full page ↗
</a>
```

- [ ] **Step 2: Mono the frame caption**

```tsx
<span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
  <span className={emphasis ? "text-fg" : "text-fg-3"}>{phase}</span>
  <span className="text-fg-3"> · {detail}</span>
</span>
```

- [ ] **Step 3: Fix the copy that overclaims**

```tsx
<p className="mb-7 max-w-[52ch] text-[0.9375rem] leading-[1.6] text-fg-2">
  A stock Wix template, rebuilt from the ground up — new structure, new copy,
  new code.
</p>
```

- [ ] **Step 4: Give Eric's testimonial presence**

```tsx
<aside className="lg:w-[19rem] lg:shrink-0">
  <figure className="flex max-w-[52ch] flex-col gap-5 border-l-2 border-accent/30 pl-5 lg:sticky lg:top-10">
    <blockquote className="text-[0.9375rem] leading-[1.65] text-fg">
      &ldquo;{quote}&rdquo;
    </blockquote>
    <figcaption className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-3">
      <span className="text-fg-2">Eric</span> · Zinc North
    </figcaption>
  </figure>
</aside>
```

The accent left rule is the third of the four permitted accent uses and ties the quote visually to the evidence beside it.

- [ ] **Step 5: Commit**

```bash
git add components/Rebuild.tsx
git commit -m "feat: legible before/after on mobile, testimonial presence"
```

---

### Task 7: Dead CTAs, rem type scale, tap target

**Files:**
- Modify: `components/TopBar.tsx`
- Modify: `components/CTA.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/Offer.tsx`
- Modify: `components/About.tsx`

**Interfaces:**
- Produces: zero `href="#book"` in the codebase; zero `px` font sizes.

- [ ] **Step 1: `components/TopBar.tsx` — real destination, mono wordmark, accent dot, real hover**

```tsx
export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-[1.125rem] md:px-10">
      <div className="flex items-center gap-4">
        <div className="font-mono text-[1.0625rem] font-semibold tracking-[-0.02em]">
          Arlek<span className="font-medium text-fg-3">.ca</span>
        </div>
        <span className="hidden items-center gap-[7px] rounded-full border border-line-2 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-fg-2 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]" />
          Available for new projects
        </span>
      </div>
      <a
        href="mailto:hello@arlek.ca?subject=Website%20project"
        className="inline-flex items-center gap-2 rounded-full bg-fg px-[1.125rem] py-[0.5625rem] font-mono text-[0.8125rem] font-semibold text-bg transition-opacity hover:opacity-80"
      >
        Start a project →
      </a>
    </header>
  );
}
```

`hover:bg-white` on a `bg-fg` (`#FAFAFA`) button was a 2% lightness change — no perceptible feedback. `hover:opacity-80` is visible.

- [ ] **Step 2: `components/CTA.tsx` — second dead link, rem sizes**

```tsx
export default function CTA() {
  return (
    <section id="book" className="grid grid-cols-1 items-center gap-[1.125rem] border-t border-line px-5 py-12 md:grid-cols-[1.4fr_1fr] md:gap-10 md:px-10">
      <div className="font-mono text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.02em]">
        Site dated, slow, or embarrassing to send?{" "}
        <span className="text-fg-3">Let&apos;s fix that.</span>
      </div>
      <div className="flex flex-wrap justify-start gap-2.5 md:justify-end">
        <a href="mailto:hello@arlek.ca?subject=Website%20project" className="inline-flex items-center gap-1.5 rounded-full bg-fg px-[1.125rem] py-2.5 font-mono text-[0.8125rem] font-semibold text-bg transition-opacity hover:opacity-80">
          Start a project →
        </a>
        <a href="mailto:hello@arlek.ca?subject=Quick%20question" className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-[1.125rem] py-2.5 font-mono text-[0.8125rem] font-semibold text-fg-2 transition-colors hover:border-fg hover:text-fg">
          Send a note
        </a>
      </div>
    </section>
  );
}
```

`id="book"` is kept on the section so any external link already pointing at `arlek.ca/#book` still lands somewhere real.

- [ ] **Step 3: `components/Footer.tsx` — tap target ≥24px**

```tsx
export default function Footer() {
  return (
    <footer className="flex flex-col items-start gap-1.5 border-t border-line px-5 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-fg-3 md:flex-row md:items-center md:justify-between md:px-10">
      <div className="py-1.5">© 2026 Arlek Studios</div>
      <a href="mailto:hello@arlek.ca" className="inline-flex min-h-[1.75rem] items-center py-1.5 text-fg-3 transition-colors hover:text-fg">
        hello@arlek.ca
      </a>
    </footer>
  );
}
```

- [ ] **Step 4: `components/Offer.tsx` — mono numerals and titles, rem sizes**

```tsx
<div className="font-mono text-[1.375rem] font-medium tabular-nums text-accent/70">{s.num}</div>
<h3 className="font-mono text-[0.9375rem] font-semibold tracking-[-0.01em]">{s.title}</h3>
<p className="text-[0.8125rem] leading-[1.5] text-fg-2">{s.desc}</p>
```

- [ ] **Step 5: `components/About.tsx` — rem size**

```tsx
<p className="max-w-[52ch] text-[0.9375rem] leading-[1.6] text-fg-2">
```

- [ ] **Step 6: Verify no `px` sizes and no dead links remain**

Run: `grep -rn "text-\[[0-9]*px\]\|#book\"" components/ app/`
Expected: no matches.

- [ ] **Step 7: Commit**

```bash
git add components app
git commit -m "fix: dead CTAs, rem type scale, footer tap target"
```

---

### Task 8: Refresh the stale test suite

**Files:**
- Modify: `components/__tests__/sections.test.tsx`
- Modify: `components/__tests__/Offer.test.tsx`
- Modify: `app/__tests__/page.test.tsx`

**Context:** four tests were already failing before this work began, asserting copy that was changed in earlier commits (`"Available · April 2026"`, `"Modern websites and quiet automations"`). This task brings them in line with what the components now render and adds coverage for the new contract.

- [ ] **Step 1: Update the assertions to current copy**

`sections.test.tsx`:

```tsx
test("topbar shows availability and a real contact link", () => {
  render(<TopBar />);
  expect(screen.getByText("Available for new projects")).toBeInTheDocument();
  const cta = screen.getByRole("link", { name: /start a project/i });
  expect(cta).toHaveAttribute("href", "mailto:hello@arlek.ca?subject=Website%20project");
});

test("hero contains the headline copy", () => {
  render(<Hero />);
  expect(screen.getByText("Websites and automation")).toBeInTheDocument();
  expect(screen.getByText("for Canadian small businesses.")).toBeInTheDocument();
});
```

- [ ] **Step 2: Add a regression test for the Blocker**

```tsx
test("no link points at a bare #book fragment", () => {
  render(<Home />);
  for (const link of screen.getAllByRole("link")) {
    expect(link.getAttribute("href")).not.toBe("#book");
  }
});
```

- [ ] **Step 3: Run the full suite**

Run: `pnpm test`
Expected: all tests pass, zero failures.

- [ ] **Step 4: Commit**

```bash
git add app/__tests__ components/__tests__
git commit -m "test: refresh stale assertions, cover dead-link regression"
```

---

### Task 9: Verification pass

**Files:** none modified unless a gate fails.

- [ ] **Step 1: Build**

Run: `pnpm build` — expected: success.

- [ ] **Step 2: Lint**

Run: `pnpm lint` — expected: clean.

- [ ] **Step 3: Render and check the gates**

Against the dev server, at 375 / 768 / 1024 / 1440:

- `document.documentElement.scrollWidth` equals viewport width at every size.
- The `h1` in view-source is real text, not scrambled characters.
- Heading outline is `h1 → h2 → h3` with no skipped levels.
- Every text node meets 4.5:1 (3:1 for large text).
- No interactive element is under 24×24.
- Zero console errors.

- [ ] **Step 4: Confirm the headline does not reflow mid-animation**

Sample the `h1` bounding width across the animation window; the value must not change.

- [ ] **Step 5: Commit any fixes and push**
