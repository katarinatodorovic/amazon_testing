import { test as base } from "./pages.fixture"

/**
 * Fixture for search tests
 * Provides a method to perform a search and return the results page
 * @param term - the search term to look for
 * @returns - the search results page object
 */
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
