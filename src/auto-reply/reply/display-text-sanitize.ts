// Display text sanitizer for stripping internal runtime context.
import { stripInternalRuntimeContext } from "../../agents/internal-runtime-context.js";
import { stripEnvelope, stripMessageIdHints } from "../../shared/chat-envelope.js";
import { stripInboundMetadata } from "./strip-inbound-meta.js";

/** Reused helper for strip Internal Metadata For Display behavior in src/auto-reply/reply. */
export function stripInternalMetadataForDisplay(text: string): string {
  return stripInboundMetadata(stripInternalRuntimeContext(text));
}

/** Reused helper for strip User Envelope For Display behavior in src/auto-reply/reply. */
export function stripUserEnvelopeForDisplay(text: string): string {
  return stripMessageIdHints(stripEnvelope(stripInternalMetadataForDisplay(text)));
}
