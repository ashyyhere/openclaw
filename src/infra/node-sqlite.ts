// infra node sqlite helpers and runtime behavior.
import { createRequire } from "node:module";
import { formatErrorMessage } from "./errors.js";
import { installProcessWarningFilter } from "./warning-filter.js";

const require = createRequire(import.meta.url);

/** Reused helper for require Node Sqlite behavior in src/infra. */
export function requireNodeSqlite(): typeof import("node:sqlite") {
  installProcessWarningFilter();
  try {
    return require("node:sqlite") as typeof import("node:sqlite");
  } catch (err) {
    const message = formatErrorMessage(err);
    throw new Error(
      `SQLite support is unavailable in this Node runtime (missing node:sqlite). ${message}`,
      { cause: err },
    );
  }
}
