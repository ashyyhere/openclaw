// Shared secret reference grammar used by gateway schema and resolver code.
/** Reserved ref id for file-backed secrets that expose one scalar value. */
export const SINGLE_VALUE_FILE_REF_ID = "value";

/** Provider aliases are short lowercase handles safe for config keys and URLs. */
export const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
/** JSON-schema pattern used to reject absolute file secret paths. */
export const FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
/** JSON-schema pattern used to reject invalid JSON-pointer escape sequences. */
export const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON-schema pattern limiting executable secret ids to relative safe tokens. */
export const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN =
  "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
