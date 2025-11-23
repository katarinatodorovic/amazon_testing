import { test, expect } from "./fixtures/pages.fixture";
import { LoggerUtility } from "../utils/LoggerUtility";
import testData from "../test_data/data.json";

/**
 * TC002A – Empty search input handling
 *
 * This test verifies that submitting an empty search input on the Amazon homepage
 * does not cause navigation to an error page, unexpected redirects, or UI crashes
 *
 * Steps:
 * 1. Navigate to the Amazon homepage
 * 2. Explicitly submit an empty search term
 * 3. Wait for the search box to remain visible, confirming that the UI remains stable
 * 4. Capture the resulting URL
 * 5. Validate that:
 *    - The user remains on an Amazon page
 *    - No error page is triggered
 * Tags: @smoke
 */

test.describe("TC002, Invalid Input Handling", () => {
  test("TC002A, @smoke Empty search input should not crash ", async ({ homePage, page }) => {

    LoggerUtility.info("TC002A - Starting empty search input validation");

    // Just submit empty input
    await homePage.searchUsingEnterKey(testData.invalidProductsEmpty.empty);
    LoggerUtility.info("TC002A - Submitted empty search input");

    await homePage.waitForVisible(homePage.searchBox);

    const url = page.url();
    LoggerUtility.info(`TC002A - URL after empty search: ${url}`);

    expect(url).toContain("amazon");
    expect(url.toLowerCase()).not.toContain("error");
  });
});
