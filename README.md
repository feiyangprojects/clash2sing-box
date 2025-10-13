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

```shell
$ deno run jsr:@fei1yang/clash2sing-box convert --help
Usage: clash2sing-box convert <input> <output>

Description:

  Convert configuration

Options:

  -h, --help                                                - Show this help.                                                                                                     
  --experimental.cachefile.enabled               <boolean>  - Enable cache file feature                                                                                           
  --experimental.cachefile.path                  <path>     - Path to the cache file                                         (Depends: --experimental.cachefile.path)             
  --experimental.cachefile.cacheid               <string>   - Identifier for the configuration                               (Depends: --experimental.cachefile.path)             
  --experimental.clashapi.externalcontroller     <address>  - Clash API listening address                                                                                         
  --experimental.clashapi.externalui             <path>     - Path to a directory in which the external UI is stored         (Depends: --experimental.clashapi.externalcontroller)
  --experimental.clashapi.externaluidownloadurl  <url>      - URL to a ZIP to download the external UI                       (Depends: --experimental.clashapi.externalcontroller)
  --experimental.clashapi.secret                 <string>   - A Bearer token for API Authorization                           (Depends: --experimental.clashapi.externalcontroller)
  --outbound.selector.default                    <integer>  - Use the n-th outbound as the default in the selector outbound                                                       
  --outbound.selector.tag                        <string>   - The name(s) of the selector outbound(s)                                                                             
  --mergeable                                    <path>     - External configuration to merge after the conversion     
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
           # Point to software entry and preform conversion
           jsr:@fei1yang/clash2sing-box convert \
           # Mergeable injection is optional
           --mergeable ./src/tests/sing-box-mergeable.json \
           # Set input and output configuration file
           ./src/tests/clash.yaml ./src/tests/sing-box.json
$ ls ./src/tests/
clash.yaml  sing-box.json  sing-box-mergeable.json
```
