import { lookupIp, type IpGeoInfo } from "./geo";
import { getVpnProvider } from "./vpn-asns";
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
 * anonymization signals: the VPN ASN list, the proxy ASN list, and the
 * Tor exit node list.
 */
export async function checkAnonymity(ip: string): Promise<AnonymityCheckResult> {
  const [geo, isTor] = await Promise.all([lookupIp(ip), isTorExitNode(ip)]);
  const asn = geo.asn.number;

  return {
    ip,
    isTor,
    geo,
    ...toVpnSignal(getVpnProvider(asn)),
    ...toProxySignal(getProxyProvider(asn)),
  };
}
