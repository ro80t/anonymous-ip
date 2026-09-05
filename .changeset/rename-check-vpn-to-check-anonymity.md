---
"anonymous-ip": major
---

**Breaking:** Rename `checkVpn` to `checkAnonymity` and `VpnCheckResult` to `AnonymityCheckResult`. The function already reported Tor exit node status alongside the VPN/ASN check, which the old name didn't reflect, and more anonymization signals (e.g. proxy detection) are planned. Update imports:

```diff
-import { checkVpn, type VpnCheckResult } from "anonymous-ip";
+import { checkAnonymity, type AnonymityCheckResult } from "anonymous-ip";

-const result = await checkVpn(ip);
+const result = await checkAnonymity(ip);
```

The shape of the result (`ip`, `isVpn`, `isTor`, `provider`, `geo`) is unchanged.
