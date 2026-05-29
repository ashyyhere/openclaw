// plugins api lifecycle helpers and runtime behavior.
import type { OpenClawPluginApi } from "./types.js";

type FunctionPropertyNames<T> = Extract<
  {
    [K in keyof T]-?: Exclude<T[K], undefined> extends (...args: unknown[]) => unknown ? K : never;
  }[keyof T],
  string
>;

/** Shared type for Plugin Api Method Name in src/plugins. */
export type PluginApiMethodName = FunctionPropertyNames<OpenClawPluginApi>;

/** Shared type for Plugin Api Lifecycle Policy in src/plugins. */
export type PluginApiLifecyclePolicy = {
  phase: "registration" | "runtime";
  lateCallable: boolean;
};

const PLUGIN_API_METHOD_POLICIES: Partial<Record<PluginApiMethodName, PluginApiLifecyclePolicy>> = {
  emitAgentEvent: { phase: "runtime", lateCallable: true },
  sendSessionAttachment: { phase: "runtime", lateCallable: true },
  scheduleSessionTurn: { phase: "runtime", lateCallable: true },
  unscheduleSessionTurnsByTag: { phase: "runtime", lateCallable: true },
};

/** Reused helper for get Plugin Api Method Lifecycle Policy behavior in src/plugins. */
export function getPluginApiMethodLifecyclePolicy(
  methodName: string,
): PluginApiLifecyclePolicy | undefined {
  return PLUGIN_API_METHOD_POLICIES[methodName as PluginApiMethodName];
}

/** Reused helper for is Late Callable Plugin Api Method behavior in src/plugins. */
export function isLateCallablePluginApiMethod(
  methodName: string,
): methodName is PluginApiMethodName {
  return getPluginApiMethodLifecyclePolicy(methodName)?.lateCallable === true;
}
