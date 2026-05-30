// Applies OpenClaw styling to Clack select prompt parameter objects.
import { stylePromptHint, stylePromptMessage } from "./prompt-style.js";

type SelectParamsLike = {
  message: string;
  options: readonly object[];
};

type PromptSelectStylers = {
  message: (value: string) => string;
  hint: (value: string) => string | undefined;
};

const defaultStylers: PromptSelectStylers = {
  message: stylePromptMessage,
  hint: stylePromptHint,
};

/** Return select prompt params with styled message and option hints. */
export function styleSelectParams<TParams extends SelectParamsLike>(
  params: TParams,
  stylers: PromptSelectStylers = defaultStylers,
): TParams {
  return {
    ...params,
    message: stylers.message(params.message),
    options: params.options.map((opt) => {
      const hint = "hint" in opt && typeof opt.hint === "string" ? opt.hint : undefined;
      return hint === undefined ? opt : { ...opt, hint: stylers.hint(hint) };
    }),
  } as TParams;
}
