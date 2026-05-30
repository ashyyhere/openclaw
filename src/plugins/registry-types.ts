// Plugin registry record and registration contracts.
import type { AgentHarness } from "../agents/harness/types.js";
import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import type { GatewayMethodDescriptor } from "../gateway/methods/descriptor.js";
import type { GatewayRequestHandlers } from "../gateway/server-methods/types.js";
import type { HookEntry } from "../hooks/types.js";
import type { JsonSchemaObject } from "../shared/json-schema.types.js";
import type {
  AgentToolResultMiddleware,
  AgentToolResultMiddlewareRuntime,
} from "./agent-tool-result-middleware-types.js";
import type { CodexAppServerExtensionFactory } from "./codex-app-server-extension-types.js";
import type { PluginCompatCode } from "./compat/registry.js";
import type { PluginActivationSource } from "./config-state.js";
import type { EmbeddingProviderAdapter } from "./embedding-providers.js";
import type {
  PluginAgentEventSubscriptionRegistration,
  PluginControlUiDescriptor,
  PluginRuntimeLifecycleRegistration,
  PluginSessionActionRegistration,
  PluginSessionSchedulerJobRegistration,
  PluginSessionExtensionRegistration,
  PluginToolMetadataRegistration,
  PluginTrustedToolPolicyRegistration,
} from "./host-hooks.js";
import type {
  PluginBundleFormat,
  PluginConfigUiHint,
  PluginDiagnostic,
  PluginFormat,
} from "./manifest-types.js";
import type { PluginManifestContracts } from "./manifest.js";
import type { MemoryEmbeddingProviderAdapter } from "./memory-embedding-providers.js";
import type { PluginKind } from "./plugin-kind.types.js";
import type { PluginRuntime } from "./runtime/types.js";
import type { PluginDependencyStatus } from "./status-dependencies.js";
import type {
  CliBackendPlugin,
  ImageGenerationProviderPlugin,
  MediaUnderstandingProviderPlugin,
  TranscriptSourceProvider,
  MusicGenerationProviderPlugin,
  OpenClawPluginChannelRegistration,
  OpenClawPluginCliCommandDescriptor,
  OpenClawPluginCliRegistrar,
  OpenClawPluginCommandDefinition,
  OpenClawPluginGatewayRuntimeScopeSurface,
  OpenClawGatewayDiscoveryService,
  OpenClawPluginHttpRouteAuth,
  OpenClawPluginHttpRouteHandler,
  OpenClawPluginHttpRouteUpgradeHandler,
  OpenClawPluginHttpRouteMatch,
  OpenClawPluginHostedMediaResolver,
  OpenClawPluginReloadRegistration,
  OpenClawPluginSecurityAuditCollector,
  OpenClawPluginService,
  OpenClawPluginToolFactory,
  PluginConversationBindingResolvedEvent,
  PluginHookRegistration as TypedPluginHookRegistration,
  PluginLogger,
  PluginOrigin,
  PluginTextTransformRegistration,
  MigrationProviderPlugin,
  ProviderPlugin,
  RealtimeTranscriptionProviderPlugin,
  RealtimeVoiceProviderPlugin,
  SpeechProviderPlugin,
  VideoGenerationProviderPlugin,
  WebFetchProviderPlugin,
  WebSearchProviderPlugin,
  UnifiedModelCatalogProviderPlugin,
} from "./types.js";

/** Registered tool factory and declared tool names owned by a plugin. */
export type PluginToolRegistration = {
  pluginId: string;
  pluginName?: string;
  factory: OpenClawPluginToolFactory;
  names: string[];
  declaredNames?: string[];
  optional: boolean;
  source: string;
  rootDir?: string;
};

/** Registered CLI command tree contributed by a plugin. */
export type PluginCliRegistration = {
  pluginId: string;
  pluginName?: string;
  register: OpenClawPluginCliRegistrar;
  parentPath: string[];
  commands: string[];
  descriptors: OpenClawPluginCliCommandDescriptor[];
  source: string;
  rootDir?: string;
};

/** HTTP route handler registration exposed through the Gateway. */
export type PluginHttpRouteRegistration = {
  pluginId?: string;
  path: string;
  handler: OpenClawPluginHttpRouteHandler;
  handleUpgrade?: OpenClawPluginHttpRouteUpgradeHandler;
  auth: OpenClawPluginHttpRouteAuth;
  match: OpenClawPluginHttpRouteMatch;
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface;
  gatewayMethodDispatchAllowed?: boolean;
  nodeCapability?: {
    surface: string;
    ttlMs?: number;
  };
  source?: string;
};

/** Hosted media resolver contributed by a plugin. */
export type PluginHostedMediaResolverRegistration = {
  pluginId: string;
  pluginName?: string;
  resolver: OpenClawPluginHostedMediaResolver;
  source: string;
  rootDir?: string;
};

/** Runtime channel plugin registration. */
export type PluginChannelRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin;
  source: string;
  rootDir?: string;
};

/** Setup-mode channel registration with enabled-state metadata. */
export type PluginChannelSetupRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin;
  source: string;
  enabled: boolean;
  rootDir?: string;
};

/** Text-inference provider registration. */
export type PluginProviderRegistration = {
  pluginId: string;
  pluginName?: string;
  provider: ProviderPlugin;
  source: string;
  rootDir?: string;
};

/** Unified model catalog provider registration. */
export type PluginModelCatalogProviderRegistration = {
  pluginId: string;
  pluginName?: string;
  provider: UnifiedModelCatalogProviderPlugin;
  source: string;
  rootDir?: string;
};

/** CLI backend registration for plugin-owned local inference backends. */
export type PluginCliBackendRegistration = {
  pluginId: string;
  pluginName?: string;
  backend: CliBackendPlugin;
  source: string;
  rootDir?: string;
};

/** Text transform registration contributed by a plugin. */
export type PluginTextTransformsRegistration = {
  pluginId: string;
  pluginName?: string;
  transforms: PluginTextTransformRegistration;
  source: string;
  rootDir?: string;
};

type PluginOwnedProviderRegistration<T extends { id: string }> = {
  pluginId: string;
  pluginName?: string;
  provider: T;
  source: string;
  rootDir?: string;
};

/** Speech provider registration owned by a plugin. */
export type PluginSpeechProviderRegistration =
  PluginOwnedProviderRegistration<SpeechProviderPlugin>;
/** Embedding provider registration owned by a plugin. */
export type PluginEmbeddingProviderRegistration =
  PluginOwnedProviderRegistration<EmbeddingProviderAdapter>;
/** Realtime transcription provider registration owned by a plugin. */
export type PluginRealtimeTranscriptionProviderRegistration =
  PluginOwnedProviderRegistration<RealtimeTranscriptionProviderPlugin>;
/** Realtime voice provider registration owned by a plugin. */
export type PluginRealtimeVoiceProviderRegistration =
  PluginOwnedProviderRegistration<RealtimeVoiceProviderPlugin>;
/** Media-understanding provider registration owned by a plugin. */
export type PluginMediaUnderstandingProviderRegistration =
  PluginOwnedProviderRegistration<MediaUnderstandingProviderPlugin>;
/** Transcript source provider registration owned by a plugin. */
export type PluginTranscriptsSourceProviderRegistration =
  PluginOwnedProviderRegistration<TranscriptSourceProvider>;
/** Image generation provider registration owned by a plugin. */
export type PluginImageGenerationProviderRegistration =
  PluginOwnedProviderRegistration<ImageGenerationProviderPlugin>;
/** Video generation provider registration owned by a plugin. */
export type PluginVideoGenerationProviderRegistration =
  PluginOwnedProviderRegistration<VideoGenerationProviderPlugin>;
/** Music generation provider registration owned by a plugin. */
export type PluginMusicGenerationProviderRegistration =
  PluginOwnedProviderRegistration<MusicGenerationProviderPlugin>;
/** Web fetch provider registration owned by a plugin. */
export type PluginWebFetchProviderRegistration =
  PluginOwnedProviderRegistration<WebFetchProviderPlugin>;
/** Web search provider registration owned by a plugin. */
export type PluginWebSearchProviderRegistration =
  PluginOwnedProviderRegistration<WebSearchProviderPlugin>;
/** Migration provider registration owned by a plugin. */
export type PluginMigrationProviderRegistration =
  PluginOwnedProviderRegistration<MigrationProviderPlugin>;
/** Memory embedding provider registration owned by a plugin. */
export type PluginMemoryEmbeddingProviderRegistration =
  PluginOwnedProviderRegistration<MemoryEmbeddingProviderAdapter>;
/** Codex app-server extension factory registration. */
export type PluginCodexAppServerExtensionFactoryRegistration = {
  pluginId: string;
  pluginName?: string;
  rawFactory: CodexAppServerExtensionFactory;
  factory: CodexAppServerExtensionFactory;
  source: string;
  rootDir?: string;
};
/** Agent tool-result middleware registration and runtime filters. */
export type PluginAgentToolResultMiddlewareRegistration = {
  pluginId: string;
  pluginName?: string;
  rawHandler: AgentToolResultMiddleware;
  handler: AgentToolResultMiddleware;
  runtimes: AgentToolResultMiddlewareRuntime[];
  source: string;
  rootDir?: string;
};
/** Agent harness runtime registration. */
export type PluginAgentHarnessRegistration = {
  pluginId: string;
  pluginName?: string;
  harness: AgentHarness;
  source: string;
  rootDir?: string;
};

/** Hook registration with event names and source metadata. */
export type PluginHookRegistration = {
  pluginId: string;
  entry: HookEntry;
  events: string[];
  source: string;
  rootDir?: string;
};

/** Long-lived plugin service registration. */
export type PluginServiceRegistration = {
  pluginId: string;
  pluginName?: string;
  service: OpenClawPluginService;
  source: string;
  origin: PluginOrigin;
  trustedOfficialInstall?: boolean;
  rootDir?: string;
};

/** Gateway discovery service registration. */
export type PluginGatewayDiscoveryServiceRegistration = {
  pluginId: string;
  pluginName?: string;
  service: OpenClawGatewayDiscoveryService;
  source: string;
  rootDir?: string;
};

/** Reload handler registration for plugin-owned runtime state. */
export type PluginReloadRegistration = {
  pluginId: string;
  pluginName?: string;
  registration: OpenClawPluginReloadRegistration;
  source: string;
  rootDir?: string;
};

/** Node-host command registration contributed by a plugin. */
export type PluginNodeHostCommandRegistration = {
  pluginId: string;
  pluginName?: string;
  command: import("./types.js").OpenClawPluginNodeHostCommand;
  source: string;
  rootDir?: string;
};

/** Node invocation policy registration contributed by a plugin. */
export type PluginNodeInvokePolicyRegistration = {
  pluginId: string;
  pluginName?: string;
  policy: import("./types.js").OpenClawPluginNodeInvokePolicy;
  pluginConfig?: Record<string, unknown>;
  source: string;
  rootDir?: string;
};

/** Security audit collector registration. */
export type PluginSecurityAuditCollectorRegistration = {
  pluginId: string;
  pluginName?: string;
  collector: OpenClawPluginSecurityAuditCollector;
  source: string;
  rootDir?: string;
};

/** Plugin command definition registration. */
export type PluginCommandRegistration = {
  pluginId: string;
  pluginName?: string;
  command: OpenClawPluginCommandDefinition;
  source: string;
  rootDir?: string;
};

/** Session extension registration stored in the plugin registry. */
export type PluginSessionExtensionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  extension: PluginSessionExtensionRegistration;
  source: string;
  rootDir?: string;
};

/** Trusted tool policy registration stored in the plugin registry. */
export type PluginTrustedToolPolicyRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  policy: PluginTrustedToolPolicyRegistration;
  source: string;
  rootDir?: string;
};

/** Tool metadata registration stored in the plugin registry. */
export type PluginToolMetadataRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  metadata: PluginToolMetadataRegistration;
  source: string;
  rootDir?: string;
};

/** Control UI descriptor registration stored in the plugin registry. */
export type PluginControlUiDescriptorRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  descriptor: PluginControlUiDescriptor;
  source: string;
  rootDir?: string;
};

/** Runtime lifecycle hook registration stored in the plugin registry. */
export type PluginRuntimeLifecycleRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  lifecycle: PluginRuntimeLifecycleRegistration;
  source: string;
  rootDir?: string;
};

/** Agent event subscription registration stored in the plugin registry. */
export type PluginAgentEventSubscriptionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  subscription: PluginAgentEventSubscriptionRegistration;
  source: string;
  rootDir?: string;
};

/** Session scheduler job registration stored in the plugin registry. */
export type PluginSessionSchedulerJobRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  job: PluginSessionSchedulerJobRegistration;
  generation?: number;
  source: string;
  rootDir?: string;
};

/** Session action registration stored in the plugin registry. */
export type PluginSessionActionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  action: PluginSessionActionRegistration;
  source: string;
  rootDir?: string;
};

/** Conversation-binding resolved handler registration. */
export type PluginConversationBindingResolvedHandlerRegistration = {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  handler: (event: PluginConversationBindingResolvedEvent) => void | Promise<void>;
  source: string;
  rootDir?: string;
};

/** Loaded plugin summary record exposed by registry discovery. */
export type PluginRecord = {
  id: string;
  name: string;
  version?: string;
  packageName?: string;
  description?: string;
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  bundleCapabilities?: string[];
  kind?: PluginKind | PluginKind[];
  source: string;
  rootDir?: string;
  origin: PluginOrigin;
  workspaceDir?: string;
  trustedOfficialInstall?: boolean;
  enabled: boolean;
  explicitlyEnabled?: boolean;
  activated?: boolean;
  imported?: boolean;
  compat?: readonly PluginCompatCode[];
  activationSource?: PluginActivationSource;
  activationReason?: string;
  status: "loaded" | "disabled" | "error";
  error?: string;
  failedAt?: Date;
  failurePhase?: "validation" | "load" | "register";
  toolNames: string[];
  hookNames: string[];
  channelIds: string[];
  cliBackendIds: string[];
  providerIds: string[];
  syntheticAuthRefs?: string[];
  embeddingProviderIds: string[];
  speechProviderIds: string[];
  realtimeTranscriptionProviderIds: string[];
  realtimeVoiceProviderIds: string[];
  mediaUnderstandingProviderIds: string[];
  transcriptSourceProviderIds: string[];
  imageGenerationProviderIds: string[];
  videoGenerationProviderIds: string[];
  musicGenerationProviderIds: string[];
  webFetchProviderIds: string[];
  webSearchProviderIds: string[];
  migrationProviderIds: string[];
  contextEngineIds?: string[];
  memoryEmbeddingProviderIds: string[];
  agentHarnessIds: string[];
  cliCommands: string[];
  services: string[];
  gatewayDiscoveryServiceIds: string[];
  commands: string[];
  httpRoutes: number;
  hookCount: number;
  configSchema: boolean;
  configUiHints?: Record<string, PluginConfigUiHint>;
  configJsonSchema?: JsonSchemaObject;
  contracts?: PluginManifestContracts;
  memorySlotSelected?: boolean;
  dependencyStatus?: PluginDependencyStatus;
};

/** Complete plugin registry snapshot assembled during plugin loading. */
export type PluginRegistry = {
  plugins: PluginRecord[];
  tools: PluginToolRegistration[];
  hooks: PluginHookRegistration[];
  typedHooks: TypedPluginHookRegistration[];
  channels: PluginChannelRegistration[];
  channelSetups: PluginChannelSetupRegistration[];
  providers: PluginProviderRegistration[];
  modelCatalogProviders: PluginModelCatalogProviderRegistration[];
  cliBackends?: PluginCliBackendRegistration[];
  textTransforms: PluginTextTransformsRegistration[];
  embeddingProviders: PluginEmbeddingProviderRegistration[];
  speechProviders: PluginSpeechProviderRegistration[];
  realtimeTranscriptionProviders: PluginRealtimeTranscriptionProviderRegistration[];
  realtimeVoiceProviders: PluginRealtimeVoiceProviderRegistration[];
  mediaUnderstandingProviders: PluginMediaUnderstandingProviderRegistration[];
  transcriptSourceProviders: PluginTranscriptsSourceProviderRegistration[];
  imageGenerationProviders: PluginImageGenerationProviderRegistration[];
  videoGenerationProviders: PluginVideoGenerationProviderRegistration[];
  musicGenerationProviders: PluginMusicGenerationProviderRegistration[];
  webFetchProviders: PluginWebFetchProviderRegistration[];
  webSearchProviders: PluginWebSearchProviderRegistration[];
  migrationProviders: PluginMigrationProviderRegistration[];
  codexAppServerExtensionFactories: PluginCodexAppServerExtensionFactoryRegistration[];
  agentToolResultMiddlewares: PluginAgentToolResultMiddlewareRegistration[];
  memoryEmbeddingProviders: PluginMemoryEmbeddingProviderRegistration[];
  agentHarnesses: PluginAgentHarnessRegistration[];
  gatewayHandlers: GatewayRequestHandlers;
  gatewayMethodDescriptors: GatewayMethodDescriptor[];
  coreGatewayMethodNames?: string[];
  httpRoutes: PluginHttpRouteRegistration[];
  hostedMediaResolvers?: PluginHostedMediaResolverRegistration[];
  cliRegistrars: PluginCliRegistration[];
  reloads?: PluginReloadRegistration[];
  nodeHostCommands?: PluginNodeHostCommandRegistration[];
  nodeInvokePolicies?: PluginNodeInvokePolicyRegistration[];
  securityAuditCollectors?: PluginSecurityAuditCollectorRegistration[];
  services: PluginServiceRegistration[];
  gatewayDiscoveryServices: PluginGatewayDiscoveryServiceRegistration[];
  commands: PluginCommandRegistration[];
  sessionExtensions?: PluginSessionExtensionRegistryRegistration[];
  trustedToolPolicies?: PluginTrustedToolPolicyRegistryRegistration[];
  toolMetadata?: PluginToolMetadataRegistryRegistration[];
  controlUiDescriptors?: PluginControlUiDescriptorRegistryRegistration[];
  runtimeLifecycles?: PluginRuntimeLifecycleRegistryRegistration[];
  agentEventSubscriptions?: PluginAgentEventSubscriptionRegistryRegistration[];
  sessionSchedulerJobs?: PluginSessionSchedulerJobRegistryRegistration[];
  sessionActions?: PluginSessionActionRegistryRegistration[];
  conversationBindingResolvedHandlers: PluginConversationBindingResolvedHandlerRegistration[];
  diagnostics: PluginDiagnostic[];
};

/** Host inputs required to assemble a plugin registry. */
export type PluginRegistryParams = {
  logger: PluginLogger;
  coreGatewayHandlers?: GatewayRequestHandlers;
  coreGatewayMethodNames?: readonly string[];
  runtime: PluginRuntime;
  hostServices?: {
    /** May be a live accessor; plugin APIs must read it at call time. */
    cron?: import("../cron/service-contract.js").CronServiceContract;
  };
  activateGlobalSideEffects?: boolean;
};

/** Plugin registration mode selected by the host loader. */
export type PluginRegistrationMode = import("./types.js").PluginRegistrationMode;
/** Node host command contract re-exported for registry callers. */
export type OpenClawPluginNodeHostCommand = import("./types.js").OpenClawPluginNodeHostCommand;
/** Tool execution context contract re-exported for registry callers. */
export type OpenClawPluginToolContext = import("./types.js").OpenClawPluginToolContext;
/** HTTP route parameter contract re-exported for registry callers. */
export type OpenClawPluginHttpRouteParams = import("./types.js").OpenClawPluginHttpRouteParams;
/** Hook registration options re-exported for registry callers. */
export type OpenClawPluginHookOptions = import("./types.js").OpenClawPluginHookOptions;
/** Typed hook handler map re-exported for registry callers. */
export type PluginHookHandlerMap = import("./types.js").PluginHookHandlerMap;
/** Plugin API contract re-exported for registry callers. */
export type OpenClawPluginApi = import("./types.js").OpenClawPluginApi;
/** Typed plugin hook registration alias. */
export type TypedPluginHook = TypedPluginHookRegistration;
/** Channel registration alias retained for registry callers. */
export type OpenClawPluginChannelReg = OpenClawPluginChannelRegistration;
