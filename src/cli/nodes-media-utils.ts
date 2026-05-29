/** Shared helpers for writing node media responses to temporary files. */
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
/** Re-exported API for src/cli, starting with as Finite Number. */
export { asFiniteNumber as asNumber } from "../shared/number-coercion.js";
import { readStringValue } from "../shared/string-coerce.js";
/** Re-exported API for src/cli, starting with as Record. */
export { asRecord } from "../shared/record-coerce.js";
/** Re-exported API for src/cli, starting with as Boolean. */
export { asBoolean } from "../utils/boolean.js";

/** Reused constant for as String behavior in src/cli. */
export const asString = readStringValue;

/** Reused helper for resolve Temp Path Parts behavior in src/cli. */
export function resolveTempPathParts(opts: { ext: string; tmpDir?: string; id?: string }): {
  ext: string;
  tmpDir: string;
  id: string;
} {
  const tmpDir = opts.tmpDir ?? resolvePreferredOpenClawTmpDir();
  const rawExt = opts.ext.startsWith(".") ? opts.ext : `.${opts.ext}`;
  if (!/^\.[A-Za-z0-9][A-Za-z0-9_-]{0,15}$/u.test(rawExt)) {
    throw new Error("invalid media format");
  }
  if (!opts.tmpDir) {
    fs.mkdirSync(tmpDir, { recursive: true, mode: 0o700 });
  }
  return {
    tmpDir,
    id: opts.id ?? randomUUID(),
    ext: rawExt,
  };
}
