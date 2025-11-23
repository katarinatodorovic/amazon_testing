import { Page } from "@playwright/test";
import LocaleSetup, { LocaleKey } from "./LocaleSetup";

/**
 * Class that adds necessary cookies for locale and currency preferences 
 */
export class CookieManager {

  /** 
   * Applies locale and currency cookies based on the given locale key from CLI
   * @param page - page object
   * @param localeKey - key representing the desired locale from LocaleSetup and CLI
   */
  static async applyLocaleCookies(page: Page, localeKey: LocaleKey) {
    const locale = LocaleSetup[localeKey];
    const domain = new URL(locale.productionURL).hostname;

    await page.context().addCookies([
      {
        name: "lc-main",
        value: locale.language,
        domain,
        path: "/",
        secure: true,
        httpOnly: false,
        sameSite: "None"
      },
      {
        name: "i18n-prefs",
        value: locale.currency,
        domain,
        path: "/",
        secure: true,
        httpOnly: false,
        sameSite: "None"
      }
    ]);
  }
}
