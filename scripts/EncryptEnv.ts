import "dotenv/config";
import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";

export class EncryptEnv {
  private static readonly CONFIG_DIR = path.resolve(process.cwd(), "config");

  private static readonly SENSITIVE_KEYS = [
    "USERNAME",
    "PASSWORD",
    "API_KEY",
    "TOKEN"
  ];

  private static getSalt(): string {
    const salt = process.env.SALT;
    if (!salt) {
      throw new Error(
        "Missing SALT in environment variables. SALT MUST be provided via process.env."
      );
    }
    return salt;
  }

  private static ensureFileExists(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required plaintext env file not found → ${filePath}`);
    }
  }

  private static parseLine(line: string) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return { type: "raw", raw: line } as const;
    }

    const idx = line.indexOf("=");

    if (idx === -1) return { type: "raw", raw: line } as const;

    const key = line.substring(0, idx).trim();
    const value = line.substring(idx + 1);

    return { type: "entry", key, value } as const;
  }

  private static encryptValue(value: string, salt: string): string {
    return CryptoJS.AES.encrypt(value, salt).toString();
  }

  static encryptEnv(): void {
    const TARGET_ENV = process.env.ENV || "local";

    const salt = EncryptEnv.getSalt();

    const inputPlainEnv = path.join(
      EncryptEnv.CONFIG_DIR,
      `.env.plain.${TARGET_ENV}`
    );

    EncryptEnv.ensureFileExists(inputPlainEnv);

    const lines = fs.readFileSync(inputPlainEnv, "utf8").split(/\r?\n/);

    const encryptedLines = lines.map((line) => {
      const parsed = EncryptEnv.parseLine(line);
      if (parsed.type !== "entry") return line;

      if (parsed.key === "SALT") return line;

      if (EncryptEnv.SENSITIVE_KEYS.includes(parsed.key)) {
        const encrypted = EncryptEnv.encryptValue(parsed.value, salt);
        return `${parsed.key}=${encrypted}`;
      }

      return line;
    });

    const outputFile = path.join(
      EncryptEnv.CONFIG_DIR,
      `.env.encrypted.${TARGET_ENV}`
    );

    fs.writeFileSync(outputFile, encryptedLines.join("\n"), "utf8");

    console.log(`✔ Encrypted → ${outputFile}`);
    console.log(`✔ Use ENV=${TARGET_ENV} to load these credentials.`);
  }

  static decryptToConsole(): void {
    const TARGET_ENV = process.env.ENV || "local";

    const salt = EncryptEnv.getSalt();

    const encryptedFile = path.join(
      EncryptEnv.CONFIG_DIR,
      `.env.encrypted.${TARGET_ENV}`
    );

    EncryptEnv.ensureFileExists(encryptedFile);

    const lines = fs.readFileSync(encryptedFile, "utf8").split(/\r?\n/);

    console.log(`\nDecrypted values for ENV=${TARGET_ENV}:\n`);

    lines.forEach((line) => {
      const parsed = EncryptEnv.parseLine(line);
      if (parsed.type !== "entry") {
        console.log(line);
        return;
      }

      if (parsed.key === "SALT") {
        console.log(line);
        return;
      }

      const bytes = CryptoJS.AES.decrypt(parsed.value, salt);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      console.log(`${parsed.key}=${decrypted || "[UNABLE TO DECRYPT]"}`);
    });

    console.log();
  }

  static runFromCLI(): void {
    const mode = process.argv[2];

    if (mode === "decrypt-console") {
      EncryptEnv.decryptToConsole();
      return;
    }

    EncryptEnv.encryptEnv();
  }
}

if (require.main === module) {
  EncryptEnv.runFromCLI();
}
