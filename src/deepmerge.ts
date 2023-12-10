import { deepmerge } from "deepmerge-ts";

const objects = Deno.args.map((i) => JSON.parse(Deno.readTextFileSync(i)));
console.log(JSON.stringify(deepmerge(...objects), null, 4));