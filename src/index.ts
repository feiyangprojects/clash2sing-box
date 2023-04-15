import * as flags from "flags";
import { convert } from "./libs/utils.ts";

const args = flags.parse(Deno.args, {
  string: ["input", "output", "merge-with"],
  default: {
    input: "clash.yaml",
    output: "sing-box.json",
  },
});

if (args["merge-with"] !== undefined) {
  Deno.writeFileSync(
    args.output,
    new TextEncoder().encode(
      convert(Deno.readTextFileSync(args.input), Deno.readTextFileSync(args["merge-with"]!)),
    ),
  );
  
} else {
  Deno.writeFileSync(
    args.output,
    new TextEncoder().encode(
      convert(Deno.readTextFileSync(args.input)),
    ),
  );
}


