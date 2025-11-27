import { Locator, Page } from "@playwright/test";
import { LoggerUtility } from "./LoggerUtility";

/** 
 * Class that handling waits
 */
export class WaitUtils {

   static allTileCards(page: Page) {
    return page.locator('[data-component-type="s-search-result"]');
  }

  /**
   * Wait for an element to become visible
   * @param locator - the locator of the element to wait for
   * @param timeout - maximum time to wait in milliseconds (default: 10 seconds)
   */
  static async forElementToBeVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Wait for an element to be attached & visible
   * @param locator - the locator of the element to wait for
   * @param timeout - maximum time to wait in milliseconds (default: 10 seconds)
   */
  static async forElementToBeInteractable(locator: Locator, timeout = 10_000): Promise<void> {
    LoggerUtility.info(`Waiting for element to be interactable: ${locator}`);
    await locator.waitFor({ state: "attached", timeout });
    await locator.waitFor({ state: "visible", timeout });
  }

 /**
 * Wait for main layout area to stabilize by observing:
 * 1) first product tile appears
 * 2) skeleton loaders disappear
 * 3) no DOM changes in product tile count for a stable period
 * @param page - the Playwright Page object
 * @param stableMS - minimum stable period in milliseconds (default: 300 ms)
 * @param timeout - maximum time to wait in milliseconds (default: 16 seconds)
 */
static async waitForDomSearchResultsStable
(page: Page, stableMS = 300, timeout = 16_000): Promise<void> {

  LoggerUtility.info("Waiting for DOM search results to stabilize...");
  const grid = this.allTileCards(page);

  await grid.first().waitFor({ state: 'visible', timeout });

  await page.waitForFunction(
    () => !document.querySelector('[class*="placeholder"],[class*="skeleton"],[data-placeholder]'),
    null,
    { timeout: 3000 }
  ).catch(() => {});

  // Wait for grid to stabilize
  const checkInterval = 150;
  let lastCount = await grid.count();
  const start = Date.now();

  while (Date.now() - start < timeout) {
    await page.waitForTimeout(checkInterval);

    // Check current count of product tiles
    const newCount = await grid.count();
    if (newCount === lastCount) {
      await page.waitForTimeout(stableMS);
      const finalCount = await grid.count();
      if (finalCount === newCount) return;  
    }

    lastCount = newCount;
  }
}

  /**
   * // Sharp
   * Smart, reusable wait for search results (Amazon-reliable)
   * Used after performing a search
   * @param page - the Playwright Page object
   * @param timeout - maximum time to wait in milliseconds (default: 15 seconds)
   */
  static async waitForSearchResults(page: Page, timeout = 15_000): Promise<void> {
    LoggerUtility.info("Waiting for search results to load...");
    await page.waitForURL(/\/s\?k=/, { timeout });

    await this.allTileCards(page).first().waitFor({ state: 'visible', timeout });
    await this.waitForDomSearchResultsStable(page, 400);
  }

  /**
   * Polling-based visibility check
   * @param locator - the locator of the element to check
   * @param retries - number of polling attempts (default: 6)
   * @param intervalMs - interval between attempts in milliseconds (default: 200 ms)
   * @returns - true if element becomes visible, false otherwise
   */
  static async waitForVisibilityWithPolling(locator: Locator, retries = 6, intervalMs = 200): 
  Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    if (await locator.isVisible()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  return false;
}
  /**
   * Simple short pause
   * Use only for autosuggestions or debounce-like behavior
   * @param ms - duration to pause in milliseconds (default: 350 ms)
   */
  static async shortPause(shortPause = 350): Promise<void> {
    LoggerUtility.info(`Pausing for ${shortPause} milliseconds...`);
    await new Promise(res => setTimeout(res, shortPause));
  }

  /**
   * Wait until page navigation completes and initial UI settles
   * Amazon-safe alternative to networkIdle or full load
   * @param page - the Playwright Page object
   * @param timeout - maximum time to wait in milliseconds (default: 12 seconds)
   */
  static async waitForPageReady(page: Page, timeout = 12_000): Promise<void> {
    LoggerUtility.info("Waiting for page to be ready...");
    await page.waitForLoadState('domcontentloaded', { timeout });
    await this.waitForDomSearchResultsStable(page);
  }
}
