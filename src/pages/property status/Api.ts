import axios from "@/utils/axiosInstance";
import type { PropertyResponse, PropertyStatus } from "./types";

/**
 * Fetch Properties with:
 * - Pagination
 * - Search
 * - Status Filter
 */
// Core Purpose of the Page
// The page should allow the user to:
// 📌 View all registered properties
// 📌 Quickly locate a property using search
// 📌 Filter assets by their current condition
// 📌 Navigate large datasets efficiently with pagination
// 📌 Monitor which properties are active, lost, or disposed

export const fetchProperties = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: PropertyStatus;
}): Promise<PropertyResponse> => {
  const params: Record<string, any> = {
    page,
    limit,
    search,
  };

  // Only include status if provided
  if (status) {
    params.status = status;
  }

  const { data } = await axios.get<PropertyResponse>(
    "/propertystatus/status",
    { params }
  );

  return data;
};
