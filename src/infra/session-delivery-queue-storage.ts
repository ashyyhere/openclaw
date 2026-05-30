// Durable queue storage for session-bound delivery events.
// Agent turns and system events use idempotent JSON entries until acked or failed.
import { createHash } from "node:crypto";
import path from "node:path";
import {
  ackJsonDurableQueueEntry,
  ensureJsonDurableQueueDirs,
  jsonDurableQueueEntryExists,
  loadJsonDurableQueueEntry,
  loadPendingJsonDurableQueueEntries,
  moveJsonDurableQueueEntryToFailed,
  readJsonDurableQueueEntry,
  resolveJsonDurableQueueEntryPaths,
  writeJsonDurableQueueEntry,
} from "@openclaw/fs-safe/store";
import type { ChatType } from "../channels/chat-type.js";
import { resolveStateDir } from "../config/paths.js";
import { generateSecureUuid } from "./secure-random.js";

const QUEUE_DIRNAME = "session-delivery-queue";
const FAILED_DIRNAME = "failed";
const TMP_SWEEP_MAX_AGE_MS = 5_000;
const QUEUE_TEMP_PREFIX = ".session-delivery-queue";

type SessionDeliveryContext = {
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
};

type SessionDeliveryRetryPolicy = {
  maxRetries?: number;
};

/** Resolved outbound route for a queued session delivery. */
export type SessionDeliveryRoute = {
  channel: string;
  to: string;
  accountId?: string;
  replyToId?: string;
  threadId?: string;
  chatType: ChatType;
};

/** Payload accepted by the session delivery queue before durable metadata is added. */
export type QueuedSessionDeliveryPayload =
  | ({
      kind: "systemEvent";
      sessionKey: string;
      text: string;
      deliveryContext?: SessionDeliveryContext;
      idempotencyKey?: string;
    } & SessionDeliveryRetryPolicy)
  | ({
      kind: "agentTurn";
      sessionKey: string;
      message: string;
      messageId: string;
      expectedSessionId?: string;
      route?: SessionDeliveryRoute;
      deliveryContext?: SessionDeliveryContext;
      idempotencyKey?: string;
    } & SessionDeliveryRetryPolicy);

/** Durable session delivery entry stored in the pending queue. */
export type QueuedSessionDelivery = QueuedSessionDeliveryPayload & {
  id: string;
  enqueuedAt: number;
  retryCount: number;
  lastAttemptAt?: number;
  lastError?: string;
};

function buildEntryId(idempotencyKey?: string): string {
  if (!idempotencyKey) {
    return generateSecureUuid();
  }
  return createHash("sha256").update(idempotencyKey).digest("hex");
}

async function writeQueueEntry(filePath: string, entry: QueuedSessionDelivery): Promise<void> {
  await writeJsonDurableQueueEntry({
    filePath,
    entry,
    tempPrefix: QUEUE_TEMP_PREFIX,
  });
}

async function readQueueEntry(filePath: string): Promise<QueuedSessionDelivery> {
  return await readJsonDurableQueueEntry<QueuedSessionDelivery>(filePath);
}

/** Resolve the state-directory path that stores pending session deliveries. */
export function resolveSessionDeliveryQueueDir(stateDir?: string): string {
  const base = stateDir ?? resolveStateDir();
  return path.join(base, QUEUE_DIRNAME);
}

function resolveFailedDir(stateDir?: string): string {
  return path.join(resolveSessionDeliveryQueueDir(stateDir), FAILED_DIRNAME);
}

function resolveQueueEntryPaths(
  id: string,
  stateDir?: string,
): {
  jsonPath: string;
  deliveredPath: string;
} {
  return resolveJsonDurableQueueEntryPaths(resolveSessionDeliveryQueueDir(stateDir), id);
}

async function ensureSessionDeliveryQueueDir(stateDir?: string): Promise<string> {
  const queueDir = resolveSessionDeliveryQueueDir(stateDir);
  await ensureJsonDurableQueueDirs({
    queueDir,
    failedDir: resolveFailedDir(stateDir),
  });
  return queueDir;
}

/** Enqueue a session delivery, deduplicating when an idempotency key is provided. */
export async function enqueueSessionDelivery(
  params: QueuedSessionDeliveryPayload,
  stateDir?: string,
): Promise<string> {
  const queueDir = await ensureSessionDeliveryQueueDir(stateDir);
  const id = buildEntryId(params.idempotencyKey);
  const filePath = path.join(queueDir, `${id}.json`);

  if (params.idempotencyKey) {
    if (await jsonDurableQueueEntryExists(filePath)) {
      return id;
    }
  }

  await writeQueueEntry(filePath, {
    ...params,
    id,
    enqueuedAt: Date.now(),
    retryCount: 0,
  });
  return id;
}

/** Ack a session delivery by moving its pending entry to the delivered marker. */
export async function ackSessionDelivery(id: string, stateDir?: string): Promise<void> {
  await ackJsonDurableQueueEntry(resolveQueueEntryPaths(id, stateDir));
}

/** Record a failed session delivery attempt and increment its retry metadata. */
export async function failSessionDelivery(
  id: string,
  error: string,
  stateDir?: string,
): Promise<void> {
  const filePath = path.join(resolveSessionDeliveryQueueDir(stateDir), `${id}.json`);
  const entry = await readQueueEntry(filePath);
  entry.retryCount += 1;
  entry.lastAttemptAt = Date.now();
  entry.lastError = error;
  await writeQueueEntry(filePath, entry);
}

/** Load one pending session delivery unless it has already been acked. */
export async function loadPendingSessionDelivery(
  id: string,
  stateDir?: string,
): Promise<QueuedSessionDelivery | null> {
  return await loadJsonDurableQueueEntry({
    paths: resolveQueueEntryPaths(id, stateDir),
    tempPrefix: QUEUE_TEMP_PREFIX,
  });
}

/** Load all pending session deliveries after sweeping stale temp files. */
export async function loadPendingSessionDeliveries(
  stateDir?: string,
): Promise<QueuedSessionDelivery[]> {
  return await loadPendingJsonDurableQueueEntries({
    queueDir: resolveSessionDeliveryQueueDir(stateDir),
    tempPrefix: QUEUE_TEMP_PREFIX,
    cleanupTmpMaxAgeMs: TMP_SWEEP_MAX_AGE_MS,
  });
}

/** Move a pending session delivery into failed/ after retries are exhausted. */
export async function moveSessionDeliveryToFailed(id: string, stateDir?: string): Promise<void> {
  await moveJsonDurableQueueEntryToFailed({
    queueDir: resolveSessionDeliveryQueueDir(stateDir),
    failedDir: resolveFailedDir(stateDir),
    id,
  });
}
