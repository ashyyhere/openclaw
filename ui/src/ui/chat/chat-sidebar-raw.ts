// ui/src/ui/chat chat sidebar raw helpers and runtime behavior.
import type { SidebarContent } from "../sidebar-content.ts";

function toPlainTextCodeFence(value: string, language = ""): string {
  const fenceHeader = language ? `\`\`\`${language}` : "```";
  return `${fenceHeader}\n${value}\n\`\`\``;
}

/** Reused helper for build Raw Sidebar Content behavior in ui/src/ui/chat. */
export function buildRawSidebarContent(
  content: SidebarContent | null | undefined,
): SidebarContent | null {
  if (!content) {
    return null;
  }
  if (content.kind === "markdown") {
    const rawText = content.rawText ?? content.content;
    return {
      kind: "markdown",
      content: toPlainTextCodeFence(rawText),
      rawText,
    };
  }
  if (content.rawText?.trim()) {
    return {
      kind: "markdown",
      content: toPlainTextCodeFence(content.rawText, "json"),
    };
  }
  return null;
}
