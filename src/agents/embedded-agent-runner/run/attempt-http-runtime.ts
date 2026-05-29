/** Configures HTTP proxy and timeout behavior for embedded-agent attempts. */
import {
  DEFAULT_UNDICI_STREAM_TIMEOUT_MS,
  ensureGlobalUndiciDispatcherStreamTimeouts,
  ensureGlobalUndiciEnvProxyDispatcher,
} from "../../../infra/net/undici-global-dispatcher.js";

/** Applies process-wide Undici proxy and stream timeout settings for an attempt. */
export function configureEmbeddedAttemptHttpRuntime(params: { timeoutMs: number }): void {
  // Proxy bootstrap must happen before timeout tuning so the timeouts wrap the
  // active EnvHttpProxyAgent instead of being replaced by a bare proxy dispatcher.
  ensureGlobalUndiciEnvProxyDispatcher();
  ensureGlobalUndiciDispatcherStreamTimeouts({
    timeoutMs: Math.max(params.timeoutMs, DEFAULT_UNDICI_STREAM_TIMEOUT_MS),
  });
}
