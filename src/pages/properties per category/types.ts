/* =========================================================
   ✅ CATEGORY SUMMARY REPORT TYPES
   ========================================================= */

export interface CategorySummary {
     categoryId: string; // ✅ ADD THIS
  categoryName: string;
  total: number;
  serviceable: number;
  unserviceable: number;
  disposed: number;
  lost: number;
}

/* =========================================================
   ✅ POPULATED MODELS
   ========================================================= */

export interface Category {
  _id: string;
  categoryName: string;
}

export interface Item {
  _id: string;
  itemName: string;
  category?: Category;
}

export interface Office {
  _id: string;
  officeName: string;
}

export interface Personnel {
  _id: string;
  firstName: string;
  lastName: string;
}

/* =========================================================
   ✅ PROPERTY TYPE
   ========================================================= */

export interface Property {
  _id: string;
  propertyNo: string;

  item: Item;

  acquisitionDate: string;
  acquisitionValue: number;

  status: "serviceable" | "unserviceable" | "disposed" | "lost";

  office: Office;
  personnel: Personnel;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   ✅ PAGINATION RESPONSE TYPE
   ========================================================= */

export interface PaginatedPropertiesResponse {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  data: Property[];
}
