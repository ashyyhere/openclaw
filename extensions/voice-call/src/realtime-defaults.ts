// Default realtime voice-call instructions keep phone replies short and route deeper work to the agent.
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "openclaw/plugin-sdk/realtime-voice";

/** Baseline system prompt for the phone-call realtime voice interface. */
export const DEFAULT_VOICE_CALL_REALTIME_INSTRUCTIONS = `You are OpenClaw's phone-call realtime voice interface. Keep spoken replies brief and natural. When a question needs deeper reasoning, current information, or tools, call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} before answering.`;
