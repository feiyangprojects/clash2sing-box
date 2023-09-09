# Clash2sing-box

## About

### Features

|Protocol|Status|Note|
|---|---|---|
|HTTP|O|sing-box limitation: layer tls not supported|
|Hysteria|O|sing-box limitation: protocol faketcp or wechat-video not supported|
|Shadowsocks|O||
|Socks|O||
|Trojan|O|Trojan-Go features not implemented|
|TUIC|O||
|Vmess|O|sing-box limitation: protocol tcp not supported|

## Usage

```shell
$ deno run --import-map=https://raw.githubusercontent.com/feiyangprojects/clash2sing-box/main/import_map.json \
           https://raw.githubusercontent.com/feiyangprojects/clash2sing-box/main/src/index.ts \
           --help
Usage: clash2sing-box [OPTION]...

Options:
  --input <file>       Set Clash configuration file
  --output <file>      Set sing-box configuration file
  --merge-with <file>  Set external configuration to merge after conversion
  -h, -?, --help       Display usage information
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
           # Set Clash configuration file
           --input ./src/tests/clash.yaml \
           # Set sing-box configuration file
           --output ./src/tests/sing-box.json \
           # Mergeable injection is optional
           --merge-with ./src/tests/sing-box-mergeable.json
$ ls ./src/tests/
clash.yaml  sing-box.json  sing-box-mergeable.json
```
