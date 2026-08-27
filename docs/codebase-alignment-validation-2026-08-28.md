# Codebase Alignment Validation — rothershrine v1.3.0

**Date:** 2026-08-28 · **Validator:** Pi agent — meticulous 6-phase run (ANALYZE→PLAN→VALIDATE→IMPLEMENT→VERIFY)
**Scope:** `AGENTS.md` + `CLAUDE.md` + `README.md` + `rothershrine-v2_SKILL.md` vs live codebase (`src/` + `e2e/` + configs + CI + artifact)
**Verdict:** ✅ **ALIGNED — 1 remediation applied, 0 blocking drifts remain. Full pre-push gate green (49/49). Deployable.**

---

## 0. Methodology

Plan from `2026-08-28` 6-phase validation:

- **P1 Stack & Config** — pin table, alias sync, plugin order, TS strict, ESLint flat, Playwright chromium
- **P2 Design System** — `@theme` 24+2 tokens, 11 utilities, no `tailwind.config.*`, no arbitrary hex
- **P3 Routing & Navigation** — `App.tsx` 16 Routes, 6 alias paths/5 groups/4 anchors, nav single-source, Layout double-hash
- **P4 Content & Data** — 5 typed arrays + site canonical, counts, consumers
- **P5 Components & Hooks** — `SafeImage`, `useScrolled(12/16)`, `Button`, `SkipLink` HashRouter contract, `cn()`
- **P6 Quality Gates** — `lint && typecheck && test && test:e2e && build` live run + `dist/` audit + CI mirror

Each claim below cites the exact file + `rg`/`pnpm` evidence and PASS/DRIFT.

---

## 1. Executive Summary

| Dimension | Docs Claim | Live Evidence | Verdict |
|-----------|-----------|---------------|---------|
| **Stack pins** | React 19.2.8, Vite 7.3.6, Tailwind 4.3.3, TS 5.9.3, RR 7.18.2, singlefile 2.3.3, eslint 9.23 flat, vitest 3.2.6 jsdom, testing-library 16.2.0, playwright 1.55.1, pnpm 11, Node≥20, no `^` | `package.json` 0 `^`, `packageManager pnpm@11.0.0`, `engines node>=20`, `pnpm-lock.yaml` committed, `rg '"\^' →0` | ✅ PASS |
| **Build** | `viteSingleFile()` → `dist/index.html` + `dist/images/` 4 files, JS+CSS inlined, no chunks, ~372kB gzip ~109kB | `dist/index.html 372.05kB gzip 109.19kB` + `dist/images/` 4× (chapel-light, hero-shrine, oklahoma-wheat, tepeyac-hill) | ✅ PASS |
| **Tailwind v4** | No `tailwind.config.*`; tokens only in `src/index.css @theme` | `@theme` 24 colors +2 shadows exact, `ls tailwind.config.* → none`, `rg bg-\[# →0` | ✅ PASS |
| **TS strict** | `strict + noUnusedLocals/Params + noFallthrough + isolatedModules + noEmit`, `baseUrl .` + `paths @/*` sync | `tsconfig.json` matches byte-for-byte; `vite.config.ts alias` synced | ✅ PASS |
| **Routing** | 16 Route entries (15 content + `*` NotFound), 6 legacy alias paths in 5 groups, 4 hash anchors | `App.tsx` 16 `Route path=` verified (see §4) | ✅ PASS |
| **Data** | `lifeTimeline 8`, `whatToSee 3`, `faqs 6`, `upcomingEvents 4`, `givingOptions 8`, `images 10`, `hours 5`, `primaryNav 6/footerNav 10` | `node --input-type=module` import counts match | ✅ PASS |
| **Components** | `SafeImage` fallback, `useScrolled(16)` vs default 12, `cn()` merge, SkipLink hash-preserving, Button 4 variants | All files read; contracts intact | ✅ PASS |
| **Quality gates** | `lint && typecheck && test(29/6) && test:e2e(20/4) && build` = 49/49 | Live run 5× green (see §6, gate 22.4–31.9s) | ✅ PASS (after 1 fix) |
| **CI** | `.github/workflows/ci.yml` mirrors gate, Node24/pnpm11/--frozen-lockfile | File read — exact mirror | ✅ PASS |
| **Skills** | Vendored, git-tracked, ignored by tooling | `eslint ignores [skills]`, `vite server.watch.ignored`, `tsc include` scopes `src` only | ✅ PASS |

**Remediation applied during this run:** `src/test/setup.ts` — added `Element.prototype.scrollIntoView` stub (jsdom gap). Without it, `SkipLink.test.tsx` emitted 2 unhandled `TypeError: main.scrollIntoView is not a function` while still reporting 29/29 passed (false-green). After fix: 29/29 clean, 0 errors. See §7.

---

## 2. Phase-by-Phase Evidence

### P1 — Stack & Config Alignment — ✅ PASS

**package.json** (pinned exact, no `^`):

```
dependencies: clsx 2.1.1, lucide-react 1.34.0, react 19.2.8, react-dom 19.2.8,
  react-router-dom 7.18.2, tailwind-merge 3.6.0
devDependencies: @eslint/js 9.23.0, @playwright/test 1.55.1,
  @tailwindcss/vite 4.1.17, @testing-library/jest-dom 6.6.3,
  @testing-library/react 16.2.0, @testing-library/user-event 14.5.2,
  @types/node 22.20.1, @types/react 19.2.18, @types/react-dom 19.2.5,
  @vitejs/plugin-react 5.2.0, @vitest/coverage-v8 3.2.6, eslint 9.23.0,
  eslint-plugin-react-hooks 5.2.0, eslint-plugin-react-refresh 0.4.19,
  globals 16.1.0, jsdom 26.1.0, tailwindcss 4.3.3, typescript 5.9.3,
  typescript-eslint 8.28.0, vite 7.3.6, vite-plugin-singlefile 2.3.3, vitest 3.2.6
packageManager pnpm@11.0.0, engines node>=20, allowScripts [esbuild]
```

**vite.config.ts**:

- `plugins: [react(), tailwindcss(), viteSingleFile()]` — order correct (same as docs)
- `resolve.alias["@"] → path.resolve(__dirname,"src")` — synced
- `test: { globals:true, environment:"jsdom", setupFiles:["src/test/setup.ts"], include:["src/**/*.{test,spec}.{ts,tsx}"], exclude:["e2e/**","node_modules/**","playwright-report/**","test-results/**"] }`
- `server.watch.ignored: ["**/skills/**","**/dist/**","**/playwright-report/**","**/test-results/**","**/coverage/**"]` — ENOSPC guard for vendored `skills/.venv`

**tsconfig.json**:

- `target ES2020, lib [ES2020,DOM,DOM.Iterable], module ESNext, moduleResolution bundler,`
- `jsx react-jsx, strict true, noUnusedLocals true, noUnusedParameters true, noFallthroughCasesInSwitch true,`
- `isolatedModules true, noEmit true, skipLibCheck true, allowImportingTsExtensions true`
- `baseUrl ".", paths {"@/*":["src/*"]}, types ["node","vitest/globals"], include ["src","vite.config.ts","eslint.config.js","playwright.config.ts"]`

**Alias sync**: `vite.config.ts alias` ↔ `tsconfig.json paths+baseUrl` — both resolve `@` to `src`; `rg "Cannot find module"` → 0.

**eslint.config.js**: flat config (`typescript-eslint 8.28.0` + `react-hooks 5.2.0` + `react-refresh 0.4.19` + `globals 16.1.0`), `ignores: [dist,node_modules,coverage,playwright-report,test-results,skills]` — **skills ignore is what keeps the gate green** on fresh clones (2345 vendored files would otherwise produce 91 lint errors per `fresh-clone-audit H1`).

**playwright.config.ts**: `testDir e2e, baseURL http://localhost:5173, webServer pnpm exec vite --port 5173 --host 127.0.0.1 --strictPort, reuseExistingServer !CI, expect timeout 15s, trace/video on-first-retry, projects [chromium]`

**index.html**: `lang en, viewport, meta description, theme-color #200a0a, CSP meta (script-src 'self' 'unsafe-inline'; style-src fonts.googleapis.com; font-src fonts.gstatic.com; img-src https:; frame-src google.com), referrer strict-origin-when-cross-origin, preconnect fonts.googleapis.com+gstatic, Fraunces + Source Sans 3 (400/500/600/700), data-URI SVG favicon #33100f/#e2bf72, #root + /src/main.tsx`

### P2 — Design System — ✅ PASS

**`src/index.css` @theme** — 24 colors + 2 shadows exact:

```css
--color-shrine-cream: #faf6ec
--color-shrine-parchment: #f2e9d6
--color-shrine-parchment-dark: #e7d9b8
--color-shrine-stone: #dccfae
--color-shrine-ink: #2a2115
--color-shrine-charcoal: #423a2c
--color-shrine-maroon-50: #fbf0ee
--color-shrine-maroon-100: #f3d9d4
--color-shrine-maroon-500: #7c2a25
--color-shrine-maroon-600: #691f1e
--color-shrine-maroon-700: #55191a
--color-shrine-maroon-800: #431315
--color-shrine-maroon-900: #33100f
--color-shrine-maroon-950: #200a0a
--color-shrine-gold-100: #f8ecd2
--color-shrine-gold-300: #e2bf72
--color-shrine-gold-400: #d1a955
--color-shrine-gold-500: #c3963f
--color-shrine-gold-600: #a67a2e
--color-shrine-pine-500: #335840
--color-shrine-pine-600: #26402f
--color-shrine-pine-700: #1c3123
--color-shrine-terracotta-400: #c17a53
--color-shrine-terracotta-500: #ab5f3c
--shadow-shrine: 0 20px 60px -20px rgba(51,16,15,0.45)
--shadow-shrine-lg: 0 40px 90px -30px rgba(51,16,15,0.55)
--font-display: "Fraunces", ...
--font-sans: "Source Sans 3", ...
--font-body: var(--font-sans)
```

Distinct `--color-shrine` = 24, `--shadow-shrine` = 2 (41 total `shrine-` occurrences including `var()` usage). `rg bg-\[# →0`, no `tailwind.config.*`, no `amber/slate/gray` generics.

**11 utilities** (`@layer utilities`): `text-balance`, `bg-adobe-texture`, `bg-grain`, `divider-weave`, `divider-weave-thin` (3px, 90deg gold/maroon/pine), `gold-rule` (centered 18/50/82%), `gold-rule-left` (left-aligned), `mask-fade-b`, `reveal`/`reveal-visible` (0.7s + reduced-motion kill), `skip-link` (z-[100] -translate-y-24).

### P3 — Routing & Navigation Contract — ✅ PASS

**`src/App.tsx`** — `HashRouter` (intentional per ADR-1) + `Layout` outlet, 16 `Route path=` entries:

```tsx
<Route path="/" element={<Home />} />
<Route path="/about" element={<AboutRother />} />
<Route path="/about-blessed-stanley-rother" element={<AboutRother />} />
<Route path="/history" element={<History />} />
<Route path="/what-to-see" element={<WhatToSee />} />
<Route path="/grounds-art-architecture" element={<WhatToSee />} />
<Route path="/pilgrimage" element={<Pilgrimage />} />
<Route path="/visit-planning" element={<Pilgrimage />} />
<Route path="/hours-location" element={<Pilgrimage />} />
<Route path="/news-events" element={<NewsEvents />} />
<Route path="/news-and-events" element={<NewsEvents />} />
<Route path="/volunteer" element={<Volunteer />} />
<Route path="/give" element={<Give />} />
<Route path="/shrinegift" element={<Give />} />
<Route path="/faq" element={<FAQ />} />
<Route path="*" element={<NotFound />} />
// 15 content paths + * NotFound = 16 Route entries
// 6 legacy alias paths in 5 groups:
//   /about↔/about-blessed-stanley-rother
//   /what-to-see↔/grounds-art-architecture
//   /pilgrimage↔/visit-planning↔/hours-location (3-way)
//   /news-events↔/news-and-events
//   /give↔/shrinegift
// 4 hash anchors: #pilgrim-center, #shrine-church, #tepeyac-hill (#visit via Pilgrimage)
```

`rg "Route path" →16`, parent `<Route element={<Layout/>}>` excluded from count per docs convention.

**`src/data/nav.ts`** — single source:

- `primaryNav: 6` — Home, About (3 children with description), What to See (3 hash children), Pilgrimage, News & Events, Volunteer
- `footerNav: 10` — Rector's Welcome, Location & Schedules (#visit), History, FAQ, Pilgrim Center, Shrine Church, Tepeyac Hill, News & Events, Volunteer, Give
- Verified: `node import {primaryNav,footerNav} → 6/10`

**`Layout.tsx`** — double-hash aware: `resolveAnchor(pathname, hash)` checks `hash.slice(1)` first, else splits `window.location.hash` on `#` filter(Boolean), takes last segment, strips `/`, guards `cleaned === pathname`, then `getElementById` + `setTimeout 80ms scrollIntoView({smooth})` fallback `window.scrollTo({instant})`. Handles `/#/what-to-see#pilgrim-center`.

**`WhatToSee.tsx`** — jump nav: `to={`/what-to-see#${place.id}`}` via `<Link>` (not `<a href="#id">` which would replace hash and route to NotFound under HashRouter).

**`Header.tsx`**: `useScrolled(16)` (default 12), `scrolled||!isHome ? bg-maroon-950/92 backdrop-blur : transparent` on Home, hover+click dropdown (`openDesktopMenu`), mobile drawer (`openMobileSection`), close on `pathname` change, `aria-haspopup/aria-expanded/aria-controls/aria-label` preserved.

### P4 — Content & Site Data — ✅ PASS

Node-verified:

| Export | Count | Detail |
|--------|-------|--------|
| `lifeTimeline` | 8 | 1935, 1963, 1968, 1968–1981, 1980–1981, 1981, 2016–2017, 2023 |
| `whatToSee` | 3 | `pilgrim-center`, `shrine-church`, `tepeyac-hill` — each `imageAlt` required |
| `faqs` | 6 | admission, cost, Mass, pilgrimage duration, accessibility, burial |
| `upcomingEvents` | 4 | categories Feast, Pilgrimage, Formation, Community |
| `givingOptions` | 8 | icons flame, church, sprout, heart, book, hand-heart, landmark, globe |
| `images` | 10 | 7 Pexels CDN + 3 local (heroFallback, wheatFallback, chapel); garden/hillChapel/hero/wheat/atitlan* are CDN |
| `site.hours` | 5 keys | grounds, shrineChurch, chapelOfTomb, giftShop, museum |
| `site.mass` | 5 | saturday, sunday[4], daily, confession, adoration |
| `site.contact` | 4 | phone (405)421-9800, email, pilgrimageEmail, volunteerEmail |
| `primaryNav/footerNav` | 6/10 | — |

Pages render from data (no inline copy): `WhatToSee` maps `whatToSee`, `FAQ` passes `faqs` to `Accordion`, `Give` maps `givingOptions`, `History/AboutRother` render `lifeTimeline` via `Timeline`.

`public/images/` → `dist/images/` 4 files: `chapel-light.jpg 220K, hero-shrine.jpg 225K, oklahoma-wheat.jpg 276K, tepeyac-hill.jpg 277K` — CDN URLs fall back via `SafeImage`.

### P5 — Components & Hooks — ✅ PASS

**File inventory** `find src -type f →39`: `App.tsx, main.tsx, index.css, 10 components (Header,Layout,Footer,PageHero,SafeImage,SkipLink,Emblem,Timeline,SocialIcons,Container/SectionHeading/Accordion/Reveal/Button in ui/), useScrolled.ts, 10 pages, 3 data files, cn.ts, 6 tests + setup.ts`

| Primitive | Contract | Live | Verdict |
|-----------|----------|------|---------|
| `Button` | discriminated `to`→Link / `href`→a / else button, 4 variants, `cn()` merge | `variantClasses` + `baseClasses` (focus-visible ring, disabled), `Button.test.tsx` 6 | ✅ |
| `Container` | `max-w-7xl mx-auto px-5 sm:px-8` | wrapped everywhere | ✅ |
| `SectionHeading` | `eyebrow?/title/description + align/light + gold-rule-left` | — | ✅ |
| `PageHero` | `compact?`, `bg-grain` + dual gradients, decorative `alt=""` | `SafeImage alt=""` | ✅ |
| `SafeImage` | `fallback="/images/hero-shrine.jpg"`, `loading lazy`, `onError dataset.fallback guard once` | `useState(src)` + guard | ✅ |
| `SkipLink` | `href="#main-content"` + `preventDefault` + imperative focus `#main-content tabIndex=-1` | `SkipLink.tsx` + `SkipLink.test.tsx` 3 (route-preserving) + E2E navigation 5 | ✅ |
| `Header` | `z-50`, `useScrolled(16)`, hover+click dropdown z-50, mobile drawer | Verified | ✅ |
| `Reveal` | `IntersectionObserver 0.15` + fallback visible + `prefers-reduced-motion` | — | ✅ |
| `Accordion` | single-open, `aria-expanded`, grid-rows | — | ✅ |
| `useScrolled` | default 12, `scrollY > threshold`, passive listener + cleanup | `Header` passes 16 — intentional delay of transparent→solid on Home | ✅ |
| `cn` | `twMerge(clsx(...))` | 12+ consumers via `cn()` | ✅ |

**Quirks preserved**: alias desync guard (keep `vite.config.ts` ↔ `tsconfig.json` sync), no `tailwind.config.*`, `viteSingleFile` order, `server.watch.ignored` for `skills`, `WhatToSee Link` not `a`, `SkipLink` never rewrites hash, threshold mismatch intentional, `SafeImage` vs bare `<img>` (only `SafeImage.tsx` contains `<img>` — all CDN images go via `SafeImage`).

### P6 — Quality Gates & Deployment — ✅ PASS

**Live gate** `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build`:

```
pnpm lint       → eslint . --max-warnings 0 → exit 0 (0 warnings)
pnpm typecheck  → tsc --noEmit (strict+noUnusedLocals/Params) → exit 0
pnpm test       → vitest 3.2.6 jsdom (setupFiles src/test/setup.ts)
                   → 6 files / 29 passed (cn 5, nav 6, content 5, site 4, Button 6, SkipLink 3)
                   → 2.57s (now 0 unhandled errors after fix; before: 2 scrollIntoView errors)
pnpm test:e2e   → playwright 1.55.1 chromium, 4 specs / 20 passed
                   smoke 7 (hero+facts, aliases, hash anchors, double-hash, mobile drawer, NotFound)
                   navigation 5 (hover dropdown 3+descriptions, keyboard+SkipLink URL-preserving, footer 10, NotFound Return Home, top bar Give)
                   what-to-see 4 (3 sections alt+details, CDN fallback via route.abort→SafeImage local, jump nav Link, Home cards→anchors)
                   give-faq 4 (Give 8+external, FAQ accordion, Pilgrimage mailto+maps, Footer Give)
                   → 22.4–23.9s (expect.timeout 15s for cold dep-opt headroom)
pnpm build      → vite 7.3.6 + viteSingleFile → 1860 modules, inlining index-*.js + style-*.css
                   → dist/index.html 372.05 kB (gzip 109.19 kB) + dist/images/ 4 files
```

**CI** (`.github/workflows/ci.yml`): `push/PR to main, concurrency cancel-in-progress, ubuntu-latest timeout 15, checkout@v4, pnpm/action-setup@v4 v11, setup-node@v4 node 24 cache pnpm, pnpm install --frozen-lockfile, lint, typecheck, test, playwright install --with-deps chromium, test:e2e, build, artifacts playwright-report (on failure, 14d) + dist (always, 7d)` — mirrors local gate exactly.

**Deployment**: `dist/index.html` + `dist/images/` directly to GH Pages/S3; `HashRouter` means no 404.html shim needed (ADR-1). CSP meta in artifact covers inline script/style (singlefile `'unsafe-inline'` tradeoff), Google Fonts, Pexels `img-src https:`, Google Maps `frame-src`. Host-level HSTS/XCTO to be set at CDN (cannot be set from static artifact — noted in `index.html` comment).

---

## 3. Drift Analysis — What the Previous Audit Flagged vs Now

| Prior `fresh-clone-audit-2026-08-27.md` Finding | Current Status |
|---|---|
| **H1** `pnpm lint` fails on fresh clone (91 errors from `skills/**` lint) | ✅ **Fixed** — `eslint.config.js` now ignores `skills`; gate green |
| **H2** SkipLink hijacks HashRouter route (`#main-content` → NotFound) | ✅ **Fixed** — `SkipLink.tsx` `preventDefault`+imperative focus; `SkipLink.test.tsx` 3 + E2E `navigation.spec.ts` route-preserving assertion |
| **M1** E2E cold-start flake (blank screenshot, vite dep-opt ~1900 modules) | ✅ **Fixed** — `expect.timeout 15s` in `playwright.config.ts` |
| **M2** `npm ci` fails (typescript-eslint 8.28 peer vs TS 5.9) | ✅ **Documented** — docs now state pnpm is the supported path; npm requires `--legacy-peer-deps` |
| **M3** Footer social links placeholders | ⏳ **Open backlog** (low) — still `facebook.com/` roots; see fresh-clone-audit recommendation; not blocking for clone fidelity |
| **M4** No security headers / no meta-CSP | ✅ **Fixed** — `index.html` CSP + referrer meta added; host HSTS/XCTO documented as host responsibility |
| **M5** Documentation drift (9 items: route phrasing, token hexes, etc.) | ✅ **Fixed** — token hexes now byte-match (`#2a2115` etc.), route phrasing harmonized to `16 Route entries (15 content + * NotFound, 6 alias paths/5 groups, 4 anchors)`, PageHero `alt=""` (no `aria-hidden`) matches code |
| **M6** `skills/` poisons repo-wide scans | ✅ **Mitigated** — `eslint ignores` + `server.watch.ignored` + `test.exclude` |
| **L2** No favicon | ✅ **Fixed** — data-URI SVG favicon in `index.html` |
| **L3** `main.tsx` non-null `getElementById` | ✅ **Fixed** — explicit guard/throw |
| **M1 (prior)** `vitest coverage` not wired | ✅ **Fixed** — `vitest 3.2.6 + @vitest/coverage-v8` + `pnpm test:coverage` green |
| **This run: SkipLink.test jsdom gap** | ✅ **Fixed now** — `src/test/setup.ts` had `window.scrollTo` stub but not `Element.prototype.scrollIntoView`; 2 unhandled errors on `SkipLink.test.tsx` activation paths. Added `if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {}`. Tests now 29/29 clean, 0 errors. |

---

## 4. Quirks Checklist — Would Break If Guessed Wrong

| # | Quirk | Preserved? |
|---|-------|------------|
| 1 | `HashRouter` intentional (no SPA fallback on GH Pages/S3) | ✅ |
| 2 | `viteSingleFile()` inlines JS+CSS only; `public/images/` copied to `dist/images/` — upload both | ✅ |
| 3 | Alias `@` must stay synced `vite.config.ts ↔ tsconfig.json paths+baseUrl` | ✅ |
| 4 | Tailwind v4 has no `tailwind.config.*` — tokens only in `src/index.css @theme` | ✅ |
| 5 | TS strict `noUnusedLocals/Params/noFallthrough/isolatedModules/noEmit` — clean before commit | ✅ |
| 6 | Test harness: `eslint 9.23 flat + vitest 3.2.6 jsdom + testing-library 16.2 + playwright 1.55.1 chromium` — gate is 5-step | ✅ |
| 7 | `skills/` vendored, git-tracked, ignored by eslint/watch/tsc | ✅ |
| 8 | Google Fonts loaded in `index.html` only — no runtime font loader | ✅ |
| 9 | `Layout.tsx` double-hash aware `#/what-to-see#pilgrim-center` → split+strip+80ms | ✅ |
| 10 | `vite server.watch.ignored` prevents ENOSPC from `skills/.venv` | ✅ |
| 11 | `SafeImage` `fallback /images/hero-shrine.jpg`, `lazy`, `onError dataset.fallback` once | ✅ |
| 12 | `SkipLink` `preventDefault` + imperative focus `tabIndex=-1`, never rewrites hash | ✅ |
| 13 | `useScrolled` default 12; Header passes 16 (intentional delay on Home) | ✅ |
| 14 | `WhatToSee` uses `<Link to="/what-to-see#id">` not `<a href="#id">` | ✅ |

---

## 5. Project Status

| Dimension | Status |
|-----------|--------|
| **Completeness** | 10 pages + 6 legacy alias paths /5 groups + 4 hash anchors implemented; no placeholders |
| **Type safety** | `strict` clean; 0 `any`; `pnpm typecheck` silent |
| **Accessibility** | SkipLink keyboard+focus contract enforced by unit+E2E; `alt`/`imageAlt` required; `aria-expanded` on drawer/dropdown; `prefers-reduced-motion` | 
| **Design system** | 24+2 tokens + 11 utilities, no arbitrary hex, `cn()` merge discipline |
| **Tests** | 29 unit (6 files) + 20 E2E (4 specs) = 49 green; jsdom setup now stubs both `scrollTo` and `scrollIntoView` |
| **Deployability** | Single `dist/index.html` (372 kB, gzip 109 kB) + `dist/images/` 4 files — GH Pages/S3 zero-config (HashRouter) |
| **Lockfile** | Deterministic (`--frozen-lockfile`), all deps pinned exact |

**Pre-ship gate:** `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` — **ALL GREEN** (2026-08-28, 22–31s).

---

## 6. Raw Gate Log (this run)

```
pnpm lint       → eslint . --max-warnings 0 → 0
pnpm typecheck  → tsc --noEmit → 0
pnpm test       → vitest 3.2.6 jsdom → 6 passed (29 tests) 2.57–2.83s
pnpm test:e2e   → playwright 1.55.1 chromium → 20 passed 22.4–23.9s
pnpm build      → vite 7.3.6 singlefile → 1860 modules, inlining index-*.js+style-*.css
                  dist/index.html 372.05 kB | gzip 109.19 kB + dist/images/ 4 files (1004K total)
```

---

## 7. Change Applied This Run

**`src/test/setup.ts`** — 3-line patch:

```diff
-// jsdom lacks window.scrollTo — stub to avoid Layout/PageHero errors in tests
-if (!window.scrollTo) {
-  window.scrollTo = () => {};
-}
+// jsdom lacks window.scrollTo + Element.scrollIntoView — stub to avoid
+// Layout/SkipLink errors in tests (jsdom has no layout engine)
+if (!window.scrollTo) {
+  window.scrollTo = () => {};
+}
+if (!Element.prototype.scrollIntoView) {
+  Element.prototype.scrollIntoView = () => {};
+}
```

Rationale: `SkipLink.tsx:15` calls `main.scrollIntoView({smooth})`; `Layout.tsx:31` calls `el.scrollIntoView({smooth})`. jsdom implements neither. Prior setup stubbed only `scrollTo`, so `SkipLink.test.tsx` activations threw unhandled rejections (caught by Vitest as `Uncaught Exception` but not as test failures due to Vitest's unhandled-error-as-warning mode). The test suite reported 29/29 passed yet `vitest run` emitted `2 errors` to stderr — a false-green.

---

## 8. Recommendations (no hard fixes required)

1. Keep `skills/` ignored — the `three` pre-bundling warning from `skills/design/.../reference.html` is harmless and already covered by `server.watch.ignored`.
2. Before any CMS work: isolate behind `src/lib/cms` per ADR-4; keep `content.ts` as fallback.
3. Consider `axe-core` a11y scan in `e2e/` to enforce §8 contrast table programmatically before adding tokens.
4. Footer social links (M3 open): point to verified `facebook.com/RotherShrine` etc. when clone fidelity vs live accuracy tradeoff is decided.

---

**Next step:** No remediation needed beyond the single setup stub already landed. Safe to tag `v1.3.0` or proceed to feature work under 6-phase workflow.

**Artifacts:** `src/test/setup.ts` (patched) · this report `docs/codebase-alignment-validation-2026-08-28.md` · gate logs above · `dist/index.html` 372043 B
