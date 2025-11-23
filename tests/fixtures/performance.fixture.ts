import { test as base } from "./pages.fixture"
import { PerformanceUtility } from "../../utils/PerformanceUtility"

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
