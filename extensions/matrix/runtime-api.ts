// extensions/matrix runtime api helpers and runtime behavior.
/** Re-exported matrix plugin public API. */
export {
  type MatrixResolvedStringField,
  type MatrixResolvedStringValues,
  resolveMatrixAccountStringValues,
} from "./src/auth-precedence.js";
/** Re-exported matrix plugin public API. */
export {
  requiresExplicitMatrixDefaultAccount,
  resolveMatrixDefaultOrOnlyAccountId,
} from "./src/account-selection.js";
/** Re-exported matrix plugin public API. */
export {
  findMatrixAccountEntry,
  resolveConfiguredMatrixAccountIds,
  resolveMatrixChannelConfig,
} from "./src/account-selection.js";
/** Re-exported matrix plugin public API. */
export {
  getMatrixScopedEnvVarNames,
  listMatrixEnvAccountIds,
  resolveMatrixEnvAccountToken,
} from "./src/env-vars.js";
/** Re-exported matrix plugin public API. */
export {
  hashMatrixAccessToken,
  resolveMatrixAccountStorageRoot,
  resolveMatrixCredentialsDir,
  resolveMatrixCredentialsFilename,
  resolveMatrixCredentialsPath,
  resolveMatrixHomeserverKey,
  resolveMatrixLegacyFlatStoragePaths,
  resolveMatrixLegacyFlatStoreRoot,
  sanitizeMatrixPathSegment,
} from "./src/storage-paths.js";
/** Re-exported matrix plugin public API, starting with ensure Matrix Sdk Installed. */
export { ensureMatrixSdkInstalled, isMatrixSdkAvailable } from "./src/matrix/deps.js";
/** Re-exported matrix plugin public API. */
export {
  assertHttpUrlTargetsPrivateNetwork,
  closeDispatcher,
  createPinnedDispatcher,
  resolvePinnedHostnameWithPolicy,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  ssrfPolicyFromAllowPrivateNetwork,
  type LookupFn,
  type SsrFPolicy,
} from "openclaw/plugin-sdk/ssrf-runtime";
/** Re-exported matrix plugin public API. */
export {
  setMatrixThreadBindingIdleTimeoutBySessionKey,
  setMatrixThreadBindingMaxAgeBySessionKey,
} from "./src/matrix/thread-bindings-shared.js";
/** Re-exported matrix plugin public API, starting with set Matrix Runtime. */
export { setMatrixRuntime } from "./src/runtime.js";
/** Re-exported matrix plugin public API, starting with write Json File Atomically. */
export { writeJsonFileAtomically } from "openclaw/plugin-sdk/json-store";
/** Re-exported matrix plugin public API. */
export type {
  ChannelDirectoryEntry,
  ChannelMessageActionContext,
} from "openclaw/plugin-sdk/channel-contract";
/** Re-exported matrix plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported matrix plugin public API, starting with format Zoned Timestamp. */
export { formatZonedTimestamp } from "openclaw/plugin-sdk/time-runtime";
/** Re-exported matrix plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime, RuntimeLogger } from "openclaw/plugin-sdk/plugin-runtime";
/** Re-exported matrix plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
/** Re-exported matrix plugin public API, starting with Wizard Prompter. */
export type { WizardPrompter } from "openclaw/plugin-sdk/setup";

/** Public matrix plugin helper for chunk Text For Outbound behavior. */
export function chunkTextForOutbound(text: string, limit: number): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > limit) {
    const window = remaining.slice(0, limit);
    const splitAt = Math.max(window.lastIndexOf("\n"), window.lastIndexOf(" "));
    const breakAt = splitAt > 0 ? splitAt : limit;
    chunks.push(remaining.slice(0, breakAt).trimEnd());
    remaining = remaining.slice(breakAt).trimStart();
  }
  if (remaining.length > 0 || text.length === 0) {
    chunks.push(remaining);
  }
  return chunks;
}
