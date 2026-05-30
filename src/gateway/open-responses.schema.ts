/**
 * OpenResponses API Zod Schemas
 *
 * Zod schemas for the OpenResponses `/v1/responses` endpoint.
 * This module is isolated from gateway imports to enable future codegen and prevent drift.
 *
 * @see https://www.open-responses.com/
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Content Parts
// ─────────────────────────────────────────────────────────────────────────────

/** Schema for user/developer/system text content parts in request input. */
export const InputTextContentPartSchema = z
  .object({
    type: z.literal("input_text"),
    text: z.string(),
  })
  .strict();

/** Schema for assistant text content parts in responses and stream events. */
export const OutputTextContentPartSchema = z
  .object({
    type: z.literal("output_text"),
    text: z.string(),
  })
  .strict();

// OpenResponses Image Content: Supports URL or base64 sources
/** Schema for image sources accepted by OpenResponses input content. */
export const InputImageSourceSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("url"),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal("base64"),
    media_type: z.enum([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
    ]),
    data: z.string().min(1), // base64-encoded
  }),
]);

/** Schema for image content parts embedded in request input. */
export const InputImageContentPartSchema = z
  .object({
    type: z.literal("input_image"),
    source: InputImageSourceSchema,
  })
  .strict();

// OpenResponses File Content: Supports URL or base64 sources
/** Schema for file sources accepted by OpenResponses input content. */
export const InputFileSourceSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("url"),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal("base64"),
    media_type: z.string().min(1), // MIME type
    data: z.string().min(1), // base64-encoded
    filename: z.string().optional(),
  }),
]);

/** Schema for file content parts embedded in request input. */
export const InputFileContentPartSchema = z
  .object({
    type: z.literal("input_file"),
    source: InputFileSourceSchema,
  })
  .strict();

/** Discriminated union of supported input/output content parts. */
export const ContentPartSchema = z.discriminatedUnion("type", [
  InputTextContentPartSchema,
  OutputTextContentPartSchema,
  InputImageContentPartSchema,
  InputFileContentPartSchema,
]);

/** Inferred content part accepted by OpenResponses messages. */
export type ContentPart = z.infer<typeof ContentPartSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Item Types (ItemParam)
// ─────────────────────────────────────────────────────────────────────────────

/** Schema for message roles accepted by OpenResponses input items. */
export const MessageItemRoleSchema = z.enum(["system", "developer", "user", "assistant"]);

/** Message role accepted by OpenResponses input items. */
export type MessageItemRole = z.infer<typeof MessageItemRoleSchema>;
/** Schema for assistant phase labels used by OpenClaw streaming. */
export const AssistantPhaseSchema = z.enum(["commentary", "final_answer"]);
/** Assistant phase label used to separate commentary from final answers. */
export type AssistantPhase = z.infer<typeof AssistantPhaseSchema>;

/** Schema for message input items, including assistant-only phase metadata. */
export const MessageItemSchema = z
  .object({
    type: z.literal("message"),
    role: MessageItemRoleSchema,
    content: z.union([z.string(), z.array(ContentPartSchema)]),
    phase: AssistantPhaseSchema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.phase !== undefined && value.role !== "assistant") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phase"],
        message: "`phase` is only valid on assistant messages.",
      });
    }
  });

/** Schema for model-emitted function call input/output items. */
export const FunctionCallItemSchema = z
  .object({
    type: z.literal("function_call"),
    id: z.string().optional(),
    call_id: z.string().optional(),
    name: z.string(),
    arguments: z.string(),
  })
  .strict();

/** Schema for tool/function outputs returned to a response. */
export const FunctionCallOutputItemSchema = z
  .object({
    type: z.literal("function_call_output"),
    call_id: z.string(),
    output: z.string(),
  })
  .strict();

/** Schema for reasoning items preserved across response turns. */
export const ReasoningItemSchema = z
  .object({
    type: z.literal("reasoning"),
    content: z.string().optional(),
    encrypted_content: z.string().optional(),
    summary: z.string().optional(),
  })
  .strict();

/** Schema for references to previous response items. */
export const ItemReferenceItemSchema = z
  .object({
    type: z.literal("item_reference"),
    id: z.string(),
  })
  .strict();

/** Discriminated union of all accepted OpenResponses input item params. */
export const ItemParamSchema = z.discriminatedUnion("type", [
  MessageItemSchema,
  FunctionCallItemSchema,
  FunctionCallOutputItemSchema,
  ReasoningItemSchema,
  ItemReferenceItemSchema,
]);

/** Inferred input item param accepted by create-response requests. */
export type ItemParam = z.infer<typeof ItemParamSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────

// Responses API tool definition uses a flat format (not the Chat Completions
// wrapped-function format). Fields are at the top level alongside `type`.
/** Schema for flat OpenResponses function tool definitions. */
export const FunctionToolDefinitionSchema = z
  .object({
    type: z.literal("function"),
    name: z.string().min(1, "Tool name cannot be empty"),
    description: z.string().optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
    strict: z.boolean().optional(),
  })
  .strict();

/** Schema for tools currently supported by this OpenResponses endpoint. */
export const ToolDefinitionSchema = FunctionToolDefinitionSchema;

/** Inferred tool definition accepted by create-response requests. */
export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Request Body
// ─────────────────────────────────────────────────────────────────────────────

/** Schema for tool choice directives in create-response requests. */
export const ToolChoiceSchema = z.union([
  z.literal("auto"),
  z.literal("none"),
  z.literal("required"),
  z.object({
    type: z.literal("function"),
    function: z.object({ name: z.string() }),
  }),
]);

/** Schema for the OpenResponses create-response request body. */
export const CreateResponseBodySchema = z
  .object({
    model: z.string(),
    input: z.union([z.string(), z.array(ItemParamSchema)]),
    instructions: z.string().optional(),
    tools: z.array(ToolDefinitionSchema).optional(),
    tool_choice: ToolChoiceSchema.optional(),
    stream: z.boolean().optional(),
    max_output_tokens: z.number().int().positive().optional(),
    max_tool_calls: z.number().int().positive().optional(),
    user: z.string().optional(),
    // Sampling overrides forwarded to provider (best-effort; some backends like
    // ChatGPT Codex Responses strip these — see openai-transport-stream.ts).
    temperature: z.number().min(0).max(2).optional(),
    top_p: z.number().min(0).max(1).optional(),
    metadata: z.record(z.string(), z.string()).optional(),
    store: z.boolean().optional(),
    previous_response_id: z.string().optional(),
    reasoning: z
      .object({
        effort: z.enum(["low", "medium", "high"]).optional(),
        summary: z.enum(["auto", "concise", "detailed"]).optional(),
      })
      .optional(),
    truncation: z.enum(["auto", "disabled"]).optional(),
  })
  .strict();

/** Inferred create-response request body. */
export type CreateResponseBody = z.infer<typeof CreateResponseBodySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Response Resource
// ─────────────────────────────────────────────────────────────────────────────

/** Schema for OpenResponses response lifecycle status. */
export const ResponseStatusSchema = z.enum([
  "in_progress",
  "completed",
  "failed",
  "cancelled",
  "incomplete",
]);

/** OpenResponses response lifecycle status. */
export type ResponseStatus = z.infer<typeof ResponseStatusSchema>;

/** Union schema for response output message, function call, and reasoning items. */
export const OutputItemSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("message"),
      id: z.string(),
      role: z.literal("assistant"),
      content: z.array(OutputTextContentPartSchema),
      phase: AssistantPhaseSchema.optional(),
      status: z.enum(["in_progress", "completed"]).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("function_call"),
      id: z.string(),
      call_id: z.string(),
      name: z.string(),
      arguments: z.string(),
      status: z.enum(["in_progress", "completed"]).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("reasoning"),
      id: z.string(),
      content: z.string().optional(),
      summary: z.string().optional(),
    })
    .strict(),
]);

/** Output item returned by OpenResponses response resources and events. */
export type OutputItem = z.infer<typeof OutputItemSchema>;

/** Schema for token usage counters. */
export const UsageSchema = z.object({
  input_tokens: z.number().int().nonnegative(),
  output_tokens: z.number().int().nonnegative(),
  total_tokens: z.number().int().nonnegative(),
});

/** Token usage counters returned with response resources. */
export type Usage = z.infer<typeof UsageSchema>;

/** Schema for OpenResponses response resources. */
export const ResponseResourceSchema = z.object({
  id: z.string(),
  object: z.literal("response"),
  created_at: z.number().int(),
  status: ResponseStatusSchema,
  model: z.string(),
  output: z.array(OutputItemSchema),
  usage: UsageSchema,
  // Optional fields for future phases
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .optional(),
});

/** OpenResponses response resource returned by create and stream events. */
export type ResponseResource = z.infer<typeof ResponseResourceSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Streaming Event Types
// ─────────────────────────────────────────────────────────────────────────────

/** Schema for response.created streaming events. */
export const ResponseCreatedEventSchema = z.object({
  type: z.literal("response.created"),
  response: ResponseResourceSchema,
});

/** Schema for response.in_progress streaming events. */
export const ResponseInProgressEventSchema = z.object({
  type: z.literal("response.in_progress"),
  response: ResponseResourceSchema,
});

/** Schema for response.completed streaming events. */
export const ResponseCompletedEventSchema = z.object({
  type: z.literal("response.completed"),
  response: ResponseResourceSchema,
});

/** Schema for response.failed streaming events. */
export const ResponseFailedEventSchema = z.object({
  type: z.literal("response.failed"),
  response: ResponseResourceSchema,
});

/** Schema for response.output_item.added streaming events. */
export const OutputItemAddedEventSchema = z.object({
  type: z.literal("response.output_item.added"),
  output_index: z.number().int().nonnegative(),
  item: OutputItemSchema,
});

/** Schema for response.output_item.done streaming events. */
export const OutputItemDoneEventSchema = z.object({
  type: z.literal("response.output_item.done"),
  output_index: z.number().int().nonnegative(),
  item: OutputItemSchema,
});

/** Schema for response.content_part.added streaming events. */
export const ContentPartAddedEventSchema = z.object({
  type: z.literal("response.content_part.added"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  part: OutputTextContentPartSchema,
});

/** Schema for response.content_part.done streaming events. */
export const ContentPartDoneEventSchema = z.object({
  type: z.literal("response.content_part.done"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  part: OutputTextContentPartSchema,
});

/** Schema for response.output_text.delta streaming events. */
export const OutputTextDeltaEventSchema = z.object({
  type: z.literal("response.output_text.delta"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  delta: z.string(),
});

/** Schema for response.output_text.done streaming events. */
export const OutputTextDoneEventSchema = z.object({
  type: z.literal("response.output_text.done"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  text: z.string(),
});

/** OpenResponses streaming event union emitted by the Gateway. */
export type StreamingEvent =
  | z.infer<typeof ResponseCreatedEventSchema>
  | z.infer<typeof ResponseInProgressEventSchema>
  | z.infer<typeof ResponseCompletedEventSchema>
  | z.infer<typeof ResponseFailedEventSchema>
  | z.infer<typeof OutputItemAddedEventSchema>
  | z.infer<typeof OutputItemDoneEventSchema>
  | z.infer<typeof ContentPartAddedEventSchema>
  | z.infer<typeof ContentPartDoneEventSchema>
  | z.infer<typeof OutputTextDeltaEventSchema>
  | z.infer<typeof OutputTextDoneEventSchema>;
