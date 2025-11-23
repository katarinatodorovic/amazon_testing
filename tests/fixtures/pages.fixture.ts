import { test as base } from "@playwright/test"
import { AmazonHomePage } from "../../pages/AmazonHomePage"
import { SearchResultsPage } from "../../pages/SearchResultsPage"

/**
 * Fixture to provide page objects for Amazon home and Search results pages
 * to the tests. The homePage fixture navigates to the Amazon home page
 * before yielding the page object, while the resultsPage fixture simply
 * yields the search results page object
 * @returns - page objects for AmazonHomePage and SearchResultsPage
 */
export const test = base.extend<{ homePage: AmazonHomePage; resultsPage: SearchResultsPage }>({
  homePage: async ({ page }, use) => {
    const home = new AmazonHomePage(page)
    await home.goto()
    await use(home)
  },

  resultsPage: async ({ page }, use) => {
    const results = new SearchResultsPage(page)
    await use(results)
  }
})

export { expect } from "@playwright/test"
