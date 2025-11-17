import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { WaitUtils } from '../utils/WaitUtils';
import { PriceUtils } from '../utils/PriceUtils';
import { LoggerUtility } from '../utils/LoggerUtility';
import { ProductTile } from '../pages/ProductTile';


/**
 * Class representing the Search results page
 */
export class SearchResultsPage extends BasePage {
  readonly nextButton: Locator;
  readonly resultLabel: Locator;
  readonly allTilesCards: Locator;
  readonly dismissLocationModal: Locator;
  readonly pagination: Locator;
  readonly labelText: Locator;
  

  constructor(page: Page) {
    super(page);

    this.nextButton = page.locator("a.s-pagination-next");
    this.resultLabel = page.locator("span:has-text(\"of\")").first();
    this.allTilesCards = this.page.locator('[data-component-type="s-search-result"]');
    this.dismissLocationModal = page.locator('input.a-button-input[data-action-type="DISMISS"]');
    this.pagination = this.page.locator("span.s-pagination-item");
    this.labelText = this.page.locator('span[data-component-type="s-result-info-bar"]').first();

  }

/**
 * Waits for product results to become visible
 * @param timeout Maximum wait time in milliseconds (default: 15 seconds)
 */
async waitForResults(timeout = 15_000): Promise<void> {
  LoggerUtility.info("Waiting for search results...");

  await this.allTilesCards.first().waitFor({ state: "attached", timeout });
  await WaitUtils.waitForDomSearchResultsStable(this.page);
  await this.page.waitForTimeout(400);

  LoggerUtility.warn("No product tiles found on this page.");
}

/** 
 * Get all product cards count
 * @return - the count of product tiles as a number
 */
  async getNumberOfCards(): Promise<number> {
    LoggerUtility.info("Getting number of product cards...");
    return await this.allTilesCards.count();
  }

  /**
   * Get top product titles for validation limited to a specified number
   * @returns - an array of product titles (strings).
   */
  async getTopProductTitles(limit = 11): Promise<string[]> {
  LoggerUtility.info("Getting top product titles...");
  await this.allTilesCards.first().scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(400);

  await this.waitUntilAtLeastNResults(limit);

  const titles: string[] = [];
  const count = await this.allTilesCards.count();
  const productTile = new ProductTile(this.page, 0);

  // Limit to passed count
  for (let i = 0; i < Math.min(limit, count); i++) {
    const tile = productTile.getTileCard(i);
    await tile.waitForTileVisible(6000);
    const title = await tile.getTitle();
    titles.push(title);
  }

  return titles;
  }

/**
 * Extracts the result count from the UI label text
 * @return - the extracted result count as a number, or null if not found
 */
 
async getResultLabelText(): Promise<string | null> {
  LoggerUtility.info("Getting result label text...");
  const text = await this.labelText.textContent().catch(() => null);
  return text?.trim() || null;
}

/**
 * Extracts the total result count from the results summary label
 * @returns - the total result count as a number, or null if not found
 */
async getResultLabelCount(): Promise<number | null> {
  LoggerUtility.info("Getting result label count...");
  const text = await this.getResultLabelText();
  if (!text) return null;

  const match = text.match(/1[\s--]+(\d+)/);
  if (!match) return null;

  return parseInt(match[1], 10);
}

  /**
   * Counts all visible product cards on the current 
   * @return - the count of product tiles as a number
   */
  async getProductCountFromDOM(): Promise<number> {
    LoggerUtility.info("Getting product count from DOM...");
    const count = await this.allTilesCards.count();
    LoggerUtility.info(`Visible product count on page: ${count}`);
    return count;
  }

  
  private async scrollToPagination(): Promise<void> {
  LoggerUtility.info("Scrolling to pagination bar…");
  await this.nextButton.waitFor({ state: "attached", timeout: 5000 }).catch(() => {});
  await this.nextButton.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(500);
}



  /**
   * Navigates to the next result page if available.
   */
  async goToNextPage(): Promise<boolean> {
  LoggerUtility.info("Attempting to navigate to next page...");

  await this.scrollToPagination();
  await this.page.waitForLoadState("domcontentloaded");
  const hasNext = await this.nextButton.isVisible().catch(() => false);

  if (!hasNext) {
    LoggerUtility.warn("Next page button not visible");
    return false;
  }

  const oldUrl = this.page.url();

  LoggerUtility.info("Next page button found, clicking...");

  // Trigger navigation and wait until URL changes
  await Promise.all([
    this.page.waitForURL(
      url => url.toString() !== oldUrl,
      { timeout: 15_000 }
    ),
    this.nextButton.click()
  ]);

  LoggerUtility.info(`Navigated: ${oldUrl} → ${this.page.url()}`);
  await this.waitForResults(15_000);

  LoggerUtility.info("Successfully loaded next results page.");
  return true;
}

/**
 * Function to wait until at least N results are loaded
 * @param n - minimum number of results to wait for
 * @param timeout - maximum wait time in milliseconds (default: 10 sec) 
 */
async waitUntilAtLeastNResults(n: number, timeout = 10_000): Promise<void> {
  LoggerUtility.info(`Waiting until at least ${n} results are loaded...`);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const count = await this.allTilesCards.count();
    if (count >= n) return;
    await this.page.waitForTimeout(250);
  }
  throw new Error(`Timed out waiting for at least ${n} results`);
}

/**
 * Extracts detailed info for a product tile at the given index
 * @param index - index of the product tile
 */
async extractItemInfo(index: number) {
  LoggerUtility.info(`Extracting item info for product tile at index ${index}...`);
  const tile = new ProductTile(this.page, index);

  const title = await tile.getTitle().catch(() => "");
  const priceRaw = await tile.getPrice().catch(() => "");
  const imageVisible = (await tile.getImageFast()) !== "";

  const price = PriceUtils.parseCurrency(priceRaw);

  LoggerUtility.info(
    `Item #${index + 1}: "${title}" | Price: ${priceRaw} | Image visible: ${imageVisible}`
  );

  return { title, imageVisible, price, priceRaw };
}


  /**
   * Calculates the average price for all valid products on the current page.
   */
  async averagePriceOnPage(): Promise<number | null> {
  LoggerUtility.info("Calculating average price for products on the page...");
  const productTile = new ProductTile(this.page, 0);
  const count = await this.allTilesCards.count();
  const prices: number[] = [];

  for (let i = 0; i < count; i++) {
    const tile = productTile.getTileCard(i);

    let rawPrice = "";

    try {
      rawPrice = await tile.getPrice();
    } catch {
      continue;
    }

    const cleaned = rawPrice?.trim() ?? "";

    // Skip missing prices
    if (!cleaned) continue;

    const parsed = PriceUtils.parseCurrency(cleaned);

    if (parsed !== null) prices.push(parsed);
  }

  // if no prices found, return null
  if (prices.length === 0) return null;

  return PriceUtils.calculateAverage(prices);
}

async getAllTiles(): Promise<ProductTile[]> {
  LoggerUtility.info("Getting all product tiles on the page...");
  const count = await this.allTilesCards.count();
  const tiles: ProductTile[] = [];

  for (let i = 0; i < count; i++) {
    tiles.push(new ProductTile(this.page, i));
  }

  return tiles;
}
/**
 * Scrolls until the pagination bar (page numbers) is visible.
 * This ensures Amazon has fully loaded 
 */
async scrollUntilPaginationVisible(timeout = 10_000): Promise<void> {
  LoggerUtility.info("Scrolling until pagination bar is visible...");
  const start = Date.now();
  while (Date.now() - start < timeout) {
    // Stop if pagination is visible
    if (await this.pagination.last().isVisible().catch(() => false)) {
      LoggerUtility.info("Pagination bar is now visible, full page loaded.");
      return;
    }

    await this.page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    await this.page.waitForTimeout(500);
  }

  LoggerUtility.warn("Pagination bar did not appear within timeout.");
 }
}