// media-understanding fs helpers and runtime behavior.
import { pathExists } from "../infra/fs-safe.js";

/** Reused helper for file Exists behavior in src/media-understanding. */
export async function fileExists(filePath?: string | null): Promise<boolean> {
  return filePath ? await pathExists(filePath) : false;
}
