/** Test helpers for minimal agent tool stubs. */
import { Type } from "typebox";
import type { AgentTool, AgentToolResult } from "../runtime/index.js";

/** Creates a no-op tool with a stable name. */
export function createStubTool(name: string): AgentTool {
  return {
    name,
    label: name,
    description: "",
    parameters: Type.Object({}),
    execute: async () => ({}) as AgentToolResult<unknown>,
  };
}
