// process windows command helpers and runtime behavior.
import path from "node:path";
import process from "node:process";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Reused helper for resolve Windows Command Shim behavior in src/process. */
export function resolveWindowsCommandShim(params: {
  command: string;
  cmdCommands: readonly string[];
  platform?: NodeJS.Platform;
}): string {
  if ((params.platform ?? process.platform) !== "win32") {
    return params.command;
  }
  const basename = normalizeLowercaseStringOrEmpty(path.basename(params.command));
  if (path.extname(basename)) {
    return params.command;
  }
  if (params.cmdCommands.includes(basename)) {
    return `${params.command}.cmd`;
  }
  return params.command;
}
