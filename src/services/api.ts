const API_BASE_URL = "http://localhost:8000/api";

export async function fetchFromApi(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error: ${res.status} - ${error}`);
  }

  return res.json();
}
