---
"anonymous-ip": minor
---

Add proxy ASN detection, mirroring the existing VPN ASN detection. `src/proxy-asns.ts` exports `PROXY_ASN_PROVIDERS`, `isProxyAsn`, and `getProxyProvider`; `checkAnonymity` now also returns `isProxy` and `proxyProvider`.

Two ASNs previously listed only in `VPN_ASN_PROVIDERS` (CroxyProxy and Rayobyte, ASNs 201814 and 64267) were open/commercial proxy services rather than consumer VPNs, so they moved to `PROXY_ASN_PROVIDERS`: `isVpnAsn`/`checkAnonymity().isVpn` will now report `false` for these two ASNs, while `isProxyAsn`/`checkAnonymity().isProxy` reports `true`. A few ASNs that genuinely serve both purposes (Aeza Group, 1337 Services/EliteTeam, IP Volume inc) remain listed in both maps.
