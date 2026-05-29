/** Shared SDK helpers for extension status summaries, config issues, secrets, and proxy setup. */
import { createAmbientNodeProxyAgent, hasAmbientNodeProxyConfigured } from "@openclaw/proxyline";
import type { z } from "zod";
import type { OpenClawConfig } from "../config/config.js";
import { resolveActiveManagedProxyTlsOptions } from "../infra/net/proxy/managed-proxy-undici.js";
import { resolveDefaultSecretProviderAlias } from "../secrets/ref-contract.js";
import { runPassiveAccountLifecycle } from "./channel-lifecycle.core.js";
import { createLoggerBackedRuntime } from "./runtime-logger.js";
/** Re-exported API for src/plugin-sdk, starting with safe Parse Json With Schema. */
export { safeParseJsonWithSchema, safeParseWithSchema } from "../utils/zod-parse.js";
/** Re-exported API for src/plugin-sdk, starting with build Timeout Abort Signal. */
export { buildTimeoutAbortSignal } from "../utils/fetch-timeout.js";

type PassiveChannelStatusSnapshot = {
  configured?: boolean;
  running?: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: unknown;
  lastProbeAt?: number | null;
};

type TrafficStatusSnapshot = {
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
};

type StoppableMonitor = {
  stop: () => void;
};

type RequireOpenAllowFromFn = (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: z.RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;

/** Build the common status summary for passive channel monitors. */
export function buildPassiveChannelStatusSummary<TExtra extends object>(
  snapshot: PassiveChannelStatusSnapshot,
  extra?: TExtra,
) {
  return {
    configured: snapshot.configured ?? false,
    ...(extra ?? ({} as TExtra)),
    running: snapshot.running ?? false,
    lastStartAt: snapshot.lastStartAt ?? null,
    lastStopAt: snapshot.lastStopAt ?? null,
    lastError: snapshot.lastError ?? null,
  };
}

/** Build a passive channel status summary including last probe details. */
export function buildPassiveProbedChannelStatusSummary<TExtra extends object>(
  snapshot: PassiveChannelStatusSnapshot,
  extra?: TExtra,
) {
  return {
    ...buildPassiveChannelStatusSummary(snapshot, extra),
    probe: snapshot.probe,
    lastProbeAt: snapshot.lastProbeAt ?? null,
  };
}

/** Build the common inbound/outbound traffic timestamp summary. */
export function buildTrafficStatusSummary(snapshot?: TrafficStatusSnapshot | null) {
  return {
    lastInboundAt: snapshot?.lastInboundAt ?? null,
    lastOutboundAt: snapshot?.lastOutboundAt ?? null,
  };
}

/** Run a stoppable monitor until the channel lifecycle aborts. */
export async function runStoppablePassiveMonitor<TMonitor extends StoppableMonitor>(params: {
  abortSignal: AbortSignal;
  start: () => Promise<TMonitor>;
}): Promise<void> {
  await runPassiveAccountLifecycle({
    abortSignal: params.abortSignal,
    start: params.start,
    stop: async (monitor) => {
      monitor.stop();
    },
  });
}

/** Return the provided runtime or synthesize one backed by a logger for passive helpers. */
export function resolveLoggerBackedRuntime<TRuntime>(
  runtime: TRuntime | undefined,
  logger: Parameters<typeof createLoggerBackedRuntime>[0]["logger"],
): TRuntime {
  return (
    runtime ??
    (createLoggerBackedRuntime({
      logger,
      exitError: () => new Error("Runtime exit not available"),
    }) as TRuntime)
  );
}

/** Add a config issue when open DM policy is missing wildcard allowFrom. */
export function requireChannelOpenAllowFrom(params: {
  channel: string;
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: z.RefinementCtx;
  requireOpenAllowFrom: RequireOpenAllowFromFn;
}) {
  params.requireOpenAllowFrom({
    policy: params.policy,
    allowFrom: params.allowFrom,
    ctx: params.ctx,
    path: ["allowFrom"],
    message: `channels.${params.channel}.dmPolicy="open" requires channels.${params.channel}.allowFrom to include "*"`,
  });
}

/** Reused helper for read Status Issue Fields behavior in src/plugin-sdk. */
export function readStatusIssueFields<TField extends string>(
  value: unknown,
  fields: readonly TField[],
): Record<TField, unknown> | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  const result = {} as Record<TField, unknown>;
  for (const field of fields) {
    result[field] = record[field];
  }
  return result;
}

/** Reused helper for coerce Status Issue Account Id behavior in src/plugin-sdk. */
export function coerceStatusIssueAccountId(value: unknown): string | undefined {
  return typeof value === "string" ? value : typeof value === "number" ? String(value) : undefined;
}

/** Create a deferred promise for callback-style lifecycle bridges. */
export function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const DEFAULT_PACKAGE_JSON_VERSION_CANDIDATES = [
  "../package.json",
  "./package.json",
  "../../package.json",
] as const;

type PackageJsonRequire = (id: string) => unknown;

type PluginConfigIssuePathSegment = string | number;

type PluginConfigIssue = {
  path: PluginConfigIssuePathSegment[];
  message: string;
};

type PluginConfigIssueMessageOptions = {
  invalidConfigMessage?: string;
  unknownKeyMessage?: (key: string) => string;
  rootInvalidTypeMessage?: string;
};

/** Format a zod issue into a concise plugin config message. */
export function formatPluginConfigIssue(
  issue: z.ZodIssue | undefined,
  options?: PluginConfigIssueMessageOptions,
): string {
  if (!issue) {
    return options?.invalidConfigMessage ?? "invalid config";
  }
  if (issue.code === "unrecognized_keys" && issue.keys.length > 0) {
    return options?.unknownKeyMessage?.(issue.keys[0]) ?? `unknown config key: ${issue.keys[0]}`;
  }
  if (issue.code === "invalid_type" && issue.path.length === 0) {
    return options?.rootInvalidTypeMessage ?? "expected config object";
  }
  return issue.message;
}

/** Reused helper for normalize Plugin Config Issue Path behavior in src/plugin-sdk. */
export function normalizePluginConfigIssuePath(
  path: readonly unknown[],
): PluginConfigIssuePathSegment[] {
  return path.filter((segment): segment is PluginConfigIssuePathSegment => {
    const kind = typeof segment;
    return kind === "string" || kind === "number";
  });
}

/** Map zod issues into stable plugin config issue records. */
export function mapPluginConfigIssues(
  issues: readonly z.ZodIssue[],
  options?: PluginConfigIssueMessageOptions,
): PluginConfigIssue[] {
  return issues.map((issue) => ({
    path: normalizePluginConfigIssuePath(issue.path),
    message: formatPluginConfigIssue(issue, options),
  }));
}

/** Return whether an env secret ref can be resolved without mutating secret config. */
export function canResolveEnvSecretRefInReadOnlyPath(params: {
  cfg?: OpenClawConfig;
  provider: string;
  id: string;
}): boolean {
  const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
  if (!providerConfig) {
    return params.provider === resolveDefaultSecretProviderAlias(params.cfg ?? {}, "env");
  }
  if (providerConfig.source !== "env") {
    return false;
  }
  const allowlist = providerConfig.allowlist;
  return !allowlist || allowlist.includes(params.id);
}

/** Read a plugin package version across source and bundled package layouts. */
export function readPluginPackageVersion(params: {
  require: PackageJsonRequire;
  candidates?: readonly string[];
  fallback?: string;
}): string {
  for (const candidate of params.candidates ?? DEFAULT_PACKAGE_JSON_VERSION_CANDIDATES) {
    try {
      const version = (params.require(candidate) as { version?: unknown }).version;
      if (typeof version === "string" && version.trim().length > 0) {
        return version;
      }
    } catch {
      // Ignore missing candidate paths across source and bundled layouts.
    }
  }
  return params.fallback ?? "unknown";
}

/** Resolve an ambient HTTP(S) proxy agent if proxy env/config is active. */
export async function resolveAmbientNodeProxyAgent<TAgent>(params?: {
  onError?: (error: unknown) => void;
  onUsingProxy?: () => void;
  protocol?: "http" | "https";
}): Promise<TAgent | undefined> {
  const protocol = params?.protocol ?? "https";
  if (!hasAmbientNodeProxyConfigured({ protocol })) {
    return undefined;
  }
  try {
    const proxyTls = resolveActiveManagedProxyTlsOptions();
    const agent = createAmbientNodeProxyAgent({
      protocol,
      ...(proxyTls ? { proxyTls } : {}),
    });
    if (agent === undefined) {
      return undefined;
    }
    params?.onUsingProxy?.();
    return agent as TAgent;
  } catch (error) {
    params?.onError?.(error);
    return undefined;
  }
}
