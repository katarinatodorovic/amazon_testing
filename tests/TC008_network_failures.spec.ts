import { test, expect } from '@playwright/test';
import testData from '../test_data/data.json';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

/**
 * TC008 – Detect failed network requests during search
 *
 * This test verifies that no critical network requests fail during an Amazon
 * product search. It monitors all network responses and flags any request
 * returning an HTTP status of 400 or higher, with specific exceptions for
 * non-essential resources
 *
 * Steps:
 * 1. Attach a response listener to capture all network responses
 * 2. Navigate to the Amazon homepage
 * 3. Perform a search using a valid product term
 * 4. Wait for search results to render
 * 5. Filter the captured failed responses, ignoring known non-critical categories such as:
 *    - Ad services
 *    - Pixel tracker requests
 *    - Analytics endpoints
 *    - Favicon requests
 *    - Suggestion APIs and lightweight counters
 * 6. Assert that no critical asset or API request failed
 */

test("TC008, Detect failed network requests during search", async ({ page }) => {
  const failedRequests: { url: string; status: number }[] = [];
  const searchResultsPage = new SearchResultsPage(page);

  // enable network logging
  page.on('response', async (response) => {
    const status = response.status();
    if (status >= 400) {
      failedRequests.push({
        url: response.url(),
        status
      });
    }
  });
  const homePage = new AmazonHomePage(page);
  
  await homePage.goto();
  await homePage.searchBox.fill(testData.validProducts.legoClassicBrickBox);
  await homePage.searchButton.click();

  // Wait for search results to load
  await searchResultsPage.waitForResults();

  // Assert no critical failures for essential assets
  // ignore ad failures, pixel trackers, analytics, and favicon requests
  const criticalFailures = failedRequests.filter(req =>
    !req.url.includes('/suggestions') &&
    !req.url.includes('ads') &&
    !req.url.includes('pixel') &&
    !req.url.includes('metrics') &&
    !req.url.includes('favicon') &&
    !req.url.includes('/ah/ajax/counter') 
  );
  // Log all critical failures
  expect(criticalFailures.length, `Critical failed requests:\n
    ${JSON.stringify(criticalFailures, null, 2)}`)
    .toBe(0);
});
