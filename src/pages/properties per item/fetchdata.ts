import axiosInstance from "@/utils/axiosInstance";
import type { PropertiesPerItemResponse } from "./types";

export const fetchPropertiesPerItem = async (
  itemId: string,
  search: string,
  page: number,
  limit: number
): Promise<PropertiesPerItemResponse> => {
  const res = await axiosInstance.get(
    `/propertyitem/item/${itemId}?search=${search}&page=${page}&limit=${limit}`
  );

  return res.data;
};

export const fetchItemsWithTotals = async () => {
  const res = await axiosInstance.get(
    "/propertyitem/propertytotals"
  );

  return res.data.items;
};