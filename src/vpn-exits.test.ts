import { describe, expect, it } from "vitest";
import { getVpnExitProvider } from "./vpn-exits";

describe("getVpnExitProvider", () => {
  it("matches individual AirVPN and NordVPN exits on shared networks", () => {
    expect(getVpnExitProvider("213.152.161.181", 49453)).toBe("AirVPN");
    expect(getVpnExitProvider("37.46.199.70", 6206)).toBe("AirVPN");
    expect(getVpnExitProvider("187.15.136.156", 137409)).toBe("NordVPN");
    expect(getVpnExitProvider("213.152.161.180", 49453)).toBeNull();
    expect(getVpnExitProvider("187.15.136.157", 137409)).toBeNull();
  });

  it("matches both boundaries of each assigned ProtonVPN /24", () => {
    for (const octet of [0, 255]) {
      expect(getVpnExitProvider(`185.159.156.${octet}`, 8473)).toBe("ProtonVPN");
      expect(getVpnExitProvider(`185.159.158.${octet}`, 56704)).toBe("ProtonVPN");
    }
    expect(getVpnExitProvider("185.159.155.255", 8473)).toBeNull();
    expect(getVpnExitProvider("185.159.157.0", 8473)).toBeNull();
    expect(getVpnExitProvider("185.159.157.255", 56704)).toBeNull();
    expect(getVpnExitProvider("185.159.159.0", 56704)).toBeNull();
  });

  it("requires the recorded origin ASN even for a known exit address", () => {
    // KDDI residential routes can use reassigned addresses.
    expect(getVpnExitProvider("187.15.136.156", 2516)).toBeNull();
    expect(getVpnExitProvider("213.152.161.181", 6206)).toBeNull();
    expect(getVpnExitProvider("185.159.156.15", 56704)).toBeNull();
    expect(getVpnExitProvider("185.159.156.15", null)).toBeNull();
  });

  it("matches IPv4-mapped IPv6 in dotted, compressed and expanded notation", () => {
    expect(getVpnExitProvider("::ffff:37.46.199.70", 6206)).toBe("AirVPN");
    expect(getVpnExitProvider("::ffff:252e:c746", 6206)).toBe("AirVPN");
    expect(getVpnExitProvider("0:0:0:0:0:FFFF:B99F:9CFF", 8473)).toBe("ProtonVPN");
  });

  it("skips native IPv6 and malformed addresses", () => {
    expect(getVpnExitProvider("2001:db8::ffff:252e:c746", 6206)).toBeNull();
    expect(getVpnExitProvider("::252e:c746", 6206)).toBeNull();
    expect(getVpnExitProvider("185.159.156.999", 8473)).toBeNull();
  });
});
