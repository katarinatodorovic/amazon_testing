import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import testData from '../test_data/data.json';

/**
 * TC012 – Result count consistency (UI label vs. DOM)
 *
 * This test verifies that the number of search results displayed in the UI
 * matches the actual number of
 * product tiles rendered in the DOM
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Perform a search using a valid product term "wireless mouse"
 * 3. Retrieve the result count reported by the UI label using the page object helper
 * 4. Retrieve the actual number of product tiles in the DOM
 * 5. Compare the two values to ensure consistency
 *
 */

test("TC012, Verify result count consistency between UI label and actual DOM count", async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const resultsPage = new SearchResultsPage(page);

  // Load homepage and perform search
  await homePage.goto();
  await homePage.searchForItem(testData.validProducts.wirelessMouse);

  // Get counts from UI and DOM
  const totalResults = await resultsPage.getNumberOfCards();
  console.log(`Total results from UI label: ${totalResults}`);

  const domCount = await resultsPage.getProductCountFromDOM();
  console.log(`Total product tiles in DOM: ${domCount}`);
  // Assert that both counts match
  expect(totalResults).toBe(domCount);
});