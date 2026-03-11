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

export const downloadPropertiesCSV = async (search: string = ""): Promise<void> => {
  const res = await axiosInstance.get("/inventorysummary/download/csv", {
    params: { search },
    responseType: "blob",
  })

  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement("a")
  a.href = url
  a.download = `properties_depreciation_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const downloadPropertiesPDF = async (search: string = ""): Promise<void> => {
  const res = await axiosInstance.get("/inventorysummary/download/pdf", {
    params: { search },
    responseType: "blob",
  })

  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement("a")
  a.href = url
  a.download = `properties_depreciation_${Date.now()}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}