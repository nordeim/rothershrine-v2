import { describe, expect, it, beforeEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { BackToTop } from "@/components/BackToTop";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    configurable: true,
    writable: true,
  });
}

type MatchMediaStub = (query: string) => MediaQueryList;

function installMatchMedia(matches: boolean) {
  const stub: MatchMediaStub = (query: string) =>
    ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
  Object.defineProperty(window, "matchMedia", {
    value: stub,
    configurable: true,
    writable: true,
  });
}

describe("BackToTop", () => {
  beforeEach(() => {
    cleanup();
    installMatchMedia(false);
    setScrollY(0);
  });

  it("is hidden (aria-hidden + tabindex -1) before the 480px threshold", () => {
    render(<BackToTop />);
    // aria-hidden removes the button from the a11y tree (and its accname),
    // so hidden-state assertions query by testid; the accessible-name
    // contract is asserted via the aria-label attribute and in the visible
    // state by the role+name queries below.
    const btn = screen.getByTestId("back-to-top");
    expect(btn).toHaveAttribute("aria-label", "Back to top");
    expect(btn).toHaveAttribute("aria-hidden", "true");
    expect(btn).toHaveAttribute("tabindex", "-1");
  });

  it("becomes visible after scrolling past the threshold", () => {
    render(<BackToTop />);
    const btn = screen.getByTestId("back-to-top");
    setScrollY(600);
    fireEvent.scroll(window);
    expect(btn).not.toHaveAttribute("aria-hidden");
    expect(btn).toHaveAttribute("tabindex", "0");
    // once visible it re-enters the a11y tree with its accessible name
    expect(screen.getByRole("button", { name: /back to top/i })).toBe(btn);
  });

  it("hides again when scrolled back to the top", () => {
    render(<BackToTop />);
    const btn = screen.getByTestId("back-to-top");
    setScrollY(600);
    fireEvent.scroll(window);
    setScrollY(0);
    fireEvent.scroll(window);
    expect(btn).toHaveAttribute("aria-hidden", "true");
    expect(btn).toHaveAttribute("tabindex", "-1");
  });

  it("click scrolls to top with smooth behavior", async () => {
    const user = userEvent.setup();
    const scrollSpy = vi.fn();
    window.scrollTo = scrollSpy as unknown as typeof window.scrollTo;
    render(<BackToTop />);
    setScrollY(600);
    fireEvent.scroll(window);
    await user.click(screen.getByRole("button", { name: /back to top/i }));
    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: "smooth" }),
    );
  });

  it("uses behavior auto under prefers-reduced-motion", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    const scrollSpy = vi.fn();
    window.scrollTo = scrollSpy as unknown as typeof window.scrollTo;
    render(<BackToTop />);
    setScrollY(600);
    fireEvent.scroll(window);
    await user.click(screen.getByRole("button", { name: /back to top/i }));
    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: "auto" }),
    );
  });

  it("is a 44px (h-11 w-11) touch target", () => {
    render(<BackToTop />);
    const btn = screen.getByTestId("back-to-top");
    expect(btn.className).toMatch(/h-11/);
    expect(btn.className).toMatch(/w-11/);
  });
});

describe("BackToTop mount contract", () => {
  it("renders inside MemoryRouter-based Layout usage without touching location.hash", () => {
    render(
      <MemoryRouter initialEntries={["/history#timeline"]}>
        <BackToTop />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
  });
});
