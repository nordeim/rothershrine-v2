import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Give } from "@/pages/Give";

/**
 * Contrast guard for dark-band headings.
 *
 * The global `h1-h4 { text-shrine-maroon-700 }` rule in index.css beats color
 * inheritance, so any heading inside a `bg-shrine-maroon-9*` section MUST opt
 * out with an explicit `text-shrine-cream` class or it renders ~1.3:1 on the
 * dark band (invisible). PageHero/NotFound already opt out; these tests lock
 * Home and Give to the same contract.
 *
 * These are fast class-presence guards — the computed-color proof is in
 * e2e/smoke.spec.ts `toHaveCSS("color","rgb(250, 246, 236)")` which verifies
 * the cascade actually resolves cream over the global rule on the rendered DOM.
 */
describe("dark-band heading contrast contract", () => {
  it("Home hero h1 carries an explicit cream text color", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    const h1 = document.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.className).toMatch(/text-shrine-cream/);
  });

  it("Home CTA band h2 carries an explicit cream text color", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    const h2 = [...document.querySelectorAll("h2")].find((el) =>
      /Admission is free/i.test(el.textContent ?? ""),
    );
    expect(h2).toBeDefined();
    expect(h2?.className).toMatch(/text-shrine-cream/);
  });

  it("Give CTA band h2 carries an explicit cream text color", () => {
    render(
      <MemoryRouter>
        <Give />
      </MemoryRouter>,
    );
    const h2 = [...document.querySelectorAll("h2")].find((el) =>
      /gift of any size/i.test(el.textContent ?? ""),
    );
    expect(h2).toBeDefined();
    expect(h2?.className).toMatch(/text-shrine-cream/);
  });

  it("Home hero eyebrow/h1/lede/CTA row are staged with rise-in", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    const h1 = document.querySelector("h1");
    expect(h1?.className).toMatch(/rise-in/);
  });
});
