import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC014 – Long query processing stability
 *
 * This test verifies that Amazon can safely process extremely long search queries
 * (≥500 characters) without crashing, timing out, or redirecting to an error page
 * It ensures the system remains stable even when handling unusually large inputs.
 *
 * Steps:
 * 1. Load or generate a long search query of at least 500 characters
 * 2. Navigate to the Amazon homepage
 * 3. Perform a search using the long query
 * 4. Wait for either search results or the fallback "no results" page to load
 * 5. Confirm that expectedmessaging "other buying option" is present
 * 6. Validate that the URL does not redirect to an Amazon error page
 * 7. Wait for the search box to remain visible, confirming UI stability
 * 8. Count the number of product tiles and ensure the system returns a stable response
 *    (even if zero results are shown)
 */

test("TC014, Long query processes without crash or timeout", async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const resultsPage = new SearchResultsPage(page);

    const query = testData.longQuery;
    const len = query.length;
    LoggerUtility.info(`TC014, Generated long query of length: ${len}`);

    await homePage.goto();
    await homePage.searchForItem(query);
    await resultsPage.waitForResults();  

    // Confirm expected messaging is present
    LoggerUtility.info("Checking if Other buying option text is present" );
        const otherByingOptionText = await homePage.getCheckOtherOptionsMessage();
        expect(otherByingOptionText).toContain('other buying option');

    // Validate system remains stable
    const url = page.url().toLowerCase();
    LoggerUtility.info(`TC014-URL after search: ${url}`);

    // Amazon should not redirect to an error page
    expect(url).not.toContain("error");

    await homePage.waitForVisible(homePage.searchBox);

    // Count product tiles
    const productCount = await resultsPage.allTilesCards.count();
    LoggerUtility.info(`TC014-Product count detected: ${productCount}`);

    // Expect at least 0 products (no crash)
    expect(productCount).toBeGreaterThanOrEqual(0); 
    LoggerUtility.info("TC014, Long query completed successfully without crash or UI break.");
});
