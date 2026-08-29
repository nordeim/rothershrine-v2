import { expect, test } from "@playwright/test";

test.describe("smoke — routing & hash anchors", () => {
  test("home renders hero and quick facts", async ({ page }) => {
    await page.goto("/#/");
    await expect(page.getByRole("heading", { name: /shepherd who stayed/i })).toBeVisible();
    await expect(page.getByText("National Shrine · Oklahoma City").first()).toBeVisible();
    // quick facts grid — labels from Home facts[]
    await expect(page.getByText("Hours", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Feast Day").first()).toBeVisible();
  });

  test("alias routes render same page — /about", async ({ page }) => {
    await page.goto("/#/about");
    await expect(page.getByRole("heading", { name: /Blessed Stanley Rother/i }).first()).toBeVisible();

    await page.goto("/#/about-blessed-stanley-rother");
    await expect(page.getByRole("heading", { name: /Blessed Stanley Rother/i }).first()).toBeVisible();
  });

  test("alias routes — /what-to-see and /grounds-art-architecture", async ({ page }) => {
    await page.goto("/#/what-to-see");
    await expect(page.getByRole("heading", { name: /What to See/i }).first()).toBeVisible();

    await page.goto("/#/grounds-art-architecture");
    await expect(page.getByRole("heading", { name: /What to See/i }).first()).toBeVisible();
    // 3 sections
    await expect(page.locator("#pilgrim-center")).toBeAttached();
    await expect(page.locator("#shrine-church")).toBeAttached();
    await expect(page.locator("#tepeyac-hill")).toBeAttached();
  });

  test("What to See hash anchors are reachable", async ({ page }) => {
    await page.goto("/#/what-to-see");
    // jump nav exists — aria-label is "Jump to a site" in WhatToSee.tsx
    const jumpNav = page.getByRole("navigation", { name: /Jump to/i });
    await expect(jumpNav).toBeVisible();

    // click Pilgrim Center jump link — should update hash (use jump nav, not header dropdown)
    await jumpNav.getByRole("link", { name: "Pilgrim Center" }).click();
    await expect(page).toHaveURL(/#pilgrim-center/);
    await expect(page.locator("#pilgrim-center")).toBeVisible();

    // direct Shrine Church section via hash URL (also test direct deep-link)
    await page.goto("/#/what-to-see#shrine-church");
    await expect(page.locator("#shrine-church")).toBeVisible();
  });

  test("Pilgrimage route and #visit anchor", async ({ page }) => {
    await page.goto("/#/pilgrimage");
    await expect(page.getByRole("heading", { name: /^Pilgrimage$/i })).toBeVisible();

    // alias
    await page.goto("/#/visit-planning");
    await expect(page.getByRole("heading", { name: /^Pilgrimage$/i })).toBeVisible();

    // #visit anchor
    await page.goto("/#/pilgrimage#visit");
    await expect(page.locator("#visit")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Find Us", exact: true })).toBeVisible();
  });

  test("NotFound for unknown route", async ({ page }) => {
    await page.goto("/#/does-not-exist-xyz");
    await expect(page.getByText(/This path does not lead to the shrine/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Return home/i })).toBeVisible();
  });

  test("header mobile drawer opens and closes on navigation", async ({ page }) => {
    // force mobile viewport to expose hamburger
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/#/");

    const toggle = page.getByRole("button", { name: /Open menu|Close menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("button", { name: /Close menu/i })).toBeVisible();

    // drawer should show primary nav links
    await expect(page.getByRole("link", { name: "Pilgrimage" }).first()).toBeVisible();

    // clicking a link should close drawer and navigate
    await page.getByRole("link", { name: "Pilgrimage" }).first().click();
    await expect(page).toHaveURL(/pilgrimage/);
    // toggle should be back to Open
    await expect(page.getByRole("button", { name: /Open menu/i })).toBeVisible();
  });
});

test.describe("smoke — Sacred Motion remediation (contrast, motion, BackToTop)", () => {
  test("hero h1 renders cream on the dark overlay with staged rise-in motion", async ({ page }) => {
    await page.goto("/#/");
    const hero = page.getByRole("heading", { level: 1, name: /shepherd who stayed/i });
    // Guard classes — explicit cream beats the global h1–h4 maroon-700 rule,
    // and rise-in stages the entrance (reduced-motion renders final state).
    await expect(hero).toHaveClass(/rise-in/);
    await expect(hero).toHaveClass(/text-shrine-cream/);
    // Rendered contrast: cream #faf6ec on the maroon-950 photo overlay.
    await expect(hero).toHaveCSS("color", "rgb(250, 246, 236)");
  });

  test("back-to-top appears after deep scroll and returns to top without touching the hash", async ({
    page,
  }) => {
    await page.goto("/#/history");
    // aria-hidden excludes the button from the a11y tree — query by testid
    // while hidden; role+name once it becomes visible.
    const backToTop = page.getByTestId("back-to-top");
    await expect(backToTop).toHaveAttribute("aria-hidden", "true");

    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "auto" }));
    await expect(backToTop).toBeVisible();
    await expect(backToTop).not.toHaveAttribute("aria-hidden");
    await expect(page.getByRole("button", { name: /back to top/i })).toBeVisible();

    await backToTop.click();
    await page.waitForFunction(() => window.scrollY === 0, undefined, { timeout: 5_000 });
    await expect(backToTop).toHaveAttribute("aria-hidden", "true");
    // HashRouter contract: scrolling must never rewrite the route hash.
    await expect(page).toHaveURL(/#\/history/);
  });

  test("home event rows use a bordered gold category chip", async ({ page }) => {
    await page.goto("/#/");
    const chip = page.getByText("Feast", { exact: true }).first();
    await expect(chip).toBeVisible();
    await expect(chip).toHaveClass(/border/);
    await expect(chip).toHaveClass(/uppercase/);
  });
});
