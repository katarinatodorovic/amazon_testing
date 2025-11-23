import "dotenv/config";
import { EncryptionUtils } from "../utils/EncryptionUtils";

const ENV = process.env.ENV || "local";
const file = `.env.encrypted.${ENV}`;

console.log(`Decrypting: ${file}`);

try {
  const decrypted = EncryptionUtils.decryptEncryptedEnv(file);
  console.log("Successfully decrypted environment variables:");
  console.log(decrypted);
} catch (err) {
  console.error("!!!!!!!Error while trying to decrypt:", err);
}
