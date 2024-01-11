import { deepmerge } from "deepmerge-ts";
import * as yaml from "yaml";
import { z } from "zod";
import {
  Clash,
  ClashProxyBaseVmessOrVLESS,
  ClashProxyHttp,
  ClashProxyHysteria,
  ClashProxyShadowsocks,
  ClashProxySocks5,
  ClashProxyTrojan,
  ClashProxyTUIC,
  ClashProxyVLESS,
  ClashProxyVmess,
  Singbox,
  SingboxOutboundCommonVmessOrVLESSTransport,
  SingboxOutboundHttp,
  SingboxOutboundHysteria,
  SingboxOutboundSelector,
  SingboxOutboundShadowsocks,
  SingboxOutboundSocks,
  SingboxOutboundTrojan,
  SingboxOutboundTUIC,
  SingboxOutboundVLESS,
  SingboxOutboundVmess,
} from "./types.ts";

export function convert(
  input: string,
  mergeable: string,
): string {
  const clash: Clash = Clash.parse(yaml.parse(input));

  const singbox: Singbox = Singbox.parse({
    outbounds: [],
  });
  const singboxSelector: SingboxOutboundSelector = {
    type: "selector",
    tag: "selector",
    outbounds: [],
  };
  for (const proxy of clash.proxies) {
    switch (proxy.type) {
      case "http":
        singbox.outbounds.push(convertHttp(proxy));
        break;
      case "hysteria":
        singbox.outbounds.push(convertHysteria(proxy));
        break;
      case "ss":
        singbox.outbounds.push(convertShadowsocks(proxy));
        break;
      case "socks5":
        singbox.outbounds.push(convertSocks5ToSocks(proxy));
        break;
      case "trojan":
        singbox.outbounds.push(convertTrojan(proxy));
        break;
      case "tuic":
        singbox.outbounds.push(convertTUIC(proxy));
        break;
      case "vmess":
        singbox.outbounds.push(convertVmess(proxy));
        break;
      case "vless":
        singbox.outbounds.push(convertVLESS(proxy));
        break;
    }
    singboxSelector.outbounds.push(proxy.name);
  }
  if (singbox.outbounds.length > 0) {
    singboxSelector.default = singbox.outbounds.at(-1)!.tag;
  }

  singbox.outbounds.push(SingboxOutboundSelector.parse(singboxSelector));

  return JSON.stringify(deepmerge(singbox, JSON.parse(mergeable)), null, 4);
}

const convertVmessOrVLESSTransport = z.function()
  .args(ClashProxyBaseVmessOrVLESS)
  .returns(SingboxOutboundCommonVmessOrVLESSTransport)
  .implement((proxy) => {
    if (proxy["http-opts"] !== undefined) {
      const transport: SingboxOutboundCommonVmessOrVLESSTransport = {
        "type": "http",
      };
      if (proxy["http-opts"].path !== undefined) {
        transport.path = proxy["http-opts"].path[0]!;
      }
      if (proxy["http-opts"].method !== undefined) {
        transport.method = proxy["http-opts"].method!;
      }
      if (proxy["http-opts"].headers !== undefined) {
        transport.headers = {};
        for (
          const [key, value] of Object.entries(proxy["http-opts"].headers!)
        ) {
          transport.headers[key] = value[0];
        }
      }
      return transport;
    } else if (proxy["h2-opts"] !== undefined) {
      const transport: SingboxOutboundCommonVmessOrVLESSTransport = {
        "type": "http",
      };
      if (proxy["h2-opts"].host !== undefined) {
        transport.host = proxy["h2-opts"].host!;
      }
      if (proxy["h2-opts"].path !== undefined) {
        transport.path = proxy["h2-opts"].path!;
      }
      return transport;
    } else if (proxy["ws-opts"] !== undefined) {
      const transport: SingboxOutboundCommonVmessOrVLESSTransport = {
        "type": "ws",
      };
      if (proxy["ws-opts"].path !== undefined) {
        transport.path = proxy["ws-opts"].path!;
      }
      if (proxy["ws-opts"].headers !== undefined) {
        transport.headers = proxy["ws-opts"].headers;
        if (proxy["ws-opts"]["max-early-data"] !== undefined) {
          transport.max_early_data = proxy["ws-opts"]["max-early-data"]!;
        }
        if (proxy["ws-opts"]["early-data-header-name"] !== undefined) {
          transport.early_data_header_name =
            proxy["ws-opts"]["early-data-header-name"]!;
        }
      }
      return transport;
    } else if (proxy["grpc-opts"] !== undefined) {
      const transport: SingboxOutboundCommonVmessOrVLESSTransport = {
        "type": "grpc",
      };
      if (proxy["grpc-opts"]["grpc-service-name"] !== undefined) {
        transport.service_name = proxy["grpc-opts"]["grpc-service-name"]!;
      }
      return transport;
    }

    throw new Error("Unsupported transport tcp");
  });

const convertHttp = z.function().args(ClashProxyHttp).returns(
  SingboxOutboundHttp,
).implement((proxy) => {
  const outbound: SingboxOutboundHttp = {
    type: "http",
    tag: proxy.name,
    server: proxy.server,
    server_port: proxy.port,
  };

  if (proxy.username !== undefined) {
    outbound.username = proxy.username!;
    if (proxy.password !== undefined) {
      outbound.password = proxy.password!;
    }
  }
  if (proxy.tls !== undefined && proxy.tls === true) {
    outbound.tls = { enabled: true };
    if (
      proxy["skip-cert-verify"] !== undefined &&
      proxy["skip-cert-verify"] === true
    ) {
      outbound.tls.insecure = true;
    }
    if (proxy.sni !== undefined) {
      outbound.tls.server_name = proxy.sni!;
    }
  }

  return outbound;
});

const convertHysteria = z.function()
  .args(ClashProxyHysteria)
  .returns(SingboxOutboundHysteria)
  .implement((proxy) => {
    const outbound: SingboxOutboundHysteria = {
      type: "hysteria",
      tag: proxy.name,
      server: proxy.server,
      server_port: proxy.port,
      up: proxy.up,
      down: proxy.down,
      tls: { enabled: true },
    };

    if (proxy.protocol !== undefined && proxy.protocol !== "udp") {
      throw new Error("Unsupported protocol faketcp or wechat-video");
    }
    if (proxy.sni !== undefined) {
      outbound.tls.server_name = proxy.sni!;
    } else {
      outbound.tls.server_name = proxy.server;
    }
    if (proxy.alpn !== undefined) {
      outbound.tls.alpn = proxy.alpn!;
    }
    if (
      proxy["skip-cert-verify"] !== undefined &&
      proxy["skip-cert-verify"] === true
    ) {
      outbound.tls.insecure = true;
    }
    if (proxy.obfs !== undefined) {
      outbound.obfs = proxy.obfs!;
    }
    if (proxy["auth-str"] !== undefined) {
      outbound.auth_str = proxy["auth-str"]!;
    }

    return outbound;
  });

const convertShadowsocks = z.function()
  .args(ClashProxyShadowsocks)
  .returns(SingboxOutboundShadowsocks)
  .implement((proxy) => {
    const outbound: SingboxOutboundShadowsocks = {
      type: "shadowsocks",
      tag: proxy.name,
      server: proxy.server,
      server_port: proxy.port,
      method: proxy.cipher,
      password: proxy.password,
    };

    if (proxy.udp !== undefined && proxy.udp! === false) {
      outbound.network = "tcp";
    }
    if (proxy.plugin !== undefined) {
      outbound.plugin = proxy.plugin!;
      outbound.plugin_opts = "";
      if (proxy["plugin-opts"] !== undefined) {
        outbound.plugin_opts += `mode=${proxy["plugin-opts"].mode!}`;
        if (proxy["plugin-opts"].host !== undefined) {
          outbound.plugin_opts += `;host=${proxy["plugin-opts"].host!}`;
        }
        if (proxy.plugin === "v2ray-plugin") {
          if (
            proxy["plugin-opts"].tls !== undefined &&
            proxy["plugin-opts"].tls! === true
          ) {
            outbound.plugin_opts += `;tls`;
          }

          if (proxy["plugin-opts"].path !== undefined) {
            outbound.plugin_opts += `;path=${proxy["plugin-opts"].path!}`;
          }
          if (proxy["plugin-opts"].mux !== undefined) {
            outbound.plugin_opts += `;mux=${proxy["plugin-opts"].mux!}`;
          }
        }
      }
    }

    return outbound;
  });

const convertSocks5ToSocks = z.function()
  .args(ClashProxySocks5)
  .returns(SingboxOutboundSocks)
  .implement((proxy) => {
    const outbound: SingboxOutboundSocks = {
      type: "socks",
      tag: proxy.name,
      server: proxy.server,
      server_port: proxy.port,
    };

    if (proxy.udp !== undefined && proxy.udp! === false) {
      outbound.network = "tcp";
    }
    if (proxy.username !== undefined) {
      outbound.username = proxy.username!;
      if (proxy.password !== undefined) {
        outbound.password = proxy.password!;
      }
    }
    if (proxy.tls !== undefined && proxy.tls === true) {
      throw new Error("Unsupported layer tls");
    }

    return outbound;
  });

const convertTrojan = z.function()
  .args(ClashProxyTrojan)
  .returns(SingboxOutboundTrojan)
  .implement((proxy) => {
    const outbound: SingboxOutboundTrojan = {
      type: "trojan",
      tag: proxy.name,
      server: proxy.server,
      server_port: proxy.port,
      password: proxy.password,
      tls: { enabled: true },
    };

    if (proxy.udp !== undefined && proxy.udp! === false) {
      outbound.network = "tcp";
    }
    if (proxy.sni !== undefined) {
      outbound.tls!.server_name = proxy.sni!;
    }
    if (
      proxy["skip-cert-verify"] !== undefined &&
      proxy["skip-cert-verify"] === true
    ) {
      outbound.tls!.insecure = true;
    }
    if (proxy.alpn !== undefined) {
      outbound.tls!.alpn = proxy.alpn!;
    }

    return outbound;
  });

const convertTUIC = z.function()
  .args(ClashProxyTUIC)
  .returns(SingboxOutboundTUIC)
  .implement((proxy) => {
    const outbound: SingboxOutboundTUIC = {
      type: "tuic",
      tag: proxy.name,
      server: proxy.server,
      server_port: proxy.port,
      uuid: proxy.uuid,
      tls: { enabled: true },
    };

    if (proxy.password !== undefined) {
      outbound.password = proxy.password;
    }
    if (proxy["heartbeat-interval"] !== undefined) {
      outbound.heartbeat = (proxy["heartbeat-interval"] / 1000).toString() +
        "s";
    }
    if (proxy["reduce-rtt"] !== undefined && proxy["reduce-rtt"] == true) {
      outbound.zero_rtt_handshake = true;
    }
    if (proxy["udp-relay-mode"] !== undefined) {
      outbound.udp_relay_mode = proxy["udp-relay-mode"];
    }
    if (proxy["congestion-controller"] !== undefined) {
      outbound.congestion_control = proxy["congestion-controller"];
    }
    if (
      proxy["udp-over-stream"] !== undefined && proxy["udp-over-stream"] == true
    ) {
      outbound.udp_over_stream = true;
    }
    if (proxy.sni !== undefined) {
      outbound.tls!.server_name = proxy.sni!;
    }
    if (
      proxy["skip-cert-verify"] !== undefined &&
      proxy["skip-cert-verify"] === true
    ) {
      outbound.tls!.insecure = true;
    }
    if (proxy.alpn !== undefined) {
      outbound.tls!.alpn = proxy.alpn!;
    }

    return outbound;
  });

const convertVmess = z.function()
  .args(ClashProxyVmess)
  .returns(SingboxOutboundVmess)
  .implement((proxy) => {
    const outbound: SingboxOutboundVmess = {
      type: "vmess",
      tag: proxy.name,
      server: proxy.server,
      server_port: proxy.port,
      uuid: proxy.uuid,
      security: proxy.cipher,
      alter_id: proxy.alterId,
      // sing-box does not support tcp transport, transport is always necessary
      transport: convertVmessOrVLESSTransport(proxy),
    };

    if (proxy.udp !== undefined && proxy.udp! === false) {
      outbound.network = "tcp";
    }
    if (proxy.tls !== undefined && proxy.tls === true) {
      outbound.tls = { enabled: true };
      if (proxy.servername !== undefined) {
        outbound.tls.server_name = proxy.servername!;
      }
      if (
        proxy["skip-cert-verify"] !== undefined &&
        proxy["skip-cert-verify"] === true
      ) {
        outbound.tls.insecure = true;
      }
    }
    return outbound;
  });

const convertVLESS = z.function()
  .args(ClashProxyVLESS)
  .returns(SingboxOutboundVLESS)
  .implement((proxy) => {
    const outbound: SingboxOutboundVLESS = {
      type: "vless",
      tag: proxy.name,
      server: proxy.server,
      server_port: proxy.port,
      uuid: proxy.uuid,
      // sing-box does not support tcp transport, transport is always necessary
      transport: convertVmessOrVLESSTransport(proxy),
    };

    if (proxy.flow !== undefined) {
      outbound.flow = proxy.flow;
    }

    return outbound;
  });
