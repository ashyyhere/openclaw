/** Test fixtures and casts for agent runtime messages. */
import type { AssistantMessage, UserMessage } from "openclaw/plugin-sdk/llm";
import type { AgentMessage } from "../runtime/index.js";
import { ZERO_USAGE_FIXTURE } from "./usage-fixtures.js";

/** Casts unknown test data into an AgentMessage. */
export function castAgentMessage(message: unknown): AgentMessage {
  return message as AgentMessage;
}

export function castAgentMessages(messages: unknown[]): AgentMessage[] {
  return messages as AgentMessage[];
}

/** Builds a minimal user message fixture. */
export function makeAgentUserMessage(
  overrides: Partial<UserMessage> & Pick<UserMessage, "content">,
): UserMessage {
  return {
    role: "user",
    timestamp: 0,
    ...overrides,
  };
}

/** Builds a minimal assistant message fixture. */
export function makeAgentAssistantMessage(
  overrides: Partial<AssistantMessage> & Pick<AssistantMessage, "content">,
): AssistantMessage {
  return {
    role: "assistant",
    api: "openai-responses",
    provider: "openai",
    model: "test-model",
    usage: ZERO_USAGE_FIXTURE,
    stopReason: "stop",
    timestamp: 0,
    ...overrides,
  };
}
