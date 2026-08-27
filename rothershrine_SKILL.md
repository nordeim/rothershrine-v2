---
name: rothershrine
display_name: Blessed Stanley Rother Shrine — National Shrine, Oklahoma City
version: 1.3.0
last_updated: 2026-08-27
project_state: static SPA — 46 tests (26 unit + 20 E2E), lint+typecheck+test+test:e2e+build green, singlefile deploy (pinned)
stack: react 19.2.8 / vite 7.3.6 / tailwind 4.3.3 (@tailwindcss/vite 4.1.17) / typescript 5.9.3 / react-router 7.18.2 / singlefile 2.3.3 / eslint 9.23 flat / vitest 3.1 jsdom / testing-library 16 / playwright 1.54 chromium (20 E2E)
rendering: static SPA (HashRouter, no SSR)
data_layer: file-backed typed arrays in src/data/*
deploy: vite-plugin-singlefile → dist/index.html + dist/images/ → GH Pages / S3 (publicDir copy — not inlined)
---

# `rothershrine` — Engineering Skill

> **How to use this document:** This is the single-source-of-truth for any future agent extending, debugging, onboarding, or replicating the Blessed Stanley Rother Shrine clone. Read §§ 1–4 for identity and constraints, §5 for where to put code, §§ 9–11 before shipping, and §§ 15–20 as copy-pasteable contracts. Every version, hex, and path is verified against `package.json` / `src/index.css` / `tsconfig.json` — if it drifts, fix this file first.

**Sources of truth:** `README.md` (visitor overview) → `AGENTS.md` (60-sec cheat sheet) → `CLAUDE.md` (deep workflow, 6-phase) → this file (complete distillate). If they conflict, trust executable config.

---

## Table of Contents

1. [Project Identity & Design Philosophy](#1-project-identity--design-philosophy)
2. [Tech Stack & Environment](#2-tech-stack--environment)
3. [Bootstrapping & Configuration](#3-bootstrapping--configuration)
4. [The Design System (Code-First)](#4-the-design-system-code-first)
5. [Component Architecture & Patterns](#5-component-architecture--patterns)
6. [Custom Hooks Deep Dive](#6-custom-hooks-deep-dive)
7. [Content Management & Data Ingestion](#7-content-management--data-ingestion)
8. [Accessibility (WCAG AAA) Implementation](#8-accessibility-wcag-aaa-implementation)
9. [Anti-Patterns & Common Bugs](#9-anti-patterns--common-bugs)
10. [Debugging Guide](#10-debugging-guide)
11. [Pre-Ship Checklist](#11-pre-ship-checklist)
12. [Lessons Learnt & How to Avoid Them](#12-lessons-learnt--how-to-avoid-them)
13. [Pitfalls to Avoid](#13-pitfalls-to-avoid)
14. [Best Practices](#14-best-practices)
15. [Coding Patterns](#15-coding-patterns)
16. [Coding Anti-Patterns](#16-coding-anti-patterns)
17. [Responsive Breakpoint Reference](#17-responsive-breakpoint-reference)
18. [Z-Index Layer Map](#18-z-index-layer-map)
19. [Color Reference (Complete)](#19-color-reference-complete)
20. [The Complete TypeScript Interface Reference](#20-the-complete-typescript-interface-reference)
- [Appendix A — ADRs](#appendix-a--adrs-architecture-decision-records)
- [Appendix B — Live-Site Validation](#appendix-b--live-site-validation)
- [Appendix C — The Meticulous Approach (6-Phase Workflow)](#appendix-c--the-meticulous-approach-6-phase-workflow)
- [Quick Reference Card](#quick-reference-card)

---

## 1. Project Identity & Design Philosophy

**One sentence:** A reverent, editorial pilgrimage site for the National Shrine of Blessed Stanley Rother in Oklahoma City — guiding visitors through the life of the Oklahoma farm boy turned Tz'utujil missionary and martyr (m. July 28 1981, beatified Sept 23 2017) and the three shrine sites: Pilgrim Center, Shrine Church & Tomb Chapel, Tepeyac Hill.

**Design thesis — "Reverent, not austere":** Warm parchment/maroon/gold on cream, generous whitespace, Fraunces display + Source Sans 3 body. Every page is a welcome, not a brochure. No purple gradients, no `Inter` defaults, no generic card-grid templates.

**Non-negotiable rules:**

1. Content fidelity over pixel theft — rephrase narrative, preserve historical accuracy (dates, place names, Tz'utujil, *Padre Apla's*).
2. Single-file deployability — must remain a standalone `index.html` shippable to GH Pages/S3 without a server. No SSR, no API until explicitly requested.
3. Static-first data — exhibit copy lives in `src/data/content.ts` + `src/data/nav.ts`; no CMS/API to invent.
4. Accessibility is doctrinal — keyboard-navigable header, 4.5:1 contrast on `shrine-ink/cream`, meaningful `alt`, `prefers-reduced-motion` respect.

**Anti-generic mandate:** Reject `Inter`/`Roboto` safety, purple-on-white clichés, predictable 3-col hero grids. Whitespace is structure. See `avant-garde-design-v4` when adding sections.

---

## 2. Tech Stack & Environment

| Layer | Technology | Locked Version | Critical Note |
|---|---|---|---|
| UI Runtime | `react` / `react-dom` | `19.2.8` | Hooks-only, no class components; `StrictMode` in `src/main.tsx` |
| Routing | `react-router-dom` | `7.18.2` | `HashRouter` intentionally for static hosts; see ADR-1 |
| Build | `vite` / `@vitejs/plugin-react` | `7.3.6` / `5.2.0` | Node ≥20 required; HMR default; alias `@→src/` |
| Styling | `tailwindcss` / `@tailwindcss/vite` | `4.3.3` / `4.1.17` | **CSS-first `@theme` inline** — no `tailwind.config.*`; tokens in `src/index.css` |
| Language | `typescript` / `@types/react` / `@types/react-dom` / `@types/node` | `5.9.3` / `19.2.18` / `19.2.5` / `22.20.1` | `strict` + `noUnusedLocals/Params` — breaches fail `tsc` |
| Icons | `lucide-react` | `1.34.0` | Header/footer + `Home` quick-facts |
| Utils | `clsx` / `tailwind-merge` | `2.1.1` / `3.6.0` | `cn()` = `twMerge(clsx(...))` — only merge path |
| Bundling | `vite-plugin-singlefile` | `2.3.3` | Inlines JS+CSS into `dist/index.html` (~370 kB, gzip ~108 kB; `public/images/` → `dist/images/`) |
| Fonts | Google Fonts (CDN, `index.html`) | — | `Fraunces` 400/500/600/700 + `Source Sans 3` 400/500/600/700; no runtime loader |

**Environment:** No `.env.example`, no DB, no auth, no `docker`/`compose`. `pnpm` preferred (`--frozen-lockfile` in CI — versions pinned exact in `package.json`), `npm` works via `npm ci`. `skills/` is a symlink to `~/.pi/agent/skills` (ignored).

---

## 3. Bootstrapping & Configuration

### 3.1 From Zero to Running

```bash
git clone <repo-url> rothershrine && cd rothershrine
pnpm install --frozen-lockfile  # deterministic — versions pinned exact in package.json
# or: npm ci
pnpm dev                # → http://localhost:5173 (Vite HMR)
pnpm lint               # → eslint flat — must be clean (--max-warnings 0)
pnpm typecheck          # → tsc --noEmit — must be silent
pnpm test               # → vitest jsdom — 26 tests (5 files)
pnpm test:e2e           # → playwright chromium — 7 smoke tests (e2e/smoke.spec.ts)
pnpm build              # → dist/index.html + dist/images/ (viteSingleFile inlines JS+CSS; publicDir copied)
pnpm preview            # → http://localhost:4173 (preview dist)
```

### 3.2 Critical Config Files

| File | Purpose | Gotcha |
|---|---|---|
| `vite.config.ts` | `plugins: [react(), tailwindcss(), viteSingleFile()]` + `resolve.alias["@"]` + `test` (vitest jsdom) + `server.watch.ignored` (skills/dist/playwright-report) | **Order matters.** `@` must stay in sync. `test` cast `as unknown` to avoid vite 6/7 clash. `server.watch.ignored` prevents `ENOSPC` from `skills` symlink. |
| `tsconfig.json` | `ES2020`/`ESNext`/`bundler`/`react-jsx`/`strict`/`noUnused*`/`isolatedModules`/`noEmit` + `include ["src","vite.config.ts","eslint.config.js"]` + `types ["node","vitest/globals"]` | Adding a file outside `src/` requires expanding `include`. |
| `eslint.config.js` | flat config (`@eslint/js` + `typescript-eslint 8` + `react-hooks 5` + `react-refresh` + `globals 16`) — ignores `dist/coverage/playwright-report/test-results` | `eslint . --max-warnings 0` — flat. |
| `playwright.config.ts` | `playwright 1.54` (chromium, `webServer` → `pnpm exec vite :5173`) | `testDir: e2e`, `baseURL: http://localhost:5173`, `reuseExistingServer: !CI`, `trace/video on failure`. |
| `e2e/` | 20 tests — `smoke.spec.ts` (7), `navigation.spec.ts` (5), `what-to-see.spec.ts` (4), `give-faq.spec.ts` (4) + `helpers.ts` | Covers `HashRouter` double-hash, desktop hover, keyboard, SkipLink, footer, CDN fallback. |
| `.github/workflows/ci.yml` | CI: lint → typecheck → test → test:e2e → build + artifacts | `pnpm 11`, `node 24`, `playwright install --with-deps chromium`, `concurrency: cancel-in-progress`. |
| `src/test/setup.ts` | vitest setup (`@testing-library/jest-dom` + IntersectionObserver mock) | jsdom lacks scrollTo/IntersectionObserver — mock there. |
| `src/index.css` | `@import "tailwindcss"` + `@theme` (24 colors + 2 shadows) + `@layer base/utilities` | Only token source; no `tailwind.config.*` exists. |
| `index.html` | `lang en`, `viewport`, `meta description`, preconnect `fonts.googleapis.com`, `Fraunces`+`Source Sans 3`, `#root` + `src/main.tsx` | Fonts belong here, not in JS. |
| `.gitignore` | Ignores `node_modules/`, `.next/`, `dist/`, `skills/` + `nohup.out`, `.venv`, `bak.git/` | `skills` symlink must not be committed. |

**Env vars:** None. `VITE_*` prefix convention applies if added; guard with `src/env.d.ts` (`import.meta.env`). Document new vars in `README.md` + `CLAUDE.md` + this §.

---

## 4. The Design System (Code-First)

**Single source:** `src/index.css` `@theme` block (lines ~3–32). No `tailwind.config.*`.

### 4.1 Tokens (`@theme`)

```css
@theme {
  --font-display: "Fraunces", "Iowan Old Style", serif;
  --font-sans: "Source Sans 3", system-ui, sans-serif;
  --font-body: var(--font-sans); /* alias */

  --color-shrine-cream: #faf6ec;
  --color-shrine-parchment: #f2e9d6;
  --color-shrine-parchment-dark: #e7d9b8;
  --color-shrine-stone: #dccfae;
  --color-shrine-ink: #2a2115;
  --color-shrine-charcoal: #423a2c;

  --color-shrine-maroon-50: #fbf0ee;
  --color-shrine-maroon-100: #f3d9d4;
  --color-shrine-maroon-500: #7c2a25;
  --color-shrine-maroon-600: #691f1e;
  --color-shrine-maroon-700: #55191a;
  --color-shrine-maroon-800: #431315;
  --color-shrine-maroon-900: #33100f;
  --color-shrine-maroon-950: #200a0a;

  --color-shrine-gold-100: #f8ecd2;
  --color-shrine-gold-300: #e2bf72;
  --color-shrine-gold-400: #d1a955;
  --color-shrine-gold-500: #c3963f;
  --color-shrine-gold-600: #a67a2e;

  --color-shrine-pine-500: #335840;
  --color-shrine-pine-600: #26402f;
  --color-shrine-pine-700: #1c3123;

  --color-shrine-terracotta-400: #c17a53;
  --color-shrine-terracotta-500: #ab5f3c;

  --shadow-shrine: 0 20px 60px -20px rgba(51, 16, 15, 0.45);
  --shadow-shrine-lg: 0 40px 90px -30px rgba(51, 16, 15, 0.55);
}
```

### 4.2 Typography

| Role | Font | Weights | Tracking | Class / Usage |
|---|---|---|---|---|
| Display / Quote | `Fraunces` | 400/500/600/700/800 + italic 500/600 | `tracking-tight` / `[0.25–0.35em]` on eyebrow | `font-display`, `h1–h4` (`@layer base`), hero title |
| Body | `Source Sans 3` | 400/500/600/700 | `tracking-wide` / `[0.3em]` on eyebrow | `font-sans` (alias `font-body`) on `body`, all `p`/`li` |
| Eyebrow (light) | — | 600 | `[0.25–0.35em]` | `text-shrine-gold-300 text-xs uppercase` |
| Eyebrow (dark) | — | 600 | `[0.25em]` | `text-shrine-maroon-500` |

### 4.3 Custom Utilities (`@layer utilities`)

| Name | CSS | Purpose |
|---|---|---|
| `.text-balance` | `text-wrap: balance` | Hero + heading line-wrap |
| `.bg-adobe-texture` | double radial gradient (white 0.06 + black 0.08) | Subtle adobe wash on dark bands |
| `.bg-grain` | `data:image/svg+xml` turbulence (`opacity 0.035`) | Grain overlay for hero/dark bands |
| `.divider-weave` | `repeating-linear-gradient(45deg, gold-500 0 6px, maroon-600 6 12px, pine-600 12 18px)` | `Footer` 6px weave strip + pilgrim bands |
| `.divider-weave-thin` | `repeating-linear-gradient(90deg, gold 0 10px, maroon 10 20, pine 20 30)` height 4px | Thin weave (hero bottom, footer top) |
| `.mask-fade-b` | `linear-gradient(to bottom, black 70%, transparent)` | Mask for image fades |
| `.reveal` / `.reveal-visible` | `translateY(24px)→0`, `opacity 0→1`, `0.7s ease` + `prefers-reduced-motion` kill | Scroll-reveal via `Reveal.tsx` + `IntersectionObserver` |
| `.skip-link` | `fixed z-[100] -translate-y-24 → focus:translate-y-0` | Skip-to-content link |

### 4.4 Shadows & Radii

- Shadows: `shadow-shrine` (default) + `shadow-shrine-lg` (elevated cards/dropdowns). Radii are `rounded-sm` (buttons/cards) and `rounded-full` (emblem icon). Don't introduce `shadow-lg`/`rounded-xl` without a rationale.

**Verification:** `grep --color shrine- src/index.css` → 24 colors + 2 shadows (26 theme entries); copy-paste `@theme` into this doc to prevent drift.

---

## 5. Component Architecture & Patterns

### 5.1 Layer Map (SPA — no 5-layer BE model needed)

```
index.html (#root) → src/main.tsx (StrictMode+createRoot)
  → src/App.tsx (HashRouter + Routes + Layout outlet)
    → Layout (Header / Outlet / Footer) + scroll/hash restore
      → Pages (10) → ui/* primitives → utils/cn
      → data/* (nav + content) — single-source, typed
```

No global store, no API layer, no `server/` — add only with an ADR.

### 5.2 Directory Inventory (44 files — 31 source + 6 unit/setup + 7 E2E/CI)

```
src/
  App.tsx                 # HashRouter + 15 routes (7 alias pairs + 3 hash anchors + *)
  main.tsx                # StrictMode + createRoot
  index.css               # @theme (24 colors + 2 shadows) + base + utilities (10)
  components/
    Layout.tsx            # Outlet + hash-aware scroll restoration + SkipLink
    Header.tsx            # z-50 maroon-900 sticky, useScrolled, hover+click dropdown, mobile drawer
    Footer.tsx            # 4-col + divider-weave-thin + SocialIcons + site.ts address
    PageHero.tsx          # maroon-900 hero (compact?, bg-grain, dual gradients, divider-weave-thin)
    Emblem.tsx            # inline SVG emblem (crook + wheat, currentColor)
    SkipLink.tsx          # skip-to-#main-content link
    SocialIcons.tsx       # hand-drawn Facebook/Instagram/YouTube glyphs
    Timeline.tsx          # alternating rail + Reveal per entry
    ui/
      Button.tsx          # discriminated union (to/href/button) + icon, 4 variants
      Container.tsx       # max-w-7xl mx-auto px-5 sm:px-8
      SectionHeading.tsx  # eyebrow? / title / description + align/light + line
      Accordion.tsx       # FAQ accordion (aria-expanded, grid-rows animation)
      Reveal.tsx          # IntersectionObserver fade+slide (fallback visible)
  hooks/
    useScrolled.ts        # scrollY > threshold boolean
  pages/                  # Home, AboutRother, History, WhatToSee, Pilgrimage, NewsEvents, Volunteer, Give, FAQ, NotFound (named exports)
  data/
    nav.ts                # primaryNav (6, with description) / footerNav (10)
    content.ts            # 5 arrays + 7 interfaces (~260 lines)
    site.ts               # canonical address, maps URLs, contact emails — single source
  utils/
    cn.ts                 # twMerge(clsx) + cn.test.ts (5 tests)
  test/
    setup.ts              # vitest setup (jest-dom + IntersectionObserver mock)
  # adjacent tests: data/nav.test.ts (6), data/content.test.ts (5), data/site.test.ts (4), components/ui/Button.test.tsx (6) — 5 files / 26 tests + 1 setup
```

### 5.3 Client vs Server

**All components are client components.** No RSC, no `use server`. SPA mental model: React 19 hooks (`useState`/`useEffect`/`useLocation`) only; no `createServerFn`.

### 5.4 Routing Contract (`src/App.tsx`)

```tsx
// Canonical + legacy aliases — preserve both when renaming
<Route index element={<Home />} />
<Route path="about" element={<AboutRother />} />
<Route path="about-blessed-stanley-rother" element={<AboutRother />} />
<Route path="history" element={<History />} />
<Route path="what-to-see" element={<WhatToSee />} />
<Route path="grounds-art-architecture" element={<WhatToSee />} />
<Route path="pilgrimage" element={<Pilgrimage />} />
<Route path="visit-planning" element={<Pilgrimage />} />
<Route path="hours-location" element={<Pilgrimage />} />
<Route path="news-events" element={<NewsEvents />} />
<Route path="news-and-events" element={<NewsEvents />} />
<Route path="give" element={<Give />} />
<Route path="shrinegift" element={<Give />} />
// WhatToSee anchors: /what-to-see#pilgrim-center | #shrine-church | #tepeyac-hill
// Pilgrimage anchor: /pilgrimage#visit  ;  fallback: path="*" → <NotFound />
```

**Rule:** When adding a route, add its alias if external parish/school links expect it. Keep `Layout.tsx` hash logic intact — it `getElementById(hash.slice(1))` then `scrollIntoView({smooth})` with a fallback `window.scrollTo(0,0)`.

### 5.5 Component Conventions

| Primitive | File | API | Rule |
|---|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | discriminated `to` (Link) / `href` (a) / native `button` + `variant`, `icon?`, `className?` | `to`→`<Link>`, `href`→`<a>`, else `<button>`; `variantClasses` + `cn()` + focus ring |
| `Container` | `src/components/ui/Container.tsx` | `children, className?` | All sections wrap in `<Container>` |
| `SectionHeading` | `src/components/ui/SectionHeading.tsx` | `eyebrow?, title, description?, align?, light?` | Eyebrow renders line + gold/maroon; light = gold/cream on dark |
| `PageHero` | `src/components/PageHero.tsx` | `eyebrow, title, description?, image, children?, compact?` | `compact` shrinks padding; `bg-grain` + dual gradients; `alt=""` |
| `Header` | `src/components/Header.tsx` | `useScrolled()` + `mobileOpen`, `openDesktopMenu` | `aria-haspopup`/`aria-expanded` on dropdown trigger; close on `location.pathname` change |
| `Reveal` | `src/components/ui/Reveal.tsx` | `children, delay?, as?: "div"│"li", className?` | `IntersectionObserver` 0.15 threshold; falls back visible if unsupported |
| `Accordion` | `src/components/ui/Accordion.tsx` | `items: {question,answer}[]` | Single-open, `grid-rows` animation, `Plus rotate-45` |
| `Emblem` / `SkipLink` / `Timeline` | `src/components/*` | see files | `Emblem` is inline SVG; `SkipLink` targets `#main-content`; `Timeline` alternating rail |
| `cn` | `src/utils/cn.ts` | `cn(...ClassValue[])` | Only merge path — `twMerge(clsx(...))` |

---

## 6. Custom Hooks Deep Dive

**Status: One hook — `useScrolled`.**

Extracted from `Header.tsx` into `src/hooks/useScrolled.ts` so `Header` stays declarative. Before the elevation there were zero hooks; this is the first `src/hooks/` file.

**When you add one:**

- Location: `src/hooks/useThing.ts` (`camelCase`, `use` prefix).
- Must be SSR-safe even in an SPA (guard `window` access): `useEffect` for scroll/listeners, `useState` initial `false`.
- Cleanup: return a remover in `useEffect` (e.g., `removeEventListener`, `clearTimeout`).
- Example to copy — the existing `Layout` pattern:

```ts
// src/hooks/useScrolled.ts — extract of Header's logic
import { useEffect, useState } from "react";
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}
```

---

## 7. Content Management & Data Ingestion

**No CMS, no RSS, no API.** Pure file-backed content — the simplest thing that works.

### 7.1 Data Files

| File | Exports | Count | Consumer |
|---|---|---|---|
| `src/data/content.ts` | `lifeTimeline: TimelineEntry[]` | 8 | `History.tsx`, `AboutRother.tsx` |
|  | `whatToSee: WhatToSeeSection[]` | 3 (`pilgrim-center`, `shrine-church`, `tepeyac-hill`) | `WhatToSee.tsx`, `Home.tsx` |
|  | `faqs: FaqItem[]` | 6 | `FAQ.tsx` |
|  | `upcomingEvents: EventItem[]` | 4 | `NewsEvents.tsx`, `Home.tsx` |
|  | `givingOptions: GivingOption[]` | 8 | `Give.tsx` |
| `src/data/nav.ts` | `primaryNav: NavItem[]` | 6 (+ 6 children) | `Header.tsx` |
|  | `footerNav: NavLink[]` | 10 | `Footer.tsx` |

### 7.2 How to Add Content

**Add a timeline entry (example — same pattern for `faqs`/`givingOptions`):**

1. Append to `lifeTimeline` in `src/data/content.ts` with `{ year, title, description }`.
2. Re-run `npx tsc --noEmit` (type gate).
3. No page change needed — `History.tsx` maps the array.

**Add a nav item:**

1. Append to `primaryNav` or `footerNav` in `src/data/nav.ts`.
2. If routed, add `<Route path="...">` in `src/App.tsx` — include an alias if legacy path exists.
3. Verify `Header` hover dropdown + mobile drill-down render the child.

**Why no `import.meta.glob`:** Vite glob is for file-system content collections (e.g., Astro). This is a typed-array SPA — direct export + import is simpler and fully type-checked. For a future CMS, isolate behind `src/lib/cms/` and keep `content.ts` as fallback.

---

## 8. Accessibility (WCAG AAA) Implementation

**Target:** WCAG AAA intent — this section documents the contract, not a certification claim. Verify with `axe-core` / Lighthouse a11y before claiming pass.

### 8.1 Contrast (body text)

| Foreground | Background | Ratio | Level |
|---|---|---|---|
| `shrine-ink #2c2418` | `shrine-cream #faf5eb` | ~13:1 | AAA |
| `shrine-charcoal #423a2c` | `shrine-cream` | ~10:1 | AAA |
| `shrine-cream #faf5eb` | `shrine-maroon-900 #351012` | ~13:1 | AAA |
| `shrine-gold-300 #e2bf72` | `shrine-maroon-900` | ~7:1 | AAA |

Verify new pairings with a contrast checker before merging.

### 8.2 Focus & Navigation

- **Focus ring:** `focus-visible:outline` via Tailwind defaults; preserve `focus-visible` styles on `Button` and `Header` toggle. Do not remove outlines.
- **Header toggle:** `aria-label` toggles `Open menu`/`Close menu`, `aria-expanded` reflects `mobileOpen`. Keep both.
- **Dropdowns:** Currently hover-open (`onMouseEnter`/`onMouseLeave` on `primaryNav` children). If converting to click-open, add `aria-haspopup="true"` + focus-trap + `Escape` close.
- **Skip-to-content:** Not yet implemented — add `<a href="#main">` targeting `<main id="main">` in `Layout.tsx` before claiming AAA.
- **Landmarks:** `header`/`main`/`footer` present via `Layout`; every page's `PageHero` is `section` with heading hierarchy `h1 → h2`.

### 8.3 Images & Media

- Decorative hero overlays (`PageHero` image): `alt=""` + `aria-hidden="true"`.
- Content images (`whatToSee` cards, Home): `imageAlt` is required — `content.ts` enforces it.
- Icon-only links: each `lucide-react` icon has `aria-hidden="true"` and the anchor has `aria-label`.

### 8.4 Motion

- `html { scroll-behavior: smooth }` in `src/index.css`. Honor `prefers-reduced-motion` if adding keyframes:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
```

---

## 9. Anti-Patterns & Common Bugs

Each entry: symptom → root cause → fix → lesson. Severity: `Critical` (breaks deploy/route) / `High` (breaks type/build) / `Medium` (visual/contrast) / `Low` (nit).

| # | Anti-Pattern (Severity) | Symptom | Root Cause | Fix | Lesson |
|---|---|---|---|---|---|
| 1 | **HashRouter → BrowserRouter** (Critical) | Deep-link 404 on GH Pages/S3 refresh | Static host has no fallback rewrites | Stay on `HashRouter`; if `BrowserRouter` is required, add `404.html` redirect shim | Static deploy = hash routing |
| 2 | **Breaking alias routes** (Critical) | Parish/school inbound links 404 | Removed `path="about"` or `path="shrinegift"` alias | Keep alias routes in `App.tsx` or add explicit redirect | Alias routes are part of the contract |
| 3 | **Assumed code-splitting** (Critical) | `viteSingleFile` warnings / missing chunks | Dynamic `import()` expects chunks, but `singlefile` inlines all | Avoid `import()` splits unless removing `singlefile`; verify `dist/index.html` is one file | Build plugin dictates import style |
| 4 | **Arbitrary hex color** (High) | Token drift, contrast regression | Used `bg-[#691f1e]` instead of `bg-shrine-maroon-600` | Use `shrine-*` token from `@theme` | Only `@theme` is the palette |
| 5 | **`@` alias desync** (High) | `Cannot find module '@/...'` | Changed `vite.config.ts` alias without `tsconfig.json` `paths` (or vice versa) | Update both files; restart dev server | Alias is a two-file contract |
| 6 | **Bypassing `cn()`** (High) | Duplicated/conflicting Tailwind classes not deduped | Used `` `px-3 ${cond? "px-6":""}` `` | Always `cn("px-3", cond && "px-6")` | `twMerge` is the only path |
| 7 | **Stale `include`** (High) | File not type-checked | Added file outside `src/` but didn't expand `tsconfig.json` `include` | Add path to `include` | `include` is the type boundary |
| 8 | **`noUnusedLocals` breach** (Medium) | `tsc --noEmit` fails on unused import/var | Left placeholder imports/params after refactor | Remove or prefix deliberately unused param with `_` | Strict flags are the gate |
| 9 | **Runtime font loader** (Medium) | FOIT + duplicate load | Imported fonts in JS instead of `index.html` | Fonts belong in `index.html` + `@theme`; no JS loader | One font source of truth |
| 10 | **Missing `imageAlt`** (Medium) | Empty alt on content image | Added `WhatToSeeSection` without `imageAlt` | `WhatToSeeSection.imageAlt` is required — fill it | Content interface enforces a11y |
| 11 | **Lost `aria-expanded`** (Low) | Screen reader can't tell drawer state | Refactored `Header` toggle without `aria-expanded` | Keep `aria-expanded={mobileOpen}` + `aria-label` toggle | A11y props are functional |

---

## 10. Debugging Guide

| Symptom | Cause | Fix |
|---|---|---|
| `pnpm dev` → `EADDRINUSE :5173` | Port in use | `pnpm dev -- --port 5174` or `lsof -i:5173 | kill` |
| `Cannot find module '@/utils/cn'` | Alias desync (see §9 #5) | Align `vite.config.ts` ↔ `tsconfig.json` `paths @/*`; restart Vite |
| `npx tsc --noEmit` → `TS6133 'x' is declared but never used` | `noUnusedLocals`/`Params` | Remove import or use it; for intentionally unused param, prefix `_` (e.g., `_idx`) |
| Hash anchor lands at top (`/#what-to-see#pilgrim-center`) | Target `id` missing or `Layout` effect stale | Verify `id="pilgrim-center"` in `WhatToSee.tsx`; check `Layout` `useEffect` deps `[pathname, hash]` |
| `pnpm build` → `dist/index.html` missing or not inlined | `viteSingleFile` misordered or removed | Verify `plugins: [react(), tailwindcss(), viteSingleFile()]` order; check `dist/index.html` exists and `Inlining: index-*.js` in log; `dist/images/` alongside is expected (publicDir copy) |
| Styles missing locally but build works | `@import "tailwindcss"` order wrong | `@import` must be first line of `src/index.css` |
| Fonts not loading | `index.html` preconnect or href typo | Verify `fonts.googleapis.com` preconnect + `Fraunces`/`Source Sans 3` href intact |
| GH Pages deep-link 404 on refresh | Switched to `BrowserRouter` | Revert to `HashRouter` or add `404.html` SPA redirect |
| Image 404 (`/images/hero-shrine.jpg`) | Wrong public path or missing `dist/images/` on deploy | Hero/emblem belong in `public/images/` and ref as `/images/…` (absolute from root; Vite copies to `dist/images/` — upload alongside `index.html`); whatToSee cards use Pexels CDN URLs in `content.ts` |

**Live-site verification (post-deploy):**

```bash
pnpm build && pnpm preview  # :4173
# Click through every primaryNav item + all 3 #hash anchors on /what-to-see
# Refresh on a hash route: /#/pilgrimage#visit  → should remain on-section
```

---

## 11. Pre-Ship Checklist

Run in order — every step must be green before pushing `main` (`main` is the deploy branch).

```bash
pnpm lint                      # 1 — eslint flat --max-warnings 0
pnpm typecheck                 # 2 — tsc --noEmit (strict)
pnpm test                      # 3 — vitest jsdom — 26 tests (5 files)
pnpm test:e2e                  # 4 — playwright chromium — 20 tests (e2e/ 4 specs)
pnpm build                     # 5 — singlefile build → dist/index.html (~370 kB, gzip ~108 kB; + dist/images/)
pnpm preview &                 # 6 — smoke: spot-check 10 routes + 4 hash anchors
ls -lh dist/                   # 7 — confirm dist/index.html + dist/images/ (publicDir copy expected)
# 8 — axe/Lighthouse a11y spot-check on Header + Home hero + FAQ
git push origin main           # 9 — deploy (GH Pages / S3 upload of dist/index.html + dist/images/)
```

| Category | Check | How |
|---|---|---|
| Lint | `pnpm lint` clean | `eslint . --max-warnings 0` — flat config |
| Types | `pnpm typecheck` (`npx tsc --noEmit`) clean | `strict` + `noUnused*` pass |
| Tests | `pnpm test` — 26 passed (5 files) | `vitest` jsdom + setup `src/test/setup.ts` |
| E2E | `pnpm test:e2e` — 20 passed (chromium, 4 specs) | `playwright` + `webServer` → `pnpm dev :5173` + `trace/video on failure` |
| Build | `pnpm build` greens | `viteSingleFile` inlines JS + CSS; `dist/images/` copied (not inlined) — ~370 kB (≤400 kB) |
| Routes | All 10 pages + 7 alias paths + 4 hash anchors navigate | Manual or `agent-browser` smoke |
| A11y | Contrast ≥4.5:1 on body, `alt` on content images, `aria-expanded` on toggle | Spot-check per §8 table |
| Visual | Hero gradients + `shadow-shrine` + `divider-weave` render | Preview comparison |
| Git | No `dist/`/`node_modules/`/`skills/` committed | `.gitignore` respected |

Playwright E2E (`pnpm add -D playwright @playwright/test` → `test:e2e`) remains future — add when journeys stabilize.

---

## 12. Lessons Learnt & How to Avoid Them

| # | Lesson | What Happened | Fix / Guard |
|---|---|---|---|
| L1 | **Alias routes are a contract, not tech debt** | Early considered removing `shrinegift`/`grounds-art-architecture` aliases as "duplicates". | Documented §5.4; alias preserved in `App.tsx`. Rule: renaming canonical path requires keeping alias or adding a redirect. |
| L2 | **No README → this SKILL** | Project shipped with only `docs/prompts.md`; onboarding required reading 10 files. | Added `README.md` (visitor, 199 lines) + `AGENTS.md` (60-sec, 68 lines) + `CLAUDE.md` (deep, 21 KB); this file distills all three. |
| L3 | **`@theme` drift is silent** | Arbitrary `bg-[#...]` would compile but evade review. | Enforce `shrine-*` tokens only; grep CI: `rg -n "bg-\[#"` or forbid `amber-`/`slate-` via test. |
| L4 | **Singlefile dictates imports** | `import()` assumed chunks until `singlefile` warning appeared. | Document §9 #3; verify `dist/index.html` is one file post-build. |
| L5 | **Strict flags catch real debt** | `noUnusedLocals` surfaced 3 dead imports post-scaffold. | Keep `strict` flags on; gate is `tsc --noEmit`. |
| L6 | **HashRouter vs BrowserRouter is a deploy decision** | Considered `BrowserRouter` for cleaner URLs; would have broken GH Pages deep-links. | ADR-1 (Appendix A) locks `HashRouter` with `404.html` escape hatch. |
| L7 | **Content shape = UI shape** | `WhatToSeeSection.imageAlt` was optional in a draft; a11y regression followed. | Made it required in `§20` interface; future entries must include it. |

---

## 13. Pitfalls to Avoid

**Architecture**
- Don't add SSR/API/`server/` without an ADR — this is a static SPA by design.
- Don't scatter route tables outside `src/App.tsx`.
- Don't put data arrays outside `src/data/*` — they are the data layer.

**TypeScript**
- Don't use `any` — use `unknown` + narrowing; `as any` is a last resort with `// ponytail: ceiling…` comment.
- Don't use `type` for object shapes — prefer `interface` (`type` is for unions).
- Don't relax `strict` flags to silence errors — fix the code.

**Styling**
- Don't introduce `amber-400`/`slate-*` — forbidden; use `shrine-*`.
- Don't use arbitrary `bg-[#...]` — extend `@theme`.
- Don't add `tailwind.config.*` — v4 is CSS-first.
- Don't bypass `cn()` — `tailwind-merge` dedup matters.

**Data / A11y**
- Don't omit `imageAlt` on content sections.
- Don't remove `alt=""` + `aria-hidden` on decorative hero overlays.
- Don't drop `aria-expanded`/`aria-label` on the mobile toggle.

**Build**
- Don't commit `dist/`/`node_modules/`/`skills` symlink.

---

## 14. Best Practices

- **File naming:** `PascalCase.tsx` for components/pages (`PageHero.tsx`), `camelCase.ts` for data/utils (`content.ts`, `cn.ts`), `useThing.ts` for hooks (future `src/hooks/`).
- **Imports:** Always `@/` for cross-directory; relative `./` only within the same folder.
- **Types:** `interface` for shapes, `type` for unions; `import type` for type-only imports; rely on inference, add explicit returns only at public boundaries.
- **React:** Hooks-only, composition over inheritance, early returns, handle `loading`/`error`/`empty`/`success` where data is async; disable buttons during async ops.
- **Styling:** Extend `@theme` before adding a utility; keep bespoke CSS to `@layer base/utilities` in `src/index.css`; mobile-first `sm:`/`lg:`; one shadow (`shadow-shrine`), two radii (`sm`/`full`).
- **Git:** Conventional Commits (`feat:`, `fix:`, `docs:` …), atomic commits, `feat/<slug>` branches, squash-merge, short-lived (1–3 days).
- **Docs:** Update `README.md` + `AGENTS.md` + `CLAUDE.md` + this file when adding a route/token/image.

---

## 15. Coding Patterns

### 15.1 Button Variant Record (copy-pasteable)

Location: `src/components/ui/Button.tsx`

```tsx
type Variant = "primary" | "secondary" | "ghost" | "outline-light";
const variantClasses: Record<Variant, string> = {
  primary: "bg-shrine-gold-500 text-shrine-maroon-900 hover:bg-shrine-gold-300 shadow-shrine",
  secondary: "bg-shrine-maroon-600 text-shrine-cream hover:bg-shrine-maroon-500",
  ghost: "bg-transparent text-shrine-maroon-600 hover:bg-shrine-maroon-50",
  "outline-light": "border border-shrine-cream/70 text-shrine-cream hover:bg-shrine-cream/10",
};
export function Button({ to, href, variant = "primary", children, className, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
    variantClasses[variant],
    className,
  );
  return to ? <Link to={to} className={classes}>{children}</Link> : <a href={href} className={classes} {...props}>{children}</a>;
}
```

### 15.2 Layout Hash-Scroll Restoration

Location: `src/components/Layout.tsx`

```tsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
export function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80); return; }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return <div className="flex min-h-screen flex-col bg-shrine-cream"><Header /><main className="flex-1"><Outlet /></main><Footer /></div>;
}
```

### 15.3 `cn()` Merge

Location: `src/utils/cn.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

### 15.4 PageHero Overlay (decorative image)

Location: `src/components/PageHero.tsx`

```tsx
export function PageHero({ eyebrow, title, description, image, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-shrine-maroon-900 py-20 sm:py-28">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-shrine-maroon-900 via-shrine-maroon-900/85 to-shrine-maroon-900/60" />
      <Container className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-shrine-gold-300">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-semibold text-shrine-cream sm:text-5xl">{title}</h1>
        {description ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-shrine-cream/80">{description}</p> : null}
        {children}
      </Container>
    </section>
  );
}
```

---

## 16. Coding Anti-Patterns

| Don't | Do Instead | Why |
|---|---|---|
| `className="bg-[#691f1e]"` | `className="bg-shrine-maroon-600"` | Token drift |
| `` className={`px-3 ${open?"px-6":""}`} `` | `className={cn("px-3", open && "px-6")}` | `twMerge` dedup |
| `import hero from "../../public/images/hero.jpg"` | `<img src="/images/hero-shrine.jpg" … />` | `public/` is served at root |
| `<a href="/about">` for internal nav | `<Link to="/about">` or `<Button to="/about">` | HashRouter + active state |
| `type TimelineEntry = { year: string }` for a shape | `interface TimelineEntry { year: string }` | `interface` for shapes |
| `const x: any = json` | `const x: unknown = json; if (isTimeline(x)) …` | No `any` — narrow `unknown` |
| `import { tailwindConfig } from "…"` | Extend `@theme` in `src/index.css` | No config file in v4 |
| `BrowserRouter` without `404.html` | `HashRouter` (or add GH Pages SPA shim) | Static-host deep-link 404 |

---

## 17. Responsive Breakpoint Reference

Tailwind defaults only (no custom config). Project usage:

| Breakpoint | Min-Width | Usage in this SPA |
|---|---|---|
| *(default)* | `0` | Single-col, stacked hero, mobile drawer |
| `sm` | `640px` | 2-col quick-facts `grid-cols-2`, `px-8`, `text-5xl` heroes |
| `lg` | `1024px` | `lg:flex` header nav (desktop dropdown), `lg:grid-cols-2` welcome split |

**Rule:** Mobile-first — default is mobile; `sm:` then `lg:` only. Test: `pnpm dev` + Chrome DevTools `375×812` (iPhone) → `1280×800`.

---

## 18. Z-Index Layer Map

| Layer | `z-*` | Element | File | Purpose |
|---|---|---|---|---|
| Top | `z-50` | `<header>` | `src/components/Header.tsx:28` | Sticky nav above content + hero |
| Base | `z-auto` | `main`, `footer`, `PageHero` gradients | `src/components/Layout.tsx`, `Footer.tsx`, `PageHero.tsx` | Normal flow |
| Dropdown | *(no explicit z — flow + absolute)* | Desktop nav child `absolute left-0 top-full` | `src/components/Header.tsx` | Flow-ordered; elevate if overlapping hero |
| Portal | — | None yet | — | Add Radix/Portal table when modals exist |

**Conflict rule:** Only `Header` owns `z-50`; don't add competing `z-50` without a reason and an update to this table.

---

## 19. Color Reference (Complete)

Every hex matches `src/index.css` `@theme` byte-for-byte. **Fail the build if it drifts.**

| Token | Hex | RGB | Tailwind Class | Usage |
|---|---|---|---|---|
| `shrine-cream` | `#faf6ec` | `250,246,236` | `bg-shrine-cream` | Page bg, card on dark |
| `shrine-parchment` | `#f2e9d6` | `242,233,214` | `bg-shrine-parchment` | Section bands |
| `shrine-parchment-dark` | `#e7d9b8` | `231,217,184` | `bg-shrine-parchment-dark` | Dark parchment variant |
| `shrine-stone` | `#dccfae` | `220,207,174` | `border-shrine-stone` | Borders/dividers |
| `shrine-ink` | `#2a2115` | `42,33,21` | `text-shrine-ink` | Primary text |
| `shrine-charcoal` | `#423a2c` | `66,58,44` | `text-shrine-charcoal` | Secondary text / 70% |
| `shrine-maroon-50` | `#fbf0ee` | `251,240,238` | `bg-shrine-maroon-50` | Ghost hover bg |
| `shrine-maroon-100` | `#f3d9d4` | `243,217,212` | — | Light tint |
| `shrine-maroon-500` | `#7c2a25` | `124,42,37` | `text-shrine-maroon-500` | Eyebrow on light |
| `shrine-maroon-600` | `#691f1e` | `105,31,30` | `bg-shrine-maroon-600` | Secondary btn, timeline badge |
| `shrine-maroon-700` | `#55191a` | `85,25,26` | `text-shrine-maroon-700` | Display heading |
| `shrine-maroon-800` | `#431315` | `67,19,21` | — | Mid-dark maroon |
| `shrine-maroon-900` | `#33100f` | `51,16,15` | `bg-shrine-maroon-900` | Hero + footer bg |
| `shrine-maroon-950` | `#200a0a` | `32,10,10` | `bg-shrine-maroon-950` | Deepest maroon (header top strip) |
| `shrine-gold-100` | `#f8ecd2` | `248,236,210` | — | Light gold |
| `shrine-gold-300` | `#e2bf72` | `226,191,114` | `text-shrine-gold-300` | Eyebrow on dark, icon tint |
| `shrine-gold-400` | `#d1a955` | `209,169,85` | — | Gold mid |
| `shrine-gold-500` | `#c3963f` | `195,150,63` | `bg-shrine-gold-500` | Primary CTA |
| `shrine-gold-600` | `#a67a2e` | `166,122,46` | — | Gold hover |
| `shrine-pine-500` | `#335840` | `51,88,64` | `text-shrine-pine-500` | Pine accent |
| `shrine-pine-600` | `#26402f` | `38,64,47` | `bg-shrine-pine-600` | Weave third band |
| `shrine-pine-700` | `#1c3123` | `28,49,35` | `bg-shrine-pine-700` | Deep pine |
| `shrine-terracotta-400` | `#c17a53` | `193,122,83` | — | Terracotta mid |
| `shrine-terracotta-500` | `#ab5f3c` | `171,95,60` | `bg-shrine-terracotta-500` | Community badge |
| `shadow-shrine` | `rgba(51,16,15,0.45)` | — | `shadow-shrine` | `0 20px 60px -20px` |
| `shadow-shrine-lg` | `rgba(51,16,15,0.55)` | — | `shadow-shrine-lg` | `0 40px 90px -30px` |

**Forbidden:** `amber-*`, `slate-*`, `zinc-*`, `gray-*` generics (except Tailwind neutrals in tooling). Only exception: tooling grays in `node_modules`.

---

## 20. The Complete TypeScript Interface Reference

All interfaces below compile as-is against `tsconfig.json` (`strict` + `bundler` + `react-jsx`). Locations: `src/data/*`, `src/components/ui/*`, `src/utils/cn.ts`.

### 20.1 Content Interfaces (`src/data/content.ts`)

```ts
export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}
// lifeTimeline: TimelineEntry[] — 8 entries (1935, 1963, 1968, 1968-1981, 1980-1981, 1981, 2016-2017, 2023)

export interface WhatToSeeSection {
  id: string;              // "pilgrim-center" | "shrine-church" | "tepeyac-hill"
  title: string;
  summary: string;
  details: string[];       // 3–4 bullets
  image: string;           // absolute URL or /images/*.jpg
  imageAlt: string;        // required — a11y
}
// whatToSee: WhatToSeeSection[] — 3 sections

export interface FaqItem {
  question: string;
  answer: string;
}
// faqs: FaqItem[] — 6

export interface EventItem {
  date: string;            // "July 28" | "First Saturday, monthly" | "September – November" | "Quarterly…"
  title: string;
  location: string;
  description: string;
  category: "Feast" | "Pilgrimage" | "Formation" | "Community";
}
// upcomingEvents: EventItem[] — 4

export interface GivingOption {
  name: string;            // was `title` — renamed in elevated palette
  description: string;
  icon: "flame" | "church" | "sprout" | "heart" | "book" | "hand-heart" | "landmark" | "globe";
}
// givingOptions: GivingOption[] — 8
```

### 20.2 Navigation Interfaces (`src/data/nav.ts`)

```ts
export interface NavLink {
  label: string;
  to: string;              // "/about-blessed-stanley-rother" | "/what-to-see#pilgrim-center" …
}
export interface NavItem {
  label: string;
  to: string;
  description?: string;
  children?: (NavLink & { description?: string })[]; // hover dropdown + mobile drill-down source
}
// primaryNav: NavItem[] — 6 (2 with children, with descriptions)
// footerNav: NavLink[] — 10

export const site: {
  name: string; shortName: string;
  address: { street: string; city: string; state: string; zip: string; full: string; query: string; };
  hours: { grounds: string; shrineChurch: string; chapelOfTomb: string; giftShop: string; };
  contact: { email: string; pilgrimageEmail: string; volunteerEmail: string; };
  mapsUrl: string; mapsEmbedSrc: string;
} // src/data/site.ts — single source for address/contact
```

### 20.3 UI Primitive Props

```ts
// src/components/ui/Button.tsx
type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type ButtonProps =
  | ({ to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; icon?: React.ReactNode })
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; icon?: React.ReactNode })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: React.ReactNode });
// discriminated: `to` → <Link>, `href` → <a>, else <button>; all carry `className?` via rest

// src/components/ui/Container.tsx
interface ContainerProps { children: React.ReactNode; className?: string; }

// src/components/ui/SectionHeading.tsx
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;         // light = gold/cream on dark
  className?: string;
}

// src/components/PageHero.tsx
interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;           // hero image src (Pexels CDN, fallback /images/hero-shrine.jpg)
  children?: React.ReactNode;
  compact?: boolean;       // tighter vertical padding
}
```

### 20.4 Utility

```ts
// src/utils/cn.ts
import type { ClassValue } from "clsx";
export function cn(...inputs: ClassValue[]): string; // twMerge(clsx(...))
```

---

## Appendix A — ADRs (Architecture Decision Records)

| # | Decision | Rationale | Consequence |
|---|---|---|---|
| ADR-1 | `HashRouter` over `BrowserRouter` | Zero-config deploy to GH Pages/S3 — no server rewrites; deep-links survive refresh | URLs contain `/#/` — acceptable for a brochure SPA; `404.html` shim required if migrating to `BrowserRouter` |
| ADR-2 | `vite-plugin-singlefile` | Primary `dist/index.html` (+ `dist/images/` public copy) — trivial upload, no asset path breakage | Singlefile inlines JS+CSS only; `publicDir` is copied; no code-splitting; keep `index.html` ≤400 kB |
| ADR-3 | Tailwind v4 CSS-first `@theme` | Tokens co-located with CSS, no `tailwind.config.*` drift; `index.css` is the palette | Extend `@theme` only, never arbitrary hex |
| ADR-4 | File-backed `src/data/*` (no CMS) | Typed arrays are enough for 20 items; CMS adds auth/ISR without benefit | Keep `content.ts` as fallback if CMS is introduced behind `src/lib/cms/` |
| ADR-5 | Alias `@→src/` sync contract | Short imports (`@/utils/cn`) without relative `../../../` | Two-file change (`vite.config.ts` + `tsconfig.json` `paths` + `include`) |

---

## Appendix B — Live-Site Validation

**Smoke script (manual or `agent-browser`):**

```
# after pnpm build && pnpm preview (:4173)
1. /                      → hero + quick-facts + events visible
2. /about-blessed-stanley-rother → timeline renders (8 entries)
3. /history               → same timeline — alternate route
4. /what-to-see           → 3 cards; click each #hash scrolls to section
5. /what-to-see#pilgrim-center (direct) → lands on Pilgrim Center
6. /pilgrimage            → hours/location/Mass
7. /visit-planning        → same as /pilgrimage (alias)
8. /news-events + /news-and-events → 4 events
9. /give + /shrinegift    → 8 giving options
10. /faq                  → 6 Q&As
11. /does-not-exist       → NotFound
12. refresh on /#/pilgrimage#visit → stays on-section (HashRouter)
```

What CI cannot catch: hash-scroll offset on mobile Safari, `divider-weave` paint, font FOIT, `shadow-shrine` clip on `overflow-hidden` parent.

---

## Appendix C — The Meticulous Approach (6-Phase Workflow)

This project follows **ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER** for every non-trivial task.

1. **ANALYZE** — Mine explicit, implicit, and ambiguous requirements; explore 2–3 approaches with trade-offs.
2. **PLAN** — Sequenced phases with checklists + success criteria; present for approval.
3. **VALIDATE** — Obtain explicit go-ahead before coding.
4. **IMPLEMENT** — Library-first, modular, TDD Red→Green→Refactor (one cycle per commit).
5. **VERIFY** — `npx tsc --noEmit` + `pnpm build` + a11y/perf review + edge cases.
6. **DELIVER** — Usage instructions + runbook + follow-up recommendations.

---

## Quick Reference Card

| Need | Path |
|---|---|
| Visitor overview | `README.md` |
| 60-sec agent cheat sheet | `AGENTS.md` |
| Deep workflow + anti-generic | `CLAUDE.md` |
| Intent lineage | `docs/prompts.md` |
| Tokens (24 colors + 2 shadows) + utilities (10) | `src/index.css` (`--font-sans` alias `--font-body`) |
| Route table + aliases | `src/App.tsx` (named exports) |
| Nav single-source | `src/data/nav.ts` (with `description`) |
| Content arrays (5) + site | `src/data/content.ts` (`category`, `icon`) + `src/data/site.ts` |
| Primitives | `src/components/ui/*` (Button/Container/SectionHeading/Accordion/Reveal) + Emblem/SkipLink/Timeline |
| Hooks | `src/hooks/useScrolled.ts` |
| Merge helper | `src/utils/cn.ts` |
| Images | `public/images/*.jpg` (local fallback) + Pexels CDN for hero/whatToSee (onError→local) → `dist/images/` |
| Vite alias + singlefile | `vite.config.ts` |
| TS strict + include | `tsconfig.json` (includes `src/data/site.ts` via `src`) |
| Pre-ship gate | `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` (~370kB/108kB + dist/images/) → `pnpm preview` |
