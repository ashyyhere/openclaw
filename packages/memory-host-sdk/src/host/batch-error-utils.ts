// packages/memory-host-sdk/src/host batch error utils helpers and runtime behavior.
import { formatErrorMessage } from "./error-utils.js";

type BatchOutputErrorLike = {
  error?: { message?: string };
  response?: {
    body?:
      | string
      | {
          error?: { message?: string };
        };
  };
};

function getResponseErrorMessage(line: BatchOutputErrorLike | undefined): string | undefined {
  const body = line?.response?.body;
  if (typeof body === "string") {
    return body || undefined;
  }
  if (!body || typeof body !== "object") {
    return undefined;
  }
  return typeof body.error?.message === "string" ? body.error.message : undefined;
}

/** Public helper for extract Batch Error Message behavior in packages/memory-host-sdk. */
export function extractBatchErrorMessage(lines: BatchOutputErrorLike[]): string | undefined {
  const first = lines.find((line) => line.error?.message || getResponseErrorMessage(line));
  return first?.error?.message ?? getResponseErrorMessage(first);
}

/** Public helper for format Unavailable Batch Error behavior in packages/memory-host-sdk. */
export function formatUnavailableBatchError(err: unknown): string | undefined {
  const message = formatErrorMessage(err);
  return message ? `error file unavailable: ${message}` : undefined;
}
