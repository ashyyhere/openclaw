let embeddedModeValue = false;

/** Set the process-local embedded-mode flag. */
export function setEmbeddedMode(value: boolean): void {
  embeddedModeValue = value;
}

/** Read the process-local embedded-mode flag. */
export function isEmbeddedMode(): boolean {
  return embeddedModeValue;
}
