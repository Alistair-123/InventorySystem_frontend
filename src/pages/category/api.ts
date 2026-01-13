import axiosInstance from "@/utils/axiosInstance"
import type { CreateCategoryPayload, GetCategory, ApiResponse } from "./type"

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<CreateCategoryPayload> {
  
  const { data } = await axiosInstance.post<CreateCategoryPayload>(
    "/category/createcategory",
    payload
  )
  return data
}

export async function getCategories(): Promise<GetCategory[]> {
  const { data } = await axiosInstance.get<ApiResponse<GetCategory[]>>(
    "/category/getcategories"
  )
  return data.data // 👈 THIS IS THE KEY FIX
}

