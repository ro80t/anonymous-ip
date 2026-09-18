import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnonymityCheckResult } from "./index";

const checkAnonymity = vi.fn<(ip: string) => Promise<AnonymityCheckResult>>();

vi.mock("./index", () => ({ checkAnonymity: (ip: string) => checkAnonymity(ip) }));

const { anonymousIp } = await import("./hono");
type Env = { Variables: import("./hono").AnonymousIpVariables };

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

describe("anonymousIp", () => {
  beforeEach(() => {
    checkAnonymity.mockReset();
  });

  it("looks up the IP from X-Forwarded-For and exposes it via c.get", async () => {
    checkAnonymity.mockResolvedValue(result("185.212.170.1"));
    const app = new Hono<Env>();
    app.use(anonymousIp());
    app.get("/", (c) => c.json(c.get("anonymity")));

    const res = await app.request("/", {
      headers: { "x-forwarded-for": "185.212.170.1, 10.0.0.1" },
    });

    expect(checkAnonymity).toHaveBeenCalledWith("185.212.170.1");
    expect(await res.json()).toEqual(result("185.212.170.1"));
  });

  it("falls back to X-Real-IP when there is no X-Forwarded-For", async () => {
    checkAnonymity.mockResolvedValue(result("8.8.8.8"));
    const app = new Hono<Env>();
    app.use(anonymousIp());
    app.get("/", (c) => c.json(c.get("anonymity")));

    await app.request("/", { headers: { "x-real-ip": "8.8.8.8" } });

    expect(checkAnonymity).toHaveBeenCalledWith("8.8.8.8");
  });

  it("sets anonymity to null and skips the lookup when no IP can be resolved", async () => {
    const app = new Hono<Env>();
    app.use(anonymousIp());
    app.get("/", (c) => c.json(c.get("anonymity")));

    const res = await app.request("/");

    expect(checkAnonymity).not.toHaveBeenCalled();
    expect(await res.json()).toBeNull();
  });

  it("uses a custom getIp when provided", async () => {
    checkAnonymity.mockResolvedValue(result("1.2.3.4"));
    const app = new Hono<Env>();
    app.use(anonymousIp({ getIp: (c) => c.req.header("cf-connecting-ip") }));
    app.get("/", (c) => c.json(c.get("anonymity")));

    await app.request("/", { headers: { "cf-connecting-ip": "1.2.3.4" } });

    expect(checkAnonymity).toHaveBeenCalledWith("1.2.3.4");
  });
});
