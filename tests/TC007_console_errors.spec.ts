import { test, expect } from "./fixtures/console.fixture";
import { LoggerUtility } from "../utils/LoggerUtility";
import testData from "../test_data/data.json";

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
  test("TC007, No console ERROR/TypeError during search rendering", async ({ homePage, consoleMessages }) => {
    const searchTerm = testData.validProducts.coffeeMug;

    await homePage.searchForItem(searchTerm);

    const errorMessages = consoleMessages.filter((m) =>
      m.toLowerCase().includes("typeerror") ||
      m.toLowerCase().includes("referenceerror") ||
      m.toLowerCase().includes("syntaxerror") ||
      m.toLowerCase().includes("uncaught")
    );

    if (errorMessages.length > 0) {
      LoggerUtility.error(`TC007 - Console errors detected:\n${errorMessages.join("\n")}`);
    }

    expect(errorMessages.length, "Console errors should not occur during search").toBe(0);
  });
});
