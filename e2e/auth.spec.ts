import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://jat-mu.vercel.app/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("you@example.com").click();
  await page
    .getByPlaceholder("you@example.com")
    .fill("rolixi1139@shanreto.com");
  await page.getByPlaceholder("••••••••").click();
});

test("login success", async ({ page }) => {
  await page.getByPlaceholder("••••••••").fill("7^tUqT#$J9Xy");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole("navigation")).toContainText(
    "Hey, rolixi1139@shanreto.com"
  );
});

test("login failed", async ({ page }) => {
  await page.getByPlaceholder("••••••••").fill("wrong password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole("paragraph")).toContainText(
    "Could not authenticate user"
  );
});
