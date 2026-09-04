import { describe, expect, it } from "vitest";
import { lookupIp } from "./geo";

describe("lookupIp", () => {
  it("rejects invalid IP strings without touching the GeoLite2 databases", async () => {
    await expect(lookupIp("not-an-ip")).rejects.toThrow(/Invalid IP address/);
  });
});
