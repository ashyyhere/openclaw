// Default state paths for debug proxy capture databases, blobs, and certs.
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

function resolveDebugProxyRootDir(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveStateDir(env), "debug-proxy");
}

/** Resolve the default SQLite capture database path. */
export function resolveDebugProxyDbPath(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveDebugProxyRootDir(env), "capture.sqlite");
}

/** Resolve the default compressed payload blob directory. */
export function resolveDebugProxyBlobDir(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveDebugProxyRootDir(env), "blobs");
}

/** Resolve the default debug proxy certificate directory. */
export function resolveDebugProxyCertDir(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveDebugProxyRootDir(env), "certs");
}
