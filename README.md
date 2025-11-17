# amazon_testing
Amazon Website Testing – Playwright Automation Framework
1. Project Structure
/pages – POM classes  
/tests – Test files  
/utils – Utilities  
/test_data – JSON input  
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
