import { LocaleKey } from "./LocaleSetup";

/**
 * EnvSetup for configuration of different environments
 */
export type EnvironmentKey = "local" | "staging" | "production" | "ci";

interface EnvironmentConfig {
  defaultLocale: LocaleKey;
  useStagingStoreURL: boolean;
  ciPrefix?: string;
  ciSuffix?: string;
}

const EnvSetup: Record<EnvironmentKey, EnvironmentConfig> = {
  local: {
    defaultLocale: "US",
    useStagingStoreURL: false,    
  },

  staging: {
    defaultLocale: "US",
    useStagingStoreURL: true,    
  },

  production: {
    defaultLocale: "US",
    useStagingStoreURL: false,   
  },

  ci: {
    defaultLocale: "US",
    useStagingStoreURL: true,    
    ciPrefix: "https://dev-amazon-",
    ciSuffix: ".mydomain.com",
  },
};

 /**
  * Functions to resolve environment settings from CLI or env variables
  */
export function resolveRuntimeEnv(): EnvironmentKey {
  const cliEnv = process.env.ENV?.toLowerCase();
  const possible: EnvironmentKey[] = ["local", "staging", "production", "ci"];

  if (cliEnv && possible.includes(cliEnv as EnvironmentKey)) {
    return cliEnv as EnvironmentKey;
  }
  return "production"; 
}
/**  
 * Functions to resolve locale and staging usage from CLI or env variables
 */
export function resolveRuntimeLocale(envConf: EnvironmentConfig): LocaleKey {
  return (process.env.LOCALE?.toUpperCase() as LocaleKey) || envConf.defaultLocale;
}

/**
 * Functions to resolve locale and staging usage from CLI or env variables
 */
export function resolveRuntimeUseStaging(envConf: EnvironmentConfig): boolean {
  if (process.env.USE_STAGING !== undefined) {
    return process.env.USE_STAGING === "true";
  }
  return envConf.useStagingStoreURL;
}
export default EnvSetup;