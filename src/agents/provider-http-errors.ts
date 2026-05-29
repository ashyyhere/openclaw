/** Helpers for redacted provider HTTP errors and response parsing. */
export { asFiniteNumber } from "../shared/number-coercion.js";
import { redactSensitiveText } from "../logging/redact.js";
import { readResponseWithLimit } from "../media/read-response-with-limit.js";
import { normalizeOptionalString as trimToUndefined } from "../shared/string-coerce.js";
/** Re-exported API for src/agents, starting with as Boolean. */
export { asBoolean } from "../utils/boolean.js";
/** Re-exported API for src/agents, starting with normalize Optional String. */
export { normalizeOptionalString as trimToUndefined } from "../shared/string-coerce.js";

const ERROR_BODY_METADATA_LIMIT = 500;
const PROVIDER_BINARY_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;

/** Narrow an unknown JSON value to a non-array object. */
export function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** Truncate error details for compact diagnostic messages. */
export function truncateErrorDetail(detail: string, limit = 220): string {
  return detail.length <= limit ? detail : `${detail.slice(0, limit - 1)}…`;
}

/** Redact and truncate provider error bodies before surfacing them. */
export function redactProviderErrorBody(body: string): string {
  return truncateErrorDetail(redactSensitiveText(body), ERROR_BODY_METADATA_LIMIT);
}

/** Read a bounded text prefix from a response body. */
export async function readResponseTextLimited(
  response: Response,
  limitBytes = 16 * 1024,
): Promise<string> {
  if (limitBytes <= 0) {
    return "";
  }
  const reader = response.body?.getReader();
  if (!reader) {
    return "";
  }

  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  let reachedLimit = false;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (!value || value.byteLength === 0) {
        continue;
      }
      const remaining = limitBytes - total;
      if (remaining <= 0) {
        reachedLimit = true;
        break;
      }
      const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
      total += chunk.byteLength;
      text += decoder.decode(chunk, { stream: true });
      if (total >= limitBytes) {
        reachedLimit = true;
        break;
      }
    }
    text += decoder.decode();
  } finally {
    if (reachedLimit) {
      await reader.cancel().catch(() => {});
    }
  }

  return text;
}

/** Reused helper for format Provider Error Payload behavior in src/agents. */
export function formatProviderErrorPayload(payload: unknown): string | undefined {
  const root = asObject(payload);
  const detailObject = asObject(root?.detail);
  const subject = asObject(root?.error) ?? detailObject ?? root;
  if (!subject) {
    return undefined;
  }
  const errorDescription =
    trimToUndefined(subject.error_description) ?? trimToUndefined(root?.error_description);
  const oauthCode = errorDescription ? trimToUndefined(root?.error) : undefined;
  const message =
    trimToUndefined(subject.message) ??
    trimToUndefined(subject.detail) ??
    errorDescription ??
    trimToUndefined(root?.message) ??
    trimToUndefined(root?.error) ??
    trimToUndefined(root?.detail);
  const type = trimToUndefined(subject.type);
  const code = trimToUndefined(subject.code) ?? trimToUndefined(subject.status) ?? oauthCode;
  const metadata = [type ? `type=${type}` : undefined, code ? `code=${code}` : undefined]
    .filter((value): value is string => Boolean(value))
    .join(", ");
  if (message && metadata) {
    return `${truncateErrorDetail(message)} [${metadata}]`;
  }
  if (message) {
    return truncateErrorDetail(message);
  }
  if (metadata) {
    return `[${metadata}]`;
  }
  return undefined;
}

type ProviderErrorPayloadMetadata = {
  detail?: string;
  code?: string;
  type?: string;
};

function extractProviderErrorPayloadMetadata(payload: unknown): ProviderErrorPayloadMetadata {
  const root = asObject(payload);
  const detailObject = asObject(root?.detail);
  const subject = asObject(root?.error) ?? detailObject ?? root;
  if (!subject) {
    return {};
  }

  const detail = formatProviderErrorPayload(payload);
  const type = trimToUndefined(subject.type);
  const errorDescription =
    trimToUndefined(subject.error_description) ?? trimToUndefined(root?.error_description);
  const oauthCode = errorDescription ? trimToUndefined(root?.error) : undefined;
  const code = trimToUndefined(subject.code) ?? trimToUndefined(subject.status) ?? oauthCode;
  return {
    ...(detail ? { detail: redactSensitiveText(detail) } : {}),
    ...(code ? { code } : {}),
    ...(type ? { type } : {}),
  };
}

/** Redacted structured metadata extracted from a provider error response. */
export type ProviderHttpErrorInfo = {
  detail?: string;
  code?: string;
  type?: string;
  body?: string;
  requestId?: string;
};

/** Extract redacted error metadata and request id from a provider response. */
export async function extractProviderErrorInfo(response: Response): Promise<ProviderHttpErrorInfo> {
  const rawBody = trimToUndefined(await readResponseTextLimited(response).catch(() => ""));
  const requestId = extractProviderRequestId(response);
  if (!rawBody) {
    return requestId ? { requestId } : {};
  }
  const body = redactProviderErrorBody(rawBody);
  try {
    const metadata = extractProviderErrorPayloadMetadata(JSON.parse(rawBody));
    return {
      ...(metadata.detail ? { detail: metadata.detail } : { detail: body }),
      ...(metadata.code ? { code: metadata.code } : {}),
      ...(metadata.type ? { type: metadata.type } : {}),
      body,
      ...(requestId ? { requestId } : {}),
    };
  } catch {
    return {
      detail: body,
      body,
      ...(requestId ? { requestId } : {}),
    };
  }
}

/** Extract the displayable provider error detail. */
export async function extractProviderErrorDetail(response: Response): Promise<string | undefined> {
  return (await extractProviderErrorInfo(response)).detail;
}

/** Extract common provider request id headers. */
export function extractProviderRequestId(response: Response): string | undefined {
  return (
    trimToUndefined(response.headers.get("x-request-id")) ??
    trimToUndefined(response.headers.get("request-id"))
  );
}

/** Error type preserving provider status, code, type, body, and request id. */
export class ProviderHttpError extends Error {
  readonly status: number;
  readonly statusCode: number;
  readonly code?: string;
  readonly errorCode?: string;
  readonly errorType?: string;
  readonly errorBody?: string;
  readonly requestId?: string;

  constructor(
    message: string,
    params: {
      status: number;
      code?: string;
      type?: string;
      body?: string;
      requestId?: string;
    },
  ) {
    super(message);
    this.name = "ProviderHttpError";
    this.status = params.status;
    this.statusCode = params.status;
    this.code = params.code;
    this.errorCode = params.code;
    this.errorType = params.type;
    this.errorBody = params.body;
    this.requestId = params.requestId;
  }
}

/** Format a provider HTTP error message with optional request id. */
export function formatProviderHttpErrorMessage(params: {
  label: string;
  status: number;
  detail?: string;
  requestId?: string;
  statusPrefix?: string;
}): string {
  const { label, status, detail, requestId, statusPrefix = "" } = params;
  return (
    `${label} (${statusPrefix}${status})` +
    (detail ? `: ${detail}` : "") +
    (requestId ? ` [request_id=${requestId}]` : "")
  );
}

/** Build a ProviderHttpError from a non-OK response. */
export async function createProviderHttpError(
  response: Response,
  label: string,
  options?: { statusPrefix?: string },
): Promise<Error> {
  const info = await extractProviderErrorInfo(response);
  return new ProviderHttpError(
    formatProviderHttpErrorMessage({
      label,
      status: response.status,
      detail: info.detail,
      requestId: info.requestId,
      statusPrefix: options?.statusPrefix,
    }),
    {
      status: response.status,
      code: info.code,
      type: info.type,
      body: info.body,
      requestId: info.requestId,
    },
  );
}

/** Throw ProviderHttpError when response.ok is false. */
export async function assertOkOrThrowProviderError(
  response: Response,
  label: string,
): Promise<void> {
  if (response.ok) {
    return;
  }
  throw await createProviderHttpError(response, label);
}

/** Throw ProviderHttpError with an HTTP status prefix when response.ok is false. */
export async function assertOkOrThrowHttpError(response: Response, label: string): Promise<void> {
  if (response.ok) {
    return;
  }
  throw await createProviderHttpError(response, label, { statusPrefix: "HTTP " });
}

/** Parse provider JSON response with a labeled malformed-JSON error. */
export async function readProviderJsonResponse<T>(response: Response, label: string): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new Error(`${label}: malformed JSON response`, { cause });
  }
}

/** Parse provider JSON response and require a top-level object. */
export async function readProviderJsonObjectResponse(
  response: Response,
  label: string,
): Promise<Record<string, unknown>> {
  const payload = await readProviderJsonResponse<unknown>(response, label);
  const object = asObject(payload);
  if (!object) {
    throw new Error(`${label}: malformed JSON response`);
  }
  return object;
}

/** Parse provider JSON response and require an array field. */
export async function readProviderJsonArrayFieldResponse(
  response: Response,
  label: string,
  field: string,
): Promise<unknown[]> {
  const payload = await readProviderJsonObjectResponse(response, label);
  const value = payload[field];
  if (!Array.isArray(value)) {
    throw new Error(`${label}: malformed JSON response`);
  }
  return value;
}

function normalizeContentType(response: Response): string | undefined {
  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  return contentType || undefined;
}

/** Reject JSON/text content types for expected binary provider responses. */
export function assertProviderBinaryResponseContent(
  response: Response,
  label: string,
  kind = "binary",
): void {
  const contentType = normalizeContentType(response);
  if (!contentType) {
    return;
  }
  if (
    contentType === "application/json" ||
    contentType.endsWith("+json") ||
    contentType.startsWith("text/")
  ) {
    throw new Error(`${label}: malformed ${kind} response`);
  }
}

/** Read a bounded binary provider response and reject empty/malformed bodies. */
export async function readProviderBinaryResponse(
  response: Response,
  label: string,
  kind = "binary",
  opts?: {
    maxBytes?: number;
  },
): Promise<Uint8Array> {
  assertProviderBinaryResponseContent(response, label, kind);
  const maxBytes = opts?.maxBytes ?? PROVIDER_BINARY_RESPONSE_MAX_BYTES;
  const bytes = await readResponseWithLimit(response, maxBytes, {
    onOverflow: ({ maxBytes }) => new Error(`${label}: ${kind} response exceeds ${maxBytes} bytes`),
  });
  if (bytes.byteLength === 0) {
    throw new Error(`${label}: malformed ${kind} response`);
  }
  return bytes;
}
