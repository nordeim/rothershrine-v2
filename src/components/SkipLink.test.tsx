import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkipLink } from "@/components/SkipLink";

/**
 * Regression tests for the HashRouter skip-link contract.
 *
 * Under HashRouter the URL hash IS the route, so a native
 * `<a href="#main-content">` activation would rewrite the hash to
 * `#main-content` and route the user to NotFound. The component must
 * preventDefault and move focus imperatively instead.
 */
describe("SkipLink", () => {
  it("renders a skip link targeting #main-content", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("activation keeps the current route (does not rewrite the hash)", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SkipLink />
        <main id="main-content" tabIndex={-1}>
          Shrine content
        </main>
      </div>,
    );
    window.location.hash = "#/about-blessed-stanley-rother";
    await user.click(screen.getByRole("link", { name: /skip to main content/i }));
    expect(window.location.hash).toBe("#/about-blessed-stanley-rother");
  });

  it("activation moves focus to the main content landmark", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SkipLink />
        <main id="main-content" tabIndex={-1}>
          Shrine content
        </main>
      </div>,
    );
    await user.click(screen.getByRole("link", { name: /skip to main content/i }));
    expect(document.getElementById("main-content")).toHaveFocus();
  });
});
