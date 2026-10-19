/**
 * Reads the first `X-Forwarded-For` entry, falling back to `X-Real-IP`.
 * Both headers are client-controlled unless a reverse proxy overwrites them.
 */
export function forwardedIp(header: (name: string) => string | null | undefined): string | null {
  const forwardedFor = header("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? null;
  return header("x-real-ip") ?? null;
}

export function fetchRequestIp(request: Request): string | null {
  return forwardedIp((name) => request.headers.get(name));
}
