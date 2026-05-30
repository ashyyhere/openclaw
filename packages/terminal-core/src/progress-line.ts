// Tracks the active one-line terminal progress display so other output can clear it.
let activeStream: NodeJS.WriteStream | null = null;

/** Register a TTY stream as owning the active progress line. */
export function registerActiveProgressLine(stream: NodeJS.WriteStream): void {
  if (!stream.isTTY) {
    return;
  }
  activeStream = stream;
}

/** Clear the active terminal progress line if one is registered. */
export function clearActiveProgressLine(): void {
  if (!activeStream?.isTTY) {
    return;
  }
  activeStream.write("\r\x1b[2K");
}

/** Unregister the active progress line, optionally only for a matching stream. */
export function unregisterActiveProgressLine(stream?: NodeJS.WriteStream): void {
  if (!activeStream) {
    return;
  }
  if (stream && activeStream !== stream) {
    return;
  }
  activeStream = null;
}
