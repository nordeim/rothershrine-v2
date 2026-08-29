import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "@/components/Header";

function renderHeaderAt(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Header />
    </MemoryRouter>,
  );
}

describe("Header current-page contract", () => {
  it("marks the active top-level link with aria-current=page", () => {
    renderHeaderAt("/pilgrimage");
    const link = screen.getByRole("link", { name: "Pilgrimage" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("leaves aria-current off inactive top-level links", () => {
    renderHeaderAt("/pilgrimage");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("marks a dropdown parent with aria-current=true when a child route is active", () => {
    renderHeaderAt("/history");
    const about = screen.getByRole("button", { name: /About/ });
    expect(about).toHaveAttribute("aria-current", "true");
  });

  it("keeps the hamburger at the 44px touch target (h-11 w-11)", () => {
    renderHeaderAt("/");
    const burger = screen.getByRole("button", { name: /open menu/i });
    expect(burger.className).toMatch(/h-11/);
    expect(burger.className).toMatch(/w-11/);
  });
});
