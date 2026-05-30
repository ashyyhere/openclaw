// Voice-call response model resolution chooses explicit voice config or agent defaults.
import type { VoiceCallConfig } from "./config.js";
import type { CoreAgentDeps } from "./core-bridge.js";

/** Resolve provider/model fields for voice-call response generation. */
export function resolveVoiceResponseModel(params: {
  voiceConfig: VoiceCallConfig;
  agentRuntime: CoreAgentDeps;
}): {
  modelRef: string;
  provider: string;
  model: string;
} {
  const modelRef =
    params.voiceConfig.responseModel ??
    `${params.agentRuntime.defaults.provider}/${params.agentRuntime.defaults.model}`;
  const slashIndex = modelRef.indexOf("/");

  return {
    modelRef,
    provider:
      slashIndex === -1 ? params.agentRuntime.defaults.provider : modelRef.slice(0, slashIndex),
    model: slashIndex === -1 ? modelRef : modelRef.slice(slashIndex + 1),
  };
}
