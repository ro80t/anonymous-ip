import { defineEventHandler, getRequestHeader } from "h3";
import type { H3Event } from "h3";
import { forwardedIp } from "./forwarded-ip";
import { checkAnonymity, type AnonymityCheckResult } from "./index";

export type AnonymousIpContext = { anonymity: AnonymityCheckResult | null };

export interface AnonymousIpOptions {
  /**
   * Extracts the client IP from the event. Defaults to the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP` — both spoofable
   * unless a reverse proxy overwrites them.
   */
  getIp?: (event: H3Event) => string | null | undefined;
}

/**
 * Nuxt/h3 server middleware that runs `checkAnonymity` for the request's
 * client IP and stores the result on `event.context.anonymity` (`null` when
 * no IP is found).
 *
 * @example
 * ```ts
 * // server/middleware/anonymous-ip.ts
 * import { anonymousIp } from "anonymous-ip/nuxt";
 *
 * export default anonymousIp();
 * ```
 */
export function anonymousIp(options: AnonymousIpOptions = {}) {
  const getIp =
    options.getIp ?? ((event: H3Event) => forwardedIp((name) => getRequestHeader(event, name)));

  return defineEventHandler(async (event) => {
    const ip = getIp(event);
    (event.context as Partial<AnonymousIpContext>).anonymity = ip ? await checkAnonymity(ip) : null;
  });
}
