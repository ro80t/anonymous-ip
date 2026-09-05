# anonymous-ip

Looks up the ASN, country, and city for an IP address and checks it against known anonymization signals — a curated VPN ASN list, a curated proxy ASN list, and the official Tor exit node list — to detect anonymized connections. Uses [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) via [`geolite2-redist`](https://github.com/GitSquared/node-geolite2-redist), so no MaxMind license key is required.

## Install

```sh
npm install anonymous-ip
pnpm add anonymous-ip
yarn add anonymous-ip
bun add anonymous-ip
```

`typescript` is a peer dependency (only needed if you use the type definitions).

## Usage

### Anonymity detection (VPN + proxy + Tor)

```ts
import { checkAnonymity } from "anonymous-ip";

const result = await checkAnonymity("185.212.170.1");
console.log(result);
// {
//   ip: "185.212.170.1",
//   isVpn: true,
//   isProxy: false,
//   isTor: false,
//   vpnProvider: "M247 (NordVPN)",
//   proxyProvider: null,
//   geo: {
//     ip: "185.212.170.1",
//     asn: { number: 9009, organization: "M247 Europe SRL" },
//     country: { isoCode: "CH", name: "Switzerland" },
//     city: { name: "Zurich" }
//   }
// }

if (result.isVpn) {
  result.vpnProvider; // typed as `string`, not `string | null`
}
```

`checkAnonymity` combines every anonymization signal this package knows about (VPN ASNs, proxy ASNs, and Tor exit nodes today) into one result, so adding new signals later won't require an API rename. A small number of ASNs are known to serve both VPN and proxy traffic and can set both `isVpn` and `isProxy`.

`AnonymityCheckResult` ties each flag to its provider field at the type level: `vpnProvider` is `string` when `isVpn` is `true` and `null` when it's `false` (and likewise for `isProxy`/`proxyProvider`), so TypeScript narrows the provider field for you once you've checked the flag — no manual null check needed.

### Tor exit node detection

`checkAnonymity` includes an `isTor` flag, backed by the official Tor Project bulk exit list (fetched and cached in memory for up to an hour). You can also check a raw IP directly:

```ts
import { isTorExitNode } from "anonymous-ip";

await isTorExitNode("1.2.3.4"); // true if it's a known Tor exit node
```

### Geolocation lookup only

```ts
import { lookupIp } from "anonymous-ip";

const geo = await lookupIp("8.8.8.8");
// {
//   ip: "8.8.8.8",
//   asn: { number: 15169, organization: "Google LLC" },
//   country: { isoCode: "US", name: "United States" },
//   city: { name: null }
// }
```

### Checking a raw ASN

```ts
import { isVpnAsn, getVpnProvider, isProxyAsn, getProxyProvider } from "anonymous-ip";

isVpnAsn(9009); // true
getVpnProvider(9009); // "M247 (NordVPN)"

isProxyAsn(201814); // true
getProxyProvider(201814); // "CroxyProxy (MEVSPACE sp. z o.o.)"
```

### Shutting down

The GeoLite2 databases are downloaded in the background on first use and kept up to date automatically. In short-lived processes (CLIs, tests, serverless functions), close the readers explicitly once you're done.

```ts
import { closeGeoReaders } from "anonymous-ip";

await closeGeoReaders();
```

## API

| Function                                                             | Description                                                                                                                   |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `lookupIp(ip: string): Promise<IpGeoInfo>`                           | Looks up ASN, country, and city for an IP address. Throws if the IP string is invalid.                                        |
| `checkAnonymity(ip: string): Promise<AnonymityCheckResult>`          | Runs `lookupIp` and checks the result against every known anonymization signal (VPN ASN list, proxy ASN list, Tor exit list). |
| `isVpnAsn(asn: number \| null \| undefined): boolean`                | Returns true if the ASN belongs to a known VPN provider.                                                                      |
| `getVpnProvider(asn: number \| null \| undefined): string \| null`   | Returns the known VPN provider name for an ASN, or `null`.                                                                    |
| `isProxyAsn(asn: number \| null \| undefined): boolean`              | Returns true if the ASN belongs to a known proxy provider.                                                                    |
| `getProxyProvider(asn: number \| null \| undefined): string \| null` | Returns the known proxy provider name for an ASN, or `null`.                                                                  |
| `isTorExitNode(ip: string): Promise<boolean>`                        | Returns true if the IP is a known Tor exit node.                                                                              |
| `getTorExitNodes(): Promise<ReadonlySet<string>>`                    | Returns the cached set of known Tor exit node IPs, fetching it if needed.                                                     |
| `clearTorExitNodeCache(): void`                                      | Clears the in-memory Tor exit node cache, forcing the next lookup to refetch.                                                 |
| `closeGeoReaders(): Promise<void>`                                   | Closes the GeoLite2 database readers and stops the background auto-updater.                                                   |
| `VPN_ASN_PROVIDERS`                                                  | `ReadonlyMap<number, string>` of known VPN ASNs to provider names.                                                            |
| `PROXY_ASN_PROVIDERS`                                                | `ReadonlyMap<number, string>` of known proxy ASNs to provider names.                                                          |

## About the VPN and proxy ASN lists

The lists in `src/vpn-asns.ts` and `src/proxy-asns.ts` are small, curated sets — the VPN list seeded from [X4BNet/lists_vpn](https://github.com/X4BNet/lists_vpn), the proxy list built from independently verified entries. A handful of ASNs are known to serve both VPN and proxy traffic and appear in both lists. Providers change infrastructure (and therefore ASNs) frequently, so neither list alone will catch every VPN or proxy. For broader coverage, pull in updates from those sources regularly, or combine them with a wider "datacenter ASN" list (at the cost of more false positives).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, coding conventions, and the release process.

## License

MIT

This package includes GeoLite2 data created by MaxMind, available from [https://www.maxmind.com](https://www.maxmind.com). The data is provided under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). See the [`geolite2-redist` README](https://github.com/GitSquared/node-geolite2-redist#legal-warning) for the full usage restrictions.
