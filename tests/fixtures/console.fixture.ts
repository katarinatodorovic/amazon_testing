import { test as base } from "./pages.fixture"
import { ConsoleWatcher } from "../../utils/ConsoleWatcher"

/**
 * Fixture that collects console messages from the page
 * @returns - array of console messages
 */
export const test = base.extend<{ consoleMessages: string[] }>({
  consoleMessages: async ({ page }, use) => {
    const msgs: string[] = []
    await ConsoleWatcher.attach(page, msgs)
    await use(msgs)
  }
})

export { expect } from "@playwright/test"
