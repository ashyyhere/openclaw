/** Public SDK helpers for channel action tools, schemas, gates, and parameter readers. */
import { Type } from "typebox";
import type { TSchema } from "typebox";
import { stringEnum as createStringEnum } from "../agents/schema/typebox.js";

/** Shared action-gate and account helpers for channel action tools. */
export {
  createUnionActionGate,
  listTokenSourcedAccounts,
} from "../channels/plugins/actions/shared.js";
/** Resolves reaction action message ids from channel-specific parameters. */
export { resolveReactionMessageId } from "../channels/plugins/actions/reaction-message-id.js";
/** Common tool result, schema, and parameter helpers for channel actions. */
export {
  createActionGate,
  imageResultFromFile,
  jsonResult,
  readNonNegativeIntegerParam,
  parseAvailableTags,
  readNumberParam,
  readPositiveIntegerParam,
  readReactionParams,
  readStringArrayParam,
  readStringOrNumberParam,
  readStringParam,
  ToolAuthorizationError,
} from "../agents/tools/common.js";
/** Action gate type used by channel action tools. */
export type { ActionGate } from "../agents/tools/common.js";
/** Timestamp normalizer shared by channel action payloads. */
export { withNormalizedTimestamp } from "../agents/date-time.js";
/** Media input guard shared by channel action tools. */
export { assertMediaNotDataUrl } from "../agents/sandbox-paths.js";
/** Poll selection limit helper shared by poll-capable channel actions. */
export { resolvePollMaxSelections } from "../polls.js";
/** TypeBox schema helpers shared by channel action tool definitions. */
export {
  optionalFiniteNumberSchema,
  optionalNonNegativeIntegerSchema,
  optionalPositiveIntegerSchema,
  optionalStringEnum,
  stringEnum,
} from "../agents/schema/typebox.js";

/**
 * @deprecated Use semantic `presentation` capabilities instead of exposing
 * provider-native button schemas through the shared message tool.
 */
export function createMessageToolButtonsSchema(): TSchema {
  return Type.Optional(
    Type.Array(
      Type.Array(
        Type.Object({
          text: Type.String(),
          callback_data: Type.String(),
          style: Type.Optional(createStringEnum(["danger", "success", "primary"])),
        }),
      ),
      {
        description: "Button rows for channels that support button-style actions.",
      },
    ),
  );
}

/**
 * @deprecated Use semantic `presentation` capabilities instead of exposing
 * provider-native card schemas through the shared message tool.
 */
export function createMessageToolCardSchema(): TSchema {
  return Type.Optional(
    Type.Object(
      {},
      {
        additionalProperties: true,
        description: "Structured card payload for channels that support card-style messages.",
      },
    ),
  );
}
