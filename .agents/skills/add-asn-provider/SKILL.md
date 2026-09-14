---
name: add-asn-provider
description: Add or update an ASN entry in src/vpn-asns.ts or src/proxy-asns.ts. Use when the user wants to add a VPN/proxy provider's ASN, report a false negative (an ASN that should be flagged but isn't), or asks to expand VPN/proxy coverage. This is the most common recurring change in this repo.
---

# Adding a VPN/proxy ASN

This repo's core value is its curated `VPN_ASN_PROVIDERS` (`src/vpn-asns.ts`) and
`PROXY_ASN_PROVIDERS` (`src/proxy-asns.ts`) maps. False positives hurt every
consumer of the package, so every entry must be independently verified — never
add an ASN just because a user or issue claims it's a VPN/proxy.

## Steps

1. **Verify the ASN**, don't trust the request. Look it up via RIPEstat
   (`https://stat.ripe.net/AS<number>`) or ARIN/RDAP whois and confirm the
   organization name actually matches a known VPN or proxy provider. If the
   org name is ambiguous or clearly a generic hosting company with no
   VPN/proxy evidence, don't add it — ask for a source instead.
2. **Pick the right list.**
   - Consumer VPN client apps (NordVPN, Surfshark, Mullvad, ProtonVPN, ...) →
     `src/vpn-asns.ts`.
   - Open/commercial proxy resellers, scraping proxy networks, bulletproof
     hosting fronting proxy traffic → `src/proxy-asns.ts`.
   - A handful of ASNs legitimately serve both purposes and belong in both
     files — check the other file before assuming it's exclusive.
3. **Check for an existing entry.** Grep the target file for the ASN number
   first; do not add a duplicate key to the `Map`.
4. **Add the entry** as `[asnNumber, "Provider name (registered org, if it adds
clarity)"]`, matching the existing style in that file (see nearby entries).
   Keep the list in roughly the order it already uses (append near the end is
   fine — it's not strictly sorted).
5. **No test changes needed** for a simple addition — `vpn-asns.test.ts` /
   `proxy-asns.test.ts` already assert "no duplicate keys" generically, so a
   correctly-added entry passes as-is. Only touch the test file if you're
   changing behavior (e.g. adding a new exported helper).
6. **Run the check**: `bun run lint && bun run typecheck && bun run test`
   (or just `/preflight`).
7. **Add a changeset**: `bunx changeset` — this is a `minor` bump (new
   detection coverage is a public behavior change), described from the
   consumer's point of view, e.g. "Add ASN 12345 (ExampleVPN) to
   VPN_ASN_PROVIDERS."

## Red flags — stop and ask instead of guessing

- The requester provides no evidence beyond "trust me" that the ASN is a
  VPN/proxy.
- The ASN belongs to a large general-purpose cloud/hosting provider (AWS,
  OVH, Hetzner, DigitalOcean, ...) — these host plenty of non-VPN traffic and
  adding them would cause widespread false positives. This package tracks
  _dedicated_ VPN/proxy ASNs, not generic datacenter ranges.
- Two different provider names are being proposed for the same ASN — resolve
  the conflict via whois before picking one.
