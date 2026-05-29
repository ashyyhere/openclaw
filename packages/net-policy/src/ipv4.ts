// IPv4 form validation helpers for network bind configuration.
import { isCanonicalDottedDecimalIPv4 } from "./ip.js";

/** Return a user-facing validation error unless input is canonical dotted IPv4. */
export function validateDottedDecimalIPv4Input(value: string | undefined): string | undefined {
  if (!value) {
    return "IP address is required for custom bind mode";
  }
  if (isCanonicalDottedDecimalIPv4(value)) {
    return undefined;
  }
  return "Invalid IPv4 address (e.g., 192.168.1.100)";
}

/** @deprecated Use validateDottedDecimalIPv4Input. */
export function validateIPv4AddressInput(value: string | undefined): string | undefined {
  return validateDottedDecimalIPv4Input(value);
}
