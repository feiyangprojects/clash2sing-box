import * as flags_usage from "flags_usage";
import { convert } from "./libs/utils.ts";

const options = {
  preamble: "Usage: clash2sing-box [OPTION]... INPUT OUTPUT",
  description: {
    "experimental-cachefile-enabled": "Enable cache file feature",
    "experimental-cachefile-path": "Set path of cache file feature",
    "experimental-cachefile-cacheid": "Set cache id of cache file feature",
    "experimental-clashapi-externalcontroller":
      "Set external controller address of Clash API feature, empty to disable",
    "experimental-clashapi-externalui":
      "Set external UI path of Clash API feature",
    "experimental-clashapi-secret":
      "Set authorization secret of Clash API feature",
    "outbound-selector-default":
      "Set the n-th of outbound as the default of selector outbound, will ignore for invalid number",
    "outbound-selector-tag": "Set the name of selector outbound",
    "merge-with": "Set external configuration to merge after conversion",
  },
  argument: {
    "experimental-cachefile-enabled": "boolean",
    "experimental-cachefile-path": "file",
    "experimental-cachefile-cacheid": "string",
    "experimental-clashapi-externalcontroller": "url",
    "experimental-clashapi-externalui": "directory",
    "experimental-clashapi-secret": "string",
    "outbound-selector-default": "number",
    "outbound-selector-tag": "string",
    "merge-with": "file",
  },
  boolean: ["experimental-cachefile-enabled"],
  string: [
    "experimental-cachefile-path",
    "experimental-cachefile-cacheid",
    "experimental-clashapi-externalcontroller",
    "experimental-clashapi-externalui",
    "experimental-clashapi-secret",
    "outbound-selector-default",
    "outbound-selector-tag",
    "merge-with",
  ],
};
const flags = flags_usage.processFlags(Deno.args, options);

if (typeof flags._[0] === "string" && typeof flags._[1] === "string") {
  // Override flags of paths to contents
  if (flags["merge-with"] !== undefined) {
    flags["merge-with"] = Deno.readTextFileSync(flags["merge-with"]!);
  }

  Deno.writeTextFileSync(
    flags._[1],
    convert(Deno.readTextFileSync(flags._[0]), flags),
  );
} else {
  flags_usage.logUsage(options);
  Deno.exit(1);
}
