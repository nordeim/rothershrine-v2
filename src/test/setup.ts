import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollTo / IntersectionObserver used by Layout/Reveal
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

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

if (!window.IntersectionObserver) {
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
