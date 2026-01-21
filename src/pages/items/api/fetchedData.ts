import axiosInstance from "../../../utils/axiosInstance";
import type {
  ReferenceDataResponse,
  ItemsResponse,
  FetchItemsParams,
  CreateItemPayload,
  Item,
  MongoId
} from "../types/types";

/* ---------- Reference Data ---------- */
export const fetchReferenceData = async (): Promise<ReferenceDataResponse> => {
  const { data } = await axiosInstance.get<ReferenceDataResponse>(
    "/items/reference-data"
  );
  return data;
};

/* ---------- GET ITEMS (Pagination + Search) ---------- */
export const fetchItems = async (
  params: FetchItemsParams = {}
): Promise<ItemsResponse> => {
  const { data } = await axiosInstance.get<ItemsResponse>("/items/getitems", {
    params
  });
  return data;
};

/* ---------- GET SINGLE ITEM ---------- */
export const fetchItemById = async (id: MongoId): Promise<Item> => {
  const { data } = await axiosInstance.get<Item>(`/items/${id}`);
  return data;
};

/* ---------- CREATE ITEM ---------- */
export const createItem = async (payload: FormData): Promise<Item> => {
  const { data } = await axiosInstance.post<Item>(
    "/items/createitem",
    payload
  );
  return data;
};

/* ---------- UPDATE ITEM ---------- */
export const updateItem = async (
  id: MongoId,
  payload: FormData
): Promise<Item> => {
  const { data } = await axiosInstance.put<Item>(
    `/items/updateitem/${id}`,
    payload
  );
  return data;
};

/* ---------- DELETE ITEM ---------- */
export const deleteItem = async (id: MongoId): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/items/deleteitem/${id}`
  );
  return data;
};
