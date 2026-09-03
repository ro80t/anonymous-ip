---
"anonymous-ip": minor
---

Add Tor exit node detection, backed by the official Tor Project bulk exit list. `checkVpn` results now include an `isTor` flag, and `isTorExitNode`, `getTorExitNodes`, and `clearTorExitNodeCache` are exported for direct use.
