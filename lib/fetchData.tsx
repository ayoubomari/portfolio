import { ApiResponse, FetchOptions } from "@/types/api";

// Fetch data from the API
export async function fetchData<T>(
  url: string,
  options: FetchOptions = {}, // Use default empty object
  isNoCache = false,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...(isNoCache ? { cache: "no-store" } : { cache: "force-cache" }), // Ensure fresh data on every request if isNoCache is true
      ...options, // Merge custom options with defaults
    });

    if (!response.ok) {
      // Extract error message from the response body
      const errorData = await response.json();
      return { ok: false, error: errorData.error || "Unknown error occurred" };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}
