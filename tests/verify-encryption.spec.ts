import { test, expect } from "./fixtures/credentials.fixture";

test("Encryption/Decryption works", async ({ credentials }) => {
  console.log("Verifying decrypted credentials inside Playwright...");

  expect(credentials.username).toBeTruthy();
  expect(credentials.password).toBeTruthy();

  console.log("USERNAME:", credentials.username);
  console.log("PASSWORD:", credentials.password);

  console.log("Credentials successfully injected into Playwright via fixture.");
});
