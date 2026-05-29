// ui/src/ui sidebar content helpers and runtime behavior.
/** Shared type for Markdown Sidebar Content in ui/src/ui. */
export type MarkdownSidebarContent = {
  kind: "markdown";
  content: string;
  rawText?: string | null;
};

/** Shared type for Canvas Sidebar Content in ui/src/ui. */
export type CanvasSidebarContent = {
  kind: "canvas";
  docId: string;
  title?: string;
  entryUrl: string;
  preferredHeight?: number;
  rawText?: string | null;
};

/** Shared type for Sidebar Content in ui/src/ui. */
export type SidebarContent = MarkdownSidebarContent | CanvasSidebarContent;
