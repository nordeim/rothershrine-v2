import { describe, expect, it } from "vitest";
import { cn } from "@/utils/cn";

describe("cn", () => {
  it("merges plain class strings", () => {
    expect(cn("px-3", "py-2")).toBe("px-3 py-2");
  });

  it("deduplicates conflicting Tailwind utilities via tailwind-merge", () => {
    // twMerge should keep the last conflicting class
    expect(cn("px-3", "px-6")).toBe("px-6");
    expect(cn("bg-shrine-cream", "bg-shrine-parchment")).toBe("bg-shrine-parchment");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("handles conditional and falsy values via clsx", () => {
    const showHidden = false;
    const showActive = true;
    expect(cn("base", showHidden && "hidden", undefined, null, "visible")).toBe("base visible");
    expect(cn("base", showActive && "active")).toBe("base active");
  });

  it("handles object syntax", () => {
    expect(cn({ "bg-shrine-cream": true, "hidden": false })).toBe("bg-shrine-cream");
  });

  it("handles arrays and mixed inputs", () => {
    expect(cn(["px-3", "py-2"], "mt-4")).toBe("px-3 py-2 mt-4");
  });
});
