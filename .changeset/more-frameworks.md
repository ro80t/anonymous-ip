---
"anonymous-ip": minor
---

Add framework integrations alongside the existing Hono middleware: `anonymous-ip/express`, `anonymous-ip/fastify`, `anonymous-ip/nuxt`, `anonymous-ip/sveltekit`, `anonymous-ip/astro`, `anonymous-ip/elysia`, and `anonymous-ip/tanstack-start` (each exports `anonymousIp`), plus `getAnonymity` from `anonymous-ip/next`. Each runs `checkAnonymity` for the request's client IP and exposes the result in the framework's idiomatic place.
