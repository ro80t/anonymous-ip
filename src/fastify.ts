import type { FastifyRequest, onRequestAsyncHookHandler } from "fastify";
import { forwardedIp } from "./forwarded-ip";
import { checkAnonymity, type AnonymityCheckResult } from "./index";

declare module "fastify" {
  interface FastifyRequest {
    anonymity?: AnonymityCheckResult | null;
  }
}

export interface AnonymousIpOptions {
  /**
   * Extracts the client IP from the request. Defaults to the first
   * `X-Forwarded-For` entry, falling back to `X-Real-IP` — both spoofable
   * unless a reverse proxy overwrites them. Pass `getIp` (e.g. `request.ip`
   * with `trustProxy` configured) to read a trustworthy source instead.
   */
  getIp?: (request: FastifyRequest) => string | null | undefined;
}

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Fastify `onRequest` hook that runs `checkAnonymity` for the request's client
 * IP and stores the result on `request.anonymity` (`null` when no IP is found).
 *
 * @example
 * ```ts
 * import Fastify from "fastify";
 * import { anonymousIp } from "anonymous-ip/fastify";
 *
 * const app = Fastify();
 * app.addHook("onRequest", anonymousIp());
 * app.get("/", async (request) => request.anonymity);
 * ```
 */
export function anonymousIp(options: AnonymousIpOptions = {}): onRequestAsyncHookHandler {
  const getIp =
    options.getIp ??
    ((request: FastifyRequest) => forwardedIp((name) => headerValue(request.headers[name])));

  return async (request) => {
    const ip = getIp(request);
    request.anonymity = ip ? await checkAnonymity(ip) : null;
  };
}
