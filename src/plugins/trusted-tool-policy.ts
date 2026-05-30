import { getRuntimeConfig } from "../config/config.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { isPlainObject } from "../utils.js";
import type {
  PluginHookBeforeToolCallEvent,
  PluginHookBeforeToolCallResult,
  PluginHookToolContext,
  PluginHookToolInputKind,
  PluginHookToolKind,
} from "./hook-types.js";
import { getPluginSessionExtensionStateSync } from "./host-hook-state.js";
import type { PluginJsonValue, PluginTrustedToolPolicyRegistration } from "./host-hooks.js";
import type {
  PluginRegistry,
  PluginTrustedToolPolicyRegistryRegistration,
} from "./registry-types.js";
import { getActivePluginRegistry } from "./runtime.js";

type TrustedPolicyRegistration = PluginTrustedToolPolicyRegistryRegistration;
type TrustedPolicyDecisionField =
  | "allow"
  | "block"
  | "blockReason"
  | "params"
  | "reason"
  | "requireApproval";

type TrustedPolicyDecisionFieldRead =
  | {
      ok: true;
      present: boolean;
      value: unknown;
    }
  | {
      ok: false;
    };

type TrustedPolicyApproval = NonNullable<PluginHookBeforeToolCallResult["requireApproval"]>;

type TrustedPolicyApprovalField = keyof TrustedPolicyApproval;

const TRUSTED_POLICY_APPROVAL_SEVERITIES = new Set(["info", "warning", "critical"]);
const TRUSTED_POLICY_APPROVAL_TIMEOUT_BEHAVIORS = new Set(["allow", "deny"]);
const TRUSTED_POLICY_APPROVAL_DECISIONS = new Set(["allow-once", "allow-always", "deny"]);

export function hasTrustedToolPolicies(): boolean {
  return copyTrustedPolicyRegistrations(getActivePluginRegistry()).length > 0;
}

function unreadableTrustedPolicyRegistration(): TrustedPolicyRegistration {
  return {
    pluginId: "unknown-plugin",
    source: "runtime",
    get policy(): PluginTrustedToolPolicyRegistration {
      throw new Error("trusted policy registration is unreadable");
    },
  };
}

function copyTrustedPolicyRegistrations(
  registry: PluginRegistry | null | undefined,
): TrustedPolicyRegistration[] {
  let policies: unknown;
  try {
    policies = registry?.trustedToolPolicies;
  } catch {
    return [unreadableTrustedPolicyRegistration()];
  }
  if (!policies) {
    return [];
  }
  try {
    if (!Array.isArray(policies)) {
      return [unreadableTrustedPolicyRegistration()];
    }
  } catch {
    return [unreadableTrustedPolicyRegistration()];
  }

  let length: number;
  try {
    length = policies.length;
  } catch {
    return [unreadableTrustedPolicyRegistration()];
  }

  const copied: TrustedPolicyRegistration[] = [];
  for (let index = 0; index < length; index += 1) {
    try {
      copied.push(policies[index]);
    } catch {
      copied.push(unreadableTrustedPolicyRegistration());
    }
  }
  return copied;
}

function readTrustedPolicyPluginId(registration: TrustedPolicyRegistration): string {
  try {
    const pluginId = registration.pluginId;
    return typeof pluginId === "string" && pluginId.trim() ? pluginId.trim() : "unknown-plugin";
  } catch {
    return "unknown-plugin";
  }
}

function readTrustedPolicy(registration: TrustedPolicyRegistration):
  | {
      ok: true;
      policy: PluginTrustedToolPolicyRegistration;
    }
  | {
      ok: false;
    } {
  try {
    const policy = registration.policy;
    return policy && typeof policy.evaluate === "function" ? { ok: true, policy } : { ok: false };
  } catch {
    return { ok: false };
  }
}

function readTrustedPolicyId(registration: TrustedPolicyRegistration): string {
  const fallback = readTrustedPolicyPluginId(registration);
  const policy = readTrustedPolicy(registration);
  if (!policy.ok) {
    return fallback;
  }
  try {
    const id = policy.policy.id;
    return typeof id === "string" && id.trim() ? id.trim() : fallback;
  } catch {
    return fallback;
  }
}

function trustedPolicyDefaultBlockReason(registration: TrustedPolicyRegistration): string {
  return `blocked by ${readTrustedPolicyId(registration)}`;
}

function trustedPolicyFailureResult(
  registration: TrustedPolicyRegistration,
  detail: string,
): PluginHookBeforeToolCallResult {
  return {
    block: true,
    blockReason: `${trustedPolicyDefaultBlockReason(registration)}: ${detail}`,
  };
}

function readTrustedPolicyDecisionField(
  decision: unknown,
  field: TrustedPolicyDecisionField,
): TrustedPolicyDecisionFieldRead {
  if ((typeof decision !== "object" && typeof decision !== "function") || decision === null) {
    return { ok: true, present: false, value: undefined };
  }
  try {
    if (!(field in decision)) {
      return { ok: true, present: false, value: undefined };
    }
    return {
      ok: true,
      present: true,
      value: (decision as Record<string, unknown>)[field],
    };
  } catch {
    return { ok: false };
  }
}

function readTrustedPolicyDecisionString(
  decision: unknown,
  field: "blockReason" | "reason",
): string | undefined {
  const read = readTrustedPolicyDecisionField(decision, field);
  return read.ok && read.present && typeof read.value === "string" && read.value.trim()
    ? read.value
    : undefined;
}

function readPlainTrustedPolicyParams(value: unknown):
  | {
      ok: true;
      params?: Record<string, unknown>;
    }
  | {
      ok: false;
    } {
  try {
    return isPlainObject(value) ? { ok: true, params: value } : { ok: true };
  } catch {
    return { ok: false };
  }
}

function readTrustedPolicyApprovalField(
  approval: unknown,
  field: TrustedPolicyApprovalField,
): TrustedPolicyDecisionFieldRead {
  if ((typeof approval !== "object" && typeof approval !== "function") || approval === null) {
    return { ok: true, present: false, value: undefined };
  }
  try {
    if (!(field in approval)) {
      return { ok: true, present: false, value: undefined };
    }
    return {
      ok: true,
      present: true,
      value: (approval as Record<string, unknown>)[field],
    };
  } catch {
    return { ok: false };
  }
}

function normalizeTrustedPolicyApproval(value: unknown):
  | {
      ok: true;
      approval: TrustedPolicyApproval;
    }
  | {
      ok: false;
      detail: string;
    } {
  try {
    if (!isPlainObject(value)) {
      return { ok: false, detail: "policy decision is malformed" };
    }
  } catch {
    return { ok: false, detail: "policy decision has unreadable requireApproval" };
  }

  const title = readTrustedPolicyApprovalField(value, "title");
  const description = readTrustedPolicyApprovalField(value, "description");
  if (!title.ok || !description.ok) {
    return { ok: false, detail: "policy decision has unreadable requireApproval" };
  }
  if (typeof title.value !== "string" || typeof description.value !== "string") {
    return { ok: false, detail: "policy decision is malformed" };
  }

  const severity = readTrustedPolicyApprovalField(value, "severity");
  const timeoutMs = readTrustedPolicyApprovalField(value, "timeoutMs");
  const timeoutBehavior = readTrustedPolicyApprovalField(value, "timeoutBehavior");
  const allowedDecisions = readTrustedPolicyApprovalField(value, "allowedDecisions");
  const pluginId = readTrustedPolicyApprovalField(value, "pluginId");
  const onResolution = readTrustedPolicyApprovalField(value, "onResolution");
  if (
    !severity.ok ||
    !timeoutMs.ok ||
    !timeoutBehavior.ok ||
    !allowedDecisions.ok ||
    !pluginId.ok ||
    !onResolution.ok
  ) {
    return { ok: false, detail: "policy decision has unreadable requireApproval" };
  }

  const approval: TrustedPolicyApproval = {
    title: title.value,
    description: description.value,
  };

  if (severity.present && severity.value !== undefined) {
    if (
      typeof severity.value !== "string" ||
      !TRUSTED_POLICY_APPROVAL_SEVERITIES.has(severity.value)
    ) {
      return { ok: false, detail: "policy decision is malformed" };
    }
    approval.severity = severity.value as TrustedPolicyApproval["severity"];
  }
  if (timeoutMs.present && timeoutMs.value !== undefined) {
    if (typeof timeoutMs.value !== "number" || !Number.isFinite(timeoutMs.value)) {
      return { ok: false, detail: "policy decision is malformed" };
    }
    approval.timeoutMs = timeoutMs.value;
  }
  if (timeoutBehavior.present && timeoutBehavior.value !== undefined) {
    if (
      typeof timeoutBehavior.value !== "string" ||
      !TRUSTED_POLICY_APPROVAL_TIMEOUT_BEHAVIORS.has(timeoutBehavior.value)
    ) {
      return { ok: false, detail: "policy decision is malformed" };
    }
    approval.timeoutBehavior = timeoutBehavior.value as TrustedPolicyApproval["timeoutBehavior"];
  }
  if (allowedDecisions.present && allowedDecisions.value !== undefined) {
    try {
      if (!Array.isArray(allowedDecisions.value)) {
        return { ok: false, detail: "policy decision is malformed" };
      }
      const decisions: NonNullable<TrustedPolicyApproval["allowedDecisions"]> = [];
      for (let index = 0; index < allowedDecisions.value.length; index += 1) {
        const decision = allowedDecisions.value[index];
        if (typeof decision !== "string" || !TRUSTED_POLICY_APPROVAL_DECISIONS.has(decision)) {
          return { ok: false, detail: "policy decision is malformed" };
        }
        decisions.push(decision as NonNullable<TrustedPolicyApproval["allowedDecisions"]>[number]);
      }
      approval.allowedDecisions = decisions;
    } catch {
      return { ok: false, detail: "policy decision has unreadable requireApproval" };
    }
  }
  if (pluginId.present && pluginId.value !== undefined) {
    if (typeof pluginId.value !== "string") {
      return { ok: false, detail: "policy decision is malformed" };
    }
    approval.pluginId = pluginId.value;
  }
  if (onResolution.present && onResolution.value !== undefined) {
    if (typeof onResolution.value !== "function") {
      return { ok: false, detail: "policy decision is malformed" };
    }
    approval.onResolution = onResolution.value as TrustedPolicyApproval["onResolution"];
  }

  return { ok: true, approval };
}

function isPlainTrustedPolicyDecision(decision: unknown): boolean {
  try {
    return isPlainObject(decision);
  } catch {
    return false;
  }
}

function normalizeDerivedEventFields(
  value: Pick<PluginHookBeforeToolCallEvent, "derivedPaths"> | undefined,
): Pick<PluginHookBeforeToolCallEvent, "derivedPaths"> {
  return Array.isArray(value?.derivedPaths)
    ? { derivedPaths: Object.freeze([...value.derivedPaths]) }
    : {};
}

function normalizeToolIdentity(
  value:
    | Pick<PluginHookBeforeToolCallEvent, "toolKind" | "toolInputKind">
    | Pick<PluginHookToolContext, "toolKind" | "toolInputKind">
    | undefined,
): { toolKind?: PluginHookToolKind; toolInputKind?: PluginHookToolInputKind } {
  return {
    ...(value?.toolKind && { toolKind: value.toolKind }),
    ...(value?.toolInputKind && { toolInputKind: value.toolInputKind }),
  };
}

export async function runTrustedToolPolicies(
  event: PluginHookBeforeToolCallEvent,
  ctx: PluginHookToolContext,
  options?: {
    config?: OpenClawConfig;
    deriveEvent?: (
      params: Record<string, unknown>,
    ) => Pick<PluginHookBeforeToolCallEvent, "derivedPaths">;
    normalizeEvent?: (
      event: PluginHookBeforeToolCallEvent,
      ctx: PluginHookToolContext,
    ) =>
      | {
          params?: Record<string, unknown>;
          event?: Pick<PluginHookBeforeToolCallEvent, "toolKind" | "toolInputKind">;
          ctx?: Pick<PluginHookToolContext, "toolKind" | "toolInputKind">;
        }
      | undefined;
  },
): Promise<PluginHookBeforeToolCallResult | undefined> {
  const policies = copyTrustedPolicyRegistrations(getActivePluginRegistry());
  let adjustedParams = event.params;
  let hasAdjustedParams = false;
  let approval: PluginHookBeforeToolCallResult["requireApproval"];
  const sessionExtensionStateCache = new Map<string, Record<string, PluginJsonValue> | undefined>();
  let resolvedSessionConfig: OpenClawConfig | undefined = options?.config;
  let didResolveSessionConfig = Boolean(options?.config);
  const resolveSessionConfig = (): OpenClawConfig | undefined => {
    if (!didResolveSessionConfig) {
      didResolveSessionConfig = true;
      try {
        resolvedSessionConfig = getRuntimeConfig();
      } catch {
        resolvedSessionConfig = undefined;
      }
    }
    return resolvedSessionConfig;
  };
  const { derivedPaths, toolKind, toolInputKind, ...eventWithoutDerivedPaths } = event;
  const { toolKind: ctxToolKind, toolInputKind: ctxToolInputKind, ...ctxWithoutToolIdentity } = ctx;
  let currentDerivedEvent = normalizeDerivedEventFields({ derivedPaths });
  let currentEventToolIdentity = normalizeToolIdentity({ toolKind, toolInputKind });
  let currentContextToolIdentity = normalizeToolIdentity({
    toolKind: ctxToolKind,
    toolInputKind: ctxToolInputKind,
  });
  const buildEvent = (): PluginHookBeforeToolCallEvent => {
    return {
      ...eventWithoutDerivedPaths,
      params: adjustedParams,
      ...currentEventToolIdentity,
      ...currentDerivedEvent,
    };
  };
  for (const registration of policies) {
    const pluginId = readTrustedPolicyPluginId(registration);
    const policyCtx: PluginHookToolContext = {
      ...ctxWithoutToolIdentity,
      ...currentContextToolIdentity,
      // oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Plugin callers type JSON reads by namespace.
      getSessionExtension: <T extends PluginJsonValue = PluginJsonValue>(namespace: string) => {
        const normalizedNamespace = namespace.trim();
        const cacheKey = pluginId;
        if (!sessionExtensionStateCache.has(cacheKey)) {
          const config = ctx.sessionKey ? resolveSessionConfig() : undefined;
          sessionExtensionStateCache.set(
            cacheKey,
            config
              ? getPluginSessionExtensionStateSync({
                  cfg: config,
                  pluginId,
                  sessionKey: ctx.sessionKey,
                })
              : undefined,
          );
        }
        const pluginState = sessionExtensionStateCache.get(cacheKey);
        if (!normalizedNamespace || !pluginState) {
          return undefined;
        }
        return pluginState[normalizedNamespace] as T | undefined;
      },
    };
    const policy = readTrustedPolicy(registration);
    if (!policy.ok) {
      return trustedPolicyFailureResult(registration, "policy is unreadable");
    }

    let decision: unknown;
    try {
      decision = await policy.policy.evaluate(buildEvent(), policyCtx);
    } catch {
      return trustedPolicyFailureResult(registration, "policy evaluation failed");
    }
    if (decision === undefined) {
      continue;
    }
    if (!isPlainTrustedPolicyDecision(decision)) {
      return trustedPolicyFailureResult(registration, "policy decision is malformed");
    }
    const allow = readTrustedPolicyDecisionField(decision, "allow");
    if (!allow.ok) {
      return trustedPolicyFailureResult(registration, "policy decision has unreadable allow");
    }
    const hasAllow = allow.present && allow.value !== undefined;
    if (hasAllow && typeof allow.value !== "boolean") {
      return trustedPolicyFailureResult(registration, "policy decision is malformed");
    }
    if (hasAllow && allow.value === false) {
      return {
        block: true,
        blockReason:
          readTrustedPolicyDecisionString(decision, "reason") ??
          trustedPolicyDefaultBlockReason(registration),
      };
    }
    // `block: true` is terminal; normalize a missing blockReason to a deterministic
    // reason so downstream diagnostics match the `{ allow: false }` path above.
    const block = readTrustedPolicyDecisionField(decision, "block");
    if (!block.ok) {
      return trustedPolicyFailureResult(registration, "policy decision has unreadable block");
    }
    const hasBlock = block.present && block.value !== undefined;
    if (hasBlock && typeof block.value !== "boolean") {
      return trustedPolicyFailureResult(registration, "policy decision is malformed");
    }
    if (hasBlock && block.value === true) {
      return {
        block: true,
        blockReason:
          readTrustedPolicyDecisionString(decision, "blockReason") ??
          trustedPolicyDefaultBlockReason(registration),
      };
    }
    // `block: false` is a no-op (matches the regular `before_tool_call` hook
    // pipeline) — it does NOT short-circuit the policy chain. Params and
    // approvals are remembered so later trusted policies can still inspect or
    // block the final call.
    const params = readTrustedPolicyDecisionField(decision, "params");
    if (!params.ok) {
      return trustedPolicyFailureResult(registration, "policy decision has unreadable params");
    }
    const hasParams = params.present && params.value !== undefined;
    const plainParams = hasParams ? readPlainTrustedPolicyParams(params.value) : undefined;
    if (plainParams && !plainParams.ok) {
      return trustedPolicyFailureResult(registration, "policy decision has unreadable params");
    }
    if (plainParams?.params) {
      const normalized = options?.normalizeEvent?.(
        {
          ...eventWithoutDerivedPaths,
          params: plainParams.params,
          ...currentEventToolIdentity,
          ...currentDerivedEvent,
        },
        policyCtx,
      );
      adjustedParams = normalized?.params ?? plainParams.params;
      if (normalized?.event) {
        currentEventToolIdentity = normalizeToolIdentity(normalized.event);
      }
      if (normalized?.ctx) {
        currentContextToolIdentity = normalizeToolIdentity(normalized.ctx);
      } else if (normalized?.event) {
        currentContextToolIdentity = normalizeToolIdentity(normalized.event);
      }
      hasAdjustedParams = true;
      currentDerivedEvent = normalizeDerivedEventFields(options?.deriveEvent?.(adjustedParams));
    }
    const requireApproval = readTrustedPolicyDecisionField(decision, "requireApproval");
    if (!requireApproval.ok) {
      return trustedPolicyFailureResult(
        registration,
        "policy decision has unreadable requireApproval",
      );
    }
    const hasRequireApproval = requireApproval.present && requireApproval.value !== undefined;
    if (!allow.present && !block.present && !params.present && !requireApproval.present) {
      return trustedPolicyFailureResult(registration, "policy decision is malformed");
    }
    if (hasRequireApproval) {
      const normalizedApproval = normalizeTrustedPolicyApproval(requireApproval.value);
      if (!normalizedApproval.ok) {
        return trustedPolicyFailureResult(registration, normalizedApproval.detail);
      }
      if (!approval) {
        approval = normalizedApproval.approval;
      }
    }
  }
  if (!hasAdjustedParams && !approval) {
    return undefined;
  }
  return {
    ...(hasAdjustedParams ? { params: adjustedParams } : {}),
    ...(approval ? { requireApproval: approval } : {}),
  };
}
