import { expect, test } from "@playwright/test";

test.describe("Give + FAQ + Pilgrimage journeys", () => {
  test("Give alias routes both show 8 options and external Give link", async ({ page }) => {
    await page.goto("/#/give");
    await expect(page.getByRole("heading", { name: /^Give$/i }).first()).toBeVisible();
    await expect(page.getByText("Apla's Circle")).toBeVisible();
    await expect(page.getByRole("heading", { name: "General Fund" })).toBeVisible();

    // 8 giving options
    await expect(page.getByText("Pipe Organ Campaign")).toBeVisible();
    await expect(page.getByText("Legacy & Planned Giving")).toBeVisible();

    const external = page.getByRole("link", { name: /Give Online Now/i });
    await expect(external).toBeVisible();
    await expect(external).toHaveAttribute("href", "https://www.rothershrine.org/give");

    // Alias
    await page.goto("/#/shrinegift");
    await expect(page.getByRole("heading", { name: /^Give$/i }).first()).toBeVisible();
    await expect(page.getByText("Tepeyac Hill Gardens")).toBeVisible();
  });

  test("FAQ accordion single-open with aria", async ({ page }) => {
    await page.goto("/#/faq");
    await expect(page.getByRole("heading", { name: /Frequently Asked Questions/i })).toBeVisible();

    const firstQuestion = page.getByRole("button", { name: /Is the Shrine open to the public/i });
    const secondQuestion = page.getByRole("button", { name: /Is there a cost to visit/i });

    await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(secondQuestion).toHaveAttribute("aria-expanded", "false");

    // Click second — first should close, second open (single-open)
    await secondQuestion.click();
    await expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");

    // FAQ has mailto
    await expect(page.getByRole("link", { name: /Ask the Pilgrimage Office/i })).toHaveAttribute("href", /mailto:info@rothershrine\.org/);
  });

  test("Pilgrimage group steps and mailto", async ({ page }) => {
    await page.goto("/#/pilgrimage");
    await expect(page.getByRole("heading", { name: /^Pilgrimage$/i })).toBeVisible();
    await expect(page.getByText("Reserve a date")).toBeVisible();
    await expect(page.getByText("Choose your experience")).toBeVisible();
    await expect(page.getByText("Arrive and check in")).toBeVisible();

    // mailto for groups
    const mailto = page.getByRole("link", { name: /pilgrimage@rothershrine\.org/i });
    await expect(mailto).toBeVisible();
    await expect(mailto).toHaveAttribute("href", "mailto:pilgrimage@rothershrine.org");

    // Find Us card
    await expect(page.getByRole("heading", { name: "Find Us", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Get Directions/i })).toHaveAttribute("href", /google\.com\/maps/);
  });

  test("Footer Give link from home navigates to /give", async ({ page }) => {
    await page.goto("/#/");

    // Footer Get involved → Give
    await page.getByRole("navigation", { name: "Get involved" }).getByRole("link", { name: /^Give$/ }).click();
    await expect(page).toHaveURL(/#\/give/);
    await expect(page.getByText("Eight ways to support the mission")).toBeVisible();
  });
});
