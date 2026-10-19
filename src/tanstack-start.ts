import { createMiddleware } from "@tanstack/react-start";
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
 * TanStack Start request middleware that runs `checkAnonymity` for the
 * request's client IP and exposes the result as `context.anonymity` (`null`
 * when no IP is found).
 *
 * @example
 * ```ts
 * // src/start.ts
 * import { createStart } from "@tanstack/react-start";
 * import { anonymousIp } from "anonymous-ip/tanstack-start";
 *
 * export const startInstance = createStart(() => ({
 *   requestMiddleware: [anonymousIp()],
 * }));
 * ```
 */
export function anonymousIp(options: AnonymousIpOptions = {}) {
  const getIp = options.getIp ?? fetchRequestIp;

  return createMiddleware({ type: "request" }).server(async ({ request, next }) => {
    const ip = getIp(request);
    return next({ context: { anonymity: ip ? await checkAnonymity(ip) : null } });
  });
}
