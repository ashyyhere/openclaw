// Public barrel for generated config-form rendering. Keep imports here narrow so
// callers do not need to know which split module owns analysis, shared schema
// helpers, or node rendering.
/** Full config form renderer and section metadata. */
export { renderConfigForm, type ConfigFormProps, SECTION_META } from "./config-form.render.ts";
/** Schema analyzer that normalizes renderable nodes and reports unsupported paths. */
export { analyzeConfigSchema, type ConfigSchemaAnalysis } from "./config-form.analyze.ts";
/** Recursive config node renderer used by the full form. */
export { renderNode } from "./config-form.node.ts";
/** Shared schema utilities and supported schema type. */
export { schemaType, type JsonSchema } from "./config-form.shared.ts";
