# Design Review Validation — `docs/design_review.md` vs Codebase

**Date:** 2026-08-28
**Validator:** Pi agent (read-only audit, no code changes)
**Source of truth:** `src/index.css`, `src/components/**`, `src/pages/**`, `src/hooks/useScrolled.ts`, `src/data/content.ts`, `src/test/setup.ts`, `e2e/**`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `rothershrine-v2_SKILL.md` (`v1.3.0`, `2026-08-27T12:00Z`)
**Trigger:** `docs/design_review.md` (18,382 bytes, 2 concatenated audits) → validate every claim against byte-for-byte source.
**Gate:** `pnpm lint` 0, `pnpm typecheck` 0 (verified 2026-08-28, Node 24, pnpm 11)

> **Note on the source document:** `design_review.md` contains **two audits pasted together** — (A) a comparative `v1 → v2 Maturation` review with an Executive Summary + 3 findings carried forward, and (B) a second Executive Summary + `Mode C` audit with 10 ranked findings (B1–B10) and a Verification Ledger. Findings overlap (e.g., Accordion L4 = B3). This ledger validates both and calls out the contradictory verdicts.

---

## Method

Each claim was probed with `read` + `rg` (no edits):

| Probe | Command | Purpose |
|---|---|---|
| Theme tokens | `read src/index.css` `@theme` (lines 3–32) | 24 colors + 2 shadows |
| Utilities | `read src/index.css` `@layer utilities` | 11 utilities |
| Z-index map | `rg "z-\[100\]\|z-50\|z-40" src/` | skip-link / header / jump nav |
| Scroll threshold | `read src/hooks/useScrolled.ts` + `rg useScrolled src/components/Header.tsx` | default 12 vs Header 16 |
| SkipLink | `read src/components/SkipLink.tsx` + `read src/components/Layout.tsx` `#main-content` + `read src/components/SkipLink.test.tsx` + `read e2e/navigation.spec.ts` | hash trap fix |
| SafeImage | `read src/components/SafeImage.tsx` + `rg "SafeImage" src/` + `read src/data/content.ts` `images` + `read e2e/what-to-see.spec.ts` `route.abort` | fallback contract |
| Dropdown | `read src/components/Header.tsx` (`onMouseEnter/Leave`, `onClick`, `openDesktopMenu`) + `rg "onMouseEnter\|onMouseLeave\|onFocus" src/components/Header.tsx` | hover vs keyboard |
| Drawer | `read src/components/Header.tsx` mobile `id={menuId}` block (~165–185) + `rg "aria-modal\|focus-trap" src/` | focus trap |
| Accordion | `read src/components/ui/Accordion.tsx` (`onKeyDown`) | arrow keys |
| Motion | `read src/index.css` `.reveal` + `read src/components/ui/Button.tsx` `baseClasses` + `read src/pages/Home.tsx` hero `scale-105` + facts band | aesthetic claims |
| Token drift | `rg "text-\[11px\]" src/` / `rg "target=.blank" src/` / `rg "bg-\[#"` src/` | editorial + security + drift |

---

## Part A — Comparative `v1 → v2 Maturation` (Audit A)

| # | Dimension | Claim in `design_review.md` | Actual Code | Aligned | Evidence |
|---|---|---|---|---|---|
| A1 | Color — `maroon-950` | v2 introduces `#200a0a` for header/hero; deeper contrast | **YES — VERIFIED** | ✅ | `src/index.css:18` `--color-shrine-maroon-950: #200a0a;` — consumed as `bg-shrine-maroon-950/92` (`Header.tsx:45`), `bg-shrine-maroon-950` (`PageHero.tsx:11`, `Home.tsx:24,58`, `Header.tsx:35`). SKILL §19 hex matches byte-for-byte. **Verdict: High impact, premium grounded feel — confirmed.** |
| A2 | Texture — `bg-grain` / `bg-adobe-texture` / `divider-weave` | v2 adds tactile warmth vs flat gradients | **YES — VERIFIED** | ✅ | `src/index.css:84–102`: `.bg-adobe-texture` (double radial, `rgba 0.06/0.08`), `.bg-grain` (`data:image/svg+xml` turbulence `baseFrequency 0.9`, `opacity 0.035`), `.divider-weave` (45deg `gold-500/maroon-600/pine-600` 6px bands), `.divider-weave-thin` (90deg 10px bands, `height 3px`). Used: `Home.tsx:31` `opacity-60`, `PageHero.tsx:17` `opacity-70`, `Footer.tsx` `divider-weave-thin`. |
| A3 | Typography — `gold-rule` dividers | Stricter editorial structure | **YES — VERIFIED** | ✅ | `src/index.css:104–115`: `.gold-rule` (centered `transparent→gold-500 18%→gold-300 50%→gold-500 82%`), `.gold-rule-left` (`gold-500→transparent`). Used: `PageHero.tsx:27` `w-20`, `Home.tsx:30,41`, `SectionHeading.tsx:15` `w-16 h-px` (`bg-shrine-gold-500` vs `gold-500/70` on `light`). |
| A4 | Layout — Timeline **Left Rail** | Left rail vs alternating zig-zag; easier mobile scan | **YES — VERIFIED** | ✅ | `src/components/Timeline.tsx:9` → `<ol class="relative space-y-10 border-l border-shrine-stone pl-8 sm:pl-12">` with dots `absolute -left-[37px] sm:-left-[53px] rounded-full border-2 border-shrine-gold-500 bg-shrine-cream`. Single vertical rail, no alternating. SKILL §5.2 documents as `border-l`. |
| A5 | Stacking — `z-[100]/z-50/z-40` | Explicit map prevents clipping | **YES — VERIFIED** | ✅ | `src/index.css:159` `.skip-link` → `z-[100]` (`fixed left-4 top-4 -translate-y-24 → focus:translate-y-0`), `src/components/Header.tsx:43` `fixed z-50` + `110` dropdown `z-50`, `src/pages/WhatToSee.tsx:20` `sticky z-40 top-[4.25rem] sm:top-[6.4rem]`. SKILL §18 table matches exactly. |
| A6 | SkipLink — hash trap fix | v2 `preventDefault` + imperative focus; preserves route | **YES — VERIFIED (CRITICAL FIX)** | ✅ | `src/components/SkipLink.tsx` → `onClick event.preventDefault(); document.getElementById('main-content')?.focus({preventScroll:false}); scrollIntoView smooth`. `Layout.tsx:27` → `<main id="main-content" tabIndex={-1}>`. Tests: `SkipLink.test.tsx` 3 tests (href target, hash preservation `window.location.hash "#/about…"`, focus move). `e2e/navigation.spec.ts:14–33` strengthens: `expect(page).not.toHaveURL(/#main-content/)` + `expect(locator("#main-content")).toBeFocused()`. |
| A7 | SafeImage — CDN → local fallback | `loading="lazy"` + hardcoded fallback + `onError` once | **YES — VERIFIED** | ✅ | `SafeImage.tsx:14–38` → `fallback="/images/hero-shrine.jpg"` default, `loading="lazy"` default, `onError → if (!dataset.fallback) { dataset.fallback="1"; setCurrent(fallback) }`, `cn("h-full w-full object-cover", className)`. `content.ts:160–175` → `images.hero` Pexels CDN + `heroFallback` local etc. `e2e/what-to-see.spec.ts` → `route.abort("**/pexels.com/**")` forces fallback → asserts local hero visible. AGENTS.md quirks document this. |
| A8 | Dropdown — hover+click + scroll threshold 16 | Prevents hover trap, delays transparent→solid on Home | **YES — VERIFIED** | ✅ | `Header.tsx:78–79` `onMouseEnter/Leave` + `85–89` `onClick => setOpenDesktopMenu(cur => cur===label?null:label)`. `Header.tsx:24` `useScrolled(16)`. `hooks/useScrolled.ts:3` `threshold=12` default — mismatch is intentional per AGENTS.md quirk + SKILL §6. |

**Audit A verdict in doc:** *"`rothershrine-v2` is production-ready."* — **Alignment: HOLD — see Part B contradictions.** Audit A correctly proves discipline uplifts; its evidence is verified above. But Part B (same file) simultaneously flags two **High** a11y traps that contradict a blanket "production-ready" without qualification (see B1/B2).

### Audit A — Findings Carried Forward

| # | Finding | Severity in doc | Actual | Aligned | Evidence | Disposition |
|---|---|---|---|---|---|---|
| L4 | Accordion — no Arrow/Home/End | Medium / backlog | **VERIFIED GAP** | ✅ (deferred) | `Accordion.tsx` has no `onKeyDown`, no roving tabindex — only `onClick` single-open + `aria-expanded/controls`. `fresh-clone-audit-2026-08-27.md:107` already logs as `L4` backlog. Duplicated as B3 below. | Defer is documented and acceptable; re-validate if FAQ grows beyond 6 items. |
| L5 | `text-[11px]` — 5 editorial hits | Low / accepted | **VERIFIED (6 hits, drift 1)** | ⚠️ PARTIAL | Doc says **5 hits** (Header/Home). `rg "text-\[11px\]" src/` → **6 hits**: `Header.tsx:50`, `NewsEvents.tsx:33`, `Home.tsx:59` (Arrive today), `:97` (facts label), `:197` (ground index), `:231` (event category). `fresh-clone-audit L5` also lists `NewsEvents.tsx`. All are eyebrow/overline, `text-shrine-gold-300/maroon-500/terracotta-500` on high-contrast bands (≥7:1 per SKILL §8.1). **Fix: doc count should say 6 or scope explicitly "Header/Home only".** Impact stays Low. | Update doc or accept 6 with rationale (non-essential, high contrast). |
| R2 | `target=_blank` — 0 matches | Info / none | **VERIFIED — 0 matches** | ✅ | `rg "target=.blank" src/` → 0 in `src/` (only hits are in doc prose). No `noopener` risk today; vigilance rule stands if external links are added. | Keep house rule: any future `target=_blank` must add `rel="noopener noreferrer"`. |

---

## Part B — Mode C Audit (10 Findings, severity-ranked)

| # | Finding (doc title) | Severity in doc | Confidence in doc | Actual Code Location | Aligned | Evidence | Validation |
|---|---|---|---|---|---|---|---|
| **B1** | Mobile Drawer **Focus Trap Missing** | High (Critical per text) | Verified | `Header.tsx:155–213` | **YES — GAP VERIFIED** | Drawer: `<div id={menuId} class="fixed inset-x-0 top-[4.25rem] bottom-0 overflow-y-auto bg-shrine-maroon-950 ...">` — body scroll locked (`useEffect document.body.style.overflow = hidden` + cleanup), but **no** `aria-modal="true"`, **no** `role="dialog"`, **no** `Tab`/`Shift+Tab` wrap, **no** `focus-trap-react`. `rg "aria-modal|focus-trap" src/` → 0. Keyboard user tabs out of drawer into invisible main behind it → **WCAG 2.4.3 Focus Order**. | **Confirmed High.** Recommend `useEffect` trap + `aria-modal="true"` on `id={menuId}` div; existing `helpers` + `userEvent` patterns cover tests. |
| **B2** | **Keyboard-Inaccessible Desktop Dropdowns** | High | Verified | `Header.tsx:74–143` | **YES — GAP VERIFIED (partial mitigation exists)** | Trigger: `<button aria-haspopup="true" aria-expanded={...}>` has `onMouseEnter/Leave` on wrapper `div` + `onClick` toggle (`Header.tsx:78–79,85`). **Missing:** `onFocus`/`onBlur` on trigger or `focus-within` container logic; submenu only opens on hover or explicit click, not on `Tab` focus. Doc snippet `onMouseEnter(() => setOpenDesktopMenu…)` matches byte-for-byte. **Nuance:** `onClick` click-to-toggle already satisfies mouse users; keyboard gap is real but not "exclusively hover" — it's hover + click, still keyboard-blocked unless user presses Enter on trigger. `rg "onFocus|onBlur" src/components/Header.tsx` → 0. → **WCAG 2.1.1 Keyboard.** | **Confirmed High (with amendment: doc slightly overstates "exclusively"; fix is `onFocus/onBlur` + keep `onClick`).** |
| **B3** | **Accordion Missing WAI-ARIA Keyboard** | Medium | Verified | `Accordion.tsx:24–58` | **YES — GAP VERIFIED** | No `onKeyDown`; `button` only has `aria-expanded/controls` + `onClick`. Missing `ArrowDown→next`, `ArrowUp→prev`, `Home→first`, `End→last` + roving `tabIndex`. `rg "onKeyDown|ArrowDown" src/components/ui/Accordion.tsx` → 0. Duplicate of L4. | **Confirmed Medium.** Power users on 6-item FAQ; implement container `onKeyDown` capturing header buttons. |
| **B4** | **Static Hero & Lack of Depth** | Medium (Aesthetic) | Reasoned | `Home.tsx:24–34` | **YES — VERIFIED (reasoned judgment)** | Hero: `<SafeImage className="absolute inset-0 h-full w-full scale-105 object-cover" loading="eager">` — static `scale-105`, no `animation`, no parallax. Evidence string in doc matches. Impact is aesthetic judgment, not contract breach. | **Confirmed as observed aesthetic opportunity.** Load zoom (20s `scale 1→1.05`) + scroll `translateY(scrollY*0.3)` are taste-level enhancements; gate with `prefers-reduced-motion`. |
| **B5** | **Untapped Materiality — Grain `mix-blend-mode`** | Low/Medium (Aesthetic) | Reasoned | `index.css:94–96`, `Home.tsx:31`, `PageHero.tsx:17` | **YES — VERIFIED (reasoned)** | `.bg-grain` → SVG turbulence `opacity 0.035`, applied as `absolute inset-0 opacity-60/70` with **no** `mix-blend-mode`. `rg "mix-blend" src/` → 0. Sits as overlay filter. Judgment to use `multiply` on maroon / `overlay` on parchment. | **Confirmed observed.** Enhancement, not defect. |
| **B6** | **Static Typographic Dividers** | Low (Aesthetic) | Reasoned | `SectionHeading.tsx:14`, `PageHero.tsx:27` | **YES — VERIFIED (reasoned)** | Divider: `Home.tsx:30` `<div class="gold-rule-left mt-5 w-24" />`, `SectionHeading.tsx:14` `mt-4 h-px w-16`, `PageHero.tsx:27` `w-20` — static width, no `draw-line` keyframe. Evidence matches. | **Confirmed observed.** Integrate with `Reveal` or `w-0→w-full` on intersect. |
| **B7** | **Jarring Image Pop-in (No Fade)** | Medium (UX) | Verified | `SafeImage.tsx` | **YES — GAP VERIFIED** | No `onLoad`, no `opacity-0→100`, no `transition-opacity`. `cn("h-full w-full object-cover", className)` only. `rg "onLoad" src/components/SafeImage.tsx` → 0. CDN fallbacks make this more visible on slow networks. | **Confirmed Medium.** Add `loaded` state + `transition-opacity duration-500`. |
| **B8** | **Generic `ease` Easing** | Low (Motion) | Reasoned | `index.css:140–141` | **YES — VERIFIED (reasoned)** | `.reveal { transition: opacity 0.7s ease, transform 0.7s ease }` — generic `ease` vs `cubic-bezier(0.22,1,0.36,1)` / `ease-out-expo`. Judgment call; premium feel. | **Confirmed observed.** Swap `ease` for bespoke curve; gated by reduced-motion kill already present. |
| **B9** | **Flat Button Hover States** | Low (UX) | Reasoned | `ui/Button.tsx:44` | **YES — VERIFIED (reasoned)** | `baseClasses` → `transition-colors duration-200` only; variant hover only color change. Doc suggests `transition-all hover:-translate-y-0.5 hover:shadow-shrine`. Current is minimal/deliberate; enhancement is judgment. | **Confirmed observed.** Enhancement, not defect. |
| **B10** | **Missed Stagger — Facts Band** | Low (Motion) | Reasoned | `Home.tsx:76–93` | **YES — VERIFIED (reasoned)** | Facts band `facts.map(fact => <div key={label} class="flex gap-4 ...">)` — **no `Reveal` wrapper**, no `delay={index*100}`. Other sections (`welcome`, `grounds` `delay={80}`, `events` `delay={50}`) use `Reveal`. Inconsistency confirmed. | **Confirmed observed.** Wrap in `Reveal stagger`. |

### Mode C Verification Ledger — Cross-Check With Doc's Own Ledger

Doc's Verification Ledger (B table) claims all 5 components checked via "Source Code Audit" with results `Focus trap missing, hover-only, no onKeyDown, ease, no onLoad` — **all 5 align with this independent audit.** No false positives found.

---

## Additional Cross-Checks (Not in `design_review.md` but relevant to "alignment")

| Check | Result | Evidence |
|---|---|---|
| No arbitrary `bg-[#...]` | ✅ 0 drift | `rg "bg-\[#"` `src/` → only hits are in doc prose (`CLAUDE.md:80`, `AGENTS.md:58` guidance). |
| `text-[11px]` count drift | ⚠️ 6 vs doc 5 | See L5 above — `NewsEvents.tsx:33` is the 6th (event category on `bg-shrine-parchment`, `text-shrine-terracotta-500` — Low). |
| `HashRouter` preserved | ✅ | `App.tsx` `HashRouter` + `Layout.tsx` double-hash logic intact. |
| `tailwind.config.*` absence | ✅ | No file; `@theme` only in `index.css`. |
| Accessibility contract preserved | ✅ (with B1/B2 gaps) | SkipLink, `Header` `aria-expanded/aria-label/aria-haspop`, `SectionHeading` hierarchy, `PageHero` `alt=""` all intact. |

---

## Consolidated Alignment Summary

| Category | Findings | Alignment Rate | Severity |
|---|---|---|---|
| **Audit A — System evolution claims (A1–A8)** | 8 claims | **8/8 Verified (100%)** | High — system maturity correctly described |
| **Audit A — Carried forward (L4/L5/R2)** | 3 | **2/3 Verified, 1 Partial (token count)** | Low–Medium |
| **Audit B — A11y traps (B1–B3)** | 3 | **3/3 Verified gaps** | **High (B1/B2) + Medium (B3)** |
| **Audit B — Aesthetic / motion (B4–B10)** | 7 | **7/7 Verified as observed (Reasoned)** | Low–Medium (enhancements) |

**Overall `design_review.md` alignment: HIGH fidelity.** No hallucinated claims. Every snippet quoted matches the source byte-for-byte, and no code path contradicts the doc's evidence strings. Two soft corrections: (1) B2's prose "exclusively hover" should acknowledge the existing `onClick` toggle; (2) L5's "5 hits" understates the true 6.

### Contradiction to Resolve in the Source Doc

`design_review.md` contains **two Executive Summaries** with opposing verdicts:

- **Summary A (top):** "`rothershrine-v2` is production-ready … disciplined … elevating visual language." ✅ aligns with verified A1–A8.
- **Summary B (mid):** "Several **critical accessibility gaps** … prevent true production-grade ‘avant-garde editorial’ status." ✅ aligns with B1–B3.

Both are defensible, but together they confuse ship-blocking vs. polish. A single **severity-tiered verdict** is needed (see Recommendation).

---

## Recommended Remediation Sequencing (No Code Yet — Plan Only)

**Do not confuse this validation with execution.** The following is the *ordering* implied by alignment; no edits were made.

| Priority | Items | Rationale | Estimated Effort |
|---|---|---|---|
| **P0 — Ship-blocking a11y** | **B1** Drawer focus trap + `aria-modal="true"` → **B2** Dropdown `onFocus/onBlur` + `focus-within` | Breaks WCAG 2.1.1/2.4.3 on real devices; no work-around for keyboard/mobile users | Small (~40–60 lines + `useEffect` + tests) |
| **P1 — A11y backlog** | **B3 / L4** Accordion Arrow/Home/End roving tabindex | FAQ is 6 items today; cost is low, pattern is copy-pasteable APG | Small (~30 lines + tests) |
| **P2 — Resilience + perceived quality** | **B7** SafeImage fade-in → **B8** reveal easing `cubic-bezier` | B7 reduces jank on CDN fallback; B8 is 1-line token swap — high ROI | Tiny (B7 state + `transition-opacity`, B8 one value) |
| **P3 — Editorial motion polish** | **B9** Button lift + **B10** facts stagger → **B4** hero zoom/parallax → **B6** gold-rule draw → **B5** grain `mix-blend-mode` | Progressive refinement; each is an isolated `@theme`/`className` tweak | Small–Medium (each 1–5 lines, gated by `prefers-reduced-motion`) |

**Process for execution (when you authorize):**

1. P0 changes under TDD: add `Header.test.tsx` focus-trap + keyboard dropdown contract (Fail Red), then `Header.tsx` fix (Green), then `pnpm lint && typecheck && test && test:e2e && build` (Refactor/Verify).
2. Each polish item (B4–B10) isolated behind `prefers-reduced-motion` kill already in `index.css:66–78` — no new reduced-motion logic needed.

---

## Next Steps (Awaiting Your Gate)

Pick one — I will not edit until you choose:

- **(A) Ship the ledger as-is** — this markdown file is the artifact; proceed to remediation planning only when you say "go, P0/P1/P2/P3".
- **(B) Execute P0+P1 now** — same TDD cycle as `fresh-clone-audit` remediation, with browser sweep (`pnpm build && pnpm preview` + `agent-browser` on drawer + desktop hover + keyboard + FAQ).
- **(C) Execute full P0→P3** — sequential phases B1→B10 in one run, one commit per fix, final `pnpm lint && typecheck && test && test:e2e && build` green + updated ledger.

**Validation command rerun (for your records):**

```bash
pnpm lint && pnpm typecheck           # both 0
rg -n "z-\[100\]|z-50|z-40" src/       # skip z-[100], header z-50, jump nav z-40
rg -n "onMouseEnter|onMouseLeave" src/components/Header.tsx  # 78/79 hover, 85 onClick exists
rg -n "onFocus|onBlur" src/components/Header.tsx             # 0 — B2 evidence
rg -n "aria-modal|focus-trap" src/                             # 0 — B1 evidence
rg -n "onKeyDown" src/components/ui/Accordion.tsx             # 0 — B3/L4 evidence
rg -n "onLoad" src/components/SafeImage.tsx                    # 0 — B7 evidence
rg -n "transition: opacity" src/index.css                     # .reveal 0.7s ease — B8
rg -n "transition-colors" src/components/ui/Button.tsx        # baseClasses — B9
rg -n "text-\[11px\]" src/                                     # 6 hits — L5 drift 1
rg -n "target=.blank" src/                                     # 0 — R2
rg -n "bg-\[#"` src/                                           # 0 in src/
```
