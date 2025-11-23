import { test as base } from "./pages.fixture"

/**
 * Fixture to track failed network requests during tests
 * @returns - an array of objects containing the URL and status code of failed requests
 */
export const test = base.extend<{ failedRequests: { url: string, status: number }[] }>({
  failedRequests: async ({ page }, use) => {
    const failed: { url: string, status: number }[] = []

    page.on("response", (res) => {
      if (res.status() >= 400) {
        failed.push({ url: res.url(), status: res.status() })
      }
    })

    await use(failed)
  }
})

export { expect } from "@playwright/test"