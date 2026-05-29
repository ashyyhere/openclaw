// gateway/server plugin route runtime scopes helpers and runtime behavior.
import type { IncomingMessage } from "node:http";
import {
  getHeader,
  resolveTrustedHttpOperatorScopes,
  type AuthorizedGatewayHttpRequest,
} from "../http-auth-utils.js";
import { CLI_DEFAULT_OPERATOR_SCOPES, WRITE_SCOPE } from "../method-scopes.js";

/** Shared type for Plugin Route Runtime Scope Surface in src/gateway/server. */
export type PluginRouteRuntimeScopeSurface = "write-default" | "trusted-operator";

/** Reused helper for resolve Plugin Route Runtime Operator Scopes behavior in src/gateway/server. */
export function resolvePluginRouteRuntimeOperatorScopes(
  req: IncomingMessage,
  requestAuth: AuthorizedGatewayHttpRequest,
  surface: PluginRouteRuntimeScopeSurface = "write-default",
): string[] {
  if (surface === "trusted-operator") {
    if (!requestAuth.trustDeclaredOperatorScopes) {
      return [...CLI_DEFAULT_OPERATOR_SCOPES];
    }
    return resolveTrustedHttpOperatorScopes(req, requestAuth);
  }
  if (requestAuth.authMethod !== "trusted-proxy") {
    return [WRITE_SCOPE];
  }
  if (getHeader(req, "x-openclaw-scopes") === undefined) {
    return [WRITE_SCOPE];
  }
  return resolveTrustedHttpOperatorScopes(req, requestAuth);
}
