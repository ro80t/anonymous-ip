import { describe, expect, it } from "vitest";
import { getProxyProvider, isProxyAsn, PROXY_ASN_PROVIDERS } from "./proxy-asns";

describe("isProxyAsn", () => {
  it("returns true for a known proxy ASN", () => {
    expect(isProxyAsn(201814)).toBe(true);
  });

  it("returns false for an ASN not in the list", () => {
    expect(isProxyAsn(15169)).toBe(false);
  });

  it("returns false for null or undefined", () => {
    expect(isProxyAsn(null)).toBe(false);
    expect(isProxyAsn(undefined)).toBe(false);
  });
});

describe("PROXY_ASN_PROVIDERS", () => {
  it("has no duplicate provider entries for the same ASN", () => {
    const asns = [...PROXY_ASN_PROVIDERS.keys()];
    expect(new Set(asns).size).toBe(asns.length);
  });
});

describe("getProxyProvider", () => {
  it("returns the provider name for a known proxy ASN", () => {
    expect(getProxyProvider(201814)).toBe(PROXY_ASN_PROVIDERS.get(201814));
  });

  it("returns null for an ASN not in the list", () => {
    expect(getProxyProvider(15169)).toBeNull();
  });

  it("returns null for null or undefined", () => {
    expect(getProxyProvider(null)).toBeNull();
    expect(getProxyProvider(undefined)).toBeNull();
  });
});
