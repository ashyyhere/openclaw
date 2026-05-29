// gateway/server-methods validation helpers and runtime behavior.
import {
  ErrorCodes,
  errorShape,
  formatValidationErrors,
} from "../../../packages/gateway-protocol/src/index.js";
import type { ValidationError } from "../../../packages/gateway-protocol/src/index.js";
import type { RespondFn } from "./types.js";

/** Shared type for Validator in src/gateway/server-methods. */
export type Validator<T> = ((params: unknown) => params is T) & {
  errors?: ValidationError[] | null;
};

/** Reused helper for assert Valid Params behavior in src/gateway/server-methods. */
export function assertValidParams<T>(
  params: unknown,
  validate: Validator<T>,
  method: string,
  respond: RespondFn,
): params is T {
  if (validate(params)) {
    return true;
  }
  respond(
    false,
    undefined,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `invalid ${method} params: ${formatValidationErrors(validate.errors)}`,
    ),
  );
  return false;
}
