import { z } from "zod";

export const ClashProxy = z.object({
  name: z.string(),
  server: z.string(),
  port: z.number(),
});
export const ClashProxyBaseVmessOrVLESS = ClashProxy.extend({
  uuid: z.string(),
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
export const ClashProxyHttp = ClashProxy.extend({
  type: z.literal("http"),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  tls: z.optional(z.boolean()),
  "skip-cert-verify": z.optional(z.boolean()),
  sni: z.optional(z.string()),
});
export const ClashProxyHysteria = ClashProxy.extend({
  type: z.literal("hysteria"),
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
export const ClashProxySocks5 = ClashProxy.extend({
  type: z.literal("socks5"),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  tls: z.optional(z.boolean()),
  "skip-cert-verify": z.optional(z.boolean()),
  udp: z.optional(z.boolean()),
});
export const ClashProxyShadowsocks = ClashProxy.extend({
  type: z.literal("ss"),
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
  "udp-over-tcp": z.optional(z.boolean()),
  "udp-over-tcp-version": z.optional(z.union([z.literal(1), z.literal(2)])),
});
export const ClashProxyTrojan = ClashProxy.extend({
  type: z.literal("trojan"),
  password: z.string(),
  udp: z.optional(z.boolean()),
  sni: z.optional(z.string()),
  alpn: z.optional(z.array(z.string())),
  "skip-cert-verify": z.optional(z.boolean()),
});
export const ClashProxyTUIC = ClashProxy.extend({
  type: z.literal("tuic"),
  uuid: z.string(),
  password: z.optional(z.string()),
  alpn: z.optional(z.array(z.string())),
  "heartbeat-interval": z.optional(z.number()),
  "reduce-rtt": z.optional(z.boolean()),
  "udp-relay-mode": z.optional(z.enum(["native", "quic"])),
  "congestion-controller": z.optional(z.enum(["cubic", "new_reno", "bbr"])),
  "skip-cert-verify": z.optional(z.boolean()),
  sni: z.optional(z.string()),
  "udp-over-stream": z.optional(z.boolean()),
});
export const ClashProxyVmess = ClashProxyBaseVmessOrVLESS.extend({
  type: z.literal("vmess"),
  // Temporary workaround
  alterId: z.coerce.number(),
  cipher: z.enum(["aes-128-gcm", "chacha20-poly1305", "auto", "none", "zero"]),
});
export const ClashProxyVLESS = ClashProxyBaseVmessOrVLESS.extend({
  type: z.literal("vless"),
  flow: z.optional(z.enum(["xtls-rprx-vision"])),
});
export const Clash = z.object({
  proxies: z.array(z.discriminatedUnion("type", [
    ClashProxyHttp,
    ClashProxyHysteria,
    ClashProxyShadowsocks,
    ClashProxySocks5,
    ClashProxyTrojan,
    ClashProxyTUIC,
    ClashProxyVmess,
    ClashProxyVLESS,
  ])),
});

export type ClashProxy = z.infer<typeof ClashProxy>;
export type ClashProxyBaseVmessOrVLESS = z.infer<
  typeof ClashProxyBaseVmessOrVLESS
>;
export type ClashProxyHttp = z.infer<typeof ClashProxyHttp>;
export type ClashProxyHysteria = z.infer<typeof ClashProxyHysteria>;
export type ClashProxyShadowsocks = z.infer<typeof ClashProxyShadowsocks>;
export type ClashProxySocks5 = z.infer<typeof ClashProxySocks5>;
export type ClashProxyTrojan = z.infer<typeof ClashProxyTrojan>;
export type ClashProxyTUIC = z.infer<typeof ClashProxyTUIC>;
export type ClashProxyVmess = z.infer<typeof ClashProxyVmess>;
export type ClashProxyVLESS = z.infer<typeof ClashProxyVLESS>;
export type Clash = z.infer<typeof Clash>;

export const SingboxExperimental = z.object({
  cache_file: z.optional(z.object({
    enabled: z.optional(z.boolean()),
    path: z.optional(z.string()),
    cache_id: z.optional(z.string()),
  })),
  clash_api: z.optional(z.object({
    external_controller: z.optional(z.string()),
    external_ui: z.optional(z.string()),
    secret: z.optional(z.string()),
  })),
});
export const SingboxOutbound = z.object({
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
});
export const SingboxOutboundCommonTls = z.object({
  enabled: z.boolean(),
  disable_sni: z.optional(z.boolean()),
  server_name: z.optional(z.string()),
  insecure: z.optional(z.boolean()),
  alpn: z.optional(z.array(z.string())),
});
export const SingboxOutboundCommonVmessOrVLESSTransportGrpc = z.object({
  type: z.literal("grpc"),
  service_name: z.optional(z.string()),
});
export const SingboxOutboundCommonVmessOrVLESSTransportHttp = z.object({
  type: z.literal("http"),
  host: z.optional(z.array(z.string())),
  path: z.optional(z.string()),
  method: z.optional(z.string()),
  headers: z.optional(z.record(z.string())),
});
export const SingboxOutboundCommonVmessOrVLESSTransportWebSocket = z.object({
  type: z.literal("ws"),
  host: z.optional(z.array(z.string())),
  path: z.optional(z.string()),
  headers: z.optional(z.record(z.string())),
  max_early_data: z.optional(z.number()),
  early_data_header_name: z.optional(z.string()),
});
export const SingboxOutboundCommonVmessOrVLESSTransport = z.discriminatedUnion(
  "type",
  [
    SingboxOutboundCommonVmessOrVLESSTransportGrpc,
    SingboxOutboundCommonVmessOrVLESSTransportHttp,
    SingboxOutboundCommonVmessOrVLESSTransportWebSocket,
  ],
);
export const SingboxOutboundHttp = SingboxOutbound.extend({
  type: z.literal("http"),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  tls: z.optional(SingboxOutboundCommonTls),
});
export const SingboxOutboundHysteria = SingboxOutbound.extend({
  type: z.literal("hysteria"),
  up: z.string(),
  down: z.string(),
  obfs: z.optional(z.string()),
  auth_str: z.optional(z.string()),
  tls: SingboxOutboundCommonTls,
});
export const SingboxOutboundSelector = z.object({
  type: z.literal("selector"),
  tag: z.string(),
  outbounds: z.array(z.string()),
  default: z.optional(z.string()),
});
export const SingboxOutboundShadowsocks = SingboxOutbound.extend({
  type: z.literal("shadowsocks"),
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
  udp_over_tcp: z.optional(z.object({
    enabled: z.boolean(),
    version: z.optional(z.union([z.literal(1), z.literal(2)])),
  })),
});
export const SingboxOutboundSocks = SingboxOutbound.extend({
  type: z.literal("socks"),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
});
export const SingboxOutboundTrojan = SingboxOutbound.extend({
  type: z.literal("trojan"),
  password: z.string(),
  tls: SingboxOutboundCommonTls,
});
export const SingboxOutboundTUIC = SingboxOutbound.extend({
  type: z.literal("tuic"),
  uuid: z.string(),
  password: z.optional(z.string()),
  congestion_control: z.optional(z.enum(["cubic", "new_reno", "bbr"])),
  udp_relay_mode: z.optional(z.enum(["native", "quic"])),
  udp_over_stream: z.optional(z.boolean()),
  zero_rtt_handshake: z.optional(z.boolean()),
  heartbeat: z.optional(z.string()),
  tls: SingboxOutboundCommonTls,
});
export const SingboxOutboundVmess = SingboxOutbound.extend({
  type: z.literal("vmess"),
  uuid: z.string(),
  security: z.optional(
    z.enum(["auto", "none", "zero", "aes-128-gcm", "chacha20-poly1305"]),
  ),
  alter_id: z.optional(z.number()),
  tls: z.optional(SingboxOutboundCommonTls),
  transport: SingboxOutboundCommonVmessOrVLESSTransport,
});
export const SingboxOutboundVLESS = SingboxOutbound.extend({
  type: z.literal("vless"),
  uuid: z.string(),
  flow: z.optional(z.enum(["xtls-rprx-vision"])),
  tls: z.optional(SingboxOutboundCommonTls),
  transport: SingboxOutboundCommonVmessOrVLESSTransport,
});
export const Singbox = z.object({
  experimental: z.optional(SingboxExperimental),
  outbounds: z.array(z.discriminatedUnion("type", [
    SingboxOutboundHttp,
    SingboxOutboundHysteria,
    SingboxOutboundSelector,
    SingboxOutboundShadowsocks,
    SingboxOutboundSocks,
    SingboxOutboundTrojan,
    SingboxOutboundTUIC,
    SingboxOutboundVmess,
    SingboxOutboundVLESS,
  ])),
});

export type SingboxExperimental = z.infer<typeof SingboxExperimental>;
export type SingboxOutbound = z.infer<typeof SingboxOutbound>;
export type SingboxOutboundCommonTls = z.infer<
  typeof SingboxOutboundCommonTls
>;
export type SingboxOutboundCommonVmessOrVLESSTransportGrpc = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransportGrpc
>;
export type SingboxOutboundCommonVmessOrVLESSTransportHttp = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransportHttp
>;
export type SingboxOutboundCommonVmessOrVLESSTransportWebSocket = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransportWebSocket
>;
export type SingboxOutboundCommonVmessOrVLESSTransport = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransport
>;
export type SingboxOutboundHttp = z.infer<typeof SingboxOutboundHttp>;
export type SingboxOutboundHysteria = z.infer<typeof SingboxOutboundHysteria>;
export type SingboxOutboundSelector = z.infer<typeof SingboxOutboundSelector>;
export type SingboxOutboundShadowsocks = z.infer<
  typeof SingboxOutboundShadowsocks
>;
export type SingboxOutboundSocks = z.infer<typeof SingboxOutboundSocks>;
export type SingboxOutboundTrojan = z.infer<typeof SingboxOutboundTrojan>;
export type SingboxOutboundTUIC = z.infer<typeof SingboxOutboundTUIC>;
export type SingboxOutboundVmess = z.infer<typeof SingboxOutboundVmess>;
export type SingboxOutboundVLESS = z.infer<typeof SingboxOutboundVLESS>;
export type Singbox = z.infer<typeof Singbox>;
