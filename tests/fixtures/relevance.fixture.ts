import { test as base } from "./tiles.fixture"
import { JsonTestDataReader } from "../../utils/JsonTestDataReader"

/**
 * Fixture for relevance tests 
 * Provides a method to get keyword variants from a JSON file
 * @param term - the search term to get variants for
 * @returns - a promise that resolves to the keyword variants
 */
export const test = base.extend<{ keyWordVariants: (term: string) => Promise<unknown> }>({
  keyWordVariants: async ({}, use) => {
    await use((term) => {
      return JsonTestDataReader.getJSONValue("keyWordVariants.json", term)
    })
  }
})

export { expect } from "@playwright/test"
