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

/** Reused constant for Input Text Content Part Schema behavior in src/gateway. */
export const InputTextContentPartSchema = z
  .object({
    type: z.literal("input_text"),
    text: z.string(),
  })
  .strict();

/** Reused constant for Output Text Content Part Schema behavior in src/gateway. */
export const OutputTextContentPartSchema = z
  .object({
    type: z.literal("output_text"),
    text: z.string(),
  })
  .strict();

// OpenResponses Image Content: Supports URL or base64 sources
/** Reused constant for Input Image Source Schema behavior in src/gateway. */
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

/** Reused constant for Input Image Content Part Schema behavior in src/gateway. */
export const InputImageContentPartSchema = z
  .object({
    type: z.literal("input_image"),
    source: InputImageSourceSchema,
  })
  .strict();

// OpenResponses File Content: Supports URL or base64 sources
/** Reused constant for Input File Source Schema behavior in src/gateway. */
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

/** Reused constant for Input File Content Part Schema behavior in src/gateway. */
export const InputFileContentPartSchema = z
  .object({
    type: z.literal("input_file"),
    source: InputFileSourceSchema,
  })
  .strict();

/** Reused constant for Content Part Schema behavior in src/gateway. */
export const ContentPartSchema = z.discriminatedUnion("type", [
  InputTextContentPartSchema,
  OutputTextContentPartSchema,
  InputImageContentPartSchema,
  InputFileContentPartSchema,
]);

/** Shared type for Content Part in src/gateway. */
export type ContentPart = z.infer<typeof ContentPartSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Item Types (ItemParam)
// ─────────────────────────────────────────────────────────────────────────────

/** Reused constant for Message Item Role Schema behavior in src/gateway. */
export const MessageItemRoleSchema = z.enum(["system", "developer", "user", "assistant"]);

/** Shared type for Message Item Role in src/gateway. */
export type MessageItemRole = z.infer<typeof MessageItemRoleSchema>;
/** Reused constant for Assistant Phase Schema behavior in src/gateway. */
export const AssistantPhaseSchema = z.enum(["commentary", "final_answer"]);
/** Shared type for Assistant Phase in src/gateway. */
export type AssistantPhase = z.infer<typeof AssistantPhaseSchema>;

/** Reused constant for Message Item Schema behavior in src/gateway. */
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

/** Reused constant for Function Call Item Schema behavior in src/gateway. */
export const FunctionCallItemSchema = z
  .object({
    type: z.literal("function_call"),
    id: z.string().optional(),
    call_id: z.string().optional(),
    name: z.string(),
    arguments: z.string(),
  })
  .strict();

/** Reused constant for Function Call Output Item Schema behavior in src/gateway. */
export const FunctionCallOutputItemSchema = z
  .object({
    type: z.literal("function_call_output"),
    call_id: z.string(),
    output: z.string(),
  })
  .strict();

/** Reused constant for Reasoning Item Schema behavior in src/gateway. */
export const ReasoningItemSchema = z
  .object({
    type: z.literal("reasoning"),
    content: z.string().optional(),
    encrypted_content: z.string().optional(),
    summary: z.string().optional(),
  })
  .strict();

/** Reused constant for Item Reference Item Schema behavior in src/gateway. */
export const ItemReferenceItemSchema = z
  .object({
    type: z.literal("item_reference"),
    id: z.string(),
  })
  .strict();

/** Reused constant for Item Param Schema behavior in src/gateway. */
export const ItemParamSchema = z.discriminatedUnion("type", [
  MessageItemSchema,
  FunctionCallItemSchema,
  FunctionCallOutputItemSchema,
  ReasoningItemSchema,
  ItemReferenceItemSchema,
]);

/** Shared type for Item Param in src/gateway. */
export type ItemParam = z.infer<typeof ItemParamSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────

// Responses API tool definition uses a flat format (not the Chat Completions
// wrapped-function format). Fields are at the top level alongside `type`.
/** Reused constant for Function Tool Definition Schema behavior in src/gateway. */
export const FunctionToolDefinitionSchema = z
  .object({
    type: z.literal("function"),
    name: z.string().min(1, "Tool name cannot be empty"),
    description: z.string().optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
    strict: z.boolean().optional(),
  })
  .strict();

/** Reused constant for Tool Definition Schema behavior in src/gateway. */
export const ToolDefinitionSchema = FunctionToolDefinitionSchema;

/** Shared type for Tool Definition in src/gateway. */
export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Request Body
// ─────────────────────────────────────────────────────────────────────────────

/** Reused constant for Tool Choice Schema behavior in src/gateway. */
export const ToolChoiceSchema = z.union([
  z.literal("auto"),
  z.literal("none"),
  z.literal("required"),
  z.object({
    type: z.literal("function"),
    function: z.object({ name: z.string() }),
  }),
]);

/** Reused constant for Create Response Body Schema behavior in src/gateway. */
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

/** Shared type for Create Response Body in src/gateway. */
export type CreateResponseBody = z.infer<typeof CreateResponseBodySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Response Resource
// ─────────────────────────────────────────────────────────────────────────────

/** Reused constant for Response Status Schema behavior in src/gateway. */
export const ResponseStatusSchema = z.enum([
  "in_progress",
  "completed",
  "failed",
  "cancelled",
  "incomplete",
]);

/** Shared type for Response Status in src/gateway. */
export type ResponseStatus = z.infer<typeof ResponseStatusSchema>;

/** Reused constant for Output Item Schema behavior in src/gateway. */
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

/** Shared type for Output Item in src/gateway. */
export type OutputItem = z.infer<typeof OutputItemSchema>;

/** Reused constant for Usage Schema behavior in src/gateway. */
export const UsageSchema = z.object({
  input_tokens: z.number().int().nonnegative(),
  output_tokens: z.number().int().nonnegative(),
  total_tokens: z.number().int().nonnegative(),
});

/** Shared type for Usage in src/gateway. */
export type Usage = z.infer<typeof UsageSchema>;

/** Reused constant for Response Resource Schema behavior in src/gateway. */
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

/** Shared type for Response Resource in src/gateway. */
export type ResponseResource = z.infer<typeof ResponseResourceSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Streaming Event Types
// ─────────────────────────────────────────────────────────────────────────────

/** Reused constant for Response Created Event Schema behavior in src/gateway. */
export const ResponseCreatedEventSchema = z.object({
  type: z.literal("response.created"),
  response: ResponseResourceSchema,
});

/** Reused constant for Response In Progress Event Schema behavior in src/gateway. */
export const ResponseInProgressEventSchema = z.object({
  type: z.literal("response.in_progress"),
  response: ResponseResourceSchema,
});

/** Reused constant for Response Completed Event Schema behavior in src/gateway. */
export const ResponseCompletedEventSchema = z.object({
  type: z.literal("response.completed"),
  response: ResponseResourceSchema,
});

/** Reused constant for Response Failed Event Schema behavior in src/gateway. */
export const ResponseFailedEventSchema = z.object({
  type: z.literal("response.failed"),
  response: ResponseResourceSchema,
});

/** Reused constant for Output Item Added Event Schema behavior in src/gateway. */
export const OutputItemAddedEventSchema = z.object({
  type: z.literal("response.output_item.added"),
  output_index: z.number().int().nonnegative(),
  item: OutputItemSchema,
});

/** Reused constant for Output Item Done Event Schema behavior in src/gateway. */
export const OutputItemDoneEventSchema = z.object({
  type: z.literal("response.output_item.done"),
  output_index: z.number().int().nonnegative(),
  item: OutputItemSchema,
});

/** Reused constant for Content Part Added Event Schema behavior in src/gateway. */
export const ContentPartAddedEventSchema = z.object({
  type: z.literal("response.content_part.added"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  part: OutputTextContentPartSchema,
});

/** Reused constant for Content Part Done Event Schema behavior in src/gateway. */
export const ContentPartDoneEventSchema = z.object({
  type: z.literal("response.content_part.done"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  part: OutputTextContentPartSchema,
});

/** Reused constant for Output Text Delta Event Schema behavior in src/gateway. */
export const OutputTextDeltaEventSchema = z.object({
  type: z.literal("response.output_text.delta"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  delta: z.string(),
});

/** Reused constant for Output Text Done Event Schema behavior in src/gateway. */
export const OutputTextDoneEventSchema = z.object({
  type: z.literal("response.output_text.done"),
  item_id: z.string(),
  output_index: z.number().int().nonnegative(),
  content_index: z.number().int().nonnegative(),
  text: z.string(),
});

/** Shared type for Streaming Event in src/gateway. */
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
