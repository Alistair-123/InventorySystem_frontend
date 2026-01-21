const API_URL = "http://localhost:5000";

export function resolveImageUrl(path?: string | null) {
  if (!path) return null;

  // already absolute
  if (path.startsWith("http")) return path;

  return `${API_URL}/${path}`;
}
