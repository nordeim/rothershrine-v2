# AGENTS — rothershrine

> Clone of the National Shrine of Blessed Stanley Rother (OKC). Static SPA — no backend, no DB, no SSR. For deep conventions, workflow, and design system detail, read `CLAUDE.md`.

## Stack

`React 19.2.8` + `Vite 7.3.6` + `Tailwind CSS 4.3.3` (`@tailwindcss/vite 4.1.17`, CSS-first `@theme` inline in `src/index.css`) + `TypeScript 5.9.3` strict + `React Router 7.18.2` `HashRouter` + `vite-plugin-singlefile 2.3.3` (primary `dist/index.html` + `dist/images/` for GH Pages / S3) + `eslint 9.23.0` flat + `vitest 3.2.6` (`jsdom 26.1.0`) + `@testing-library/react 16.2.0` + `playwright 1.55.1` (chromium) · alias `@` → `src/` (sync `vite.config.ts` `path.resolve(__dirname,"src")` ↔ `tsconfig.json` `paths: {"@/*":["src/*"]}` + `baseUrl:"."`) · `pnpm 11.0.0` (`packageManager` + `engines node>=20`, `pnpm-lock.yaml` committed, `--frozen-lockfile` in CI), `npm` works · all deps pinned exact — no `^` in `package.json` (re-pin on upgrade, update docs)

## Commands

All commands verified in `package.json` `scripts`. Don't document a script until it exists there.

| Command | Purpose |
|---|---|
| `pnpm install` | Install deps (Node 20+ for Vite 7, pnpm 11) — pnpm is the supported path; `npm ci` needs `--legacy-peer-deps` (typescript-eslint 8.28.0 peer range predates TS 5.9) |
| `pnpm dev` | Vite HMR dev server (default `http://localhost:5173`) |
| `pnpm build` | Production single-file build → `dist/index.html` |
| `pnpm preview` | Preview `dist` locally |
| `pnpm typecheck` | Type gate `tsc --noEmit` — **run before every push** |
| `pnpm lint` | ESLint flat (`eslint . --max-warnings 0`) |
| `pnpm lint:fix` | ESLint auto-fix (`eslint . --fix`) |
| `pnpm test` | Vitest `jsdom` `run` (6 files / 29 tests) |
| `pnpm test:watch` | Vitest watch mode |
| `pnpm test:coverage` | Vitest with coverage (`vitest run --coverage`) |
| `pnpm test:e2e` | Playwright `chromium` (4 specs / 20 tests) — `playwright.config.ts` + `e2e/` |
| `pnpm test:e2e:ui` | Playwright UI mode |
| `pnpm test:e2e:report` | Open last Playwright HTML report |
| `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` | Pre-push gate (all five must be green) |

## Structure

```
src/ (39 files: 32 source + 6 tests + 1 setup)
  App.tsx              # HashRouter + alias routes (see below)
  main.tsx             # StrictMode + createRoot
  index.css            # @theme tokens (24 colors + 2 shadows) + @layer base/utilities (11: text-balance, bg-adobe-texture, bg-grain, divider-weave, divider-weave-thin, gold-rule, gold-rule-left, mask-fade-b, reveal, reveal-visible, skip-link)
  components/          # Layout (+SkipLink), Header (useScrolled(16)), Footer, PageHero, Emblem, Timeline, SocialIcons, SafeImage (Pexels→local fallback), ui/{Button,Container,SectionHeading,Accordion,Reveal}
  hooks/               # useScrolled.ts (threshold 12 default; Header passes 16)
  pages/               # Home, AboutRother, History, WhatToSee, Pilgrimage, NewsEvents, Volunteer, Give, FAQ, NotFound (10 pages, named exports)
  data/                # nav.ts (with description), content.ts (lifeTimeline/whatToSee/faqs/upcomingEvents/givingOptions + images {hero/heroFallback/wheat/atitlan…}), site.ts (hours 5 keys + mass + contact + mapsUrl/mapsEmbedSrc)
  utils/cn.ts          # twMerge(clsx) — always merge via cn()
  test/setup.ts        # vitest jsdom setup (`@testing-library/jest-dom` + IntersectionObserver mock)
  **/*.test.{ts,tsx}   # 6 files / 29 tests: utils/cn (5), data/nav (6), data/content (5), data/site (4), ui/Button (6), SkipLink (3)
vite.config.ts         # alias @→src + test { globals, jsdom, setupFiles: src/test/setup.ts, include: src/**/*.{test,spec}.{ts,tsx}, exclude: e2e/** } + server.watch.ignored [skills/**, dist/**, playwright-report/**, test-results/**, coverage/**]
tsconfig.json          # strict + noUnusedLocals/noUnusedParameters/noFallthroughCasesInSwitch/isolatedModules/noEmit + include [src, vite.config.ts, eslint.config.js, playwright.config.ts] + types [node, vitest/globals] + paths @/*
eslint.config.js       # flat config (typescript-eslint 8 + react-hooks 5 + react-refresh)
playwright.config.ts   # Playwright 1.55.1 (chromium, webServer → pnpm exec vite :5173)
e2e/                   # 20 tests — smoke.spec.ts (7) + navigation.spec.ts (5) + what-to-see.spec.ts (4) + give-faq.spec.ts (4) + helpers.ts
.github/workflows/ci.yml # CI: lint → typecheck → test → test:e2e (chromium) → build + artifacts (Node 24, pnpm 11)
public/images/         # 4 files: hero-shrine.jpg, chapel-light.jpg, oklahoma-wheat.jpg, tepeyac-hill.jpg (Vite publicDir → dist/images/ — upload alongside dist/index.html); Pexels CDN for hero/whatToSee with SafeImage local fallback
```

## Quirks — would break if guessed wrong

- **HashRouter is intentional** — static hosts (GH Pages / S3) have no SPA fallback. Don't switch to `BrowserRouter` without adding a `404.html` redirect.
- **`viteSingleFile()` inlines JS+CSS** — `public/images/` is still copied to `dist/images/` (Vite `publicDir` is not inlined; upload both). No assumed code-splitting. Dynamic `import()` that expects chunks will be inlined or break.
- **Alias `@` must stay in sync** — `vite.config.ts` (`path.resolve(__dirname,"src")`) ↔ `tsconfig.json` (`paths: {"@/*":["src/*"]}`, `baseUrl:"."`) — change both.
- **Tailwind v4 has no `tailwind.config.js`** — tokens live only in `src/index.css` `@theme`. Don't add arbitrary `bg-[#...]`; extend `@theme` with a named `shrine-*` token.
- **TS strict will fail on unused code** — `noUnusedLocals:true` + `noUnusedParameters:true` + `noFallthroughCasesInSwitch:true` + `isolatedModules:true` + `noEmit:true`. Clean unused vars/params before commit.
- **Test/lint harness: `eslint 9.23.0` flat + `vitest 3.2.6` (jsdom) + `@testing-library/react 16.2.0` + `playwright 1.55.1` (chromium)** — gate is `lint && typecheck && test && test:e2e && build` (`29 unit` via `src/test/setup.ts` + `20 E2E` via `e2e/`). CI mirrors this in `.github/workflows/ci.yml` (Node 24, pnpm 11).
- **`skills` is vendored, git-tracked reference content** (not project source; `skills/skills-catalog.md` is the index). Tooling ignores it: `eslint.config.js` `ignores` + `vite.config.ts` `server.watch.ignored`; `tsc` only includes `src` + configs. Don't lint or import from it.
- **Google Fonts loaded in `index.html`** — `Fraunces` (display) + `Source Sans 3` (body). Don't add runtime font loaders in components.
- **`Layout.tsx` handles hash scroll** — double-hash aware (`#/what-to-see#pilgrim-center` → split on `#` + strip `/`) + `setTimeout 80ms` + fallback `window.scrollTo`. Preserve when extending layout.
- **`vite.config.ts` `server.watch.ignored`** — ignores `**/skills/**`, `**/dist/**`, `**/playwright-report/**`, `**/test-results/**`, `**/coverage/**` to avoid `ENOSPC` file-watcher limit from the vendored `skills/` tree (contains large `.venv`).
- **`SafeImage` fallback** — `src/components/SafeImage.tsx` wraps `<img>` with `fallback` default `/images/hero-shrine.jpg`, `loading="lazy"` default, and `onError` → `dataset.fallback` guard to swap `src` once. Pexels CDN URLs (`images` in `content.ts`) fall back to local `public/images/` on failure. Use `SafeImage` for any external image; don't use bare `<img>` for CDN sources.
- **SkipLink never rewrites the hash** — `src/components/SkipLink.tsx` `preventDefault`s and imperatively focuses `#main-content` (`<main tabIndex={-1}>` in `Layout`). A native jump would rewrite the hash and route to NotFound under HashRouter. Covered by `SkipLink.test.tsx` + strengthened `e2e/navigation.spec.ts`.
- **`useScrolled` threshold** — `src/hooks/useScrolled.ts` defaults to `12`; `Header.tsx` calls `useScrolled(16)` to delay the transparent→solid switch on Home. Don't "fix" the mismatch — it's intentional.
- **`WhatToSee` jump nav** — uses `<Link to="/what-to-see#id">` (not plain `<a href="#id">`) to preserve HashRouter route; plain `#id` would replace hash and route to NotFound.

## Conventions

- **Routing:** `App.tsx` is the only route table — 16 `Route` entries (15 content paths + `*` NotFound) covering 10 pages, with 6 legacy alias paths in 5 groups (`/about`↔`/about-blessed-stanley-rother`, `/what-to-see`↔`/grounds-art-architecture`, `/pilgrimage`↔`/visit-planning`↔`/hours-location`, `/news-events`↔`/news-and-events`, `/give`↔`/shrinegift`) and 4 hash anchors (`#pilgrim-center`, `#shrine-church`, `#tepeyac-hill`, `#visit`). Nav is driven by `src/data/nav.ts` — update there, `Header`/`Footer` render from it.
- **Data:** `src/data/content.ts` is the data layer (`lifeTimeline`, `whatToSee`, `faqs`, `upcomingEvents`, `givingOptions` with typed interfaces + `images` object). `src/data/site.ts` is the canonical single source for address/hours (5 keys: `grounds/shrineChurch/chapelOfTomb/giftShop/museum`) /mass/contact/mapsUrl/mapsEmbedSrc — Footer + Pilgrimage consume it, don't duplicate. Pages render from data — don't inline copy.
- **Components:** `Button` (discriminated `to`/`href`/native `button` + `icon`; variants `primary|secondary|ghost|outline-light`), `Container` (`max-w-7xl px-5 sm:px-8`), `SectionHeading` (`eyebrow/title/description` + `align/light` + line), `PageHero` (`compact?`, `bg-grain` + dual gradients), `Reveal` (`delay`/`as`), `Accordion` (single-open), `Timeline` (left rail), `SafeImage` (`src` + `fallback` + `alt` + `loading`; always via `cn()`). Extend via `cn()`, not ad-hoc class strings.
- **Styling:** Use `shrine-cream/parchment(+dark)/stone/ink/charcoal/maroon-*/gold-*/pine-*/terracotta-*` + `shadow-shrine`/`shadow-shrine-lg` + utilities `text-balance` / `bg-adobe-texture` / `bg-grain` / `divider-weave`/`divider-weave-thin` / `gold-rule`/`gold-rule-left` / `reveal`+`reveal-visible` / `skip-link` / `mask-fade-b`. Mobile-first (`sm:`/`lg:`).

## Don't

- Switch `HashRouter` → `BrowserRouter`, break alias routes, or prop-drill nav arrays.
- Add one-off hex colors or bypass `cn()` (`tailwind-merge` dedup matters).
- Rebuild `Dialog`/`Dropdown` from scratch if `shadcn/ui` (Radix) is adopted — use its primitives.
- Add SSR, API routes, or a CMS without an explicit architecture decision — this is a static SPA (`CLAUDE.md` isolates future CMS behind `lib/cms`).

## Where to look next

- `CLAUDE.md` — full six-phase workflow, detailed conventions, anti-patterns, env contract, and validation checklist.
- `docs/prompts.md` — intent lineage.
- `src/index.css` — authoritative token list.
