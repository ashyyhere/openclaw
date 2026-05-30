/** Public SDK barrel for realtime voice provider plugin contracts. */
export type { RealtimeVoiceProviderPlugin } from "../plugins/types.js";
/** Realtime voice provider, bridge, audio, tool, and config contracts. */
export type {
  RealtimeVoiceAudioFormat,
  RealtimeVoiceBargeInOptions,
  RealtimeVoiceBridge,
  RealtimeVoiceBridgeCallbacks,
  RealtimeVoiceBridgeEvent,
  RealtimeVoiceBrowserSession,
  RealtimeVoiceBrowserSessionCreateRequest,
  RealtimeVoiceBridgeCreateRequest,
  RealtimeVoiceProviderCapabilities,
  RealtimeVoiceCloseReason,
  RealtimeVoiceProviderConfig,
  RealtimeVoiceProviderConfiguredContext,
  RealtimeVoiceProviderId,
  RealtimeVoiceProviderResolveConfigContext,
  RealtimeVoiceRole,
  RealtimeVoiceTool,
  RealtimeVoiceToolCallEvent,
  RealtimeVoiceToolResultOptions,
} from "../talk/provider-types.js";
/** Canonical realtime voice audio format identifiers. */
export {
  REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
  REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
} from "../talk/provider-types.js";
/** Talk event sequencing and transport contracts. */
export {
  createTalkEventSequencer,
  TALK_EVENT_TYPES,
  type TalkBrain,
  type TalkEvent,
  type TalkEventContext,
  type TalkEventInput,
  type TalkEventSequencer,
  type TalkEventType,
  type TalkMode,
  type TalkTransport,
} from "../talk/talk-events.js";
/** Talk diagnostic event helpers. */
export { createTalkDiagnosticEvent, recordTalkDiagnosticEvent } from "../talk/diagnostics.js";
/** Talk log record helpers. */
export { createTalkLogRecord, recordTalkLogEvent } from "../talk/logging.js";
/** Talk observability event recorder. */
export { recordTalkObservabilityEvent } from "../talk/observability.js";
/** Session controller for coordinating talk turns and transports. */
export {
  createTalkSessionController,
  normalizeTalkTransport,
  type TalkEnsureTurnResult,
  type TalkSessionControllerOptions,
  type TalkSessionController,
  type TalkSessionControllerParams,
  type TalkTurnFailure,
  type TalkTurnFailureReason,
  type TalkTurnResult,
  type TalkTurnSuccess,
} from "../talk/talk-session-controller.js";
/** Realtime voice activation-name normalization and matching helpers. */
export {
  REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS,
  isSupportedRealtimeVoiceActivationName,
  matchRealtimeVoiceActivationName,
  normalizeRealtimeVoiceActivationName,
  normalizeRealtimeVoiceActivationNamePrefix,
  normalizeSupportedRealtimeVoiceActivationName,
  realtimeVoiceActivationNameWordCount,
  sortRealtimeVoiceActivationNames,
  type RealtimeVoiceActivationNameEdge,
  type RealtimeVoiceActivationNameMatchKind,
  type RealtimeVoiceActivationNameTranscriptResult,
} from "../talk/activation-name.js";
/** Consult transcript classifier for skippable voice turns. */
export {
  classifySkippableRealtimeVoiceConsultTranscript,
  type SkippableRealtimeVoiceConsultTranscriptReason,
} from "../talk/consult-transcript.js";
/** Consult question parsing and speakable tool-result helpers. */
export {
  matchRealtimeVoiceConsultQuestions,
  normalizeRealtimeVoiceConsultQuestion,
  readRealtimeVoiceConsultQuestion,
  readSpeakableRealtimeVoiceToolResult,
  type RealtimeVoiceConsultQuestionMatchOptions,
  type RealtimeVoiceSpeakableToolResultOptions,
} from "../talk/consult-question.js";
/** Forced consult coordinator for native and timer-triggered consults. */
export {
  createRealtimeVoiceForcedConsultCoordinator,
  type RealtimeVoiceForcedConsultCoordinator,
  type RealtimeVoiceForcedConsultCoordinatorOptions,
  type RealtimeVoiceForcedConsultHandle,
  type RealtimeVoiceForcedConsultNativeMatch,
  type RealtimeVoiceForcedConsultNativeRecentOptions,
  type RealtimeVoiceForcedConsultTimer,
} from "../talk/forced-consult-coordinator.js";
/** Turn-context tracker for associating voice events with agent turns. */
export {
  createRealtimeVoiceTurnContextTracker,
  type RealtimeVoiceTurnContextHandle,
  type RealtimeVoiceTurnContextTracker,
  type RealtimeVoiceTurnContextTrackerOptions,
} from "../talk/turn-context-tracker.js";
/** Output activity tracker for spoken/audio response progress. */
export {
  createRealtimeVoiceOutputActivityTracker,
  type RealtimeVoiceOutputActivityDelta,
  type RealtimeVoiceOutputActivitySnapshot,
  type RealtimeVoiceOutputActivityTracker,
  type RealtimeVoiceOutputActivityTrackerOptions,
} from "../talk/output-activity-tracker.js";
/** Agent consult tool builders, parsers, policy helpers, and constants. */
export {
  buildRealtimeVoiceAgentConsultChatMessage,
  buildRealtimeVoiceAgentConsultPolicyInstructions,
  buildRealtimeVoiceAgentConsultPrompt,
  buildRealtimeVoiceAgentConsultWorkingResponse,
  collectRealtimeVoiceAgentConsultVisibleText,
  isRealtimeVoiceAgentConsultToolPolicy,
  parseRealtimeVoiceAgentConsultArgs,
  REALTIME_VOICE_AGENT_CONSULT_TOOL,
  REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
  REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES,
  resolveRealtimeVoiceAgentConsultToolPolicy,
  resolveRealtimeVoiceAgentConsultTools,
  resolveRealtimeVoiceAgentConsultToolsAllow,
  type RealtimeVoiceAgentConsultArgs,
  type RealtimeVoiceAgentConsultToolPolicy,
  type RealtimeVoiceAgentConsultTranscriptEntry,
} from "../talk/agent-consult-tool.js";
/** Runtime entrypoint for consulting the agent during a voice session. */
export {
  consultRealtimeVoiceAgent,
  type RealtimeVoiceAgentConsultResult,
  type RealtimeVoiceAgentConsultRuntime,
} from "../talk/agent-consult-runtime.js";
/** Talkback queue for returning agent speech to realtime voice providers. */
export {
  createRealtimeVoiceAgentTalkbackQueue,
  type RealtimeVoiceAgentTalkbackQueue,
  type RealtimeVoiceAgentTalkbackQueueParams,
  type RealtimeVoiceAgentTalkbackResult,
} from "../talk/agent-talkback-runtime.js";
/** Agent run-control tool helpers for cancel, pause, resume, and speech control. */
export {
  buildRealtimeVoiceAgentCancelProviderResult,
  buildRealtimeVoiceAgentControlSpeechMessage,
  classifyRealtimeVoiceAgentControlText,
  controlRealtimeVoiceAgentRun,
  normalizeRealtimeVoiceAgentControlMode,
  parseRealtimeVoiceAgentControlToolArgs,
  REALTIME_VOICE_AGENT_CONTROL_MODES,
  REALTIME_VOICE_AGENT_CONTROL_TOOL,
  REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME,
  resolveRealtimeVoiceAgentControlIntent,
  shouldAutoControlRealtimeVoiceAgentText,
  type RealtimeVoiceAgentControlMode,
  type RealtimeVoiceAgentControlIntent,
  type RealtimeVoiceAgentControlProviderResult,
  type RealtimeVoiceAgentControlResult,
} from "../talk/agent-run-control.js";
/** Fast-context consult resolver and result contracts. */
export {
  resolveRealtimeVoiceFastContextConsult,
  type RealtimeVoiceFastContextConfig,
  type RealtimeVoiceFastContextConsultResult,
  type RealtimeVoiceFastContextLabels,
} from "../talk/fast-context-runtime.js";
/** Realtime voice provider registry lookup and id normalization helpers. */
export {
  canonicalizeRealtimeVoiceProviderId,
  getRealtimeVoiceProvider,
  listRealtimeVoiceProviders,
  normalizeRealtimeVoiceProviderId,
} from "../talk/provider-registry.js";
/** Configured realtime voice provider resolver. */
export {
  resolveConfiguredRealtimeVoiceProvider,
  type ResolvedRealtimeVoiceProvider,
  type ResolveConfiguredRealtimeVoiceProviderParams,
} from "../talk/provider-resolver.js";
/** Bridge session runtime for connecting provider audio to sinks. */
export {
  createRealtimeVoiceBridgeSession,
  type RealtimeVoiceAudioSink,
  type RealtimeVoiceBridgeSession,
  type RealtimeVoiceBridgeSessionParams,
  type RealtimeVoiceMarkStrategy,
} from "../talk/session-runtime.js";
/** Bridge event and transcript logging plus health heuristics. */
export {
  extendRealtimeVoiceOutputEchoSuppression,
  getRealtimeVoiceBridgeEventHealth,
  getRealtimeVoiceTranscriptHealth,
  isLikelyRealtimeVoiceAssistantEchoTranscript,
  recordRealtimeVoiceBridgeEvent,
  recordRealtimeVoiceTranscript,
  type RealtimeVoiceBridgeEventHealth,
  type RealtimeVoiceBridgeEventLogEntry,
  type RealtimeVoiceTranscriptEntry,
  type RealtimeVoiceTranscriptHealth,
} from "../talk/session-log-runtime.js";
/** PCM, mulaw, and resampling helpers for realtime voice audio. */
export {
  convertPcmToMulaw8k,
  mulawToPcm,
  pcmToMulaw,
  resamplePcm,
  resamplePcmTo8k,
} from "../talk/audio-codec.js";
