import { z } from "zod";

export const ClashProxiesHttp = z.object({
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
export const ClashProxiesHysteria = z.object({
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
export const ClashProxiesSocks5 = z.object({
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
export const ClashProxiesShadowsocks = z.object({
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
export const ClashProxiesTrojan = z.object({
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
export const ClashProxiesVmess = z.object({
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
    ClashProxiesHttp,
    ClashProxiesHysteria,
    ClashProxiesShadowsocks,
    ClashProxiesSocks5,
    ClashProxiesTrojan,
    ClashProxiesVmess,
  ])),
});

export type ClashProxiesHttp = z.infer<typeof ClashProxiesHttp>;
export type ClashProxiesHysteria = z.infer<typeof ClashProxiesHysteria>;
export type ClashProxiesShadowsocks = z.infer<typeof ClashProxiesShadowsocks>;
export type ClashProxiesSocks5 = z.infer<typeof ClashProxiesSocks5>;
export type ClashProxiesTrojan = z.infer<typeof ClashProxiesTrojan>;
export type ClashProxiesVmess = z.infer<typeof ClashProxiesVmess>;
export type Clash = z.infer<typeof Clash>;

export const SingboxOutboundsCommonTls = z.object({
  enabled: z.boolean(),
  disable_sni: z.optional(z.boolean()),
  server_name: z.optional(z.string()),
  insecure: z.optional(z.boolean()),
  alpn: z.optional(z.array(z.string())),
});
export const SingboxOutboundsHttp = z.object({
  type: z.literal("http"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  tls: z.optional(SingboxOutboundsCommonTls),
});
export const SingboxOutboundsHysteria = z.object({
  type: z.literal("hysteria"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  up: z.string(),
  down: z.string(),
  obfs: z.optional(z.string()),
  auth_str: z.optional(z.string()),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
  tls: SingboxOutboundsCommonTls,
});
export const SingboxOutboundsSelector = z.object({
  type: z.literal("selector"),
  tag: z.string(),
  outbounds: z.array(z.string()),
  default: z.optional(z.string()),
});
export const SingboxOutboundsShadowsocks = z.object({
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
export const SingboxOutboundsSocks = z.object({
  type: z.literal("socks"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
});
export const SingboxOutboundsTrojan = z.object({
  type: z.literal("trojan"),
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  password: z.string(),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
  tls: SingboxOutboundsCommonTls,
});
export const SingboxOutboundsVmess = z.object({
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
  tls: z.optional(SingboxOutboundsCommonTls),
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
    SingboxOutboundsHttp,
    SingboxOutboundsHysteria,
    SingboxOutboundsSelector,
    SingboxOutboundsShadowsocks,
    SingboxOutboundsSocks,
    SingboxOutboundsTrojan,
    SingboxOutboundsVmess,
  ])),
});

export type SingboxOutboundsCommonTls = z.infer<
  typeof SingboxOutboundsCommonTls
>;
export type SingboxOutboundsHttp = z.infer<typeof SingboxOutboundsHttp>;
export type SingboxOutboundsHysteria = z.infer<typeof SingboxOutboundsHysteria>;
export type SingboxOutboundsSelector = z.infer<typeof SingboxOutboundsSelector>;
export type SingboxOutboundsShadowsocks = z.infer<
  typeof SingboxOutboundsShadowsocks
>;
export type SingboxOutboundsSocks = z.infer<typeof SingboxOutboundsSocks>;
export type SingboxOutboundsTrojan = z.infer<typeof SingboxOutboundsTrojan>;
export type SingboxOutboundsVmess = z.infer<typeof SingboxOutboundsVmess>;
export type Singbox = z.infer<typeof Singbox>;
