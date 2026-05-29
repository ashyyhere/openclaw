/** Errors shared by agent harness registration and selection. */
export class MissingAgentHarnessError extends Error {
  readonly harnessId: string;

  constructor(harnessId: string) {
    super(`Requested agent harness "${harnessId}" is not registered.`);
    this.name = "MissingAgentHarnessError";
    this.harnessId = harnessId;
  }
}

/** Narrows unknown errors to missing harness selection failures. */
export function isMissingAgentHarnessError(err: unknown): err is MissingAgentHarnessError {
  return err instanceof MissingAgentHarnessError;
}
