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

/** Matches command-path prefixes, with optional exact-length enforcement. */
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

/** Applies a normalized command-path rule to an argv-derived command path. */
export function matchesCommandPathRule(commandPath: string[], rule: CommandPathMatchRule): boolean {
  const normalizedRule = normalizeCommandPathMatchRule(rule);
  return matchesCommandPath(commandPath, normalizedRule.pattern, {
    exact: normalizedRule.exact,
  });
}

/** Returns true when any command-path rule matches the given command path. */
export function matchesAnyCommandPath(
  commandPath: string[],
  rules: readonly CommandPathMatchRule[],
): boolean {
  return rules.some((rule) => matchesCommandPathRule(commandPath, rule));
}
