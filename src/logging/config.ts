// logging config helpers and runtime behavior.
import fs from "node:fs";
import JSON5 from "json5";
import { getCommandPathWithRootOptions } from "../cli/argv.js";
import { resolveConfigPath } from "../config/paths.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { isRecord as isObjectRecord } from "../shared/record-coerce.js";

type LoggingConfig = OpenClawConfig["logging"];

let cachedLoggingConfig:
  | {
      path: string;
      logging: LoggingConfig | undefined;
    }
  | undefined;

/** Reused helper for should Skip Mutating Logging Config Read behavior in src/logging. */
export function shouldSkipMutatingLoggingConfigRead(argv: string[] = process.argv): boolean {
  const [primary, secondary] = getCommandPathWithRootOptions(argv, 2);
  return primary === "config" && (secondary === "schema" || secondary === "validate");
}

/** Reused helper for read Logging Config behavior in src/logging. */
export function readLoggingConfig(): LoggingConfig | undefined {
  if (shouldSkipMutatingLoggingConfigRead()) {
    return undefined;
  }
  try {
    const configPath = resolveConfigPath();
    if (cachedLoggingConfig?.path === configPath) {
      return cachedLoggingConfig.logging;
    }
    if (!fs.existsSync(configPath)) {
      return undefined;
    }
    const parsed = JSON5.parse(fs.readFileSync(configPath, "utf8"));
    const logging = isObjectRecord(parsed) ? parsed.logging : undefined;
    const resolved = isObjectRecord(logging) ? (logging as LoggingConfig) : undefined;
    cachedLoggingConfig = {
      path: configPath,
      logging: resolved,
    };
    return resolved;
  } catch {
    return undefined;
  }
}
