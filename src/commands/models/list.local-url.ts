// Detects local model provider base URLs for model-list tags.
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";

/** Reused constant for is Local Base Url behavior in src/commands/models. */
export const isLocalBaseUrl = (baseUrl: string) => {
  try {
    const url = new URL(baseUrl);
    const host = normalizeLowercaseStringOrEmpty(url.hostname).replace(/^\[|\]$/g, "");
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::" ||
      host === "::1" ||
      host.endsWith(".local")
    );
  } catch {
    return false;
  }
};
