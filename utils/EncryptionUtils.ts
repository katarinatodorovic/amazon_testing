import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";

export class EncryptionUtils {

  /**
   * Decrypts an environment-specific encrypted env file
   * e.g. ".env.encrypted.local", ".env.encrypted.staging"
   */
  static decryptEncryptedEnv(fileName: string): Record<string, string> {
    // SALT MUST come from process.env, not from decrypted file
    const salt = process.env.SALT;
    if (!salt) {
      throw new Error(
        "Missing SALT environment variable. SALT must be supplied via process.env.\n" +
        "Create a root-level .env with SALT=<value> so dotenv can load it."
      );
    }

    // Resolve the encrypted file from config folder
    const encryptedFilePath = path.join(process.cwd(), "config", fileName);

    if (!fs.existsSync(encryptedFilePath)) {
      throw new Error(
        `Encrypted env file '${fileName}' not found in config/. ` +
        `You must run: npm run encrypt-env <env>`
      );
    }

    const decryptedValues: Record<string, string> = {};
    const lines = fs.readFileSync(encryptedFilePath, "utf8").split(/\r?\n/);

    for (const line of lines) {
      const idx = line.indexOf("=");
      if (idx === -1) continue;

      const key = line.substring(0, idx).trim();
      const encryptedValue = line.substring(idx + 1);

      if (!encryptedValue) continue;

      // SALT is copied as is (never decrypted)
      if (key === "SALT") {
        decryptedValues[key] = encryptedValue;
        continue;
      }

      try {
        // Attempt AES decrypt
        const bytes = CryptoJS.AES.decrypt(encryptedValue, salt);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (decrypted) {
          decryptedValues[key] = decrypted;
        } else {
          // keep original value if decryption fails
          decryptedValues[key] = encryptedValue;
        }

      } catch {
        // If decrypt throws, return encrypted value untouched
        decryptedValues[key] = encryptedValue;
      }
    }

    return decryptedValues;
  }
}
