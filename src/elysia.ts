import { Elysia } from "elysia";
import { fetchRequestIp } from "./forwarded-ip";
import { checkAnonymity } from "./index";

export interface AnonymousIpOptions {
  /**
   * Extracts the client IP from the request. Defaults to the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP` — both spoofable
   * unless a reverse proxy overwrites them.
   */
  getIp?: (request: Request) => string | null | undefined;
}

/**
 * Elysia plugin that runs `checkAnonymity` for the request's client IP and
 * exposes the result as `anonymity` in every handler context (`null` when no
 * IP is found).
 *
 * @example
 * ```ts
 * import { Elysia } from "elysia";
 * import { anonymousIp } from "anonymous-ip/elysia";
 *
 * new Elysia().use(anonymousIp()).get("/", ({ anonymity }) => anonymity);
 * ```
 */
export function anonymousIp(options: AnonymousIpOptions = {}) {
  const getIp = options.getIp ?? fetchRequestIp;

  return new Elysia({ name: "anonymous-ip" }).derive({ as: "global" }, async ({ request }) => {
    const ip = getIp(request);
    return { anonymity: ip ? await checkAnonymity(ip) : null };
  });
}
