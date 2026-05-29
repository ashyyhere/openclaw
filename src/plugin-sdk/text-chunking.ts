// plugin-sdk text chunking helpers and runtime behavior.
import { chunkTextByBreakResolver } from "../shared/text-chunking.js";

/** Chunk outbound text while preferring newline boundaries over spaces. */
export function chunkTextForOutbound(text: string, limit: number): string[] {
  return chunkTextByBreakResolver(text, limit, (window) => {
    const lastNewline = window.lastIndexOf("\n");
    const lastSpace = window.lastIndexOf(" ");
    return lastNewline > 0 ? lastNewline : lastSpace;
  });
}

/** Re-exported API for src/plugin-sdk. */
export {
  chunkMarkdownIR,
  markdownToIR,
  markdownToIRWithMeta,
  sliceMarkdownIR,
  type MarkdownIR,
  type MarkdownLinkSpan,
  type MarkdownParseOptions,
  type MarkdownStyle,
  type MarkdownStyleSpan,
  type MarkdownTableMeta,
} from "../../packages/markdown-core/src/ir.js";
export {
  renderMarkdownIRChunksWithinLimit,
  type RenderMarkdownIRChunksWithinLimitOptions,
} from "../../packages/markdown-core/src/render-aware-chunking.js";
export {
  renderMarkdownWithMarkers,
  type RenderLink,
  type RenderOptions,
  type RenderStyleMap,
  type RenderStyleMarker,
} from "../../packages/markdown-core/src/render.js";
export { convertMarkdownTables } from "../../packages/markdown-core/src/tables.js";
export {
  sanitizeAssistantVisibleText,
  sanitizeAssistantVisibleTextWithOptions,
  sanitizeAssistantVisibleTextWithProfile,
  stripAssistantInternalScaffolding,
  stripToolCallXmlTags,
  type AssistantVisibleTextSanitizerProfile,
} from "../shared/text/assistant-visible-text.js";
/** Re-exported API for src/plugin-sdk. */
export {
  FILE_REF_EXTENSIONS_WITH_TLD,
  isAutoLinkedFileRef,
} from "../shared/text/auto-linked-file-ref.js";
/** Re-exported API for src/plugin-sdk, starting with find Code Regions. */
export { findCodeRegions, isInsideCode, type CodeRegion } from "../shared/text/code-regions.js";
/** Re-exported API for src/plugin-sdk. */
export {
  stripReasoningTagsFromText,
  type ReasoningTagMode,
  type ReasoningTagTrim,
} from "../shared/text/reasoning-tags.js";
/** Re-exported API for src/plugin-sdk, starting with strip Markdown. */
export { stripMarkdown } from "../shared/text/strip-markdown.js";
export { sanitizeTerminalText } from "../../packages/terminal-core/src/safe-text.js";
export { SYSTEM_MARK, hasSystemMark, prefixSystemMessage } from "../infra/system-message.ts";
/** Re-exported API for src/plugin-sdk. */
export {
  stripInlineDirectiveTagsForDelivery,
  stripInlineDirectiveTagsForDisplay,
  stripInlineDirectiveTagsFromMessageForDisplay,
  type DisplayMessageWithContent,
  type InlineDirectiveParseResult,
} from "../utils/directive-tags.js";
/** Re-exported API for src/plugin-sdk, starting with chunk Items. */
export { chunkItems } from "../utils/chunk-items.js";
