import { test as base } from "./pages.fixture"

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