import { InvalidArgumentError, type Command } from "commander";
import { parseStrictPositiveInteger } from "../../infra/parse-finite-number.js";

/** Commander collector for repeatable string options. */
export function collectOption(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

/** Parse optional positive integers while preserving omitted values as undefined. */
export function parsePositiveIntOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return parseStrictPositiveInteger(value);
}

/** Strictly parse a positive integer or return undefined for invalid input. */
export function parseStrictPositiveIntOrUndefined(value: unknown): number | undefined {
  return parseStrictPositiveInteger(value);
}

/** Commander parser that reports invalid positive integers as option errors. */
export function parseStrictPositiveIntOption(value: string, flag: string): number {
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === undefined) {
    throw new InvalidArgumentError(`${flag} must be a positive integer.`);
  }
  return parsed;
}

/** Read Commander action args from a command object without depending on private types. */
export function resolveActionArgs(actionCommand?: Command): string[] {
  if (!actionCommand) {
    return [];
  }
  const args = (actionCommand as Command & { args?: string[] }).args;
  return Array.isArray(args) ? args : [];
}

function isDefaultOptionValue(command: Command, name: string): boolean {
  if (typeof command.getOptionValueSource !== "function") {
    return false;
  }
  return command.getOptionValueSource(name) === "default";
}

function appendOptionValue(out: string[], flag: string, value: unknown): void {
  if (value === undefined) {
    return;
  }
  if (value === false) {
    if (flag.startsWith("--no-")) {
      out.push(flag);
    }
    return;
  }
  if (value === true) {
    out.push(flag);
    return;
  }
  const arg = stringifyOptionValue(value);
  if (arg !== undefined) {
    out.push(flag, arg);
  }
}

function stringifyOptionValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  return undefined;
}

/** Reconstruct explicitly supplied option argv so lazy commands can reparse faithfully. */
export function resolveCommandOptionArgs(command?: Command): string[] {
  if (!command) {
    return [];
  }
  const out: string[] = [];
  for (const option of command.options) {
    const name = option.attributeName();
    if (isDefaultOptionValue(command, name)) {
      continue;
    }
    const flag = option.long ?? option.short;
    if (!flag) {
      continue;
    }
    const value = command.getOptionValue(name);
    if (Array.isArray(value)) {
      for (const item of value) {
        appendOptionValue(out, flag, item);
      }
      continue;
    }
    appendOptionValue(out, flag, value);
  }
  return out;
}
