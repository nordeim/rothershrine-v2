# UI/UX Enhancement Audit & Remediation Plan — 2026-08-29 ("Sacred Motion, Upstream")

> Scope: visual aesthetics, UI/UX design, motion/animation, and accessibility for the rothershrine-v2 SPA.
> Method: skills-driven (repo `skills/frontend-design` `animation-guide.md`, `skills/tdd-workflow`, `skills/aesthetic`
> BEAUTIFUL/RIGHT/SATISFYING stages, `skills/e2e-testing-lessons`, `skills/ui-ux-pro-max`) + independent comparative
> audit (2026-08-29, line-level source review + live-site rendered inspection of both shrine/parish deploys).
> Constraints honored: Tailwind v4 CSS-first `@theme` (no one-off hex), `cn()` merging, HashRouter, `viteSingleFile`,
> global `prefers-reduced-motion` contract, no new dependencies, all commits on `main`.

## Part 0 — Provenance

St Joseph's (Bukit Timah) is a parish port of this shrine codebase. Its 2026-08-28 "Sacred Motion" pass
(`st-joseph-bt/docs/ui-ux-remediation-plan-2026-08-28.md`, items E1–E9) fixed motion-coherence and
touch/a11y gaps that **both** codebases share, and added three fixes this repo still lacks. An independent
comparative audit (2026-08-29) additionally found **rendered-contrast defects on this site that the port
does not have**. This plan (1) fixes the contrast defects first, (2) ports the motion/a11y package back
upstream — adapted to Rother's identity (italic Fraunces hero, Plus-icon accordion, zoom grounds cards) —
and (3) aligns project documents that drifted from the code (docs say 6 unit files / 29 tests; `main` has 8 / 36).

## Part 1 — Audit findings (evidence-based, this repo @ 8d1032a)

| ID | Finding | Evidence | Impact |
|----|---------|----------|--------|
| C-1 | Home hero `<h1>` renders shrine-maroon-700 on the maroon-950 photo overlay — **1.39:1** contrast (WCAG AA large-text minimum is 3:1). The global `h1–h4 { text-shrine-maroon-700 }` rule (index.css `@layer base`) beats section inheritance; the h1 has no explicit color class | `src/pages/Home.tsx` L40–43; live computed `color: rgb(85,25,26)` on `rgb(32,10,10)` | **Critical** — the site's primary headline is near-invisible at first impression, desktop and mobile |
| C-2 | Home CTA-band `<h2>` "Admission is free…" — maroon-700 on maroon-900, **1.26:1** | `src/pages/Home.tsx` L261; live verified | **Critical** — the conversion section speaks, but its headline cannot be read |
| C-3 | Give CTA-band `<h2>` — same pattern, maroon-700 on maroon-900 | `src/pages/Give.tsx` L73 | **Critical** (same class of defect) |
| M-1 | Hero/PageHero content pops in instantly — ken-burns is the only hero motion | `Home.tsx` L36–70, `PageHero.tsx` | First impression |
| M-2 | Desktop dropdown + mobile drawer render with no entrance | `Header.tsx` L180, L231 | Motion coherence |
| M-3 | Card hover affordance inconsistent — Give options and Volunteer roles are shadow-only; NewsEvents/Home event rows static; grounds cards zoom (keep) | `Give.tsx` L48, `Volunteer.tsx` L58, `NewsEvents.tsx` L30, `Home.tsx` L195/230 | Consistency |
| M-4 | Buttons lift on hover but give no press feedback | `ui/Button.tsx` L42 | Micro-interaction |
| M-5 | Footer text links transition color only — no underline affordance | `Footer.tsx` L62/80 | Affordance |
| M-6 | Timeline dots static; rail inert next to the rest of the design | `Timeline.tsx` | Delight |
| M-7 | No back-to-top affordance on long pages (History, What to See, Pilgrimage, Give) | all pages > 2 viewports | Navigation |
| M-8 | Accordion: `grid-rows` transition already present ✓, but uses `ease-in-out`, no `motion-reduce` opt-out, and closed panels are focusable/readable | `ui/Accordion.tsx` L82–88 | Polish / a11y |
| A-1 | No `aria-current` on active nav link or child-active dropdown parent | `Header.tsx` (no matches) | Accessibility/UX |
| A-2 | `Button href` (external) renders a plain `<a>` — same tab, no `rel="noopener noreferrer"` | `ui/Button.tsx` L62–66 | UX / security hygiene |
| A-3 | Event category/date hierarchy weaker than grounds cards (plain text vs. chip) | `NewsEvents.tsx` L32–35, `Home.tsx` L230–236 | Hierarchy |
| D-1 | Docs drift: AGENTS.md/CLAUDE.md/README state "6 files / 29 tests"; `main` ships 8 files / 36 (SafeImage, Accordion suites missing from docs) | `AGENTS.md`, `CLAUDE.md`, `README.md` vs `pnpm test` (36 passed) | Docs integrity |
| R-1 (verified OK, no action) | Hamburger is **44px** (`h-11 w-11`) — an external report's "40×40" claim traced to the parish repo's pre-fix state, not this codebase | `Header.tsx` L213 | — (documented to prevent a wrong "fix") |

Non-goals (rejected): dark mode, router page-transition animations (HashRouter + singlefile constraint),
new motion dependencies (CSS is sufficient and keeps the single-file bundle lean), redesigns of the
maroon/cream/gold identity or the italic "The shepherd who stayed." voice (anti-generic guidance: refine
the authored identity, don't reset it), BrowserRouter migration.

## Part 2 — Remediation plan

Design language: keep the shrine palette and Fraunces voice. Motion rules
(`skills/frontend-design/animation-guide.md`): ease-out entrances, transform/opacity only, 200–700ms,
staggered delays, all gated by the existing global `prefers-reduced-motion` block plus explicit per-utility
opt-outs where a loop could otherwise survive (`hero-ken-burns`, `dot-pulse`).

### R1. Rendered-contrast remediation (C-1, C-2, C-3) — **ships first**
Explicit `text-shrine-cream` on the three dark-band headings (hero h1, Home CTA h2, Give CTA h2), matching
the pattern `PageHero`/`NotFound` already use. Guard tests render Home and Give and assert the heading class,
so a future refactor cannot silently re-break inheritance. Target contrast: cream #faf6ec on maroon-950
#200a0a = **17.5:1**; on maroon-900 #33100f = **15.4:1** (AAA).

### R2. Motion utilities port (M-1, M-2, M-6) — `src/index.css`
Add `@keyframes rise-in` (opacity 0→1, translateY 20px→0, 0.7s ease-out, `animation-fill-mode: both`) with
delay steps `.rise-in-d1…d4` (90/180/280/380ms); `@keyframes menu-in` (fade + translateY(-4px), 0.18s) →
`.menu-in`; `@keyframes drawer-in` (fade + translateY(-12px), 0.24s) → `.drawer-in`; `@keyframes halo-pulse`
(ring scale 0.6→1.7 + fade, 2.6s loop) → `.dot-pulse` on the Timeline dot. Inside the existing
`prefers-reduced-motion` block, explicitly disable `hero-ken-burns` and `dot-pulse::after`
(`.rise-in`/`.menu-in`/`.drawer-in` are covered by the global 0.01ms override + `fill both` → final frame).

### R3. Staged entrances (M-1)
Home hero: eyebrow → gold-rule → h1 → lede → CTA row (`rise-in` + `d1…d4`). PageHero: eyebrow/h1/description/
children stages. Transform/opacity only; reduced-motion renders final state instantly.

### R4. Header motion + current-page contract (M-2, A-1)
`.menu-in` on the desktop dropdown panel; `.drawer-in` on the mobile drawer. `aria-current="page"` on the
active top-level link (gold tint); `aria-current="true"` + gold tint on a dropdown parent whose child route
is active. Hamburger already `h-11 w-11` (44px) — assert in tests to lock it.

### R5. Card-lift system + event chips (M-3, A-3)
`.card-lift` utility (`transition: transform, box-shadow, border-color` 300ms; hover: translateY(-4px) +
`shadow-shrine` + `border-shrine-gold-300`). Apply to Give option cards and Volunteer role cards (replacing
shadow-only). NewsEvents + Home event rows get row hover tint (`hover:bg-shrine-maroon-50/60`) and a bordered
gold category chip with display-serif date for hierarchy. Grounds cards keep their authored zoom language.

### R6. Link underline + press feedback (M-4, M-5)
`.link-underline` utility (gold gradient underline scales in from the left on hover/focus-visible) on Footer
nav links. `Button` base gains `active:translate-y-0 active:scale-[0.98]` (+ `disabled:active:scale-100`).

### R7. Button external-link hardening (A-2)
`Button href` detects `https?://` → renders `target="_blank" rel="noopener noreferrer"`. Same-tab internal
anchors unchanged.

### R8. Accordion motion/a11y polish (M-8)
Transition `ease-out` + `motion-reduce:transition-none`; closed panels get `aria-hidden` + `inert` (0fr→1fr
technique already present). Icon stays the shrine's Plus (rotate-45) — port semantics, not the parish's chrome.

### R9. BackToTop (M-7) — new `src/components/BackToTop.tsx`
Fixed bottom-right 44px circular button (maroon-900 bg, cream icon, `shadow-shrine`), appears at
`scrollY > 480`, hidden state uses `aria-hidden` + `tabIndex -1`; click scrolls to top with
`behavior: reduce-motion ? 'auto' : 'smooth'`; never touches the hash (HashRouter contract). Mounted in `Layout`.

### R10. Docs alignment (D-1) + this plan
AGENTS.md / CLAUDE.md / README.md / `rothershrine-v2_SKILL.md`: corrected test/utility/component inventory,
new motion conventions, BackToTop, version 1.3.0 → 1.4.0, this plan + a validation report under `docs/`.

### R11. TDD mapping (RED first for every behavior)
| Test file | New tests assert |
|---|---|
| `src/pages/dark-band-contrast.test.tsx` (new) | Home hero h1, Home CTA h2, Give CTA h2 include `text-shrine-cream` (guard against inheritance regression) |
| `src/components/BackToTop.test.tsx` (new) | hidden before 480; visible after scroll; hidden again at top; click → `scrollTo({top:0,…})`; reduced-motion → `behavior:'auto'` |
| `src/components/Header.test.tsx` (new) | `aria-current="page"` on active top-level link; parent `aria-current="true"` when child active; hamburger keeps `h-11 w-11` |
| `src/components/ui/Accordion.test.tsx` (+2) | open panel: no `inert`/`aria-hidden`; closed panel: both present |
| `src/components/ui/Button.test.tsx` (+2) | base classes include `active:scale-[0.98]`; external `href` renders `target="_blank"` + `rel="noopener noreferrer"` |

### R12. E2E additions (Playwright)
`smoke.spec.ts`: hero h1 has `rise-in` + `text-shrine-cream`; computed h1 color on the dark hero is
`rgb(250, 246, 236)`; back-to-top appears after deep scroll and returns to top; event chip present.
`navigation.spec.ts`: desktop nav active link carries `aria-current="page"`.
`give-faq.spec.ts`: closed FAQ panel exposes `inert` behaviour (aria-hidden) and expands on click.

## Part 3 — Plan ↔ codebase validation

| Claim | Verified against |
|---|---|
| Global h1–h4 maroon-700 rule is the contrast defect's root cause; `PageHero`/`NotFound` opt out via explicit cream | `src/index.css` `@layer base`; `PageHero.tsx` L50; `NotFound.tsx` L12 |
| Only three dark-band headings lack the opt-out (Home hero h1, Home CTA h2, Give CTA h2); About band uses a blockquote (`<p>` inherits cream) | grep of `bg-shrine-maroon-9*` sections across `src/pages` + `src/components`; live DOM scan (h1–h4 computed colors) |
| `@theme` token names identical to the parish port — `.card-lift`/`.link-underline`/`.dot-pulse` CSS ports cleanly with no new tokens | byte-identical `@theme` blocks (diff = empty) |
| Global reduced-motion block already nukes new keyframes (0.01ms, iteration 1, fill both → final frame) | `src/index.css` L68–80 |
| Accordion aria/focus behavior preserved (existing 4 unit + give-faq e2e assertions untouched) | `Accordion.test.tsx`, `e2e/give-faq.spec.ts` |
| `matchMedia` needed by BackToTop test; `src/test/setup.ts` already mocks IntersectionObserver + scrollIntoView; matchMedia stubbed in-suite | `src/test/setup.ts`, parish precedent |
| Header active-state logic has an existing `pathname`-based branch point for `aria-current` | `Header.tsx` L96–150 (desktop), L231+ (drawer) |
| No new dependencies; plain CSS + `var(--color-shrine-*)` only (Tailwind v4 CSS-first) | `AGENTS.md` Quirks; `tailwind-patterns` skill |
| Docs drift is real and must ship fixed in the same change | `AGENTS.md` "6 files / 29" vs `pnpm test` → "8 files / 36 passed" |
| E2E count will change 20 → 24; unit 36 → 45 (10 files); docs updated to match | suites enumerated in R11/R12 |

**Validation verdict: plan is aligned with the codebase, repo conventions (AGENTS.md Quirks/Don't), and the
selected skills. Execution proceeds TDD: RED → GREEN → REFACTOR → five-gate → docs → build + rendered
visual verification → atomic conventional commits on `main` → push via `docs/ssh-key.txt` +
`skills/how-to-git-push-using-ssh-wrapper/scripts/ssh_git_wrapper_v3.py`.**
