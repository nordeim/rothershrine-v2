import { describe, expect, it } from "vitest";
import { faqs, givingOptions, lifeTimeline, upcomingEvents, whatToSee } from "@/data/content";

describe("content", () => {
  it("lifeTimeline has 8 entries with year, title, description", () => {
    expect(lifeTimeline).toHaveLength(8);
    for (const entry of lifeTimeline) {
      expect(entry.year.length).toBeGreaterThan(0);
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(20);
    }
  });

  it("whatToSee has 3 sections each with required imageAlt and details", () => {
    expect(whatToSee).toHaveLength(3);
    expect(whatToSee.map((s) => s.id)).toEqual(["pilgrim-center", "shrine-church", "tepeyac-hill"]);
    for (const section of whatToSee) {
      expect(section.image.length).toBeGreaterThan(0);
      expect(section.imageAlt.length).toBeGreaterThan(0);
      expect(section.details.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("faqs has 6 entries with question and answer", () => {
    expect(faqs).toHaveLength(6);
    for (const faq of faqs) {
      expect(faq.question.endsWith("?")).toBe(true);
      expect(faq.answer.length).toBeGreaterThan(20);
    }
  });

  it("upcomingEvents has 4 entries each with category", () => {
    expect(upcomingEvents).toHaveLength(4);
    const categories = new Set(upcomingEvents.map((e) => e.category));
    expect(categories).toEqual(new Set(["Feast", "Pilgrimage", "Formation", "Community"]));
    for (const event of upcomingEvents) {
      expect(event.title.length).toBeGreaterThan(0);
      expect(event.location.length).toBeGreaterThan(0);
    }
  });

  it("givingOptions has 8 entries each with name and icon", () => {
    expect(givingOptions).toHaveLength(8);
    const icons = givingOptions.map((g) => g.icon);
    expect(icons).toContain("flame");
    expect(icons).toContain("globe");
    for (const option of givingOptions) {
      expect(option.name.length).toBeGreaterThan(0);
      expect(option.description.length).toBeGreaterThan(20);
    }
  });
});
