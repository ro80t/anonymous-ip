---
"anonymous-ip": minor
---

Add `anonymousIp` Hono middleware (`anonymous-ip/hono`) that runs `checkAnonymity` for the request's client IP and exposes the result via `c.get("anonymity")`.
