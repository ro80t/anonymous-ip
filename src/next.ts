import { fetchRequestIp } from "./forwarded-ip";
import { checkAnonymity, type AnonymityCheckResult } from "./index";

export interface GetAnonymityOptions {
  /**
   * Extracts the client IP from the request. Defaults to the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP` — both spoofable
   * unless a reverse proxy overwrites them.
   */
  getIp?: (request: Request) => string | null | undefined;
}

/**
 * Runs `checkAnonymity` for a Next.js request's client IP; resolves to `null`
 * when no IP is found. Call it from route handlers or Node-runtime middleware
 * (GeoLite2 needs the filesystem, so it can't run on the Edge runtime).
 *
 * @example
 * ```ts
 * // app/api/route.ts
 * import { getAnonymity } from "anonymous-ip/next";
 *
 * export async function GET(request: Request) {
 *   const anonymity = await getAnonymity(request);
 *   if (anonymity?.isVpn) return new Response("VPNs are not allowed", { status: 403 });
 *   return new Response("welcome");
 * }
 * ```
 */
export async function getAnonymity(
  request: Request,
  options: GetAnonymityOptions = {},
): Promise<AnonymityCheckResult | null> {
  const ip = (options.getIp ?? fetchRequestIp)(request);
  return ip ? checkAnonymity(ip) : null;
}
