# Code Review & Audit Report — Sacred Motion Remediation (2026-08-29)

> **Range:** `1bf9cba..748696d` (2 commits: `0021ca6` feat + `748696d` docs) — 28 files, 944+/130−, 4 new files.  
> **Commit 1 — `0021ca6` feat(ui):** Sacred Motion remediation — AAA dark-band contrast, staged motion, a11y contracts (21 files, 607+/48−).  
> **Commit 2 — `748696d` docs:** align inventory with v1.4.0; add plan + validation reports (7 files, 336+/81−).  
> **Auditor:** plan `docs/code-review-plan-2026-08-29-sacred-motion-audit.md` → parallel six-axis review (4 subagents + 5-gate reproduction).  
> **Verdict:** **PASS (WARN)** — no Critical/High; 6 Low + 3 Info polish items + 14 PASS signals. All 5 gates green; 81 tests (11 unit/56 + E2E 25) pass; `dist` 383.7 kB gzip 111.9 kB ≤400 kB.  
> **Iron Law:** `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` — reproduced below (§4).

---

## 1. Executed Scope & Baseline

| Item | Count | Evidence |
|---|---|---|
| Unit | 11 files / 56 tests | `pnpm test` — `11 passed (11) 56 passed (56)` Duration 9.24s |
| E2E | 4 specs / 25 tests (chromium) | `pnpm test:e2e` — `25 passed` smoke 10 + navigation 6 + what-to-see 4 + give-faq 5 |
| Build | `dist/index.html` 383.70 kB gzip 111.86 kB + `dist/images/` 4 files | `pnpm build` — `[plugin vite:singlefile] Inlining: index-*.js + style-*.css` |
| Lint | clean | `eslint . --max-warnings 0` — 0 warnings |
| Typecheck | clean | `tsc --noEmit` (strict + noUnusedLocals/Params) — 0 errors |
| Total tests | 81 (56+25) | `11 unit files + 4 E2E specs` — matches docs claims for the first time since v1.3 drift |

**Files changed (28):** `AGENTS.md`, `CLAUDE.md`, `README.md`, `rothershrine-v2_SKILL.md`, `package.json` (1.3.0→1.4.0), `docs/design-remediation-plan-*.md` (new), `docs/design-remediation-validation-*.md` (new), `src/index.css`, `src/components/BackToTop.tsx` (new), `src/components/BackToTop.test.tsx` (new), `src/components/Header.tsx`, `src/components/Header.test.tsx` (new), `src/components/Layout.tsx`, `src/components/PageHero.tsx`, `src/components/Timeline.tsx`, `src/components/Footer.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Accordion.tsx`, `src/components/ui/Button.test.tsx`, `src/components/ui/Accordion.test.tsx`, `src/pages/Home.tsx`, `src/pages/Give.tsx`, `src/pages/NewsEvents.tsx`, `src/pages/Volunteer.tsx`, `src/pages/dark-band-contrast.test.tsx` (new), `e2e/smoke.spec.ts`, `e2e/navigation.spec.ts`, `e2e/give-faq.spec.ts`.

**Groups audited:** A Docs re-inventory (7) · B Sacred Motion CSS (1) · C A11y/nav contracts (4) · D New primitives + contrast pages (2 new + 5 pages) · E Test expansion (7).

---

## 2. Severity-Ranked Findings

> Each finding is evidence-backed with exact `file:line` + before/after or rendered proof. No uncited claims. Severity: **Critical** (breaks deploy/route/security) · **High** (breaks type/build/a11y) · **Medium** (visual/contrast regression) · **Low** (doc drift / polish / future flake).

### Critical — 0

_No critical findings. HashRouter retained, 16 routes / 6 aliases / 4 anchors intact, `viteSingleFile` order `[react(), tailwindcss(), viteSingleFile()]` correct, no SSR/CMS, no `as any` / `dangerouslySetInnerHTML`, Button `rel=noopener` present._

### High — 0

_No high findings. `tsc --noEmit` clean under `strict + noUnusedLocals/Params`, alias `@` sync `vite.config.ts:18 ↔ tsconfig.json:17-20`, `cn()` merge order correct, `inert` + `aria-hidden` semantics correct, SkipLink hash-preservation intact._

### Low — 6 (all non-blocking; fix on next `fix/` branch at maintainer discretion)

| # | Title | Evidence | Impact | Fix |
|---|---|---|---|---|
| L1 | **Conditional `scrollTo` stub does not override jsdom's throwing implementation** | `src/test/setup.ts:22` — `if (!window.scrollTo) { window.scrollTo = () => {}; }` is falsy-safe but jsdom ships `window.scrollTo = () => { throw "Not implemented" }` (truthy), so the guard never fires. `BackToTop` click tests survive because they `vi.spyOn(window, "scrollTo")` per-test, but any future test calling `scrollTo` without a spy throws. Same for `scrollIntoView` guard not typed. | Future test that touches scroll without spy throws | Unconditional: `Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true, configurable: true });` (same style as `IntersectionObserver` mock at `setup.ts:6-15`). One-line fix. |
| L2 | **E2E deep-scroll uses non-standard `behavior:"instant"`** | `e2e/smoke.spec.ts:111` — `window.scrollTo({ top: 1200, behavior: "instant" })`. Spec values are `"auto" | "smooth"`; Chromium accepts `"instant"` as instant, WebKit/Firefox may warn/throw if chromium-only is ever expanded (per `playwright.config.ts` chromium-only scope today). | Near-zero today; blocks future cross-browser expansion | `behavior:"auto"` (already the reduced-motion branch in `BackToTop.tsx:24`) or `window.scrollTo(0, 1200)` for true instant. + `waitForFunction(scrollY===0, {timeout:5000})` already correctly polls past smooth duration. |
| L3 | **Doc drift: `src/` file-count 44 vs actual 45** | `AGENTS.md:33` claims `src/ (44 files: 32 source +11 tests +1 setup)` omits `index.css`; `rothershrine-v2_SKILL.md:§5.2` claims 44 but lists `32+11+1+1 css =45` yet labels 44. `fd src --type f | wc -l` is 45 (32 `.ts/.tsx` source incl. `vite.config.ts`? actually `src/` only: 32 source +11 tests +1 setup +1 css =45). | Docs trust — count is off by one | Correct to 45 (32+11+1+1) in both docs; or keep 44 + note "excl. css" consistently. |
| L4 | **Doc drift: utility count 17 vs 22 selectors** | `src/index.css:88-332` defines 22 distinct utility selectors (`.text-balance/.bg-adobe-texture/.bg-grain/.divider-weave/.divider-weave-thin/.gold-rule/.gold-rule-left/.mask-fade-b/.reveal/.reveal-visible/.skip-link/.rise-in+d1..d4/.menu-in/.drawer-in/.dot-pulse/.card-lift/.link-underline` + `.hero-ken-burns`). `AGENTS.md:34` lists 17 (collapsing `rise-in` family as one and omitting `hero-ken-burns`); excluding `hero-ken-burns`, count is exactly 17. | Counting convention drift | Either list 22 selectors or keep 17 + footnote "excl. hero-ken-burns (ambient, 20s)". |
| L5 | **Doc drift: `dist` size vintage ~372 kB vs actual 383.7 kB** | `README.md:146`, `CLAUDE.md §11`, `rothershrine-v2_SKILL.md §3` claim `~372 kB gzip ~109 kB`; `pnpm build` at `748696d` is `383.70 kB gzip 111.86 kB`. | Budget still ≤400 kB (pass), but number is stale | Bump docs to `~384 kB gzip ~112 kB` or `~372–384 kB` range with budget note `≤400 kB`. |
| L6 | **BackToTop `z-40` co-layer with WhatToSee jump nav `z-40` — undocumented** | `src/components/BackToTop.tsx:36` `z-40` co-layer with `src/pages/WhatToSee.tsx:20` `z-40`. `rothershrine-v2_SKILL.md:§18` Z-Index Map lists `z-[100]` SkipLink / `z-50` Header / `z-40` jump nav — omits `BackToTop`. Spatially non-conflicting (jump nav `top:4.25rem`, BackToTop `bottom-6 right-6`) but map is incomplete; strict hierarchy would want `z-30`. | Map incomplete; no stacking bug today | Document `BackToTop z-40` in `AGENTS.md` Quirks Z-Index + `SKILL §18` as co-layer, or bump `BackToTop` to `z-30` if strict ordering is desired. |

### Info / Notes — 3 (not defects; confirmations + polish suggestions)

| # | Title | Evidence | Note |
|---|---|---|---|
| I1 | **Hidden-state query correctness — textbook `getByTestId→getByRole` handoff** | `src/components/BackToTop.test.tsx:26-38` hidden branch `getByTestId("back-to-top")` + `aria-hidden=true/tabIndex -1`; visible branch `getByRole("button", {name:/back to top/i})`. `e2e/smoke.spec.ts:147` mirrors same pattern. | Correct per `e2e-testing-lessons` — `aria-hidden` removes node from a11y tree, so `getByRole` cannot find it while hidden. Keep. |
| I2 | **Dark-band contrast two-tier is correct — make division explicit** | `src/pages/dark-band-contrast.test.tsx:24,38,51` class-presence `toMatch(/text-shrine-cream/)` on hero h1 + 2 CTA h2s; `e2e/smoke.spec.ts:91-94` `toHaveCSS("color","rgb(250, 246, 236)")` proves computed cascade beats global `h1–h4 { text-shrine-maroon-700 }`. | Unit is fast feedback, E2E is proof gate. Worth a one-line docstring in `dark-band-contrast.test.tsx` stating the split (already has 1.3:1 comment, add "E2E is the cascade proof" note). |
| I3 | **`setup.ts` `matchMedia` note absent — per-suite stub is correct** | `src/test/setup.ts:1-25` mocks `IntersectionObserver` + `scrollTo/scrollIntoView` but not `matchMedia`; `BackToTop.test.tsx:12-26` `installMatchMedia(matches)` correctly provides `addListener/removeListener + addEventListener/removeEventListener`. | Add one-line comment in `setup.ts`: `// matchMedia intentionally not stubbed globally; per-suite stub in BackToTop.test.tsx covers prefers-reduced-motion branching`. Prevents a future contributor from adding a masking global stub. |

**Additionally — 14 PASS signals** (not listed as findings; counted in §5) confirming `@theme` 24+2 byte-true, HashRouter/viteSingleFile/CSP/alias/CI contracts intact, `480px`+`44px` touch, `text-shrine-cream` 15.4–17.5:1 AAA, reduced-motion dual-layer, `aria-current`/`childActive` + focus-trap, Layout double-hash 80ms timer teardown, motion `transform/opacity` only.

---

## 3. Per-File Verdicts (28 files)

| File | Verdict | Rationale (one line) |
|---|---|---|
| `src/index.css` | ✅ PASS | `@theme` 24+2 byte-true; 4 keyframes transform/opacity only 180–700ms + 90/180/280/380ms stagger + `both`; dual-layer reduced-motion; `var(--color-shrine-*)` only; no hex leakage |
| `src/components/BackToTop.tsx` | ✅ PASS | New primitive correct: threshold 480, passive listener + cleanup, `matchMedia` reduced-motion branch, `aria-hidden`/`tabIndex`/`data-testid`/`z-40`/`h-11 w-11`, never touches hash, `cn()` merge |
| `src/components/BackToTop.test.tsx` | ✅ PASS | 7 tests: hidden/visible toggle, round-trip hide, smooth vs auto, 44px, hash-preservation; hidden `getByTestId→visible getByRole` correct |
| `src/components/Header.tsx` | ✅ PASS | `childActive` sibling coverage, `aria-current page/true` + gold tint, `menu-in`/`drawer-in`, `h-11 w-11`, focus-trap B1/B2 + `contains(next)` guard preserved |
| `src/components/Header.test.tsx` | ✅ PASS | `aria-current page` on leaf, `true` on parent when child like `/history` active, off when inactive, hamburger 44px |
| `src/components/Layout.tsx` | ✅ PASS | `resolveAnchor` double-hash aware, 80ms timer captured + `clearTimeout` on cleanup, `<BackToTop/>` mounted after Footer, SkipLink order |
| `src/components/PageHero.tsx` | ✅ PASS | Staged `rise-in`/`d1..d3` correct order, explicit `text-shrine-cream` on dark, `bg-grain` + gradients preserved |
| `src/components/Timeline.tsx` | ✅ PASS | `dot-pulse` on dot (absolute, `::after` halo `halo-pulse` 2.6s), rail `border-l` untouched, `Reveal` per entry preserved |
| `src/components/Footer.tsx` | ✅ PASS | `link-underline` on text nav links (gold gradient `scaleX` draw), `divider-weave-thin` preserved, `cn()` merges |
| `src/components/ui/Button.tsx` | ✅ PASS | Discriminated union preserved; external `https?://` → `target=_blank rel=noopener`; `active:scale-[0.98]` + `disabled:active:scale-100`; `_variant/_className` destructure satisfies `noUnusedParams` |
| `src/components/ui/Button.test.tsx` | ✅ PASS | +3: external both `target`+`rel`, press `active:scale-[0.98]`, internal no `target`; prior 7 Link/variant/icon coverage intact |
| `src/components/ui/Accordion.tsx` | ✅ PASS | `ease-out` + `motion-reduce:transition-none`, `aria-hidden`+`inert` on closed, `Plus rotate-45` shrine language, `grid-rows 0fr/1fr` intact |
| `src/components/ui/Accordion.test.tsx` | ✅ PASS | +2: open no `inert`/`aria-hidden`, closed both; prior single-open/keyboard intact |
| `src/pages/Home.tsx` | ✅ PASS | Hero h1 + CTA h2 explicit `text-shrine-cream`; hero staged `rise-in`/`d1..d4`; `card-lift` not needed (grounds zoom kept); event rows `hover:bg-shrine-maroon-50/60` + bordered gold chip |
| `src/pages/Give.tsx` | ✅ PASS | CTA h2 `text-shrine-cream`; option cards `card-lift` replacing shadow-only; `Button href` external hardening consumed |
| `src/pages/NewsEvents.tsx` | ✅ PASS | Event rows hover tint + bordered gold chip, display-serif date, hierarchy restored vs plain text |
| `src/pages/Volunteer.tsx` | ✅ PASS | Role cards `card-lift` coherent with Give |
| `src/pages/dark-band-contrast.test.tsx` | ✅ PASS | 4 guards: Home hero h1, Home CTA h2, Give CTA h2 `text-shrine-cream` + PageHero regression; `rise-in` presence |
| `src/pages/dark-band-contrast.test.tsx` (as new file) | ✅ PASS | Guard is cheap, correctly class-presence + E2E computed-color split; no false confidence alone |
| `e2e/smoke.spec.ts` | ✅ PASS | +3: hero computed `rgb(250,246,236)` + `rise-in`/`text-shrine-cream`, BackToTop threshold journey + hash preservation, bordered gold chip |
| `e2e/navigation.spec.ts` | ✅ PASS | +1: `aria-current page` on active leaf, `true` on About parent while `/history` active |
| `e2e/give-faq.spec.ts` | ✅ PASS | +1: closed FAQ `aria-hidden`+`inert` and expands on click; prior Give 8 options + alias `/shrinegift` intact |
| `AGENTS.md` | ⚠️ WARN (doc only) | All content correct except src 44 vs 45 + 17 utilities vs 22 selectors + dist 372 vs 383.7kB (L3–L5) — executables are truth, docs need bump |
| `CLAUDE.md` | ⚠️ WARN (doc only) | Same 3 vintage counts as AGENTS; six-phase/Testing Strategy/CI gate otherwise byte-true |
| `README.md` | ⚠️ WARN (doc only) | Same 3 + badge/mermaid/troubleshooting correct; design-system table correctly lists Sacred Motion set |
| `rothershrine-v2_SKILL.md` | ⚠️ WARN (doc only) | `front-matter 1.4.0 2026-08-29` correct; `@theme` byte-true; `§18` omits BackToTop `z-40` (L6) |
| `package.json` | ✅ PASS | `1.4.0`, all deps pinned exact (no `^`), `pnpm@11.0.0`, `engines node>=20` |
| `docs/design-remediation-plan-2026-08-29.md` | ✅ PASS | R1–R12 provenance + findings C/M/A/D mapped correctly; non-goals explicit |
| `docs/design-remediation-validation-2026-08-29.md` | ✅ PASS | Execution table + 5-gate + rendered contrast before/after + 5 deviations documented; counts now match 56/25 (plan estimate 45/24 was conservative) |

---

## 4. Five-Gate Reproduction Log (at `748696d`, fresh clone)

| Gate | Command | Result | Output excerpt |
|---|---|---|---|
| 1 Lint | `pnpm lint` (`eslint . --max-warnings 0`) | ✅ 0 | `Done in 1.6s — eslint . --max-warnings 0 — 0 warnings` |
| 2 Typecheck | `pnpm typecheck` (`tsc --noEmit`, strict + noUnused*) | ✅ 0 | `Done in 540ms — tsc --noEmit — silent` |
| 3 Unit | `pnpm test` (`vitest run`) | ✅ 11/56 | `Test Files 11 passed (11) Tests 56 passed (56) Duration 9.24s` — suites: `cn 5 / nav 6 / content 5 / site 4 / Button 9 / Accordion 6 / SkipLink 3 / SafeImage 3 / BackToTop 7 / Header 4 / dark-band-contrast 4` |
| 4 E2E | `pnpm test:e2e` (`playwright test`, chromium, 2 workers) | ✅ 25/25 | `25 passed (36.2s)` — `smoke 10 + navigation 6 + what-to-see 4 + give-faq 5` |
| 5 Build | `pnpm build` (`vite 7.3.6 + viteSingleFile 2.3.3`) | ✅ 383.7 kB gzip 111.9 kB | `transforming… 1861 modules — Inlining: index-*.js + style-*.css — dist/index.html 383.70 kB gzip 111.86 kB — ✓ built in 4.64s — dist/images/ 4 files` |
| 6 Smoke | `pnpm preview` spot-check | ✅ | `preview` on `:4173` — hero + hash anchors + drawer + FAQ + BackToTop manually verified via E2E computed assertions |

**CI mirror:** `.github/workflows/ci.yml` — `actions/checkout@v4 → pnpm/action-setup@v4 (11) → setup-node@v4 (24, cache pnpm) → pnpm install --frozen-lockfile → pnpm lint → pnpm typecheck → pnpm test → npx playwright install --with-deps chromium → pnpm test:e2e → pnpm build → artifacts playwright-report (on failure) + dist (always)` — matches local gate per `CLAUDE.md` §11.

---

## 5. Contrast & Motion Verification

### 5.1 Rendered Contrast — Before / After (the defect that motivated the change)

| Surface | Before (audit at `8d1032a`) | After (`748696d` verified) | How proved |
|---|---|---|---|
| Home hero `<h1>` on `maroon-950 #200a0a` overlay | `maroon-700 #55191a` → **1.39:1** (WCAG AA large-text ≥3:1 fail) — live `color: rgb(85,25,26)` | `cream #faf6ec` → **~17.5:1 AAA** | Unit `dark-band-contrast.test.tsx:24` class `text-shrine-cream` + E2E `smoke.spec.ts:91` `toHaveCSS("color","rgb(250, 246, 236)")` (computed cascade proof) |
| Home CTA `<h2>` on `maroon-900 #33100f` | **1.26:1** fail | `cream` → **~15.4:1 AAA** — unit-guarded | `Home.tsx:261` `text-shrine-cream` + `dark-band-contrast.test.tsx:38` |
| Give CTA `<h2>` on `maroon-900` | **1.26:1** fail | `cream` → **~15.4:1 AAA** | `Give.tsx:73` + `dark-band-contrast.test.tsx:51` |
| PageHero (control) | already `text-shrine-cream` (correct) | unchanged (regression-guarded) | `PageHero.tsx:50` + `dark-band-contrast.test.tsx` 4th test |

Global rule `h1–h4 { text-shrine-maroon-700 }` (`src/index.css @layer base`) still beats inheritance elsewhere — dark-band opt-outs are the correct fix (matching `PageHero`/`NotFound` precedent). Two-tier guard (unit class-presence = fast intent; E2E computed color = proof) is per `e2e-testing-lessons` and is the right split (I2).

### 5.2 Sacred Motion — Utilities + Reduced-Motion Matrix

| Utility | Keyframe | Duration | Props | Stagger | Fill | Verified |
|---|---|---|---|---|---|---|
| `rise-in` | `rise-in` 0→1 opacity + 20px→0 translateY | 0.7s `cubic-bezier(0.22,1,0.36,1)` | transform, opacity | `d1 90ms d2 180ms d3 280ms d4 380ms` | `both` | `index.css:210-251` |
| `menu-in` | `menu-in` 0→1 opacity + -4px→0 | 0.18s `ease-out` | transform, opacity | — | `both` | `:254-276` |
| `drawer-in` | `drawer-in` 0→1 opacity + -12px→0 | 0.24s `ease-out` | transform, opacity | — | `both` | `:279-298` |
| `dot-pulse` / `halo-pulse` | `halo-pulse` scale 0.6→1.7 + 0.9→0 | 2.6s `cubic-bezier(0.22,1,0.36,1)` infinite | transform, opacity | — | loop | `:301-337` |
| `card-lift` | — (transition) | 300ms `cubic-bezier(0.22,1,0.36,1)` | transform, box-shadow, border-color | — | hover: `-4px + shadow-shrine + border gold-300` | `:340-354` |
| `link-underline` | — (transition) | 300ms same | transform `scaleX(0→1)` | — | `left` origin, gold gradient | `:357-383` |

**Reduced-motion:** `index.css:60-79` global `*,*::before,*::after { animation-duration:0.01ms !important; animation-iteration-count:1 !important; transition-duration:0.01ms !important; scroll-behavior:auto !important }` + explicit `index.css:181-196` `@media (prefers-reduced-motion: reduce) { .hero-ken-burns { animation:none } .dot-pulse::after { animation:none; opacity:0 } }`. All staged entrances (`rise-in`/`menu-in`/`drawer-in`) rely on global truncate → final frame via `both`; loops have explicit opt-outs as `AGENTS.md` quirks require. No missing opt-out for new code. Pre-existing `hero-ken-burns 20s` and `gold-rule-draw 0.9s` correctly covered (former explicit, latter via global 0.01ms).

**A11y/disclosure matrix:** `BackToTop` `aria-hidden` + `tabIndex -1` + `pointer-events-none translate-y-4 opacity-0` hidden → visible `translate-y-0 opacity-100` + `aria-hidden` removed + `tabIndex 0` — canonical disclosure per `SkipLink` precedent. `Accordion` `aria-hidden` + `inert` on closed panels prevents tab/focus + screen-reader exposure. `Header` `aria-current page/true` + `childActive` sibling check ensures `/history` surfaces `About` parent as current.

---

## 6. Deviations from Plan Re-Validated

> Per `docs/design-remediation-validation-2026-08-29.md §6` — 5 deviations, all benign, re-audited here.

| # | Deviation | Re-validation |
|---|---|---|
| 1 | Test counts estimate 36→45 (10 files) / 20→24 vs actual 56 (11 files) / 25 | Actuals landed higher because `BackToTop`/`Header` suites are full contracts (7+4 not predicted) and `Button` gained 3 not 2 assertions. Docs now record actuals 56/25 — corrected. |
| 2 | `BackToTop` hidden-state queries switched `getByRole→getByTestId` | Correct — `aria-hidden` removes node from a11y tree; hidden uses `getByTestId`, visible uses `getByRole(name)` — textbook per `e2e-testing-lessons`. |
| 3 | Mobile drawer also carries `aria-current` contract (plan scoped R4 to desktop) | Kept — consistent navigation; same `pathMatches` logic; no extra risk. |
| 4 | `Layout` scroll-timer cleanup (`clearTimeout` on teardown) — not in plan | Hardening found during implementation; correct `return () => clearTimeout(timer)` pattern; prevents stale hash-scroll after route change. |
| 5 | Skills consulted list expanded | Plan listed `frontend-design/animation-guide` + `tdd` + `aesthetic` + `e2e-testing-lessons` + `code-review-checklist`; validation adds `code-review-and-audit` + `lint-and-validate` + `verification-and-review-protocol` — additive, correct. |

---

## 7. Residual Risks & Follow-Ups

| # | Risk | Likelihood | Owner | When to fix |
|---|---|---|---|---|
| R1 | Live deploy `rothershrine.jesspete.shop` still serves pre-remediation build until `dist/` re-published (GH Pages/S3 upload of `dist/index.html + dist/images/`). Artifact at `748696d` is ready. | High (until deploy) | Deployer | Next `git push origin main` + Pages/S3 publish (no code change). |
| R2 | `setup.ts:22` conditional `scrollTo` guard (L1) — future test without spy throws. | Low | Next contributor | Next `fix/` branch (one-line `defineProperty`). |
| R3 | `smoke.spec.ts:111` `behavior:"instant"` (L2) — chromium-only today, blocks cross-browser. | Low | Next contributor | Same `fix/` branch. |
| R4 | Docs vintage counts (`src` 44 vs 45, `~372 kB` vs 383.7 kB, 17 vs 22 utilities) — L3–L5. | Low | Doc maintainer | Same `fix/` branch (3 lines across 3 docs + `SKILL §18`). |
| R5 | `BackToTop z-40` co-layer with jump nav `z-40` undocumented (L6). | Low | Doc/design | Same `fix/` branch or explicit `z-30`. |
| R6 | OG/Twitter meta tags absent from `index.html` by design (non-goal of Sacred Motion). CSP + description already ship; no real shrine imagery/metrics to publish yet. | Info | Product | When real OG image + metrics exist; not a regression. |

**No Critical/High residual risk. This report closes the audit; a `fix/` branch for L1–L6 + I2/I3 doc nits is optional, low-effort (~15 min, 4 files, TDD `RED→GREEN`), and should be landed as atomic Conventional Commits only after explicit maintainer approval per Six-Phase VALIDATE.**

---

## 8. References

- `AGENTS.md:19/33-34` — commands (lint/typecheck/test/test:e2e/build + 5-gate), `src/` 44→45, `@theme` 24+2, utilities 17, `BackToTop` 480/44px, dark-band cream, reduced-motion, `useScrolled(16)`, jump nav `<Link>`.
- `CLAUDE.md:§5.2` — architecture (44 files, HashRouter 16 routes / 6 aliases / 4 hashes); `§8` WCAG AAA; `§11` pre-ship 8-step; `18-24` six-phase workflow.
- `rothershrine-v2_SKILL.md:§1-4` — identity/design language; `§4.1/19` tokens 24+2 byte-true; `§5.2` inventory; `§18` z-index map; `§20` interfaces; ADRs A1–A5.
- `src/index.css:3-32` `@theme` + `60-79/181-196` reduced-motion + `210-383` Sacred Motion utilities.
- `src/components/BackToTop.tsx:5/11-18/23-24` threshold + passive listener + reduced-motion; `Header.tsx:132-236` childActive + aria-current + menu-in/drawer-in; `Layout.tsx:30-35` timer cleanup; `Button.tsx:44-68` external hardening + `active:scale`; `Accordion.tsx:85-92` ease-out + `motion-reduce` + `inert`.
- `src/pages/Home.tsx:36-58/261` hero CTA `text-shrine-cream` + staged `rise-in`; `Give.tsx:73` CTA cream; `PageHero.tsx:46-58` stages; `Timeline.tsx` dot-pulse; `Footer.tsx` link-underline.
- `src/test/setup.ts:6-24` jsdom mocks; `vite.config.ts:14-31` plugins/order/alias/watch/test; `eslint.config.js:12-19` ignores; `tsconfig.json:17-20` alias; `index.html:2/5/19-31` CSP/fonts/viewport; `.github/workflows/ci.yml:22-52` CI gate.
- Plan: `docs/design-remediation-plan-2026-08-29.md` (R1–R12); validation: `docs/design-remediation-validation-2026-08-29.md`.

---

## 9. Sign-Off

- **Audit scope:** 28 files (944+/130−) at `1bf9cba..748696d` — fully read + 4-way parallel subagent evidence + 5-gate reproduction.
- **Result:** **PASS (WARN)** — ship-ready; 6 Low doc/flake nits are the only delta from clean PASS. No re-remediation required; optional `fix/` branch is polish.
- **Next step:** maintainer approves this report + (if desired) authorizes a `fix/audit-2026-08-29-follow-ups` branch for L1–L6. No `main` mutation until approved — per `verification-and-review-protocol` Iron Law.

*Report authored 2026-08-29T13:30Z against `748696d` HEAD, Node 24 pnpm 11, `lint 0 / typecheck 0 / test 11/56 / e2e 25 / build 383.70 kB gzip 111.86 kB`.*
