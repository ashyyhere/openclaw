// link-understanding format helpers and runtime behavior.
import { normalizeStringEntries } from "../shared/string-normalization.js";

/** Reused helper for format Link Understanding Body behavior in src/link-understanding. */
export function formatLinkUnderstandingBody(params: { body?: string; outputs: string[] }): string {
  const outputs = normalizeStringEntries(params.outputs);
  if (outputs.length === 0) {
    return params.body ?? "";
  }

  const base = (params.body ?? "").trim();
  if (!base) {
    return outputs.join("\n");
  }
  return `${base}\n\n${outputs.join("\n")}`;
}
