import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { WaitUtils } from '../utils/WaitUtils';
import { LoggerUtility } from '../utils/LoggerUtility';

/**
 * Class representing the Amazon Home Page 
 */
export class AmazonHomePage extends BasePage {

  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly suggestedSearches: Locator;
  readonly desktopSearch: Locator;
  readonly mobileSearch: Locator;
  readonly noResultsMessage: Locator;
  readonly addressSelection: Locator;
  readonly dismissLocationModal: Locator;

  constructor(page: Page) {
  super(page);

    this.searchBox = this.page.locator("#twotabsearchtextbox");
    this.noResultsMessage = this.page.locator('text=Need help?');
    this.searchButton = this.page.locator('input.nav-input[type="submit"]');
    this.suggestedSearches = this.page.locator(".s-suggestion");
    this.desktopSearch = this.page.locator("#twotabsearchtextbox");
    this.mobileSearch = this.page.locator(
      'input[type="search"], input[aria-label="Search Amazon"], #nav-bb-search'
    );
    this.addressSelection = this.page.locator('button[name="glowDoneButton"]');
    this.dismissLocationModal = this.page.locator
    ('input.a-button-input[data-action-type="DISMISS"]');
  }

  /**
   * Navigate to the Amazon home page and wait for search box visibility
   * dismissing location modal if it appears
   */
  async navigateToHomePage(): Promise<void> {

    LoggerUtility.info("Navigating to Amazon home page ");
    await this.goto("/");  
    await WaitUtils.forElementToBeVisible(this.searchBox, 15_000);
    LoggerUtility.info("Successfully loaded Amazon homepage.");

    if (await this.dismissLocationModal.isVisible().catch(() => false)) {
      LoggerUtility.info("Dismissing location modal");
      await this.dismissLocationModal.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
 * Function to perform search eather by clicking Enter key or Search button
 * It supports both mobile and desktop views
 * I.G in the future for extensive mobile support, 
 * function related to mobile testing will be stored in different class
 * @param item - text to type in search field
 * @param mode - "enter" or "button"
 */
async performSearch(item: string, mode: "enter" | "button" = "button"): Promise<void> {
   const viewportWidth = this.page.viewportSize()?.width ?? 1200;
   const searchInput = viewportWidth < 600 ? this.mobileSearch.first() : this.desktopSearch;
   await this.typeTextIntoField(searchInput, item);

   if (mode === "button") {
     LoggerUtility.info(`Searching for item using Search button key: ${item}`);
     await this.searchButton.click();
   } else {
     LoggerUtility.info(`Searching for item using Enter key: ${item}`);
     await searchInput.press("Enter");
   }
   await this.page.waitForTimeout(8000);
  }
  /**
   * Search using the search button
   * @param item - item to search for
   */
  async searchForItem(item: string): Promise<void> {
  LoggerUtility.info(`Searching for item using Search button key: ${item}`);
  await this.performSearch(item, "button");
  LoggerUtility.info(`Search completed using Search button for: ${item}`);
}


  /**
   * Search using the Enter key
   * @param item - item to search for
   */
  async searchUsingEnterKey(item: string): Promise<void> {
    LoggerUtility.info(`Searching for item using Enter key: ${item}`);
    await this.performSearch(item, "enter");
    LoggerUtility.info(`Search completed using Enter key for: ${item}`);
  }

  /**
   * Clear the search box
   */
  async clearSearchBox(): Promise<void> {
    LoggerUtility.info("Clearing search box");
    await this.typeTextIntoField(this.searchBox, "");
    LoggerUtility.info("Search box cleared");
  }
}