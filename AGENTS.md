# Agent notes for anonymous-ip

`anonymous-ip` looks up an IP's ASN/country/city (MaxMind GeoLite2) and checks
it against curated VPN/proxy ASN lists plus the Tor exit node list. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for project layout, scripts, and the
release process.

## Skills

- [`add-asn-provider`](.agents/skills/add-asn-provider/SKILL.md) — adding or
  updating an ASN entry in `src/vpn-asns.ts` / `src/proxy-asns.ts`. This is
  the most common recurring change in this repo; use it whenever a task
  involves adding VPN/proxy coverage.

## Commands

- `/preflight` — runs the full local CI-equivalent check (lint, format check,
  typecheck, test, build) before opening a PR.
