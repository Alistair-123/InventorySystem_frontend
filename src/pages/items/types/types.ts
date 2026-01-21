export type MongoId = string;

/* ---------- Reference Types ---------- */

export interface CategoryRef {
  _id: MongoId;
  categoryName: string;
}

export interface BrandRef {
  _id: MongoId;
  brandName: string;
}

export interface UnitRef {
  _id: MongoId;
  unitName: string;
}

/* ---------- Item ---------- */

export interface Item {
  _id: MongoId;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  itemImage?: string;

  category: CategoryRef;
  brand: BrandRef;
  unit: UnitRef;

  createdAt: string;
  updatedAt: string;
}

/* ---------- Pagination ---------- */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ---------- Paginated Response ---------- */

export interface ItemsResponse {
  data: Item[];
  pagination: PaginationMeta;
}

/* ---------- Query Params ---------- */

export interface FetchItemsParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* ---------- Create ---------- */


export interface ReferenceDataResponse {
  categories: CategoryRef[];
  brands: BrandRef[];
  units: UnitRef[];
}
export interface CreateItemPayload {
  itemName: string;
  itemDescription?: string;
  category: MongoId;
  brand: MongoId;
  unit: MongoId;
  status: "active" | "inactive"
  itemImage?: FileList;
}
