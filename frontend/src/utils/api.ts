import type { ApiError } from "../types";

export async function api<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error: ApiError = await response
      .json()
      .catch(() => ({ error: "Request failed" }));

    throw new Error(error.error || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}
