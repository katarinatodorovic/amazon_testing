import { test as base } from "./pages.fixture"

interface ResultsPage {
  getAllTiles(): Promise<unknown[]>
  getTopProductTitles(limit: number): Promise<string[]>
}

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
