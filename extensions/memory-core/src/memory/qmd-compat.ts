// extensions/memory-core/src/memory qmd compat helpers and runtime behavior.
export type QmdCollectionPatternFlag = "--glob" | "--mask";

export function resolveQmdCollectionPatternFlags(
  preferredFlag: QmdCollectionPatternFlag | null,
): QmdCollectionPatternFlag[] {
  return preferredFlag === "--glob" ? ["--glob", "--mask"] : ["--mask", "--glob"];
}
