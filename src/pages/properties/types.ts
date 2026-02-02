/* ============================
   COMMON
============================ */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ============================
   REFERENCE TYPES
============================ */
export interface Item {
  _id: string;
  itemId: string;
  itemName: string;
}

export interface Personnel {
  _id: string;
  personnelId: string;
  firstName: string;
  lastName: string;
}

export interface Office {
  _id: string;
  officeId: string;
  officeName: string;
}

export interface AcquisitionType {
  _id: string;
  acquisitionTypeId: string;
  acquisitionTypeName: string;
}

/* ============================
   PROPERTY
============================ */
export type PropertyStatus =
  | "serviceable"
  | "unserviceable"
  | "disposed"
  | "lost";

export interface Property {
  _id: string;
  propertyNo: string;
  item: Item;
  acquisitionDate: string;
  acquisitionType: AcquisitionType;
  acquisitionValue: number;
  personnel: Personnel;
  office: Office;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

/* ============================
   API RESPONSES
============================ */
export interface PropertyListResponse {
  data: Property[];
  pagination: Pagination;
}

export interface PropertyFormOptions {
  items: Item[];
  personnel: Personnel[];
  offices: Office[];
  acquisitionTypes: AcquisitionType[];
}
