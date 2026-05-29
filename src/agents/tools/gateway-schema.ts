/** TypeBox schema fragments shared by gateway-backed tools. */
import { Type } from "typebox";
import { optionalPositiveIntegerSchema } from "../schema/typebox.js";

/** Returns common gateway call option schema properties. */
export function gatewayCallOptionSchemaProperties() {
  return {
    gatewayUrl: Type.Optional(Type.String()),
    gatewayToken: Type.Optional(Type.String()),
    timeoutMs: optionalPositiveIntegerSchema(),
  };
}
