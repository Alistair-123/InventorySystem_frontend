import axiosInstance from "@/utils/axiosInstance";
import type {
  PersonnelPropertySummary,
  Property,
  PaginatedResponse,
} from "./types";

/*
|--------------------------------------------------------------------------
| Fetch Personnel Property Summary
|--------------------------------------------------------------------------
| Backend Route:
| GET /api/personnelproperty/properties-summary
|
| AxiosInstance already includes:
| baseURL = http://localhost:5000/api
|
| So we only call:
| /personnelproperty/properties-summary
|--------------------------------------------------------------------------
*/
export const fetchPersonnelPropertySummary = async (
  search: string = "",
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<PersonnelPropertySummary>> => {
  const response = await axiosInstance.get(
    "/personnelproperty/properties-summary",
    {
      params: { search, page, limit },
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Fetch Properties of One Personnel
|--------------------------------------------------------------------------
| Backend Route:
| GET /api/personnelproperty/:id/properties
|
| So we call:
| /personnelproperty/${id}/properties
|--------------------------------------------------------------------------
*/
export const fetchPersonnelProperties = async (
  personnelId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Property>> => {
  const response = await axiosInstance.get(
    `/personnelproperty/${personnelId}/properties`,
    {
      params: { page, limit },
    }
  );

  return response.data;
};
