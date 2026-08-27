import { describe, expect, it } from "vitest";
import { footerNav, primaryNav } from "@/data/nav";

describe("nav", () => {
  it("primaryNav has 6 top-level items", () => {
    expect(primaryNav).toHaveLength(6);
  });

  it("exactly 2 primaryNav items have children with descriptions", () => {
    const withChildren = primaryNav.filter((item) => item.children && item.children.length > 0);
    expect(withChildren).toHaveLength(2);
    for (const item of withChildren) {
      for (const child of item.children!) {
        expect(child.description).toBeDefined();
        expect(child.description!.length).toBeGreaterThan(0);
      }
    }
  });

  it("all nav links have label and to", () => {
    for (const item of primaryNav) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.to.length).toBeGreaterThan(0);
      if (item.children) {
        for (const child of item.children) {
          expect(child.label.length).toBeGreaterThan(0);
          expect(child.to.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("hash anchors are preserved for What to See children", () => {
    const whatToSee = primaryNav.find((n) => n.label === "What to See");
    expect(whatToSee).toBeDefined();
    const hashes = whatToSee!.children!.map((c) => c.to);
    expect(hashes).toEqual([
      "/what-to-see#pilgrim-center",
      "/what-to-see#shrine-church",
      "/what-to-see#tepeyac-hill",
    ]);
  });

  it("footerNav has 10 links", () => {
    expect(footerNav).toHaveLength(10);
  });

  it("footerNav covers all major site areas", () => {
    const labels = footerNav.map((l) => l.label);
    expect(labels).toContain("Give");
    expect(labels).toContain("FAQ");
    expect(labels).toContain("Tepeyac Hill");
  });
});
