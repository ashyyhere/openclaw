/** Matches CLI command paths against exact and prefix policy rules. */
type StructuredCommandPathMatchRule = {
  pattern: readonly string[];
  exact?: boolean;
};

type CommandPathMatchRule = readonly string[] | StructuredCommandPathMatchRule;

type NormalizedCommandPathMatchRule = {
  pattern: readonly string[];
  exact: boolean;
};

function isStructuredCommandPathMatchRule(
  rule: CommandPathMatchRule,
): rule is StructuredCommandPathMatchRule {
  return !Array.isArray(rule);
}

function normalizeCommandPathMatchRule(rule: CommandPathMatchRule): NormalizedCommandPathMatchRule {
  if (!isStructuredCommandPathMatchRule(rule)) {
    return { pattern: rule, exact: false };
  }
  return { pattern: rule.pattern, exact: rule.exact ?? false };
}

/** Reused helper for matches Command Path behavior in src/cli. */
export function matchesCommandPath(
  commandPath: string[],
  pattern: readonly string[],
  params?: { exact?: boolean },
): boolean {
  if (pattern.some((segment, index) => commandPath[index] !== segment)) {
    return false;
  }
  return !params?.exact || commandPath.length === pattern.length;
}

/** Reused helper for matches Command Path Rule behavior in src/cli. */
export function matchesCommandPathRule(commandPath: string[], rule: CommandPathMatchRule): boolean {
  const normalizedRule = normalizeCommandPathMatchRule(rule);
  return matchesCommandPath(commandPath, normalizedRule.pattern, {
    exact: normalizedRule.exact,
  });
}

/** Reused helper for matches Any Command Path behavior in src/cli. */
export function matchesAnyCommandPath(
  commandPath: string[],
  rules: readonly CommandPathMatchRule[],
): boolean {
  return rules.some((rule) => matchesCommandPathRule(commandPath, rule));
}
