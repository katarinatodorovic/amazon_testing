require("dotenv").config(); 
import { defineConfig, devices } from '@playwright/test';
import LocaleSetup, { LocaleKey } from "./utils/LocaleSetup";
import EnvSetup, {
  resolveRuntimeEnv,
  resolveRuntimeLocale,
  resolveRuntimeUseStaging,
} from "./utils/EnvSetup";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
/**
 * Locale & Environment Setup, detect locale override from CLI, e.g. LOCALE=DE
 * Build dynamic runtime environment config
 * Get environment config from EnvSetup
 * Resolve the locale based on the environment config
 * Get locale details
 * Determine if staging is used
 */

function buildRuntimeConfig(projectName: string) {
  const ENV = resolveRuntimeEnv(); 
  const envConf = EnvSetup[ENV]; 
  const finalLocale = resolveRuntimeLocale(envConf); 
  const locale = LocaleSetup[finalLocale]; 
  const useStaging = resolveRuntimeUseStaging(envConf); 
  // Set baseURL dynamically based on the environment and whether staging is enabled
  const baseURL =
    ENV === "ci"
      ? `${envConf.ciPrefix}${process.env.BRANCH}${envConf.ciSuffix}` 
      : useStaging
      ? locale.stagingURL 
      : locale.productionURL; 

 console.log(`
┌── Runtime Config ─────────────────────────
│ Project:     ${projectName}               
│ Environment: ${ENV}                       
│ Locale:      ${finalLocale}               
│ Staging:     ${useStaging}                
│ Base URL:    ${baseURL}                   
│ Language:    ${locale.language}           
└───────────────────────────────────────────
`);


  return {
    baseURL,
    locale: locale.language,
    extraHTTPHeaders: { "Accept-Language": locale.language },
  };
}

// Detect CI branch name dynamically
function getBranchName() {
  return (
    process.env.GITHUB_REF_NAME ||
    process.env.CI_COMMIT_REF_SLUG ||
    process.env.BITBUCKET_BRANCH ||
    process.env.BUILD_SOURCEBRANCHNAME ||
    undefined
  );
}

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html'],
    ['list', { includeFailureTrace: true }],
    ['./utils/GlobalLogger.ts']
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: false,
  },

  projects: [
    {
      name: 'Desktop',
      use: {
         ...devices['Desktop Chrome'],
         ...buildRuntimeConfig("Desktop"),
  },
    },

    {
      name: 'iPhone',
       use: {
         ...devices['iPhone 13'],
         ...buildRuntimeConfig("iPhone")
       },
    },

    {
      name: 'iPad',
       use: {
         ...devices['iPad Pro 11'],
         ...buildRuntimeConfig("iPad"),
      },
    },

//     {
//       name: 'local',
//       use: (() => {
//         const ENV = resolveRuntimeEnv();
//         const envConf = EnvSetup[ENV];
//         const finalLocale = resolveRuntimeLocale(envConf);
//         const locale = LocaleSetup[finalLocale];
//         const baseURL = locale.productionURL; 

//   console.log(`
// ┌── Runtime Config ─────────────────────────
// │ Project:     local                        
// │ Environment: ${ENV}                       
// │ Locale:      ${finalLocale}               
// │ Base URL:    ${baseURL}                   
// │ Language:    ${locale.language}           
// └───────────────────────────────────────────
// `);


//         return {
//           ...devices['Desktop Chrome'],
//           baseURL,
//           locale: locale.language,
//           extraHTTPHeaders: { 'Accept-Language': locale.language }
//         };
//       })(),
//     },

    {
      name: 'staging',
      use: buildRuntimeConfig("staging"),
    },

    {
      name: 'production',
      use: buildRuntimeConfig("production"),
    },

    {
      name: 'ci',
      use: (() => {
        const branch = getBranchName();
        const ENV = resolveRuntimeEnv();
        const envConf = EnvSetup[ENV];
        const finalLocale = resolveRuntimeLocale(envConf);
        const locale = LocaleSetup[finalLocale];
        const baseURL = `${envConf.ciPrefix}${branch}${envConf.ciSuffix}`;

       console.log(`
┌── Runtime Config ─────────────────────────
│ Project:     local                        
│ Environment: ${ENV}                       
│ Locale:      ${finalLocale}               
│ Base URL:    ${baseURL}                   
│ Language:    ${locale.language}          
└───────────────────────────────────────────
`);

        return {
          ...devices['Desktop Chrome'],
          baseURL,
          locale: locale.language,
          extraHTTPHeaders: { 'Accept-Language': locale.language }
        };
      })(),
    },
  ],
});
