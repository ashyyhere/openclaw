// tui/components btw inline message helpers and runtime behavior.
import { Container, Spacer, Text } from "@earendil-works/pi-tui";
import { theme } from "../theme/theme.js";
import { AssistantMessageComponent } from "./assistant-message.js";

type BtwInlineMessageParams = {
  question: string;
  text: string;
  isError?: boolean;
};

/** Reused class for Btw Inline Message behavior in src/tui/components. */
export class BtwInlineMessage extends Container {
  constructor(params: BtwInlineMessageParams) {
    super();
    this.setResult(params);
  }

  setResult(params: BtwInlineMessageParams) {
    this.clear();
    this.addChild(new Spacer(1));
    this.addChild(new Text(theme.header(`BTW: ${params.question}`), 1, 0));
    if (params.isError) {
      this.addChild(new Text(theme.error(params.text), 1, 0));
    } else {
      this.addChild(new AssistantMessageComponent(params.text));
    }
    this.addChild(new Text(theme.dim("Press Enter or Esc to dismiss"), 1, 0));
  }
}
