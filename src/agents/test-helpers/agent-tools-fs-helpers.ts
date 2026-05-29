/** Assertions shared by agent filesystem tool tests. */
import { expect } from "vitest";

type TextResultBlock = { type: string; text?: string };

/** Extracts the first text block from a tool result. */
export function getTextContent(result?: { content?: TextResultBlock[] }) {
  const textBlock = result?.content?.find((block) => block.type === "text");
  return textBlock?.text ?? "";
}

function expectTool<T extends { name: string }>(tools: T[], name: string): T {
  const tool = tools.find((entry) => entry.name === name);
  if (!tool) {
    throw new Error(`expected tool "${name}" in [${tools.map((entry) => entry.name).join(", ")}]`);
  }
  return tool;
}

/** Asserts a tool list contains read, write, and edit tools. */
export function expectReadWriteEditTools<T extends { name: string }>(tools: T[]) {
  const names = tools.map((tool) => tool.name);
  expect(names).toContain("read");
  expect(names).toContain("write");
  expect(names).toContain("edit");
  return {
    readTool: expectTool(tools, "read"),
    writeTool: expectTool(tools, "write"),
    editTool: expectTool(tools, "edit"),
  };
}

/** Asserts a tool list contains read and write tools. */
export function expectReadWriteTools<T extends { name: string }>(tools: T[]) {
  const names = tools.map((tool) => tool.name);
  expect(names).toContain("read");
  expect(names).toContain("write");
  return {
    readTool: expectTool(tools, "read"),
    writeTool: expectTool(tools, "write"),
  };
}
