// ===============================
// Personnel Property Summary Type
// ===============================
export interface PersonnelPropertySummary {
  _id: string;
  personnelImage?: string;
  personnelId: string;
  fullName: string;
  designationName: string;
  status: "active" | "inactive";
  propertyCount: number;
}

// ===============================
// Property Item Type
// ===============================
export interface PropertyItem {
  _id: string;
  itemName: string;
}

// ===============================
// Office Type
// ===============================
export interface PropertyOffice {
  _id: string;
  officeName: string;
}

// ===============================
// Acquisition Type
// ===============================
export interface AcquisitionType {
  _id: string;
  typeName: string;
}

// ===============================
// Property Type (Detailed View)
// ===============================
export interface Property {
  _id: string;
  propertyNo: string;
  acquisitionDate: string;
  acquisitionValue: number;
  status: "serviceable" | "unserviceable" | "disposed" | "lost";

  item: PropertyItem;
  office: PropertyOffice;
  acquisitionType: AcquisitionType;
}

// ===============================
// Pagination Response Wrapper
// ===============================
export interface PaginatedResponse<T> {
  success: boolean;
  page: number;
  totalPages: number;
  totalPersonnels?: number;
  totalProperties?: number;
  data: T[];
}
