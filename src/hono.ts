import type { Context, MiddlewareHandler } from "hono";
import { checkAnonymity, type AnonymityCheckResult } from "./index";

export type AnonymousIpVariables = {
  anonymity: AnonymityCheckResult | null;
};

export interface AnonymousIpOptions {
  /**
   * Extracts the client IP from the request. Defaults to reading the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP`. Override this on
   * platforms where the client IP comes from elsewhere (e.g. `hono/conninfo`).
   */
  getIp?: (c: Context) => string | null | undefined;
}

function defaultGetIp(c: Context): string | null {
  const forwardedFor = c.req.header("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }
  return c.req.header("x-real-ip") ?? null;
}

/**
 * Hono middleware that runs `checkAnonymity` for the request's client IP and
 * stores the result on the context. Access it downstream with
 * `c.get("anonymity")`; it's `null` when no IP could be resolved.
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { anonymousIp, type AnonymousIpVariables } from "anonymous-ip/hono";
 *
 * const app = new Hono<{ Variables: AnonymousIpVariables }>();
 * app.use(anonymousIp());
 * app.get("/", (c) => c.json(c.get("anonymity")));
 * ```
 */
export function anonymousIp(
  options: AnonymousIpOptions = {},
): MiddlewareHandler<{ Variables: AnonymousIpVariables }> {
  const getIp = options.getIp ?? defaultGetIp;

  return async (c, next) => {
    const ip = getIp(c);
    c.set("anonymity", ip ? await checkAnonymity(ip) : null);
    await next();
  };
}
