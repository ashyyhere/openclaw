// Styled wrapper for Clack select prompts.
import { select } from "@clack/prompts";
import { styleSelectParams } from "./prompt-select-styled-params.js";

/** Run a Clack select prompt after applying OpenClaw prompt styling defaults. */
export function selectStyled<T>(params: Parameters<typeof select<T>>[0]) {
  return select(styleSelectParams(params));
}
