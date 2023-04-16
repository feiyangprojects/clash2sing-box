import { deepmerge } from "deepmerge-ts";
import * as yaml from "yaml";
import {
  Clash,
  ClashProxiesHttp,
  ClashProxiesHysteria,
  ClashProxiesShadowsocks,
  ClashProxiesSocks5,
  ClashProxiesTrojan,
  ClashProxiesVmess,
  Singbox,
  SingboxOutboundsHttp,
  SingboxOutboundsHysteria,
  SingboxOutboundsSelector,
  SingboxOutboundsShadowsocks,
  SingboxOutboundsSocks,
  SingboxOutboundsTrojan,
  SingboxOutboundsVmess,
} from "./types.ts";

export function convert(
  input: string,
  mergeable?: string,
): string {
  const clash: Clash = Clash.parse(yaml.parse(input));

  const singbox: Singbox = Singbox.parse({
    outbounds: [],
  });
  const singboxSelector: SingboxOutboundsSelector = {
    type: "selector",
    "tag": "selector",
    outbounds: [],
  };
  for (const proxy of clash.proxies) {
    switch (proxy.type) {
      case "http":
        singbox.outbounds.push(
          SingboxOutboundsHttp.parse(convertHttp(proxy)),
        );
        break;
      case "hysteria":
        singbox.outbounds.push(
          SingboxOutboundsHysteria.parse(convertHysteria(proxy)),
        );
        break;
      case "ss":
        singbox.outbounds.push(
          SingboxOutboundsShadowsocks.parse(convertShadowsocks(proxy)),
        );
        break;
      case "socks5":
        singbox.outbounds.push(
          SingboxOutboundsSocks.parse(convertSocks5ToSocks(proxy)),
        );
        break;
      case "trojan":
        singbox.outbounds.push(
          SingboxOutboundsTrojan.parse(convertTrojan(proxy)),
        );
        break;
      case "vmess":
        singbox.outbounds.push(
          SingboxOutboundsVmess.parse(convertVmess(proxy)),
        );
        break;
    }
    singboxSelector.outbounds.push(proxy.name);
  }

  singbox.outbounds.push(SingboxOutboundsSelector.parse(singboxSelector));

  if (mergeable !== undefined) {
    return JSON.stringify(deepmerge(singbox, JSON.parse(mergeable)), null, 4);
  } else {
    return JSON.stringify(singbox, null, 4);
  }
}

function convertHttp(proxy: ClashProxiesHttp): SingboxOutboundsHttp {
  const outbound: SingboxOutboundsHttp = {
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
}

function convertHysteria(
  proxy: ClashProxiesHysteria,
): SingboxOutboundsHysteria {
  const outbound: SingboxOutboundsHysteria = {
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
    outbound.tls.server_name = proxy.server
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
}

function convertShadowsocks(
  proxy: ClashProxiesShadowsocks,
): SingboxOutboundsShadowsocks {
  const outbound: SingboxOutboundsShadowsocks = {
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
}

function convertSocks5ToSocks(
  proxy: ClashProxiesSocks5,
): SingboxOutboundsSocks {
  const outbound: SingboxOutboundsSocks = {
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
}

function convertTrojan(proxy: ClashProxiesTrojan): SingboxOutboundsTrojan {
  const outbound: SingboxOutboundsTrojan = {
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
}

function convertVmess(proxy: ClashProxiesVmess): SingboxOutboundsVmess {
  const outbound: SingboxOutboundsVmess = {
    type: "vmess",
    tag: proxy.name,
    server: proxy.server,
    server_port: proxy.port,
    uuid: proxy.uuid,
    security: proxy.cipher,
    alter_id: proxy.alterId,
  };

  if (proxy["http-opts"] !== undefined) {
    outbound.transport = { "type": "http" };
    if (proxy["http-opts"].path !== undefined) {
      outbound.transport.path = proxy["http-opts"].path[0]!;
    }
    if (proxy["http-opts"].method !== undefined) {
      outbound.transport.method = proxy["http-opts"].method!;
    }
    if (proxy["http-opts"].headers !== undefined) {
      outbound.transport.headers = {};
      for (const [key, value] of Object.entries(proxy["http-opts"].headers!)) {
        outbound.transport.headers[key] = value[0];
      }
    }
  } else if (proxy["h2-opts"] !== undefined) {
    outbound.transport = { type: "http" };
    if (proxy["h2-opts"].host !== undefined) {
      outbound.transport.host = proxy["h2-opts"].host!;
    }
    if (proxy["h2-opts"].path !== undefined) {
      outbound.transport.path = proxy["h2-opts"].path!;
    }
  } else if (proxy["ws-opts"] !== undefined) {
    outbound.transport = { "type": "ws" };
    if (proxy["ws-opts"].path !== undefined) {
      outbound.transport.path = proxy["ws-opts"].path[0]!;
    }
    if (proxy["ws-opts"].headers !== undefined) {
      outbound.transport.headers = proxy["ws-opts"].headers;
      if (proxy["ws-opts"]["max-early-data"] !== undefined) {
        outbound.transport.max_early_data = proxy["ws-opts"]["max-early-data"]!;
      }
      if (proxy["ws-opts"]["early-data-header-name"] !== undefined) {
        outbound.transport.early_data_header_name =
          proxy["ws-opts"]["early-data-header-name"]!;
      }
    }
  } else if (proxy["grpc-opts"] !== undefined) {
    outbound.transport = { "type": "grpc" };
    if (proxy["grpc-opts"]["grpc-service-name"] !== undefined) {
      outbound.transport.service_name =
        proxy["grpc-opts"]["grpc-service-name"]!;
    }
  } else {
    throw new Error("Unsupported transport tcp");
  }
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
}
