import { chromium, devices } from "@playwright/test";
import LoginPageDummy from "./pages/LoginPageDummy";
import LocaleSetup from "./utils/LocaleSetup";
import EnvSetup, {
  resolveRuntimeEnv,
  resolveRuntimeLocale,
  resolveRuntimeUseStaging
} from "./utils/EnvSetup";

export default async function globalSetup() {
  const ENV = resolveRuntimeEnv();
  const envConf = EnvSetup[ENV];
  const finalLocale = resolveRuntimeLocale(envConf);
  const locale = LocaleSetup[finalLocale];
  const useStaging = resolveRuntimeUseStaging(envConf);

  const baseURL =
    ENV === "ci"
      ? `${envConf.ciPrefix}${process.env.BRANCH}${envConf.ciSuffix}`
      : useStaging
      ? locale.stagingURL
      : locale.productionURL;

  //Headless or headed mode based on env variable
  const browser = await chromium.launch({ headless: false });

  //Device/emulation settings
  const context = await browser.newContext({
    ...devices["Desktop Chrome"],
    baseURL: baseURL,
    locale: locale.language  
  });

  const page = await context.newPage();
  await page.goto("/");

  const loginPage = new LoginPageDummy(page);
  await loginPage.login(
    process.env.DECRYPTED_USERNAME!,
    process.env.DECRYPTED_PASSWORD!
  );

  // Save authenticated state
  await context.storageState({
    path: "storageStates/authState.json"
  });

  await browser.close();
}
