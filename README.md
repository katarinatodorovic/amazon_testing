# amazon_testing
Amazon Website Testing – Playwright Automation Framework
1. Project Structure
/pages – POM classes  
/tests – Test files 
/tests/fixtures - fixtures 
/utils – Utilities  
/test_data – JSON input  

Authentication & Credentials Handling

Plaintext secrets live in config/.env.plain.<env> (local only, ignored by Git)
These are encrypted using AES-256 and stored as config/.env.encrypted.<env>
A decryption step loads environment-specific encrypted values at runtime
Decrypted credentials are passed to Playwright via a typed fixture
A global setup logs in once and stores authentication state
All tests reuse this stored session, skipping the login step
(Disclaimer: the authentication and login flow are not actively used in the current test suite, however the framework already includes full infrastructure support for it.)

Encryption commands
npm run encrypt-env
npm run encrypt-env:staging
npm run encrypt-env:production

Template for .env.plain.local (example values only)
SALT=<your-salt>
USERNAME=exampleUser
PASSWORD=examplePassword123

2.Installation
npm install  
npx playwright install  
3.Running Tests
Full E2E suite:
npm run test:e2e
Smoke tests:
npm run test:e2e:smoke
Production – US locale:  
npm run test:production:us
Germany-example:
npm run test:production:de
CI execution-example:
npm run test:e2e:ci
Device-Specific Execution-TC015
Desktop:
npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=Desktop
iPad:
npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=iPad
iPhone:
npx cross-env ENV=production LOCALE=US USE_STAGING=false npx playwright test tests/TC015_test_responsive.spec.ts --project=iPhone
