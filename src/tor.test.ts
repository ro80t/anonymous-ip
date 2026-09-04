import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearTorExitNodeCache, getTorExitNodes, isTorExitNode } from "./tor";

function mockFetchOnce(body: string, init: { ok?: boolean; status?: number } = {}) {
  const { ok = true, status = 200 } = init;
  return vi.fn().mockResolvedValueOnce({
    ok,
    status,
    statusText: "status",
    text: () => Promise.resolve(body),
  });
}

describe("tor exit node list", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearTorExitNodeCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("parses the fetched list and reports membership", async () => {
    vi.stubGlobal("fetch", mockFetchOnce("1.2.3.4\n5.6.7.8\n"));

    expect(await isTorExitNode("1.2.3.4")).toBe(true);
    expect(await isTorExitNode("9.9.9.9")).toBe(false);
  });

  it("ignores blank lines and comment lines", async () => {
    vi.stubGlobal("fetch", mockFetchOnce("# comment\n1.2.3.4\n\n5.6.7.8\n"));

    const nodes = await getTorExitNodes();
    expect(nodes).toEqual(new Set(["1.2.3.4", "5.6.7.8"]));
  });

  it("only fetches once while the cache is fresh", async () => {
    const fetchMock = mockFetchOnce("1.2.3.4\n");
    vi.stubGlobal("fetch", fetchMock);

    await getTorExitNodes();
    await getTorExitNodes();
    await getTorExitNodes();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refetches once the cache TTL has expired", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "ok",
        text: () => Promise.resolve("1.2.3.4\n"),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "ok",
        text: () => Promise.resolve("5.6.7.8\n"),
      });
    vi.stubGlobal("fetch", fetchMock);

    await getTorExitNodes();
    vi.advanceTimersByTime(60 * 60 * 1000 + 1);
    const nodes = await getTorExitNodes();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(nodes).toEqual(new Set(["5.6.7.8"]));
  });

  it("throws when the response is not ok and there is no cache", async () => {
    vi.stubGlobal("fetch", mockFetchOnce("", { ok: false, status: 503 }));

    await expect(getTorExitNodes()).rejects.toThrow(/503/);
  });

  it("serves the stale cache when a background refresh fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "ok",
        text: () => Promise.resolve("1.2.3.4\n"),
      })
      .mockRejectedValueOnce(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    await getTorExitNodes();
    vi.advanceTimersByTime(60 * 60 * 1000 + 1);
    const nodes = await getTorExitNodes();

    expect(nodes).toEqual(new Set(["1.2.3.4"]));
  });

  it("clearTorExitNodeCache forces the next lookup to refetch", async () => {
    const fetchMock = mockFetchOnce("1.2.3.4\n");
    vi.stubGlobal("fetch", fetchMock);
    await getTorExitNodes();

    clearTorExitNodeCache();
    vi.stubGlobal("fetch", mockFetchOnce("5.6.7.8\n"));
    const nodes = await getTorExitNodes();

    expect(nodes).toEqual(new Set(["5.6.7.8"]));
  });
});
