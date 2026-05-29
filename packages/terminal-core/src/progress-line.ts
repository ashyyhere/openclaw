// terminal progress line helpers and runtime behavior.
let activeStream: NodeJS.WriteStream | null = null;

/** Reused helper for register Active Progress Line behavior in src/terminal. */
export function registerActiveProgressLine(stream: NodeJS.WriteStream): void {
  if (!stream.isTTY) {
    return;
  }
  activeStream = stream;
}

/** Reused helper for clear Active Progress Line behavior in src/terminal. */
export function clearActiveProgressLine(): void {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1b[2K");
}

/** Reused helper for unregister Active Progress Line behavior in src/terminal. */
export function unregisterActiveProgressLine(stream?: NodeJS.WriteStream): void {
  if (!activeStream) {
    return;
  }
  if (stream && activeStream !== stream) {
    return;
  }
  activeStream = null;
}
