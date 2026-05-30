// QA Lab CLI metadata entry exposes command descriptors without loading CLI runtime code.
import { definePluginEntry } from "openclaw/plugin-sdk/core";

/** Metadata-only QA Lab plugin entry used by CLI discovery. */
export default definePluginEntry({
  id: "qa-lab",
  name: "QA Lab",
  description: "Private QA automation harness and debugger UI",
  register(api) {
    api.registerCli(() => {}, {
      descriptors: [
        {
          name: "qa",
          description: "Run QA scenarios and launch the private QA debugger UI",
          hasSubcommands: true,
        },
      ],
    });
  },
});
