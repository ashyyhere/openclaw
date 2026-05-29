// infra/net/proxy proxy tls helpers and runtime behavior.
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import type { ProxyConfig } from "../../../config/zod-schema.proxy.js";

/** Shared type for Managed Proxy Tls Options in src/infra/net. */
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

/** Reused helper for resolve Managed Proxy Ca File behavior in src/infra/net. */
export function resolveManagedProxyCaFile(params: {
  config?: ProxyConfig;
  caFileOverride?: string;
}): string | undefined {
  return (
    normalizeOptionalPath(params.caFileOverride) ??
    normalizeOptionalPath(params.config?.tls?.caFile)
  );
}

/** Reused helper for resolve Managed Proxy Ca File For Url behavior in src/infra/net. */
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

/** Reused helper for load Managed Proxy Tls Options behavior in src/infra/net. */
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

/** Reused helper for load Managed Proxy Tls Options Sync behavior in src/infra/net. */
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
