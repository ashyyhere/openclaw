// Lit reactive controller that refreshes components after locale changes.
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { i18n } from "./translate.ts";

/** Subscribes a Lit host to the shared i18n manager for locale-change updates. */
export class I18nController implements ReactiveController {
  private host: ReactiveControllerHost;
  private unsubscribe?: () => void;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    this.unsubscribe = i18n.subscribe(() => {
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.unsubscribe?.();
  }
}
