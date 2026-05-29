// Conversation binding record facade backed by the outbound session binding service.
import {
  getSessionBindingService,
  type ConversationRef,
  type SessionBindingBindInput,
  type SessionBindingCapabilities,
  type SessionBindingRecord,
  type SessionBindingUnbindInput,
} from "../infra/outbound/session-binding-service.js";

/** Create a conversation binding record shared by configured and runtime plugin bindings. */
export async function createConversationBindingRecord(
  input: SessionBindingBindInput,
): Promise<SessionBindingRecord> {
  return await getSessionBindingService().bind(input);
}

/** Return binding capabilities for a channel/account pair. */
export function getConversationBindingCapabilities(params: {
  channel: string;
  accountId: string;
}): SessionBindingCapabilities {
  return getSessionBindingService().getCapabilities(params);
}

/** List all binding records that currently target a session key. */
export function listSessionBindingRecords(targetSessionKey: string): SessionBindingRecord[] {
  return getSessionBindingService().listBySession(targetSessionKey);
}

/** Resolve a binding record by its canonical conversation reference. */
export function resolveConversationBindingRecord(
  conversation: ConversationRef,
): SessionBindingRecord | null {
  return getSessionBindingService().resolveByConversation(conversation);
}

/** Update a binding record's last-seen timestamp. */
export function touchConversationBindingRecord(bindingId: string, at?: number): void {
  const service = getSessionBindingService();
  if (typeof at === "number") {
    service.touch(bindingId, at);
    return;
  }
  service.touch(bindingId);
}

/** Remove a conversation binding record through the shared binding service. */
export async function unbindConversationBindingRecord(
  input: SessionBindingUnbindInput,
): Promise<SessionBindingRecord[]> {
  return await getSessionBindingService().unbind(input);
}
