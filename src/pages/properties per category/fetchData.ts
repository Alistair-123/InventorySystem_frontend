import axiosInstance from "@/utils/axiosInstance";

import type {
  CategorySummary,
  PaginatedPropertiesResponse,
} from "./types";

/* =========================================================
   ✅ 1. CATEGORY SUMMARY REPORT
   GET /api/propertycatgory/properties-per-category
   ========================================================= */

export async function fetchCategorySummary(search?: string) {
  const response = await axiosInstance.get<CategorySummary[]>(
    "/propertycatgory/properties-per-category",
    {
      params: search ? { search } : {},
    }
  );

  return response.data;
}

/* =========================================================
   ✅ 2. DRILL DOWN PROPERTIES PER CATEGORY
   GET /api/propertycatgory/category/:categoryId/properties
   Supports:
   - pagination
   - search
   - status filtering
   ========================================================= */

export async function fetchCategoryProperties(params: {
  categoryId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedPropertiesResponse> {
  const {
    categoryId,
    page = 1,
    limit = 10,
    search = "",
    status = "",
  } = params;

  const response = await axiosInstance.get<PaginatedPropertiesResponse>(
    `/propertycatgory/category/${categoryId}/properties`,
    {
      params: {
        page,
        limit,
        search,
        status,
      },
    }
  );

  return response.data;
}
