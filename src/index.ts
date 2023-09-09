import * as flags_usage from "flags_usage";
import { convert } from "./libs/utils.ts";

const options = {
  preamble: "Usage: clash2sing-box [OPTION]...",
  description: {
    input: "Set Clash configuration file",
    output: "Set sing-box configuration file",
    "merge-with": "Set external configuration to merge after conversion",
  },
  argument: {
    input: "file",
    output: "file",
    "merge-with": "file",
  },
  string: ["input", "output", "merge-with"],
};
const flags = flags_usage.processFlags(Deno.args, options);

if (flags.input !== undefined && flags.output !== undefined) {
  const encoder = new TextEncoder();
  
  const args: [string, string] = [
    Deno.readTextFileSync(flags.input),
    flags["merge-with"] !== undefined
      ? Deno.readTextFileSync(flags["merge-with"]!)
      : "{}",
  ];

  Deno.writeFileSync(flags.output, encoder.encode(convert(...args)));
} else {
  flags_usage.logUsage(options);
}
