// Merges link-understanding outputs into the message body sent to the agent.
import { normalizeStringEntries } from "../shared/string-normalization.js";

/** Appends normalized link-understanding outputs after the original body text. */
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
