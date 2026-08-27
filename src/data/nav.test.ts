import { describe, expect, it } from "vitest";
import { footerNav, primaryNav } from "@/data/nav";

describe("nav data invariants", () => {
  it("primaryNav has 6 items with required fields", () => {
    expect(primaryNav).toHaveLength(6);
    primaryNav.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.to).toMatch(/^\//);
    });
  });

  it("primaryNav children carry descriptions", () => {
    const withChildren = primaryNav.filter((n) => n.children && n.children.length > 0);
    expect(withChildren.length).toBe(2); // About + What to See
    withChildren.forEach((parent) => {
      parent.children!.forEach((child) => {
        expect(child.label).toBeTruthy();
        expect(child.to).toMatch(/^\//);
        expect(typeof child.description).toBe("string");
        expect(child.description!.length).toBeGreaterThan(0);
      });
    });
  });

  it("What to See children are hash-anchored", () => {
    const whatToSee = primaryNav.find((n) => n.label === "What to See");
    expect(whatToSee).toBeDefined();
    const hashes = whatToSee!.children!.map((c) => c.to);
    expect(hashes).toEqual([
      "/what-to-see#pilgrim-center",
      "/what-to-see#shrine-church",
      "/what-to-see#tepeyac-hill",
    ]);
  });

  it("footerNav has 10 items covering all site sections", () => {
    expect(footerNav).toHaveLength(10);
    const labels = footerNav.map((n) => n.label);
    expect(labels).toContain("Give");
    expect(labels).toContain("Pilgrim Center");
    expect(labels).toContain("FAQ");
  });

  it("all nav `to` values are hash-router compatible (start with /)", () => {
    [...primaryNav, ...footerNav].forEach((item) => {
      // primaryNav items may have children, but parent `to` must still be /
      expect(item.to.startsWith("/")).toBe(true);
    });
    primaryNav
      .flatMap((n) => n.children ?? [])
      .forEach((child) => {
        expect(child.to.startsWith("/")).toBe(true);
      });
  });

  it("no duplicate `to` values in footerNav", () => {
    const tos = footerNav.map((n) => n.to);
    expect(new Set(tos).size).toBe(tos.length);
  });
});
