/** Public SDK helpers for secret input refs, schemas, and normalized strings. */
import { z } from "zod";
import {
  hasConfiguredSecretInput,
  isSecretRef,
  coerceSecretRef,
  resolveSecretInputString,
  normalizeResolvedSecretInputString,
  normalizeSecretInputString,
} from "../config/types.secrets.js";
import { normalizeSecretInput } from "../utils/normalize-secret-input.js";
import { buildSecretInputSchema } from "./secret-input-schema.js";

/** Re-exported API for src/plugin-sdk. */
export type {
  SecretInput,
  SecretInputStringResolution,
  SecretInputStringResolutionMode,
} from "../config/types.secrets.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildSecretInputSchema,
  coerceSecretRef,
  hasConfiguredSecretInput,
  isSecretRef,
  resolveSecretInputString,
  normalizeResolvedSecretInputString,
  normalizeSecretInput,
  normalizeSecretInputString,
};

/** Optional version of the shared secret-input schema. */
export function buildOptionalSecretInputSchema() {
  return buildSecretInputSchema().optional();
}

/** Array version of the shared secret-input schema. */
export function buildSecretInputArraySchema() {
  return z.array(buildSecretInputSchema());
}
