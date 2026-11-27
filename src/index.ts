import { lookupIp, type IpGeoInfo } from "./geo";
import { getVpnProvider } from "./vpn-asns";
import { getVpnExitProvider } from "./vpn-exits";
import { getProxyProvider } from "./proxy-asns";
import { isTorExitNode } from "./tor";

export * from "./geo";
export * from "./vpn-asns";
export * from "./proxy-asns";
export * from "./tor";

export type VpnSignal = { isVpn: true; vpnProvider: string } | { isVpn: false; vpnProvider: null };

export type ProxySignal =
  | { isProxy: true; proxyProvider: string }
  | { isProxy: false; proxyProvider: null };

export type AnonymityCheckResult = {
  ip: string;
  isTor: boolean;
  geo: IpGeoInfo;
} & VpnSignal &
  ProxySignal;

function getVpnProviderName(ip: string, asn: number | null): string | null {
  const vpnProvider = getVpnProvider(asn);

  if (vpnProvider)
    return vpnProvider;

  const vpnExitProvider = getVpnExitProvider(ip, asn);

  return vpnExitProvider;
}

function toVpnSignal(vpnProvider: string | null): VpnSignal {
  return vpnProvider != null ? { isVpn: true, vpnProvider } : { isVpn: false, vpnProvider: null };
}

function toProxySignal(proxyProvider: string | null): ProxySignal {
  return proxyProvider != null
    ? { isProxy: true, proxyProvider }
    : { isProxy: false, proxyProvider: null };
}

/**
 * Looks up an IP's ASN/country/city and checks it against known
 * VPN ASNs and exits, proxy ASNs, and Tor exit nodes.
 */
export async function checkAnonymity(ip: string): Promise<AnonymityCheckResult> {
  const [geo, isTor] = await Promise.all([lookupIp(ip), isTorExitNode(ip)]);
  const asn = geo.asn.number;

  return {
    ip,
    isTor,
    geo,
    ...toVpnSignal(getVpnProviderName(ip, asn)),
    ...toProxySignal(getProxyProvider(asn)),
  };
}
