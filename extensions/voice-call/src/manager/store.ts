// Voice-call manager store persists call records as JSONL and rebuilds active-call indexes.
import path from "node:path";
import {
  appendRegularFile,
  privateFileStore,
  privateFileStoreSync,
} from "openclaw/plugin-sdk/security-runtime";
import { CallRecordSchema, TerminalStates, type CallId, type CallRecord } from "../types.js";

const pendingPersistWrites = new Set<Promise<void>>();

/** Append a call record to the voice-call JSONL store without blocking manager flow. */
export function persistCallRecord(storePath: string, call: CallRecord): void {
  const logPath = path.join(storePath, "calls.jsonl");
  const line = `${JSON.stringify(call)}\n`;
  // Fire-and-forget async write to avoid blocking event loop.
  const write = appendRegularFile({
    filePath: logPath,
    content: line,
    rejectSymlinkParents: true,
  })
    .catch((err) => {
      console.error("[voice-call] Failed to persist call record:", err);
    })
    .finally(() => {
      pendingPersistWrites.delete(write);
    });
  pendingPersistWrites.add(write);
}

/** Wait for fire-and-forget call record writes to settle in tests. */
export async function flushPendingCallRecordWritesForTest(): Promise<void> {
  await Promise.allSettled(pendingPersistWrites);
}

/** Load active calls and dedupe indexes from the persisted call store. */
export function loadActiveCallsFromStore(storePath: string): {
  activeCalls: Map<CallId, CallRecord>;
  providerCallIdMap: Map<string, CallId>;
  processedEventIds: Set<string>;
  rejectedProviderCallIds: Set<string>;
} {
  const logPath = path.join(storePath, "calls.jsonl");
  const content = privateFileStoreSync(storePath).readTextIfExists(path.basename(logPath));
  if (content === null) {
    return {
      activeCalls: new Map(),
      providerCallIdMap: new Map(),
      processedEventIds: new Set(),
      rejectedProviderCallIds: new Set(),
    };
  }
  const lines = content.split("\n");

  const callMap = new Map<CallId, CallRecord>();
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    try {
      const call = CallRecordSchema.parse(JSON.parse(line));
      callMap.set(call.callId, call);
    } catch {
      // Skip invalid lines.
    }
  }

  const activeCalls = new Map<CallId, CallRecord>();
  const providerCallIdMap = new Map<string, CallId>();
  const processedEventIds = new Set<string>();
  const rejectedProviderCallIds = new Set<string>();

  for (const [callId, call] of callMap) {
    for (const eventId of call.processedEventIds) {
      processedEventIds.add(eventId);
    }
    if (TerminalStates.has(call.state)) {
      continue;
    }
    activeCalls.set(callId, call);
    if (call.providerCallId) {
      providerCallIdMap.set(call.providerCallId, callId);
    }
  }

  return { activeCalls, providerCallIdMap, processedEventIds, rejectedProviderCallIds };
}

/** Read recent call history from the persisted call store. */
export async function getCallHistoryFromStore(
  storePath: string,
  limit = 50,
): Promise<CallRecord[]> {
  const logPath = path.join(storePath, "calls.jsonl");
  const content = await privateFileStore(storePath).readTextIfExists(path.basename(logPath));
  if (content === null) {
    return [];
  }
  const lines = content.trim().split("\n").filter(Boolean);
  const calls: CallRecord[] = [];

  for (const line of lines.slice(-limit)) {
    try {
      const parsed = CallRecordSchema.parse(JSON.parse(line));
      calls.push(parsed);
    } catch {
      // Skip invalid lines.
    }
  }

  return calls;
}
