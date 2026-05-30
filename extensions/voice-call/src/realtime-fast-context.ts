// Voice-call realtime fast-context helper labels generic SDK consult results for callers.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  resolveRealtimeVoiceFastContextConsult,
  type RealtimeVoiceFastContextConsultResult,
  type RealtimeVoiceFastContextConfig,
} from "openclaw/plugin-sdk/realtime-voice";

type Logger = {
  debug?: (message: string) => void;
};

/** Resolve fast-context consult data with voice-call specific labels. */
export async function resolveRealtimeFastContextConsult(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  config: RealtimeVoiceFastContextConfig;
  args: unknown;
  logger: Logger;
}): Promise<RealtimeVoiceFastContextConsultResult> {
  return await resolveRealtimeVoiceFastContextConsult({
    ...params,
    labels: {
      audienceLabel: "caller",
      contextName: "OpenClaw memory or session context",
    },
  });
}
