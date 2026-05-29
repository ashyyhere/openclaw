// Realtime voice consult tool schema, policy, and prompt builders.
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "../shared/string-coerce.js";
import type { RealtimeVoiceTool } from "./provider-types.js";

/** Stable function name exposed to realtime voice providers for agent delegation. */
export const REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME = "openclaw_agent_consult";
/** Supported tool-exposure policies for voice agent consultation. */
export const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES = [
  "safe-read-only",
  "owner",
  "none",
] as const;
/** Policy controlling whether the voice model can consult the configured agent. */
export type RealtimeVoiceAgentConsultToolPolicy =
  (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
/** Provider tool arguments accepted by openclaw_agent_consult. */
export type RealtimeVoiceAgentConsultArgs = {
  question: string;
  context?: string;
  responseStyle?: string;
};
/** Transcript line passed into agent consult prompts for voice context. */
export type RealtimeVoiceAgentConsultTranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};

/** Realtime provider tool definition for delegating substantive work to OpenClaw. */
export const REALTIME_VOICE_AGENT_CONSULT_TOOL: RealtimeVoiceTool = {
  type: "function",
  name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
  description:
    "Delegate the caller's request to the configured OpenClaw agent for normal tool-backed work, actions, context, memory, or reasoning before speaking.",
  parameters: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "The concrete question or task the user asked.",
      },
      context: {
        type: "string",
        description: "Optional relevant context or transcript summary.",
      },
      responseStyle: {
        type: "string",
        description: "Optional style hint for the spoken answer.",
      },
    },
    required: ["question"],
  },
};

/** Builds the interim provider response while the delegated agent result is pending. */
export function buildRealtimeVoiceAgentConsultWorkingResponse(
  audienceLabel = "person",
): Record<string, unknown> {
  return {
    status: "working",
    tool: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
    message: `Tell the ${audienceLabel} briefly that you are checking, then wait for the final OpenClaw result before answering with the actual result.`,
  };
}

const SAFE_READ_ONLY_TOOLS = [
  "read",
  "web_search",
  "web_fetch",
  "x_search",
  "memory_search",
  "memory_get",
] as const;

/** Type guard for persisted/configured consult tool policy values. */
export function isRealtimeVoiceAgentConsultToolPolicy(
  value: unknown,
): value is RealtimeVoiceAgentConsultToolPolicy {
  return (
    typeof value === "string" &&
    REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES.includes(
      value as RealtimeVoiceAgentConsultToolPolicy,
    )
  );
}

/** Normalizes a configured consult policy with a caller-provided fallback. */
export function resolveRealtimeVoiceAgentConsultToolPolicy(
  value: unknown,
  fallback: RealtimeVoiceAgentConsultToolPolicy,
): RealtimeVoiceAgentConsultToolPolicy {
  const normalized = normalizeOptionalLowercaseString(value);
  return isRealtimeVoiceAgentConsultToolPolicy(normalized) ? normalized : fallback;
}

/** Builds the realtime tool list, preserving custom tools after the consult tool. */
export function resolveRealtimeVoiceAgentConsultTools(
  policy: RealtimeVoiceAgentConsultToolPolicy,
  customTools: RealtimeVoiceTool[] = [],
): RealtimeVoiceTool[] {
  const tools = new Map<string, RealtimeVoiceTool>();
  if (policy !== "none") {
    tools.set(REALTIME_VOICE_AGENT_CONSULT_TOOL.name, REALTIME_VOICE_AGENT_CONSULT_TOOL);
  }
  for (const tool of customTools) {
    if (!tools.has(tool.name)) {
      tools.set(tool.name, tool);
    }
  }
  return [...tools.values()];
}

/** Maps consult policy to the provider tool allow-list contract. */
export function resolveRealtimeVoiceAgentConsultToolsAllow(
  policy: RealtimeVoiceAgentConsultToolPolicy,
): string[] | undefined {
  if (policy === "owner") {
    return undefined;
  }
  if (policy === "safe-read-only") {
    return [...SAFE_READ_ONLY_TOOLS];
  }
  return [];
}

/** Generates voice-model instructions that decide when consultation is required. */
export function buildRealtimeVoiceAgentConsultPolicyInstructions(config: {
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  consultPolicy?: "auto" | "substantive" | "always";
}): string | undefined {
  if (config.toolPolicy === "none" || !config.consultPolicy || config.consultPolicy === "auto") {
    return undefined;
  }
  if (config.consultPolicy === "always") {
    return [
      "Consult behavior:",
      "- Call openclaw_agent_consult before every substantive answer.",
      "- You may answer directly only for greetings, acknowledgements, brief latency tests, or filler while waiting for the consult result.",
      "- After the consult result arrives, speak that result concisely.",
    ].join("\n");
  }
  return [
    "Consult behavior:",
    "- Answer directly for greetings, acknowledgements, simple conversational glue, and brief latency tests.",
    "- Call openclaw_agent_consult before answering requests that need facts, memory, current information, tools, workspace state, or the user's OpenClaw-specific context.",
    "- Keep spoken replies concise and natural.",
  ].join("\n");
}

/** Parses consult tool args, accepting legacy question aliases from providers. */
export function parseRealtimeVoiceAgentConsultArgs(args: unknown): RealtimeVoiceAgentConsultArgs {
  const question =
    readConsultStringArg(args, "question") ??
    readConsultStringArg(args, "prompt") ??
    readConsultStringArg(args, "query") ??
    readConsultStringArg(args, "task");
  if (!question) {
    throw new Error("question required");
  }
  return {
    question,
    context: readConsultStringArg(args, "context"),
    responseStyle: readConsultStringArg(args, "responseStyle"),
  };
}

/** Converts consult args into the chat message sent to the delegated agent. */
export function buildRealtimeVoiceAgentConsultChatMessage(args: unknown): string {
  const parsed = parseRealtimeVoiceAgentConsultArgs(args);
  return [
    parsed.question,
    parsed.context ? `Context:\n${parsed.context}` : undefined,
    parsed.responseStyle ? `Spoken style:\n${parsed.responseStyle}` : undefined,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Builds the full delegated-agent prompt from voice context and recent transcript. */
export function buildRealtimeVoiceAgentConsultPrompt(params: {
  args: unknown;
  transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
  surface: string;
  userLabel: string;
  assistantLabel?: string;
  questionSourceLabel?: string;
}): string {
  const parsed = parseRealtimeVoiceAgentConsultArgs(params.args);
  const assistantLabel = params.assistantLabel ?? "Agent";
  const questionSourceLabel = params.questionSourceLabel ?? params.userLabel.toLowerCase();
  const transcript = params.transcript
    .slice(-12)
    .map(
      (entry) => `${entry.role === "assistant" ? assistantLabel : params.userLabel}: ${entry.text}`,
    )
    .join("\n");

  return [
    `Live voice request from the ${questionSourceLabel} during ${params.surface}.`,
    "Act as the configured OpenClaw agent on behalf of this user. Use available tools when the request asks you to do work.",
    "When finished, return only the concise result the realtime voice agent should speak back.",
    "Do not include markdown, tool logs, or private reasoning. Include citations only when the spoken answer needs them.",
    parsed.responseStyle ? `Spoken style: ${parsed.responseStyle}` : undefined,
    transcript ? `Recent voice transcript for context:\n${transcript}` : undefined,
    parsed.context ? `Additional realtime context:\n${parsed.context}` : undefined,
    `User request:\n${parsed.question}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Collects user-visible delegated-agent text while dropping errors and reasoning chunks. */
export function collectRealtimeVoiceAgentConsultVisibleText(
  payloads: Array<{ text?: unknown; isError?: boolean; isReasoning?: boolean }>,
): string | null {
  const chunks: string[] = [];
  for (const payload of payloads) {
    if (payload.isError || payload.isReasoning) {
      continue;
    }
    const text = normalizeOptionalString(payload.text);
    if (text) {
      chunks.push(text);
    }
  }
  return chunks.length > 0 ? chunks.join("\n\n").trim() : null;
}

function readConsultStringArg(args: unknown, key: string): string | undefined {
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return undefined;
  }
  return normalizeOptionalString((args as Record<string, unknown>)[key]);
}
