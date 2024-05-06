import { test, expect, type Page } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://jat-mu.vercel.app/");
  await expect(page.locator("h1")).toContainText("Welcome to JobTrack!");
  await expect(page.locator("body")).toContainText(
    "JobTrack is your all-in-one solution for managing your job applications. Whether you're a freelancer, engineer, designer, product manager, or any other professional, JobTrack can help you keep track of your applications, interviews, and offers."
  );
  await expect(page.locator("body")).toContainText(
    "Track ApplicationsEasily track all your job applications in one place."
  );
  await expect(page.locator("body")).toContainText(
    "Stay OrganizedOrganize your applications, interviews, and offers effortlessly."
  );
  await expect(page.locator("body")).toContainText(
    "Customize WorkflowTailor your workflow to suit your unique job search needs."
  );
  await expect(page.locator("body")).toContainText(
    "Get InsightsGain insights into your job search progress and optimize your strategy."
  );
});
