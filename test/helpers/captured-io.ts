// CLI tests use this helper to capture stdout/stderr writes without real console output.
/** Create an IO stub with readers for accumulated stdout and stderr text. */
export function createCapturedIo() {
  let stdout = "";
  let stderr = "";
  return {
    io: {
      stdout: {
        write(chunk: unknown) {
          stdout += String(chunk);
        },
      },
      stderr: {
        write(chunk: unknown) {
          stderr += String(chunk);
        },
      },
    },
    readStdout: () => stdout,
    readStderr: () => stderr,
  };
}
