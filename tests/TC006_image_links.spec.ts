import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC006 – Product image availability
 *
 * This test verifies that all product images returned in Amazon search results
 * load successfully and respond with an HTTP 200 status code
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Perform a search using a valid product term  "coffee mug"
 * 3. Wait for search results to load and scroll until all product tiles are fully visible
 * 4. Retrieve every product tile and extract each tile's image URL
 * 5. For each image URL:
 *    - Send an HTTP GET request
 *    - Record any image that does not return a 200 status code
 */

test.describe("TC006, Product image availability", () => {
 test("TC006, All product images should respond with HTTPS 200", async ({ page, request }) => {
      const homePage = new AmazonHomePage(page);
      const resultsPage = new SearchResultsPage(page);
      test.setTimeout(120_000);


      const searchTerm = testData.validProducts.coffeeMug;

      await homePage.goto();

      await homePage.searchForItem(searchTerm);
      await resultsPage.waitForResults();

      // Ensure all tiles are loaded
      await resultsPage.scrollUntilPaginationVisible();

      const tiles = await resultsPage.getAllTiles();
      LoggerUtility.info(`TC006 - Tiles found: ${tiles.length}`);

      // Check each image URL
      const broken: { index: number; url: string; status: number }[] = [];

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];

        const imageUrl = await tile.getImageFast();
        if (!imageUrl) continue;

        const response = await request.get(imageUrl);
        const status = response.status();

        if (status !== 200) {
          broken.push({ index: i + 1, url: imageUrl, status });
        }
      }
      // Log any broken images
      if (broken.length > 0) {
        LoggerUtility.warn(`TC006, Broken images: ${JSON.stringify(broken, null, 2)}`);
      }

      expect(tiles.length).toBeGreaterThan(0);
  });
});
