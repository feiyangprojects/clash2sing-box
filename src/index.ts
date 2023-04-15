import * as flags from "flags";
import { convert } from "./libs/utils.ts";

const args = flags.parse(Deno.args, {
  string: ["input", "output"],
  default: {
    input: "clash.yaml",
    output: "sing-box.json",
  },
});

Deno.writeFileSync(
  args.output,
  new TextEncoder().encode(convert(Deno.readTextFileSync(args.input))),
);
