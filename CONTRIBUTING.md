# Contributing

## Setup

```sh
bun install
```

## Project layout

- `src/geo.ts` — GeoLite2 lookups (`lookupIp`, `closeGeoReaders`)
- `src/vpn-asns.ts` — known VPN/proxy ASN list (`VPN_ASN_PROVIDERS`, `isVpnAsn`, `getVpnProvider`)
- `src/tor.ts` — Tor exit node detection, backed by the official Tor Project bulk exit list (`isTorExitNode`, `getTorExitNodes`, `clearTorExitNodeCache`)
- `src/index.ts` — public entry point, combines the above into `checkVpn`

## Scripts

```sh
bun run lint          # static analysis via oxlint
bun run format        # format code with oxfmt
bun run format:check  # check formatting only
bun run typecheck     # tsc --noEmit
bun run build          # build dist/ with tsdown
```

Run all of the above (as CI does, see `.github/workflows/ci.yml`) before opening a PR.

## Updating the VPN/proxy ASN list

`src/vpn-asns.ts` is seeded from [X4BNet/lists_vpn](https://github.com/X4BNet/lists_vpn/blob/main/input/vpn/ASN.txt). When adding an ASN, verify it against that dataset (or another reliable source) and note the provider name — avoid adding unverified entries, since false positives affect every consumer of this package.

## Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Every PR that changes published behavior should include a changeset:

```sh
bunx changeset
```

Follow the prompts to describe the change and pick a semver bump (patch/minor/major).

Once merged to `main`, GitHub Actions (`.github/workflows/release.yml`) opens or updates a "Version Packages" PR. Merging that PR builds the package and publishes it to npm via Trusted Publishing (OIDC) — no manual `npm publish` or token is needed.
