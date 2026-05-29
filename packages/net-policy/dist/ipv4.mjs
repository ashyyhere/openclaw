import { isCanonicalDottedDecimalIPv4 } from "./ip.mjs";
//#region packages/net-policy/src/ipv4.ts
function validateDottedDecimalIPv4Input(value) {
	if (!value) return "IP address is required for custom bind mode";
	if (isCanonicalDottedDecimalIPv4(value)) return;
	return "Invalid IPv4 address (e.g., 192.168.1.100)";
}
/** @deprecated Use validateDottedDecimalIPv4Input. */
function validateIPv4AddressInput(value) {
	return validateDottedDecimalIPv4Input(value);
}
//#endregion
export { validateDottedDecimalIPv4Input, validateIPv4AddressInput };
