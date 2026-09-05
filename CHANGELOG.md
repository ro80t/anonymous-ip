# anonymous-ip

## 2.1.0

### Minor Changes

- [`78f29d2`](https://github.com/ro80t/anonymous-ip/commit/78f29d25d408cb51aa29a0c754e8d2680225a08b) Thanks [@ro80t](https://github.com/ro80t)! - Add 4 more ASNs to `VPN_ASN_PROVIDERS` (Astrill VPN, WiTopia, IVPN) and 6 more to `PROXY_ASN_PROVIDERS` (HostRoyale in India, Alsycon B.V. in the Netherlands, Belcloud in Bulgaria, Cyberdyne S.A. in the AFRINIC region), further broadening geographic and provider-type coverage. Each entry was independently verified against RIPEstat whois data before inclusion.

- [`c74d2e5`](https://github.com/ro80t/anonymous-ip/commit/c74d2e5903cb8617813b4934c9c6cd339a6d478a) Thanks [@ro80t](https://github.com/ro80t)! - Add 3 more ASNs to `PROXY_ASN_PROVIDERS`: a second Rayobyte/Sprious LLC ASN, and two well-documented bulletproof hosting networks — Chang Way Technologies (Hong Kong) and Media Land LLC (Russia). Each entry was independently verified against RIPEstat/ARIN whois data before inclusion.

## 2.0.0

### Major Changes

- [`d5918fb`](https://github.com/ro80t/anonymous-ip/commit/d5918fb46ed2cd3d3e492362891355d5c366e907) Thanks [@ro80t](https://github.com/ro80t)! - **Breaking:** `AnonymityCheckResult` now ties each flag to its provider field at the type level, and `provider` is renamed to `vpnProvider` for symmetry with `proxyProvider`.

  ```diff
  -provider: string | null;
  -proxyProvider: string | null;
  +// isVpn: true  -> vpnProvider: string
  +// isVpn: false -> vpnProvider: null
  +// isProxy: true  -> proxyProvider: string
  +// isProxy: false -> proxyProvider: null
  ```

  Once you've checked `result.isVpn` (or `result.isProxy`), TypeScript narrows `vpnProvider`/`proxyProvider` to `string` for you — no more `provider !== null` checks needed alongside the flag. Update any code reading `result.provider` to `result.vpnProvider`.

### Minor Changes

- [`013e303`](https://github.com/ro80t/anonymous-ip/commit/013e303705b9f498328da5f794698e8b7eef233b) Thanks [@ro80t](https://github.com/ro80t)! - Add 9 more ASNs to `PROXY_ASN_PROVIDERS`, broadening geographic coverage beyond the initial seed set: Melbikomas UAB (Lithuania, proxy/data-collection infrastructure), DataImpulse (Softoria LLC), and bulletproof hosting/proxy infrastructure in Malaysia (Shinjiru), Ukraine (VAIZ Partner, E-Rishennya, FDN3), and Bulgaria (Roza Holidays, SS-Net). Each entry was independently verified against RIPEstat whois data before inclusion.

## 1.0.0

### Major Changes

- [`32467dd`](https://github.com/ro80t/anonymous-ip/commit/32467dda585d52b4cab2c328b9df95f9ab6e325b) Thanks [@ro80t](https://github.com/ro80t)! - **Breaking:** Rename `checkVpn` to `checkAnonymity` and `VpnCheckResult` to `AnonymityCheckResult`. The function already reported Tor exit node status alongside the VPN/ASN check, which the old name didn't reflect, and more anonymization signals (e.g. proxy detection) are planned. Update imports:

  ```diff
  -import { checkVpn, type VpnCheckResult } from "anonymous-ip";
  +import { checkAnonymity, type AnonymityCheckResult } from "anonymous-ip";

  -const result = await checkVpn(ip);
  +const result = await checkAnonymity(ip);
  ```

  The shape of the result (`ip`, `isVpn`, `isTor`, `provider`, `geo`) is unchanged.

### Minor Changes

- [`e385f90`](https://github.com/ro80t/anonymous-ip/commit/e385f908694dfc18d9c0f58533b59910676bb0fa) Thanks [@ro80t](https://github.com/ro80t)! - Add proxy ASN detection, mirroring the existing VPN ASN detection. `src/proxy-asns.ts` exports `PROXY_ASN_PROVIDERS`, `isProxyAsn`, and `getProxyProvider`; `checkAnonymity` now also returns `isProxy` and `proxyProvider`.

  Two ASNs previously listed only in `VPN_ASN_PROVIDERS` (CroxyProxy and Rayobyte, ASNs 201814 and 64267) were open/commercial proxy services rather than consumer VPNs, so they moved to `PROXY_ASN_PROVIDERS`: `isVpnAsn`/`checkAnonymity().isVpn` will now report `false` for these two ASNs, while `isProxyAsn`/`checkAnonymity().isProxy` reports `true`. A few ASNs that genuinely serve both purposes (Aeza Group, 1337 Services/EliteTeam, IP Volume inc) remain listed in both maps.

## 0.4.0

### Minor Changes

- [`501ff88`](https://github.com/ro80t/anonymous-ip/commit/501ff8827c53d14805e0724a8abbbf543a7a3120) Thanks [@ro80t](https://github.com/ro80t)! - Add 10 more ASNs to `VPN_ASN_PROVIDERS`, broadening coverage beyond mainstream consumer VPN brands: PureVPN, hide.me, a second Datacamp/CDN77 ASN, two dedicated Tor-relay-operator ASNs (Foundation for Applied Privacy, FlokiNET), and a new "bulletproof/anonymity hosting" category (Aeza Group, 1337 Services/EliteTeam) frequently used to front VPN and proxy traffic. Each entry was independently verified against RIPEstat/ARIN whois data before inclusion.

## 0.3.0

### Minor Changes

- [`2db8b58`](https://github.com/ro80t/anonymous-ip/commit/2db8b5844df711702a14ef45507586e6311ab8f1) Thanks [@ro80t](https://github.com/ro80t)! - Expand `VPN_ASN_PROVIDERS` with 19 additional VPN/proxy/Tor ASNs, including smaller secondary ASNs used by already-listed providers (ProtonVPN, Mullvad, PIA, Opera VPN, etc.) and a few previously-unlisted providers (IPVanish, Windscribe, AzireVPN, PrivateVPN, VyprVPN, Speedify, HMA, CroxyProxy, Rayobyte). Each entry was independently verified against RIPEstat/ARIN whois data before inclusion.

## 0.2.0

### Minor Changes

- [`b4eb17b`](https://github.com/ro80t/anonymous-ip/commit/b4eb17be5b48f30710399c723c34b946d4e97b25) Thanks [@ro80t](https://github.com/ro80t)! - Add Tor exit node detection, backed by the official Tor Project bulk exit list. `checkVpn` results now include an `isTor` flag, and `isTorExitNode`, `getTorExitNodes`, and `clearTorExitNodeCache` are exported for direct use.

## 0.1.0

### Minor Changes

- [`e23c3d8`](https://github.com/ro80t/anonymous-ip/commit/e23c3d80ee972aa1d8b133295eaab33dc33da99c) Thanks [@ro80t](https://github.com/ro80t)! - feat: add checkVpn func
