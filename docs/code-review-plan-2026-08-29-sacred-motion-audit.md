# Code Review & Audit Plan — Sacred Motion Remediation (2026-08-29)

> **Status:** PLAN — awaiting explicit user approval (Phase 3 VALIDATE) before execution.  
> **Scope:** 28 files changed in `1bf9cba..748696d` (2 commits: `0021ca6` feat + `748696d` docs), 944 insertions / 130 deletions.  
> **Method:** Six-Phase Meticulous Workflow (ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER) + `code-review-and-audit` tiered pipeline + `code-review-checklist` 12-category scan + `verification-and-review-protocol` Iron Law + `lint-and-validate` gates.  
> **Stack context:** `rothershrine-v2` static SPA — React 19.2.8 + Vite 7.3.6 + Tailwind v4 CSS-first `@theme` + TS 5.9 strict + HashRouter + viteSingleFile + vitest 3.2.6 jsdom + playwright 1.55.1 chromium — see `AGENTS.md` / `CLAUDE.md` / `rothershrine-v2_SKILL.md` §§1–20 + `src/index.css` token authority.

---

## 0. Executive Summary

Two fast-forward commits landed on `origin/main` after an independent UI/UX audit found **rendered-contrast defects** (1.26–1.39:1 on the home hero + CTA bands) plus motion/a11y gaps shared with the St Joseph's parish port. Commit `0021ca6` shipped the full **Sacred Motion, Upstream** remediation (contrast fixes, motion utilities, aria contracts, BackToTop, Button hardening, Accordion inert, etc.) with TDD coverage; commit `748696d` re-inventoried four doc files and added the plan + validation reports under `docs/`. This audit **does not re-remediate** — it independently validates that what shipped is correct, complete, secure, performant, accessible, and doc-true, evidence-backed and severity-ranked, with a reproducible verification record.

**What this plan will deliver (on approval):** a single evidence-backed audit report at `docs/code-review-audit-2026-08-29-sacred-motion.md` (severity-ranked findings + per-file verdicts + five-gate reproduction + residual risks + fix PRs if needed), produced without mutating `main` until findings are approved.

**What it will not do:** rewrite history, re-litigate the parish port provenance, change `HashRouter`/`singlefile` architecture, or add features beyond what the two commits claim.

---

## 1. ANALYZE — Deep Requirement Mining (completed)

### 1.1 Sources Read (verbatim, full-file)

| Source | What it governs |
|---|---|
| `AGENTS.md` (compact cheat sheet) | Stack pins, commands, 44-file structure, 17 utilities, 11 test files/56 unit + 25 E2E, quirks (HashRouter, singlefile, alias sync, `@theme` only, strict flags, `skills` vendored, SkipLink hash preservation, dark-band cream, reduced-motion gating, useScrolled threshold, jump nav `<Link>`) |
| `CLAUDE.md` (deep workflow, authoritative) | Six-phase workflow, TS/Vite/React/Tailwind conventions, TDD, testing strategy, code quality gates, git/CI, architecture §5.2, design system, a11y, anti-patterns, success metrics |
| `README.md` (visitor + operator) | Key features, architecture table + mermaid, file hierarchy, quick-start, design-system table (24 colors + 2 shadows, Sacred Motion utilities), deployment, troubleshooting |
| `rothershrine-v2_SKILL.md` (complete distillate, §§1–20 + ADRs A–C + QRC) | Project identity, tokens code-first, component architecture, hooks deep-dive, content management, WCAG AAA, anti-patterns (11), debugging guide (11), pre-ship checklist, pitfalls/best practices/patterns, breakpoint/z-index/color/interface references, 5 ADRs |
| `docs/design-remediation-plan-2026-08-29.md` (R1–R12) | Original findings C-1..C-3, M-1..M-8, A-1..A-3, D-1, R-1 + remediation mapping to code |
| `docs/design-remediation-validation-2026-08-29.md` | Claimed execution evidence + 5-gate result + rendered contrast before/after + deviations |
| `git log 1bf9cba..748696d` + `git diff --stat` + per-file diffs | 28 files, grouped below; commit messages as intent lineage |
| `src/index.css`, `src/components/*`, `src/pages/*`, `src/hooks/*`, `e2e/*`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `playwright.config.ts`, `src/test/setup.ts` | Ground-truth implementations (sampled: `BackToTop.tsx`, `Header.tsx`, `Layout.tsx`, `Button.tsx`, `Accordion.tsx`, `PageHero.tsx`, `Home.tsx`, `dark-band-contrast.test.tsx`) |

### 1.2 Change Surface — Grouped by Risk

**Group A — Docs re-inventory (7 files, 336 insertions, commit `748696d`):** `AGENTS.md`, `CLAUDE.md`, `README.md`, `rothershrine-v2_SKILL.md`, `package.json` (1.3.0→1.4.0), plus the two new docs themselves. Risk: *drift re-introduction* — numbers must be byte-true against `pnpm test`/`pnpm test:e2e`/`src/index.css`/`vite.config.ts`. Low functional risk, high trust risk if they lie.

**Group B — Sacred Motion CSS + motion system (1 file, ~142 lines):** `src/index.css` — `@keyframes rise-in/menu-in/drawer-in/halo-pulse` + utilities `.rise-in(.d1..d4)/.menu-in/.drawer-in/.dot-pulse/.card-lift/.link-underline` + `prefers-reduced-motion` explicit opt-outs for `hero-ken-burns` and `dot-pulse::after`. Risk: *animation correctness* (transform/opacity only, duration 180–700ms, staggering 90/180/280/380ms, fill-mode `both`, reduced-motion gating completeness, no one-off hex, `cn()` irrelevant here).

**Group C — Accessibility + navigation contracts (3 files):** `src/components/Header.tsx` (`childActive` + `aria-current="page"`/`"true"` + `menu-in`/`drawer-in` + mobile `aria-current`), `src/components/Layout.tsx` (timer cleanup + `<BackToTop/>` mount), `src/components/ui/Accordion.tsx` (`ease-out` + `motion-reduce:transition-none` + `aria-hidden`/`inert`), `src/components/ui/Button.tsx` (external `https?://` → `target=_blank rel=noopener noreferrer` + `active:scale-[0.98]`). Risk: *a11y regression* (focus trap, escape, focus-return, inert semantics, HashRouter hash preservation).

**Group D — New primitives + contrast guards (2 files new + 3 pages):** `src/components/BackToTop.tsx` (threshold 480, 44px, `aria-hidden`/`tabIndex -1`, reduced-motion `auto`/`smooth`, never touches hash, `passive` scroll listener, `z-40`) + `src/pages/dark-band-contrast.test.tsx` + `src/pages/Home.tsx`/`Give.tsx`/`NewsEvents.tsx`/`Volunteer.tsx`/`PageHero.tsx`/`Timeline.tsx`/`Footer.tsx` (cream headings, staged `rise-in`, `card-lift`, chips, `link-underline`). Risk: *visual correctness* (contrast 17.5:1/15.4:1 AAA), *styling discipline* (shrine tokens only, `cn()` merges), *layout shift*.

**Group E — Test expansion (7 files):** `src/components/BackToTop.test.tsx` (7), `Header.test.tsx` (4), `ui/Accordion.test.tsx` (+2), `ui/Button.test.tsx` (+3), `pages/dark-band-contrast.test.tsx` (4) + `e2e/smoke.spec.ts` (+3), `navigation.spec.ts` (+2), `give-faq.spec.ts` (+2). Unit 36→56 (11 files), E2E 20→25 (4 specs). Risk: *false confidence* (class-presence vs computed-style, hidden-state query correctness, HashRouter hash-preservation assertion, threshold journey determinism per `e2e-testing-lessons`).

### 1.3 Explicit Ambiguities & Trade-offs Surfaced

| # | Ambiguity | Positions | Recommendation |
|---|---|---|---|
| 1 | **Audit depth:** re-run five-gate + re-inspect every diff line vs spot-check claimed findings | Deep-audit is slower (1–2 sessions) but is the only way to honor the Iron Law; spot-check leaves residual risk on contrast/motion | **Deep audit, evidence-backed per finding** |
| 2 | **Fix posture:** flag-only vs flag+fix PR | Flag-only is faster; flag+fix proves the fix and keeps `main` clean until approved | **Flag+fix PR on a `fix/` branch, pushed only after explicit approval** |
| 3 | **Rendered contrast proof:** unit class assertion vs computed-color e2e vs Lighthouse axe | Unit proves intent, e2e `toHaveCSS("color", "rgb(250, 246, 236)")` proves cascade resolution; Lighthouse/axe adds cross-check | **All three, ranked by strength** |
| 4 | **Motion validation:** snapshot vs reduced-motion opt-out completeness | Snapshot is brittle; opt-out grep + manual reduced-motion toggle is authoritative | **Grep + computed-style + reduced-motion media toggle (no screenshot gate)** |
| 5 | **Docs audit:** inventories as source-of-truth vs executable configs | Docs must track `package.json`/`src/index.css`/`vite.config.ts`/`tsconfig.json`; whichever drifts, docs lose | **Executable is truth; docs must match byte-for-byte** |

### 1.4 Risks (pre-mortem)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hash-scroll timer fires after unmount | Low (fixed in this change) | Medium | Verify teardown clears timer; test route-change race |
| `aria-current="true"` vs `"page"` semantics misuse | Medium | Medium | Audit against WAI-ARIA spec; verify screen-reader announcement |
| `BackToTop` leaks scroll listener or checks `matchMedia` on server | Low | Low | Verify cleanup + guard `window.matchMedia` access |
| `inert` boolean attribute triggers TS strict or older browser quirk | Low | Low | Verify `inert` type + fallback behavior |
| Motion utilities add `animation-delay` without `fill both` → FOUC | Low | Medium | Verify `both` + reduced-motion final-state rendering |
| Docs counts drift again within one commit | Medium | Low | Cross-check `pnpm test`/`pnpm test:e2e`/`src/index.css` grep vs docs prose |
| E2E threshold test flake (scroll + animation timing) | Medium | Low | Use `expect.poll`/`waitForFunction` + `Instant` scroll for deterministic threshold crossing |

---

## 2. PLAN — Structured Execution Roadmap

### 2.1 Objectives & Success Criteria

**Objectives:** (1) Independently verify every claimed remediation item R1–R12 landed correctly; (2) validate no architectural, security, performance, or doc-integrity regression was introduced; (3) produce a severity-ranked, evidence-backed audit report consumable by the next agent without re-reading diffs.

**Success criteria (all must hold):**

- All 5 gates green on a fresh clone at `748696d` (lint + typecheck + test + test:e2e + build — including `dist/index.html` ~384kB + `dist/images/` 4 files).
- Every R1–R12 claim maps to a file:line citation + a passing local reproduction (unit or e2e); any unmappable claim is reported as a finding.
- Six-axis review (§2.4) emits no `Critical` or `High` unresolved; `Medium`/`Low` carry an owner + follow-up.
- Docs inventories (`AGENTS.md`/`CLAUDE.md`/`README.md`/`rothershrine-v2_SKILL.md`) match executable counts byte-for-byte (`pnpm test` 11/56, `pnpm test:e2e` 25, `src/index.css` `@theme` 24+2, `@layer utilities` 17, `src/` 44 files).
- Residual risks listed with likelihood + expiry (e.g., live deploy still on pre-remediation artifact until re-publish — already noted, re-validated).
- Report follows `code-quality-standards` §6 template and cites exact lines per finding (no uncited claims).

### 2.2 Phases & Checklists

#### Phase 1 — Reconnaissance & Baseline Reproduction (`~0.5h`)

- [ ] Check out `748696d` clean; confirm `git status` clean, Node 20+, pnpm 11.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`, `pnpm preview` spot-check.
- [ ] Catalog 28 changed files + 2 unchanged-but-claimed files (`docs/design-remediation-*`) into Groups A–E above.
- [ ] Record baseline metrics: `dist/index.html` size, `pnpm test` output, `pnpm test:e2e` output, `grep -c shrine- src/index.css` token count, `fd` src file count.

#### Phase 2 — Static Review (no runtime) (`~1.5h`)

**2a. Doc alignment (Group A):**
- [ ] Cross-check each doc's claimed counts vs executables: unit 11/56, E2E 25, src 44, utilities 17, `@theme` 24+2, shadows 2, alias routes 16 entries / 6 aliases / 4 anchors, `package.json` version 1.4.0 badge coherence.
- [ ] Verify `vite.config.ts` alias ↔ `tsconfig.json` paths/BaseUrl sync; `server.watch.ignored` entries; `test.include/exclude/setupFiles`.
- [ ] Verify `eslint.config.js` ignores (dist/node_modules/coverage/playwright-report/test-results + `skills`).
- [ ] Verify no `^` in `package.json` pins; `pnpm-lock.yaml` committed claim.

**2b. CSS + design-system review (Group B + D styling):**
- [ ] `src/index.css` — `@theme` token completeness (24 colors + 2 shadows, hex byte-for-byte vs §19 table); no one-off hex / `bg-[#` / `amber-/slate-` leakage (`rg -n "bg-\[#|amber-|slate-"`).
- [ ] Motion utilities — each keyframe uses only `transform`/`opacity`; durations within 180–700ms; `rise-in` has `both` fill + stagger 90/180/280/380ms; `prefers-reduced-motion` block disables `rise-in`/`menu-in`/`drawer-in` globally via 0.01ms override AND explicitly disables `hero-ken-burns` + `dot-pulse::after`.
- [ ] Utilities use `cn()` merges where classes are composed in TS; CSS utilities use `var(--color-shrine-*)` not hex.
- [ ] New utilities documented in `AGENTS.md` + `CLAUDE.md` + `rothershrine-v2_SKILL.md` + `README.md` design-system tables.

**2c. Component contract review (Groups C + D):**
- [ ] `BackToTop.tsx` — threshold 480 constant, `passive` listener + cleanup, `useEffect []` dep, `matchMedia` guard, `scrollTo({top:0, behavior})` reduced-motion branch, `aria-hidden`/`tabIndex`/`data-testid`/`z-40`/`h-11 w-11`/`fixed bottom-6 right-6`, never touches `location.hash`.
- [ ] `Layout.tsx` — double-hash `resolveAnchor` preserved, 80ms timer captured + cleared on cleanup (`return () => clearTimeout(timer)`), `BackToTop` mounted inside layout, `SkipLink` order preserved.
- [ ] `Header.tsx` — `childActive` logic (`item.children?.some(child => pathMatches(pathname, child.to))`), `aria-current="page"` (top-level) vs `"true"` (dropdown parent) per WAI-ARIA semantics, `menu-in` on dropdown `<ul>`, `drawer-in` on mobile dialog, `h-11 w-11` hamburger, keyboard + dismiss contracts.
- [ ] `Button.tsx` — discriminated union preserved, external detection `/^https?:\/\//`, `target="_blank" rel="noopener noreferrer"` only on external, `active:scale-[0.98]` + `disabled:active:scale-100`, `cn()` merge order (`baseClasses` → `variantClasses` → `className`).
- [ ] `Accordion.tsx` — `ease-out` + `motion-reduce:transition-none`, `aria-hidden` + `inert` on closed panels, `Plus rotate-45` shrine language preserved (not parish chrome), `grid-rows` 0fr/1fr technique intact.
- [ ] Pages — `Home.tsx` hero h1 + CTA h2 + `Give.tsx` CTA h2 carry `text-shrine-cream`; staged `rise-in`/`rise-in-d1..d4` order correct; `PageHero.tsx` stages correct; `Timeline.tsx` `dot-pulse` applied to dot not rail; `Footer.tsx` `link-underline` on text links only; `Give`/`Volunteer` `card-lift`; event chips bordered gold.

#### Phase 3 — Test & E2E Validation (`~1h`)

- [ ] Unit suite review — 11 files / 56 tests: per-suite read for correctness (not coverage theatre). Flag class-presence-only guards; verify hidden-state `getByTestId` vs visible-state `getByRole` pattern in `BackToTop.test.tsx` matches e2e strategy; verify `Header.test.tsx` `childActive` sibling route case; verify `Accordion` open/closed `inert`/`aria-hidden` toggle; verify `Button` external-link assertion checks both `target` and `rel`.
- [ ] E2E suite review — 4 specs / 25 tests: verify `smoke.spec.ts` hero `toHaveCSS("color", "rgb(250, 246, 236)")` + `toHaveClass(/rise-in.*text-shrine-cream/)`; BackToTop threshold journey uses `scrollTo({top:1200, behavior:"instant"})` + `waitForFunction(scrollY===0)` + URL hash preservation `toHaveURL(/#\/history/)`; chip assertion uses bordered gold class; `navigation.spec.ts` `aria-current` contract; `give-faq.spec.ts` `inert` behaviour.
- [ ] `src/test/setup.ts` — `IntersectionObserver` mock + `scrollTo` stub + note on `matchMedia` stub requirement (must be per-test or per-setup; jsdom has no `matchMedia`).
- [ ] `playwright.config.ts` — chromium-only scope, `webServer` → `pnpm exec vite`, `expect.timeout` 15s, `trace/video on-first-retry`, `reuseExistingServer: !CI`.

#### Phase 4 — Accessibility & Security & Performance (`~1h`)

**A11y (WCAG AAA intent, §8):**
- [ ] Contrast — compute `shrine-cream #faf6ec` on `maroon-950 #200a0a` (17.5:1) + `maroon-900 #33100f` (15.4:1) via contrast checker; compare against e2e computed color before/after.
- [ ] Focus & landmarks — `SkipLink` `preventDefault` + focus to `#main-content` (HashRouter hash-preservation); `Header` `aria-label`/`aria-expanded`/`aria-haspopup`/`aria-current`; `BackToTop` `aria-hidden`/`tabIndex -1` hidden disclosure pattern; `Accordion` `aria-hidden`/`inert` on closed panels.
- [ ] Motion — `prefers-reduced-motion: reduce` disables all transform/opacity motion; looping `dot-pulse::after` and `hero-ken-burns` have explicit opt-outs so global 0.01ms override cannot leave half-drawn frames.
- [ ] Images/media — `PageHero` decorative `alt=""` only; `SafeImage` fallback pattern untouched.

**Security (OWASP-aware):**
- [ ] `Button` external `rel="noopener noreferrer"` prevents reverse tabnabbing; verify `target="_blank"` only on `https?://`.
- [ ] No new `dangerouslySetInnerHTML`, no inline `eval`, no `as any` introduced; TS strict `noUnused*` still enforced.
- [ ] `index.html` CSP meta allows `https:` images + `fonts.googleapis.com` + `frame-src https://www.google.com` (map embed) — verify no CSP regression from new inline styles.

**Performance:**
- [ ] Motion uses `transform`/`opacity` only (no layout/reflow); durations respect `animation-guide.md` (200–700ms, ease-out).
- [ ] `dist/index.html` size ~384kB (gzip ~112kB) stays ≤400kB; `dist/images/` 4 files copied (singlefile inlines JS+CSS, not publicDir).
- [ ] `z-index` map honoured: SkipLink `z-[100]` > Header `z-50` > jump nav `z-40` > BackToTop `z-40` (co-layer with jump nav — verify no stacking conflict).

#### Phase 5 — Report & Follow-through (`~0.5h`)

- [ ] Draft `docs/code-review-audit-2026-08-29-sacred-motion.md` — severity-ranked findings (Critical/High/Medium/Low), per-file verdicts, evidence (file:line + rendered evidence), 5-gate reproduction log, deviations-from-plan (§6 of validation doc re-validated), residual risks.
- [ ] If findings require fixes, cut `fix/audit-2026-08-29-follow-ups` branch with atomic Conventional Commits (one finding per commit, `RED→GREEN` for test fixes).
- [ ] Update `docs/prompts.md` if intent lineage shifted (unlikely for an audit).
- [ ] Re-run 5-gate after any fix; cite in report.

### 2.3 Review Dimensions (Six-Axis + Shrine-Specific)

| Axis | Lens | Applies to |
|---|---|---|
| Correctness | Does code do what commit message + plan claim? Off-by-one on threshold/delays? ChildActive sibling miss? | All groups |
| Readability | Names, comments explain _why_, early returns, composition, no nested ternaries hiding `aria-current` | Header/Layout/BackToTop |
| Architecture | SPA static contract (HashRouter, singlefile, no SSR/CMS, `@` alias sync, `skills` vendored ignore) | vite/tsconfig/eslint/index.css |
| Security | `rel=noopener`, `as any` last-resort, no trust-boundary `unknown` bypass, CSP coherence | Button, index.css, index.html |
| Performance | Transform/opacity-only, `passive` listeners, no reflow, bundle budget, z-index map | index.css, BackToTop, Layout |
| Aesthetic/UX | Anti-generic enforcement, whitespace, Fraunces italic hero preserved, card-lift/underline coherence, staged `rise-in` | Home/PageHero/Footer/Timeline |
| + Shrine a11y | WCAG AAA intent, reduced-motion gating completeness, `inert` semantics, hash-preservation | All motion/a11y changes |

### 2.4 Checklist Sources

- `code-quality-standards` — Six-Axis rubric (this audit's primary).
- `code-review-checklist` — 12-category tactical scan (used per-file in Phase 2).
- `verification-and-review-protocol` — Iron Law (no "done" without `lint && typecheck && test && test:e2e && build` green + evidence).
- `lint-and-validate` — `pnpm lint --max-warnings 0` + `tsc --noEmit` (strict) discipline.
- `clean-code` — minimal diff, no speculative abstraction.
- UI refs — `frontend-design` / `tailwind-patterns` / `super-frontend-design` / `avant-garde-design-v4` for token/discipline checks.

### 2.5 Effort & Timeline

| Phase | Effort | Wall time |
|---|---|---|
| 1 Recon + gates | 0.5h | Session start |
| 2 Static review | 1.5h | Same session |
| 3 Test/E2E validation | 1.0h | Same/next |
| 4 A11y/security/perf | 1.0h | Same/next |
| 5 Report + follow-through | 0.5h | Same/next |
| **Total** | **~4.5h** | 1–2 sessions |

No new dependencies; all tooling already pinned exact (see `AGENTS.md` Stack).

### 2.6 Deliverable Shape

```
docs/code-review-audit-2026-08-29-sacred-motion.md
  §1 Executed scope + baseline (commit range, file counts, gate output)
  §2 Severity-ranked findings (Critical → Low, each: evidence file:line + rendered proof + fix or "no action")
  §3 Per-file verdicts (28 files, ✅/⚠️/❌ + one-line rationale)
  §4 Five-gate reproduction log (lint/typecheck/test/test:e2e/build + dist size)
  §5 Contrast & motion verification (computed colors, reduced-motion matrix, inert/a11y truth table)
  §6 Deviations from plan re-validated + residual risks
  §7 References (AGENTS/CLAUDE/README/SKILL lines, index.css @theme grep, vite/tsconfig/eslint/playwright excerpts)
```

Optional companion (only if findings require code): `fix/audit-2026-08-29-follow-ups` branch + PR description citing this plan.

### 2.7 Non-Goals (explicitly out of scope)

- Re-auditing pre-`1bf9cba` history outside Groups A–E.
- Browser matrix beyond chromium (landscape noted, no new installs).
- Live-deploy re-publish (`rothershrine.jesspete.shop` still on pre-remediation artifact — report will note, not fix).
- New motion, dark mode, or `BrowserRouter` migration.
- `skills/` content review (vendored, git-tracked reference — tooling ignores per `eslint.config.js` + `server.watch.ignored`).

---

## 3. VALIDATE — Explicit Confirmation Checkpoint

> **Do not start IMPLEMENT until the user approves this plan.** Per `CLAUDE.md` Six-Phase Workflow §3 and `AGENTS.md` ethos, no code is written or branch pushed until validation.

**Assumptions to confirm:**

1. Audit target is `origin/main` at `748696d` (fast-forward from `1bf9cba`); no un-pulled local divergence.
2. Report lives at `docs/code-review-audit-2026-08-29-sacred-motion.md` (companion to the existing `design-remediation-*` docs).
3. Fix posture: **flag+fix PR on a `fix/` branch, pushed only with your go-ahead** — report first, code second.
4. Chromium-only E2E scope is sufficient for this audit (per `playwright.config.ts`).
5. No file outside `src/` / `docs/` / `e2e/` / configs will be added to the audit unless you request it.

**Please confirm one of:**

- **(a) Approve as-is** — I start Phase 1 reconnaissance + five-gate immediately.
- **(b) Approve with changes** — tell me what to add/cut (scope, depth, deliverable path, fix posture) and I'll revise this plan in-place before re-asking.
- **(c) Pause** — you'd like to discuss an ambiguity first (e.g., whether to include live-deploy smoke or expand the `fix/` branch scope).

---

## 4. IMPLEMENT — (gated — next after approval)

Execute Phases 1–5 in order, no shortcuts. Each phase emits evidence into the draft report; `lint && typecheck && test && test:e2e && build` is the Iron Law before any claim of "green." TDD for any fix: `RED` (failing test that reproduces the finding) → `GREEN` (minimal code) → `REFACTOR` → atomic Conventional Commit per cycle.

## 5. VERIFY — (gated)

Re-run five-gate on the audited `748696d` tip (and on any `fix/` branch if created). Cross-check every doc number vs executable; re-assert computed contrast; toggle `prefers-reduced-motion` and re-assert final-state rendering; re-assert BackToTop hash-preservation and `with` 480 threshold journey.

## 6. DELIVER — (gated)

Hand off the complete audit report + (if any) `fix/` branch with runbook: how to reproduce each finding, how to verify each fix, and what residual risks remain. No `main` mutation without your explicit push approval per `vps-server-management` / `how-to-git-push-using-ssh-wrapper` conventions already in repo history.

---

*Plan authored 2026-08-29, validated against `AGENTS.md` / `CLAUDE.md` / `README.md` / `rothershrine-v2_SKILL.md` (v1.4.0, 44 files, 24+2 tokens, 17 utilities) and `git diff 1bf9cba..748696d` (28 files, 944+/130−, 2 commits). Skills consulted: `code-review-and-audit`, `code-review-checklist`, `verification-and-review-protocol`, `lint-and-validate`, `tdd-workflow`, `e2e-testing-lessons`, `frontend-design`/`animation-guide`, `tailwind-patterns`, `super-frontend-design`, `avant-garde-design-v4`.*
