import { test as base } from "./pages.fixture"
import { PerformanceUtility } from "../../utils/PerformanceUtility"

/**
 * Fixture to provide a measureSearch function that measures
 * the load performance of searching for an item on Amazon.
 * It uses the homePage fixture to perform the search and
 * the PerformanceUtility to measure load times
 * @param term - The search term to look for
 * @returns - the performance metrics of the search operation
 */
export const test = base.extend<{ measureSearch: (term: string) => Promise<unknown> }>({
  measureSearch: async ({ homePage, page }, use) => {
    await use(async (term: string) => {
      return await PerformanceUtility.measureLoad(page, async () => {
        await homePage.searchForItem(term)
      })
    })
  }
})

export { expect } from "@playwright/test"
