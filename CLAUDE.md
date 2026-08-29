---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# Blessed Stanley Rother Shrine — `rothershrine`

Clone / pilgrimage site for the **National Shrine of Blessed Stanley Rother** (Oklahoma City). Tells the story of the Oklahoma farm boy turned missionary martyr in Santiago Atitlán, Guatemala — martyred July 28, 1981, beatified Sept 23, 2017 — and guides pilgrims through the Pilgrim Center, Shrine Church & Tomb Chapel, and Tepeyac Hill.

**Stack:** React 19.2.8 + Vite 7.3.6 + Tailwind CSS 4.3.3 (`@tailwindcss/vite 4.1.17`) + TypeScript 5.9.3 (strict) + React Router 7.18.2 (HashRouter) + `vite-plugin-singlefile 2.3.3` (primary `dist/index.html` + `dist/images/`) + `tailwind-merge 3.6.0` + `clsx 2.1.1` + `lucide-react 1.34.0` + `eslint 9.39.5` flat (`typescript-eslint 8.28.0` + `eslint-plugin-react-hooks 5.2.0` + `eslint-plugin-react-refresh 0.4.19` + `globals 16.1.0`) + `vitest 3.2.6` (`jsdom 26.1.0`) + `@testing-library/react 16.2.0` + `@testing-library/jest-dom 6.6.3` + `playwright 1.55.1` (chromium) · pnpm 11.0.0 (`packageManager` + `engines node>=20`, `--frozen-lockfile` in CI) · Alias `@` → `src/` · all deps pinned exact — no `^` in `package.json`

> `README.md` is the visitor-facing overview; this file is the authoritative agent onboarding doc. Keep both in sync with `package.json`, `vite.config.ts`, and `tsconfig.json`.

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

Apply to every non-trivial task. Do not skip VALIDATE.

1. **ANALYZE** — Mine requirements in depth. Surface ambiguities, implicit needs, and trade-offs. Explore 2–3 approaches; assess feasibility and long-term cost.
2. **PLAN** — Produce a sequenced plan with phases, checklists, success criteria, and effort estimate. Present it.
3. **VALIDATE** — Obtain explicit user approval before coding. Address concerns.
4. **IMPLEMENT** — Build modular, tested, documented increments. Use library-first selection. Follow TDD Red→Green→Refactor (one commit per cycle).
5. **VERIFY** — Run typecheck / build / tests. Review against best-practice, security, performance, and WCAG AAA criteria. Cover edge cases.
6. **DELIVER** — Hand off complete solution with usage instructions, runbook, and follow-up recommendations.

### Project-Specific Principles

- **Reverent, not austere** — warm parchment/maroon/gold palette, editorial typography (Fraunces / Source Sans 3), ample whitespace. Every page is a welcome, not a brochure.
- **Content fidelity** — Clone intent is inspiration, not pixel theft. Rephrase narrative; preserve historical accuracy (dates, place names, Tz'utujil, Padre Apla's).
- **Single-file deployability** — Must remain a standalone artifact (`index.html` + assets) shippable to GitHub Pages or S3. No SSR, no server.
- **Accessibility is doctrinal** — WCAG AAA intent: keyboard-navigable header, color contrast over texture, meaningful alt text, reduced-motion respect.
- **Static-first data** — Exhibit content lives in `src/data/content.ts` and `src/data/nav.ts`; no CMS or API until explicitly requested.

## Implementation Standards

### General Coding Practices

- **Early returns** over deeply nested conditionals.
- **Composition over inheritance.** Small, focused components.
- **Self-documenting code.** Intentional names; comments explain _why_, not _what_.
- **TDD where logic exists.** Write a failing test before fixing a bug or adding a pure function.
- **No `any`.** Prefer `unknown` + narrowing. Lean on inference; add explicit return types only at public boundaries.
- **Prefer `interface` for shapes, `type` for unions/intersections.**

### Language & Framework Guidelines

#### TypeScript Strict (`tsconfig.json`)

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`, `skipLibCheck: true`.
- `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `isolatedModules: true`, `noEmit: true`.
- Path alias: `@/*` → `src/*` (`baseUrl: "."` + `paths: { "@/*": ["src/*"] }` mirrored in `vite.config.ts` via `path.resolve(__dirname, "src")`). Always import via `@/` for cross-directory imports.
- `target: ES2020`, `lib: [ES2020, DOM, DOM.Iterable]`. Types include `node` + `vitest/globals`.
- Include is `["src", "vite.config.ts", "eslint.config.js", "playwright.config.ts"]`. Check additions are covered by `include` or add them.

#### Vite 7 Specific

- Plugins: `@vitejs/plugin-react 5.2.0` + `@tailwindcss/vite 4.1.17` + `vite-plugin-singlefile 2.3.3`. Order matters — keep as configured.
- HMR enabled by default; do not add a separate dev server abstraction.
- **Env vars:** `VITE_*` prefix for client-exposed vars. Access via `import.meta.env.VITE_*`.
- Import alias configured in `vite.config.ts` via `path.resolve(__dirname, "src")`. Keep `tsconfig.json` `paths` + `baseUrl` in sync.
- Build is single-file: `viteSingleFile()` inlines JS+CSS (not `publicDir`). Avoid dynamic imports that assume code-splitting unless you remove the plugin intentionally.
- `test` lives in `vite.config.ts` (not `vitest.config.ts`): `{ globals: true, environment: "jsdom", setupFiles: ["src/test/setup.ts"], include: ["src/**/*.{test,spec}.{ts,tsx}"], exclude: ["e2e/**", "node_modules/**", "playwright-report/**", "test-results/**"] }`.
- `server.watch.ignored`: `["**/skills/**", "**/dist/**", "**/playwright-report/**", "**/test-results/**", "**/coverage/**"]` — prevents `ENOSPC` from the vendored `skills/` tree (contains large `.venv`).

#### React 19 + React Router 7

- Functional components only; hooks for all state/effects. No class components.
- **Routing:** `HashRouter` at `src/App.tsx` with `Layout` outlet. Preserve alias routes (e.g., `/about` ↔ `/about-blessed-stanley-rother`, `/visit-planning` ↔ `/pilgrimage`, `/shrinegift` ↔ `/give`, `/#` anchors for What-to-See). When adding routes, add both the canonical and the legacy alias if SEO or inbound links expect it.
- Keep routing declarative in `App.tsx`; do not scatter `createBrowserRouter` elsewhere.
- **Layout behavior:** `Layout.tsx` handles scroll restoration and `#hash` smooth scroll with a small `setTimeout` — preserve this pattern when extending layout concerns.
- **Navigation:** `primaryNav: NavItem[]` and `footerNav: NavLink[]` in `src/data/nav.ts` are the single source. Update nav there; Header/Footer render from it.
- Colocation: `components/` for layout primitives, `pages/` for route components, `data/` for typed content, `utils/` for pure helpers (`cn`).
- Custom hooks → `src/hooks/` when extracted (create as needed).
- Server state (future): TanStack Query; global client state: Zustand. Neither is installed yet — add only when traversal proves need.
- Handle all UI states where data is async or conditional: `loading`, `error`, `empty`, `success`. Disable buttons during async ops; show feedback.
- Use library primitives when available (no UI library locked in yet; `shadcn/ui` with Radix is the intended direction per project instructions).

#### Tailwind CSS v4 — CSS-First `@theme`

- Tokens live in `src/index.css` `@theme` block. Extend there; do not introduce arbitrary `bg-[#...]` values.
- Palette: `shrine-cream / parchment(+dark) / stone / ink / charcoal / maroon-{50,100,500,600,700,800,900,950} / gold-{100,300,400,500,600} / pine-{500,600,700} / terracotta-{400,500}` plus `shadow-shrine/shrine-lg` (24 colors + 2 shadows). Use semantic names (`shrine-maroon-600`) not hex.
- Display = `Fraunces`, body = `Source Sans 3`; heading styles set on `h1–h4, .font-display`. Google Fonts loaded in `index.html` — add weights only with purpose.
- Utilities: `text-balance`, `bg-adobe-texture`, `divider-weave` are bespoke; document new utilities alongside them.
- Mobile-first, responsive (`sm:` / `lg:`), and dark-mode tolerant even though the shrine theme is light-first.

#### Component Conventions

- `Button` (`components/ui/Button.tsx`): anchor-based variants `primary | secondary | ghost | outline-light` via `variantClasses` record and `cn()` merge. Use `to` for internal navigation, `href` for external. Keep variant styles centralized there.
- `Container` (`components/ui/Container.tsx`): `max-w-7xl mx-auto px-5 sm:px-8`. All sections should wrap in `Container`.
- `SectionHeading` (`components/ui/SectionHeading.tsx`): `eyebrow? / title / description` with `align` and `light` props.
- `PageHero` (`components/PageHero.tsx`): maroon-950 hero with low-opacity image (`alt=""` only — no `aria-hidden` on the img) + dual gradient overlays; used by most pages.
- `Header` / `Footer`: fixed header with `scrolled` state (`scrollY > 16` via `useScrolled(16)` — hook defaults to `12` — → maroon-950/92 translucent + blur; transparent at the top of Home), desktop dropdown on hover + click (`openDesktopMenu`), mobile drill-down, and hash-aware closing on route change. Preserve keyboard + `aria-expanded` behavior when modifying.
- `SafeImage` (`components/SafeImage.tsx`): wraps `<img>` with `fallback` default `/images/hero-shrine.jpg`, `loading="lazy"` default, and `onError` → `dataset.fallback` guard (swap `src` once). Use for any external CDN image; Pexels URLs in `content.ts` fall back to local `public/images/` on failure. Don't use bare `<img>` for CDN sources.
- `cn` (`utils/cn.ts`): `twMerge(clsx(...))` — always merge classes through `cn()`.

## Development Workflow

### Environment Setup

```bash
# Node 20+ required (Vite 7.3.6). pnpm is the supported package manager.
pnpm install --frozen-lockfile  # deterministic (versions pinned exact in package.json)
# npm is not drop-in for these pins (typescript-eslint 8.28.0 peer predates TS 5.9):
# use `npm ci --legacy-peer-deps` if you must; pnpm is the supported path.
cp .env.example .env.local 2>/dev/null || true  # no env vars required yet
pnpm dev              # http://localhost:5173
```

No backend, no DB, no `.env` contract yet. If env vars are added, document them in "Environment Variables" below.

### Build Commands

| Command | Purpose | Verified |
|---------|---------|----------|
| `pnpm dev` / `npm run dev` | Vite dev server with HMR (default http://localhost:5173) | ✅ in `package.json` |
| `pnpm build` / `npm run build` | Production single-file build (`vite build` + `viteSingleFile`) → `dist/index.html` + `dist/images/` | ✅ |
| `pnpm preview` / `npm run preview` | Preview `dist` build locally | ✅ |
| `pnpm typecheck` / `npm run typecheck` | Type gate `tsc --noEmit` | ✅ |
| `pnpm lint` / `npm run lint` | ESLint flat `eslint . --max-warnings 0` (`eslint.config.js`) | ✅ |
| `pnpm lint:fix` / `npm run lint:fix` | ESLint auto-fix (`eslint . --fix`) | ✅ |
| `pnpm test` / `npm run test` | Vitest `jsdom` — `vitest run` (56 tests, 11 files) | ✅ |
| `pnpm test:watch` | Vitest watch mode (`vitest`) | ✅ |
| `pnpm test:coverage` | Vitest with coverage (`vitest run --coverage`) | ✅ |
| `pnpm test:e2e` / `npm run test:e2e` | Playwright `chromium` — `playwright test` (25 tests: smoke 10 + navigation 6 + what-to-see 4 + give-faq 5) | ✅ |
| `pnpm test:e2e:ui` | Playwright UI mode (`playwright test --ui`) | ✅ |
| `pnpm test:e2e:report` | Open last Playwright HTML report (`playwright show-report`) | ✅ |
| `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` | **Pre-push gate** — all five must be green | ✅ |

> Before documenting a command as available, verify it in `package.json` scripts. Gate is `lint && typecheck && test && test:e2e && build` — CI mirrors it (see Git & Version Control).

### Adding Tooling (wired — 2026-08-27)

Wired: `eslint 9.39.5` flat + `typescript-eslint 8.28.0` + `eslint-plugin-react-hooks 5.2.0` + `eslint-plugin-react-refresh 0.4.19` + `globals 16.1.0` → `eslint.config.js` (flat) + `vitest 3.2.6` + `jsdom 26.1.0` + `@testing-library/react 16.2.0` + `@testing-library/jest-dom 6.6.3` + `@testing-library/user-event 14.5.2` → `vite.config.ts` `test` + `src/test/setup.ts` (`@testing-library/jest-dom/vitest` + `IntersectionObserver` mock + `window.scrollTo` stub) + `playwright 1.55.1` (chromium, `playwright.config.ts` + `e2e/`). Scripts added: `typecheck`, `lint`, `lint:fix`, `test`, `test:watch`, `test:coverage`, `test:e2e`, `test:e2e:ui`, `test:e2e:report`.

Previous bootstrap (for reference):

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D @playwright/test && npx playwright install chromium
```

## Testing Strategy

Current status: **wired — 56 unit + 25 E2E, all green (81 total).** `vitest 3.2.6` (jsdom) + `@testing-library/react 16.2.0` + `jsdom 26.1.0` + `src/test/setup.ts` (`@testing-library/jest-dom/vitest` + `IntersectionObserver` mock + `window.scrollTo` stub) + `playwright 1.55.1` (chromium, `playwright.config.ts` + `e2e/` 4 specs, `expect.timeout` 15s headroom for cold dev-server dep-optimization). Run `pnpm test` (unit), `pnpm test:watch` (watch), `pnpm test:coverage` (coverage), `pnpm test:e2e` (E2E, `webServer` → `pnpm exec vite --port 5173 --host 127.0.0.1 --strictPort` with `reuseExistingServer: !CI`), `pnpm test:e2e:ui` (UI mode), `pnpm test:e2e:report` (HTML report). `vitest` config lives in `vite.config.ts` `test` — `{ globals: true, environment: "jsdom", setupFiles: ["src/test/setup.ts"], include: ["src/**/*.{test,spec}.{ts,tsx}"], exclude: ["e2e/**", "node_modules/**", "playwright-report/**", "test-results/**"] }` + `server.watch.ignored` for `skills`/`dist`/`coverage`.

Coverage so far — **unit (11 files / 56):**
- Pure helpers — `src/utils/cn.test.ts` (5 — twMerge dedup, clsx falsy)
- Nav data invariants — `src/data/nav.test.ts` (6 — 6 primaryNav, 2 with children+description, hash anchors, footerNav 10)
- Content data invariants — `src/data/content.test.ts` (5 — lifeTimeline 8, whatToSee 3+imageAlt, faqs 6, upcomingEvents 4+category, givingOptions 8+icon)
- Site invariants — `src/data/site.test.ts` (4 — address, maps URLs, contact, hours 5 keys)
- UI primitive — `src/components/ui/Button.test.tsx` (9 — to→Link, href→a (external → `target=_blank` + `rel=noopener noreferrer`), button→button, variants + icon, press feedback `active:scale-[0.98]`)
- UI primitive — `src/components/ui/Accordion.test.tsx` (6 — single-open, keyboard, closed panels `inert` + `aria-hidden`, `motion-reduce:transition-none`)
- A11y contract — `src/components/SkipLink.test.tsx` (3 — href target, activation keeps route under HashRouter, focus moves to `#main-content`)
- Image fallback — `src/components/SafeImage.test.tsx` (3 — local fallback swap, lazy, alt)
- Back-to-top — `src/components/BackToTop.test.tsx` (7 — hidden/visible threshold states at 480px, click → `scrollTo({top:0})` smooth, reduced-motion → `auto`, 44px touch target, mount contract without touching `location.hash`)
- Header contract — `src/components/Header.test.tsx` (4 — `aria-current="page"` on active top-level link, off inactive links, dropdown parent `aria-current="true"` when a child route is active, hamburger stays 44px)
- Contrast guard — `src/pages/dark-band-contrast.test.tsx` (4 — home hero h1, home CTA h2, Give CTA h2 carry `text-shrine-cream` on dark bands; PageHero regression guard)

**E2E (4 files / 25, chromium):**
- `e2e/smoke.spec.ts` (10) — Home hero+facts, alias routes (`/about`↔`/about-blessed-stanley-rother`, `/what-to-see`↔`/grounds-art-architecture`, `/pilgrimage`↔`/visit-planning`+#visit), What-to-See 3 anchors, double-hash anchors, mobile drawer open→navigate→close, NotFound + **Sacred Motion**: hero h1 renders `rgb(250, 246, 236)` cream on the dark overlay with `rise-in`, BackToTop appears after deep scroll and returns to top without touching the hash, event category chips
- `e2e/navigation.spec.ts` (6) — desktop hover dropdown (`aria-expanded` + 3 children + descriptions), keyboard nav + SkipLink (activation must **preserve the URL** — no `#main-content` rewrite — keep Home heading, and focus `#main-content`), footer 10 links (Explore→History, Get involved→Tepeyac Hill hash), NotFound Return Home, header top bar Give→`/give` + **aria-current contract** (active top-level `page`; dropdown parent `true` when a child route like `/history` is active)
- `e2e/what-to-see.spec.ts` (4) — 3 sections + imageAlt/details, CDN fallback (`route.abort("**/pexels.com/**")` → SafeImage local hero), jump nav `Link` preserves HashRouter route (`/what-to-see#tepeyac-hill` not NotFound), Home grounds cards→anchors
- `e2e/give-faq.spec.ts` (5) — Give 8 options + external `https://www.rothershrine.org/give` + alias `/shrinegift`, FAQ accordion single-open (`aria-expanded`), **closed FAQ panel `aria-hidden` + `inert` → expands on click**, Pilgrimage mailto `pilgrimage@rothershrine.org` + Find Us + Google Maps, Footer Give

### When to Add More Tests

- Additional pure helpers (`src/utils/*`, selectors, content transforms) — unit tests.
- Routing contract — `App.tsx` alias routes + hash anchors integration (MemoryRouter) — now covered by `e2e/smoke.spec.ts` for critical paths.
- Critical journeys — expand `e2e/` beyond smoke: `navigation.spec.ts` (desktop hover, a11y), `what-to-see.spec.ts` (3 sections + imageAlt fallback), `give-faq.spec.ts` (Give 8 options + FAQ accordion). See `e2e/smoke.spec.ts` for pattern.
- Visual / a11y — add `axe` scan + `playwright` trace/video (already `on-first-retry`).

Conventions: `*.test.tsx` adjacent to source, `__mocks__` only when isolating `react-router-dom`, and `src/data/content.ts` factories (`getMockTimelineEntry`, `getMockWhatToSee`) for fixtures when needed.

## Code Quality Standards

### Linting & Formatting (wired)

`eslint 9.39.5` flat config (`eslint.config.js`) — `typescript-eslint 8.28.0` + `eslint-plugin-react-hooks 5.2.0` + `eslint-plugin-react-refresh 0.4.19` + `globals 16.1.0` (ignores `dist`, `node_modules`, `coverage`, `playwright-report`, `test-results`). Run `pnpm lint` (`eslint . --max-warnings 0`) and `pnpm lint:fix` (`eslint . --fix`) for auto-fix. Gate for pre-ship (5-step):

```bash
pnpm lint               # eslint flat — no warnings
pnpm typecheck          # tsc --noEmit
pnpm test               # vitest jsdom — 56 tests
pnpm test:e2e           # playwright chromium — 25 tests
pnpm build              # vite build — singlefile inlines correctly
```

### Type Safety

- No `any`; `as any` is a last resort with a `// ponytail:` ceiling comment.
- `unknown` + narrowing at trust boundaries (URL params, external JSON).
- Keep `tsconfig.json` strict flags on; do not relax to silence errors.

### Styling Discipline

- Use existing `shrine-*` tokens before introducing new colors.
- No redundant CSS: extend `@theme` or add a named `@utility`; do not duplicate utilities across components.
- Keep bespoke CSS to `src/index.css` `@layer` blocks.

## Git & Version Control

### Branching

- `main` is the deploy branch (single-file artifact).
- Feature branches: `feat/<slug>`, fixes: `fix/<slug>`, docs: `docs/<slug>`. Short-lived (1–3 days), rebase or squash-merge.
- Do not commit `node_modules/`, `.next/`, `dist/`. `skills/` **is** committed (vendored reference content) — do not import or lint it; `eslint.config.js` ignores and `server.watch.ignored` exclude it.

### Commit Standards

- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`.
- Atomic commits (one logical change). Subject ≤ 72 chars; body explains why.

### Push / Deploy

Gate before pushing `main` (mirrored in CI — `.github/workflows/ci.yml`):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build
git push origin main
```

**CI (`.github/workflows/ci.yml`)** — triggers on `push`/`pull_request` to `main`, `concurrency: group: ci-${{ github.ref }}, cancel-in-progress: true`, `runs-on: ubuntu-latest`, `timeout-minutes: 15`:
`actions/checkout@v4` → `pnpm/action-setup@v4` (`version: 11`) → `actions/setup-node@v4` (`node-version: 24`, `cache: pnpm`) → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm typecheck` → `pnpm test` → `npx playwright install --with-deps chromium` → `pnpm test:e2e` → `pnpm build` → artifacts: `playwright-report/` (on failure, `retention-days: 14`) + `dist/` (always, `retention-days: 7`).

Primary artifact `dist/index.html` (+ `dist/images/` copied from `public/` — `viteSingleFile` inlines JS+CSS, not `publicDir`) deploys directly to GitHub Pages (via `gh-pages` branch or `dist` artifact — upload both) or S3 — ensure hash routing remains (`HashRouter` avoids 404s on static hosts).

## Error Handling & Debugging

- SPA has no server failures; handle: broken image fallbacks, unknown routes → `NotFound` (`pages/NotFound.tsx`), and empty content states per page.
- `Layout` scroll logic should degrade gracefully when a `#hash` target is missing (current behavior: falls back to `window.scrollTo`).
- For future data fetching (CMS/API): wrap with error boundaries and show user-friendly messages; never leak raw errors.
- Debugging: Vite HMR overlay + React DevTools. For `HashRouter` issues, inspect `location.pathname` + `location.hash` in `Layout`'s `useEffect`.

## Communication & Documentation

- Explain _why_ behind shrine-specific choices (historical wording, liturgical dates, cultural sensitivity around Guatemalan / Tz'utujil references).
- Keep `docs/prompts.md` for lineage prompts; update when intent shifts.
- Document new routes, tokens, or images in this file and in `src/data/nav.ts` / `src/data/content.ts` comments where applicable.
- Preserve dual-route aliases when renaming legacy paths (external links exist).

## Project-Specific Standards

### Architecture

```
src/ (45 files: 32 source + 11 tests + 1 setup + 1 css)
  App.tsx                # HashRouter + route table: 16 Route entries (15 content paths + * NotFound), 6 legacy alias paths in 5 groups + 4 hash anchors
  main.tsx               # StrictMode + createRoot
  index.css              # Tailwind v4 @theme (24 colors + 2 shadows) + @layer base/utilities (17 distinct + hero-ken-burns ambient incl. rise-in(+d1…d4)/menu-in/drawer-in/dot-pulse/card-lift/link-underline)
  components/
    Layout.tsx           # Outlet + double-hash scroll/hash restoration (split on # + strip / + 80ms timeout, timer cleared on route change) + BackToTop mount
    Header.tsx           # fixed + useScrolled(16) + desktop hover (openDesktopMenu, menu-in) + mobile drill-down (drawer-in) + aria-current contract (top-level `page`, dropdown parent `true` when child active) + hash-aware close
    BackToTop.tsx        # floating 44px button, scrollY > 480, aria-hidden + tabindex -1 when hidden, reduced-motion → behavior auto, never touches the hash
    Footer.tsx           # 4-col + divider-weave (consumes site.ts + nav.ts) + link-underline nav links
    PageHero.tsx         # maroon-950 hero + bg-grain + dual gradients (compact?) + staged rise-in
    SafeImage.tsx        # <img> wrapper: fallback="/images/hero-shrine.jpg", loading="lazy", onError→dataset.fallback guard (once)
    Emblem.tsx / Timeline.tsx (dot-pulse) / SocialIcons.tsx / SkipLink.tsx
    ui/                  # Button (to/href/button + primary/secondary/ghost/outline-light + icon; external href → target=_blank + rel=noopener noreferrer; active:scale-[0.98]) / Container (max-w-7xl) / SectionHeading (eyebrow/title/description + align/light) / Accordion (single-open; closed panels inert + aria-hidden; ease-out + motion-reduce:transition-none) / Reveal (delay/as + IntersectionObserver)
  hooks/
    useScrolled.ts       # threshold 12 default; Header passes 16
  pages/ (10, named exports)
    Home.tsx             # hero + quickFacts + welcome + grounds + events
    AboutRother.tsx / History.tsx / WhatToSee.tsx (jump nav via <Link to="/what-to-see#id">) / Pilgrimage.tsx
    NewsEvents.tsx / Volunteer.tsx / Give.tsx / FAQ.tsx / NotFound.tsx
  data/
    nav.ts               # primaryNav (6, 2 with children+description) / footerNav (10) (single source; Header/Footer render from it)
    content.ts           # lifeTimeline (8), whatToSee (3+imageAlt), faqs (6), upcomingEvents (4+category), givingOptions (8+icon) + images {hero/heroFallback/wheat/atitlan…} (Pexels CDN + local fallback)
    site.ts              # canonical single source: address + hours (5 keys: grounds/shrineChurch/chapelOfTomb/giftShop/museum) + mass + contact + mapsUrl/mapsEmbedSrc
  utils/
    cn.ts                # twMerge(clsx) — always merge via cn()
  test/
    setup.ts             # @testing-library/jest-dom/vitest + IntersectionObserver mock + window.scrollTo stub
  **/*.test.{ts,tsx}     # 11 files / 56 tests: utils/cn (5), data/nav (6), data/content (5), data/site (4), ui/Button (9), ui/Accordion (6), SkipLink (3), SafeImage (3), BackToTop (7), Header (4), pages/dark-band-contrast (4)
public/
  images/ (4)            # hero-shrine.jpg, chapel-light.jpg, oklahoma-wheat.jpg, tepeyac-hill.jpg (Vite publicDir → dist/images/ — upload alongside dist/index.html); Pexels CDN for hero/whatToSee with SafeImage fallback
vite.config.ts           # alias @→src + test { globals, jsdom, setupFiles, include, exclude: e2e/** } + server.watch.ignored [skills/**, dist/**, playwright-report/**, test-results/**, coverage/**]
tsconfig.json            # strict + noUnusedLocals/noUnusedParameters/noFallthroughCasesInSwitch/isolatedModules/noEmit + include [src, vite.config.ts, eslint.config.js, playwright.config.ts] + types [node, vitest/globals] + paths @/*
eslint.config.js         # flat (typescript-eslint 8 + react-hooks 5 + react-refresh) + ignores [dist, node_modules, coverage, playwright-report, test-results]
playwright.config.ts     # chromium only + webServer pnpm exec vite :5173 + trace/video on-first-retry
e2e/ (4 specs / 25 tests) # smoke (10) + navigation (6) + what-to-see (4) + give-faq (5) + helpers.ts
.github/workflows/ci.yml # lint → typecheck → test → playwright install --with-deps chromium → test:e2e → build + artifacts (Node 24, pnpm 11)
```

- **SafeImage fallback pattern:** `SafeImage.tsx` guards `onError` with `dataset.fallback="1"` so the swap to local `/images/hero-shrine.jpg` (or explicit `fallback`) fires once. E2E `what-to-see.spec.ts` exercises this via `page.route("**/pexels.com/**", route.abort)`. Use `SafeImage` for every external image; never bare `<img>` for CDN sources.

- **Data ownership:** Narrative and exhibit data is typed in `content.ts` (`TimelineEntry`, `WhatToSeeSection`, `FaqItem`, `EventItem`, `GivingOption`). Pages render from these arrays — do not inline copy that belongs in `data/`.
- **Routing model:** Client-side only; no loaders or server components. Alias routes (`/about` + `/about-blessed-stanley-rother`, `/what-to-see` + `/grounds-art-architecture`, `/pilgrimage` + `/visit-planning` + `/hours-location`, `/news-events` + `/news-and-events`, `/give` + `/shrinegift`) are intentional — keep them when adding new canonical paths.
- **No global store yet.** Lift state only when cross-page need proves itself.

### File Organization & Naming

- Components: `PascalCase.tsx` (e.g., `PageHero.tsx`, `SafeImage.tsx`); hooks: `useThing.ts` (`hooks/useScrolled.ts`).
- Data/utils: `camelCase.ts` (`content.ts`, `site.ts`, `cn.ts`).
- Pages: `PascalCase.tsx` matching route intent (`Pilgrimage.tsx`, `WhatToSee.tsx`) — 10 pages, named exports.
- Assets: `public/images/<slug>.jpg` — reference as `/images/<slug>.jpg` (absolute from root, Vite `publicDir` → `dist/images/` — upload alongside `dist/index.html`; singlefile inlines JS+CSS, not `public/`). WhatToSee + hero/wheat/atitlan use Pexels CDN URLs in `src/data/content.ts` `images` object with `*Fallback` locals via `SafeImage`.
- Tests: `*.test.{ts,tsx}` adjacent to source — `cn`, `nav`, `content`, `site`, `ui/Button`, `ui/Accordion`, `SkipLink`, `SafeImage`, `BackToTop`, `Header`, `pages/dark-band-contrast` (11 files / 56 tests) + `src/test/setup.ts` (jest-dom + IntersectionObserver mock + scrollTo stub). `vite.config.ts` `test.exclude` keeps `e2e/**` out of unit runs; `e2e/*.spec.ts` is Playwright only.

### Design System

- Tokens: see `src/index.css` `@theme`. Additions require design rationale in PR description.
- Typography scale: `Fraunces` for display/quote, `Source Sans 3` for body. Use `font-display` class for intentional display turns.
- Elevation: `shadow-shrine` (`0 20px 60px -20px rgba(53,16,18,.35)`). Use sparingly (hero, cards, emblem).
- Do not introduce purple gradients, `Inter` defaults, or generic card-grid templates — anti-generic enforcement (see Avant-Garde stance below).
- Reference skill: `avant-garde-design-v4` for direction when adding new sections; extract from live shrine only via `agent-browser` workflows when explicitly requested.

### State & Data Layer

- No API or DB. Content arrays in `src/data/content.ts` are the data layer. Validate shape with TypeScript interfaces; add Zod schemas only if external data arrives.
- For future CMS integration (e.g., Sanity), isolate fetch + Portable Text rendering behind a `lib/cms` boundary and keep `content.ts` as the local fallback.

### Environment Variables

| Variable | Purpose | Example | Status |
|----------|---------|---------|--------|
| `VITE_*` | Client-exposed Vite vars (prefix required for `import.meta.env` exposure) | `VITE_MAPS_KEY=...` | None required yet — no `.env` contract |
| _none_ | _No backend, no DB, no SSR_ | — | — |

When adding vars, document them here and in `.env.example`, and guard with `import.meta.env` typing in `src/env.d.ts`. `VITE_*` is the only prefix Vite exposes to the client.

### Accessibility & SEO

- `index.html` ships `lang="en"`, `viewport`, `description`, and preconnected Google Fonts. Extend with Open Graph / JSON-LD only with real shrine data.
- Header mobile toggle uses `aria-label` + `aria-expanded`; dropdowns should acquire `aria-haspopup` / focus-trap if converted to click-open.
- Images: `alt` for content, `alt=""` for decorative hero overlays (as `PageHero` does — no `aria-hidden` on the img itself).
- Skip link: `SkipLink.tsx` must never rewrite the hash (route loss under HashRouter) — it `preventDefault`s and focuses `#main-content`; keep the `SkipLink.test.tsx` contract green.
- Keep color contrast ≥ 4.5:1 for body text (`shrine-ink` on `shrine-cream` meets it; verify new pairings). Dark-band headings must carry explicit `text-shrine-cream` — the global `h1–h4` maroon-700 base rule fails catastrophically on `maroon-900/950` surfaces (guarded by `dark-band-contrast.test.tsx` + e2e computed-color assertion).
- Header nav carries the current-page contract: `aria-current="page"` on the active top-level link, `aria-current="true"` + gold tint on a dropdown parent whose child route is active (desktop + mobile drawer). Accordion closed panels are `inert` + `aria-hidden`. Motion respects `prefers-reduced-motion` (global block + explicit loop opt-outs).

## Anti-Patterns to Avoid

- **Copy-paste from templates as truth** — verify every command in `package.json` before documenting it.
- **Extending `@theme` with one-off hex values** — add a named token or reuse an existing `shrine-*` token.
- **Prop-drilling nav arrays** — consume `primaryNav` / `footerNav` directly from `data/nav.ts`.
- **Converting `HashRouter` to `BrowserRouter` without a static-host fallback** — breaks deep-links on GitHub Pages/S3 unless you add a 404.html redirect.
- **Breaking alias routes** — external parish/school links depend on legacy paths; keep aliases or add explicit redirects.
- **Importing Google Fonts imperatively in components** — fonts belong in `index.html` + `@theme`; do not add runtime font loaders.
- **Bypassing `cn()` for conditional classes** — always merge via `cn()` so `tailwind-merge` deduplicates correctly.
- **Adding a UI library without adopting its primitives** — if `shadcn/ui` (Radix) is introduced, use its primitives; do not rebuild Dialog/Dropdown from scratch.
- **Over-hydrating or adding SSR** — this is a static SPA; do not introduce server rendering or API routes without a deliberate architecture decision.

## Success Metrics

You are done when:

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (56), `pnpm test:e2e` (25, chromium), and `pnpm build` are all green (81 total — 11 unit files + 4 E2E specs).
- All 10 pages + 6 legacy alias paths in 5 groups (`/about`↔`/about-blessed-stanley-rother`, `/what-to-see`↔`/grounds-art-architecture`, `/pilgrimage`↔`/visit-planning`↔`/hours-location`, `/news-events`↔`/news-and-events`, `/give`↔`/shrinegift`) + 4 hash anchors (`#pilgrim-center`, `#shrine-church`, `#tepeyac-hill`, `#visit`) navigate correctly, including direct hash URLs on static hosts (HashRouter, no 404.html needed).
- Header is fixed, `useScrolled(16)` translucency works, mobile drawer closes on navigation (`aria-expanded`), desktop What-to-See hover dropdown shows 3 children + descriptions, and keyboard + SkipLink (`#main-content`, hash-preserving) covers all nav items.
- Content renders from `src/data/*` (`content.ts` + `site.ts` hours 5 keys + nav.ts) without inline duplication; new tokens live in `src/index.css` `@theme` (24 colors + 2 shadows).
- `SafeImage` fallback verified (CDN→local on `route.abort`), no `any`, no unused locals/params, no missing `imageAlt`/`alt` on content images, CI artifacts (`dist/` + `playwright-report/` on failure) green.

## System Integration

### Available Tools (in this workspace)

- `read` / `write` / `edit` / `bash` / `fd` / `rg` / `agent-browser` / `subagent_spawn` / `workflow` — standard Pi harness.
- `skills` is vendored, git-tracked reference content (index: `skills/skills-catalog.md`) — not project source. Do not import from or lint it; `eslint.config.js` `ignores` + `vite.config.ts` `server.watch.ignored` already exclude it.

### Related Skills

- `framework-templates` — companion to `claude-md` for framework sections (Vite+React used here).
- `avant-garde-design-v4` / `super-frontend-design` / `claude-design` — when refining shrine aesthetics.
- `webapp-testing-journey` / `agent-browser` / `playwright-cli` — when exercising journeys or visual QA.
- `verification-and-review-protocol` — before claiming work done.
- `lint-and-validate` / `clean-code` / `testing-patterns` — quality gates.

## Continuous Improvement

- When a command is added to `package.json` scripts, update the Build Commands table.
- When a token or utility is added to `src/index.css`, document its intent in this file and in a code comment.
- When a route alias is added or removed, update both `App.tsx` and `data/nav.ts` guidance above.
- Re-audit this file after any framework bump (React 19, Vite 7, Tailwind 4) or after introducing tests/lint/CMS.

---

### Validation Checklist (for maintainers)

| # | Section | Required | Present |
|---|---------|----------|---------|
| 1 | Core Identity & Purpose | Yes | ✅ |
| 2 | Foundational Principles (Six-Phase) | Yes | ✅ |
| 3 | Implementation Standards | Yes | ✅ |
| 4 | Development Workflow | Yes | ✅ |
| 5 | Testing Strategy | Yes | ✅ |
| 6 | Code Quality Standards | Yes | ✅ |
| 7 | Git & Version Control | Yes | ✅ |
| 8 | Error Handling & Debugging | Yes | ✅ |
| 9 | Communication & Documentation | Yes | ✅ |
| 10 | Project-Specific Standards | Yes | ✅ |
| 11 | Success Metrics | — | ✅ |
| 12 | System Integration | — | ✅ |
| 13 | Anti-Patterns to Avoid | — | ✅ |
| 14 | Continuous Improvement | — | ✅ |
