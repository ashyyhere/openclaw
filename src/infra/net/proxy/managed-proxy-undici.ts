// Adds active managed-proxy TLS settings to Undici proxy agent options.
import type { EnvHttpProxyAgent } from "undici";
import { isRecord as isProxyTlsRecord } from "../../../shared/record-coerce.js";
import { resolveEnvHttpProxyAgentOptions, resolveEnvHttpProxyUrl } from "../proxy-env.js";
import { getActiveManagedProxyTlsOptions, getActiveManagedProxyUrl } from "./active-proxy-state.js";
import {
  loadManagedProxyTlsOptionsSync,
  resolveManagedProxyCaFileForUrl,
  type ManagedProxyTlsOptions,
} from "./proxy-tls.js";

/** Constructor options accepted by Undici's environment proxy agent. */
export type ManagedEnvHttpProxyAgentOptions = ConstructorParameters<typeof EnvHttpProxyAgent>[0];

function readProxyTlsRecord(options: object | undefined): Record<string, unknown> | undefined {
  if (!options || !("proxyTls" in options)) {
    return undefined;
  }
  return isProxyTlsRecord(options.proxyTls) ? options.proxyTls : undefined;
}

function readProxyUrlFromOptions(options: object | undefined): string | undefined {
  if (!options) {
    return undefined;
  }
  if ("uri" in options) {
    const uri: unknown = Reflect.get(options, "uri");
    return uri instanceof URL ? uri.href : typeof uri === "string" ? uri : undefined;
  }
  if ("httpsProxy" in options || "httpProxy" in options) {
    const httpsProxy: unknown = Reflect.get(options, "httpsProxy");
    const httpProxy: unknown = Reflect.get(options, "httpProxy");
    return typeof httpsProxy === "string"
      ? httpsProxy
      : typeof httpProxy === "string"
        ? httpProxy
        : undefined;
  }
  return undefined;
}

function normalizeProxyUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  try {
    return new URL(value).href;
  } catch {
    return undefined;
  }
}

type ManagedProxyTlsEnv = NodeJS.ProcessEnv;

type ResolveActiveManagedProxyTlsOptionsParams = {
  proxyUrl?: string;
  env?: ManagedProxyTlsEnv;
};

type AddActiveManagedProxyTlsOptionsParams = {
  env?: ManagedProxyTlsEnv;
};

function resolveManagedProxyUrl(env: ManagedProxyTlsEnv = process.env): string | undefined {
  const activeProxyUrl = getActiveManagedProxyUrl();
  if (activeProxyUrl) {
    return activeProxyUrl.href;
  }
  if (env["OPENCLAW_PROXY_ACTIVE"] !== "1") {
    return undefined;
  }
  return normalizeProxyUrl(resolveEnvHttpProxyUrl("https", env));
}

/** Resolves TLS trust options only when the target proxy is the active managed proxy. */
export function resolveActiveManagedProxyTlsOptions(
  params?: ResolveActiveManagedProxyTlsOptionsParams,
): ManagedProxyTlsOptions | undefined {
  const env = params?.env ?? process.env;
  const managedProxyUrl = resolveManagedProxyUrl(env);
  const targetProxyUrl = normalizeProxyUrl(
    params?.proxyUrl ?? resolveEnvHttpProxyUrl("https", env),
  );
  if (!managedProxyUrl || targetProxyUrl !== managedProxyUrl) {
    return undefined;
  }
  const activeProxyTls = getActiveManagedProxyTlsOptions();
  if (activeProxyTls) {
    return activeProxyTls;
  }
  const proxyCaFile = resolveManagedProxyCaFileForUrl({
    proxyUrl: managedProxyUrl,
    caFileOverride: env["OPENCLAW_PROXY_CA_FILE"],
  });
  try {
    return loadManagedProxyTlsOptionsSync(proxyCaFile);
  } catch {
    return undefined;
  }
}

/** Adds active managed-proxy TLS settings to an empty options object. */
export function addActiveManagedProxyTlsOptions(
  options: undefined,
  params?: AddActiveManagedProxyTlsOptionsParams,
): { proxyTls: ManagedProxyTlsOptions } | undefined;
/** Adds active managed-proxy TLS settings while preserving caller options. */
export function addActiveManagedProxyTlsOptions<TOptions extends object>(
  options: TOptions,
  params?: AddActiveManagedProxyTlsOptionsParams,
): TOptions | (TOptions & { proxyTls: Record<string, unknown> });
/** Adds active managed-proxy TLS settings to optional Undici proxy options. */
export function addActiveManagedProxyTlsOptions<TOptions extends object>(
  options: TOptions | undefined,
  params?: AddActiveManagedProxyTlsOptionsParams,
):
  | TOptions
  | (TOptions & { proxyTls: Record<string, unknown> })
  | {
      proxyTls: ManagedProxyTlsOptions;
    }
  | undefined;
/** Merges active managed-proxy TLS settings under proxyTls without overwriting caller fields. */
export function addActiveManagedProxyTlsOptions<TOptions extends object>(
  options: TOptions | undefined,
  params?: AddActiveManagedProxyTlsOptionsParams,
):
  | TOptions
  | (TOptions & { proxyTls: Record<string, unknown> })
  | { proxyTls: ManagedProxyTlsOptions }
  | undefined {
  const proxyTls = resolveActiveManagedProxyTlsOptions({
    proxyUrl: readProxyUrlFromOptions(options),
    env: params?.env,
  });
  if (!proxyTls) {
    return options;
  }
  const existingProxyTls = readProxyTlsRecord(options);
  return {
    ...options,
    proxyTls: {
      ...proxyTls,
      ...existingProxyTls,
    },
  };
}

/** Resolves environment proxy agent options and injects active managed-proxy TLS trust. */
export function resolveManagedEnvHttpProxyAgentOptions(
  env: NodeJS.ProcessEnv = process.env,
): ManagedEnvHttpProxyAgentOptions | undefined {
  return addActiveManagedProxyTlsOptions(resolveEnvHttpProxyAgentOptions(env), { env });
}
