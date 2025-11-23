import { test as base } from "./tiles.fixture"
import { JsonTestDataReader } from "../../utils/JsonTestDataReader"

export const test = base.extend<{ keywordVariants: (term: string) => Promise<unknown> }>({
  keywordVariants: async ({}, use) => {
    await use((term) => {
      return JsonTestDataReader.getJSONValue("keywordVariants.json", term)
    })
  }
})

export { expect } from "@playwright/test"
