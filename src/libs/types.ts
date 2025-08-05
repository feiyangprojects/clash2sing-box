import { z } from "zod";

export const ClashProxy = z.object({
  name: z.string(),
  server: z.string(),
  port: z.number(),
  udp: z.optional(z.boolean()),
  "ip-version": z.optional(
    z.enum(["dual", "ipv4", "ipv6", "ipv4-prefer", "ipv6-prefer"]),
  ),
});
export const ClashProxyBaseTLS = ClashProxy.extend({
  tls: z.optional(z.boolean()).meta({
    description:
      "Only exists on the following optionally tls-enabled proxies: http, socks, v2ray protocols",
  }),
  "skip-cert-verify": z.optional(z.boolean()),
  alpn: z.optional(z.array(z.string())),
  servername: z.optional(z.string()).meta({
    deprecated: true,
    description: "Only used by v2ray protocols",
  }),
  sni: z.optional(z.string()),
  "x-clash2singbox-certificate": z.optional(z.array(z.string())),
});
export const ClashProxyBaseVmessOrVLESS = ClashProxyBaseTLS.extend({
  uuid: z.string(),
  network: z.optional(z.enum(["ws", "h2", "http", "grpc"])),
  "ws-opts": z.optional(z.object({
    path: z.optional(z.string()),
    headers: z.optional(z.record(z.string(), z.string())),
    "max-early-data": z.optional(z.number()),
    "early-data-header-name": z.optional(z.string()),
    "v2ray-http-upgrade": z.optional(z.boolean()),
    "v2ray-http-upgrade-fast-open": z.optional(z.boolean()),
  })),
  "h2-opts": z.optional(z.object({
    host: z.optional(z.array(z.string())),
    path: z.optional(z.string()),
  })),
  "http-opts": z.optional(z.object({
    method: z.optional(z.string()),
    path: z.optional(z.array(z.string())),
    headers: z.optional(z.record(z.string(), z.array(z.string()))),
  })),
  "grpc-opts": z.optional(z.object({
    "grpc-service-name": z.optional(z.string()),
  })),
});
export const ClashProxyHttp = ClashProxyBaseTLS.extend({
  type: z.literal("http"),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
});
export const ClashProxyHysteria = ClashProxyBaseTLS.extend({
  type: z.literal("hysteria"),
  "auth-str": z.optional(z.string()),
  obfs: z.optional(z.string()),
  protocol: z.enum(["udp", "wechat-video", "faketcp"]),
  up: z.string(),
  down: z.string(),
});
export const ClashProxySocks5 = ClashProxyBaseTLS.extend({
  type: z.literal("socks5"),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
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
export const ClashProxyTrojan = ClashProxyBaseTLS.extend({
  type: z.literal("trojan"),
  password: z.string(),
});
export const ClashProxyTUIC = ClashProxyBaseTLS.extend({
  type: z.literal("tuic"),
  uuid: z.string(),
  password: z.optional(z.string()),
  "heartbeat-interval": z.optional(z.number()),
  "reduce-rtt": z.optional(z.boolean()),
  "udp-relay-mode": z.optional(z.enum(["native", "quic"])),
  "congestion-controller": z.optional(z.enum(["cubic", "new_reno", "bbr"])),
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
export const ClashProxies = z.discriminatedUnion("type", [
  ClashProxyHttp,
  ClashProxyHysteria,
  ClashProxyShadowsocks,
  ClashProxySocks5,
  ClashProxyTrojan,
  ClashProxyTUIC,
  ClashProxyVmess,
  ClashProxyVLESS,
]);
export const Clash = z.object({
  proxies: z.array(ClashProxies),
});

export type ClashProxy = z.infer<typeof ClashProxy>;
export type ClashProxyBaseTLS = z.infer<typeof ClashProxyBaseTLS>;
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
export type ClashProxies = z.infer<typeof ClashProxies>;
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
    external_ui_download_url: z.optional(z.string()),
    secret: z.optional(z.string()),
  })),
});
export const SingboxOutbound = z.object({
  tag: z.string(),
  server: z.string(),
  server_port: z.number(),
  network: z.optional(z.enum(["tcp", "udp", "tcp,udp"])),
  domain_strategy: z.optional(
    z.enum(["prefer_ipv4", "prefer_ipv6", "ipv4_only", "ipv6_only"]),
  ),
});
export const SingboxOutboundCommonTlsTransport = z.object({
  enabled: z.boolean(),
  disable_sni: z.optional(z.boolean()),
  server_name: z.optional(z.string()),
  insecure: z.optional(z.boolean()),
  alpn: z.optional(z.array(z.string())),
  certificate: z.optional(z.array(z.string())),
});
export const SingboxOutboundCommonVmessOrVLESSTransportGrpc = z.object({
  type: z.literal("grpc"),
  service_name: z.optional(z.string()),
});
export const SingboxOutboundCommonVmessOrVLESSTransportCommonHttp = z.object({
  host: z.optional(z.array(z.string())),
  path: z.optional(z.string()),
  method: z.optional(z.string()),
  headers: z.optional(z.record(z.string(), z.string())),
});
export const SingboxOutboundCommonVmessOrVLESSTransportHttp =
  SingboxOutboundCommonVmessOrVLESSTransportCommonHttp.extend({
    type: z.literal("http"),
  });
export const SingboxOutboundCommonVmessOrVLESSTransportHttpUpgrade =
  SingboxOutboundCommonVmessOrVLESSTransportCommonHttp.extend({
    type: z.literal("httpupgrade"),
  });
export const SingboxOutboundCommonVmessOrVLESSTransportWebSocket =
  SingboxOutboundCommonVmessOrVLESSTransportCommonHttp.extend({
    type: z.literal("ws"),
    max_early_data: z.optional(z.number()),
    early_data_header_name: z.optional(z.string()),
  });
export const SingboxOutboundCommonVmessOrVLESSTransport = z.discriminatedUnion(
  "type",
  [
    SingboxOutboundCommonVmessOrVLESSTransportGrpc,
    SingboxOutboundCommonVmessOrVLESSTransportHttp,
    SingboxOutboundCommonVmessOrVLESSTransportHttpUpgrade,
    SingboxOutboundCommonVmessOrVLESSTransportWebSocket,
  ],
);

export const SingboxOutboundBaseTLS = SingboxOutbound.extend({
  tls: z.optional(SingboxOutboundCommonTlsTransport),
});
export const SingboxOutboundHttp = SingboxOutboundBaseTLS.extend({
  type: z.literal("http"),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
});
export const SingboxOutboundHysteria = SingboxOutboundBaseTLS.extend({
  type: z.literal("hysteria"),
  up: z.string(),
  down: z.string(),
  obfs: z.optional(z.string()),
  auth_str: z.optional(z.string()),
  tls: SingboxOutboundCommonTlsTransport,
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
export const SingboxOutboundTrojan = SingboxOutboundBaseTLS.extend({
  type: z.literal("trojan"),
  password: z.string(),
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
  tls: SingboxOutboundCommonTlsTransport,
});
export const SingboxOutboundVmess = SingboxOutboundBaseTLS.extend({
  type: z.literal("vmess"),
  uuid: z.string(),
  security: z.optional(
    z.enum(["auto", "none", "zero", "aes-128-gcm", "chacha20-poly1305"]),
  ),
  alter_id: z.optional(z.number()),
  transport: SingboxOutboundCommonVmessOrVLESSTransport,
});
export const SingboxOutboundVLESS = SingboxOutboundBaseTLS.extend({
  type: z.literal("vless"),
  uuid: z.string(),
  flow: z.optional(z.enum(["xtls-rprx-vision"])),
  transport: SingboxOutboundCommonVmessOrVLESSTransport,
});
export const SingboxOutbounds = z.discriminatedUnion("type", [
  SingboxOutboundHttp,
  SingboxOutboundHysteria,
  SingboxOutboundShadowsocks,
  SingboxOutboundSocks,
  SingboxOutboundTrojan,
  SingboxOutboundTUIC,
  SingboxOutboundVmess,
  SingboxOutboundVLESS,
]);
export const Singbox = z.object({
  experimental: z.optional(SingboxExperimental),
  outbounds: z.array(
    z.discriminatedUnion("type", [SingboxOutbounds, SingboxOutboundSelector]),
  ),
});

export type SingboxExperimental = z.infer<typeof SingboxExperimental>;
export type SingboxOutbound = z.infer<typeof SingboxOutbound>;
export type SingboxOutboundCommonTlsTransport = z.infer<
  typeof SingboxOutboundCommonTlsTransport
>;
export type SingboxOutboundCommonVmessOrVLESSTransportGrpc = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransportGrpc
>;
export type SingboxOutboundCommonVmessOrVLESSTransportHttp = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransportHttp
>;
export type SingboxOutboundCommonVmessOrVLESSTransportHttpUpgrade = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransportHttpUpgrade
>;
export type SingboxOutboundCommonVmessOrVLESSTransportWebSocket = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransportWebSocket
>;
export type SingboxOutboundCommonVmessOrVLESSTransport = z.infer<
  typeof SingboxOutboundCommonVmessOrVLESSTransport
>;
export type SingboxOutboundBaseTLS = z.infer<typeof SingboxOutboundBaseTLS>;
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
export type SingboxOutbounds = z.infer<typeof SingboxOutbounds>;
export type Singbox = z.infer<typeof Singbox>;
