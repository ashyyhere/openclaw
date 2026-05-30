// Lazy fs boundary for serving bundled Control UI assets.
import fs from "node:fs";

/** Bound fs.existsSync for asset lookup. */
export const existsSync = fs.existsSync.bind(fs);
/** Bound fs.readFileSync for asset reads. */
export const readFileSync = fs.readFileSync.bind(fs);
/** Bound fs.statSync for asset metadata. */
export const statSync = fs.statSync.bind(fs);
/** Bound fs.realpathSync for asset path canonicalization. */
export const realpathSync = fs.realpathSync.bind(fs);
