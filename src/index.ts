import { lookupIp, type IpGeoInfo } from "./geo";
import { isVpnAsn, getVpnProvider } from "./vpn-asns";
import { isTorExitNode } from "./tor";

export * from "./geo";
export * from "./vpn-asns";
export * from "./tor";

export interface AnonymityCheckResult {
  ip: string;
  isVpn: boolean;
  isTor: boolean;
  provider: string | null;
  geo: IpGeoInfo;
}

/**
 * Looks up an IP's ASN/country/city and checks it against known
 * anonymization signals: the VPN/proxy ASN list and the Tor exit node
 * list.
 */
export async function checkAnonymity(ip: string): Promise<AnonymityCheckResult> {
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
