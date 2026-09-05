import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IpGeoInfo } from "./geo";

const lookupIp = vi.fn<(ip: string) => Promise<IpGeoInfo>>();
const isTorExitNode = vi.fn<(ip: string) => Promise<boolean>>();

vi.mock("./geo", () => ({ lookupIp: (ip: string) => lookupIp(ip) }));
vi.mock("./tor", () => ({ isTorExitNode: (ip: string) => isTorExitNode(ip) }));

const { checkAnonymity } = await import("./index");

function geo(asn: number | null): IpGeoInfo {
  return {
    ip: "1.2.3.4",
    asn: { number: asn, organization: asn == null ? null : "Some Org" },
    country: { isoCode: "US", name: "United States" },
    city: { name: null },
  };
}

describe("checkAnonymity", () => {
  beforeEach(() => {
    lookupIp.mockReset();
    isTorExitNode.mockReset();
  });

  it("flags a known VPN ASN and reports its provider", async () => {
    lookupIp.mockResolvedValue(geo(9009));
    isTorExitNode.mockResolvedValue(false);

    const result = await checkAnonymity("1.2.3.4");

    expect(result.isVpn).toBe(true);
    expect(result.isProxy).toBe(false);
    expect(result.isTor).toBe(false);
    expect(result.provider).toBe("M247 (NordVPN)");
    expect(result.proxyProvider).toBeNull();
  });

  it("flags a known proxy ASN and reports its provider", async () => {
    lookupIp.mockResolvedValue(geo(201814));
    isTorExitNode.mockResolvedValue(false);

    const result = await checkAnonymity("1.2.3.4");

    expect(result.isVpn).toBe(false);
    expect(result.isProxy).toBe(true);
    expect(result.provider).toBeNull();
    expect(result.proxyProvider).toBe("CroxyProxy (MEVSPACE sp. z o.o.)");
  });

  it("flags a Tor exit node independently of the ASN checks", async () => {
    lookupIp.mockResolvedValue(geo(15169));
    isTorExitNode.mockResolvedValue(true);

    const result = await checkAnonymity("1.2.3.4");

    expect(result.isVpn).toBe(false);
    expect(result.isProxy).toBe(false);
    expect(result.isTor).toBe(true);
    expect(result.provider).toBeNull();
    expect(result.proxyProvider).toBeNull();
  });

  it("reports no flags for a clean IP", async () => {
    lookupIp.mockResolvedValue(geo(15169));
    isTorExitNode.mockResolvedValue(false);

    const result = await checkAnonymity("1.2.3.4");

    expect(result.isVpn).toBe(false);
    expect(result.isProxy).toBe(false);
    expect(result.isTor).toBe(false);
    expect(result.provider).toBeNull();
    expect(result.proxyProvider).toBeNull();
    expect(result.geo.asn.number).toBe(15169);
  });
});
