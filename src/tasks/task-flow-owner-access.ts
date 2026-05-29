// tasks task flow owner access helpers and runtime behavior.
import { normalizeOptionalString } from "../shared/string-coerce.js";
import {
  findLatestTaskFlowForOwnerKey,
  getTaskFlowById,
  listTaskFlowsForOwnerKey,
} from "./task-flow-registry.js";
import type { TaskFlowRecord } from "./task-flow-registry.types.js";

/** Reused helper for get Task Flow By Id For Owner behavior in src/tasks. */
export function getTaskFlowByIdForOwner(params: {
  flowId: string;
  callerOwnerKey: string;
}): TaskFlowRecord | undefined {
  const flow = getTaskFlowById(params.flowId);
  return flow &&
    normalizeOptionalString(flow.ownerKey) === normalizeOptionalString(params.callerOwnerKey)
    ? flow
    : undefined;
}

/** Reused helper for list Task Flows For Owner behavior in src/tasks. */
export function listTaskFlowsForOwner(params: { callerOwnerKey: string }): TaskFlowRecord[] {
  const ownerKey = normalizeOptionalString(params.callerOwnerKey);
  return ownerKey ? listTaskFlowsForOwnerKey(ownerKey) : [];
}

/** Reused helper for find Latest Task Flow For Owner behavior in src/tasks. */
export function findLatestTaskFlowForOwner(params: {
  callerOwnerKey: string;
}): TaskFlowRecord | undefined {
  const ownerKey = normalizeOptionalString(params.callerOwnerKey);
  return ownerKey ? findLatestTaskFlowForOwnerKey(ownerKey) : undefined;
}

/** Reused helper for resolve Task Flow For Lookup Token For Owner behavior in src/tasks. */
export function resolveTaskFlowForLookupTokenForOwner(params: {
  token: string;
  callerOwnerKey: string;
}): TaskFlowRecord | undefined {
  const direct = getTaskFlowByIdForOwner({
    flowId: params.token,
    callerOwnerKey: params.callerOwnerKey,
  });
  if (direct) {
    return direct;
  }
  const normalizedToken = normalizeOptionalString(params.token);
  const normalizedCallerOwnerKey = normalizeOptionalString(params.callerOwnerKey);
  if (!normalizedToken || normalizedToken !== normalizedCallerOwnerKey) {
    return undefined;
  }
  return findLatestTaskFlowForOwner({ callerOwnerKey: normalizedCallerOwnerKey });
}
