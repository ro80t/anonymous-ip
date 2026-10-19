import type { APIContext, MiddlewareHandler } from "astro";
import { fetchRequestIp } from "./forwarded-ip";
import { checkAnonymity, type AnonymityCheckResult } from "./index";

export type AnonymousIpLocals = { anonymity: AnonymityCheckResult | null };

export interface AnonymousIpOptions {
  /**
   * Extracts the client IP from the context. Defaults to the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP` — both spoofable
   * unless a reverse proxy overwrites them. Pass `getIp` (e.g.
   * `(context) => context.clientAddress`) to read a trustworthy source.
   */
  getIp?: (context: APIContext) => string | null | undefined;
}

/**
 * Astro middleware that runs `checkAnonymity` for the request's client IP and
 * stores the result on `Astro.locals.anonymity` (`null` when no IP is found).
 * Declare `anonymity` on `App.Locals` (see `AnonymousIpLocals`).
 *
 * @example
 * ```ts
 * // src/middleware.ts
 * import { anonymousIp } from "anonymous-ip/astro";
 *
 * export const onRequest = anonymousIp();
 * ```
 */
export function anonymousIp(options: AnonymousIpOptions = {}): MiddlewareHandler {
  const getIp = options.getIp ?? ((context: APIContext) => fetchRequestIp(context.request));

  return async (context, next) => {
    const ip = getIp(context);
    (context.locals as Partial<AnonymousIpLocals>).anonymity = ip ? await checkAnonymity(ip) : null;
    return next();
  };
}
