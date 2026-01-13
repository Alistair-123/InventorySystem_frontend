export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
}

// // Why:
// Prevents typo bugs
// Makes cache control predictable
// Scales cleanly