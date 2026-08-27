import { describe, expect, it } from "vitest";
import { site } from "@/data/site";

describe("site invariants", () => {
  it("has canonical Oklahoma City address", () => {
    expect(site.address.street).toBe("13300 N Kelley Ave");
    expect(site.address.city).toBe("Oklahoma City");
    expect(site.address.state).toBe("OK");
    expect(site.address.zip).toBe("73131");
    expect(site.address.full).toContain("73131");
    expect(site.address.query).toBe(encodeURIComponent(site.address.full));
  });

  it("exposes valid maps URLs", () => {
    expect(site.mapsUrl).toMatch(/^https:\/\/www\.google\.com\/maps/);
    expect(site.mapsEmbedSrc).toMatch(/google\.com\/maps/);
    expect(site.mapsUrl).toContain(encodeURIComponent("13300"));
  });

  it("has contact emails", () => {
    expect(site.contact.email).toMatch(/@/);
    expect(site.contact.pilgrimageEmail).toMatch(/pilgrimage@/);
    expect(site.contact.volunteerEmail).toMatch(/volunteer@/);
  });

  it("has hours for all venues", () => {
    expect(site.hours.grounds).toBeTruthy();
    expect(site.hours.shrineChurch).toBeTruthy();
    expect(site.hours.chapelOfTomb).toBeTruthy();
    expect(site.hours.giftShop).toBeTruthy();
  });
});
