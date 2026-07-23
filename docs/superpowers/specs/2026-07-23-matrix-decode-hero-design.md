# Matrix decode hero — design

**Date:** 2026-07-23
**Status:** awaiting review
**Scope:** `arlek.ca` landing page — type system, hero animation, accent color, section heads, plus the accessibility fixes that live in the same files.

## Problem

The site is competent and reads as templated. In the owner's words: "kind of just looking a bit like good AI slop." A July 2026 audit of the live page found the cause is partly structural, not just aesthetic:

- One typeface (Satoshi) doing every job, hierarchy carried only by weight and size.
- The eyebrow labels — `SELECTED WORK`, `01—03` — are the most generic moment on the page.
- Three animated elements total. Nothing on the page is memorable.

The same audit found a Blocker and four High-severity defects in files this redesign already has to open.

## Direction

Matrix as **behavior**, not costume. No green-on-black body text, no katakana rain canvas, no scanlines. The reference lands through a decode animation and a mono display face; green appears for under a second and then leaves.

This was chosen over a literal green-terminal treatment because green rain is the single most-templated hacker aesthetic on the web — it would trade one template for a louder one, and it would fight the three portfolio screenshots (blue, white, cream) sitting directly below the hero.

## 1. Type system

| Role | Face | Weights | Applied to |
|---|---|---|---|
| Display + utility | Monaspace Krypton | 600, 500 | h1, section eyebrows, counters, numerals, project names |
| Body | Satoshi (existing) | variable 300–900 | paragraphs, project descriptions, testimonial, about |

**Monaspace Krypton** — GitHub's mono superfamily, SIL OFL 1.1. Krypton is the mechanical cut: flat terminals, squared bowls, low stroke contrast.

Two independent reasons it is the right face here:

1. **Technical.** The decode animation swaps characters every frame. In a proportional face, glyph advance widths change as characters swap, so the headline reflows and jitters continuously. Monospace makes the line width constant — the decode is only clean because the face is monospaced.
2. **Argumentative.** The site sells "same stack the big companies use, sized for a small business." The headline is literally set in GitHub's typeface.

### Delivery

Source: `@fontsource/monaspace-krypton@5.3.0` (verified present on npm, OFL-1.1).

The package ships **static** weight files only — no variable font, despite the package keywords. Copy `monaspace-krypton-latin-600-normal.woff2` (43KB) and `monaspace-krypton-latin-500-normal.woff2` into `app/fonts/` and load via `next/font/local`, matching the existing Satoshi pattern in `app/layout.tsx`. Total added weight ~86KB.

Do **not** add `@fontsource/monaspace-krypton` as a runtime dependency — pull the two files out and drop the package. Nothing else in it is used.

### Scramble alphabet constraint

The latin subset contains **no katakana glyphs**. A scramble alphabet containing katakana renders tofu boxes mid-animation. The alphabet is therefore:

```
A–Z  a–z  0–9  / \ < > [ ] { } # $ % & * + = _ | ~ ^
```

Terminal punctuation reads correctly for the intent. Loading a CJK subset to recover katakana would cost several hundred KB for glyphs visible for under one second — not worth it.

## 2. Signature element — decode on the h1

The one memorable thing on the page. It appears on the `h1` and nowhere else.

```
t=0ms     ]V3b#!t3# @nd &ut0m@t!0n
t=350ms   Websit#s a&d aut0m@ti0n
t=900ms   Websites and automation
          for Canadian small businesses.
```

### Behavior

- Character-by-character resolve, left→right across both lines of the `h1`.
- Total duration ~900ms, then completely static.
- Each character scrambles ~6 frames at ~50ms, then locks permanently.
- Stagger ~18ms per character index.
- **In-flight characters render in the accent green. Locked characters snap to `--color-fg`.**
- Runs **once**, on mount. No loop. No scroll re-trigger. No replay on navigation.

The single-run rule is what separates this from a demo. A looping scramble is decoration; a one-time decode is an entrance.

### Server rendering

The server renders the real headline text into the HTML. Scrambling begins on hydration.

This is non-negotiable and is the detail most scramble-hero implementations get wrong: shipping an `h1` of randomized characters means Google indexes garbage and no-JS visitors read garbage. The component's initial render state is the final text, not the scrambled text.

### Reduced motion

Under `prefers-reduced-motion: reduce`: final text renders immediately with a single 200ms opacity fade. No scrambling.

Per the motion guidance, reduced-motion is graduated rather than blanket-killed — but high-frequency character strobing is precisely the class of effect that preference exists to prevent, so here the correct graduation is full removal of the scramble while keeping the fade.

### Component boundary

New client component `components/Decode.tsx`:

- **Does:** takes final text, renders it, scrambles it once on mount.
- **Used as:** `<Decode text="Websites and automation" />` — accepts a className for styling, knows nothing about the hero.
- **Depends on:** `useEffect`, `useRef`, `matchMedia` for the motion query. No animation library.

`Hero.tsx` stays a server component and composes two `Decode` instances (white line, `fg-3` line). Keeping the scramble logic out of `Hero` means the hero's layout stays readable and the decode is independently testable.

## 3. Accent color

New token in `app/globals.css`:

```css
--color-accent: #4ADE80;
```

Permitted uses — four, exhaustively:

1. In-flight decode characters (visible <900ms).
2. The "Available for new projects" dot — unifying the current one-off `#6BCB77`.
3. The section-head leader rule.
4. Link hover underline.

Never a background. Never body text. Never a button fill. Contrast is ~10:1 on `#080809`, so no use is contrast-constrained; the restriction is aesthetic discipline, not an accessibility limit.

## 4. Section heads

Where the mono face earns its place, and the most templated element on the current page:

```
SELECTED WORK ·································· 03 · 2024—2026
```

Mono, tabular numerals, with a leader rule between label and counter tinted with the accent at low opacity.

`SectionHead` also begins rendering an `<h2>` and `ProjectCard` an `<h3>`, taking the page from a single heading to a real document outline.

## 5. Audit fixes folded in

These are defects in the files this redesign already opens. Doing them in a separate pass would mean touching the same components twice.

| Severity | Fix | File |
|---|---|---|
| Blocker | `#book` dead link → `mailto:hello@arlek.ca?subject=Website%20project`. Copy changes so labels match behavior: TopBar "Book a call" → "Start a project", CTA "Book a 20-min call" → "Start a project". A mailto button labelled "Book a call" is its own small lie | `TopBar.tsx`, `CTA.tsx` |
| High | `--color-fg-3` `#75757C` → `#7E7E86` (4.38:1 → ~4.9:1 on `#080809`, ~4.7:1 on `#0F0F11`) | `globals.css` |
| High | Type scale px → rem so browser font-size preferences apply | all components |
| High | Heading structure: `SectionHead` → `h2`, `ProjectCard` name → `h3` | `SectionHead.tsx`, `ProjectCard.tsx` |
| High | Footer email tap target 78×15 → ≥24px tall via vertical padding | `Footer.tsx` |
| Medium | Add `prefers-reduced-motion` handling for the card hover lift | `ProjectCard.tsx` |
| Medium | `hover:bg-white` on primary CTA is a 2% lightness change — give it real feedback | `TopBar.tsx` |

The `fg-3` token bump also brightens the hero's second line, which currently passes only as large text. This is intended.

## Out of scope

Deliberately excluded — real issues, but neither type nor motion, and folding them in would blur what this change is:

- Work grid is 2-up at 375px, making the portfolio screenshots illegible thumbnails.
- The Rebuild before/after section renders two full-page screenshots at ~10% scale on mobile; roughly two-thirds of the mobile page, none of it readable.

Both are tracked from the July 2026 audit and get their own pass.

## Rejected alternatives

**Full green terminal** (green-on-black throughout, katakana rain canvas, mono body). Instantly recognizable as Matrix, and the highest slop risk available — the exact aesthetic that reads as costume. Also: canvas rAF loop costs battery, green-on-black body text is fatiguing, and it fights the portfolio screenshots directly beneath it.

**CRT phosphor editorial** (scanlines, chromatic split, power-on flicker over the existing layout). Scanlines are themselves a heavily-used effect and read as a CodePen demo without extreme restraint. Rejected as more effects for less distinctiveness.

**Keep Satoshi, mono for labels only.** Would require wrapping each headline character in a fixed-`ch` inline-block to stop reflow jitter, which destroys Satoshi's kerning — degrading the one thing Satoshi does well in order to run an animation it is unsuited to. Also fails the explicit ask, which named the font as half of the desired effect.

## Honest assessment

Text-scramble heroes are not novel; the effect is well-worn on its own. What keeps this off the slop pile is the combination: a mono display face almost nobody ships, green that appears for under a second and leaves, one animation on one element, and everything around it staying quiet.

The failure mode to guard against during implementation is spreading the decode to section heads and project names. At that point it becomes a demo. It stays on the `h1`.

## Verification

Before this is considered done:

- Render at 375, 768, 1024, 1440 and confirm no horizontal overflow.
- Confirm the `h1` in view-source is real text, not scrambled characters.
- Confirm the headline's bounding width does not change during the animation.
- Confirm scramble does not run under `prefers-reduced-motion: reduce`.
- Re-run the contrast sweep; zero text below 4.5:1 (large text 3:1).
- Confirm heading outline is `h1 → h2 → h3` with no skipped levels.
- Confirm both former `#book` buttons navigate somewhere real.
- Zero console errors.
