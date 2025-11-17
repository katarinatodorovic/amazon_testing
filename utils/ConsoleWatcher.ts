import { Page } from '@playwright/test';

/**
  * Class to watch console messages 
 */
export class ConsoleWatcher {

  /**
   * Attaches a console listener to the given page 
   * that logs errors and warnings to the provided array
   * @param page - playwright Page object
   * @param logArray - array to store console messages
   */
  static async attach(page: Page, logArray: string[]): Promise<void> {
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        logArray.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });
  }
}
