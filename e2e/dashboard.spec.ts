import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://jat-mu.vercel.app/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("you@example.com").click();
  await page
    .getByPlaceholder("you@example.com")
    .fill("rolixi1139@shanreto.com");
  await page.getByPlaceholder("••••••••").click();
  await page.getByPlaceholder("••••••••").fill("7^tUqT#$J9Xy");
  await page.getByRole("button", { name: "Sign In" }).click();
});

test("add and delete job application", async ({ page }) => {
  await page.getByTestId("positionDialogButton").click();
  await page.getByLabel("Company Name").fill("Linkedin");
  await page.getByText("Job titleJob title where you").click();
  await page.getByLabel("Job title").fill("Software Engineer");
  await page.getByLabel("Location").click();
  await page.getByLabel("Location").fill("EU");
  await page.getByLabel("Recruiter contact").click();
  await page.getByLabel("Recruiter contact").fill("John Doe");
  await page.getByPlaceholder("free to write notes,").click();
  await page
    .getByPlaceholder("free to write notes,")
    .fill("Work with aws, graphql, react and nodejs");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.locator("tbody")).toContainText("Linkedin");
  await expect(
    page.getByRole("cell", { name: "Software Engineer" })
  ).toBeVisible();
  await page.getByLabel("Select row").first().click();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(
    page.getByRole("cell", { name: "Software Engineer" })
  ).not.toBeVisible();
});

test("hide column from table", async ({ page }) => {
  await expect(page.locator("thead")).toContainText("Position url");
  await page.getByRole("button", { name: "Columns" }).click();
  await page.getByRole("menuitemcheckbox", { name: "positionUrl" }).click();
  await expect(page.locator("thead")).not.toContainText("Position url");
});
