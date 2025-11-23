import { test as base } from "./pages.fixture"

interface ResultsPage {
  getAllTiles(): Promise<unknown[]>
  getTopProductTitles(limit: number): Promise<string[]>
}

/**
 * Fixture for tiles tests
 * Provides methods to get all tiles and top product titles from the results page
 * @returns - an array of tiles and a function to get top product titles
 */
export const test = base.extend<{
  tiles: unknown[]
  topTitles: (limit: number) => Promise<string[]>
}>({
  tiles: async ({ resultsPage }: { resultsPage: ResultsPage }, use) => {
    const items = await resultsPage.getAllTiles()
    await use(items)
  },

  topTitles: async ({ resultsPage }: { resultsPage: ResultsPage }, use) => {
    await use(async (limit: number) => {
      return resultsPage.getTopProductTitles(limit)
    })
  }
})

export { expect } from "@playwright/test"
