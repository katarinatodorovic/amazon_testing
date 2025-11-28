import { Page, Locator, expect } from '@playwright/test';
import { LoggerUtility } from '../utils/LoggerUtility';
import { CookieManager } from '../utils/CookieManager';
import LocaleSetup, { LocaleKey } from '../utils/LocaleSetup';

/**
 * Base class for all Page Object classes
 */
export class BasePage {
  readonly page: Page;
  
  readonly amazonLogo: Locator;
  readonly legacyBanner: Locator;
  readonly dismissLocationModal: Locator;
  readonly desktopSearch: Locator;
  readonly mobileSearch: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;


    this.amazonLogo = this.page.locator('a#nav-logo-sprites, a.nav-logo-link');
    this.legacyBanner = page.locator('text=Shop Amazon Devices with Alexa');
    this.dismissLocationModal = page.locator('#glow-toaster .a-button-close');
    this.desktopSearch = this.page.locator("#twotabsearchtextbox");
    this.mobileSearch = this.page.locator(
      'input[type="search"], input[aria-label="Search Amazon"], #nav-bb-search'
    );
    this.continueButton = this.page.locator('button.a-button-text[type="submit"]');
  }
  /**
   * Navigate using to base URL
   * If no path is provided, navigate to "/"
   * @param path - The path to navigate to
   */
  async goto(path: string = "/"): Promise<void> {
    LoggerUtility.info(`Navigating to: ${path}`);
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
    await this.page.waitForTimeout(500);

    const localeKey = (process.env.LOCALE?.toUpperCase() || "US") as LocaleKey;  
    const locale = localeKey.toLowerCase(); 
    const currency = LocaleSetup[localeKey].currency;

    LoggerUtility.info(`Applying locale cookies for ${localeKey}`);
   
    // Apply locale cookies
    await CookieManager.applyLocaleCookies(this.page, localeKey); 
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(800);

    // Handle old Amazon page 
    if (await this.legacyBanner.isVisible().catch(() => false)) {
      LoggerUtility.warn("Old Amazon page detected. Redirecting...");
      // use relative URL so baseURL applies
        await this.page.goto
        (`/?language=${locale}_${locale.toUpperCase()}&currency=${currency}`, { 
         waitUntil: "domcontentloaded",
        });
      await this.page.waitForTimeout(1200);
    }

    if (await this.dismissLocationModal.isVisible()) await this.dismissLocationModal.click();
    

   //assess which search locator to use based on viewport size
    const viewportWidth = this.page.viewportSize()?.width ?? 1200;

    if (viewportWidth < 600) {

      LoggerUtility.info("Using mobile search locator");
      await expect(this.mobileSearch.first()).toBeVisible({ timeout: 15_000 })
      await this.handleContinueShoppingWindow();
    } else {

      LoggerUtility.info("Using desktop/tablet search locator");
      //await expect(this.desktopSearch).toBeVisible({ timeout: 15_000 });
      await this.handleContinueShoppingWindow();
        }   
    }

  /**
   * Handles the Amazon continue shopping window 
   */
  async handleContinueShoppingWindow(): Promise<void> {
    if (await this.continueButton.isVisible().catch(() => false)) {
      LoggerUtility.warn("Amazon continue shopping window detected, clicking continue.");
      await this.continueButton.click();
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(500);
    }
  }
  /**
   * Clear and type text into an input field
   * @param locator - the locator of the input field
   * @param text - the text to type
   */
  async typeTextIntoField(locator: Locator, text: string): Promise<void> {
    await locator.fill("");
    await locator.fill(text);
  }

  /**
   * Get trimmed text content from a locator
   * @param locator - the locator to get text from
   * @returns - text from the element if available, else empty string
   */
  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text ? text.trim() : "";
  }

  /**
   * Wait for locator to be visible
   * @param locator - the locator to wait for
   * @param timeout - maximum wait time in milliseconds (default: 10_000 ms)  
   */
  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }
}
