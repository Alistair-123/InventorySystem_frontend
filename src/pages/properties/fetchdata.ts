import axiosInstance from "@/utils/axiosInstance"; // adjust path if needed
import type {
  Property,
  PropertyListResponse,
  PropertyFormOptions
} from "./types";

/* ============================
   GET FORM OPTIONS
============================ */
export const fetchPropertyFormOptions = async (): Promise<PropertyFormOptions> => {
  const { data } = await axiosInstance.get(
    "/property/form-options"
  );
  return data;
};

/* ============================
   GET PROPERTIES (SEARCH + PAGINATION)
============================ */
export const fetchProperties = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PropertyListResponse> => {
  const { data } = await axiosInstance.get(
    "/property/getproperties",
    { params }
  );
  return data;
};

/* ============================
   GET PROPERTY BY ID
============================ */
export const fetchPropertyById = async (id: string): Promise<Property> => {
  const { data } = await axiosInstance.get(
    `/property/getpropertybyid/${id}`
  );
  return data;
};

/* ============================
   CREATE PROPERTY
============================ */
export const createProperty = async (
  payload: Partial<Property>
): Promise<Property> => {
  const { data } = await axiosInstance.post(
    "/property/createproperty",
    payload
  );
  return data;
};

/* ============================
   UPDATE PROPERTY
============================ */
export const updateProperty = async (
  id: string,
  payload: Partial<Property>
): Promise<Property> => {
  const { data } = await axiosInstance.put(
    `/property/updateproperty/${id}`,
    payload
  );
  return data;
};

/* ============================
   DELETE PROPERTY
============================ */
export const deleteProperty = async (id: string): Promise<void> => {
  await axiosInstance.delete(
    `/property/deleteproperty/${id}`
  );
};
