// tui/components assistant message helpers and runtime behavior.
import { Container, Spacer } from "@earendil-works/pi-tui";
import { markdownTheme, theme } from "../theme/theme.js";
import { HyperlinkMarkdown } from "./hyperlink-markdown.js";

/** Reused class for Assistant Message Component behavior in src/tui/components. */
export class AssistantMessageComponent extends Container {
  private body: HyperlinkMarkdown;

  constructor(text: string) {
    super();
    this.body = new HyperlinkMarkdown(text, 0, 0, markdownTheme, {
      // Keep assistant body text in terminal default foreground so contrast
      // follows the user's terminal theme (dark or light).
      color: (line) => theme.assistantText(line),
    });
    this.addChild(new Spacer(1));
    this.addChild(this.body);
  }

  setText(text: string) {
    this.body.setText(text);
  }
}
