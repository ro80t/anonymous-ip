/**
 * Known ASNs belonging to open/commercial proxy providers (web proxies,
 * SOCKS5/HTTP proxy resellers, scraping proxy networks, bulletproof
 * hosting fronting proxy traffic) — distinct from consumer VPN client
 * apps, which are tracked in `vpn-asns.ts`. A handful of ASNs are known
 * to serve both purposes and appear in both lists.
 *
 * Every entry was independently verified against RIPEstat/ARIN whois
 * data before inclusion; ASN-to-provider mapping changes over time as
 * providers migrate infrastructure, so keep this list updated.
 */
export const PROXY_ASN_PROVIDERS: ReadonlyMap<number, string> = new Map([
  [201814, "CroxyProxy (MEVSPACE sp. z o.o.)"],
  [64267, "Rayobyte proxy (Sprious LLC)"],
  [140902, "Infatica proxy network (Infatica Pte. Ltd)"],
  [202425, "IP Volume inc (proxy / whitelabel VPN hosting)"],
  [210644, "Aeza Group (bulletproof hosting / proxy infrastructure)"],
  [216246, "Aeza Group (bulletproof hosting / proxy infrastructure)"],
  [51381, "1337 Services / EliteTeam (VPN & proxy infrastructure)"],
  [56873, "1337 Services / EliteTeam (VPN & proxy infrastructure)"],
  [210558, "1337 Services / EliteTeam (VPN & proxy infrastructure)"],
  [8849, "Melbikomas UAB (Lithuania proxy / data-collection infrastructure)"],
  [56630, "Melbikomas UAB (Lithuania proxy / data-collection infrastructure)"],
  [401645, "DataImpulse proxy network (Softoria LLC)"],
  [45420, "Bulletproof hosting / proxy infrastructure (Shinjiru, Malaysia)"],
  [61432, "Bulletproof hosting / proxy infrastructure (VAIZ Partner, Ukraine)"],
  [210950, "Bulletproof hosting / proxy infrastructure (E-Rishennya, Ukraine)"],
  [211736, "Bulletproof hosting / proxy infrastructure (FDN3, Ukraine)"],
  [212283, "Bulletproof hosting / proxy infrastructure (Roza Holidays, Bulgaria)"],
  [204428, "Bulletproof hosting / proxy infrastructure (SS-Net, Bulgaria)"],
]);

/** Returns true if the given ASN belongs to a known proxy provider. */
export function isProxyAsn(asn: number | null | undefined): boolean {
  return asn != null && PROXY_ASN_PROVIDERS.has(asn);
}

/** Returns the known proxy provider name for an ASN, or null. */
export function getProxyProvider(asn: number | null | undefined): string | null {
  if (asn == null) return null;
  return PROXY_ASN_PROVIDERS.get(asn) ?? null;
}
