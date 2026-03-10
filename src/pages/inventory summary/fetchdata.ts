import type { PropertyResponse } from "./types"
import axiosInstance from "@/utils/axiosInstance"
interface FetchParams {
  page?: number
  limit?: number
  search?: string
}

export const fetchProperties = async ({
  page = 1,
  limit = 10,
  search = ""
}: FetchParams): Promise<PropertyResponse> => {

  const res = await axiosInstance.get<PropertyResponse>(
    "/inventorysummary/getpropdepreciation",
    {
      params: {
        page,
        limit,
        search
      }
    }
  )

  return res.data
}