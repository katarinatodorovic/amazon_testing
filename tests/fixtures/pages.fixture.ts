import { test as base } from "@playwright/test"
import { AmazonHomePage } from "../../pages/AmazonHomePage"
import { SearchResultsPage } from "../../pages/SearchResultsPage"

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
