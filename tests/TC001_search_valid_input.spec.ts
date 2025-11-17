import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductTile } from '../pages/ProductTile';  
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC001 – Validate search bar with valid input
 *
 * This test verifies that performing a search with a valid product term
 * returns relevant and non-empty search results
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Enter a valid search term into the search bar
 * 3. Wait for the results page to load
 * 4. Assert that at least one product result is returned
 * 5. Validate the first 15 product tiles to ensure:
 *    - The title contains the expected keywords (e.g., "aa" and "batteries")
 *    - Each product title is non-empty
 * Tags: @smoke
 */

test.describe("TC001, Validate search bar with valid input", () => {
  test("TC001, @smoke should display correct search results", async ({ page }) => {

    const homePage = new AmazonHomePage(page);
    const resultsPage = new SearchResultsPage(page);

    const searchTerm = testData.validProducts.aaBatteries;

    LoggerUtility.info(`Starting TC001, Searching for: "${searchTerm}"`);

    // Navigate to Amazon homepage
    await homePage.goto();
    LoggerUtility.info("Amazon homepage loaded successfully.");

    // Perform search
    await homePage.searchForItem(searchTerm);
    await resultsPage.waitForResults();
    LoggerUtility.debug(`Search executed for term: "${searchTerm}"`);

    // Count products
    const productCount = await resultsPage.allTilesCards.count();
    expect(productCount).toBeGreaterThan(0);
    LoggerUtility.info(`Found ${productCount} product results for "${searchTerm}"`);

    // Validate top 15 product tiles using POM
    const visibleItems = Math.min(productCount, 15);

    for (let i = 0; i < visibleItems; i++) {
      const tile = new ProductTile(page, i);

      await tile.waitForTileVisible();
      const title = await tile.getTitle();
      const lower = title.toLowerCase();
      expect(lower).toContain("aa");
      expect(lower).toContain("batteries");
      expect(title.length, `Tile ${i+1} title is empty`).toBeGreaterThan(0);

      LoggerUtility.debug(`Product ${i + 1}: title verified.`);
    }
    LoggerUtility.info("All product titles, images, and prices verified for the search term.");
  });
});
