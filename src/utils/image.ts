const API_URL = "http://localhost:5000";

export function resolveImageUrl(image?: string | null) {
  if (!image) return "/image.png";

  // Already absolute (cloud or external)
  if (image.startsWith("http")) return image;

  // Ensure only ONE /uploads
  return image.startsWith("/")
    ? `${API_URL}${image}`
    : `${API_URL}/${image}`;
}
