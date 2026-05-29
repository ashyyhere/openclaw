// llm/utils/oauth openai codex jwt helpers and runtime behavior.
const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";

/** Shared type for Open AICodex Jwt Payload in src/llm/utils. */
export type OpenAICodexJwtPayload = {
  [OPENAI_CODEX_AUTH_CLAIM]?: {
    chatgpt_account_id?: unknown;
  };
  [key: string]: unknown;
};

/** Reused helper for decode Open AICodex Jwt Payload behavior in src/llm/utils. */
export function decodeOpenAICodexJwtPayload(token: string): OpenAICodexJwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const decoded = Buffer.from(parts[1] ?? "", "base64url").toString("utf8");
    const parsed = JSON.parse(decoded);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as OpenAICodexJwtPayload)
      : null;
  } catch {
    return null;
  }
}

/** Reused helper for resolve Open AICodex Account Id behavior in src/llm/utils. */
export function resolveOpenAICodexAccountId(token: string): string | null {
  const accountId =
    decodeOpenAICodexJwtPayload(token)?.[OPENAI_CODEX_AUTH_CLAIM]?.chatgpt_account_id;
  return typeof accountId === "string" && accountId.length > 0 ? accountId : null;
}
