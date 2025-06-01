# Clash2sing-box

## About

### Features

#### Protocols

|Name|Status|Note|
|---|---|---|
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

## Usage

```shell
$ deno run --import-map=https://raw.githubusercontent.com/feiyangprojects/clash2sing-box/main/import_map.json \
           https://raw.githubusercontent.com/feiyangprojects/clash2sing-box/main/src/index.ts \
           --help
Usage: clash2sing-box [OPTION]... INPUT OUTPUT

Options:
  --experimental-cachefile-enabled <boolean>        Enable cache file feature
  --experimental-cachefile-path <file>              Set path of cache file feature
  --experimental-cachefile-cacheid <string>         Set cache id of cache file feature
  --experimental-clashapi-externalcontroller <url>  Set external controller address of Clash API feature, empty to disable
  --experimental-clashapi-externalui <directory>    Set external UI path of Clash API feature
  --experimental-clashapi-secret <string>           Set authorization secret of Clash API feature
  --outbound-selector-default <number>              Set the n-th of outbound as the default of selector outbound, will ignore for invalid number
  --outbound-selector-tag <string>                  Set the name of selector outbound
  --merge-with <file>                               Set external configuration to merge after conversion
  -h, -?, --help                                    Display usage information
```

### Install Deno

- BSD/Linux/macOS: find more information on [repology.org](https://repology.org/project/deno/versions)
- Windows: `winget install DenoLand.Deno`

### Convert Configuration

```shell
           # Grant read permission to input (and mergeable) configuration
$ deno run --allow-read=./src/tests/clash.yaml,./src/tests/sing-box-mergeable.json \
           # Grant write permission to output configuration
           --allow-write=./src/tests/sing-box.json \
           # Use custom import map
           # this is a fairly complex project, it allows easier module management.
           --import-map=https://raw.githubusercontent.com/feiyangprojects/clash2sing-box/main/import_map.json \
           # Point to software entry
           https://raw.githubusercontent.com/feiyangprojects/clash2sing-box/main/src/index.ts \
           # Mergeable injection is optional
           --merge-with ./src/tests/sing-box-mergeable.json \
           # Set input and output configuration file
           ./src/tests/clash.yaml ./src/tests/sing-box.json
$ ls ./src/tests/
clash.yaml  sing-box.json  sing-box-mergeable.json
```
