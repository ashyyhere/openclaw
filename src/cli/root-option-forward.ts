/** Forwards consumed root options into child command argv arrays. */
import { consumeRootOptionToken } from "../infra/cli-root-options.js";

/** Reused helper for forward Consumed Cli Root Option behavior in src/cli. */
export function forwardConsumedCliRootOption(
  args: readonly string[],
  index: number,
  out: string[],
): number {
  const consumedRootOption = consumeRootOptionToken(args, index);
  if (consumedRootOption <= 0) {
    return 0;
  }

  for (let offset = 0; offset < consumedRootOption; offset += 1) {
    const token = args[index + offset];
    if (token !== undefined) {
      out.push(token);
    }
  }

  return consumedRootOption;
}
