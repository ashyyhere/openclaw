// JWT helpers for extracting ChatGPT account metadata from OpenAI Codex OAuth
// tokens. These decode claims only; they do not verify token signatures.
const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";

/** Minimal OpenAI Codex JWT payload shape used by account selection. */
export type OpenAICodexJwtPayload = {
  [OPENAI_CODEX_AUTH_CLAIM]?: {
    chatgpt_account_id?: unknown;
  };
  [key: string]: unknown;
};

/** Decode a JWT payload into the claim object, returning null for malformed tokens. */
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

/** Resolve the ChatGPT account id embedded in an OpenAI Codex OAuth token. */
export function resolveOpenAICodexAccountId(token: string): string | null {
  const accountId =
    decodeOpenAICodexJwtPayload(token)?.[OPENAI_CODEX_AUTH_CLAIM]?.chatgpt_account_id;
  return typeof accountId === "string" && accountId.length > 0 ? accountId : null;
}
