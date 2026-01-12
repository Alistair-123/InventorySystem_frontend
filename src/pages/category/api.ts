import axiosInstance from "@/utils/axiosInstance"
import type { CreateCategoryPayload } from "./type"

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<CreateCategoryPayload> {
  
  const { data } = await axiosInstance.post<CreateCategoryPayload>(
    "/category/createcategory",
    payload
  )
  return data
}

