// gateway/server/ws-connection unauthorized flood guard helpers and runtime behavior.
import { ErrorCodes, type ErrorShape } from "../../../../packages/gateway-protocol/src/index.js";
import { resolveIntegerOption } from "../../../shared/number-coercion.js";

/** Shared type for Unauthorized Flood Guard Options in src/gateway/server. */
export type UnauthorizedFloodGuardOptions = {
  closeAfter?: number;
  logEvery?: number;
};

/** Shared type for Unauthorized Flood Decision in src/gateway/server. */
export type UnauthorizedFloodDecision = {
  shouldClose: boolean;
  shouldLog: boolean;
  count: number;
  suppressedSinceLastLog: number;
};

const DEFAULT_CLOSE_AFTER = 10;
const DEFAULT_LOG_EVERY = 100;

/** Reused class for Unauthorized Flood Guard behavior in src/gateway/server. */
export class UnauthorizedFloodGuard {
  private readonly closeAfter: number;
  private readonly logEvery: number;
  private count = 0;
  private suppressedSinceLastLog = 0;

  constructor(options?: UnauthorizedFloodGuardOptions) {
    this.closeAfter = resolveIntegerOption(options?.closeAfter, DEFAULT_CLOSE_AFTER, { min: 1 });
    this.logEvery = resolveIntegerOption(options?.logEvery, DEFAULT_LOG_EVERY, { min: 1 });
  }

  registerUnauthorized(): UnauthorizedFloodDecision {
    this.count += 1;
    const shouldClose = this.count > this.closeAfter;
    const shouldLog = this.count === 1 || this.count % this.logEvery === 0 || shouldClose;

    if (!shouldLog) {
      this.suppressedSinceLastLog += 1;
      return {
        shouldClose,
        shouldLog: false,
        count: this.count,
        suppressedSinceLastLog: 0,
      };
    }

    const suppressedSinceLastLog = this.suppressedSinceLastLog;
    this.suppressedSinceLastLog = 0;
    return {
      shouldClose,
      shouldLog: true,
      count: this.count,
      suppressedSinceLastLog,
    };
  }

  reset(): void {
    this.count = 0;
    this.suppressedSinceLastLog = 0;
  }
}

/** Reused helper for is Unauthorized Role Error behavior in src/gateway/server. */
export function isUnauthorizedRoleError(error?: ErrorShape): boolean {
  if (!error) {
    return false;
  }
  return (
    error.code === ErrorCodes.INVALID_REQUEST &&
    typeof error.message === "string" &&
    error.message.startsWith("unauthorized role:")
  );
}
