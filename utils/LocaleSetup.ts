/**
  * Class that sets up locale configurations for different regions
 */

export const LocaleSetup = {
  US: {
    productionURL: "https://www.amazon.com",
    stagingURL:    "https://amazon.staging.com",
    language:      "en_US",
    currency:      "USD",
    zip:           "10001",
  },

  DE: {
    productionURL: "https://www.amazon.de",
    stagingURL:    "https://amazon.staging.de",
    language:      "de_DE",
    currency:      "EUR",
    zip:           "10115",
  },

  UK: {
    productionURL: "https://www.amazon.co.uk",
    stagingURL:    "https://amazon.staging.uk",
    language:      "en_GB",
    currency:      "GBP",
    zip:           "SW1A",
  }
};

export type LocaleKey = keyof typeof LocaleSetup;

export default LocaleSetup;
