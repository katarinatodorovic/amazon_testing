Amazon Testing – Playwright Automation Framework

This project is a structured end-to-end testing framework built with Playwright.
It supports a Page Object Model architecture, encrypted credentials, multi-environment execution (different locale, differnt environments), test fixtures, and optional authenticated test sessions through Playwright storage state.

1. Project Structure
/pages            - Page Object Model classes
/tests            - Test files
/tests/fixtures   - Custom fixtures (for example, credentials)
/utils            - Framework utilities
/test_data        - JSON test data input
/config           - Encrypted and plaintext environment files
/scripts          - Encryption and decryption scripts
/storageStates    - Authentication session state (optional)

2. Authentication and Credentials Handling

The framework includes a secure, environment-based credential system.

Key points:

Plaintext secrets are stored locally in config/.env.plain.<env> and are ignored by Git
These plaintext files are encrypted using AES-256 and stored as config/.env.encrypted.<env>
At runtime, the framework automatically decrypts the selected environment file
Decrypted credentials are injected into Playwright tests through a typed fixture
A global setup file can log in once and save the authenticated session to a storage state file
Tests can optionally run using the saved authenticated state without performing login again

Disclaimer:
The login flow is not currently used in the active test suite. However, the framework already includes full support for encrypted credentials, a login page object, a credentials fixture, and a global setup mechanism to enable authentication when an appropriate test environment becomes available.

3. Encryption Commands

Encrypt credentials for each environment using the following commands:

npm run encrypt-env
npm run encrypt-env:staging
npm run encrypt-env:production

4. Template for config/.env.plain.local

Below is a placeholder example of the plaintext environment file.
Actual secrets should not be committed or shared.

SALT=<your-salt>
USERNAME=exampleUser
PASSWORD=examplePassword123

5. Installation

Install dependencies:

npm install
npx playwright install

6. Running Tests
Full End-to-End Suite
npm run test:e2e

Smoke Tests
npm run test:e2e:smoke

Production Example (US Locale)
npm run test:production:us

Germany Locale Example
npm run test:production:de

CI Pipeline Execution
npm run test:e2e:ci

7. Device-Specific Execution (Example: TC015)

Desktop:

npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=Desktop


iPad:

npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=iPad


iPhone:

npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=iPhone
 