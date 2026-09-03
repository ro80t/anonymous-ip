import { lookupIp, type IpGeoInfo } from "./geo";
import { isVpnAsn, getVpnProvider } from "./vpn-asns";
import { isTorExitNode } from "./tor";

export * from "./geo";
export * from "./vpn-asns";
export * from "./tor";

export interface VpnCheckResult {
  ip: string;
  isVpn: boolean;
  isTor: boolean;
  provider: string | null;
  geo: IpGeoInfo;
}

/**
 * Looks up an IP's ASN/country/city, checks it against the known
 * VPN/proxy ASN list, and checks it against the Tor exit node list.
 */
export async function checkVpn(ip: string): Promise<VpnCheckResult> {
  const [geo, isTor] = await Promise.all([lookupIp(ip), isTorExitNode(ip)]);
  const asn = geo.asn.number;

  return {
    ip,
    isVpn: isVpnAsn(asn),
    isTor,
    provider: getVpnProvider(asn),
    geo,
  };
}
