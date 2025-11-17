import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC002_B_C – Search input edge cases (data-driven)
 *
 * This test verifies that Amazon can safely handle multiple types of invalid
 * search inputs without crashing, redirecting to an error page, or breaking UI
 * rendering 
 *
 * Steps:
 * 1. Iterate through every invalid search term from the test data file
 * 2. Navigate to the Amazon homepage before each search
 * 3. Perform a search using the invalid input
 * 4. Capture the resulting page URL and fallback messaging
 */
test.describe("TC002, Search input edge cases (data-driven)", () => {
  const invalidTerms = Object.values(testData.invalidProducts);

  test("TC002, @smoke Invalid search terms should not break Amazon", async ({ page }) => {
    const homePage = new AmazonHomePage(page);

    for (const term of invalidTerms) {
      LoggerUtility.divider();
      LoggerUtility.info(`Testing invalid search term: "${term}"`);
      LoggerUtility.divider();

      // Navigate to home page before each search
      await homePage.goto();
      LoggerUtility.info(`Performing search for invalid term: "${term}"`);
      await homePage.searchForItem(term);

      const url = page.url();
      LoggerUtility.info(`URL after search: ${url}`);

      // Attempt to get the message, if it exists
      const safeText = await homePage.getCheckOtherOptionsMessage?.().catch(() => "");

      expect(url.toLowerCase()).not.toContain("error");
      expect(safeText?.toLowerCase()).toContain("other buying option");

      LoggerUtility.info(`Search with "${term}" produced a stable, safe no-results page.`);
    }
  });
});
