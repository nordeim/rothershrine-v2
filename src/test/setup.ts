import "@testing-library/jest-dom/vitest";

// jsdom lacks IntersectionObserver — mock for Reveal.tsx and other scroll-reveal usage
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (!("IntersectionObserver" in globalThis)) {
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

// jsdom ships a throwing stub for window.scrollTo ("Not implemented") — the
// conditional guard `if (!window.scrollTo)` never fires. Unconditionally
// define so any test calling scrollTo without a per-test spy does not throw.
// matchMedia is intentionally not stubbed globally (jsdom lacks it) — per-suite
// stubs in BackToTop.test.tsx cover `prefers-reduced-motion` branching.
Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true, configurable: true });
Object.defineProperty(Element.prototype, "scrollIntoView", { value: () => {}, writable: true, configurable: true });
