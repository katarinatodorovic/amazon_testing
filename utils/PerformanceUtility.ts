import { Page } from '@playwright/test';
import { WaitUtils } from './WaitUtils';
import { LoggerUtility } from './LoggerUtility';

/**
  * Utility class for measuring performance metrics
 */
export class PerformanceUtility {

  /**
   * Measures the time taken to load a page after performing a specified action
   * @param page - The Page object   
   * @param action - An asynchronous function that performs the action triggering the page load
   * @returns The time taken to load the page in seconds
   */
  static async measureLoad(page: Page, action: () => Promise<void>): Promise<number> {
    LoggerUtility.info("Measuring page load time...");
    const start = performance.now();
    await action();
    await WaitUtils.waitForDomSearchResultsStable(page, 400);
    const end = performance.now();
    const loadTime = (end - start) / 1000;
    console.log("[PERFORMANCE] Page load time: " + loadTime.toFixed(2) + "s");
    return loadTime;
  }
}
