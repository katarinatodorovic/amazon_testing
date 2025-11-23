import { test as base, expect } from '@playwright/test';

/**
 * Fixture to provide decrypted credentials for tests
 * @returns - an object containing username and password
 */
export const test = base.extend<{
  credentials: { username: string; password: string };
}>({
  credentials: async ({}, use) => {
    await use({
      username: process.env.DECRYPTED_USERNAME!,
      password: process.env.DECRYPTED_PASSWORD!
    });
  }
});

export { expect };
