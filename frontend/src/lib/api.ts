export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000/api";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(opts.headers || {});
  headers.set("Accept", "application/json");
  if (opts.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);

  const res = await fetch(url, { ...opts, headers });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (body && typeof body === "object" && "message" in body && (body as any).message) ||
      res.statusText ||
      "Request failed";
    const err: ApiError = { status: res.status, message: String(msg), details: body };
    throw err;
  }

  // Backend uses { success, message, data }
  if (body && typeof body === "object" && "data" in (body as any)) {
    return (body as any).data as T;
  }
  return body as T;
}

