import { test, expect } from "./fixtures/relevance.fixture";
import { LoggerUtility } from "../utils/LoggerUtility";
import testData from "../test_data/data.json";
import { JsonTestDataReader } from "../utils/JsonTestDataReader";

/**
 * TC009 – Search results relevance
 *
 * This test validates the relevance of Amazon search results by checking whether
 * the majority of the top product titles meaningfully match the search keyword
 * A dynamic set of keyword variants is loaded to support flexible matching
 *
 * Steps:
 * 1. Load keyword variants for the selected search term from JSON test data
 * 2. Navigate to the Amazon homepage
 * 3. Perform a search using a valid product term "wireless mouse"
 * 4. Wait for the search results to render
 * 5. Retrieve the top 10 product titles
 * 6. If fewer than 5 results are returned, skip the test (insufficient sample size)
 * 7. Count how many of the product titles contain at least one of the keyword variants
 * 8. Calculate overall relevance percentage
 */

test.describe("TC009, Search results relevance", () => {
  test("TC009, At least 80% of top 10 results mention the search keyword", async ({ homePage, resultsPage }) => {

    const searchTerm = testData.validProducts.wirelessMouse.toLowerCase();

    const keywordVariants: string[] = JsonTestDataReader.getJSONValue(
      "keywordVariants.json",
      searchTerm
    );

    LoggerUtility.info(`TC009 - Loaded keyword variants: ${JSON.stringify(keywordVariants)}`);

    await homePage.searchForItem(searchTerm);

    await resultsPage.waitForResults();
    const titles = await resultsPage.getTopProductTitles(10);

    if (titles.length < 5) {
      LoggerUtility.warn(`TC009 - Only found ${titles.length} results, skipping test.`);
      test.skip();
    }

    const relevantCount = titles.filter(title => {
      const text = title.toLowerCase();
      return keywordVariants.some(kw => text.includes(kw));
    }).length;

    const relevance = (relevantCount / titles.length) * 100;

    LoggerUtility.info(
      `TC009, Relevant titles: ${relevantCount}/${titles.length} (${relevance.toFixed(0)}%)`
    );

    expect(relevance).toBeGreaterThanOrEqual(80);
  });
});
