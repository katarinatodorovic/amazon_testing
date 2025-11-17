import { Page } from '@playwright/test';
import { LoggerUtility } from './LoggerUtility';

/**
 * Utility class for monitoring network requests
 * Detects failed HTTP requests (4xx / 5xx) and logs them
 */
export class NetworkUtility {

  /**
   * Monitors network requests on the given Playwright page
   * Logs any failed requests (status code 4xx or 5xx)
   * @param page - The Page object to monitor
   */
  static async monitor(page: Page): Promise<void> {
    LoggerUtility.info("Starting network request monitoring...");
    page.on("response", async (response) => {
      const status = response.status();
      if (status >= 400) {
        const url = response.url();
        console.warn("[NETWORK ERROR] " + status + " -> " + url);
      }
    });
  }
}
