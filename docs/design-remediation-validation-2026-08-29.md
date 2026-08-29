# Design Remediation Validation — 2026-08-29 ("Sacred Motion, Upstream")

> Companion to `docs/design-remediation-plan-2026-08-29.md`. Every plan item (R1–R12) was
> implemented TDD-first (RED → GREEN) on `main` and verified against the running codebase with
> the five-gate check plus Playwright-rendered assertions. This report records the executed
> state, the evidence, and the deviations-from-plan (all benign, all documented below).

## 1. Execution summary

| Plan item | Status | Implementation evidence |
|---|---|---|
| R1 — dark-band contrast (C-1, C-2, C-3) | ✅ Executed | `Home.tsx` hero h1 + CTA-band h2 and `Give.tsx` CTA h2 carry explicit `text-shrine-cream`; guard suite `src/pages/dark-band-contrast.test.tsx` (4 tests) locks the classes against inheritance regression |
| R2 — motion utilities (M-2, M-6, M-8 base) | ✅ Executed | `src/index.css`: `rise-in` + `rise-in-d1…d4` (90/180/280/380ms), `menu-in` (0.18s), `drawer-in` (0.24s), `halo-pulse`/`dot-pulse` (2.6s loop), plus explicit reduced-motion opt-outs for `hero-ken-burns` and `dot-pulse::after` |
| R3 — staged entrances (M-1) | ✅ Executed | Home hero eyebrow → gold-rule → h1 → lede → CTA row → facts aside staged `rise-in`+`d1…d4`; `PageHero` eyebrow/h1/description/children staged. Transform/opacity only |
| R4 — header motion + current-page contract (M-2, A-1) | ✅ Executed | `menu-in` on desktop dropdown, `drawer-in` on mobile drawer; `aria-current="page"` on active top-level links (desktop + mobile drawer); dropdown parents carry `aria-current="true"` + gold tint when **any child route** is active (`childActive` check — fixes the `/history`-under-About miss); hamburger locked at 44px by test |
| R5 — card-lift + event chips (M-3, A-3) | ✅ Executed | `.card-lift` on Give option cards + Volunteer role cards (replacing shadow-only hover); NewsEvents + Home event rows get hover tint (`hover:bg-shrine-maroon-50/60`) and bordered gold category chips; grounds cards keep their authored zoom |
| R6 — link underline + press feedback (M-4, M-5) | ✅ Executed | `.link-underline` gold-gradient draw-in on Footer nav links; `Button` base gains `active:translate-y-0 active:scale-[0.98]` + `disabled:active:scale-100`; social icons gain hover lift |
| R7 — Button external-link hardening (A-2) | ✅ Executed | `ui/Button.tsx`: `https?://` hrefs render `target="_blank" rel="noopener noreferrer"`; internal anchors unchanged. Unit-covered |
| R8 — Accordion motion/a11y polish (M-8) | ✅ Executed | `ease-in-out` → `ease-out` + `motion-reduce:transition-none`; closed panels get `aria-hidden` + `inert` (React 19 boolean `inert`); Plus-icon language preserved |
| R9 — BackToTop (M-7) | ✅ Executed | New `src/components/BackToTop.tsx` (44px, maroon-900 bg, gold border, `shadow-shrine`), threshold `scrollY > 480`, hidden state `aria-hidden` + `tabIndex -1`, reduced-motion → `behavior: "auto"`, never touches the hash; mounted in `Layout`; Layout scroll timer now cleared on route change (unmount-safety fix found during implementation) |
| R10 — docs alignment (D-1) | ✅ Executed | `README.md`, `AGENTS.md`, `CLAUDE.md`, `rothershrine-v2_SKILL.md` re-inventoried (tests, files, utilities, components, quirks); version 1.3.0 → 1.4.0 in badge, `package.json`, SKILL front-matter; this report + the plan live under `docs/` |
| R11 — TDD mapping | ✅ Executed | See §2 — 5 new/extended unit suites, all written RED first |
| R12 — E2E additions | ✅ Executed | 5 new Playwright tests (see §3); suite 20 → 25, all green |

## 2. Unit verification (vitest, jsdom)

Final state: **11 files / 56 tests, all passing** (baseline before remediation: 8 files / 36).

| Suite | Tests | Asserts |
|---|---|---|
| `src/pages/dark-band-contrast.test.tsx` (new) | 4 | Home hero h1, Home CTA h2, Give CTA h2 include `text-shrine-cream`; PageHero keeps its explicit cream |
| `src/components/BackToTop.test.tsx` (new) | 7 | hidden (aria-hidden + tabindex −1) before 480; visible after scroll (re-enters a11y tree with accessible name); hides again at top; click → `scrollTo({top:0, behavior:"smooth"})`; reduced-motion → `behavior:"auto"`; 44px `h-11 w-11`; mount contract without touching `location.hash` |
| `src/components/Header.test.tsx` (new) | 4 | `aria-current="page"` on active top-level link; absent on inactive; dropdown parent `aria-current="true"` when child route active; hamburger stays `h-11 w-11` |
| `src/components/ui/Accordion.test.tsx` (+2) | 6 | open panel: no `inert`/`aria-hidden`; closed panel: both present (+ prior single-open/keyboard coverage) |
| `src/components/ui/Button.test.tsx` (+3) | 9 | external href → `target="_blank"` + `rel="noopener noreferrer"`; press-feedback classes present (+ prior to/href/variants coverage) |
| Existing suites (cn, nav, content, site, SkipLink, SafeImage) | 26 | unchanged — regression guard |

**TDD notes (RED phase observed):** the BackToTop and Header suites were authored before their
implementations completed; both failed for the right reasons (missing `childActive` logic; missing
threshold-state plumbing). One test-authoring correction was required: the hidden BackToTop state
is intentionally `aria-hidden`, which removes the element (and its accessible name) from the a11y
tree, so hidden-state assertions query by `data-testid` while visible-state assertions keep the
role+name queries. The component pattern (aria-hidden + tabIndex −1 + pointer-events-none) is the
canonical disclosure pattern and was kept; only the queries changed.

## 3. E2E verification (Playwright, chromium)

Final state: **4 specs / 25 tests, all passing** (baseline: 20). New coverage per plan R12:

- `smoke.spec.ts` (10) — hero h1 renders `rgb(250, 246, 236)` computed cream on the dark overlay with
  `rise-in` (rendered-contrast proof, stronger than a screenshot); BackToTop appears after deep
  scroll, returns to top, and never rewrites the `#/history` hash; event rows expose bordered gold
  category chips.
- `navigation.spec.ts` (6) — active top-level nav link carries `aria-current="page"`; the About
  dropdown trigger carries `aria-current="true"` while `/history` (a sibling child route) is active.
- `give-faq.spec.ts` (5) — closed FAQ panel exposes `aria-hidden` + `inert` and both clear on expand.

## 4. Five-gate result

| Gate | Result |
|---|---|
| `pnpm lint` (`eslint . --max-warnings 0`) | ✅ clean |
| `pnpm typecheck` (`tsc --noEmit`, strict + noUnused*) | ✅ clean |
| `pnpm test` | ✅ 11 files / 56 passed |
| `pnpm test:e2e` | ✅ 25 passed (chromium) |
| `pnpm build` | ✅ `dist/index.html` ~384 kB (gzip ~112 kB), JS+CSS inlined, `dist/images/` copied |

## 5. Rendered contrast — before / after

| Surface | Before (live audit) | After (verified) |
|---|---|---|
| Home hero `<h1>` on maroon-950 overlay | maroon-700 #55191a → **1.39:1** (WCAG fail) | cream #faf6ec → **~17.5:1 (AAA)** — asserted by e2e computed color |
| Home CTA-band `<h2>` on maroon-900 | **1.26:1** (WCAG fail) | cream → **~15.4:1 (AAA)** — unit-guarded |
| Give CTA-band `<h2>` on maroon-900 | **1.26:1** (WCAG fail) | cream → **~15.4:1 (AAA)** — unit-guarded |

The e2e computed-color assertion (`toHaveCSS("color", "rgb(250, 246, 236)")`) runs against the real
rendered DOM, which closes the audit's core methodological gap: class presence (unit) proves intent,
computed style (e2e) proves the cascade actually resolves cream over the global `h1–h4` rule.

## 6. Deviations from plan (all documented, none behavioral)

1. **Test counts vs. plan estimate:** plan projected unit 36 → 45 (10 files) and E2E 20 → 24; actual
   landed at 56 (11 files) and 25 — the BackToTop/Header suites were written as full contracts, and
   Button gained three assertions rather than two. Docs record actuals.
2. **BackToTop hidden-state test queries** use `getByTestId` instead of `getByRole` (see §2 note).
3. **Mobile drawer also carries the current-page contract** (`aria-current` + gold tint on section
   triggers and top-level links) — the plan scoped R4 to the desktop header; extending it keeps the
   two navigations consistent and is covered by the same `pathMatches` logic.
4. **Layout scroll-timer cleanup** — implementation of R9 surfaced that a pending 80ms hash-scroll
   timer could fire after route change; now cleared in the effect teardown. Hardening, not a plan item.
5. **Skills consulted** (repo `skills/` catalog): `frontend-design` (`animation-guide.md` — ease-out
   entrances, transform/opacity-only, stagger discipline), `tdd` workflow (RED→GREEN→REFACTOR),
   `aesthetic` (BEAUTIFUL/RIGHT/SATISFYING staging), `e2e-testing-lessons` (testids for
   outside-the-a11y-tree states, computed-style assertions over screenshots), `code-review-checklist`
   (five-gate discipline). No new dependencies introduced.

## 7. Residual risks / follow-ups

- The live deploy (`rothershrine.jesspete.shop`) still serves the pre-remediation build until the
  repo's deploy pipeline re-publishes `dist/`; this repo's artifact is ready.
- Chromium-only E2E remains the configured scope (per `playwright.config.ts`); firefox/webkit can
  be added without test changes — selectors avoid viewport-snapping flake patterns.
- OG/Twitter meta tags remain absent from `index.html` by design (documented plan non-goal: no real
  shrine imagery/metrics to publish yet); the CSP + description metadata already ship.
