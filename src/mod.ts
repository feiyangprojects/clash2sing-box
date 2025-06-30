import { Command, ValidationError } from "@cliffy/command";
import * as yaml from "yaml";

import { convert, merge } from "./libs/utils.ts";

await new Command()
  .name("clash2sing-box")
  .description("Clash to sing-box configuration converter")
  .command("convert <input:string> <output:string>", "Convert configuration")
  .option(
    "--experimental.cachefile.enabled <boolean:boolean>",
    "Enable cache file feature",
  )
  .option(
    "--experimental.cachefile.path <path:string>",
    "Path to the cache file",
    { depends: ["experimental.cachefile.path"] },
  )
  .option(
    "--experimental.cachefile.cacheid <string:string>",
    "Identifier for the configuration",
    { depends: ["experimental.cachefile.path"] },
  )
  .option(
    "--experimental.clashapi.externalcontroller <address:string>",
    "Clash API listening address",
  )
  .option(
    "--experimental.clashapi.externalui <path:string>",
    "Path to a directory in which the external UI is stored",
    { depends: ["experimental.clashapi.externalcontroller"] },
  )
  .option(
    "--experimental.clashapi.externaluidownloadurl <url:string>",
    "URL to a ZIP to download the external UI",
    { depends: ["experimental.clashapi.externalcontroller"] },
  )
  .option(
    "--experimental.clashapi.secret <string:string>",
    "A Bearer token for API Authorization",
    { depends: ["experimental.clashapi.externalcontroller"] },
  )
  .option(
    "--outbound.selector.default <integer:integer>",
    "Use the n-th outbound as the default in the selector outbound",
  )
  .option(
    "--outbound.selector.tag <string:string[]>",
    "The name(s) of the selector outbound(s)",
  )
  .option(
    "--mergeable <path:string>",
    "External configuration to merge after the conversion",
    (value: string): { value: object } => {
      try {
        return { value: JSON.parse(Deno.readTextFileSync(value)) };
      } catch (_) {
        throw new ValidationError("Invalid mergeable file");
      }
    },
  )
  .action((options, input, output) => {
    Deno.writeTextFileSync(
      output,
      convert(yaml.parse(Deno.readTextFileSync(input)), options),
    );
  })
  .command("merge <input...:string>", "Merge multiple JSON files")
  .action((_, ...input) => {
    console.log(
      merge(...input.map((i) => JSON.parse(Deno.readTextFileSync(i)))),
    );
  })
  .parse(Deno.args);
