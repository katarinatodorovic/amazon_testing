import fs from 'fs';
import path from 'path';
import { LoggerUtility } from './LoggerUtility';

export class JsonTestDataReader {

  /**
   * Loads a JSON file from the test_data folder 
   * @param fileName - name of the JSON file
   */
  static loadFile(fileName: string): any {
    LoggerUtility.info(`Loading JSON file: ${fileName}`);
    const filePath = path.resolve(process.cwd(), "test_data", fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`JSON file not found at: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  }

  /**
   * Retrieve a value from a JSON file
   * @param fileName - JSON file name
   * @param key - JSON field name
   */
  static getJSONValue(fileName: string, key: string): any {
    LoggerUtility.info(`Retrieving key "${key}" from JSON file: ${fileName}`);
    const data = this.loadFile(fileName);

    if (!(key in data)) {
      throw new Error(`Key "${key}" not found in ${fileName}`);
    }

    return data[key];
  }
}
