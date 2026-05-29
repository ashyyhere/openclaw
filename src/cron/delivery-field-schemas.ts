// Zod field parsers shared by cron delivery create/update inputs.
import { z, type ZodType } from "zod";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

const trimStringPreprocess = (value: unknown) => (typeof value === "string" ? value.trim() : value);

const trimLowercaseStringPreprocess = (value: unknown) =>
  normalizeOptionalLowercaseString(value) ?? value;

const DeliveryModeFieldSchema = z
  .preprocess(trimLowercaseStringPreprocess, z.enum(["deliver", "announce", "none", "webhook"]))
  .transform((value) => (value === "deliver" ? "announce" : value));

/** Field schema for lowercased non-empty delivery values. */
export const LowercaseNonEmptyStringFieldSchema = z.preprocess(
  trimLowercaseStringPreprocess,
  z.string().min(1),
);

/** Field schema for trimmed non-empty delivery values that preserve case. */
export const TrimmedNonEmptyStringFieldSchema = z.preprocess(
  trimStringPreprocess,
  z.string().min(1),
);

/** Field schema accepting string or numeric thread identifiers. */
export const DeliveryThreadIdFieldSchema = z.union([
  TrimmedNonEmptyStringFieldSchema,
  z.number().finite(),
]);

/** Field schema for non-negative timeout values in seconds. */
export const TimeoutSecondsFieldSchema = z.number().finite().nonnegative();

type ParsedDeliveryInput = {
  mode?: "announce" | "none" | "webhook";
  channel?: string;
  to?: string;
  threadId?: string | number;
  accountId?: string;
};

/** Parses optional delivery fields while dropping invalid values. */
export function parseDeliveryInput(input: Record<string, unknown>): ParsedDeliveryInput {
  return {
    mode: parseOptionalField(DeliveryModeFieldSchema, input.mode),
    channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, input.channel),
    to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.to),
    threadId: parseOptionalField(DeliveryThreadIdFieldSchema, input.threadId),
    accountId: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.accountId),
  };
}

/** Parses one optional field and returns undefined when validation fails. */
export function parseOptionalField<T>(schema: ZodType<T>, value: unknown): T | undefined {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}
