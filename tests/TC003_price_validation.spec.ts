import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { LoggerUtility } from '../utils/LoggerUtility';
import { PriceUtils } from '../utils/PriceUtils';
import testData from '../test_data/data.json';
import { ProductTile } from '../pages/ProductTile';

/**
 * TC003 – Missing or malformed price handling
 *
 * This test verifies Amazon’s ability to display product price information correctly
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Search for a valid product term  toothbrush
 * 3. Wait for search results to load and count all product tiles
 * 4. For each product tile:
 *    - Attempt to retrieve the price
 *    - If the price is missing, treat it as acceptable and continue
 *    - If a price is present, validate it using currency parsing logic
 *    - Track malformed prices separately
 * 5. Calculate the percentage of valid price formats across all tiles
 * Threshold:
 * - ≥ 70% of prices must be valid
 */
test.describe("TC003, Missing or malformed price handling", () => {
  test("TC003, Detect bad price formats but ignore missing prices", async ({ page }) => {

    const homePage = new AmazonHomePage(page);
    const resultsPage = new SearchResultsPage(page);

    const searchTerm = testData.validProducts.toothbrush;
    LoggerUtility.startTest(`TC003 - Searching for: "${searchTerm}"`);

    await homePage.goto();
    await homePage.searchForItem(searchTerm);
    await resultsPage.waitForResults();

    const totalTiles = await resultsPage.allTilesCards.count();
    LoggerUtility.info(`TC003 - Found ${totalTiles} items.`);

    const malformed: string[] = [];
    let validCount = 0;

    for (let i = 0; i < totalTiles; i++) {
      const tile = new ProductTile(page, i).getTileCard(i);

      let rawPrice = "";

      try {
        rawPrice = await tile.getPrice();
      } catch {
        LoggerUtility.info(`Tile ${i + 1}: Price missing → OK`);
        continue;
      }

      if (PriceUtils.ignoreMissingPrice(rawPrice)) {
        LoggerUtility.info(`Tile ${i + 1}: Price missing → OK`);
        continue;
      }

      const parsed = PriceUtils.parseCurrency(rawPrice);

      if (parsed === null) {
        malformed.push(`Tile ${i + 1}: "${rawPrice}"`);
      } else {
        validCount++;
      }
    }

    LoggerUtility.info(`TC003, Valid parsed prices: ${validCount}`);

    if (malformed.length > 0) {
      LoggerUtility.warn(
        `TC003, Malformed price formats detected:\n${malformed.join("\n")}`
      );
    }

    const relevance = (validCount / totalTiles) * 100;

    LoggerUtility.info(
      `TC003, Relevant titles: ${validCount}/${totalTiles} (${relevance.toFixed(0)}%)`
    );

    expect(relevance).toBeGreaterThanOrEqual(70);

    LoggerUtility.endTest("TC003, Completed (missing prices allowed)");
  });
});
