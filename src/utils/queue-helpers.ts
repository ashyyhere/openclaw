// utils queue helpers helpers and runtime behavior.
/** Shared type for Queue Summary State in src/utils. */
export type QueueSummaryState = {
  dropPolicy: "summarize" | "old" | "new";
  droppedCount: number;
  summaryLines: string[];
};

/** Shared type for Queue Drop Policy in src/utils. */
export type QueueDropPolicy = QueueSummaryState["dropPolicy"];

/** Shared type for Queue State in src/utils. */
export type QueueState<T> = QueueSummaryState & {
  items: T[];
  cap: number;
};

/** Reused helper for clear Queue Summary State behavior in src/utils. */
export function clearQueueSummaryState(state: QueueSummaryState): void {
  state.droppedCount = 0;
  state.summaryLines = [];
}

/** Reused helper for preview Queue Summary Prompt behavior in src/utils. */
export function previewQueueSummaryPrompt(params: {
  state: QueueSummaryState;
  noun: string;
  title?: string;
}): string | undefined {
  return buildQueueSummaryPrompt({
    state: {
      dropPolicy: params.state.dropPolicy,
      droppedCount: params.state.droppedCount,
      summaryLines: [...params.state.summaryLines],
    },
    noun: params.noun,
    title: params.title,
  });
}

/** Reused helper for apply Queue Runtime Settings behavior in src/utils. */
export function applyQueueRuntimeSettings<TMode extends string>(params: {
  target: {
    mode: TMode;
    debounceMs: number;
    cap: number;
    dropPolicy: QueueDropPolicy;
  };
  settings: {
    mode: TMode;
    debounceMs?: number;
    cap?: number;
    dropPolicy?: QueueDropPolicy;
  };
}): void {
  params.target.mode = params.settings.mode;
  params.target.debounceMs =
    typeof params.settings.debounceMs === "number"
      ? Math.max(0, params.settings.debounceMs)
      : params.target.debounceMs;
  params.target.cap =
    typeof params.settings.cap === "number" && params.settings.cap > 0
      ? Math.floor(params.settings.cap)
      : params.target.cap;
  params.target.dropPolicy = params.settings.dropPolicy ?? params.target.dropPolicy;
}

/** Reused helper for elide Queue Text behavior in src/utils. */
export function elideQueueText(text: string, limit = 140): string {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

/** Reused helper for build Queue Summary Line behavior in src/utils. */
export function buildQueueSummaryLine(text: string, limit = 160): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return elideQueueText(cleaned, limit);
}

/** Reused helper for should Skip Queue Item behavior in src/utils. */
export function shouldSkipQueueItem<T>(params: {
  item: T;
  items: T[];
  dedupe?: (item: T, items: T[]) => boolean;
}): boolean {
  if (!params.dedupe) {
    return false;
  }
  return params.dedupe(params.item, params.items);
}

/** Reused helper for apply Queue Drop Policy behavior in src/utils. */
export function applyQueueDropPolicy<T>(params: {
  queue: QueueState<T>;
  summarize: (item: T) => string;
  summaryLimit?: number;
  onDrop?: (items: T[]) => void;
}): boolean {
  const cap = params.queue.cap;
  if (cap <= 0 || params.queue.items.length < cap) {
    return true;
  }
  if (params.queue.dropPolicy === "new") {
    return false;
  }
  const dropCount = params.queue.items.length - cap + 1;
  const dropped = params.queue.items.splice(0, dropCount);
  params.onDrop?.(dropped);
  if (params.queue.dropPolicy === "summarize") {
    for (const item of dropped) {
      params.queue.droppedCount += 1;
      params.queue.summaryLines.push(buildQueueSummaryLine(params.summarize(item)));
    }
    const limit = Math.max(0, params.summaryLimit ?? cap);
    while (params.queue.summaryLines.length > limit) {
      params.queue.summaryLines.shift();
    }
  }
  return true;
}

/** Reused helper for wait For Queue Debounce behavior in src/utils. */
export function waitForQueueDebounce(queue: {
  debounceMs: number;
  lastEnqueuedAt: number;
}): Promise<void> {
  if (process.env.OPENCLAW_TEST_FAST === "1") {
    return Promise.resolve();
  }
  const debounceMs = Math.max(0, queue.debounceMs);
  if (debounceMs <= 0) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    const check = () => {
      const since = Date.now() - queue.lastEnqueuedAt;
      if (since >= debounceMs) {
        resolve();
        return;
      }
      setTimeout(check, debounceMs - since);
    };
    check();
  });
}

/** Reused helper for begin Queue Drain behavior in src/utils. */
export function beginQueueDrain<T extends { draining: boolean }>(
  map: Map<string, T>,
  key: string,
): T | undefined {
  const queue = map.get(key);
  if (!queue || queue.draining) {
    return undefined;
  }
  queue.draining = true;
  return queue;
}

/** Reused helper for drain Next Queue Item behavior in src/utils. */
export async function drainNextQueueItem<T>(
  items: T[],
  run: (item: T) => Promise<void>,
): Promise<boolean> {
  const next = items[0];
  if (!next) {
    return false;
  }
  await run(next);
  items.shift();
  return true;
}

/** Reused helper for drain Collect Item If Needed behavior in src/utils. */
export async function drainCollectItemIfNeeded<T>(params: {
  forceIndividualCollect: boolean;
  isCrossChannel: boolean;
  setForceIndividualCollect?: (next: boolean) => void;
  items: T[];
  run: (item: T) => Promise<void>;
}): Promise<"skipped" | "drained" | "empty"> {
  if (!params.forceIndividualCollect && !params.isCrossChannel) {
    return "skipped";
  }
  if (params.isCrossChannel) {
    params.setForceIndividualCollect?.(true);
  }
  const drained = await drainNextQueueItem(params.items, params.run);
  return drained ? "drained" : "empty";
}

/** Reused helper for drain Collect Queue Step behavior in src/utils. */
export async function drainCollectQueueStep<T>(params: {
  collectState: { forceIndividualCollect: boolean };
  isCrossChannel: boolean;
  items: T[];
  run: (item: T) => Promise<void>;
}): Promise<"skipped" | "drained" | "empty"> {
  return await drainCollectItemIfNeeded({
    forceIndividualCollect: params.collectState.forceIndividualCollect,
    isCrossChannel: params.isCrossChannel,
    setForceIndividualCollect: (next) => {
      params.collectState.forceIndividualCollect = next;
    },
    items: params.items,
    run: params.run,
  });
}

/** Reused helper for build Queue Summary Prompt behavior in src/utils. */
export function buildQueueSummaryPrompt(params: {
  state: QueueSummaryState;
  noun: string;
  title?: string;
}): string | undefined {
  if (params.state.dropPolicy !== "summarize" || params.state.droppedCount <= 0) {
    return undefined;
  }
  const noun = params.noun;
  const title =
    params.title ??
    `[Queue overflow] Dropped ${params.state.droppedCount} ${noun}${params.state.droppedCount === 1 ? "" : "s"} due to cap.`;
  const lines = [title];
  if (params.state.summaryLines.length > 0) {
    lines.push("Summary:");
    for (const line of params.state.summaryLines) {
      lines.push(`- ${line}`);
    }
  }
  clearQueueSummaryState(params.state);
  return lines.join("\n");
}

/** Reused helper for build Collect Prompt behavior in src/utils. */
export function buildCollectPrompt<T>(params: {
  title: string;
  items: T[];
  summary?: string;
  renderItem: (item: T, index: number) => string;
}): string {
  const blocks: string[] = [params.title];
  if (params.summary) {
    blocks.push(params.summary);
  }
  params.items.forEach((item, idx) => {
    blocks.push(params.renderItem(item, idx));
  });
  return blocks.join("\n\n");
}

/** Reused helper for has Cross Channel Items behavior in src/utils. */
export function hasCrossChannelItems<T>(
  items: T[],
  resolveKey: (item: T) => { key?: string; cross?: boolean },
): boolean {
  const keys = new Set<string>();

  for (const item of items) {
    const resolved = resolveKey(item);
    if (resolved.cross) {
      return true;
    }
    if (!resolved.key) {
      continue;
    }
    keys.add(resolved.key);
  }

  return keys.size > 1;
}
