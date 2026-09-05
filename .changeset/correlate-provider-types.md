---
"anonymous-ip": major
---

**Breaking:** `AnonymityCheckResult` now ties each flag to its provider field at the type level, and `provider` is renamed to `vpnProvider` for symmetry with `proxyProvider`.

```diff
-provider: string | null;
-proxyProvider: string | null;
+// isVpn: true  -> vpnProvider: string
+// isVpn: false -> vpnProvider: null
+// isProxy: true  -> proxyProvider: string
+// isProxy: false -> proxyProvider: null
```

Once you've checked `result.isVpn` (or `result.isProxy`), TypeScript narrows `vpnProvider`/`proxyProvider` to `string` for you — no more `provider !== null` checks needed alongside the flag. Update any code reading `result.provider` to `result.vpnProvider`.
