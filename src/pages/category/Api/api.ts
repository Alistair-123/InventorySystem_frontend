import axiosInstance from "@/utils/axiosInstance"
import type {
  ApiResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  GetCategory,
} from "../Types/type"

/* =======================
   CREATE
======================= */
export async function createCategory(
  payload: CreateCategoryPayload
): Promise<GetCategory> {
  const { data } = await axiosInstance.post<ApiResponse<GetCategory>>(
    "/category/createcategory",
    payload
  )

  return data.data
}

/* =======================
   READ (ALL)
======================= */
export async function getCategories(): Promise<GetCategory[]> {
  const { data } = await axiosInstance.get<ApiResponse<GetCategory[]>>(
    "/category/getcategories"
  )

  return data.data
}

/* =======================
   UPDATE
======================= */
export async function updateCategory(
  categoryId: string,
  payload: UpdateCategoryPayload
): Promise<GetCategory> {
  const { data } = await axiosInstance.put<ApiResponse<GetCategory>>(
    `/category/updatecategory/${categoryId}`,
    payload
  )

  return data.data
}

/* =======================
   DELETE
======================= */
export async function deleteCategory(
  categoryId: string
): Promise<{ categoryId: string }> {
  const { data } = await axiosInstance.delete<
    ApiResponse<{ categoryId: string }>
  >(`/category/deletecategory/${categoryId}`)

  return data.data
}
