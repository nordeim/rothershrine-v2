import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Button } from "@/components/ui/Button";

function withRouter(ui: React.ReactNode) {
  return <MemoryRouter>{ui}</MemoryRouter>;
}

describe("Button", () => {
  it("renders primary variant Link when `to` is provided", () => {
    render(withRouter(<Button to="/pilgrimage">Plan Visit</Button>));
    const link = screen.getByRole("link", { name: /plan visit/i });
    expect(link).toHaveAttribute("href", "/pilgrimage");
    expect(link.className).toContain("bg-shrine-gold-500");
  });

  it("renders anchor when `href` is provided", () => {
    render(withRouter(<Button href="https://example.com">External</Button>));
    const anchor = screen.getByRole("link", { name: /external/i });
    expect(anchor).toHaveAttribute("href", "https://example.com");
  });

  it("renders native button when neither `to` nor `href`", () => {
    render(withRouter(<Button>Click Me</Button>));
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies secondary variant classes", () => {
    render(withRouter(<Button variant="secondary">Secondary</Button>));
    expect(screen.getByRole("button").className).toContain("bg-shrine-maroon-600");
  });

  it("renders icon when provided", () => {
    render(withRouter(<Button icon={<span data-testid="icon">★</span>}>With Icon</Button>));
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("merges custom className via cn()", () => {
    render(withRouter(<Button className="mt-8">Custom</Button>));
    expect(screen.getByRole("button").className).toContain("mt-8");
  });
});
