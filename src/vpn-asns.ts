/**
 * Known ASNs belonging to VPN / proxy / anonymization providers.
 *
 * Seeded from the community-maintained X4BNet/lists_vpn dataset
 * (https://github.com/X4BNet/lists_vpn/blob/main/input/vpn/ASN.txt),
 * plus independently verified additions (including smaller/secondary
 * ASNs run by already-listed providers, verified via RIPEstat/ARIN
 * whois rather than taken as-is from any single source). ASN-to-provider
 * mapping changes over time as providers migrate infrastructure, so keep
 * this list updated (issues/PRs against the source repo above are a good
 * place to check for newly reported VPN ASNs).
 */
export const VPN_ASN_PROVIDERS: ReadonlyMap<number, string> = new Map([
  [9009, "M247 (NordVPN)"],
  [20448, "VPNtranet, LLC."],
  [209854, "Surfshark"],
  [136787, "NordVPN (TEFINCOM S.A.)"],
  [32751, "Octovpn / Xbox VPN"],
  [212238, "Datacamp (VPN)"],
  [50525, "Privado VPN"],
  [207137, "Packethub (NordVPN)"],
  [60729, "Tor Servers (Tor exit nodes)"],
  [398391, "Checkpoint VPN"],
  [401401, "Unredacted VPN provider"],
  [401720, "Unredacted VPN provider"],
  [200373, "3xKTech"],
  [198571, "3xKTech"],
  [208172, "ProtonVPN"],
  [216025, "Mullvad VPN AB"],
  [39351, "Mullvad VPN (31173 Services AB)"],
  [209103, "ProtonVPN (Proton AG)"],
  [62371, "ProtonVPN (Proton AG)"],
  [199218, "ProtonVPN (Proton AG)"],
  [39405, "ProtonVPN / Tor (Eurofiber France SAS)"],
  [45748, "Private Internet Access (PIA)"],
  [140952, "Private Internet Access / whitelabel VPN (Strong Technology, LLC)"],
  [46253, "IPVanish"],
  [397540, "Windscribe"],
  [42675, "AzireVPN (Obehosting AB)"],
  [42201, "PrivateVPN (PVDataNet AB)"],
  [30094, "VyprVPN (Golden Frog / Giganews)"],
  [202425, "Speedify VPN (IP Volume inc)"],
  [198605, "HMA VPN (Gen Digital / Avast Software)"],
  [197854, "Mullvad VPN (Eisenia AB)"],
  [205016, "Opera VPN (HERN Labs AB)"],
  [39832, "Opera VPN (Opera Norway AS)"],
  [33837, "Tor exit nodes (PRQ / Fredrik Holmqvist)"],
  [201814, "CroxyProxy (MEVSPACE sp. z o.o.)"],
  [64267, "Rayobyte proxy (Sprious LLC)"],
  [394087, "PureVPN (Secure Internet LLC)"],
  [60068, "Datacamp (VPN) / CDN77"],
  [206264, "hide.me VPN (Amarutu Technology Ltd)"],
  [210644, "Aeza Group (bulletproof hosting / proxy infrastructure)"],
  [216246, "Aeza Group (bulletproof hosting / proxy infrastructure)"],
  [51381, "1337 Services / EliteTeam (VPN & proxy infrastructure)"],
  [56873, "1337 Services / EliteTeam (VPN & proxy infrastructure)"],
  [210558, "1337 Services / EliteTeam (VPN & proxy infrastructure)"],
  [208323, "Tor relays (Foundation for Applied Privacy)"],
  [200651, "Anonymity-focused hosting / Tor (FlokiNET)"],
]);

/** Returns true if the given ASN belongs to a known VPN/proxy provider. */
export function isVpnAsn(asn: number | null | undefined): boolean {
  return asn != null && VPN_ASN_PROVIDERS.has(asn);
}

/** Returns the known VPN/proxy provider name for an ASN, or null. */
export function getVpnProvider(asn: number | null | undefined): string | null {
  if (asn == null) return null;
  return VPN_ASN_PROVIDERS.get(asn) ?? null;
}
