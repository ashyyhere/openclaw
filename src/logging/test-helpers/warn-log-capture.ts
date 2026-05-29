// Test helper for capturing warning-level diagnostic log records while routing
// file output to a temporary log path.
import path from "node:path";
import { resolvePreferredOpenClawTmpDir } from "../../infra/tmp-openclaw-dir.js";
import { resetLogger, setLoggerOverride } from "../logger.js";
import { createDiagnosticLogRecordCapture } from "./diagnostic-log-capture.js";

/** Captures warning log records and exposes a text search helper for tests. */
export function createWarnLogCapture(prefix: string) {
  const capture = createDiagnosticLogRecordCapture();
  setLoggerOverride({
    level: "warn",
    consoleLevel: "silent",
    file: path.join(resolvePreferredOpenClawTmpDir(), `${prefix}-${process.pid}-${Date.now()}.log`),
  });
  return {
    async findText(needle: string): Promise<string | undefined> {
      await capture.flush();
      return capture.records
        .flatMap((record) => [record.message, ...Object.values(record.attributes ?? {})])
        .filter((value): value is string => typeof value === "string")
        .find((value) => value.includes(needle));
    },
    cleanup() {
      capture.cleanup();
      setLoggerOverride(null);
      resetLogger();
    },
  };
}
