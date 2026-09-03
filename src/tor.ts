/**
 * Tor exit node detection.
 *
 * Unlike VPN providers, Tor exit relays run across thousands of unrelated
 * ASNs (residential ISPs, hosting providers, universities, etc.), so a
 * static ASN list can't identify them reliably. Instead, this checks IPs
 * against the official Tor Project bulk exit list, which is fetched once
 * and cached in memory for a limited time.
 */

const TOR_EXIT_LIST_URL = "https://check.torproject.org/torbulkexitlist";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedNodes: ReadonlySet<string> | undefined;
let cachedAt = 0;
let inFlight: Promise<ReadonlySet<string>> | undefined;

async function fetchTorExitNodes(): Promise<ReadonlySet<string>> {
  const res = await fetch(TOR_EXIT_LIST_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Tor exit node list: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const nodes = new Set<string>();
  for (const line of text.split("\n")) {
    const ip = line.trim();
    if (ip && !ip.startsWith("#")) nodes.add(ip);
  }
  return nodes;
}

/**
 * Returns the current set of known Tor exit node IPs, fetching and
 * caching the official Tor Project bulk exit list as needed. Serves a
 * stale cache if a background refresh fails.
 */
export async function getTorExitNodes(): Promise<ReadonlySet<string>> {
  if (cachedNodes && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedNodes;
  }

  inFlight ??= fetchTorExitNodes()
    .then((nodes) => {
      cachedNodes = nodes;
      cachedAt = Date.now();
      return nodes;
    })
    .catch((err: unknown) => {
      if (cachedNodes) return cachedNodes;
      throw err;
    })
    .finally(() => {
      inFlight = undefined;
    });

  return inFlight;
}

/** Returns true if the given IP is a known Tor exit node. */
export async function isTorExitNode(ip: string): Promise<boolean> {
  const nodes = await getTorExitNodes();
  return nodes.has(ip);
}

/** Clears the in-memory Tor exit node cache, forcing the next lookup to refetch. */
export function clearTorExitNodeCache(): void {
  cachedNodes = undefined;
  cachedAt = 0;
}
