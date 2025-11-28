import {
  type Reporter,
  type TestCase,
  type TestResult,
  type FullConfig,
  type Suite
} from "@playwright/test/reporter";
import { LoggerUtility } from "./LoggerUtility";

class ReporterUtils implements Reporter {

  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private timedOut = 0;

  onBegin(_config: FullConfig, suite: Suite) {
    LoggerUtility.info("--------------------------------------------------");
    LoggerUtility.info(`REPORTER: Test run started | Total tests: ${suite.allTests().length}`);
    LoggerUtility.info("--------------------------------------------------");
  }

  onTestBegin(test: TestCase) {
    LoggerUtility.info("");
    LoggerUtility.info("========== REPORTER: TEST START ==========");
    LoggerUtility.info(`Title: ${test.title}`);
    LoggerUtility.info("==========================================");
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status.toUpperCase();

    // Count test status
    if (result.status === "passed") this.passed++;
    else if (result.status === "failed") this.failed++;
    else if (result.status === "skipped") this.skipped++;
    else if (result.status === "timedOut") this.timedOut++;

    LoggerUtility.info("");
    LoggerUtility.info("========== REPORTER: TEST END ============");
    LoggerUtility.info(`Title : ${test.title}`);
    LoggerUtility.info(`Status: ${status}`);

    if (result.error) {
      LoggerUtility.error(`Error: ${result.error.message}`);
    }

    LoggerUtility.info("==========================================");
  }

  onEnd() {
    LoggerUtility.info("--------------------------------------------------");
    LoggerUtility.info("REPORTER SUMMARY");

    LoggerUtility.info(`Passed : ${this.passed}`);
    LoggerUtility.info(`Failed : ${this.failed}`);
    LoggerUtility.info(`Skipped: ${this.skipped}`);
    LoggerUtility.info(`Timed out: ${this.timedOut}`);

    LoggerUtility.info("--------------------------------------------------");
    LoggerUtility.info("REPORTER: Test run finished");
    LoggerUtility.info("--------------------------------------------------");
  }
}

export default ReporterUtils;
