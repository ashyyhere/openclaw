// Process-local active managed proxy registry.
// Nested users share one proxy URL/TLS tuple and release it by registration count.
import type { ProxyConfig } from "../../../config/zod-schema.proxy.js";
import type { ManagedProxyTlsOptions } from "./proxy-tls.js";

/** Immutable URL for the currently active managed proxy. */
export type ActiveManagedProxyUrl = Readonly<URL>;

/** Loopback interception mode used by the active managed proxy. */
export type ActiveManagedProxyLoopbackMode = NonNullable<NonNullable<ProxyConfig>["loopbackMode"]>;

/** Registration handle returned to a managed proxy user for later release. */
export type ActiveManagedProxyRegistration = {
  proxyUrl: ActiveManagedProxyUrl;
  loopbackMode: ActiveManagedProxyLoopbackMode;
  proxyTls?: ManagedProxyTlsOptions;
  stopped: boolean;
};

/** Optional loopback/TLS state to bind to the active managed proxy registration. */
export type RegisterActiveManagedProxyOptions = {
  loopbackMode?: ActiveManagedProxyLoopbackMode;
  proxyTls?: ManagedProxyTlsOptions;
};

let activeProxyUrl: ActiveManagedProxyUrl | undefined;
let activeProxyLoopbackMode: ActiveManagedProxyLoopbackMode | undefined;
let activeProxyTlsOptions: ManagedProxyTlsOptions | undefined;
let activeProxyRegistrationCount = 0;

function parseActiveManagedProxyLoopbackMode(
  value: string | undefined,
): ActiveManagedProxyLoopbackMode | undefined {
  if (value === "gateway-only" || value === "proxy" || value === "block") {
    return value;
  }
  return undefined;
}

function readInheritedActiveManagedProxyLoopbackMode(): ActiveManagedProxyLoopbackMode | undefined {
  if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") {
    return undefined;
  }
  return (
    parseActiveManagedProxyLoopbackMode(process.env["OPENCLAW_PROXY_LOOPBACK_MODE"]) ??
    "gateway-only"
  );
}

/** Register a managed proxy URL, sharing it with compatible nested registrations. */
export function registerActiveManagedProxyUrl(
  proxyUrl: URL,
  options: ActiveManagedProxyLoopbackMode | RegisterActiveManagedProxyOptions = "gateway-only",
): ActiveManagedProxyRegistration {
  const normalizedProxyUrl = new URL(proxyUrl.href);
  const loopbackMode =
    typeof options === "string" ? options : (options.loopbackMode ?? "gateway-only");
  const proxyTls = typeof options === "string" ? undefined : options.proxyTls;
  if (activeProxyUrl !== undefined) {
    if (activeProxyUrl.href !== normalizedProxyUrl.href) {
      throw new Error(
        "proxy: cannot activate a managed proxy while another proxy is active; " +
          "stop the current proxy before changing proxy.proxyUrl.",
      );
    }
    if (activeProxyLoopbackMode !== loopbackMode) {
      throw new Error(
        "proxy: cannot activate a managed proxy with a different proxy.loopbackMode while another proxy is active; " +
          "stop the current proxy before changing proxy.loopbackMode.",
      );
    }
    if (!areProxyTlsOptionsEqual(activeProxyTlsOptions, proxyTls)) {
      throw new Error(
        "proxy: cannot activate a managed proxy with different proxy TLS options while another proxy is active; " +
          "stop the current proxy before changing proxy.tls.",
      );
    }
    activeProxyRegistrationCount += 1;
    return {
      proxyUrl: activeProxyUrl,
      loopbackMode,
      proxyTls: activeProxyTlsOptions,
      stopped: false,
    };
  }

  activeProxyUrl = normalizedProxyUrl;
  activeProxyLoopbackMode = loopbackMode;
  activeProxyTlsOptions = proxyTls;
  activeProxyRegistrationCount = 1;
  return { proxyUrl: activeProxyUrl, loopbackMode, proxyTls, stopped: false };
}

function areProxyTlsOptionsEqual(
  left: ManagedProxyTlsOptions | undefined,
  right: ManagedProxyTlsOptions | undefined,
): boolean {
  return left?.ca === right?.ca;
}

/** Release one active proxy registration and clear singleton state after the last user. */
export function stopActiveManagedProxyRegistration(
  registration: ActiveManagedProxyRegistration,
): void {
  if (registration.stopped) {
    return;
  }
  registration.stopped = true;
  if (activeProxyUrl?.href !== registration.proxyUrl.href) {
    return;
  }
  activeProxyRegistrationCount = Math.max(0, activeProxyRegistrationCount - 1);
  if (activeProxyRegistrationCount === 0) {
    activeProxyUrl = undefined;
    activeProxyLoopbackMode = undefined;
    activeProxyTlsOptions = undefined;
  }
}

/** Return the active loopback mode, including inherited child-process proxy state. */
export function getActiveManagedProxyLoopbackMode(): ActiveManagedProxyLoopbackMode | undefined {
  return activeProxyLoopbackMode ?? readInheritedActiveManagedProxyLoopbackMode();
}

/** Return the active managed proxy URL for this process. */
export function getActiveManagedProxyUrl(): ActiveManagedProxyUrl | undefined {
  return activeProxyUrl;
}

/** Return TLS options bound to the active managed proxy registration. */
export function getActiveManagedProxyTlsOptions(): ManagedProxyTlsOptions | undefined {
  return activeProxyTlsOptions;
}

/** Reset active managed proxy singleton state for tests. */
export function resetActiveManagedProxyStateForTests(): void {
  activeProxyUrl = undefined;
  activeProxyLoopbackMode = undefined;
  activeProxyTlsOptions = undefined;
  activeProxyRegistrationCount = 0;
}
