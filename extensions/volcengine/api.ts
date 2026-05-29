// extensions/volcengine api helpers and runtime behavior.
import type { ModelCompatConfig } from "openclaw/plugin-sdk/provider-model-shared";
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";

/** Public volcengine plugin constant for VOLCENGINE UNSUPPORTED TOOL SCHEMA KEYWORDS behavior. */
export const VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS = [
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "minContains",
  "maxContains",
] as const;

function mergeUnsupportedToolSchemaKeywords(existing: readonly string[] | undefined): string[] {
  return uniqueStrings([...(existing ?? []), ...VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS]);
}

/** Public volcengine plugin helper for resolve Volcengine Tool Schema Compat Patch behavior. */
export function resolveVolcengineToolSchemaCompatPatch(
  compat?: ModelCompatConfig,
): ModelCompatConfig {
  return {
    unsupportedToolSchemaKeywords: mergeUnsupportedToolSchemaKeywords(
      compat?.unsupportedToolSchemaKeywords,
    ),
  };
}

/** Public volcengine plugin helper for apply Volcengine Tool Schema Compat behavior. */
export function applyVolcengineToolSchemaCompat<T extends { compat?: ModelCompatConfig }>(
  model: T,
): T {
  const unsupportedToolSchemaKeywords = mergeUnsupportedToolSchemaKeywords(
    model.compat?.unsupportedToolSchemaKeywords,
  );
  if (
    model.compat?.unsupportedToolSchemaKeywords?.length === unsupportedToolSchemaKeywords.length &&
    unsupportedToolSchemaKeywords.every(
      (keyword, index) => model.compat?.unsupportedToolSchemaKeywords?.[index] === keyword,
    )
  ) {
    return model;
  }
  return {
    ...model,
    compat: {
      ...model.compat,
      unsupportedToolSchemaKeywords,
    },
  };
}

/** Re-exported volcengine plugin public API, starting with build Doubao Coding Provider. */
export { buildDoubaoCodingProvider, buildDoubaoProvider } from "./provider-catalog.js";
/** Re-exported volcengine plugin public API. */
export {
  buildDoubaoModelDefinition,
  DOUBAO_BASE_URL,
  DOUBAO_CODING_BASE_URL,
  DOUBAO_CODING_MODEL_CATALOG,
  DOUBAO_MODEL_CATALOG,
} from "./models.js";
