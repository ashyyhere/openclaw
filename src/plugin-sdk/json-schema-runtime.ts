// Narrow JSON Schema validator surface for plugins that validate tool/model output.

/** Re-exported API for src/plugin-sdk, starting with validate Json Schema Value. */
export { validateJsonSchemaValue } from "../plugins/schema-validator.js";
/** Re-exported API for src/plugin-sdk, starting with Json Schema Object. */
export type { JsonSchemaObject } from "../shared/json-schema.types.js";
