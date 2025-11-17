import { FullConfig, TestCase, TestResult, Reporter, Suite } from '@playwright/test/reporter';                                      
import { LoggerUtility } from './LoggerUtility';

/** 
 * Class for global logging during test execution
 */
class GlobalLogger implements Reporter {

  onBegin(config: FullConfig, suite: Suite) {                               
    LoggerUtility.divider();
    LoggerUtility.info(`TEST RUN STARTED — Total tests: ${suite.allTests().length}`);
    LoggerUtility.divider();
  }

  onTestBegin(test: TestCase) {
    LoggerUtility.startTest(test.title);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === "passed") {
      LoggerUtility.info(`PASSED: ${test.title}`);
    } else if (result.status === "failed") {
      LoggerUtility.error(`FAILED: ${test.title}`);
      if (result.error) {
        LoggerUtility.error(`Error message: ${result.error.message}`);
      }
    } else if (result.status === "skipped") {
      LoggerUtility.warn(`SKIPPED: ${test.title}`);
    } else if (result.status === "timedOut") {
      LoggerUtility.error(`TIMEOUT: ${test.title}`);
    }

    LoggerUtility.endTest(test.title);
  }

  onEnd() {
    LoggerUtility.divider();
    LoggerUtility.info("TEST RUN FINISHED");
    LoggerUtility.divider();
  }
}

export default GlobalLogger;
