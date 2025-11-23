import { test, expect } from "./fixtures/performance.fixture";
import { LoggerUtility } from "../utils/LoggerUtility";
import testData from "../test_data/data.json";

/**
 * TC013 – Page responsiveness / performance
 *
 * This test measures how quickly Amazon loads search results after initiating
 * a search action. Using a performance utility, it captures the total elapsed
 * time from search submission to the appearance of the results page and verifies
 * that the load time stays within an acceptable threshold
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Measure the time it takes for search results to load after submitting
 *    a valid product search "coffee mug"
 * 3. Log the measured duration
 * 4. Assert that the load time is below the defined performance threshold
 *    (threshold ≤ 13 seconds)
 * 5. Confirm that the results page has fully rendered
 */

test.describe("TC013, Page responsiveness / performance", () => {
  test("TC013, Search results should load within acceptable time", async ({ homePage, resultsPage, measureSearch }) => {

    const searchTerm = testData.validProducts.coffeeMug;

    const loadTimeSeconds = await measureSearch(searchTerm);

    LoggerUtility.info(`TC013, Measured search → results load time: ${loadTimeSeconds}s`);

    expect(loadTimeSeconds).toBeLessThanOrEqual(13);

    await resultsPage.waitForResults();
  });
});
