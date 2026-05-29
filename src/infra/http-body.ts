// infra http body helpers and runtime behavior.
import type { IncomingMessage, ServerResponse } from "node:http";
import { clearTimeout as clearNodeTimeout, setTimeout as setNodeTimeout } from "node:timers";
import { resolveTimerTimeoutMs } from "../shared/number-coercion.js";
import { formatErrorMessage } from "./errors.js";
import { parseStrictNonNegativeInteger } from "./parse-finite-number.js";

/** Reused constant for DEFAULT WEBHOOK MAX BODY BYTES behavior in src/infra. */
export const DEFAULT_WEBHOOK_MAX_BODY_BYTES = 1024 * 1024;
/** Reused constant for DEFAULT WEBHOOK BODY TIMEOUT MS behavior in src/infra. */
export const DEFAULT_WEBHOOK_BODY_TIMEOUT_MS = 30_000;

/** Shared type for Request Body Limit Error Code in src/infra. */
export type RequestBodyLimitErrorCode =
  | "PAYLOAD_TOO_LARGE"
  | "REQUEST_BODY_TIMEOUT"
  | "CONNECTION_CLOSED";

type RequestBodyLimitErrorInit = {
  code: RequestBodyLimitErrorCode;
  message?: string;
};

const DEFAULT_ERROR_MESSAGE: Record<RequestBodyLimitErrorCode, string> = {
  PAYLOAD_TOO_LARGE: "PayloadTooLarge",
  REQUEST_BODY_TIMEOUT: "RequestBodyTimeout",
  CONNECTION_CLOSED: "RequestBodyConnectionClosed",
};

const DEFAULT_ERROR_STATUS_CODE: Record<RequestBodyLimitErrorCode, number> = {
  PAYLOAD_TOO_LARGE: 413,
  REQUEST_BODY_TIMEOUT: 408,
  CONNECTION_CLOSED: 400,
};

const DEFAULT_RESPONSE_MESSAGE: Record<RequestBodyLimitErrorCode, string> = {
  PAYLOAD_TOO_LARGE: "Payload too large",
  REQUEST_BODY_TIMEOUT: "Request body timeout",
  CONNECTION_CLOSED: "Connection closed",
};

/** Reused class for Request Body Limit Error behavior in src/infra. */
export class RequestBodyLimitError extends Error {
  readonly code: RequestBodyLimitErrorCode;
  readonly statusCode: number;

  constructor(init: RequestBodyLimitErrorInit) {
    super(init.message ?? DEFAULT_ERROR_MESSAGE[init.code]);
    this.name = "RequestBodyLimitError";
    this.code = init.code;
    this.statusCode = DEFAULT_ERROR_STATUS_CODE[init.code];
  }
}

/** Reused helper for is Request Body Limit Error behavior in src/infra. */
export function isRequestBodyLimitError(
  error: unknown,
  code?: RequestBodyLimitErrorCode,
): error is RequestBodyLimitError {
  if (!(error instanceof RequestBodyLimitError)) {
    return false;
  }
  if (!code) {
    return true;
  }
  return error.code === code;
}

/** Reused helper for request Body Error To Text behavior in src/infra. */
export function requestBodyErrorToText(code: RequestBodyLimitErrorCode): string {
  return DEFAULT_RESPONSE_MESSAGE[code];
}

function parseContentLengthHeader(req: IncomingMessage): number | null {
  const header = req.headers["content-length"];
  const raw = Array.isArray(header) ? header[0] : header;
  if (typeof raw !== "string") {
    return null;
  }
  const parsed = parseStrictNonNegativeInteger(raw);
  if (parsed === undefined) {
    return null;
  }
  return parsed;
}

/** Shared type for Read Request Body Options in src/infra. */
export type ReadRequestBodyOptions = {
  maxBytes: number;
  timeoutMs?: number;
  encoding?: BufferEncoding;
};

type RequestBodyLimitValues = {
  maxBytes: number;
  timeoutMs: number;
};

type RequestBodyChunkProgress = {
  buffer: Buffer;
  totalBytes: number;
  exceeded: boolean;
};

function resolveRequestBodyLimitValues(options: {
  maxBytes: number;
  timeoutMs?: number;
}): RequestBodyLimitValues {
  const maxBytes = Number.isFinite(options.maxBytes)
    ? Math.max(1, Math.floor(options.maxBytes))
    : 1;
  const timeoutMs =
    options.timeoutMs === undefined
      ? DEFAULT_WEBHOOK_BODY_TIMEOUT_MS
      : resolveTimerTimeoutMs(options.timeoutMs, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS);
  return { maxBytes, timeoutMs };
}

export const testApi = { resolveRequestBodyLimitValues };
export { testApi as __test__ };

function advanceRequestBodyChunk(
  chunk: Buffer | string,
  totalBytes: number,
  maxBytes: number,
): RequestBodyChunkProgress {
  const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
  const nextTotalBytes = totalBytes + buffer.length;
  return {
    buffer,
    totalBytes: nextTotalBytes,
    exceeded: nextTotalBytes > maxBytes,
  };
}

/** Reused helper for read Request Body With Limit behavior in src/infra. */
export async function readRequestBodyWithLimit(
  req: IncomingMessage,
  options: ReadRequestBodyOptions,
): Promise<string> {
  const { maxBytes, timeoutMs } = resolveRequestBodyLimitValues(options);
  const encoding = options.encoding ?? "utf-8";

  const declaredLength = parseContentLengthHeader(req);
  if (declaredLength !== null && declaredLength > maxBytes) {
    const error = new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" });
    if (!req.destroyed) {
      // Limit violations are expected user input; destroying with an Error causes
      // an async 'error' event which can crash the process if no listener remains.
      req.destroy();
    }
    throw error;
  }

  return await new Promise((resolve, reject) => {
    let done = false;
    let ended = false;
    let totalBytes = 0;
    const chunks: Buffer[] = [];

    const cleanup = () => {
      req.removeListener("data", onData);
      req.removeListener("end", onEnd);
      req.removeListener("error", onError);
      req.removeListener("close", onClose);
      clearNodeTimeout(timer);
    };

    const finish = (cb: () => void) => {
      if (done) {
        return;
      }
      done = true;
      cleanup();
      cb();
    };

    const fail = (error: RequestBodyLimitError | Error) => {
      finish(() => reject(error));
    };

    const timer = setNodeTimeout(() => {
      const error = new RequestBodyLimitError({ code: "REQUEST_BODY_TIMEOUT" });
      if (!req.destroyed) {
        req.destroy();
      }
      fail(error);
    }, timeoutMs);

    const onData = (chunk: Buffer | string) => {
      if (done) {
        return;
      }
      const progress = advanceRequestBodyChunk(chunk, totalBytes, maxBytes);
      totalBytes = progress.totalBytes;
      if (progress.exceeded) {
        const error = new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" });
        if (!req.destroyed) {
          req.destroy();
        }
        fail(error);
        return;
      }
      chunks.push(progress.buffer);
    };

    const onEnd = () => {
      ended = true;
      finish(() => resolve(Buffer.concat(chunks).toString(encoding)));
    };

    const onError = (error: Error) => {
      if (done) {
        return;
      }
      fail(error);
    };

    const onClose = () => {
      if (done || ended) {
        return;
      }
      fail(new RequestBodyLimitError({ code: "CONNECTION_CLOSED" }));
    };

    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.on("close", onClose);
  });
}

/** Shared type for Read Json Body Result in src/infra. */
export type ReadJsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string; code: RequestBodyLimitErrorCode | "INVALID_JSON" };

/** Shared type for Read Json Body Options in src/infra. */
export type ReadJsonBodyOptions = ReadRequestBodyOptions & {
  emptyObjectOnEmpty?: boolean;
};

/** Reused helper for read Json Body With Limit behavior in src/infra. */
export async function readJsonBodyWithLimit(
  req: IncomingMessage,
  options: ReadJsonBodyOptions,
): Promise<ReadJsonBodyResult> {
  try {
    const raw = await readRequestBodyWithLimit(req, options);
    const trimmed = raw.trim();
    if (!trimmed) {
      if (options.emptyObjectOnEmpty === false) {
        return { ok: false, code: "INVALID_JSON", error: "empty payload" };
      }
      return { ok: true, value: {} };
    }
    try {
      return { ok: true, value: JSON.parse(trimmed) as unknown };
    } catch (error) {
      return {
        ok: false,
        code: "INVALID_JSON",
        error: formatErrorMessage(error),
      };
    }
  } catch (error) {
    if (isRequestBodyLimitError(error)) {
      return { ok: false, code: error.code, error: requestBodyErrorToText(error.code) };
    }
    return {
      ok: false,
      code: "INVALID_JSON",
      error: formatErrorMessage(error),
    };
  }
}

/** Shared type for Request Body Limit Guard in src/infra. */
export type RequestBodyLimitGuard = {
  dispose: () => void;
  isTripped: () => boolean;
  code: () => RequestBodyLimitErrorCode | null;
};

/** Shared type for Request Body Limit Guard Options in src/infra. */
export type RequestBodyLimitGuardOptions = {
  maxBytes: number;
  timeoutMs?: number;
  responseFormat?: "json" | "text";
  responseText?: Partial<Record<RequestBodyLimitErrorCode, string>>;
};

/** Reused helper for install Request Body Limit Guard behavior in src/infra. */
export function installRequestBodyLimitGuard(
  req: IncomingMessage,
  res: ServerResponse,
  options: RequestBodyLimitGuardOptions,
): RequestBodyLimitGuard {
  const { maxBytes, timeoutMs } = resolveRequestBodyLimitValues(options);
  const responseFormat = options.responseFormat ?? "json";
  const customText = options.responseText ?? {};

  let tripped = false;
  let reason: RequestBodyLimitErrorCode | null = null;
  let done = false;
  let ended = false;
  let totalBytes = 0;

  const cleanup = () => {
    req.removeListener("data", onData);
    req.removeListener("end", onEnd);
    req.removeListener("close", onClose);
    req.removeListener("error", onError);
    clearNodeTimeout(timer);
  };

  const finish = () => {
    if (done) {
      return;
    }
    done = true;
    cleanup();
  };

  const respond = (error: RequestBodyLimitError) => {
    const text = customText[error.code] ?? requestBodyErrorToText(error.code);
    if (!res.headersSent) {
      res.statusCode = error.statusCode;
      if (responseFormat === "text") {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(text);
      } else {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: text }));
      }
    }
  };

  const trip = (error: RequestBodyLimitError) => {
    if (tripped) {
      return;
    }
    tripped = true;
    reason = error.code;
    finish();
    respond(error);
    if (!req.destroyed) {
      // Limit violations are expected user input; destroying with an Error causes
      // an async 'error' event which can crash the process if no listener remains.
      req.destroy();
    }
  };

  const onData = (chunk: Buffer | string) => {
    if (done) {
      return;
    }
    const progress = advanceRequestBodyChunk(chunk, totalBytes, maxBytes);
    totalBytes = progress.totalBytes;
    if (progress.exceeded) {
      trip(new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" }));
    }
  };

  const onEnd = () => {
    ended = true;
    finish();
  };

  const onClose = () => {
    if (done || ended) {
      return;
    }
    finish();
  };

  const onError = () => {
    finish();
  };

  const timer = setNodeTimeout(() => {
    trip(new RequestBodyLimitError({ code: "REQUEST_BODY_TIMEOUT" }));
  }, timeoutMs);

  req.on("data", onData);
  req.on("end", onEnd);
  req.on("close", onClose);
  req.on("error", onError);

  const declaredLength = parseContentLengthHeader(req);
  if (declaredLength !== null && declaredLength > maxBytes) {
    trip(new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" }));
  }

  return {
    dispose: finish,
    isTripped: () => tripped,
    code: () => reason,
  };
}
