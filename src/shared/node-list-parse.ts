// shared node list parse helpers and runtime behavior.
import type { NodeListNode, PairedNode, PairingList, PendingRequest } from "./node-list-types.js";
import { asRecord } from "./record-coerce.js";

/** Reused helper for parse Pairing List behavior in src/shared. */
export function parsePairingList(value: unknown): PairingList {
  const obj = asRecord(value);
  const pending = Array.isArray(obj.pending) ? (obj.pending as PendingRequest[]) : [];
  const paired = Array.isArray(obj.paired) ? (obj.paired as PairedNode[]) : [];
  return { pending, paired };
}

/** Reused helper for parse Node List behavior in src/shared. */
export function parseNodeList(value: unknown): NodeListNode[] {
  const obj = asRecord(value);
  return Array.isArray(obj.nodes) ? (obj.nodes as NodeListNode[]) : [];
}
