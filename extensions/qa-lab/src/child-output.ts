// QA Lab child-output helpers bound stdout captures and stderr tails from subprocesses.
/** Maximum captured stdout bytes for QA child processes. */
export const QA_CHILD_STDOUT_MAX_BYTES = 1024 * 1024;
/** Maximum retained stderr tail bytes for QA child processes. */
export const QA_CHILD_STDERR_TAIL_BYTES = 64 * 1024;

/** Bounded full-output capture for child stdout. */
export type QaChildOutputCapture = {
  chunks: Buffer[];
  bytes: number;
  exceeded: boolean;
  maxBytes: number;
};

/** Bounded rolling tail capture for child stderr. */
export type QaChildOutputTail = {
  buffer: Buffer;
  maxBytes: number;
  truncated: boolean;
};

function toBuffer(chunk: unknown): Buffer {
  return Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
}

/** Creates an empty bounded child-output capture. */
export function createQaChildOutputCapture(maxBytes = QA_CHILD_STDOUT_MAX_BYTES) {
  return {
    chunks: [],
    bytes: 0,
    exceeded: false,
    maxBytes,
  } satisfies QaChildOutputCapture;
}

/** Appends a chunk to a bounded child-output capture. */
export function appendQaChildOutput(capture: QaChildOutputCapture, chunk: unknown) {
  if (capture.exceeded) {
    return;
  }
  const buffer = toBuffer(chunk);
  const remainingBytes = capture.maxBytes - capture.bytes;
  if (buffer.byteLength > remainingBytes) {
    if (remainingBytes > 0) {
      capture.chunks.push(Buffer.from(buffer.subarray(0, remainingBytes)));
    }
    capture.bytes = capture.maxBytes;
    capture.exceeded = true;
    return;
  }
  capture.chunks.push(Buffer.from(buffer));
  capture.bytes += buffer.byteLength;
}

/** Reads a bounded child-output capture as UTF-8 text. */
export function readQaChildOutput(capture: QaChildOutputCapture) {
  return Buffer.concat(capture.chunks, capture.bytes).toString("utf8");
}

/** Creates an empty rolling child-output tail. */
export function createQaChildOutputTail(maxBytes = QA_CHILD_STDERR_TAIL_BYTES) {
  return {
    buffer: Buffer.alloc(0),
    maxBytes,
    truncated: false,
  } satisfies QaChildOutputTail;
}

/** Appends a chunk while keeping only the latest tail bytes. */
export function appendQaChildOutputTail(tail: QaChildOutputTail, chunk: unknown) {
  const buffer = toBuffer(chunk);
  if (buffer.byteLength >= tail.maxBytes) {
    tail.buffer = Buffer.from(buffer.subarray(buffer.byteLength - tail.maxBytes));
    tail.truncated = true;
    return;
  }
  const next = Buffer.concat([tail.buffer, buffer], tail.buffer.byteLength + buffer.byteLength);
  if (next.byteLength <= tail.maxBytes) {
    tail.buffer = next;
    return;
  }
  tail.buffer = Buffer.from(next.subarray(next.byteLength - tail.maxBytes));
  tail.truncated = true;
}

/** Formats a child-output tail with a truncation marker when needed. */
export function formatQaChildOutputTail(tail: QaChildOutputTail, label: string) {
  const text = tail.buffer.toString("utf8").trim();
  if (!text) {
    return "";
  }
  return tail.truncated ? `[${label} truncated to last ${tail.maxBytes} bytes]\n${text}` : text;
}
