// Resolves and loads custom CA material for HTTPS managed proxy connections.
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import type { ProxyConfig } from "../../../config/zod-schema.proxy.js";

/** TLS material passed to managed proxy clients. */
export type ManagedProxyTlsOptions = Readonly<{
  ca?: string;
}>;

function normalizeOptionalPath(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function formatReadError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function isHttpsProxyUrl(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** Resolves a proxy CA file from an explicit override or proxy config. */
export function resolveManagedProxyCaFile(params: {
  config?: ProxyConfig;
  caFileOverride?: string;
}): string | undefined {
  return (
    normalizeOptionalPath(params.caFileOverride) ??
    normalizeOptionalPath(params.config?.tls?.caFile)
  );
}

/** Resolves a proxy CA file only when the proxy URL uses HTTPS. */
export function resolveManagedProxyCaFileForUrl(params: {
  proxyUrl: string | undefined;
  config?: ProxyConfig;
  caFileOverride?: string;
}): string | undefined {
  if (!isHttpsProxyUrl(params.proxyUrl)) {
    return undefined;
  }
  return resolveManagedProxyCaFile({
    config: params.config,
    caFileOverride: params.caFileOverride,
  });
}

/** Loads async TLS options from a proxy CA file path. */
export async function loadManagedProxyTlsOptions(
  caFile: string | undefined,
): Promise<ManagedProxyTlsOptions | undefined> {
  if (!caFile) {
    return undefined;
  }
  try {
    return { ca: await readFile(caFile, "utf8") };
  } catch (err) {
    throw new Error(`proxy CA file could not be read (${caFile}): ${formatReadError(err)}`, {
      cause: err,
    });
  }
}

/** Loads sync TLS options from a proxy CA file path. */
export function loadManagedProxyTlsOptionsSync(
  caFile: string | undefined,
): ManagedProxyTlsOptions | undefined {
  if (!caFile) {
    return undefined;
  }
  try {
    return { ca: readFileSync(caFile, "utf8") };
  } catch (err) {
    throw new Error(`proxy CA file could not be read (${caFile}): ${formatReadError(err)}`, {
      cause: err,
    });
  }
}
