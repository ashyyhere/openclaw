// JSON stringification helper for logs and diagnostics that may include non-plain values.
/** Stringifies values with stable handling for bigint, functions, errors, and byte arrays; returns null on cycles. */
export function safeJsonStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value, (_key, val) => {
      if (typeof val === "bigint") {
        return val.toString();
      }
      if (typeof val === "function") {
        return "[Function]";
      }
      if (val instanceof Error) {
        return { name: val.name, message: val.message, stack: val.stack };
      }
      if (val instanceof Uint8Array) {
        return { type: "Uint8Array", data: Buffer.from(val).toString("base64") };
      }
      return val;
    });
  } catch {
    return null;
  }
}
