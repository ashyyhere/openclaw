/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Plugin authors should define plugin-local schemas instead of depending on the
 * full root OpenClaw config schema.
 */
export { OpenClawSchema } from "../config/zod-schema.js";
/** Re-exported API for src/plugin-sdk, starting with validate Json Schema Value. */
export { validateJsonSchemaValue } from "../plugins/schema-validator.js";
/** Re-exported API for src/plugin-sdk, starting with Json Schema Object. */
export type { JsonSchemaObject } from "../shared/json-schema.types.js";
