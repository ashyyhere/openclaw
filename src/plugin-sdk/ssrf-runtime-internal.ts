// Private helper surface for bundled plugins with configured local IPC.
// Keep managed proxy bypass capabilities out of the public plugin SDK surface.

/** Re-exported API for src/plugin-sdk, starting with fetch Configured Local Origin With Ssr FGuard. */
export { fetchConfiguredLocalOriginWithSsrFGuard } from "../infra/net/fetch-guard.js";
/** Re-exported API for src/plugin-sdk, starting with register Managed Proxy Browser Cdp Bypass. */
export { registerManagedProxyBrowserCdpBypass } from "../infra/net/proxy/proxy-lifecycle.js";
