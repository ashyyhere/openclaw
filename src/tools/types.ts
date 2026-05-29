// Public contracts for planning, gating, and exposing OpenClaw tools.
/** JSON scalar accepted in tool schemas, annotations, and availability context. */
export type JsonPrimitive = string | number | boolean | null;

/** Recursive JSON value accepted by tool metadata contracts. */
export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

/** JSON object used for schemas and structured annotations. */
export type JsonObject = { readonly [key: string]: JsonValue };

/** Stable owner identity for diagnostics, routing, and UI grouping. */
export type ToolOwnerRef =
  | { readonly kind: "core" }
  | { readonly kind: "plugin"; readonly pluginId: string }
  | { readonly kind: "channel"; readonly channelId: string; readonly pluginId?: string }
  | { readonly kind: "mcp"; readonly serverId: string };

/** Runtime executor identity used after a descriptor is visible in the tool plan. */
export type ToolExecutorRef =
  | { readonly kind: "core"; readonly executorId: string }
  | { readonly kind: "plugin"; readonly pluginId: string; readonly toolName: string }
  | { readonly kind: "channel"; readonly channelId: string; readonly actionId: string }
  | { readonly kind: "mcp"; readonly serverId: string; readonly toolName: string };

/** Atomic condition that can hide a tool until auth, config, env, or context is ready. */
export type ToolAvailabilitySignal =
  | { readonly kind: "always" }
  | { readonly kind: "auth"; readonly providerId: string }
  | {
      readonly kind: "config";
      readonly path: readonly string[];
      readonly check?: "exists" | "non-empty" | "available";
    }
  | { readonly kind: "env"; readonly name: string }
  | { readonly kind: "plugin-enabled"; readonly pluginId: string }
  | { readonly kind: "context"; readonly key: string; readonly equals?: JsonPrimitive };

/** Recursive availability expression; `allOf` requires all entries, `anyOf` requires one. */
export type ToolAvailabilityExpression =
  | ToolAvailabilitySignal
  | { readonly allOf: readonly ToolAvailabilityExpression[] }
  | { readonly anyOf: readonly ToolAvailabilityExpression[] };

/** Complete model-facing tool descriptor plus owner, executor, and availability metadata. */
export type ToolDescriptor = {
  readonly name: string;
  readonly title?: string;
  readonly description: string;
  readonly inputSchema: JsonObject;
  readonly outputSchema?: JsonObject;
  readonly owner: ToolOwnerRef;
  readonly executor?: ToolExecutorRef;
  readonly availability?: ToolAvailabilityExpression;
  readonly annotations?: JsonObject;
  readonly sortKey?: string;
};

/** Snapshot used to evaluate whether descriptors should be visible to a model. */
export type ToolAvailabilityContext = {
  readonly authProviderIds?: ReadonlySet<string>;
  readonly config?: JsonObject;
  readonly isConfigValueAvailable?: (params: {
    readonly value: JsonValue;
    readonly path: readonly string[];
    readonly signal: Extract<ToolAvailabilitySignal, { readonly kind: "config" }>;
  }) => boolean;
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly enabledPluginIds?: ReadonlySet<string>;
  readonly values?: Readonly<Record<string, JsonPrimitive | undefined>>;
};

/** Machine-readable reason a descriptor was hidden from the tool plan. */
export type ToolUnavailableReason =
  | "auth-missing"
  | "config-missing"
  | "context-mismatch"
  | "env-missing"
  | "plugin-disabled"
  | "unsupported-signal";

/** Diagnostic emitted for a failed availability signal or malformed expression. */
export type ToolAvailabilityDiagnostic = {
  readonly reason: ToolUnavailableReason;
  readonly signal?: ToolAvailabilitySignal;
  readonly message: string;
};

/** Visible descriptor paired with the executor that can run it. */
export type ToolPlanEntry = {
  readonly descriptor: ToolDescriptor;
  readonly executor: ToolExecutorRef;
};

/** Hidden descriptor paired with diagnostics explaining why it is unavailable. */
export type HiddenToolPlanEntry = {
  readonly descriptor: ToolDescriptor;
  readonly diagnostics: readonly ToolAvailabilityDiagnostic[];
};

/** Result of planning descriptors into visible and hidden tool sets. */
export type ToolPlan = {
  readonly visible: readonly ToolPlanEntry[];
  readonly hidden: readonly HiddenToolPlanEntry[];
};

/** Inputs for producing a sorted, availability-filtered tool plan. */
export type BuildToolPlanOptions = {
  readonly descriptors: readonly ToolDescriptor[];
  readonly availability?: ToolAvailabilityContext;
};
