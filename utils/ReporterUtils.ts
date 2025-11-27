import {
  type Reporter,
  type TestCase,
  type TestResult,
  type FullConfig,
  type Suite
} from "@playwright/test/reporter";
import { LoggerUtility } from "./LoggerUtility";

class ReporterUtils implements Reporter {

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
    LoggerUtility.info("REPORTER: Test run finished");
    LoggerUtility.info("--------------------------------------------------");
  }
}

export default ReporterUtils;
