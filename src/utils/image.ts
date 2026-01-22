const API_URL = "http://localhost:5000";

export function resolveImageUrl(image?: string | null) {
  if (!image) return "/image.png";

  // already absolute (future-proof)
  if (image.startsWith("http")) return image;

  // ✅ must include /uploads
  return `${API_URL}/uploads/${image}`;
}
