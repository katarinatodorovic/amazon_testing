// run test with following command for different devices
// npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=Desktop
// npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=iPad
// npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=iPhone

import { test, expect, Page } from '@playwright/test';
import { AmazonHomePage } from '../pages/AmazonHomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import testData from '../test_data/data.json';

/**
 * TC015 – Responsive layout validation across device profiles
 *
 * This test verifies that Amazon’s search results layout adapts correctly across
 * multiple device types (Desktop, iPad, iPhone). It checks the number of product
 * columns rendered on the search results page to ensure the layout remains
 * responsive and consistent with expected breakpoints
 *
 * Steps:
 * 1. Run the test under different Playwright projects (Desktop, iPad, iPhone)
 * 2. Navigate to the Amazon homepage
 * 3. Perform a search using a valid product term
 * 4. Ensure search results render and at least one product tile is visible
 * 5. Determine how many unique left-position coordinates exist among the tiles,
 *    which corresponds to the number of columns shown
 * 6. Validate expected column counts for each device:
 *    - Desktop: 2–5 columns
 *    - iPad: 1–3 columns
 *    - iPhone: exactly 1 column
 */

// function to run the responsive layout test
async function runResponsiveTest(page: Page): Promise<number[]> {
  const home = new AmazonHomePage(page);
  const results = new SearchResultsPage(page);

  await home.goto();

  await home.searchForItem(testData.validProducts.legoClassicBrickBox);
  await results.waitForResults();

  const tiles = results.allTilesCards;
  await expect(tiles.first()).toBeVisible();

  const numOfElementsInRow = await tiles.evaluateAll((elementsInRow) => {
    const positions = elementsInRow.map(element =>
      Math.round(element.getBoundingClientRect().left)
    );
    return Array.from(new Set(positions));
  });
    return numOfElementsInRow;
}

test('Responsive Layout', async ({ page }, testInfo) => {
  const device = testInfo.project.name;

  const shouldSkip = !["Desktop", "iPad", "iPhone"].includes(device);
  test.skip(shouldSkip, `Skipping responsive test for project: ${device}`);

  console.log(`Running responsive test on: ${device}`);

  const cols = await runResponsiveTest(page);

  // In desktop we expect between 2 and 5 columns
  if (device === "Desktop") {
    expect(cols.length).toBeGreaterThanOrEqual(2);
    expect(cols.length).toBeLessThanOrEqual(5);
  }

  // In iPad we expect between 1 and 3 columns
  if (device === "iPad") {
    expect(cols.length).toBeGreaterThanOrEqual(1);
    expect(cols.length).toBeLessThanOrEqual(3);
  }

  // In iPhone we expect 1 column
  if (device === "iPhone") {
    expect(cols.length).toBe(1);
  }
});
