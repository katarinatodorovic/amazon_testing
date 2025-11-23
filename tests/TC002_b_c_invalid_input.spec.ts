import { test, expect } from "./fixtures/pages.fixture";
import { LoggerUtility } from "../utils/LoggerUtility";
import testData from "../test_data/data.json";

/**
 * TC002_B_C – Search input edge cases (data-driven)
 * This test verifies that Amazon can safely handle multiple types of invalid
 * search inputs without crashing, redirecting to an error page, or breaking UI
 * rendering 
 *
 * Behavior:
 * Iterates through all invalid terms
 * Records message extracted for each term
 * Continues even if some terms fail
 * Fails at the end if any term failed
 */
test.describe("TC002, Search input edge cases (data-driven)", () => {
  const invalidTerms = Object.values(testData.invalidProducts);

  test("TC002, @smoke Invalid search terms should not break Amazon", async ({ homePage, page }) => {

    // Collect failures so test continues through all terms
    const failures: string[] = [];

    for (const term of invalidTerms) {
      LoggerUtility.divider();
      LoggerUtility.info(`Testing invalid search term: "${term}"`);
      LoggerUtility.divider();

      try {
        await homePage.goto();

        LoggerUtility.info(`Performing search for invalid term: "${term}"`);
        await homePage.searchForItem(term);

        const url = page.url().toLowerCase();
        LoggerUtility.info(`URL after search: ${url}`);

        // Checks ifURL contains "error"
        if (url.includes("error")) {
          const msg = `URL contains 'error' for term "${term}"`;
          LoggerUtility.error(msg);
          failures.push(msg);
          continue;
        }

        // Extract message 
        LoggerUtility.info(`Checking fallback message for term "${term}"`);
        let message = "";

        try {
          message = await homePage.getCheckOtherOptionsMessage();
        } catch (err) {
          message = `<extracted exception: ${err}>`;
        }

        LoggerUtility.info(`➡ Returned fallback message: "${message}"`);

        // Fail if no message extracted
        if (!message || message.trim() === "") {
          const msg = `No fallback message found for term "${term}" (received empty text)`;
          LoggerUtility.error(msg);
          failures.push(msg);
          continue;
        }

        // Fail if message does not include required phrase
        if (!message.toLowerCase().includes("other buying option")) {
          const msg = `Unexpected fallback message for term "${term}": "${message}"`;
          LoggerUtility.error(msg);
          failures.push(msg);
          continue;
        }

        LoggerUtility.info(`Fallback message valid for term "${term}"`);

      } catch (error) {
        const msg = `Exception occurred for term "${term}": ${error}`;
        LoggerUtility.error(msg);
        failures.push(msg);
        continue;
      }
    }

    // fail only after loop finishes
    expect(
      failures,
      `The following invalid search terms failed:\n\n${failures.join("\n")}\n`
    ).toEqual([]);
  });
});
