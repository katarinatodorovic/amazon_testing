import CryptoJS from "crypto-js";

export class EncryptionUtils {

  private static getSalt(): string {
    const salt = process.env.SALT;
    if (!salt) {
      throw new Error("Missing SALT environment variable for EncryptionUtils");
    }
    return salt;
  }

  /** 
   * Encrypts a plain text string using AES encryption
   * with a salt from environment variables
   */
  static encrypt(plainText: string): string {
    const salt = EncryptionUtils.getSalt();
    return CryptoJS.AES.encrypt(plainText, salt).toString();
  }

  /** 
   * Decrypts an AES-encrypted cipher text string
   * with a salt from environment variables
   */
  static decrypt(cipherText: string): string {
    const salt = EncryptionUtils.getSalt();
    const bytes = CryptoJS.AES.decrypt(cipherText, salt);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Decryption failed, possibly wrong SALT or invalid cipher.");
    }
    return decrypted;
  }
}
