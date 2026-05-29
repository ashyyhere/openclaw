// config zod schema approvals helpers and runtime behavior.
import { z } from "zod";

/** Reused constant for Native Exec Approval Enable Mode Schema behavior in src/config. */
export const NativeExecApprovalEnableModeSchema = z.union([z.boolean(), z.literal("auto")]);

const ExecApprovalForwardTargetSchema = z
  .object({
    channel: z.string().min(1),
    to: z.string().min(1),
    accountId: z.string().optional(),
    threadId: z.union([z.string(), z.number()]).optional(),
  })
  .strict();

const ExecApprovalForwardingSchema = z
  .object({
    enabled: z.boolean().optional(),
    mode: z.union([z.literal("session"), z.literal("targets"), z.literal("both")]).optional(),
    agentFilter: z.array(z.string()).optional(),
    sessionFilter: z.array(z.string()).optional(),
    targets: z.array(ExecApprovalForwardTargetSchema).optional(),
  })
  .strict()
  .optional();

/** Reused constant for Approvals Schema behavior in src/config. */
export const ApprovalsSchema = z
  .object({
    exec: ExecApprovalForwardingSchema,
    plugin: ExecApprovalForwardingSchema,
  })
  .strict()
  .optional();
