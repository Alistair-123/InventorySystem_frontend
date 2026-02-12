// Enum type for Property Status
export type PropertyStatus =
  | "serviceable"
  | "unserviceable"
  | "disposed"
  | "lost";

// Item Reference
export interface Item {
  _id: string;
  name: string;
}

// Office Reference
export interface Office {
  _id: string;
  name: string;
}

// Personnel Reference
export interface Personnel {
  _id: string;
  name: string;
}

// Acquisition Type Reference
export interface AcquisitionType {
  _id: string;
  type: string;
}

// Main Property Model Type
export interface Property {
  _id: string;
  propertyNo: string;

  item: Item;
  acquisitionType: AcquisitionType;

  acquisitionDate: string;
  acquisitionValue: number;

  personnel: Personnel;
  office: Office;

  status: PropertyStatus;

  createdAt: string;
  updatedAt: string;
}

// API Response Type
export interface PropertyResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  count: number;
  properties: Property[];
}
