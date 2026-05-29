// packages/gateway-protocol/src secret ref contract helpers and runtime behavior.
/** Public constant for SINGLE VALUE FILE REF ID behavior in packages/gateway-protocol. */
export const SINGLE_VALUE_FILE_REF_ID = "value";

/** Public constant for SECRET PROVIDER ALIAS PATTERN behavior in packages/gateway-protocol. */
export const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
/** Public constant for FILE SECRET REF ID ABSOLUTE JSON SCHEMA PATTERN behavior in packages/gateway-protocol. */
export const FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
/** Public constant for FILE SECRET REF ID INVALID ESCAPE JSON SCHEMA PATTERN behavior in packages/gateway-protocol. */
export const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** Public constant for EXEC SECRET REF ID JSON SCHEMA PATTERN behavior in packages/gateway-protocol. */
export const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN =
  "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
