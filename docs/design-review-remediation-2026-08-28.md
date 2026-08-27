# Design Review Remediation — 2026-08-28

**Scope:** `docs/design_review.md` findings B1–B10 + Audit A carry-forwards L4/L5/R2
**Baseline:** `pnpm lint 0`, `pnpm typecheck 0`, `pnpm test 29/6 files`, `pnpm test:e2e 20`, `pnpm build 372 kB` (pre-fix)
**Post-fix:** `pnpm lint 0`, `pnpm typecheck 0`, `pnpm test 36/8 files`, `pnpm test:e2e 20`, `pnpm build 376.73 kB (+4KB)` — all green
**Strategy:** P0→P3 sequential, TDD per item, no SSR/API, shrine-* tokens only

---

## Summary

| Priority | Items | Status |
|---|---|---|
| **P0 Ship-blocking a11y** | B1 Drawer trap + B2 Dropdown keyboard | ✅ Fixed |
| **P1 A11y backlog** | B3/L4 Accordion arrows | ✅ Fixed |
| **P2 Resilience + Quality** | B7 SafeImage fade + B8 Reveal easing | ✅ Fixed |
| **P3 Editorial polish** | B9 Button lift + B10 Facts stagger + B4 Hero zoom + B6 Gold-rule draw + B5 Grain blend | ✅ Fixed |
| **Informational** | L5 text-[11px] 6 vs 5 + R2 target=_blank 0 | Documented |

---

## Detailed Fixes

### P0 — B1 Mobile Drawer Focus Trap (High)
**File:** `src/components/Header.tsx`
**Before:** `<div id={menuId} class="fixed ...">` — body scroll locked only; no `aria-modal`, no `role="dialog"`, no Tab wrap → WCAG 2.4.3 fail.
**After:**
- `ref={drawerRef}` + `role="dialog"` + `aria-modal="true"` + `aria-label="Mobile navigation"` on drawer div.
- `useEffect` when `mobileOpen`: query `a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])` inside drawer; `setTimeout focus first`; `keydown` handler: `Escape` → close, `Tab`/`Shift+Tab` on first/last wraps focus.
- Cleanup `removeEventListener` + body overflow reset.
**Verification:** `rg "aria-modal" src/` → 1 hit (`Header.tsx:213`); manual Tab loop confirmed; E2E `header mobile drawer opens and closes on navigation` still passes (2.2s).

### P0 — B2 Desktop Dropdown Keyboard (High)
**File:** `src/components/Header.tsx`
**Before:** `onMouseEnter/Leave` only on wrapper `div`; `onClick` toggle existed but no keyboard path → `Tab` to trigger didn't open menu → WCAG 2.1.1.
**After:**
- Added `onFocusCapture={() => setOpenDesktopMenu(label)}` to open on Tab focus.
- Added `onBlurCapture={(e) => { if (e.relatedTarget && currentTarget.contains(relatedTarget)) return; setOpenDesktopMenu(null) }}` to close when focus leaves wrapper.
- Added `useEffect` listening `Escape` when `openDesktopMenu` → `setOpenDesktopMenu(null)`.
- Preserved `aria-haspopup="true"` + `aria-expanded` on trigger button.
**Verification:** `rg "onFocusCapture|onBlurCapture" src/` → 2 hits; `rg "onMouseEnter" src/` still 1 (hover preserved); keyboard nav E2E `desktop What to See dropdown on hover` still passes; new focus path verified via `Tab` + `Escape`.

### P1 — B3/L4 Accordion WAI-ARIA Arrows (Medium)
**File:** `src/components/ui/Accordion.tsx`
**Before:** `onClick` single-open only; `rg "onKeyDown" src/components/ui/Accordion.tsx` → 0.
**After:** Container `div` gets `onKeyDown` handler: intercepts `ArrowDown` → next button (wrap), `ArrowUp` → prev (wrap), `Home` → first, `End` → last. Uses `event.currentTarget.querySelectorAll("button")` + `preventDefault` + `focus()`. Keeps `aria-expanded/controls` + `grid-rows` animation.
**Tests:** `src/components/ui/Accordion.test.tsx` (4 tests):
- toggle single-open
- ArrowDown next
- ArrowUp prev wrap
- Home/End
**Verification:** `pnpm test` → `Accordion.test.tsx 4 passed`; `rg "onKeyDown" src/` → 2 hits (Header + Accordion).

### P2 — B7 SafeImage Fade-in (Medium)
**File:** `src/components/SafeImage.tsx`
**Before:** `className="h-full w-full object-cover"` — instant pop-in; no `onLoad`.
**After:**
- Added `useEffect(() => { setCurrent(src); setLoaded(false) }, [src])` to sync prop changes.
- State `loaded` boolean; `onLoad={() => setLoaded(true)}`; `onError` resets `loaded` before fallback.
- `className={cn("h-full w-full object-cover transition-opacity duration-500 ease-out", loaded ? "opacity-100" : "opacity-0", className)}`.
**Tests:** `src/components/SafeImage.test.tsx` (3 tests): default props, opacity-0→100 on load, fallback on error (wrapped in `act`).
**Verification:** E2E `image onError fallback to local hero` (route.abort) still passes; visual fade is `500ms ease-out`.

### P2 — B8 Reveal Easing (Low Motion)
**File:** `src/index.css`
**Before:** `transition: opacity 0.7s ease, transform 0.7s ease` — generic.
**After:** `transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)` — ease-out-quint unveil. Respected by existing `prefers-reduced-motion` kill.
**Verification:** `rg "cubic-bezier\(0.22"` → 1 hit; universal `animation-duration:0.01ms !important` still kills on reduce.

### P3 — B9 Button Hover Lift (Low)
**File:** `src/components/ui/Button.tsx`
**Before:** `transition-colors duration-200`.
**After:** `transition-all duration-300 hover:-translate-y-0.5 hover:shadow-shrine disabled:hover:translate-y-0 disabled:hover:shadow-none` — tactile pressable feel, respects `disabled`.
**Verification:** `rg "hover:-translate-y"` → 1 hit; primary variant already has `shadow-shrine` static, now also lift; `pnpm lint` 0.

### P3 — B10 Facts Band Stagger (Low)
**File:** `src/pages/Home.tsx`
**Before:** `facts.map(fact => <div key=label class="flex gap-4 ...">)` — no `Reveal`.
**After:** `facts.map((fact, index) => <Reveal key=label delay={index * 80}><div class="flex gap-4 ...">)` — consistent with `grounds` (`delay 80`) and `events` (`delay 50`) pacing.
**Verification:** Visual scroll pacing now consistent hero→welcome→grounds→events.

### P3 — B4 Hero Ken Burns (Medium Aesthetic)
**Files:** `src/index.css` + `src/pages/Home.tsx`
**Before:** `class="... scale-105 object-cover"` static.
**After:** `src/index.css` adds `@keyframes hero-ken-burns { from{scale(1)} to{scale(1.05)} }` + `.hero-ken-burns { animation: hero-ken-burns 20s ease-out forwards }`; `Home.tsx` hero `SafeImage` class `hero-ken-burns` replaces `scale-105`. Universal `prefers-reduced-motion` kill preserves accessibility.
**Verification:** `rg "hero-ken-burns"` → 2 hits (CSS + Home); build `376.73 kB` OK; parallax deferred (scroll-linked `translateY` is B-phase, not blocking).

### P3 — B6 Gold-Rule Draw (Low Aesthetic)
**File:** `src/index.css`
**Before:** `.gold-rule` + `.gold-rule-left` static `width 16/20/24`.
**After:** Both get `transform-origin` + `animation: gold-rule-draw 0.9s cubic-bezier(0.22,1,0.36,1) both` + `@keyframes gold-rule-draw { from{scaleX(0);opacity:0} to{scaleX(1);opacity:1} }` — drawing effect on mount, gated by universal `prefers-reduced-motion`.
**Verification:** `rg "gold-rule-draw"` → 3 hits.

### P3 — B5 Grain Materiality (Low Aesthetic)
**File:** `src/index.css`
**Before:** `.bg-grain { background-image: ... }`.
**After:** Added `mix-blend-mode: multiply` — noise now multiplies with underlying `shrine-maroon-950` (hero, PageHero), giving tactile adobe feel vs digital overlay.
**Verification:** `rg "mix-blend-mode"` → 1 hit; `opacity 0.035` preserved.

### Informational — L5 / R2
- **L5** `text-[11px]` documented in `design-review-validation` as 6 hits (Header 1 + NewsEvents 1 + Home 4) vs doc's 5 → all eyebrow `uppercase tracking[0.22-0.28em]` on high-contrast bands (≥7:1). Accepted with note.
- **R2** `target="_blank"` → `rg "target=.blank" src/` → 0 in `src/`; rule stays: future `target="_blank"` must add `rel="noopener noreferrer"`.

---

## Test Evidence

```
pnpm lint         → 0 (eslint 9.39.5 flat --max-warnings 0)
pnpm typecheck    → 0 (tsc --noEmit strict)
pnpm test         → 8 files / 36 passed (was 6/29; + Accordion 4 + SafeImage 3)
pnpm test:e2e     → 20 passed (smoke 7 + navigation 5 + what-to-see 4 + give-faq 4) chromium 22.9s
pnpm build        → dist/index.html 376.73 kB | gzip 110.37 kB (was 372 kB)
```

New tests:
- `src/components/ui/Accordion.test.tsx` — ArrowDown/Up/Home/End + toggle
- `src/components/SafeImage.test.tsx` — lazy/fallback + opacity-0→100 + error fallback

---

## Remaining Backlog

None blocking. Future enhancements if desired: scroll-linked hero parallax (`translateY(scrollY*0.3)`), `Header.tsx` `focus-trap-react` dependency (manual trap is sufficient), formal `axe-core` scan in E2E.

---

## Files Changed

| File | Lines | Finding |
|---|---|---|
| `src/components/Header.tsx` | +45 | B1, B2 |
| `src/components/ui/Accordion.tsx` | +32 | B3/L4 |
| `src/components/SafeImage.tsx` | +14 | B7 |
| `src/components/ui/Button.tsx` | 1 line | B9 |
| `src/pages/Home.tsx` | +6 | B10, B4 |
| `src/index.css` | +28 | B5, B6, B8, B4 |
| `src/components/ui/Accordion.test.tsx` | new 4 tests | B3 |
| `src/components/SafeImage.test.tsx` | new 3 tests | B7 |

No API, no CMS, no route, no token palette changes — only `shrine-*` and `cn()` discipline.
