// Seeds Control UI allowed origins when gateway bind mode is non-loopback.
import { DEFAULT_GATEWAY_PORT } from "./paths.js";
import type { OpenClawConfig } from "./types.openclaw.js";

/** Gateway bind modes that can expose Control UI beyond loopback. */
export type GatewayNonLoopbackBindMode = "lan" | "tailnet" | "custom" | "auto";

/** Check whether a raw bind value is one of the non-loopback gateway modes. */
export function isGatewayNonLoopbackBindMode(bind: unknown): bind is GatewayNonLoopbackBindMode {
  return bind === "lan" || bind === "tailnet" || bind === "custom" || bind === "auto";
}

/** Detect explicit Control UI origin policy, including the dangerous fallback opt-out. */
export function hasConfiguredControlUiAllowedOrigins(params: {
  allowedOrigins: unknown;
  dangerouslyAllowHostHeaderOriginFallback: unknown;
}): boolean {
  if (params.dangerouslyAllowHostHeaderOriginFallback === true) {
    return true;
  }
  return (
    Array.isArray(params.allowedOrigins) &&
    params.allowedOrigins.some((origin) => typeof origin === "string" && origin.trim().length > 0)
  );
}

/** Resolve a configured gateway port, falling back when the value is missing/invalid. */
export function resolveGatewayPortWithDefault(
  port: unknown,
  fallback = DEFAULT_GATEWAY_PORT,
): number {
  return typeof port === "number" && port > 0 ? port : fallback;
}

/** Build loopback/custom-host origins for the effective gateway port. */
export function buildDefaultControlUiAllowedOrigins(params: {
  port: number;
  bind: unknown;
  customBindHost?: string;
}): string[] {
  const origins = new Set<string>([
    `http://localhost:${params.port}`,
    `http://127.0.0.1:${params.port}`,
  ]);
  const customBindHost = params.customBindHost?.trim();
  if (params.bind === "custom" && customBindHost) {
    origins.add(`http://${customBindHost}:${params.port}`);
  }
  return [...origins];
}

/** Add safe default Control UI origins when non-loopback bind would otherwise fail startup. */
export function ensureControlUiAllowedOriginsForNonLoopbackBind(
  config: OpenClawConfig,
  opts?: {
    defaultPort?: number;
    requireControlUiEnabled?: boolean;
    /** Resolved runtime bind override. Mirrors Gateway runtime precedence:
     *  explicit CLI/runtime bind wins over gateway.bind. */
    runtimeBind?: unknown;
    /** Resolved runtime port override. Mirrors Gateway runtime precedence:
     *  explicit CLI/runtime port wins over gateway.port. */
    runtimePort?: unknown;
    /** Optional container-detection callback.  When provided and `gateway.bind`
     *  is unset, the function is called to determine whether the runtime will
     *  default to `"auto"` (container) so that origins can be seeded
     *  proactively.  Keeping this as an injected callback avoids a hard
     *  dependency from the config layer on the gateway runtime layer. */
    isContainerEnvironment?: () => boolean;
  },
): {
  config: OpenClawConfig;
  seededOrigins: string[] | null;
  bind: GatewayNonLoopbackBindMode | null;
} {
  const bind = opts?.runtimeBind ?? config.gateway?.bind;
  // When bind is unset (undefined) and we are inside a container, the runtime
  // will default to "auto" → 0.0.0.0 via defaultGatewayBindMode().  We must
  // seed origins *before* resolveGatewayRuntimeConfig runs, otherwise the
  // non-loopback Control UI origin check will hard-fail on startup.
  const effectiveBind: typeof bind =
    bind ?? (opts?.isContainerEnvironment?.() ? "auto" : undefined);
  if (!isGatewayNonLoopbackBindMode(effectiveBind)) {
    return { config, seededOrigins: null, bind: null };
  }
  if (opts?.requireControlUiEnabled && config.gateway?.controlUi?.enabled === false) {
    return { config, seededOrigins: null, bind: effectiveBind };
  }
  if (
    hasConfiguredControlUiAllowedOrigins({
      allowedOrigins: config.gateway?.controlUi?.allowedOrigins,
      dangerouslyAllowHostHeaderOriginFallback:
        config.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback,
    })
  ) {
    return { config, seededOrigins: null, bind: effectiveBind };
  }

  const port = resolveGatewayPortWithDefault(
    opts?.runtimePort ?? config.gateway?.port,
    opts?.defaultPort,
  );
  const seededOrigins = buildDefaultControlUiAllowedOrigins({
    port,
    bind: effectiveBind,
    customBindHost: config.gateway?.customBindHost,
  });
  return {
    config: {
      ...config,
      gateway: {
        ...config.gateway,
        controlUi: {
          ...config.gateway?.controlUi,
          allowedOrigins: seededOrigins,
        },
      },
    },
    seededOrigins,
    bind: effectiveBind,
  };
}
