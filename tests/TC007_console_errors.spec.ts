import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { ConsoleWatcher } from '../utils/ConsoleWatcher';
import { LoggerUtility } from '../utils/LoggerUtility';
import testData from '../test_data/data.json';

/**
 * TC007 – JavaScript console errors during search
 *
 * This test ensures that performing a product search on Amazon does not trigger
 * any JavaScript console errors such as TypeError, ReferenceError, SyntaxError,
 * or uncaught exceptions
 *
 * Steps:
 * 1. Attach a console watcher to capture all console output during the test run
 * 2. Navigate to the Amazon homepage
 * 3. Perform a search using a valid product term "coffee mug"
 * 4. Collect any console messages emitted during page load and rendering
 * 5. Filter the messages for known error indicators:
 *    - "TypeError"
 *    - "ReferenceError"
 *    - "SyntaxError"
 *    - "Uncaught"
 * 6. Assert that no such error messages are present
 */
test.describe("TC007, JavaScript console errors during search", () => {
  test("TC007, No console ERROR/TypeError during search rendering", async ({ page }) => {
    const homePage = new AmazonHomePage(page);
    const messages: string[] = [];
    const searchTerm = testData.validProducts.coffeeMug;

    await ConsoleWatcher.attach(page, messages);

    await homePage.goto();

    await homePage.searchForItem(searchTerm);

    // Filter console messages for errors of interest
    const errorMessages = messages.filter((m) => 
      m.toLowerCase().includes('typeerror') ||
      m.toLowerCase().includes('referenceerror') ||
      m.toLowerCase().includes('syntaxerror') ||
      m.toLowerCase().includes('uncaught')
    );

    // Log any errors found
    if (errorMessages.length > 0) {
      LoggerUtility.error(`TC007 - Console errors detected:\n${errorMessages.join('\n')}`);
    }

    expect(errorMessages.length, 'Console errors should not occur during search').toBe(0);
  });
});
