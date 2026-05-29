// proxy-capture paths helpers and runtime behavior.
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

function resolveDebugProxyRootDir(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveStateDir(env), "debug-proxy");
}

/** Reused helper for resolve Debug Proxy Db Path behavior in src/proxy-capture. */
export function resolveDebugProxyDbPath(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveDebugProxyRootDir(env), "capture.sqlite");
}

/** Reused helper for resolve Debug Proxy Blob Dir behavior in src/proxy-capture. */
export function resolveDebugProxyBlobDir(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveDebugProxyRootDir(env), "blobs");
}

/** Reused helper for resolve Debug Proxy Cert Dir behavior in src/proxy-capture. */
export function resolveDebugProxyCertDir(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveDebugProxyRootDir(env), "certs");
}
