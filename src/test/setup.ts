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

// jsdom lacks window.scrollTo — stub to avoid Layout/PageHero errors in tests
if (!window.scrollTo) {
  window.scrollTo = () => {};
}
