import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC010 – Currency consistency (USD)
 *
 * This test verifies that Amazon displays product prices in USD when searching
 * under a U.S. locale or ZIP code. It inspects the price text from multiple
 * product tiles to confirm the presence of the "$" currency symbol
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Perform a search using a valid product term "wireless mouse"
 * 3. Wait for the search results to load
 * 4. Retrieve the total number of products shown in the DOM
 * 5. Inspect up to the first 20 product tiles:
 *    - Extract the raw price from each tile
 *    - Count how many prices include the "$" symbol
 * 6. Validate that at least 80% of product displays pricing in USD
 */

test.describe("TC010, Currency consistency (USD)", () => {
  test("TC010, Prices show in USD for US locale / ZIP", async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const resultsPage = new SearchResultsPage(page);

    const searchTerm = testData.validProducts.wirelessMouse;

    await homePage.goto(); 
   
    await homePage.searchForItem(searchTerm);
    await resultsPage.waitForResults();

    const count = await resultsPage.getProductCountFromDOM();
    const limit = Math.min(count, 20);

    let usdCount = 0;

    for (let i = 0; i < limit; i++) {
      const { priceRaw } = await resultsPage.extractItemInfo(i);
      if (priceRaw && priceRaw.includes("$")) {
        usdCount++;
      }
    }

    LoggerUtility.info(`TC010, USD price count: ${usdCount}/${limit}`);
    const ratio = usdCount / limit;
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });
});