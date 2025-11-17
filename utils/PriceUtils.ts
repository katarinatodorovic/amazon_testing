/**
 * Class with helper methods for price-related operations
 */

import { ProductTile } from "../pages/ProductTile";
import { LoggerUtility } from "./LoggerUtility";

export class PriceUtils {
  /**
   * Parses a currency string (e.g. "$1,234.56" or "1.234,56 €")
   * into a numeric value. Returns "null" if parsing fails
   * 
   *  "$12.34" -> 12.34
   * @param text - the currency string to parse
   * @returns numeric value or null if parsing fails
   */
 static parseCurrency(text: string): number | null {
 // LoggerUtility.info(`Parsing currency string: ${text}`);
  if (!text) return null;

  let raw = text.replace(/\s+/g, '').trim();

  if (!raw) return null;

  // Skip RANGES
  if (
    // dash
    raw.includes('–') ||
    // hyphen
    raw.includes('-') ||
    /to/i.test(raw)
  ) {
    return null;
  }

  // Skip "from" prices
  const lower = raw.toLowerCase();
  if (lower.startsWith('from') || lower.startsWith('ab')) {
    return null;
  }

  // Remove currency 
  raw = raw.replace(/[^\d.,]/g, '');

  if (!raw) return null;

  // Remove all but last dot/comma
  const lastDot = raw.lastIndexOf('.');
  const lastComma = raw.lastIndexOf(',');

  // EU format
  if (lastComma > lastDot) {
    raw = raw.replace(/\./g, '').replace(',', '.');
  }
  // US format
  else {
    raw = raw.replace(/,/g, '');  
  }

  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

  /**
   * Calculates the average of an array of numeric price values
   * Returns null if the array is empty or invalid
   *
   * @param prices - array of numeric prices
   * @returns average value rounded to 2 decimals, or null
   */
  static calculateAverage(prices: number[]): number | null {
    LoggerUtility.info(`Calculating average of prices: ${prices}`);
    if (!prices?.length) return null;
    const sum = prices.reduce((a, b) => a + b, 0);
    return Number((sum / prices.length).toFixed(2));
  }

  /**
   * Finds the highest and lowest prices in an array
   * Returns null if no valid prices exist
   * @param prices - array of numeric prices
   * @return min and max price
   */
  static getPriceRange(prices: number[]): { min: number; max: number } | null {
    LoggerUtility.info(`Getting price range from prices: ${prices}`);
    if (!prices?.length) return null;
    const valid = prices.filter((p) => typeof p === 'number' && !isNaN(p));
    if (!valid.length) return null;
    return { min: Math.min(...valid), max: Math.max(...valid) };
  }
/**
 * Determines if a price should be treated as missing
 * If the string contains NO DIGITS → it's NOT a price → missing
 * @param text - the price string to evaluate
 * @returns true if price is missing, false otherwise 
 */
  static ignoreMissingPrice(text: string | null | undefined): boolean {
    LoggerUtility.info(`Checking if price is missing: "${text}"`);
    if (!text) return true;                       
    const cleaned = text.trim();
    if (cleaned === "") return true;             
    if (!/\d/.test(cleaned)) return true;         
    return false;                                 
  } 
  
/**
 * Function to extract valid prices from an array of product tiles
 * @param tiles 
 * @returns 
 */
static async extractValidPricesFromTiles(
  tiles: { getPrice: () => Promise<string> }[]
): Promise<number[]> {
  const prices: number[] = [];

  for (const tile of tiles) {
    let raw = "";

    try {
      raw = await tile.getPrice();
    } catch {
      continue;
    }

    if (PriceUtils.ignoreMissingPrice(raw)) continue;

    const parsed = PriceUtils.parseCurrency(raw);
    if (parsed !== null) prices.push(parsed);
  }

  return prices;
}
}
