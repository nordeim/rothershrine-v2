import { describe, expect, it } from "vitest";
import { site } from "@/data/site";

describe("site", () => {
  it("has canonical address", () => {
    expect(site.address.street).toBe("700 SE 89th St");
    expect(site.address.city).toBe("Oklahoma City");
    expect(site.address.state).toBe("OK");
    expect(site.address.zip).toBe("73149");
    expect(site.address.full).toContain("700 SE 89th St");
    expect(site.address.query).toBe(encodeURIComponent(site.address.full));
  });

  it("has maps URLs", () => {
    expect(site.mapsUrl).toMatch(/^https:\/\/www\.google\.com\/maps/);
    expect(site.mapsEmbedSrc).toMatch(/google\.com\/maps/);
  });

  it("has contact emails and phone", () => {
    expect(site.contact.email).toMatch(/@rothershrine\.org$/);
    expect(site.contact.pilgrimageEmail).toMatch(/@rothershrine\.org$/);
    expect(site.contact.volunteerEmail).toMatch(/@rothershrine\.org$/);
    expect(site.contact.phone).toMatch(/\(405\)/);
  });

  it("has hours for all venues", () => {
    expect(site.hours.grounds).toBeDefined();
    expect(site.hours.shrineChurch).toBeDefined();
    expect(site.hours.chapelOfTomb).toBeDefined();
    expect(site.hours.giftShop).toBeDefined();
    expect(site.hours.museum).toBeDefined();
  });
});
