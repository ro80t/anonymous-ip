import type { Request, RequestHandler } from "express";
import { forwardedIp } from "./forwarded-ip";
import { checkAnonymity } from "./index";

export interface AnonymousIpOptions {
  /**
   * Extracts the client IP from the request. Defaults to the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP` — both spoofable
   * unless a reverse proxy overwrites them. Pass `getIp` (e.g. `req.ip` with
   * `trust proxy` configured) to read a trustworthy source instead.
   */
  getIp?: (req: Request) => string | null | undefined;
}

/**
 * Express middleware that runs `checkAnonymity` for the request's client IP
 * and stores the result on `res.locals.anonymity` (`null` when no IP is found).
 *
 * @example
 * ```ts
 * import express from "express";
 * import { anonymousIp } from "anonymous-ip/express";
 *
 * const app = express();
 * app.use(anonymousIp());
 * app.get("/", (req, res) => res.json(res.locals.anonymity));
 * ```
 */
export function anonymousIp(options: AnonymousIpOptions = {}): RequestHandler {
  const getIp = options.getIp ?? ((req: Request) => forwardedIp((name) => req.get(name)));

  return async (req, res, next) => {
    try {
      const ip = getIp(req);
      res.locals.anonymity = ip ? await checkAnonymity(ip) : null;
      next();
    } catch (error) {
      next(error);
    }
  };
}
