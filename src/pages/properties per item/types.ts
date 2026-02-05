// ===============================
// ITEM TYPES (Header Info)
// ===============================
export interface ItemCategory {
  _id: string;
  name: string;
}

export interface ItemBrand {
  _id: string;
  name: string;
}

export interface ItemUnit {
  _id: string;
  name: string;
}

export interface Item {
  _id: string;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  itemImage?: string;

  category: ItemCategory;
  brand: ItemBrand;
  unit: ItemUnit;

  createdAt: string;
  updatedAt: string;
}

// ===============================
// PROPERTY TYPES (Table Rows)
// ===============================
export interface AcquisitionType {
  _id: string;
  name: string;
}

export interface Personnel {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Office {
  _id: string;
  officeName: string;
}

export type PropertyStatus =
  | "serviceable"
  | "unserviceable"
  | "disposed"
  | "lost";

export interface Property {
  _id: string;
  propertyNo: string;

  acquisitionDate: string;
  acquisitionValue: number;

  acquisitionType: AcquisitionType;
  personnel: Personnel;
  office: Office;

  status: PropertyStatus;

  createdAt: string;
  updatedAt: string;
}

// ===============================
// API RESPONSE TYPE
// ===============================
export interface PropertiesPerItemResponse {
  item: Item;
  properties: Property[];
  pagination: Pagination;
}

export interface ItemWithTotals {
    _id: string;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  itemImage?: string;
  totalProperties: number;
}

export interface Pagination {
  totalProperties: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
