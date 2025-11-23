// import { test, expect } from '@playwright/test';
// import { AmazonHomePage } from '../pages/AmazonHomePage';
// import { SearchResultsPage } from '../pages/SearchResultsPage';
// import { LoggerUtility } from '../utils/LoggerUtility';
// import { PriceUtils } from '../utils/PriceUtils';
// import testData from '../test_data/data.json';

// /**
//  * TC004 – Average price calculation for first three pages
//  *
//  * Test logging the average product price across the first three pages of results
//  * for a given search term
//  * 
//  * Steps:
//  * 1. Navigate to the Amazon homepage
//  * 2. Perform a search using a valid product term "wireless mouse"
//  * 3. For pages 1 through 3:
//  *    - Scroll to ensure all product tiles are fully rendered
//  *    - Retrieve every product tile on the page
//  *    - Extract the raw price text for each tile
//  *    - Parse each price into a numeric value using the currency parser
//  *    - Compute the average price for that page
//  *    - Log the average price for reporting and analysis
//  * 4. Navigate to the next page after each iteration until page 3 is reached or
//  *    Amazon indicates no further pages are available
//  */
// test.describe("TC004, Average price calculation for first three pages", () => {

//   test("TC004, Compute and log average prices for pages 1-3", async ({ page }) => {
//     const homePage = new AmazonHomePage(page);
//     const resultsPage = new SearchResultsPage(page);
//     const searchTerm = testData.validProducts.wirelessMouse;

//     test.setTimeout(120_000);

//     await homePage.goto();
//     await homePage.searchForItem(searchTerm);
//     await resultsPage.waitForResults();

//     const maxPages = 3;

//     for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
//       LoggerUtility.divider();
//       LoggerUtility.step(`Processing page ${currentPage}...`);

//       await resultsPage.scrollUntilPaginationVisible();

//       const tiles = await resultsPage.getAllTiles();
//       LoggerUtility.info(`Found ${tiles.length} tiles on page ${currentPage}.`);

//       const prices = await PriceUtils.extractValidPricesFromTiles(tiles);

//       if (prices.length === 0) {
//         LoggerUtility.warn(`Page ${currentPage} has no valid prices.`);
//       } else {
//         const avg = PriceUtils.calculateAverage(prices);
//         LoggerUtility.info(`[$$$$$$$$$] Average price for page ${currentPage}: ${avg}[$$$$$$$$$]`)
//         expect(avg).not.toBeNull();
//       }

//       if (currentPage === maxPages) break;

//       const moved = await resultsPage.goToNextPage();
//       if (!moved) {
//         LoggerUtility.warn(`No more pages after page ${currentPage}`);
//         break;
//       }
//     }
//   });
// });

import { test, expect } from "./fixtures/pages.fixture";
import { LoggerUtility } from "../utils/LoggerUtility";
import { PriceUtils } from "../utils/PriceUtils";
import testData from "../test_data/data.json";

/**
 * TC004 – Average price calculation for first three pages
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Perform a search using a valid product term "wireless mouse"
 * 3. For pages 1 through 3:
 *    - Scroll to ensure all product tiles are fully rendered
 *    - Retrieve every product tile on the page
 *    - Extract the raw price text for each tile
 *    - Parse each price into a numeric value using the currency parser
 *    - Compute the average price for that page
 *    - Log the average price for reporting and analysis
 * 4. Navigate to the next page after each iteration until page 3 is reached or
 *    Amazon indicates no further pages are available
 */
test.describe("TC004, Average price calculation for first three pages", () => {

  test("TC004, Compute and log average prices for pages 1-3", async ({ homePage, resultsPage }) => {

    const searchTerm = testData.validProducts.wirelessMouse;

    test.setTimeout(120_000);

    await homePage.searchForItem(searchTerm);
    await resultsPage.waitForResults();

    const maxPages = 3;

    // Iterate through the first three pages of results
    for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
      LoggerUtility.divider();
      LoggerUtility.step(`Processing page ${currentPage}...`);

      await resultsPage.scrollUntilPaginationVisible();

      const tiles = await resultsPage.getAllTiles();
      LoggerUtility.info(`Found ${tiles.length} tiles on page ${currentPage}.`);

      const prices = await PriceUtils.extractValidPricesFromTiles(tiles);

      if (prices.length === 0) {
        LoggerUtility.warn(`Page ${currentPage} has no valid prices.`);
      } else {
        const avg = PriceUtils.calculateAverage(prices);
        LoggerUtility.info(`[$$$$$$$$$] Average price for page ${currentPage}: ${avg}[$$$$$$$$$]`);
        expect(avg).not.toBeNull();
      }

      if (currentPage === maxPages) break;

      const moved = await resultsPage.goToNextPage();
      if (!moved) {
        LoggerUtility.warn(`No more pages after page ${currentPage}`);
        break;
      }
    }
  });
});
