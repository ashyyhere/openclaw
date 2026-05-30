import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
/**
 * Re-export media payload coercion helpers used by node camera/screen writers.
 */
export { asFiniteNumber as asNumber } from "../shared/number-coercion.js";
import { readStringValue } from "../shared/string-coerce.js";
/** Re-export record coercion for node media payload parsing. */
export { asRecord } from "../shared/record-coerce.js";
/** Re-export boolean coercion for node media payload parsing. */
export { asBoolean } from "../utils/boolean.js";

/** String coercion helper shared by node media payload parsers. */
export const asString = readStringValue;

/** Resolve a safe temp directory, random id, and validated extension for media output. */
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
