// gateway control ui http utils helpers and runtime behavior.
import type { ServerResponse } from "node:http";

/** Reused helper for is Read Http Method behavior in src/gateway. */
export function isReadHttpMethod(method: string | undefined): boolean {
  return method === "GET" || method === "HEAD";
}

/** Reused helper for respond Plain Text behavior in src/gateway. */
export function respondPlainText(res: ServerResponse, statusCode: number, body: string): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(body);
}

/** Reused helper for respond Not Found behavior in src/gateway. */
export function respondNotFound(res: ServerResponse): void {
  respondPlainText(res, 404, "Not Found");
}
