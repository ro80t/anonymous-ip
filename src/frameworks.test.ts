import { Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnonymityCheckResult } from "./index";

const checkAnonymity = vi.fn<(ip: string) => Promise<AnonymityCheckResult>>();

vi.mock("./index", () => ({ checkAnonymity: (ip: string) => checkAnonymity(ip) }));

const express = await import("./express");
const fastify = await import("./fastify");
const next = await import("./next");
const nuxt = await import("./nuxt");
const sveltekit = await import("./sveltekit");
const astro = await import("./astro");
const elysia = await import("./elysia");

const IP = "185.212.170.1";
const headers = { "x-forwarded-for": `${IP}, 10.0.0.1` };

function result(ip: string): AnonymityCheckResult {
  return {
    ip,
    isVpn: true,
    vpnProvider: "M247 (NordVPN)",
    isProxy: false,
    proxyProvider: null,
    isTor: false,
    geo: {
      ip,
      asn: { number: 9009, organization: "M247 Europe SRL" },
      country: { isoCode: "CH", name: "Switzerland" },
      city: { name: "Zurich" },
    },
  };
}

describe("framework adapters", () => {
  beforeEach(() => {
    checkAnonymity.mockReset();
    checkAnonymity.mockImplementation(async (ip) => result(ip));
  });

  it("express stores the result on res.locals", async () => {
    const res = { locals: {} as Record<string, unknown> };
    const nextFn = vi.fn();
    const req = { get: (name: string) => (headers as Record<string, string>)[name] };

    await express.anonymousIp()(req as never, res as never, nextFn);

    expect(res.locals.anonymity).toEqual(result(IP));
    expect(nextFn).toHaveBeenCalledWith();
  });

  it("express forwards lookup errors to next", async () => {
    const error = new Error("boom");
    checkAnonymity.mockRejectedValue(error);
    const nextFn = vi.fn();
    const req = { get: () => IP };

    await express.anonymousIp()(req as never, { locals: {} } as never, nextFn);

    expect(nextFn).toHaveBeenCalledWith(error);
  });

  it("fastify stores the result on request.anonymity", async () => {
    const request = { headers: { "x-forwarded-for": [`${IP}, 10.0.0.1`] } } as never as {
      anonymity?: AnonymityCheckResult | null;
    };

    await (fastify.anonymousIp() as (r: unknown) => Promise<void>)(request);

    expect(request.anonymity).toEqual(result(IP));
  });

  it("next getAnonymity resolves the result, or null without an IP", async () => {
    expect(await next.getAnonymity(new Request("http://x", { headers }))).toEqual(result(IP));
    expect(await next.getAnonymity(new Request("http://x"))).toBeNull();
  });

  it("nuxt stores the result on event.context", async () => {
    const event = {
      req: new Request("http://x", { headers }),
      context: {} as Record<string, unknown>,
    };

    await (nuxt.anonymousIp() as (e: unknown) => Promise<void>)(event);

    expect(event.context.anonymity).toEqual(result(IP));
  });

  it("sveltekit stores the result on event.locals and resolves", async () => {
    const event = {
      request: new Request("http://x", { headers }),
      locals: {} as Record<string, unknown>,
    };
    const resolve = vi.fn(async () => new Response("ok"));

    await sveltekit.anonymousIp()({ event, resolve } as never);

    expect(event.locals.anonymity).toEqual(result(IP));
    expect(resolve).toHaveBeenCalledWith(event);
  });

  it("astro stores the result on context.locals and calls next", async () => {
    const context = {
      request: new Request("http://x", { headers }),
      locals: {} as Record<string, unknown>,
    };
    const nextFn = vi.fn(async () => new Response("ok"));

    await astro.anonymousIp()(context as never, nextFn);

    expect(context.locals.anonymity).toEqual(result(IP));
    expect(nextFn).toHaveBeenCalled();
  });

  it("elysia exposes the result to handlers", async () => {
    const app = new Elysia().use(elysia.anonymousIp()).get("/", ({ anonymity }) => anonymity);

    const res = await app.handle(new Request("http://localhost/", { headers }));

    expect(await res.json()).toEqual(result(IP));
  });

  it("skips the lookup and yields null when no IP can be resolved", async () => {
    const res = { locals: {} as Record<string, unknown> };

    await express.anonymousIp()({ get: () => undefined } as never, res as never, vi.fn());

    expect(checkAnonymity).not.toHaveBeenCalled();
    expect(res.locals.anonymity).toBeNull();
  });
});
