import { test, expect } from "./fixtures/credentials.fixture";
// Verify that encrypted credentials are properly decrypted and injected into the test context
// This test is skipped by default and can be enabled for debugging purposes of encryption/decryption 
test.skip("Encryption/Decryption works", async ({ credentials }) => {
  console.log("Verifying decrypted credentials inside Playwright...");

  expect(credentials.username).toBeTruthy();
  expect(credentials.password).toBeTruthy();

  console.log("USERNAME:", credentials.username);
  console.log("PASSWORD:", credentials.password);

  console.log("Credentials successfully injected into Playwright via fixture.");
});
