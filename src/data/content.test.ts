import { describe, expect, it } from "vitest";
import { faqs, givingOptions, lifeTimeline, upcomingEvents, whatToSee } from "@/data/content";

describe("content data invariants", () => {
  it("lifeTimeline has 8 entries with required fields", () => {
    expect(lifeTimeline).toHaveLength(8);
    lifeTimeline.forEach((entry) => {
      expect(entry.year).toBeTruthy();
      expect(entry.title).toBeTruthy();
      expect(entry.description.length).toBeGreaterThan(20);
    });
    // chronological anchors
    expect(lifeTimeline[0].year).toBe("1935");
    expect(lifeTimeline[lifeTimeline.length - 1].year).toBe("2023");
  });

  it("whatToSee has 3 sections with hash-stable ids and required imageAlt", () => {
    expect(whatToSee).toHaveLength(3);
    const ids = whatToSee.map((s) => s.id);
    expect(ids).toEqual(["pilgrim-center", "shrine-church", "tepeyac-hill"]);
    whatToSee.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.summary.length).toBeGreaterThan(20);
      expect(section.details.length).toBeGreaterThanOrEqual(3);
      expect(section.image).toMatch(/^https?:\/\//);
      expect(section.imageAlt).toBeTruthy(); // a11y: required
    });
  });

  it("faqs has 6 items", () => {
    expect(faqs).toHaveLength(6);
    faqs.forEach((faq) => {
      expect(faq.question.endsWith("?")).toBe(true);
      expect(faq.answer.length).toBeGreaterThan(20);
    });
  });

  it("upcomingEvents has 4 items with valid category enum", () => {
    expect(upcomingEvents).toHaveLength(4);
    const valid: Array<(typeof upcomingEvents)[number]["category"]> = [
      "Feast",
      "Pilgrimage",
      "Formation",
      "Community",
    ];
    upcomingEvents.forEach((event) => {
      expect(event.date).toBeTruthy();
      expect(event.title).toBeTruthy();
      expect(event.location).toBeTruthy();
      expect(event.description.length).toBeGreaterThan(20);
      expect(valid).toContain(event.category);
    });
  });

  it("givingOptions has 8 items with valid icon enum and unique names", () => {
    expect(givingOptions).toHaveLength(8);
    const validIcons = new Set(["flame", "church", "sprout", "heart", "book", "hand-heart", "landmark", "globe"]);
    const names = givingOptions.map((o) => o.name);
    expect(new Set(names).size).toBe(8);
    givingOptions.forEach((option) => {
      expect(option.name).toBeTruthy();
      expect(option.description.length).toBeGreaterThan(10);
      expect(validIcons.has(option.icon)).toBe(true);
    });
  });
});
