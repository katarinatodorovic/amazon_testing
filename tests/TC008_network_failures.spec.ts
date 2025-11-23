import { test, expect } from "./fixtures/network.fixture";
import testData from "../test_data/data.json";

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

test("TC008, Detect failed network requests during search", async ({ homePage, resultsPage, failedRequests }) => {

  await homePage.searchForItem(testData.validProducts.legoClassicBrickBox);

  await resultsPage.waitForResults();

  const criticalFailures = failedRequests.filter(req =>
    !req.url.includes("/suggestions") &&
    !req.url.includes("ads") &&
    !req.url.includes("pixel") &&
    !req.url.includes("metrics") &&
    !req.url.includes("favicon") &&
    !req.url.includes("/ah/ajax/counter")
  );

  expect(
    criticalFailures.length,
    `Critical failed requests:\n${JSON.stringify(criticalFailures, null, 2)}`
  ).toBe(0);
});
