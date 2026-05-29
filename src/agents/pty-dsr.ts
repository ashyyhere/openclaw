/** Handles terminal DSR cursor-position request/response control sequences. */
const ESC = String.fromCharCode(0x1b);
const DSR_PATTERN = new RegExp(`${ESC}\\[\\??6n`, "g");

/** Remove DSR cursor-position requests and count how many were stripped. */
export function stripDsrRequests(input: string): { cleaned: string; requests: number } {
  let requests = 0;
  const cleaned = input.replace(DSR_PATTERN, () => {
    requests += 1;
    return "";
  });
  return { cleaned, requests };
}

/** Build a terminal cursor-position response for a DSR request. */
export function buildCursorPositionResponse(row = 1, col = 1): string {
  return `\x1b[${row};${col}R`;
}
