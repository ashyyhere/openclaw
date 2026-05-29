// Runtime boundary for infra control ui assets fs runtime behavior.
import fs from "node:fs";

/** Reused constant for exists Sync behavior in src/infra. */
export const existsSync = fs.existsSync.bind(fs);
/** Reused constant for read File Sync behavior in src/infra. */
export const readFileSync = fs.readFileSync.bind(fs);
/** Reused constant for stat Sync behavior in src/infra. */
export const statSync = fs.statSync.bind(fs);
/** Reused constant for realpath Sync behavior in src/infra. */
export const realpathSync = fs.realpathSync.bind(fs);
