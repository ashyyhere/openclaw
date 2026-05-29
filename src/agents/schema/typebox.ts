/** Shared TypeBox schema helpers for agent tool definitions. */
import { Type } from "typebox";
import {
  CHANNEL_TARGET_DESCRIPTION,
  CHANNEL_TARGETS_DESCRIPTION,
} from "../../infra/outbound/channel-target.js";
/** Re-exported API for src/agents/schema, starting with optional String Enum. */
export { optionalStringEnum, stringEnum } from "./string-enum.js";

/** Builds a schema for one outbound channel target. */
export function channelTargetSchema(options?: { description?: string }) {
  return Type.String({
    description: options?.description ?? CHANNEL_TARGET_DESCRIPTION,
  });
}

/** Builds a schema for multiple outbound channel targets. */
export function channelTargetsSchema(options?: { description?: string }) {
  return Type.Array(
    channelTargetSchema({ description: options?.description ?? CHANNEL_TARGETS_DESCRIPTION }),
  );
}

type IntegerSchemaOptions = {
  description?: string;
  maximum?: number;
};

type NumberSchemaOptions = {
  description?: string;
  deprecated?: boolean;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
};

/** Builds an optional finite number schema with common metadata. */
export function optionalFiniteNumberSchema(options: NumberSchemaOptions = {}) {
  return Type.Optional(Type.Number(options));
}

/** Builds an optional positive integer schema with common metadata. */
export function optionalPositiveIntegerSchema(options: IntegerSchemaOptions = {}) {
  return Type.Optional(
    Type.Integer({
      minimum: 1,
      ...options,
    }),
  );
}

/** Builds an optional non-negative integer schema with common metadata. */
export function optionalNonNegativeIntegerSchema(options: IntegerSchemaOptions = {}) {
  return Type.Optional(
    Type.Integer({
      minimum: 0,
      ...options,
    }),
  );
}
