// Queue overflow, debounce, and drain helpers shared by channel/runtime batching code.
/** Mutable summary state used when a capped queue drops old items and preserves a compact prompt. */
export type QueueSummaryState = {
  dropPolicy: "summarize" | "old" | "new";
  droppedCount: number;
  summaryLines: string[];
};

/** Queue overflow strategy: summarize old drops, drop old silently, or reject new items. */
export type QueueDropPolicy = QueueSummaryState["dropPolicy"];

/** Generic capped queue state with optional overflow summaries. */
export type QueueState<T> = QueueSummaryState & {
  items: T[];
  cap: number;
};

/** Clears accumulated overflow summary state after it has been emitted. */
export function clearQueueSummaryState(state: QueueSummaryState): void {
  state.droppedCount = 0;
  state.summaryLines = [];
}

/** Builds an overflow summary prompt without mutating the live queue state. */
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

/** Applies runtime queue settings while clamping debounce/cap values to usable ranges. */
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

/** Truncates queue summary text to a compact single-line display. */
export function elideQueueText(text: string, limit = 140): string {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

/** Normalizes whitespace and elides one dropped queue item summary line. */
export function buildQueueSummaryLine(text: string, limit = 160): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return elideQueueText(cleaned, limit);
}

/** Runs optional queue dedupe logic before enqueueing a new item. */
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

/** Enforces queue capacity and records summaries for items dropped by the selected policy. */
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

/** Waits until no newer item has arrived within the queue debounce window. */
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

/** Marks one keyed queue as draining and returns it, or skips when missing/already draining. */
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

/** Runs and removes the next queued item, returning whether anything was drained. */
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

/** Drains one item individually when collect-mode is forced or cross-channel items require it. */
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

/** Updates collect drain state and delegates one optional individual drain step. */
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

/** Emits and clears a prompt summarizing dropped queue items. */
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

/** Builds the prompt for a batch of collected queue items. */
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

/** Detects whether queued items span multiple routing keys or explicitly mark cross-channel state. */
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
