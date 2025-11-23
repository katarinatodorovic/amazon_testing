import { test as base } from "./pages.fixture"

export const test = base.extend<{ searchFor: (term: string) => Promise<unknown> }>({
  searchFor: async ({ homePage, resultsPage }, use) => {
    await use(async (term) => {
      await homePage.searchForItem(term)
      await resultsPage.waitForResults()
      return resultsPage
    })
  }
})

export { expect } from "@playwright/test"
