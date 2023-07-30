import { z } from "zod";

export const ClashProxyHttp = z.object({
  name: z.string(),
  type: z.literal("http"),
  server: z.string(),
  port: z.number(),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  tls: z.optional(z.boolean()),
  "skip-cert-verify": z.optional(z.boolean()),
  sni: z.optional(z.string()),
});
export const ClashProxyHysteria = z.object({
  name: z.string(),
  type: z.literal("hysteria"),
  server: z.string(),
  port: z.number(),
  "auth-str": z.optional(z.string()),
  obfs: z.optional(z.string()),
  alpn: z.optional(z.array(z.string())),
  protocol: z.enum(["udp", "wechat-video", "faketcp"]),
  up: z.string(),
  down: z.string(),
  sni: z.optional(z.string()),
  tls: z.optional(z.boolean()),
  "skip-cert-verify": z.optional(z.boolean()),
});
export const ClashProxySocks5 = z.object({
  name: z.string(),
  type: z.literal("socks5"),
  server: z.string(),
  port: z.number(),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  tls: z.optional(z.boolean()),
  "skip-cert-verify": z.optional(z.boolean()),
  udp: z.optional(z.boolean()),
});
export const ClashProxyShadowsocks = z.object({
  name: z.string(),
  type: z.literal("ss"),
  server: z.string(),
  port: z.number(),
  cipher: z.enum([
    // Temporary workaround
    "2022-blake3-aes-128-gcm",
    "2022-blake3-aes-256-gcm",
    "2022-blake3-chacha20-poly1305",
    "aes-128-gcm",
    "aes-192-gcm",
    "aes-256-gcm",
    "aes-128-cfb",
    "aes-192-cfb",
    "aes-256-cfb",
    "aes-128-ctr",
    "aes-192-ctr",
    "aes-256-ctr",
    "rc4-md5",
    "chacha20-ietf",
    "xchacha20",
    "chacha20-ietf-poly1305",
    "xchacha20-ietf-poly1305",
  ]),
  password: z.string(),
  udp: z.optional(z.boolean()),
  plugin: z.optional(z.enum(["obfs", "v2ray-plugin"])),
  "plugin-opts": z.optional(z.object({
    mode: z.enum(["http", "tls", "websocket"]),
    tls: z.optional(z.boolean()),
    host: z.optional(z.string()),
    path: z.optional(z.string()),
    mux: z.optional(z.boolean()),
  })),
});
export const ClashProxyTrojan = z.object({
  name: z.string(),
  type: z.literal("trojan"),
  server: z.string(),
  port: z.number(),
  password: z.string(),
  udp: z.optional(z.boolean()),
  sni: z.optional(z.string()),
  alpn: z.optional(z.array(z.string())),
  "skip-cert-verify": z.optional(z.boolean()),
});
export const ClashProxyVmess = z.object({
  name: z.string(),
  type: z.literal("vmess"),
  server: z.string(),
  port: z.number(),
  uuid: z.string(),
  // Temporary workaround
  alterId: z.coerce.number(),
  cipher: z.enum(["aes-128-gcm", "chacha20-poly1305", "auto", "none", "zero"]),
  udp: z.optional(z.boolean()),
  tls: z.optional(z.boolean()),
  "skip-cert-verify": z.optional(z.boolean()),
  servername: z.optional(z.string()),
  network: z.optional(z.enum(["ws", "h2", "http", "grpc"])),
  "ws-opts": z.optional(z.object({
    path: z.optional(z.string()),
    headers: z.optional(z.record(z.string())),
    "max-early-data": z.optional(z.number()),
    "early-data-header-name": z.optional(z.string()),
  })),
  "h2-opts": z.optional(z.object({
    host: z.optional(z.array(z.string())),
    path: z.optional(z.string()),
  })),
  "http-opts": z.optional(z.object({
    method: z.optional(z.string()),
    path: z.optional(z.array(z.string())),
    headers: z.optional(z.record(z.array(z.string()))),
  })),
  "grpc-opts": z.optional(z.object({
    "grpc-service-name": z.optional(z.string()),
  })),
});
export const Clash = z.object({
  proxies: z.array(z.discriminatedUnion("type", [
    ClashProxyHttp,
    ClashProxyHysteria,
    ClashProxyShadowsocks,
    ClashProxySocks5,
    ClashProxyTrojan,
    ClashProxyVmess,
  ])),
});

export type ClashProxyHttp = z.infer<typeof ClashProxyHttp>;
export type ClashProxyHysteria = z.infer<typeof ClashProxyHysteria>;
export type ClashProxyShadowsocks = z.infer<typeof ClashProxyShadowsocks>;
export type ClashProxySocks5 = z.infer<typeof ClashProxySocks5>;
export type ClashProxyTrojan = z.infer<typeof ClashProxyTrojan>;
export type ClashProxyVmess = z.infer<typeof ClashProxyVmess>;
export type Clash = z.infer<typeof Clash>;

export const SingboxOutboundCommonTls = z.object({
  enabled: z.boolean(),
  disable_sni: z.optional(z.boolean()),
  server_name: z.optional(z.string()),
  insecure: z.optional(z.boolean()),
  alpn: z.optional(z.array(z.string())),
});
export const SingboxOutboundHttp = z.object({
  type: z.literal("http"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  tls: z.optional(SingboxOutboundCommonTls),
});
export const SingboxOutboundHysteria = z.object({
  type: z.literal("hysteria"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  up: z.string(),
  down: z.string(),
  obfs: z.optional(z.string()),
  auth_str: z.optional(z.string()),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
  tls: SingboxOutboundCommonTls,
});
export const SingboxOutboundSelector = z.object({
  type: z.literal("selector"),
  tag: z.string(),
  outbounds: z.array(z.string()),
  default: z.optional(z.string()),
});
export const SingboxOutboundShadowsocks = z.object({
  type: z.literal("shadowsocks"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  method: z.enum([
    "2022-blake3-aes-128-gcm",
    "2022-blake3-aes-256-gcm",
    "2022-blake3-chacha20-poly1305",
    "none",
    "aes-128-gcm",
    "aes-192-gcm",
    "aes-256-gcm",
    "chacha20-ietf-poly1305",
    "xchacha20-ietf-poly1305",
    "aes-128-ctr",
    "aes-192-ctr",
    "aes-256-ctr",
    "aes-128-cfb",
    "aes-192-cfb",
    "aes-256-cfb",
    "rc4-md5",
    "chacha20-ietf",
    "xchacha20",
  ]),
  password: z.string(),
  plugin: z.optional(z.string()),
  plugin_opts: z.optional(z.string()),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
});
export const SingboxOutboundSocks = z.object({
  type: z.literal("socks"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
});
export const SingboxOutboundTrojan = z.object({
  type: z.literal("trojan"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  password: z.string(),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
  tls: SingboxOutboundCommonTls,
});
export const SingboxOutboundVmess = z.object({
  type: z.literal("vmess"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  uuid: z.string(),
  security: z.optional(
    z.enum(["auto", "none", "zero", "aes-128-gcm", "chacha20-poly1305"]),
  ),
  alter_id: z.optional(z.number()),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
  tls: z.optional(SingboxOutboundCommonTls),
  transport: z.optional(z.object({
    type: z.enum(["http", "ws", "grpc"]),
    host: z.optional(z.array(z.string())),
    path: z.optional(z.string()),
    method: z.optional(z.string()),
    headers: z.optional(z.record(z.string())),
    max_early_data: z.optional(z.number()),
    early_data_header_name: z.optional(z.string()),
    service_name: z.optional(z.string()),
  })),
});
export const Singbox = z.object({
  outbounds: z.array(z.discriminatedUnion("type", [
    SingboxOutboundHttp,
    SingboxOutboundHysteria,
    SingboxOutboundSelector,
    SingboxOutboundShadowsocks,
    SingboxOutboundSocks,
    SingboxOutboundTrojan,
    SingboxOutboundVmess,
  ])),
});

export type SingboxOutboundCommonTls = z.infer<
  typeof SingboxOutboundCommonTls
>;
export type SingboxOutboundHttp = z.infer<typeof SingboxOutboundHttp>;
export type SingboxOutboundHysteria = z.infer<typeof SingboxOutboundHysteria>;
export type SingboxOutboundSelector = z.infer<typeof SingboxOutboundSelector>;
export type SingboxOutboundShadowsocks = z.infer<
  typeof SingboxOutboundShadowsocks
>;
export type SingboxOutboundSocks = z.infer<typeof SingboxOutboundSocks>;
export type SingboxOutboundTrojan = z.infer<typeof SingboxOutboundTrojan>;
export type SingboxOutboundVmess = z.infer<typeof SingboxOutboundVmess>;
export type Singbox = z.infer<typeof Singbox>;
