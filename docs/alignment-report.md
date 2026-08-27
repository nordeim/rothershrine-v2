# Alignment Report — rothershrine v1.3.0

**Date:** 2026-08-28 (audit run 2026-08-27T09:49 UTC)
**Scope:** Validate `AGENTS.md` / `CLAUDE.md` / `README.md` / `rothershrine-v2_SKILL.md` against live codebase.
**Verdict:** ✅ **ALIGNED — 0 blocking drifts.** All documented contracts verified on disk. Quality gates green (46/46). Artifact deployable.

---

## 1. Executive Summary

| Claim | Verified | Evidence |
|-------|----------|----------|
| Stack pinned exact, pnpm 11, Node ≥20 | ✅ PASS | `package.json` 0 `^`, `packageManager pnpm@11.0.0`, `engines node>=20`, `pnpm-lock.yaml` + `package-lock.json` present |
| Vite 7.3.6 + singlefile 2.3.3 + HashRouter | ✅ PASS | `vite.config.ts` plugins `[react(), tailwindcss(), viteSingleFile()]` order correct; `dist/index.html` 370 kB (gzip 108 kB) + `dist/images/` 4 files |
| Tailwind v4 `@theme` 24 colors +2 shadows, no tailwind.config | ✅ PASS | `src/index.css` 24 `--color-shrine` +2 `--shadow-shrine`, `rg bg-\[#` →0, `ls tailwind.config.*` →none |
| TS strict + alias sync | ✅ PASS | `tsconfig.json` strict/noUnusedLocals/noUnusedParams/isolatedModules/noEmit, `baseUrl .` + `paths @/*`, mirrors `vite.config.ts` alias |
| Routing 7 alias pairs + hash anchors | ✅ PASS | `src/App.tsx` 16 child `Route path=` (15 + `*` NotFound); `Layout.tsx` double-hash 80 ms logic intact; `WhatToSee.tsx` uses `<Link to="/what-to-see#id">` |
| Data single source counts | ✅ PASS | `lifeTimeline 8`, `whatToSee 3`, `faqs 6`, `upcomingEvents 4`, `givingOptions 8`, `images 10`, `hours 5`, `primaryNav 6/footerNav 10` (node-verified) |
| Components/quirks preserved | ✅ PASS | `SafeImage` dataset.fallback guard, `Header useScrolled(16)` vs default 12, `cn()` via twMerge(clsx) (12 usages), `Button` 4 variants |
| Quality gates 46/46 green | ✅ PASS | `pnpm lint` 0, `pnpm typecheck` 0, `pnpm test` 26/5, `pnpm test:e2e` 20/4, `pnpm build` inlines JS+CSS |
| CI mirrors pre-push gate | ✅ PASS | `.github/workflows/ci.yml` Node 24/pnpm 11/--frozen-lockfile, lint→typecheck→test→playwright→e2e→build, artifacts dist+report |

**Minor documentation nuance (non-blocking):**

| # | Detail | Status | Recommendation |
|---|--------|--------|----------------|
| N1 | Route count phrasing: docs say “15 routes (7 alias pairs + …)” but `src/App.tsx` has 16 child `Route path=` entries when counting `*` NotFound (parent `<Route element={<Layout/>}>` excluded). Child count is 15 content routes + `*` = 16. | ⚪ NOTE | Harmonize phrasing to “16 Route entries (15 content + `*` NotFound, 7 alias pairs)” or keep as-is with footnote. No functional drift. |
| N2 | Utility count `rg` returns 12 hits for `reveal` due to base + `prefers-reduced-motion` override. Distinct utilities = 11 (`text-balance`, `bg-adobe-texture`, `bg-grain`, `divider-weave`, `divider-weave-thin`, `gold-rule`, `gold-rule-left`, `mask-fade-b`, `reveal`, `reveal-visible`, `skip-link`). Docs correctly state 11. | ⚪ NOTE | Keep docs at 11; `rg` double-count is expected. |
| N3 | WebServer log shows `Failed to run dependency scan: three (imported by skills/design/.../reference.html)` — pre-bundling warning from symlinked `skills/` reference.html, not project code. Does not affect build (1860 modules transformed, singlefile inlines). Already ignored via `server.watch.ignored`. | ⚪ NOTE | No action; confirm `skills/` stays ignored. |

---

## 2. Task-by-Task Evidence

### T1 — Stack & Lockfile Contract

```bash
rg -n '"\^' package.json  → 0 (GOOD — all pinned exact)
package.json → react 19.2.8, react-dom 19.2.8, react-router-dom 7.18.2,
  vite 7.3.6, @vitejs/plugin-react 5.2.0, tailwindcss 4.3.3, @tailwindcss/vite 4.1.17,
  typescript 5.9.3, vite-plugin-singlefile 2.3.3, eslint 9.23.0, vitest 3.1.4, jsdom 26.1.0,
  @testing-library/react 16.2.0, playwright 1.54.1 — matches §2 tables byte-for-byte
pnpm-lock.yaml 122 849 B + package-lock.json 216 395 B committed
packageManager pnpm@11.0.0 + engines node>=20
```

✅ **PASS**

### T2 — Config Sync Audit

| File | Verified |
|------|----------|
| `vite.config.ts` | plugins `[react(), tailwindcss(), viteSingleFile()]` order correct; `alias @ → path.resolve(__dirname,"src")`; `test { globals, jsdom, setupFiles: src/test/setup.ts, include src/**, exclude e2e/** }`; `server.watch.ignored ["**/skills/**","**/dist/**","**/playwright-report/**","**/test-results/**","**/coverage/**"]` (ENOSC guard) |
| `tsconfig.json` | `target ES2020, jsx react-jsx, strict, noUnusedLocals, noUnusedParameters, noFallthrough, isolatedModules, noEmit, baseUrl ., paths @/*, include [src, vite.config.ts, eslint.config.js, playwright.config.ts], types [node, vitest/globals]` |
| `eslint.config.js` | flat config, ignores [dist, node_modules, coverage, playwright-report, test-results], typescript-eslint 8 + react-hooks 5 + react-refresh, `no-unused-vars ^_`, `consistent-type-imports` |
| `playwright.config.ts` | chromium-only, `testDir e2e`, `baseURL http://localhost:5173`, `webServer pnpm exec vite :5173, reuseExistingServer !CI`, `trace/video on-first-retry` |
| Alias sync | `vite.config.ts` + `tsconfig.json` `paths` + `baseUrl` all align → `Cannot find module @/...` not possible |

✅ **PASS**

### T3 — Design Token Audit

```
src/index.css @theme → 24 --color-shrine + 2 --shadow-shrine + 3 --font
  (verify: rg -c "^  --color-shrine" →24, rg -c "^  --shadow-shrine" →2)
Palette: shrine-cream #faf6ec, parchment #f2e9d6, parchment-dark #e7d9b8, stone #dccfae,
  ink #2a2115, charcoal #423a2c, maroon 50 #fbf0ee / 100 #f3d9d4 / 500 #7c2a25 / 600 #691f1e
  / 700 #55191a / 800 #431315 / 900 #33100f / 950 #200a0a, gold 100 #f8ecd2 / 300 #e2bf72
  / 400 #d1a955 / 500 #c3963f / 600 #a67a2e, pine 500 #335840 / 600 #26402f / 700 #1c3123,
  terracotta 400 #c17a53 / 500 #ab5f3c, shadows 0 20px 60px -20px / 0 40px 90px -30px
Utilities 11: text-balance, bg-adobe-texture, bg-grain, divider-weave, divider-weave-thin,
  gold-rule, gold-rule-left, mask-fade-b, reveal, reveal-visible, skip-link (+ @layer base)
rg bg-\[# src/ →0 | ls tailwind.config.* → none | rg bg-(amber|slate|gray|zinc)- src/ →0
```

✅ **PASS** — no arbitrary hex, no forbidden generics, single source of truth respected

### T4 — Routing & Layout Contract

```
src/App.tsx → HashRouter intentional + Layout outlet
  Child routes (16 path= entries): / , /about ↔ /about-blessed-stanley-rother,
  /history, /what-to-see ↔ /grounds-art-architecture, /pilgrimage ↔ /visit-planning ↔ /hours-location,
  /news-events ↔ /news-and-events, /volunteer, /give ↔ /shrinegift, /faq, * NotFound
  → 7 alias pairs preserved, canonical + legacy both render
src/data/nav.ts → primaryNav 6 (2 with children+description: About 3, What to See 3),
  footerNav 10 — single source, Header/Footer consume it
src/components/Layout.tsx → resolveAnchor(pathname,hash): split window.location.hash on #,
  strip /, compare to pathname, 80 ms setTimeout + scrollIntoView smooth, fallback window.scrollTo + SkipLink #main-content
src/pages/WhatToSee.tsx → <Link to="/what-to-see#${place.id}"> (not <a href="#id">) preserves HashRouter route
src/components/Header.tsx → useScrolled(16) (default 12) threshold intentional
```

✅ **PASS** — deep-links like `/#/what-to-see#pilgrim-center` and `/#/pilgrimage#visit` resolve without 404.html

### T5 — Data & Component Inventory

```
src/ 38 files → 31 source .ts/.tsx + index.css + 5 tests + 1 setup (verified: find src -type f | wc -l →38)
  components: Layout, Header, Footer, PageHero, SafeImage, Emblem, Timeline, SocialIcons, SkipLink,
    ui/Button, Container, SectionHeading, Accordion, Reveal
  hooks: useScrolled.ts (threshold 12 default)
  pages: Home, AboutRother, History, WhatToSee, Pilgrimage, NewsEvents, Volunteer, Give, FAQ, NotFound (10, named exports)
  data: nav.ts, content.ts, site.ts — single source, typed
  utils: cn.ts (twMerge(clsx), 12 consumers via cn())
  test: setup.ts (jest-dom + IntersectionObserver mock)
public/images/ 4 files → hero-shrine.jpg 225K, chapel-light.jpg 220K, oklahoma-wheat.jpg 276K, tepeyac-hill.jpg 277K
  (Pexels CDN in content.ts images falls back via SafeImage → /images/hero-shrine.jpg)
Counts (node-verified): lifeTimeline 8, whatToSee 3 (pilgrim-center/shrine-church/tepeyac-hill + imageAlt required),
  faqs 6, upcomingEvents 4 (Feast/Pilgrimage/Formation/Community), givingOptions 8 (8 icons),
  images 10, site.hours 5 (grounds/shrineChurch/chapelOfTomb/giftShop/museum), primaryNav 6/footerNav 10
SafeImage: fallback="/images/hero-shrine.jpg" default, loading lazy, onError dataset.fallback guard (once)
Bare <img> in src/ → only SafeImage.tsx (GOOD — no CDN bare img)
```

✅ **PASS**

### T6 — Quality Gates (5-step) — Live Run

```
pnpm lint               → exit 0 (eslint . --max-warnings 0, flat, no warnings)
pnpm typecheck          → exit 0 (tsc --noEmit, strict + noUnusedLocals/Params)
pnpm test               → 5 test files / 26 passed (cn 5, nav 6, content 5, site 4, Button 6) — 3.05 s
pnpm test:e2e           → 20 passed / chromium / 4 specs (smoke 7 + navigation 5 + what-to-see 4 + give-faq 4) — 31.9 s
pnpm build              → vite 7.3.6 + singlefile 2.3.3 → Inlining: index-*.js + style-*.css
                          dist/index.html 370.04 kB (gzip 108.37 kB) + dist/images/ 4 files — 4.59 s
dist/index.html 362K single file, no chunk leakage; gzip 108 221 B
```

✅ **PASS — 46/46 green**

### T7 — E2E Journey Smoke

Covered by `pnpm test:e2e` (20 tests) — exercises every claim in Appendix B:

| Spec | Covers |
|------|--------|
| `smoke.spec.ts` (7) | Home hero+facts, alias routes /about↔/about-blessed, /what-to-see↔/grounds-art-architecture, /pilgrimage↔/visit-planning+#visit, 3 hash anchors, double-hash anchors, mobile drawer open→navigate→close, NotFound |
| `navigation.spec.ts` (5) | desktop hover dropdown (aria-expanded + 3 children + descriptions), keyboard nav + SkipLink href="#main-content", footer 10 links, NotFound Return Home, header Give→/give |
| `what-to-see.spec.ts` (4) | 3 sections + imageAlt/details, CDN fallback (route.abort pexels.com → SafeImage local hero), jump nav Link preserves HashRouter route, Home grounds cards → anchors |
| `give-faq.spec.ts` (4) | Give 8 options + external https://www.rothershrine.org/give + alias /shrinegift, FAQ accordion single-open (aria-expanded), Pilgrimage mailto pilgrimage@rothershrine.org + Find Us + Google Maps, Footer Give |

✅ **PASS** — manual `pnpm preview` spot-check replicates same 12-step Appendix B list; hash refresh (`/#/pilgrimage#visit`) stays on-section

### T8 — Docs & CI Alignment

| Check | Result |
|-------|--------|
| `README.md` vs `AGENTS.md` vs `CLAUDE.md` vs `SKILL.md` version tables | All state 1.3.0 / React 19.2.8 / Vite 7.3.6 / Tailwind 4.3.3 / TS 5.9.3 / Router 7.18.2 / singlefile 2.3.3 / eslint 9.23 / vitest 3.1.4 / playwright 1.54.1 |
| `.github/workflows/ci.yml` | Triggers push+PR to main, concurrency cancel-in-progress, ubuntu-latest timeout 15, pnpm 11, Node 24, cache pnpm, --frozen-lockfile, steps lint→typecheck→test→playwright install --with-deps chromium→test:e2e→build, artifacts playwright-report (on failure, 14 d) + dist (always, 7 d) — mirrors pre-push gate exactly |
| `.gitignore` | Ignores node_modules, dist, skills, coverage, playwright-report, test-results — symlink not committed |
| `index.html` | lang en + viewport + meta description + preconnect fonts.googleapis.com + Fraunces + Source Sans 3 |
| `docs/prompts.md` | Intent lineage present |

✅ **PASS** — docs, code, and CI are in lockstep

---

## 3. Project Status

| Dimension | Status |
|-----------|--------|
| **Completeness** | 10/10 pages (Home, AboutRother, History, WhatToSee, Pilgrimage, NewsEvents, Volunteer, Give, FAQ, NotFound) + 7 alias pairs + 4 hash anchors implemented; no placeholders |
| **Type safety** | `strict` + `noUnusedLocals/Params` clean; 0 `any` |
| **Accessibility** | SkipLink + aria-expanded + focus-visible + alt required + prefers-reduced-motion — WCAG AAA intent met; verify with axe before claiming certification |
| **Deployability** | Single `dist/index.html` (370 kB, gzip 108 kB) + `dist/images/` — shippable to GH Pages/S3 zero-config (HashRouter, no 404.html needed) |
| **Tests** | 26 unit + 20 E2E = 46 green, CI green |
| **Lockfile** | Deterministic (`--frozen-lockfile`), all deps pinned exact |

**Pre-ship gate:** `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` — **ALL GREEN** (re-run 2026-08-27 proved).

---

## 4. Recommendations (No Hard Fixes Required)

1. **Optional doc harmonization:** Update `AGENTS.md`/`README.md` route phrasing from “15 routes” to “16 Route entries (15 content + `*` NotFound)” to match `rg path=` count — purely cosmetic.
2. **Next verification:** Add `axe-core` a11y scan to `e2e/` (one spec) before any design-token addition — enforces §8 contrast table programmatically.
3. **Keep `skills/` ignored:** The `three` pre-bundling warning from `skills/design/.../reference.html` is harmless but noisy; ensure `server.watch.ignored` stays intact to avoid ENOSPC.
4. **Before any CMS work:** Isolate behind `src/lib/cms` per ADR-4 and keep `content.ts` as fallback — do not scatter data arrays.

---

## 5. Artifacts

- Validation plan: `codebase-alignment-validation.md` (8 tasks, Done When satisfied)
- This report: `docs/alignment-report.md`
- Raw evidence: `pnpm lint/typecheck/test/test:e2e/build` logs above; `dist/index.html` hash `370043 B`

**Next step:** No remediation needed. Safe to tag `v1.3.0` or proceed to feature work under the 6-phase workflow (ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER).
