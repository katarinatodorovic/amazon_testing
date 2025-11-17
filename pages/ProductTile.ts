import { Locator, Page } from '@playwright/test';
import { WaitUtils } from '../utils/WaitUtils';
import { LoggerUtility } from '../utils/LoggerUtility';

/**
 * Class representing a product tile on the search results page.
 */
export class ProductTile {
  private readonly tileCard: Locator;
  private readonly page: Page;  
  readonly tileCardIndex: number;
  readonly priceLocator: Locator;
  readonly titleLocator: Locator;
  readonly imgElement: Locator;
  
  constructor(page: Page, index: number) {
    this.page = page;  
    this.tileCardIndex = index;
    this.tileCard = page.locator('[data-component-type="s-search-result"]').nth(index);
    this.priceLocator = this.tileCard.locator(
      "span.a-price > span.a-offscreen, span.a-price span.a-price-whole"
    );
    this.titleLocator = this.tileCard.locator(
      "h2 a span.a-size-medium, h2 a span.a-size-base-plus, h2 span.a-size-medium, h2 span.a-size-base-plus, h2 span[role=\"heading\"], [data-cy=\"title-recipe\"]"
    );
    this.imgElement = this.tileCard.locator("img.s-image").first();
  }

  /**
   * Waits until the product tile becomes visible 
   * @param timeout - maximum wait time in milliseconds (default: 10 sec)
   */
  async waitForTileVisible(timeout = 10_000): Promise<void> {
    LoggerUtility.info("Waiting for product tile to become visible...");
    await this.tileCard.scrollIntoViewIfNeeded();
    await WaitUtils.forElementToBeVisible(this.tileCard, timeout);
  }

  /**
   * Extracts the product image URL without scrolling 
   * @returns - image URL or empty string if not found
   */
  async getImageFast(): Promise<string> {
    const src = await this.imgElement.getAttribute("src") || 
    await this.imgElement.getAttribute("data-src") || "";
    return src || "";
  }

  /**
   * Extracts the product image URL and waits for visibility 
   * @returns - image URL or empty string if not found
   */
  async getImage(): Promise<string> {
    LoggerUtility.info("Getting product image URL and waiting for visibility...");
    await this.tileCard.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);  

    const imageElement = this.imgElement;

    // Wait for image to be visible, polling every 300ms
    let visible = await WaitUtils.waitForVisibilityWithPolling(imageElement, 6, 300);
    if (!visible) {
      LoggerUtility.warn("Image not visible for Card product tile.");
      return "";
    }

    const src = await imageElement.getAttribute("src") || 
    await imageElement.getAttribute("data-src") || "";
    LoggerUtility.info(`Product image URL: ${src}`);
    return src;
  }

    /**
   * Returns a new ProductTile instance for the given index
   * @param index - the index of the product tile
   * @returns - a new ProductTile instance
   */
    getTileCard(index: number): ProductTile {
    return new ProductTile(this.page, index);
    }

  /**
   * Extracts the product price and waits for visibility 
   */
  async getPrice(): Promise<string> {
    await this.tileCard.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(200);  

    const priceElement = this.priceLocator.first();

    // Wait for price to be visible, polling every 200ms 
    let visible = await WaitUtils.waitForVisibilityWithPolling(priceElement, 6, 300);
    if (!visible) {
      LoggerUtility.debug("Price missing for product tile");
      return "";   
    }

    const price = (await priceElement.innerText()).trim();
    return price;
  }

  /**
   * Extracts the product title and waits for visibility 
   */
  async getTitle(): Promise<string> {
    LoggerUtility.info("Getting product title...");
    await this.tileCard.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(250);  

    // Wait for title to be visible, polling every 300ms
    let visible = await WaitUtils.waitForVisibilityWithPolling(this.titleLocator.first(), 6, 300);
    if (!visible) {
      throw new Error("No visible title found for product tile.");
    }

    const text = (await this.titleLocator.first().innerText()).trim();
    LoggerUtility.debug(`Product title: ${text}`);
    return text;
  }
}