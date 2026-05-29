// infra/net/proxy active proxy state helpers and runtime behavior.
import type { ProxyConfig } from "../../../config/zod-schema.proxy.js";
import type { ManagedProxyTlsOptions } from "./proxy-tls.js";

/** Shared type for Active Managed Proxy Url in src/infra/net. */
export type ActiveManagedProxyUrl = Readonly<URL>;

/** Shared type for Active Managed Proxy Loopback Mode in src/infra/net. */
export type ActiveManagedProxyLoopbackMode = NonNullable<NonNullable<ProxyConfig>["loopbackMode"]>;

/** Shared type for Active Managed Proxy Registration in src/infra/net. */
export type ActiveManagedProxyRegistration = {
  proxyUrl: ActiveManagedProxyUrl;
  loopbackMode: ActiveManagedProxyLoopbackMode;
  proxyTls?: ManagedProxyTlsOptions;
  stopped: boolean;
};

/** Shared type for Register Active Managed Proxy Options in src/infra/net. */
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

/** Reused helper for register Active Managed Proxy Url behavior in src/infra/net. */
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

/** Reused helper for stop Active Managed Proxy Registration behavior in src/infra/net. */
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

/** Reused helper for get Active Managed Proxy Loopback Mode behavior in src/infra/net. */
export function getActiveManagedProxyLoopbackMode(): ActiveManagedProxyLoopbackMode | undefined {
  return activeProxyLoopbackMode ?? readInheritedActiveManagedProxyLoopbackMode();
}

/** Reused helper for get Active Managed Proxy Url behavior in src/infra/net. */
export function getActiveManagedProxyUrl(): ActiveManagedProxyUrl | undefined {
  return activeProxyUrl;
}

/** Reused helper for get Active Managed Proxy Tls Options behavior in src/infra/net. */
export function getActiveManagedProxyTlsOptions(): ManagedProxyTlsOptions | undefined {
  return activeProxyTlsOptions;
}

/** Reused helper for reset Active Managed Proxy State For Tests behavior in src/infra/net. */
export function resetActiveManagedProxyStateForTests(): void {
  activeProxyUrl = undefined;
  activeProxyLoopbackMode = undefined;
  activeProxyTlsOptions = undefined;
  activeProxyRegistrationCount = 0;
}
