// Build asset copy helpers share project-root resolution and verbose logging.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Runtime context shared by build asset copy scripts. */
export type BuildCopyContext = {
  prefix: string;
  projectRoot: string;
  verbose: boolean;
};

/** Resolves project paths and logging flags from the calling build script URL. */
export function resolveBuildCopyContext(importMetaUrl: string): BuildCopyContext {
  const filePath = fileURLToPath(importMetaUrl);
  return {
    prefix: `[${path.basename(filePath, path.extname(filePath))}]`,
    projectRoot: path.resolve(path.dirname(filePath), ".."),
    verbose: process.env.OPENCLAW_BUILD_VERBOSE === "1",
  };
}

/** Creates a directory tree when a copy target does not exist yet. */
export function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/** Logs copy-script details only when verbose build output is enabled. */
export function logVerboseCopy(context: BuildCopyContext, message: string): void {
  if (context.verbose) {
    console.log(`${context.prefix} ${message}`);
  }
}
