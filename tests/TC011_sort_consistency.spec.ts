import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC011 – Default sort order consistency
 *
 * This test checks that Amazon’s default search sort order remains reasonably
 * consistent across repeated searches. It performs the same search twice and
 * compares the top 5 product titles from each run to ensure a minimum level
 * of result stability
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Perform a search for a valid product term (e.g., coffee mug)
 * 3. Capture the top 5 product titles from the first run
 * 4. Repeat the entire process (fresh navigation)
 * 5. Capture the top 5 product titles from the second run
 * 6. Compare the two sets:
 *    - Ensure both runs returned the same number of titles
 *    - Ensure at least 1 out of 5 titles appear in both runs
 */

test.describe("TC011, Default sort order consistency", () => {
  test("TC011,  Top 5 results remain consistent across two runs", async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const resultsPage = new SearchResultsPage(page);
    const searchTerm = testData.validProducts.coffeeMug;

    // Run 1
    await homePage.goto();
    await homePage.searchForItem(searchTerm);
    await resultsPage.waitForResults();
    const firstRunTitles = await resultsPage.getTopProductTitles(5);

    // Run 2 (fresh)
    await homePage.goto();
    await homePage.searchForItem(searchTerm);
    await resultsPage.waitForResults();
    const secondRunTitles = await resultsPage.getTopProductTitles(5);

    LoggerUtility.info(`TC011, First run titles: ${JSON.stringify(firstRunTitles)}`);
    LoggerUtility.info(`TC011, Second run titles: ${JSON.stringify(secondRunTitles)}`);

    // Expect at least 1 titles to overlap
    expect(firstRunTitles.length).toBe(secondRunTitles.length);
    const overlap = firstRunTitles.filter((title) => secondRunTitles.includes(title)).length;
    expect(overlap).toBeGreaterThanOrEqual(1);
  });
});
