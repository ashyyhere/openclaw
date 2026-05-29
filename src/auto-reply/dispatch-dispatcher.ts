// Reply dispatcher helpers that settle queued delivery work around inbound handling.
import type { ReplyDispatcher } from "./reply/reply-dispatcher.types.js";

/** Wait for pending dispatcher work to settle and surface delivery failures. */
export async function settleReplyDispatcher(params: {
  dispatcher: ReplyDispatcher;
  onSettled?: () => void | Promise<void>;
}): Promise<void> {
  params.dispatcher.markComplete();
  try {
    await params.dispatcher.waitForIdle();
  } finally {
    await params.onSettled?.();
  }
}

/** Run a handler and then settle the dispatcher it used. */
export async function withReplyDispatcher<T>(params: {
  dispatcher: ReplyDispatcher;
  run: () => Promise<T>;
  onSettled?: () => void | Promise<void>;
}): Promise<T> {
  try {
    return await params.run();
  } finally {
    await settleReplyDispatcher(params);
  }
}
