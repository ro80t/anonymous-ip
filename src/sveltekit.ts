import type { RequestEvent } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit/hooks";
import { fetchRequestIp } from "./forwarded-ip";
import { checkAnonymity, type AnonymityCheckResult } from "./index";

export type AnonymousIpLocals = { anonymity: AnonymityCheckResult | null };

export interface AnonymousIpOptions {
  /**
   * Extracts the client IP from the event. Defaults to the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP` — both spoofable
   * unless a reverse proxy overwrites them. Pass `getIp` (e.g.
   * `(event) => event.getClientAddress()`) to read a trustworthy source.
   */
  getIp?: (event: RequestEvent) => string | null | undefined;
}

/**
 * SvelteKit `handle` hook that runs `checkAnonymity` for the request's client
 * IP and stores the result on `event.locals.anonymity` (`null` when no IP is
 * found). Declare `anonymity` on `App.Locals` (see `AnonymousIpLocals`).
 *
 * @example
 * ```ts
 * // src/hooks.server.ts
 * import { anonymousIp } from "anonymous-ip/sveltekit";
 *
 * export const handle = anonymousIp();
 * ```
 */
export function anonymousIp(options: AnonymousIpOptions = {}): Handle {
  const getIp = options.getIp ?? ((event: RequestEvent) => fetchRequestIp(event.request));

  return async ({ event, resolve }) => {
    const ip = getIp(event);
    (event.locals as Partial<AnonymousIpLocals>).anonymity = ip ? await checkAnonymity(ip) : null;
    return resolve(event);
  };
}
