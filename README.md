# Clash2sing-box

## About

### Features

#### Protocols

|Name|Status|Note|
|---|---|---|
|AnyTLS|O||
|HTTP|O|sing-box limitation: layer tls not supported|
|Hysteria|O|sing-box limitation: protocol faketcp or wechat-video not supported|
|Shadowsocks|O||
|Socks|O||
|Trojan|?|Trojan-Go features not implemented|
|TUIC|O||
|Vmess|O|sing-box limitation: protocol tcp not supported|
|VLESS|O|sing-box limitation: protocol tcp not supported|

#### Options

|Name|Status|Note|
|---|---|---|
|TCP-only|O||
|IP Version|?|Only option `ip-version` is implemented|
|TLS Certificate Pinning|?|Implemented via proprietary option `x-clash2singbox-certificate`|
|TLS Certificate Public Key Pinning|?|Implemented via proprietary option `x-clash2singbox-certificate-public-key-sha256`|

## Usage

> Merge subcommand

`deno run jsr:@fei1yang/clash2sing-box merge INPUT...`

> Convert subcommand

`deno run jsr:@fei1yang/clash2sing-box convert [OPTION]... INPUT OUTPUT`

|Option|Type|Description|
|---|---|---|
|--experimental.cachefile.enabled|boolean|Enable cache file feature|
|--experimental.cachefile.path|path|Path to the cache file. depends on: --experimental.cachefile.path|
|--experimental.cachefile.storefakeip|boolean|Store fakeip in the cache file. depends on: --experimental.cachefile.path|
|--experimental.cachefile.storerdrc|boolean|Store rejected DNS response cache in the cache file. depends on: --experimental.cachefile.path|
|--experimental.cachefile.cacheid|string|Identifier for the configuration. depends on: --experimental.cachefile.path|
|--experimental.clashapi.externalcontroller|address|Clash API listening address|
|--experimental.clashapi.externalui|path|Path to a directory in which the external UI is stored. depends on: --experimental.clashapi.externalcontroller|
|--experimental.clashapi.externaluidownloadurl|url|URL to a ZIP to download the external UI. depends on: --experimental.clashapi.externalcontroller|
|--experimental.clashapi.secret|string|A Bearer token for API Authorization. depends on: --experimental.clashapi.externalcontroller|
|--outbound.domainresolver.tag|string|The name of the domain resolver, required for setting resolver strategy|
|--outbound.selector.default|string|Use the n-th outbound as the default in the selector outbound(s)|
|--outbound.selector.filter|string|The RegExp filter(s) of the selector outbound(s). depends on: --outbound.selector.tag|
|--outbound.selector.tag|string|The name(s) of the selector outbound(s)|
|--mergeable|path|External configuration to merge after the conversion|

### Install Deno

- BSD/Linux/macOS: find more information on [repology.org](https://repology.org/project/deno/versions)
- Windows: `winget install DenoLand.Deno`

### Convert Configuration

In this example, we grant file read and write permissions to this program, convert `./src/tests/clash.yaml` to `./src/tests/sing-box.json` and merged `./src/tests/sing-box-mergeable.json` into it.

```shell
$ deno run --allow-read=./src/tests/clash.yaml,./src/tests/sing-box-mergeable.json \
           --allow-write=./src/tests/sing-box.json \
           jsr:@fei1yang/clash2sing-box convert \
           --mergeable ./src/tests/sing-box-mergeable.json \
           ./src/tests/clash.yaml ./src/tests/sing-box.json
$ ls ./src/tests/
clash.yaml  sing-box.json  sing-box-mergeable.json
```
