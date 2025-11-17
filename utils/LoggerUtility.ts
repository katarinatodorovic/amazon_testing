import fs from 'fs';
import path from 'path';

/**
 * Logger utility class with that handles logging with timestamps,
 * log rotation, and different log levels
 */
export class LoggerUtility {
  private static logDir = path.resolve(process.cwd(), 'logs');
  private static timezone = 'Europe/Belgrade';
  private static maxFileSizeMB = 2; 
  private static maxFiles = 5; 
  private static logFileBase = 'execution.log';

  /** 
   * Get timestamp in 'DD-MM-YYYY HH:MM:SS' for Europe/Belgrade 
   */
  private static getTimestamp(): string {
    const timeStampParts = new Intl.DateTimeFormat('sr-RS', {
      timeZone: LoggerUtility.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(new Date());

    // extract time parts
   function getValue(type: string): string {
    for (let i = 0; i < timeStampParts.length; i++) {
      if (timeStampParts[i].type === type) {
        return timeStampParts[i].value;
      }
    }
    return '';
    };

    const dd = getValue('day');
    const mm = getValue('month');
    const yyyy = getValue('year');
    const hh = getValue('hour');
    const min = getValue('minute');
    const ss = getValue('second');

    return dd + '-' + mm + '-' + yyyy + ' ' + hh + ':' + min + ':' + ss;
  }

  /** 
   * Check if log directory exists, create if not
   */
  private static checkIfLogDirExists(): void {
    if (!fs.existsSync(LoggerUtility.logDir)) {
      fs.mkdirSync(LoggerUtility.logDir, { recursive: true });
    }
  }

  /** 
   * Get active log file path 
   */
  private static getLogFilePath(): string {
    return path.join(LoggerUtility.logDir, LoggerUtility.logFileBase);
  }

  /** 
   * Rotate logs based on file size and max file count 
   */
  private static rotateLogs(): void {
    const logFile = LoggerUtility.getLogFilePath();

    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      const sizeMB = stats.size / (1024 * 1024);

      if (sizeMB >= LoggerUtility.maxFileSizeMB) {
        // Rename existing log files
        for (let i = LoggerUtility.maxFiles - 1; i >= 1; i--) {
          const oldPath = path.join(LoggerUtility.logDir, "execution." + i + ".log");
          const newIndex = i + 1;
          const newPath = path.join(LoggerUtility.logDir, "execution." + newIndex + ".log");
          if (fs.existsSync(oldPath)) {
            if (newIndex > LoggerUtility.maxFiles) {
              fs.unlinkSync(oldPath);
            } else {
              fs.renameSync(oldPath, newPath);
            }
          }
        }
        // Rename current log file
        fs.renameSync(logFile, path.join(LoggerUtility.logDir, "execution.1.log"));
      }
    }
  }

  /** 
   * Write a message to the log file 
   */
  private static writeToFile(message: string): void {
    LoggerUtility.checkIfLogDirExists();
    LoggerUtility.rotateLogs();
    const logLine = "[ " + LoggerUtility.getTimestamp() + " ] " + message + "\n";
    fs.appendFile(LoggerUtility.getLogFilePath(), logLine, () => {});

  }

  /** 
   * Info log 
   */
  static info(message: string): void {
    const formatted = "INFO: " + message;
    console.log("[ " + LoggerUtility.getTimestamp() + " ] " + formatted);
    LoggerUtility.writeToFile(formatted);
  }

  /** 
   * Warning log 
   */
  static warn(message: string): void {
    const formatted = "WARNING: " + message;
    console.warn("[ " + LoggerUtility.getTimestamp() + " ] " + formatted);
    LoggerUtility.writeToFile(formatted);
  }

  /** 
   * Debug log 
   */
   static debug(message: string): void {
    const formatted = `DEBUG: ${message}`;
    console.debug(`[${LoggerUtility.getTimestamp()}] ${formatted}`);
    LoggerUtility.writeToFile(formatted);
  }

  /** 
   * Error log 
   */
  static error(message: string): void {
    const formatted = "ERROR: " + message;
    console.error("[ " + LoggerUtility.getTimestamp() + " ] " + formatted);
    LoggerUtility.writeToFile(formatted);
  }

  /** 
   * Step log 
   */
  static step(message: string): void {
    const formatted = "STEP: " + message;
    console.log("[ " + LoggerUtility.getTimestamp() + " ] " + formatted);
    LoggerUtility.writeToFile(formatted);
  }

  /** 
   * Divider line 
   */
  static divider(): void {
    const formatted = "--------------------------------------------";
    console.log(formatted);
    LoggerUtility.writeToFile(formatted);
  }
  /** 
   * Test start log 
   */
  static startTest(testName: string): void {
    const formatted = "START TEST: " + testName;
    console.log("\n[ " + LoggerUtility.getTimestamp() + " ] " + formatted);
    LoggerUtility.writeToFile("\n" + formatted + "\n");
  }

  /** 
   * Test end log 
   */
  static endTest(testName: string): void {
    const formatted = "END TEST: " + testName;
    console.log("[ " + LoggerUtility.getTimestamp() + " ] " + formatted);
    LoggerUtility.writeToFile(formatted + "\n");
  }
}
