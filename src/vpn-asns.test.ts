import { describe, expect, it } from "vitest";
import { getVpnProvider, isVpnAsn, VPN_ASN_PROVIDERS } from "./vpn-asns";

describe("isVpnAsn", () => {
  it("returns true for a known VPN/proxy ASN", () => {
    expect(isVpnAsn(9009)).toBe(true);
  });

  it("returns false for an ASN not in the list", () => {
    expect(isVpnAsn(15169)).toBe(false);
  });

  it("returns false for null or undefined", () => {
    expect(isVpnAsn(null)).toBe(false);
    expect(isVpnAsn(undefined)).toBe(false);
  });
});

describe("VPN_ASN_PROVIDERS", () => {
  it("has no duplicate provider entries for the same ASN", () => {
    const asns = [...VPN_ASN_PROVIDERS.keys()];
    expect(new Set(asns).size).toBe(asns.length);
  });
});

describe("getVpnProvider", () => {
  it("returns the provider name for a known VPN/proxy ASN", () => {
    expect(getVpnProvider(9009)).toBe(VPN_ASN_PROVIDERS.get(9009));
  });

  it("returns null for an ASN not in the list", () => {
    expect(getVpnProvider(15169)).toBeNull();
  });

  it("returns null for null or undefined", () => {
    expect(getVpnProvider(null)).toBeNull();
    expect(getVpnProvider(undefined)).toBeNull();
  });
});
