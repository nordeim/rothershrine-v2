import { act } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SafeImage } from "@/components/SafeImage";

describe("SafeImage", () => {
  it("renders with fallback and lazy loading by default", () => {
    render(<SafeImage src="https://example.com/a.jpg" alt="test alt" />);
    const img = screen.getByAltText("test alt") as HTMLImageElement;
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("src")).toContain("example.com");
  });

  it("starts hidden (opacity-0) and fades in on load", async () => {
    const { container } = render(<SafeImage src="https://example.com/b.jpg" alt="fade test" />);
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.className).toContain("opacity-0");
    await act(async () => {
      img.dispatchEvent(new Event("load"));
    });
    expect(img.className).toContain("opacity-100");
  });

  it("falls back to local image on error", async () => {
    const { container } = render(
      <SafeImage src="https://example.com/broken.jpg" fallback="/images/hero-shrine.jpg" alt="fallback test" />,
    );
    const img = container.querySelector("img") as HTMLImageElement;
    await act(async () => {
      img.dispatchEvent(new Event("error"));
    });
    expect(img.getAttribute("src")).toBe("/images/hero-shrine.jpg");
  });
});
