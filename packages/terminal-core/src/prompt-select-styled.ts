// terminal prompt select styled helpers and runtime behavior.
import { select } from "@clack/prompts";
import { styleSelectParams } from "./prompt-select-styled-params.js";

/** Reused helper for select Styled behavior in src/terminal. */
export function selectStyled<T>(params: Parameters<typeof select<T>>[0]) {
  return select(styleSelectParams(params));
}
