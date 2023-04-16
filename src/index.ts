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
const args = flags_usage.parseFlags(Deno.args, options);

if (
  args.help === undefined &&
  (args.input !== undefined && args.output !== undefined)
) {
  const encoder = new TextEncoder();
  let output;
  if (args["merge-with"] !== undefined) {
    output = encoder.encode(
      convert(
        Deno.readTextFileSync(args.input),
        Deno.readTextFileSync(args["merge-with"]!),
      ),
    );
  } else {
    output = encoder.encode(convert(Deno.readTextFileSync(args.input), "{}"));
  }
  Deno.writeFileSync(args.output, output);
} else {
  flags_usage.logUsage(options);
}
