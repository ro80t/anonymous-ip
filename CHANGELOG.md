# anonymous-ip

## 0.3.0

### Minor Changes

- [`2db8b58`](https://github.com/ro80t/anonymous-ip/commit/2db8b5844df711702a14ef45507586e6311ab8f1) Thanks [@ro80t](https://github.com/ro80t)! - Expand `VPN_ASN_PROVIDERS` with 19 additional VPN/proxy/Tor ASNs, including smaller secondary ASNs used by already-listed providers (ProtonVPN, Mullvad, PIA, Opera VPN, etc.) and a few previously-unlisted providers (IPVanish, Windscribe, AzireVPN, PrivateVPN, VyprVPN, Speedify, HMA, CroxyProxy, Rayobyte). Each entry was independently verified against RIPEstat/ARIN whois data before inclusion.

## 0.2.0

### Minor Changes

- [`b4eb17b`](https://github.com/ro80t/anonymous-ip/commit/b4eb17be5b48f30710399c723c34b946d4e97b25) Thanks [@ro80t](https://github.com/ro80t)! - Add Tor exit node detection, backed by the official Tor Project bulk exit list. `checkVpn` results now include an `isTor` flag, and `isTorExitNode`, `getTorExitNodes`, and `clearTorExitNodeCache` are exported for direct use.

## 0.1.0

### Minor Changes

- [`e23c3d8`](https://github.com/ro80t/anonymous-ip/commit/e23c3d80ee972aa1d8b133295eaab33dc33da99c) Thanks [@ro80t](https://github.com/ro80t)! - feat: add checkVpn func
