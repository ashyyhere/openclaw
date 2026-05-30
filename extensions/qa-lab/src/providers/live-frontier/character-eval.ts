// QA Lab live-frontier character-eval config lists models and judge options.
import type { QaThinkingLevel } from "../../qa-thinking.js";

type QaFrontierCharacterModelOptions = {
  thinkingDefault?: QaThinkingLevel;
  fastMode?: boolean;
};

/** Frontier models included in the character evaluation matrix. */
export const QA_FRONTIER_CHARACTER_EVAL_MODELS = Object.freeze([
  "openai/gpt-5.5",
  "openai/gpt-5.2",
  "openai/gpt-5",
  "anthropic/claude-opus-4-8",
  "anthropic/claude-sonnet-4-6",
  "zai/glm-5.1",
  "moonshot/kimi-k2.5",
  "google/gemini-3.1-pro-preview",
]);

/** Per-model thinking defaults for character evaluation prompts. */
export const QA_FRONTIER_CHARACTER_THINKING_BY_MODEL: Readonly<Record<string, QaThinkingLevel>> =
  Object.freeze({
    "openai/gpt-5.5": "medium",
    "openai/gpt-5.2": "xhigh",
    "openai/gpt-5": "xhigh",
  });

/** Judge models used to score character evaluation outputs. */
export const QA_FRONTIER_CHARACTER_JUDGE_MODELS = Object.freeze([
  "openai/gpt-5.5",
  "anthropic/claude-opus-4-8",
]);

/** Runtime options applied to each character evaluation judge model. */
export const QA_FRONTIER_CHARACTER_JUDGE_MODEL_OPTIONS: Readonly<
  Record<string, QaFrontierCharacterModelOptions>
> = Object.freeze({
  "openai/gpt-5.5": { thinkingDefault: "xhigh", fastMode: true },
  "anthropic/claude-opus-4-8": { thinkingDefault: "high" },
});
