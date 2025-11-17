import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC005 – Verify pagination loads new products and updates URLs
 *
 * This test ensures Amazon's search pagination works correctly by confirming
 * that each page displays new product results and that the page URL updates
 * appropriately when navigating forward
 *
 * Steps:
 * 1. Navigate to the Amazon homepage and search for a valid product term
 * 2. Capture the top 10 product titles and current URL from page 1
 * 3. Navigate to page 2:
 *    - Confirm pagination succeeded
 *    - Wait for at least 10 results to load
 *    - Capture top 10 titles and the new URL
 *    - Verify both titles and URL differ from page 1
 * 4. Navigate to page 3 (if available):
 *    - Confirm navigation to page 3
 *    - Capture top 10 titles and the URL
 *    - Verify both differ from page 2
 */

test("TC005, Page 2 and 3 load new products and URL updates", async ({ page }) => {
  const homePage = new AmazonHomePage(page);
  const resultsPage = new SearchResultsPage(page);

  const searchTerm = testData.validProducts.legoClassicBrickBox;

  await homePage.goto();
  await homePage.searchForItem(searchTerm);


  const page1Titles = await resultsPage.getTopProductTitles(10);
  const urlPage1 = page.url();
  LoggerUtility.info(`TC005, Page 1 URL: ${urlPage1}`);

  // Go to page 2
  const hasPage2 = await resultsPage.goToNextPage();
  await page.waitForLoadState('domcontentloaded');
  // Assert navigated to page 2
  expect(hasPage2).toBeTruthy();

  await resultsPage.waitUntilAtLeastNResults(10);
  const page2Titles = await resultsPage.getTopProductTitles(10);
  const urlPage2 = page.url();
  LoggerUtility.info(`TC005, Page 2 URL: ${urlPage2}`);

  expect(urlPage2).not.toBe(urlPage1);
  expect(page2Titles).not.toEqual(page1Titles);

  // Go to page 3
  const hasPage3 = await resultsPage.goToNextPage();
  if (hasPage3) {
    const urlPage3 = page.url();
    const page3Titles = await resultsPage.getTopProductTitles(10);
    LoggerUtility.info(`TC005, Page 3 URL: ${urlPage3}`);

    // Assert that we have navigated to page 3
    expect(urlPage3).not.toBe(urlPage2);
    expect(page3Titles).not.toEqual(page2Titles);
  }
});