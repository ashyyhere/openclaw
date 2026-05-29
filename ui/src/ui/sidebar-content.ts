// Sidebar content model for markdown notes and canvas embeds.
/** Markdown sidebar content rendered from a text payload. */
export type MarkdownSidebarContent = {
  kind: "markdown";
  content: string;
  rawText?: string | null;
};

/** Canvas sidebar content rendered from a gateway document entry URL. */
export type CanvasSidebarContent = {
  kind: "canvas";
  docId: string;
  title?: string;
  entryUrl: string;
  preferredHeight?: number;
  rawText?: string | null;
};

/** Union of supported sidebar content payloads. */
export type SidebarContent = MarkdownSidebarContent | CanvasSidebarContent;
